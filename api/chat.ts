/**
 * /api/chat — proxies the browser chat widget to the Keboola docs Managed Agent.
 *
 * Two modes, switched by env:
 *   - STUB MODE (when KAI_AGENT_ID is unset): returns a canned reply so the UI
 *     can be developed and deployed before the MCP server is live.
 *   - LIVE MODE (when KAI_AGENT_ID + KAI_VAULT_ID + ANTHROPIC_API_KEY are all set):
 *     creates or reuses a Managed Agents session, posts the user message as an
 *     event, and streams the agent's response back as SSE.
 *
 * Request:  POST { message: string, sessionId?: string }
 * Response: text/event-stream
 *   data: {"type":"session","sessionId":"..."}
 *   data: {"type":"text-delta","text":"..."}
 *   ...
 *   data: {"type":"done"}
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

export const config = { runtime: 'nodejs' };

interface ChatRequest {
  message: string;
  sessionId?: string;
}

async function readJsonBody(req: VercelRequest): Promise<ChatRequest> {
  // @vercel/node parses JSON bodies for us if content-type matches.
  if (req.body && typeof req.body === 'object') return req.body as ChatRequest;
  if (typeof req.body === 'string' && req.body) return JSON.parse(req.body);
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString('utf-8');
  if (!raw) return { message: '' };
  return JSON.parse(raw);
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
  // CORS: lets `astro dev` on localhost hit the deployed function directly
  // during local frontend iteration.
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', 'content-type');
  res.setHeader('access-control-allow-methods', 'POST, OPTIONS');
}

/**
 * Stub response while the MCP server isn't wired yet. Lets us deploy the UI
 * end-to-end and verify the widget plumbing works.
 */
