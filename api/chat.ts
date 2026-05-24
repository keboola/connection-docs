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

  // Reuse session if the client passed one, else create a fresh one.
  let activeSessionId = sessionId;
  if (!activeSessionId) {
    const session = await client.beta.sessions.create({
      agent: agentId,
      environment_id: environmentId,
      ...(vaultId ? { vault_ids: [vaultId] } : {}),
    } as any);
    activeSessionId = session.id;
  }
  writeSse(res, { type: 'session', sessionId: activeSessionId });

  // Subscribe to the agent's event stream BEFORE sending the user event, so we
  // don't miss the first delta.
  const stream = await client.beta.sessions.events.stream(activeSessionId);

  await client.beta.sessions.events.send(activeSessionId, {
    events: [
      {
        type: 'user.message',
        content: [{ type: 'text', text: message }],
      },
    ],
  });

  try {
    for await (const event of stream as AsyncIterable<any>) {
      // Forward agent state changes as progress events so the drawer can
      // show "Searching docs…" / "Reading sources…" instead of an opaque
      // typing indicator. Managed Agents doesn't stream text deltas, so
      // the final agent.message arrives in one chunk — but progress events
      // along the way still feel much faster than waiting in silence.
      if (event.type === 'agent.thinking') {
        writeSse(res, { type: 'progress', label: 'Thinking…' });
      } else if (event.type === 'agent.mcp_tool_use') {
        const q = event.input?.query;
        writeSse(res, {
          type: 'progress',
          label: q ? `Searching docs for "${String(q).slice(0, 60)}"…` : 'Searching docs…',
        });
      } else if (event.type === 'agent.mcp_tool_result') {
        writeSse(res, {
          type: 'progress',
          label: event.is_error ? 'Tool returned an error' : 'Writing answer…',
        });
      } else if (event.type === 'agent.message' && Array.isArray(event.content)) {
        for (const block of event.content) {
          if (block.type === 'text' && typeof block.text === 'string') {
            writeSse(res, { type: 'text-delta', text: block.text });
          }
        }
      } else if (event.type === 'session.status_idle') {
        break;
      } else if (event.type === 'session.error') {
        writeSse(res, {
          type: 'error',
          message: event.error?.message ?? 'Agent error',
        });
        break;
      }
    }
  } catch (err: any) {
    writeSse(res, { type: 'error', message: err?.message ?? String(err) });
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
