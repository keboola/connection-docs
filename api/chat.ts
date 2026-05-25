/**
 * /api/chat — proxies the Ask Kai widget to the Keboola docs MCP server.
 *
 * One path: call the docs MCP `docs_query` tool directly, stream its text
 * answer to the browser, then emit a `sources` event with the docs URLs so
 * the drawer can render them as chips.
 *
 * Request:  POST { message: string, sessionId?: string }
 * Response: text/event-stream
 *   data: {"type":"session","sessionId":"..."}
 *   data: {"type":"progress","label":"…"}
 *   data: {"type":"text-delta","text":"…"}
 *   data: {"type":"sources","items":[{ "url":"…", "label":"…" }]}
 *   data: {"type":"done"}
 *
 * Cold-start of the Keboola docs data app is handled with up to 3 retries
 * within a 15s budget — the function emits "Docs service is waking up…"
 * progress events between attempts.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = { runtime: 'nodejs' };

interface ChatRequest {
  message: string;
  sessionId?: string;
}

const MCP_URL =
  process.env.DOCS_MCP_URL ||
  'https://docs-mcp-43665566.hub.us-east4.gcp.keboola.com/mcp';

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

// ─── Minimal MCP Streamable-HTTP client ──────────────────────────────────

interface DocsAnswer {
  text: string;
  source_urls: string[];
}

async function mcpToolCall(
  toolName: string,
  args: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<DocsAnswer> {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    accept: 'application/json, text/event-stream',
  };

  const parseSseJson = (raw: string): any => {
    for (const line of raw.split('\n')) {
      if (line.startsWith('data: ')) return JSON.parse(line.slice(6));
    }
    return JSON.parse(raw);
  };

  // 1. initialize → captures the mcp-session-id header for subsequent calls.
  const initRes = await fetch(MCP_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'keboola-docs-beacon', version: '1.0.0' },
      },
    }),
    signal,
  });
  if (!initRes.ok) {
    throw new Error(`MCP initialize failed: HTTP ${initRes.status}`);
  }
  const sessionId = initRes.headers.get('mcp-session-id');
  if (!sessionId) throw new Error('MCP initialize returned no session id');

  const sessHeaders = { ...headers, 'mcp-session-id': sessionId };

  // 2. notifications/initialized — completes the handshake.
  await fetch(MCP_URL, {
    method: 'POST',
    headers: sessHeaders,
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'notifications/initialized',
      params: {},
    }),
    signal,
  });

  // 3. tools/call.
  const callRes = await fetch(MCP_URL, {
    method: 'POST',
    headers: sessHeaders,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: { name: toolName, arguments: args },
    }),
    signal,
  });
  if (!callRes.ok) {
    throw new Error(`MCP tools/call failed: HTTP ${callRes.status}`);
  }
  const raw = await callRes.text();
  const parsed = parseSseJson(raw);
  if (parsed?.error?.message) throw new Error(`MCP error: ${parsed.error.message}`);

  const innerText: string | undefined = parsed?.result?.content?.[0]?.text;
  if (!innerText) throw new Error('MCP returned no result content');

  let inner: { text?: string; source_urls?: string[] };
  try {
    inner = JSON.parse(innerText);
  } catch {
    return { text: innerText, source_urls: [] };
  }
  return {
    text: inner.text ?? '',
    source_urls: Array.isArray(inner.source_urls) ? inner.source_urls : [],
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

// ─── Direct-MCP handler ─────────────────────────────────────────────────

async function handleDirectMcp(message: string, res: VercelResponse) {
  setupSse(res);
  writeSse(res, { type: 'session', sessionId: `mcp-${Date.now()}` });
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
      answer = await mcpToolCall('docs_query', { query: message });
      break;
    } catch (e: any) {
      const msg = String(e?.message || '');
      const isColdStart =
        /HTTP 503/.test(msg) || /initialize failed/i.test(msg);
      if (!isColdStart || attempt >= maxAttempts) break;
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

// ─── Stub handler (used when DOCS_MCP_URL is empty) ─────────────────────

async function handleStub(message: string, res: VercelResponse) {
  setupSse(res);
  writeSse(res, { type: 'session', sessionId: 'stub' });
  const reply =
    `Ask Kai is wiring up. Once the docs MCP server is live, this widget ` +
    `will run your question — "${message.slice(0, 80)}" — against the live ` +
    `documentation. Until then, please use the search at the top of the sidebar.`;
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
    if (MCP_URL) {
      await handleDirectMcp(message, res);
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
