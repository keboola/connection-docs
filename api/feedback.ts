/**
 * /api/feedback — receives documentation feedback from the page widget and
 * forwards it to a Keboola ingestion endpoint (intended to be a Data Stream
 * that lands each submission as a row in a Storage table).
 *
 * Mirrors api/chat.ts conventions: plain JSON handler, permissive CORS, a GET
 * `{ enabled }` probe so the static frontend can decide whether to render the
 * widget, and a stub mode when the ingestion env isn't configured yet (so the
 * site can ship before the stream exists).
 *
 * Optional env (set in the Vercel project):
 *   FEEDBACK_INGEST_URL     ingestion endpoint (e.g. a Keboola Data Stream URL)
 *   FEEDBACK_INGEST_TOKEN   optional bearer token for that endpoint
 *
 * Request:  POST { verdict: 'up'|'down', reason?, comment?, path, title?,
 *                  abandoned?, hp? }
 * Response: 204 No Content on success (or when silently dropped);
 *           400 on invalid payload.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = { runtime: 'nodejs' };

const INGEST_URL = (process.env.FEEDBACK_INGEST_URL || '').trim();
const INGEST_TOKEN = (process.env.FEEDBACK_INGEST_TOKEN || '').trim();

// Keep in sync with the reasons offered in Feedback.astro. Unknown reasons are
// dropped rather than rejected, so tweaking the UI never 400s a submission.
const ALLOWED_REASONS = new Set([
  // 👍 "What did you like?"
  'accurate',
  'solved-problem',
  'easy-to-understand',
  'helped-decide',
  // 👎 "What could be better?"
  'inaccurate',
  'hard-to-understand',
  'missing-info',
  'didnt-solve',
  // shared
  'another-reason',
]);

const MAX_COMMENT = 1000;
const MAX_FIELD = 512;

interface FeedbackBody {
  verdict?: unknown;
  reason?: unknown;
  comment?: unknown;
  path?: unknown;
  title?: unknown;
  abandoned?: unknown;
  hp?: unknown; // honeypot — must be empty
}

interface FeedbackRecord {
  submission_id: string;
  verdict: 'up' | 'down';
  reason: string;
  comment: string;
  path: string;
  title: string;
  locale: string;
  referrer: string;
  user_agent: string;
  abandoned: boolean;
  ts: string;
}

function setCors(res: VercelResponse) {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', 'content-type');
  res.setHeader('access-control-allow-methods', 'POST, OPTIONS');
}

async function readJsonBody(req: VercelRequest): Promise<FeedbackBody> {
  if (req.body && typeof req.body === 'object') return req.body as FeedbackBody;
  if (typeof req.body === 'string' && req.body) return JSON.parse(req.body);
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString('utf-8');
  return raw ? JSON.parse(raw) : {};
}

/** Coerce to a trimmed string capped at `max` chars; non-strings → ''. */
function str(v: unknown, max = MAX_FIELD): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/** Build a validated record, or null if the payload is unusable / dropped. */
function buildRecord(body: FeedbackBody, req: VercelRequest): FeedbackRecord | null {
  // Honeypot: real users never fill this hidden field. Bots do — drop silently.
  if (str(body.hp)) return null;

  const verdict = body.verdict === 'up' || body.verdict === 'down' ? body.verdict : null;
  if (!verdict) return null;

  const path = str(body.path);
  if (!path.startsWith('/')) return null;

  const reasonRaw = str(body.reason, 64).toLowerCase();
  const reason = ALLOWED_REASONS.has(reasonRaw) ? reasonRaw : '';

  return {
    submission_id: `fb-${Date.now()}-${Math.round(Math.random() * 1e9).toString(36)}`,
    verdict,
    reason,
    comment: str(body.comment, MAX_COMMENT),
    path,
    title: str(body.title),
    locale: str((req.headers['accept-language'] as string) || '', 32),
    referrer: str((req.headers['referer'] as string) || ''),
    user_agent: str((req.headers['user-agent'] as string) || ''),
    abandoned: body.abandoned === true,
    ts: new Date().toISOString(),
  };
}

/** Forward the record to the ingestion endpoint. No-op (stub) when unconfigured. */
async function ingest(record: FeedbackRecord): Promise<void> {
  if (!INGEST_URL) {
    // Stub mode: nothing wired up yet. Log so it's visible in Vercel and return.
    console.log('[feedback] (stub, no FEEDBACK_INGEST_URL)', JSON.stringify(record));
    return;
  }
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (INGEST_TOKEN) headers.authorization = `Bearer ${INGEST_TOKEN}`;

  const res = await fetch(INGEST_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(record),
  });
  if (!res.ok) {
    throw new Error(`feedback ingest failed: HTTP ${res.status}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    setCors(res);
    res.setHeader('access-control-max-age', '86400');
    res.end();
    return;
  }

  // Probe: lets the static frontend decide whether to render the widget.
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    setCors(res);
    res.setHeader('cache-control', 'no-store');
    // Enabled even in stub mode: the widget still works (submissions are logged
    // server-side) and starts collecting the moment the stream env is set.
    res.end(JSON.stringify({ enabled: true }));
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  setCors(res);

  let body: FeedbackBody;
  try {
    body = await readJsonBody(req);
  } catch {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    return;
  }

  const record = buildRecord(body, req);
  if (!record) {
    // Invalid or honeypot-tripped: 204 either way (don't teach bots the rules).
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    await ingest(record);
  } catch (err: any) {
    // Don't surface ingestion failures to the widget — the user already got
    // their "thanks". Log for ops and return 202 (accepted, best-effort).
    console.error('[feedback] ingest error:', err?.message ?? String(err));
    res.statusCode = 202;
    res.end();
    return;
  }

  res.statusCode = 204;
  res.end();
}
