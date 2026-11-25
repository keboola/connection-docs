/**
 * /api/log-ingest — receives the Vercel log drain for help.keboola.com and
 * forwards the page requests to a Keboola Data Stream.
 *
 * Why: support wants to know how much of the docs traffic is people and how
 * much is AI agents (Linear ACO-432). Google Analytics only sees browsers that
 * run its script and accept cookies, and Vercel Observability keeps its bot
 * breakdown for 24 hours, verified bots only. Request logs carry the user
 * agent, so the split is made from them, downstream in Keboola.
 *
 * What is kept: GET/HEAD requests on the production domain, answered with
 * anything but a redirect, for
 *   - pages (a path ending in `/`, without an extension, or `.html`),
 *   - the Markdown twins (`/<slug>/index.md`, see src/integrations/page-markdown.mjs),
 *   - `/llms.txt` and `/llms-full.txt`.
 * Everything else is dropped here: assets (`/_astro/`, `/pagefind/`, images,
 * fonts), `/api/*`, preview deployments, build logs, and 3xx answers (with
 * `trailingSlash: 'always'` every slashless URL is a 308 followed by the real
 * request, which would count the visit twice).
 *
 * The drain itself must be limited to the `static` source. Every delivery
 * invokes this function, and its invocation logs would otherwise be delivered
 * again, so the drain would never go idle. Filtering `/api/*` here keeps those
 * lines out of the data but cannot stop the deliveries.
 *
 * What a record holds: the drain entry id (a retried batch arrives again, so
 * the consumer keeps one row per id), time, path without the query string,
 * status, cache result, region, the user agent (capped), the referrer's host
 * only, and an HMAC of the client IP. The HMAC key changes every month, so a
 * visitor can be followed within a month and not beyond. The raw IP and the
 * query string never leave this function.
 *
 * Records go to the stream in bodies of up to CHUNK_SIZE as
 * `{ received_at, records: [...] }`, one stream row per body. Keboola flattens
 * `records` into rows (one per request) in SQL.
 *
 * Env (set in the Vercel project), all required:
 *   LOG_INGEST_SECRET    the drain's signature secret; every POST must carry a
 *                        matching `x-vercel-signature` (HMAC-SHA1 of the body)
 *   LOG_INGEST_URL       the Keboola Data Stream URL
 *   LOG_INGEST_IP_SALT   key for the IP hash
 *   LOG_INGEST_TOKEN     optional bearer token for the stream
 *
 * Without the three required ones every POST gets 503, so a drain pointed here
 * before setup fails visibly instead of passing data along half-processed.
 *
 * Request:  POST, the drain's JSON array or NDJSON body, gzipped or not
 * Response: 200 when the batch was forwarded or had nothing to keep; 403 on a
 *           bad signature; 400 on a body that isn't log JSON; 405 on another
 *           method; 502 when the stream refused a chunk (the drain retries).
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { gunzipSync } from 'node:zlib';

export const config = { runtime: 'nodejs' };

const SECRET = (process.env.LOG_INGEST_SECRET || '').trim();
const INGEST_URL = (process.env.LOG_INGEST_URL || '').trim();
const INGEST_TOKEN = (process.env.LOG_INGEST_TOKEN || '').trim();
const IP_SALT = (process.env.LOG_INGEST_IP_SALT || '').trim();

/** Upstream calls must not hold the function until Vercel kills it. */
const UPSTREAM_TIMEOUT_MS = 5000;

/** Records per stream request; keeps a burst under the stream's body limit. */
export const CHUNK_SIZE = 500;

/** Only the live site counts; previews and vercel.app aliases are tests. */
const SITE_HOST = 'help.keboola.com';

const MAX_UA = 512;
const MAX_PATH = 512;

/** The subset of a drain log entry this function reads. */
export interface DrainEntry {
  id?: string;
  source?: string;
  environment?: string;
  timestamp?: number;
  proxy?: {
    timestamp?: number;
    method?: string;
    host?: string;
    path?: string;
    userAgent?: string[] | string;
    referer?: string;
    region?: string;
    statusCode?: number;
    clientIp?: string;
    vercelCache?: string;
  };
}

export type RequestKind = 'page' | 'markdown' | 'llms';

export interface TrafficRecord {
  id: string;
  ts: string;
  kind: RequestKind;
  path: string;
  method: string;
  status: number | null;
  cache: string;
  region: string;
  user_agent: string;
  referrer_host: string;
  ip_hash: string;
}

/** Is this a request we count, and as what? Expects a path without the query. */
export function classifyPath(path: string): RequestKind | null {
  if (path === '/llms.txt' || path === '/llms-full.txt') return 'llms';
  if (/^\/(?:api|_astro|_vercel|pagefind)(?:\/|$)/.test(path)) return null;
  if (path.endsWith('.md')) return 'markdown';
  const last = path.slice(path.lastIndexOf('/') + 1);
  if (last === '' || !last.includes('.') || last.endsWith('.html')) return 'page';
  return null;
}

/** HMAC of the client IP under this month's key; short enough for a column. */
export function hashIp(ip: string, salt: string, when: Date): string {
  if (!ip || !salt) return '';
  const month = when.toISOString().slice(0, 7);
  return createHmac('sha256', `${salt}|${month}`).update(ip).digest('hex').slice(0, 16);
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return '';
  }
}

