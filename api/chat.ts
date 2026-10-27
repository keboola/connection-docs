/**
 * /api/chat — proxies the Ask Kai widget to the Keboola AI Service.
 *
 * Calls the AI Service `POST /docs/question` endpoint directly (one request),
 * streams its answer to the browser, then emits a `sources` event with the
 * docs URLs so the drawer can render them as chips.
 *
 * This replaces the previous Keboola docs MCP integration: the MCP required a
 * 3-step initialize/notify/tools-call handshake against a data app that cold-
 * starts and turns off — a plain API call is faster, cheaper, and more reliable.
 *
 * Required env (set in the Vercel project):
 *   AI_SERVICE_URL          base URL of the Keboola AI Service
 *   KBC_STORAGE_API_TOKEN   Storage API token (sent as X-StorageApi-Token)
 *
 * Request:  POST { message: string, sessionId?: string }
 * Response: text/event-stream
 *   data: {"type":"session","sessionId":"..."}
 *   data: {"type":"progress","label":"…"}
 *   data: {"type":"text-delta","text":"…"}
 *   data: {"type":"sources","items":[{ "url":"…", "label":"…" }]}
 *   data: {"type":"done"}
 *
 * Cold-start of the AI Service is handled with retries within a 15s budget —
 * the function emits "waking up…" progress events between attempts.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = { runtime: 'nodejs' };

interface ChatRequest {
  message: string;
  sessionId?: string;
}

// AI Service: POST {AI_SERVICE_URL}/docs/question  (auth: X-StorageApi-Token)
const AI_SERVICE_URL = (process.env.AI_SERVICE_URL || '').replace(/\/$/, '');
const KBC_TOKEN = process.env.KBC_STORAGE_API_TOKEN || '';

// ─── HTTP / SSE plumbing ─────────────────────────────────────────────────

async function readJsonBody(req: VercelRequest): Promise<unknown> {
  // Vercel has already parsed a JSON body, including `null` or a bare number;
  // the caller decides what is a valid request.
  if (req.body !== undefined && typeof req.body !== 'string') return req.body;
  if (typeof req.body === 'string' && req.body) return JSON.parse(req.body);
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString('utf-8');
  return raw ? JSON.parse(raw) : { message: '' };
}

// Longest question the widget will forward upstream — the proxy runs on a
// shared Storage token, so don't let arbitrary payload sizes burn AI quota.
// Keep in sync with the textarea's maxlength in src/components/AskKaiDrawer.astro
// (scripts/chat-handler.test.ts checks it).
export const MAX_MESSAGE_CHARS = 2_000;

/**
 * Origins allowed to call this proxy from a browser: the same allowlist as
 * api/feedback.ts.
 *
 * Production and preview builds call `/api/chat` same-origin (AskKaiDrawer's
 * apiBase is empty), and same-origin requests need no CORS header at all. The
 * only cross-origin caller is `astro dev` on localhost, which points apiBase at
 * a deployed function. No *.vercel.app pattern belongs here: anyone can deploy
 * a page there, and it would get to script this shared-token proxy.
 */
const ALLOWED_ORIGIN = /^https:\/\/help\.keboola\.com$|^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/;

function corsOrigin(req: VercelRequest): string | null {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : '';
  return origin && ALLOWED_ORIGIN.test(origin) ? origin : null;
}

function setCors(req: VercelRequest, res: VercelResponse) {
  const origin = corsOrigin(req);
  if (!origin) return;
  res.setHeader('access-control-allow-origin', origin);
  res.setHeader('vary', 'origin');
  res.setHeader('access-control-allow-headers', 'content-type');
  res.setHeader('access-control-allow-methods', 'POST, OPTIONS');
}

/**
 * Per-IP question limit. CORS is a browser control and stops nothing from curl,
 * and every question spends AI quota on the shared Storage token.
 *
 * The counters live in one function instance, so they are a backstop, not the
 * limit: a Vercel Firewall rule on /api/chat is what holds across instances.
 * What this guarantees is that one warm instance can't be looped for free.
 * Same pattern as api/feedback.ts (clientIp / allowIssue).
 */
const IP_WINDOW_MS = 10 * 60 * 1000;
const IP_MAX_QUESTIONS = 20;
const ipHits = new Map<string, number[]>();

function clientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim();
  return first || 'unknown';
}

export function allowQuestion(ip: string, now = Date.now()): boolean {
  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS);
  if (recent.length >= IP_MAX_QUESTIONS) {
    ipHits.set(ip, recent);
    return false;
  }
  recent.push(now);
  ipHits.set(ip, recent);
  // Keep the map from growing without bound on a long-lived instance.
  if (ipHits.size > 10_000) {
    for (const [k, v] of ipHits) if (!v.some((t) => now - t < IP_WINDOW_MS)) ipHits.delete(k);
  }
  return true;
}

