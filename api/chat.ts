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

async function readJsonBody(req: VercelRequest): Promise<ChatRequest> {
  if (req.body && typeof req.body === 'object') return req.body as ChatRequest;
  if (typeof req.body === 'string' && req.body) return JSON.parse(req.body);
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString('utf-8');
  return raw ? JSON.parse(raw) : { message: '' };
}

function writeSse(res: VercelResponse, data: unknown) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function setupSse(res: VercelResponse) {
  res.statusCode = 200;
  res.setHeader('content-type', 'text/event-stream; charset=utf-8');
  res.setHeader('cache-control', 'no-cache, no-transform');
  res.setHeader('connection', 'keep-alive');
  res.setHeader('x-accel-buffering', 'no');
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', 'content-type');
  res.setHeader('access-control-allow-methods', 'POST, OPTIONS');
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

  // DocsResponse: { response: string, metadata: { sources: string[] } }
  const data = (await res.json()) as {
    response?: string;
    metadata?: { sources?: string[] };
  };

  return {
    text: data.response ?? '',
    source_urls: Array.isArray(data.metadata?.sources)
      ? (data.metadata!.sources as string[])
      : [],
  };
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

async function handleDocsQuestion(message: string, res: VercelResponse) {
  setupSse(res);
  writeSse(res, { type: 'session', sessionId: `ai-${Date.now()}` });
  writeSse(res, {
    type: 'progress',
    label: `Searching docs for "${message.slice(0, 60)}"…`,
  });

  const startedAt = Date.now();
  const budgetMs = 15_000;
  const maxAttempts = 4;

  let answer: DocsAnswer | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (Date.now() - startedAt > budgetMs) break;
    try {
      answer = await askDocsQuestion(message);
      break;
    } catch (e: any) {
      const msg = String(e?.message || '');
      // Retry only on transient cold-start / upstream errors.
      const isTransient = /HTTP 5\d\d/.test(msg) || /fetch failed|ECONN|ETIMEDOUT/i.test(msg);
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
      .map((url) => ({ url, label: labelForUrl(url) }));
    writeSse(res, { type: 'sources', items });
  }

  writeSse(res, { type: 'done' });
  res.end();
}

// ─── Stub handler (used when the AI Service env isn't configured) ────────

async function handleStub(message: string, res: VercelResponse) {
  setupSse(res);
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
    res.setHeader('access-control-allow-origin', '*');
    res.setHeader('access-control-allow-headers', 'content-type');
    res.setHeader('access-control-allow-methods', 'POST, OPTIONS');
    res.setHeader('access-control-max-age', '86400');
    res.end();
    return;
  }
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let body: ChatRequest;
  try {
    body = await readJsonBody(req);
  } catch {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    return;
  }

  const message = (body.message || '').trim();
  if (!message) {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'message is required' }));
    return;
  }

  try {
    if (AI_SERVICE_URL && KBC_TOKEN) {
      await handleDocsQuestion(message, res);
    } else {
      await handleStub(message, res);
    }
  } catch (err: any) {
    if (res.headersSent) {
      writeSse(res, { type: 'error', message: err?.message ?? String(err) });
      writeSse(res, { type: 'done' });
      res.end();
    } else {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ error: err?.message ?? String(err) }));
    }
  }
}
