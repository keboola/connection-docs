// Handler tests for api/log-ingest.ts. Run: npm test
//
// The handler reads its env at module load, so each configuration imports a
// fresh copy of the module via a distinct query string. Requests are real
// `Request` objects with streamed bodies, the shape Vercel hands the fetch
// handler, so the raw-body path is the one production runs.

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { gzipSync } from 'node:zlib';

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

/** Stream mock; `status` may be a function of the call index for partial failures. */
function mockFetch(status: number | ((i: number) => number) = 200) {
  const calls: Call[] = [];
  globalThis.fetch = (async (url: string, init: any) => {
    const i = calls.length;
    calls.push({ url: String(url), init });
    return new Response('', { status: typeof status === 'function' ? status(i) : status });
  }) as any;
  return calls;
}

const sign = (body: string | Buffer, secret = ENV.LOG_INGEST_SECRET) => createHmac('sha1', secret).update(body).digest('hex');

/** A POST whose body arrives as a stream, like a real drain delivery. */
function req(body: string | Buffer, opts: { signature?: string | null; method?: string; headers?: Record<string, string> } = {}) {
  const bytes = typeof body === 'string' ? Buffer.from(body) : body;
  const headers: Record<string, string> = { 'content-type': 'application/json', ...opts.headers };
  const signature = opts.signature === undefined ? sign(bytes) : opts.signature;
  if (signature !== null) headers['x-vercel-signature'] = signature;
  const method = opts.method ?? 'POST';
  const init: any = { method, headers };
  if (method !== 'GET' && method !== 'HEAD') {
    init.body = new ReadableStream({
      start(c) {
        c.enqueue(new Uint8Array(bytes));
        c.close();
      },
    });
    init.duplex = 'half';
  }
  return new Request('https://help.keboola.com/api/log-ingest', init);
}

let seq = 0;
function entry(path: string, over: Record<string, unknown> = {}, proxy: Record<string, unknown> = {}) {
  seq += 1;
  return {
    id: `log-${seq}`,
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

const sent = (call: Call) => JSON.parse(call.init.body);

test('classifyPath keeps pages, twins and llms.txt, drops assets and api', async () => {
  const { classifyPath } = await load(ENV, 'classify');
  assert.equal(classifyPath('/'), 'page');
  assert.equal(classifyPath('/storage/tables/'), 'page');
  assert.equal(classifyPath('/storage/tables'), 'page');
  assert.equal(classifyPath('/404.html'), 'page');
  assert.equal(classifyPath('/storage/tables/index.md'), 'markdown');
  assert.equal(classifyPath('/llms.txt'), 'llms');
  assert.equal(classifyPath('/llms-full.txt'), 'llms');
  assert.equal(classifyPath('/storage/llms-full.txt'), 'llms');
  for (const p of ['/storage/tables/llms-full.txt', '/_astro/page.js', '/pagefind/x.pf_meta', '/api/chat', '/api/log-ingest', '/favicon.ico', '/storage/shot.png', '/components/ip-addresses/kbc-public-ip.json']) {
    assert.equal(classifyPath(p), null, p);
  }
});

test('toRecord keeps the id, strips the query, keeps the referrer host and hashes the IP', async () => {
  const { toRecord, hashIp } = await load(ENV, 'record');
  const e = entry('/storage/tables/?utm_source=x');
  const r = toRecord(e, 'salt');
  const when = new Date(1794900000123);
  assert.deepEqual(r, {
    id: e.id,
    ts: when.toISOString(),
    kind: 'page',
    path: '/storage/tables/',
    method: 'GET',
    status: 200,
    cache: 'HIT',
    region: 'fra1',
    user_agent: 'Claude-User/1.0',
    referrer_host: 'chatgpt.com',
    ip_hash: hashIp('203.0.113.7', 'salt', when),
  });
  assert.match(r.ip_hash, /^[0-9a-f]{16}$/);
  assert.ok(!JSON.stringify(r).includes('203.0.113.7'), 'raw IP never leaves');
});

test('the IP hash key changes with the month', async () => {
  const { hashIp } = await load(ENV, 'month');
  const nov = hashIp('203.0.113.7', 'salt', new Date('2026-11-30T23:00:00Z'));
  assert.equal(hashIp('203.0.113.7', 'salt', new Date('2026-11-01T00:00:00Z')), nov);
  assert.notEqual(hashIp('203.0.113.7', 'salt', new Date('2026-12-01T00:00:00Z')), nov);
  assert.equal(hashIp('203.0.113.7', '', new Date()), '');
});

test('toRecord drops previews, other hosts, non-GET, redirects and build logs', async () => {
  const { toRecord } = await load(ENV, 'drop');
  assert.equal(toRecord(entry('/x/', { environment: 'preview' })), null);
  assert.equal(toRecord(entry('/x/', {}, { host: 'connection-docs.vercel.app' })), null);
  assert.equal(toRecord(entry('/x/', {}, { method: 'POST' })), null);
  assert.equal(toRecord(entry('/x', {}, { statusCode: 308 })), null, 'the slashless 308 is not a read');
  assert.equal(toRecord({ source: 'build', timestamp: 1 }), null);
  assert.equal(toRecord(entry('/x/', {}, { method: 'HEAD' }))?.method, 'HEAD');
  assert.equal(toRecord(entry('/gone/', {}, { statusCode: 404 }))?.status, 404, 'a 404 is still a request');
});

test('parseBatch reads a JSON array and NDJSON, skipping bad NDJSON lines', async () => {
  const { parseBatch } = await load(ENV, 'parse');
  const a = JSON.stringify(entry('/a/'));
  const b = JSON.stringify(entry('/b/'));
  assert.equal(parseBatch(`[${a},${b}]`).entries.length, 2);
  assert.deepEqual(parseBatch(`${a}\n{broken\n${b}\n`).skipped, 1);
  assert.equal(parseBatch(`${a}\n{broken\n${b}\n`).entries.length, 2);
  assert.deepEqual(parseBatch(''), { entries: [], skipped: 0 });
  assert.throws(() => parseBatch('[{"oops"'));
  assert.throws(() => parseBatch('{broken'));
});

test('a signed streamed batch is filtered and forwarded', async () => {
  const { default: fn } = await load(ENV, 'forward');
  const calls = mockFetch();
  const body = JSON.stringify([entry('/a/'), entry('/_astro/x.js'), entry('/a/index.md'), entry('/api/log-ingest'), entry('/b', {}, { statusCode: 308 })]);
  const r = await fn.fetch(req(body));

  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { kept: 2, received: 5, skipped: 0 });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, ENV.LOG_INGEST_URL);
  assert.deepEqual(sent(calls[0]).records.map((x: any) => x.kind), ['page', 'markdown']);
  assert.ok(sent(calls[0]).received_at);
});

