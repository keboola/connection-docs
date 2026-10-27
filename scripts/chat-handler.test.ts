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