function writeSse(res: VercelResponse, data: unknown) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function setupSse(req: VercelRequest, res: VercelResponse) {
  res.statusCode = 200;
  res.setHeader('content-type', 'text/event-stream; charset=utf-8');
  res.setHeader('cache-control', 'no-cache, no-transform');
  res.setHeader('connection', 'keep-alive');
  res.setHeader('x-accel-buffering', 'no');
  setCors(req, res);
}

// ─── AI Service client ───────────────────────────────────────────────────

interface DocsAnswer {
  text: string;
  source_urls: string[];
}

/** Call POST {AI_SERVICE_URL}/docs/question and normalize the response. */
async function askDocsQuestion(
  query: string,
  signal?: AbortSignal,
): Promise<DocsAnswer> {
  const res = await fetch(`${AI_SERVICE_URL}/docs/question`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      'X-StorageApi-Token': KBC_TOKEN,
    },
    body: JSON.stringify({ query }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`AI Service /docs/question failed: HTTP ${res.status}`);
  }

  // DocsResponse: { text: string, sourceUrls: string[] }.
  // (An earlier build expected { response, metadata.sources }; the live AI
  //  Service returns { text, sourceUrls } — read those, but tolerate the old
  //  shape too so a future revert on either side doesn't silently blank Kai.)
  const data = (await res.json()) as {
    text?: string;
    sourceUrls?: string[];
    response?: string;
    metadata?: { sources?: string[] };
  };

  const sources = data.sourceUrls ?? data.metadata?.sources;
  return {
    text: data.text ?? data.response ?? '',
    source_urls: Array.isArray(sources) ? sources : [],
  };
}

// ─── Source URL normalization ────────────────────────────────────────────

/**
 * The AI Service indexes docs by their GitHub repo file paths, so it returns
 * source URLs like
 *   https://help.keboola.com/connection-docs/src/content/docs/storage
 * instead of the published page URL
 *   https://help.keboola.com/storage/
 * which 404s. Strip the repo-path prefix and normalize to the published form.
 *
 * Idempotent: URLs that don't carry the prefix (or live on another host such as
 * developers.keboola.com / components.keboola.com) are returned unchanged, so
 * this becomes a no-op once the upstream index is fixed.
 */
function normalizeSourceUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname !== 'help.keboola.com') return url;

    // Match an optional leading `/connection-docs` then `/src/content/docs`.
    const prefix = /^\/(?:connection-docs\/)?src\/content\/docs\//;
    if (!prefix.test(u.pathname)) return url;

    let path = u.pathname.replace(prefix, '');
    // Defensive: drop a trailing `/index` and any markdown extension.
    path = path.replace(/\.mdx?$/i, '').replace(/\/index$/i, '');
    // Exactly one leading + trailing slash.
    path = '/' + path.replace(/^\/+|\/+$/g, '') + '/';

    return `https://help.keboola.com${path}`;
  } catch {
    return url;
  }
}

// ─── Source label helpers ────────────────────────────────────────────────

/**
 * Turn the last path segment of a docs URL into a Title Case label.
 * Examples:
 *   https://help.keboola.com/storage/           → "Storage"
 *   https://help.keboola.com/flows/conditional/ → "Conditional"
 *   https://components.keboola.com/components/keboola.flow → "Keboola.flow"
 *   https://help.keboola.com/                   → "Help"
 */
