// Handler tests for api/log-ingest.ts. Run: npm test
//
// The handler reads its env at module load, so each configuration imports a
// fresh copy of the module via a distinct query string.

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

type Call = { url: string; init: any };

const realConsole = { log: console.log, warn: console.warn, error: console.error };
beforeEach(() => {
  console.log = console.warn = console.error = () => {};
});
afterEach(() => {
  Object.assign(console, realConsole);
});

const ENV = {
  LOG_INGEST_SECRET: 'drain-secret',
  LOG_INGEST_URL: 'https://stream.example/ingest',
  LOG_INGEST_IP_SALT: 'salt',
};

async function load(env: Record<string, string>, tag: string) {
  for (const k of Object.keys(process.env)) if (k.startsWith('LOG_INGEST_')) delete process.env[k];
  Object.assign(process.env, env);
  return import(`../api/log-ingest.ts?${tag}`);
}

function mockFetch(status = 200) {
  const calls: Call[] = [];
  globalThis.fetch = (async (url: string, init: any) => {
    calls.push({ url: String(url), init });
    return new Response('', { status });
  }) as any;
  return calls;
}

const sign = (body: string, secret = ENV.LOG_INGEST_SECRET) => createHmac('sha1', secret).update(body).digest('hex');

function req(body: string, signature: string | null = sign(body), method = 'POST') {
  const headers: Record<string, string> = {};
  if (signature !== null) headers['x-vercel-signature'] = signature;
  return { method, body, headers } as any;
}

function res() {
  const r: any = { statusCode: 0, headers: {}, body: '' };
  r.setHeader = (k: string, v: string) => (r.headers[k.toLowerCase()] = v);
  r.end = (b?: string) => (r.body = b ?? '');
  return r;
}

function entry(path: string, over: Record<string, unknown> = {}, proxy: Record<string, unknown> = {}) {
  return {
    source: 'static',
    environment: 'production',
    timestamp: 1794900000000,
    proxy: {
      timestamp: 1794900000123,
      method: 'GET',
      host: 'help.keboola.com',
      path,
      userAgent: ['Claude-User/1.0'],
      referer: 'https://chatgpt.com/c/abc?x=1',
      region: 'fra1',
      statusCode: 200,
      clientIp: '203.0.113.7',
      vercelCache: 'HIT',
      ...proxy,
    },
    ...over,
  };
}

test('classifyPath keeps pages, twins and llms.txt, drops assets and api', async () => {
  const { classifyPath } = await load(ENV, 'classify');
  assert.equal(classifyPath('/'), 'page');
  assert.equal(classifyPath('/storage/tables/'), 'page');
  assert.equal(classifyPath('/storage/tables'), 'page');
  assert.equal(classifyPath('/404.html'), 'page');
  assert.equal(classifyPath('/storage/tables/index.md'), 'markdown');
  assert.equal(classifyPath('/llms.txt'), 'llms');
  assert.equal(classifyPath('/llms-full.txt'), 'llms');
  for (const p of ['/_astro/page.js', '/pagefind/x.pf_meta', '/api/chat', '/api/log-ingest', '/favicon.ico', '/storage/shot.png', '/components/ip-addresses/kbc-public-ip.json']) {
    assert.equal(classifyPath(p), null, p);
  }
});

test('toRecord strips the query, keeps the referrer host and hashes the IP', async () => {
  const { toRecord } = await load(ENV, 'record');
  const r = toRecord(entry('/storage/tables/?utm_source=x'), 'salt');
  assert.deepEqual(r, {
    ts: new Date(1794900000123).toISOString(),
    kind: 'page',
    path: '/storage/tables/',
    method: 'GET',
    status: 200,
    cache: 'HIT',
    region: 'fra1',
    user_agent: 'Claude-User/1.0',
    referrer_host: 'chatgpt.com',
    ip_hash: createHmac('sha256', 'salt').update('203.0.113.7').digest('hex').slice(0, 16),
  });
  assert.ok(!JSON.stringify(r).includes('203.0.113.7'), 'raw IP never leaves');
  assert.equal(toRecord(entry('/x/'), '')?.ip_hash, '', 'no salt, no hash');
});