/** Build a record from one drain entry, or null if it isn't a request we keep. */
export function toRecord(entry: DrainEntry, salt = IP_SALT): TrafficRecord | null {
  const p = entry?.proxy;
  if (!p || typeof p.path !== 'string') return null;
  if (entry.environment && entry.environment !== 'production') return null;
  if (p.host !== SITE_HOST) return null;
  const method = (p.method || '').toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') return null;
  if (typeof p.statusCode === 'number' && p.statusCode >= 300 && p.statusCode < 400) return null;

  const path = p.path.split(/[?#]/)[0].slice(0, MAX_PATH);
  const kind = classifyPath(path);
  if (!kind) return null;

  const ua = Array.isArray(p.userAgent) ? p.userAgent[0] : p.userAgent;
  const ms = p.timestamp ?? entry.timestamp;
  const when = typeof ms === 'number' ? new Date(ms) : null;
  return {
    id: typeof entry.id === 'string' ? entry.id : '',
    ts: when ? when.toISOString() : '',
    kind,
    path,
    method,
    status: typeof p.statusCode === 'number' ? p.statusCode : null,
    cache: p.vercelCache || '',
    region: p.region || '',
    user_agent: typeof ua === 'string' ? ua.slice(0, MAX_UA) : '',
    referrer_host: p.referer ? hostOf(p.referer) : '',
    ip_hash: hashIp(p.clientIp || '', salt, when ?? new Date()),
  };
}

/**
 * The drain sends a JSON array or NDJSON. A broken array is unusable (400),
 * but one bad NDJSON line costs only that line, not the batch.
 */
export function parseBatch(raw: string): { entries: DrainEntry[]; skipped: number } {
  const text = raw.trim();
  if (!text) return { entries: [], skipped: 0 };
  if (text.startsWith('[')) {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error('not an array');
    return { entries: parsed, skipped: 0 };
  }
  const entries: DrainEntry[] = [];
  let skipped = 0;
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    try {
      entries.push(JSON.parse(line));
    } catch {
      skipped += 1;
    }
  }
  if (entries.length === 0) throw new Error('no parsable line');
  return { entries, skipped };
}

/** Constant-time check of `x-vercel-signature` against the given bytes. */
export function validSignature(body: Buffer, header: string | null, secret = SECRET): boolean {
  // Shape first: timingSafeEqual throws on buffers of unequal length, and a
  // non-hex header could match in characters but not in bytes.
  if (!secret || !header || !/^[0-9a-f]{40}$/i.test(header)) return false;
  const expected = createHmac('sha1', secret).update(body).digest('hex');
  return timingSafeEqual(Buffer.from(header.toLowerCase()), Buffer.from(expected));
}

/**
 * The signed bytes of the batch, decompressed. Which bytes a gzipped delivery
 * signs is not documented, so both the received and the inflated body are
 * accepted. Returns null when neither matches.
 */
export function verifiedBody(received: Buffer, encoding: string | null, signature: string | null, secret = SECRET): Buffer | null {
  const gzipped = (encoding || '').toLowerCase().includes('gzip') || (received[0] === 0x1f && received[1] === 0x8b);
  let inflated: Buffer | null = null;
  if (gzipped) {
    try {
      inflated = gunzipSync(received);
    } catch {
      inflated = null;
    }
  }
  if (validSignature(received, signature, secret)) return inflated ?? received;
  if (inflated && validSignature(inflated, signature, secret)) return inflated;
  return null;
}

/** Forward one chunk to the stream. */
async function postIngest(records: TrafficRecord[]): Promise<void> {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (INGEST_TOKEN) headers.authorization = `Bearer ${INGEST_TOKEN}`;

  const res = await fetch(INGEST_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ received_at: new Date().toISOString(), records }),
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`log ingest failed: HTTP ${res.status}`);
  }
}

export async function handle(request: Request): Promise<Response> {
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
  if (!SECRET || !INGEST_URL || !IP_SALT) {
    return Response.json({ error: 'Log ingest is not configured' }, { status: 503 });
  }

  // The raw bytes, never a parsed body: the signature covers exactly these.
  const received = Buffer.from(await request.arrayBuffer());
  const body = verifiedBody(received, request.headers.get('content-encoding'), request.headers.get('x-vercel-signature'));
  if (!body) return Response.json({ code: 'invalid_signature', error: "signature didn't match" }, { status: 403 });

  let batch: { entries: DrainEntry[]; skipped: number };
  try {
    batch = parseBatch(body.toString('utf-8'));
  } catch {
    return Response.json({ error: 'Invalid log body' }, { status: 400 });
  }
  if (batch.skipped) console.warn(`[log-ingest] skipped ${batch.skipped} unparsable line(s)`);

  const records = batch.entries.map((e) => toRecord(e)).filter((r): r is TrafficRecord => r !== null);
  const summary = { kept: records.length, received: batch.entries.length, skipped: batch.skipped };
  if (records.length === 0) return Response.json(summary);

  const chunks: TrafficRecord[][] = [];
  for (let i = 0; i < records.length; i += CHUNK_SIZE) chunks.push(records.slice(i, i + CHUNK_SIZE));
  const results = await Promise.allSettled(chunks.map(postIngest));
  const failed = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
  if (failed.length) {
    // The drain retries the whole batch; ids let the consumer drop the chunks
    // that did arrive.
    console.error('[log-ingest] sink error:', failed[0].reason?.message ?? String(failed[0].reason));
    return Response.json({ error: 'Ingest failed', failed_chunks: failed.length, chunks: chunks.length }, { status: 502 });
  }
  return Response.json(summary);
}

export default { fetch: handle };