function labelForUrl(url: string): string {
  try {
    const u = new URL(url);
    const segments = u.pathname.split('/').filter(Boolean);
    const slug = segments[segments.length - 1] || u.hostname.split('.')[0];
    return slug
      .replace(/[-_]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  } catch {
    return url;
  }
}

// ─── Docs-question handler ───────────────────────────────────────────────

async function handleDocsQuestion(
  req: VercelRequest,
  message: string,
  res: VercelResponse,
) {
  setupSse(req, res);
  writeSse(res, { type: 'session', sessionId: `ai-${Date.now()}` });
  writeSse(res, {
    type: 'progress',
    label: `Searching docs for "${message.slice(0, 60)}"…`,
  });

  const startedAt = Date.now();
  const budgetMs = 15_000;
  const maxAttempts = 4;

  let answer: DocsAnswer | null = null;

  // The reader closed the drawer, sent a new question, or left the page: stop
  // spending the shared token on an answer nobody will read.
  const clientGone = new AbortController();
  res.on('close', () => {
    if (!res.writableFinished) clientGone.abort();
  });

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (clientGone.signal.aborted) break;
    const remainingBudget = budgetMs - (Date.now() - startedAt);
    if (remainingBudget <= 0) break;
    try {
      // Abort the in-flight fetch when the remaining budget runs out — without
      // this, one hung upstream connection blows straight past the 15s budget.
      answer = await askDocsQuestion(
        message,
        AbortSignal.any([clientGone.signal, AbortSignal.timeout(remainingBudget)]),
      );
      break;
    } catch (e: any) {
      const msg = String(e?.message || e?.name || '');
      // The per-attempt timeout is the whole remaining budget, so a timeout
      // or abort means there is no time left to retry in: stop instead of
      // announcing a retry that can't happen.
      if (e?.name === 'TimeoutError' || e?.name === 'AbortError') break;
      // Retry only on transient cold-start / upstream errors.
      const isTransient =
        /HTTP 5\d\d/.test(msg) || /fetch failed|ECONN|ETIMEDOUT/i.test(msg);
      if (!isTransient || attempt >= maxAttempts) break;
      writeSse(res, {
        type: 'progress',
        label: 'Docs service is waking up, retrying…',
      });
      const remaining = budgetMs - (Date.now() - startedAt);
      if (remaining <= 0) break;
      await new Promise((r) =>
        setTimeout(r, Math.min(2000, Math.max(500, remaining / 4))),
      );
    }
  }

  if (clientGone.signal.aborted) {
    res.end();
    return;
  }

  if (!answer) {
    writeSse(res, {
      type: 'error',
      message:
        'The docs service didn’t respond in time. Try again in a few seconds — it may just be waking up.',
    });
    writeSse(res, { type: 'done' });
    res.end();
    return;
  }

  writeSse(res, { type: 'progress', label: 'Writing answer…' });
  writeSse(res, { type: 'text-delta', text: answer.text.trim() });

  if (answer.source_urls.length) {
    const items = answer.source_urls
      .slice(0, 6)
      .map((raw) => {
        const url = normalizeSourceUrl(raw);
        return { url, label: labelForUrl(url) };
      });
    writeSse(res, { type: 'sources', items });
  }

  writeSse(res, { type: 'done' });
  res.end();
}

// ─── Stub handler (used when the AI Service env isn't configured) ────────

async function handleStub(
  req: VercelRequest,
  message: string,
  res: VercelResponse,
) {
  setupSse(req, res);
  writeSse(res, { type: 'session', sessionId: 'stub' });
  const reply =
    `Ask Kai is wiring up. Once the AI Service env (AI_SERVICE_URL + ` +
    `KBC_STORAGE_API_TOKEN) is configured, this widget will run your question ` +
    `— "${message.slice(0, 80)}" — against the live documentation. Until then, ` +
    `please use the search at the top of the sidebar.`;
  for (const chunk of reply.match(/.{1,18}/g) ?? []) {
    writeSse(res, { type: 'text-delta', text: chunk });
    await new Promise((r) => setTimeout(r, 25));
  }
  writeSse(res, { type: 'done' });
  res.end();
}

// ─── Entry point ────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    setCors(req, res);
    res.setHeader('access-control-max-age', '86400');
    res.end();
    return;
  }
  // Lightweight config probe: lets the static frontend decide whether to show
  // the Ask Kai entry points (it can't see server env vars otherwise).
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    setCors(req, res);
    res.setHeader('cache-control', 'no-store');
    res.end(JSON.stringify({ enabled: Boolean(AI_SERVICE_URL && KBC_TOKEN) }));
    return;
  }
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let body: unknown;
  try {
    body = await readJsonBody(req);
  } catch {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    return;
  }

  // A JSON body of `null`, a number, or a non-string `message` is a bad
  // request, not a crash: these lines run outside the try/catch below.
  const raw = body && typeof body === 'object' ? (body as ChatRequest).message : undefined;
  const message = typeof raw === 'string' ? raw.trim() : '';
  if (!message) {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'message is required' }));
    return;
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json');
    res.end(
      JSON.stringify({
        error: `message is too long (max ${MAX_MESSAGE_CHARS} characters)`,
      }),
    );
    return;
  }

  if (!allowQuestion(clientIp(req))) {
    console.warn('[chat] per-IP rate limit hit');
    res.statusCode = 429;
    res.setHeader('content-type', 'application/json');
    res.setHeader('retry-after', String(IP_WINDOW_MS / 1000));
    setCors(req, res);
    res.end(
      JSON.stringify({
        error: 'Too many questions in a short time. Wait a few minutes and try again.',
      }),
    );
    return;
  }

  try {
    if (AI_SERVICE_URL && KBC_TOKEN) {
      await handleDocsQuestion(req, message, res);
    } else {
      await handleStub(req, message, res);
    }
  } catch (err: any) {
    // Log the real error server-side; never echo internals to the client.
    console.error('chat handler failed:', err);
    const generic = 'Something went wrong answering your question. Please try again.';
    if (res.headersSent) {
      writeSse(res, { type: 'error', message: generic });
      writeSse(res, { type: 'done' });
      res.end();
    } else {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ error: generic }));
    }
  }
}