test('a big batch goes out in chunks', async () => {
  const { handle, CHUNK_SIZE } = await load(ENV, 'chunks');
  const calls = mockFetch();
  const body = JSON.stringify(Array.from({ length: CHUNK_SIZE + 1 }, (_, i) => entry(`/p${i}/`)));
  const r = await handle(req(body));
  assert.equal(r.status, 200);
  assert.deepEqual(calls.map((c) => sent(c).records.length), [CHUNK_SIZE, 1]);
});

test('one refused chunk gives 502 so the drain retries', async () => {
  const { handle, CHUNK_SIZE } = await load(ENV, 'partial');
  mockFetch((i) => (i === 1 ? 413 : 200));
  const body = JSON.stringify(Array.from({ length: CHUNK_SIZE + 1 }, (_, i) => entry(`/p${i}/`)));
  const r = await handle(req(body));
  assert.equal(r.status, 502);
  assert.deepEqual(await r.json(), { error: 'Ingest failed', failed_chunks: 1, chunks: 2 });
});

test('a gzipped delivery is accepted whichever bytes it signs', async () => {
  const { handle } = await load(ENV, 'gzip');
  const calls = mockFetch();
  const plain = JSON.stringify([entry('/a/')]);
  const zipped = gzipSync(plain);
  for (const signature of [sign(zipped), sign(plain)]) {
    const r = await handle(req(zipped, { signature, headers: { 'content-encoding': 'gzip' } }));
    assert.equal(r.status, 200);
  }
  assert.equal(calls.length, 2);
  assert.equal(sent(calls[1]).records[0].path, '/a/');
});

test('the bearer token is sent when set', async () => {
  const { handle } = await load({ ...ENV, LOG_INGEST_TOKEN: 'tok' }, 'token');
  const calls = mockFetch();
  await handle(req(JSON.stringify([entry('/a/')])));
  assert.equal(calls[0].init.headers.authorization, 'Bearer tok');
});

test('nothing to keep: 200 without calling the stream', async () => {
  const { handle } = await load(ENV, 'empty');
  const calls = mockFetch();
  const r = await handle(req(JSON.stringify([entry('/_astro/x.js')])));
  assert.equal(r.status, 200);
  assert.equal(calls.length, 0);
});

test('a missing, wrong or malformed signature is refused, never thrown', async () => {
  const { handle } = await load(ENV, 'sig');
  const calls = mockFetch();
  const body = JSON.stringify([entry('/a/')]);
  const good = sign(body);
  const nonAscii = 'é' + good.slice(1); // 40 characters, 41 bytes
  for (const signature of [null, 'deadbeef', sign(body, 'other-secret'), nonAscii]) {
    const r = await handle(req(body, { signature }));
    assert.equal(r.status, 403, String(signature));
  }
  assert.equal((await handle(req(body, { signature: good.toUpperCase() }))).status, 200, 'hex case does not matter');
  assert.equal(calls.length, 1);
});

test('without secret, URL or salt every POST gets 503', async () => {
  const { LOG_INGEST_SECRET, LOG_INGEST_URL, LOG_INGEST_IP_SALT } = ENV;
  const cases = {
    nosecret: { LOG_INGEST_URL, LOG_INGEST_IP_SALT },
    nourl: { LOG_INGEST_SECRET, LOG_INGEST_IP_SALT },
    nosalt: { LOG_INGEST_SECRET, LOG_INGEST_URL },
  };
  for (const [tag, env] of Object.entries(cases)) {
    const { handle } = await load(env, tag);
    assert.equal((await handle(req('[]'))).status, 503, tag);
  }
});

test('a signed body that is not log JSON gets 400', async () => {
  const { handle } = await load(ENV, 'badjson');
  assert.equal((await handle(req('{oops'))).status, 400);
});

test('GET is not allowed', async () => {
  const { handle } = await load(ENV, 'get');
  assert.equal((await handle(req('', { method: 'GET', signature: null }))).status, 405);
});