test('toRecord drops previews, other hosts, non-GET and build logs', async () => {
  const { toRecord } = await load(ENV, 'drop');
  assert.equal(toRecord(entry('/x/', { environment: 'preview' })), null);
  assert.equal(toRecord(entry('/x/', {}, { host: 'connection-docs.vercel.app' })), null);
  assert.equal(toRecord(entry('/x/', {}, { method: 'POST' })), null);
  assert.equal(toRecord({ source: 'build', timestamp: 1 }), null);
  assert.equal(toRecord(entry('/x/', {}, { method: 'HEAD' }))?.method, 'HEAD');
});

test('parseBatch reads a JSON array and NDJSON', async () => {
  const { parseBatch } = await load(ENV, 'parse');
  const a = entry('/a/');
  const b = entry('/b/');
  assert.equal(parseBatch(JSON.stringify([a, b])).length, 2);
  assert.equal(parseBatch(`${JSON.stringify(a)}\n${JSON.stringify(b)}\n`).length, 2);
  assert.deepEqual(parseBatch(''), []);
  assert.throws(() => parseBatch('{not json'));
});

test('a signed batch is filtered and forwarded as one body', async () => {
  const { default: handler } = await load(ENV, 'forward');
  const calls = mockFetch();
  const body = JSON.stringify([entry('/a/'), entry('/_astro/x.js'), entry('/a/index.md'), entry('/api/log-ingest')]);
  const r = res();
  await handler(req(body), r);

  assert.equal(r.statusCode, 200);
  assert.deepEqual(JSON.parse(r.body), { kept: 2, received: 4 });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, ENV.LOG_INGEST_URL);
  const sent = JSON.parse(calls[0].init.body);
  assert.deepEqual(sent.records.map((x: any) => x.kind), ['page', 'markdown']);
  assert.ok(sent.received_at);
});

test('the bearer token is sent when set', async () => {
  const { default: handler } = await load({ ...ENV, LOG_INGEST_TOKEN: 'tok' }, 'token');
  const calls = mockFetch();
  const body = JSON.stringify([entry('/a/')]);
  await handler(req(body), res());
  assert.equal(calls[0].init.headers.authorization, 'Bearer tok');
});

test('nothing to keep: 200 without calling the stream', async () => {
  const { default: handler } = await load(ENV, 'empty');
  const calls = mockFetch();
  const body = JSON.stringify([entry('/_astro/x.js')]);
  const r = res();
  await handler(req(body), r);
  assert.equal(r.statusCode, 200);
  assert.equal(calls.length, 0);
});

test('a missing or wrong signature is refused before anything is parsed', async () => {
  const { default: handler } = await load(ENV, 'sig');
  const calls = mockFetch();
  const body = JSON.stringify([entry('/a/')]);
  for (const sig of [null, 'deadbeef', sign(body, 'other-secret')]) {
    const r = res();
    await handler(req(body, sig), r);
    assert.equal(r.statusCode, 403, String(sig));
  }
  assert.equal(calls.length, 0);
});

test('without secret or URL every POST gets 503', async () => {
  for (const [tag, env] of [['nosecret', { LOG_INGEST_URL: ENV.LOG_INGEST_URL }], ['nourl', { LOG_INGEST_SECRET: ENV.LOG_INGEST_SECRET }]] as const) {
    const { default: handler } = await load(env, tag);
    const r = res();
    await handler(req('[]'), r);
    assert.equal(r.statusCode, 503, tag);
  }
});

test('a signed body that is not log JSON gets 400', async () => {
  const { default: handler } = await load(ENV, 'badjson');
  const r = res();
  await handler(req('{oops'), r);
  assert.equal(r.statusCode, 400);
});

test('the stream refusing the batch gives 502', async () => {
  const { default: handler } = await load(ENV, 'sinkfail');
  mockFetch(500);
  const body = JSON.stringify([entry('/a/')]);
  const r = res();
  await handler(req(body), r);
  assert.equal(r.statusCode, 502);
});

test('GET is not allowed', async () => {
  const { default: handler } = await load(ENV, 'get');
  const r = res();
  await handler(req('', null, 'GET'), r);
  assert.equal(r.statusCode, 405);
});
