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
 * What is kept: GET/HEAD requests on the production domain for
 *   - pages (a path ending in `/`, without an extension, or `.html`),
 *   - the Markdown twins (`/<slug>/index.md`, see src/integrations/page-markdown.mjs),
 *   - `/llms.txt` and `/llms-full.txt`.
 * Everything else is dropped here: assets (`/_astro/`, `/pagefind/`, images,
 * fonts), `/api/*` (this function's own invocations included, so the drain
 * cannot feed itself), preview deployments and build logs.
 *
 * What a record holds: time, path without the query string, status, cache
 * result, region, the user agent (capped), the referrer's host only, and an
 * HMAC of the client IP. The raw IP and the query string never leave this
 * function. With LOG_INGEST_IP_SALT unset the hash is empty rather than a
 * plain digest, which a table of IPv4 addresses would reverse.
 *
 * The drain posts batches; each batch goes to the stream as one body
 * `{ received_at, records: [...] }`, one stream row per batch. Keboola
 * flattens `records` into rows (one per request) in SQL.
 *
 * Env (set in the Vercel project):
 *   LOG_INGEST_SECRET    the drain's signature secret; every POST must carry a
 *                        matching `x-vercel-signature` (HMAC-SHA1 of the body)
 *   LOG_INGEST_URL       the Keboola Data Stream URL
 *   LOG_INGEST_TOKEN     optional bearer token for that endpoint
 *   LOG_INGEST_IP_SALT   key for the IP hash
 *
 * Without the secret or the URL every POST gets 503, so a drain pointed here
 * before setup fails visibly instead of passing unsigned data along.
 *
 * Request:  POST, the drain's JSON array or NDJSON body
 * Response: 200 when the batch was forwarded or had nothing to keep; 403 on a
 *           bad signature; 400 on a body that isn't log JSON; 502 when the
 *           stream refused it (the drain then reports failed deliveries).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, timingSafeEqual } from 'node:crypto';

// The signature covers the raw bytes, so Vercel must not parse the body first.
export const config = { runtime: 'nodejs', api: { bodyParser: false } };

const SECRET = (process.env.LOG_INGEST_SECRET || '').trim();
const INGEST_URL = (process.env.LOG_INGEST_URL || '').trim();
const INGEST_TOKEN = (process.env.LOG_INGEST_TOKEN || '').trim();
const IP_SALT = (process.env.LOG_INGEST_IP_SALT || '').trim();

/** Upstream calls must not hold the function until Vercel kills it. */
const UPSTREAM_TIMEOUT_MS = 5000;

/** Only the live site counts; previews and vercel.app aliases are tests. */
const SITE_HOST = 'help.keboola.com';

const MAX_UA = 512;
const MAX_PATH = 512;

/** The subset of a drain log entry this function reads. */
export interface DrainEntry {
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

/** HMAC of the client IP, short enough for a column; '' without a salt. */
export function hashIp(ip: string, salt = IP_SALT): string {
  if (!ip || !salt) return '';
  return createHmac('sha256', salt).update(ip).digest('hex').slice(0, 16);
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

  const path = p.path.split(/[?#]/)[0].slice(0, MAX_PATH);
  const kind = classifyPath(path);
  if (!kind) return null;

  const ua = Array.isArray(p.userAgent) ? p.userAgent[0] : p.userAgent;
  const ms = p.timestamp ?? entry.timestamp;
  return {
    ts: typeof ms === 'number' ? new Date(ms).toISOString() : '',
    kind,
    path,
    method,
    status: typeof p.statusCode === 'number' ? p.statusCode : null,
    cache: p.vercelCache || '',
    region: p.region || '',
    user_agent: typeof ua === 'string' ? ua.slice(0, MAX_UA) : '',
    referrer_host: p.referer ? hostOf(p.referer) : '',
    ip_hash: hashIp(p.clientIp || '', salt),
  };
}

/** The drain sends a JSON array or NDJSON; returns the entries or throws. */
export function parseBatch(raw: string): DrainEntry[] {
  const text = raw.trim();
  if (!text) return [];
  if (text.startsWith('[')) {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error('not an array');
    return parsed;
  }
  return text.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
}

/** Constant-time check of `x-vercel-signature` against the raw body. */
export function validSignature(raw: Buffer, header: unknown, secret = SECRET): boolean {
  if (!secret || typeof header !== 'string' || !header) return false;
  const expected = createHmac('sha1', secret).update(raw).digest('hex');
  return header.length === expected.length && timingSafeEqual(Buffer.from(header), Buffer.from(expected));
}

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  // With bodyParser off the stream is untouched. A string or Buffer body is
  // what a test (or a runtime that buffered it anyway) hands over.
  const pre = (req as any).rawBody ?? req.body;
  if (Buffer.isBuffer(pre)) return pre;
  if (typeof pre === 'string') return Buffer.from(pre, 'utf-8');
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

/** Forward one batch to the stream. */
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

function reply(res: VercelResponse, status: number, body?: unknown) {
  res.statusCode = status;
  if (body === undefined) {
    res.end();
    return;
  }
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return reply(res, 405, { error: 'Method not allowed' });
  if (!SECRET || !INGEST_URL) return reply(res, 503, { error: 'Log ingest is not configured' });

  const raw = await readRawBody(req);
  if (!validSignature(raw, req.headers['x-vercel-signature'])) {
    return reply(res, 403, { code: 'invalid_signature', error: "signature didn't match" });
  }

  let entries: DrainEntry[];
  try {
    entries = parseBatch(raw.toString('utf-8'));
  } catch {
    return reply(res, 400, { error: 'Invalid log body' });
  }

  const records = entries.map((e) => toRecord(e)).filter((r): r is TrafficRecord => r !== null);
  if (records.length === 0) return reply(res, 200, { kept: 0, received: entries.length });

  try {
    await postIngest(records);
  } catch (err: any) {
    console.error('[log-ingest] sink error:', err?.message ?? String(err));
    return reply(res, 502, { error: 'Ingest failed' });
  }
  return reply(res, 200, { kept: records.length, received: entries.length });
}