async function handleStub(message: string, res: VercelResponse) {
  setupSse(res);
  writeSse(res, { type: 'session', sessionId: 'stub' });

  const reply =
    `Ask Kai is wiring up. Once the docs MCP server is live and the agent is ` +
    `registered, this widget will run your question — "${message.slice(0, 80)}" — ` +
    `against the live documentation and cite the relevant pages. Until then, ` +
    `please use the search at the top of the sidebar.`;

  // Simulate a streamed reply so the UI's incremental rendering path is exercised.
  for (const chunk of reply.match(/.{1,18}/g) ?? []) {
    writeSse(res, { type: 'text-delta', text: chunk });
    await new Promise((r) => setTimeout(r, 25));
  }
  writeSse(res, { type: 'done' });
  res.end();
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * The Keboola docs MCP server (a data app) scales to zero when idle, so the
 * first call after a quiet period fails with HTTP 503. Detect that specific
 * failure shape so we know to retry instead of surfacing the error.
 */
function isMcpColdStartError(message: string | undefined | null): boolean {
  if (!message) return false;
  return (
    /MCP server .* initialize failed/i.test(message) ||
    /upstream server error \(HTTP 503\)/i.test(message) ||
    /mcp_connection_failed/i.test(message)
  );
}

interface RunResult {
  /** Whether the session completed normally (agent.message received). */
  ok: boolean;
  /** Whether the failure was a recoverable MCP cold-start. */
  retryable: boolean;
  /** Session id used (so the client can reuse if we returned success). */
  sessionId: string | null;
}

async function runOneSession(
  client: Anthropic,
  agentId: string,
  environmentId: string,
  vaultId: string | null,
  message: string,
  reuseSessionId: string | undefined,
  res: VercelResponse,
  forwardProgress: boolean,
): Promise<RunResult> {
  let activeSessionId = reuseSessionId ?? null;
  if (!activeSessionId) {
    const session = await client.beta.sessions.create({
      agent: agentId,
      environment_id: environmentId,
      ...(vaultId ? { vault_ids: [vaultId] } : {}),
    } as any);
    activeSessionId = session.id;
  }

  const stream = await client.beta.sessions.events.stream(activeSessionId);
  await client.beta.sessions.events.send(activeSessionId, {
    events: [{ type: 'user.message', content: [{ type: 'text', text: message }] }],
  });

  let gotAgentMessage = false;

  for await (const event of stream as AsyncIterable<any>) {
    if (event.type === 'agent.thinking') {
      if (forwardProgress) writeSse(res, { type: 'progress', label: 'Thinking…' });
    } else if (event.type === 'agent.mcp_tool_use') {
      if (forwardProgress) {
        const q = event.input?.query;
        writeSse(res, {
          type: 'progress',
          label: q ? `Searching docs for "${String(q).slice(0, 60)}"…` : 'Searching docs…',
        });
      }
    } else if (event.type === 'agent.mcp_tool_result') {
      if (forwardProgress) {
        writeSse(res, {
          type: 'progress',
          label: event.is_error ? 'Retrying…' : 'Writing answer…',
        });
      }
      // If the tool result itself is an error and it's an MCP cold-start, bail
      // out so the outer loop can retry with a fresh session instead of letting
      // the agent draft a "the docs are down" reply on partial info.
      if (event.is_error && Array.isArray(event.content)) {
        const text = event.content.map((c: any) => c?.text || '').join(' ');
        if (isMcpColdStartError(text)) {
          return { ok: false, retryable: true, sessionId: activeSessionId };
        }
      }
    } else if (event.type === 'agent.message' && Array.isArray(event.content)) {
      gotAgentMessage = true;
      for (const block of event.content) {
        if (block.type === 'text' && typeof block.text === 'string') {
          writeSse(res, { type: 'text-delta', text: block.text });
        }
      }
    } else if (event.type === 'session.status_idle') {
      break;
    } else if (event.type === 'session.error') {
      const msg = event.error?.message ?? 'Agent error';
      if (isMcpColdStartError(msg) && !gotAgentMessage) {
        return { ok: false, retryable: true, sessionId: activeSessionId };
      }
      writeSse(res, { type: 'error', message: msg });
      return { ok: false, retryable: false, sessionId: activeSessionId };
    }
  }

  return { ok: gotAgentMessage, retryable: !gotAgentMessage, sessionId: activeSessionId };
}

async function handleLive(
  message: string,
  sessionId: string | undefined,
  res: VercelResponse,
) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const agentId = process.env.KAI_AGENT_ID!;
  const environmentId = process.env.KAI_ENVIRONMENT_ID!;
  const vaultId = process.env.KAI_VAULT_ID || null;

  setupSse(res);

  // The MCP data app may be cold; allow up to ~15s of retries before giving up.
  const startedAt = Date.now();
  const budgetMs = 15_000;
  const maxAttempts = 4;

  let lastSessionId: string | null = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (attempt === 1) {
      // First attempt — emit the session id once we have it.
    } else {
      writeSse(res, {
        type: 'progress',
        label: 'Docs service is waking up, retrying…',
      });
      const elapsed = Date.now() - startedAt;
      const remaining = budgetMs - elapsed;
      if (remaining <= 0) break;
      await sleep(Math.min(2000, Math.max(800, remaining / (maxAttempts - attempt + 1))));
    }

    const result = await runOneSession(
      client,
      agentId,
      environmentId,
      vaultId,
      message,
      // On retry, always start a fresh session — the previous one is dead-ended
      // on the MCP failure. Only the first attempt may reuse the client's id.
      attempt === 1 ? sessionId : undefined,
      res,
      attempt === 1, // only forward progress events on first attempt to avoid
                    // re-emitting "Thinking…" / "Searching…" multiple times
    );
    lastSessionId = result.sessionId;

    if (attempt === 1 && result.sessionId) {
      writeSse(res, { type: 'session', sessionId: result.sessionId });
    }

    if (result.ok) {
      writeSse(res, { type: 'done' });
      res.end();
      return;
    }
    if (!result.retryable) break;
  }

  // Out of retries.
  writeSse(res, {
    type: 'error',
    message:
      'The docs service did not respond in time. Try again in a few seconds — it may just be waking up.',
  });
  // Still expose the last session id so a follow-up turn can resume if the
  // service comes back.
  if (lastSessionId) {
    writeSse(res, { type: 'session', sessionId: lastSessionId });
  }
  writeSse(res, { type: 'done' });
  res.end();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS preflight for cross-origin POSTs during local dev.
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

  // Live mode requires the API key, an agent id, and an environment id.
  // A vault id is only needed when the MCP server is bearer-protected.
  const live = !!(
    process.env.KAI_AGENT_ID &&
    process.env.KAI_ENVIRONMENT_ID &&
    process.env.ANTHROPIC_API_KEY
  );

  try {
    if (live) {
      await handleLive(message, body.sessionId, res);
    } else {
      await handleStub(message, res);
    }
  } catch (err: any) {
    // If headers already sent (live SSE error), append an error frame; else
    // return a JSON error.
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
