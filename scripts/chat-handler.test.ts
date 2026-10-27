// Handler tests for api/chat.ts. Run: npm test
// (Node 22.18+ strips the types itself; no build step, no new dependency.)
//
// The handler reads its env at module load, so each configuration imports a
// fresh copy of the module via a distinct query string.

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';

const realConsole = { log: console.log, warn: console.warn, error: console.error };
const realFetch = globalThis.fetch;
beforeEach(() => {
  console.log = console.warn = console.error = () => {};
});
afterEach(() => {
  Object.assign(console, realConsole);
  globalThis.fetch = realFetch;
});

const LIVE = { AI_SERVICE_URL: 'https://ai.example.test', KBC_STORAGE_API_TOKEN: 'test-token' };

async function load(env: Record<string, string>, tag: string) {
  delete process.env.AI_SERVICE_URL;
  delete process.env.KBC_STORAGE_API_TOKEN;
  Object.assign(process.env, env);
  return import(`../api/chat.ts?${tag}`);
}

function req(method: string, body?: unknown, headers: Record<string, string> = {}) {
  return { method, body, headers: { 'x-forwarded-for': '203.0.113.7', ...headers } } as any;
}

/** A VercelResponse stand-in that records status, headers and SSE writes. */
function res() {
  const r: any = new EventEmitter();
  Object.assign(r, { statusCode: 0, headers: {}, body: '', headersSent: false, writableFinished: false });
  r.setHeader = (k: string, v: string) => (r.headers[k.toLowerCase()] = v);
  r.write = (chunk: string) => {
    r.headersSent = true;
    r.body += chunk;
    return true;
  };
  r.end = (b?: string) => {
    r.headersSent = true;
    r.body += b ?? '';
    r.writableFinished = true;
    r.emit('close');
  };
  return r;
}

/** The SSE events a response carried, parsed. */
function events(r: any): any[] {
  return String(r.body)
    .split('\n\n')
    .filter((l) => l.startsWith('data: '))
    .map((l) => JSON.parse(l.slice(6)));
}

function answer(text = 'Use a flow.', sourceUrls: string[] = []) {
  return new Response(JSON.stringify({ text, sourceUrls }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

// ─── CORS ────────────────────────────────────────────────────────────────

test('CORS: prod and local dev origins are echoed', async () => {
  const mod = await load({}, 'cors-ok');
  for (const origin of ['https://help.keboola.com', 'http://localhost:4321', 'http://127.0.0.1:4321']) {
    const r = res();
    await mod.default(req('OPTIONS', undefined, { origin }), r);
    assert.equal(r.statusCode, 204);
    assert.equal(r.headers['access-control-allow-origin'], origin, origin);
    assert.equal(r.headers['vary'], 'origin');
  }
});

test('CORS: vercel.app and look-alike origins get no allow header', async () => {
  const mod = await load({}, 'cors-deny');
  for (const origin of [
    'https://connection-docs-evil.vercel.app',
    'https://keboola-docs-beacon.vercel.app',
    'https://help.keboola.com.evil.test',
    'http://help.keboola.com',
    'https://localhost.evil.test',
    'null',
  ]) {
    const r = res();
    await mod.default(req('GET', undefined, { origin }), r);
    assert.equal(r.headers['access-control-allow-origin'], undefined, origin);
  }
});

// ─── Request validation ──────────────────────────────────────────────────

test('a missing, empty or non-string message is a 400, not a 500', async () => {
  const mod = await load({}, 'validate');
  for (const body of [{}, { message: '   ' }, { message: 42 }, { message: ['a'] }, { message: { x: 1 } }, null, 'null', '7']) {
    const r = res();
    await mod.default(req('POST', body), r);
    assert.equal(r.statusCode, 400, JSON.stringify(body));
    assert.equal(JSON.parse(r.body).error, 'message is required');
  }
});

test('a body that is not JSON is a 400', async () => {
  const mod = await load({}, 'badjson');
  const r = res();
  await mod.default(req('POST', '{not json'), r);
  assert.equal(r.statusCode, 400);
  assert.equal(JSON.parse(r.body).error, 'Invalid JSON body');
});

// ─── Rate limit ──────────────────────────────────────────────────────────

test('per-IP limit: the 21st question in 10 minutes gets 429, other IPs pass', async () => {
  const mod = await load({}, 'ratelimit');
  const now = Date.UTC(2026, 9, 27, 12);
  for (let i = 0; i < 20; i++) assert.equal(mod.allowQuestion('198.51.100.1', now + i), true, `question ${i + 1}`);
  assert.equal(mod.allowQuestion('198.51.100.1', now + 20), false);
  assert.equal(mod.allowQuestion('198.51.100.2', now + 20), true, 'another IP has its own window');
  assert.equal(mod.allowQuestion('198.51.100.1', now + 10 * 60 * 1000 + 1), true, 'the window slides');
});

test('per-IP limit: the handler answers 429 with JSON and never calls upstream', async () => {
  const mod = await load(LIVE, 'ratelimit-handler');
  let calls = 0;
  globalThis.fetch = (async () => {
    calls++;
    return answer();
  }) as any;
  for (let i = 0; i < 20; i++) mod.allowQuestion('203.0.113.7');
  const r = res();
  await mod.default(req('POST', { message: 'How do flows work?' }), r);
  assert.equal(r.statusCode, 429);
  assert.match(JSON.parse(r.body).error, /Too many questions/);
  assert.equal(calls, 0);
});

// ─── Upstream retries ────────────────────────────────────────────────────

test('a 5xx is retried with a waking-up event, then the answer streams', async () => {
  const mod = await load(LIVE, 'retry-5xx');
  let calls = 0;
  globalThis.fetch = (async () => (++calls === 1 ? new Response('', { status: 503 }) : answer('Hi.'))) as any;
  const r = res();
  await mod.default(req('POST', { message: 'Hello' }), r);
  const ev = events(r);
  assert.equal(calls, 2);
  assert.ok(ev.some((e) => e.type === 'progress' && /waking up/.test(e.label)));
  assert.deepEqual(ev.find((e) => e.type === 'text-delta'), { type: 'text-delta', text: 'Hi.' });
  assert.equal(ev.at(-1).type, 'done');
});

test('a timeout ends the request without a retry it has no budget for', async () => {
  const mod = await load(LIVE, 'retry-timeout');
  let calls = 0;
  globalThis.fetch = (async () => {
    calls++;
    throw new DOMException('The operation was aborted due to timeout', 'TimeoutError');
  }) as any;
  const r = res();
  await mod.default(req('POST', { message: 'Hello' }), r);
  const ev = events(r);
  assert.equal(calls, 1);
  assert.ok(!ev.some((e) => e.type === 'progress' && /retrying/.test(e.label)), 'no dead retry');
  assert.ok(ev.some((e) => e.type === 'error'));
  assert.equal(ev.at(-1).type, 'done');
});

test('a 4xx from upstream is not retried', async () => {
  const mod = await load(LIVE, 'retry-4xx');
  let calls = 0;
  globalThis.fetch = (async () => {
    calls++;
    return new Response('', { status: 401 });
  }) as any;
  const r = res();
  await mod.default(req('POST', { message: 'Hello' }), r);
  assert.equal(calls, 1);
  assert.ok(events(r).some((e) => e.type === 'error'));
});
