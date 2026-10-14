// Handler tests for api/feedback.ts. Run: npm test
// (Node 22.18+ strips the types itself; no build step, no new dependency.)
//
// The handler reads its env at module load, so each configuration imports a
// fresh copy of the module via a distinct query string.

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

type Call = { url: string; init: any };

// The handler logs every vote and sink error; keep that out of CI output.
// Tests that assert on logs use captureLogs below.
const realConsole = { log: console.log, warn: console.warn, error: console.error };
beforeEach(() => {
  console.log = console.warn = console.error = () => {};
});
afterEach(() => {
  Object.assign(console, realConsole);
});

async function load(env: Record<string, string>, tag: string) {
  for (const k of Object.keys(process.env)) if (k.startsWith('FEEDBACK_')) delete process.env[k];
  Object.assign(process.env, env);
  return import(`../api/feedback.ts?${tag}`);
}

function mockFetch(respond: (call: Call) => Response = linearMock()) {
  const calls: Call[] = [];
  globalThis.fetch = (async (url: string, init: any) => {
    const call = { url: String(url), init };
    calls.push(call);
    return respond(call);
  }) as any;
  return calls;
}

/** Answers Linear GraphQL by operation; `existing` is the page issue the lookup finds. */
function linearMock(existing: string | null = null) {
  return (call: Call) => {
    const query = String(JSON.parse(call.init.body).query ?? '');
    const data = query.includes('DocsFeedbackFind')
      ? { issues: { nodes: existing ? [{ id: existing, identifier: 'PRDCT-9' }] : [] } }
      : query.includes('DocsFeedbackComment')
        ? { commentCreate: { success: true } }
        : { issueCreate: { success: true, issue: { identifier: 'PRDCT-1' } } };
    return new Response(JSON.stringify({ data }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
}

/** The Linear call for one operation (DocsFeedbackFind / Issue / Comment). */
function op(calls: Call[], name: string) {
  return calls.find((c) => c.url.includes('linear') && JSON.parse(c.init.body).query.includes(name));
}

function req(method: string, body?: unknown, headers: Record<string, string> = {}) {
  return { method, body, headers: { 'x-forwarded-for': '203.0.113.7', ...headers } } as any;
}

/** Run fn with console.log/warn/error captured instead of printed. */
async function captureLogs(fn: () => Promise<unknown>) {
  const logs: { level: string; text: string }[] = [];
  const saved = { log: console.log, warn: console.warn, error: console.error };
  for (const level of ['log', 'warn', 'error'] as const) {
    console[level] = (...a: unknown[]) => logs.push({ level, text: a.map(String).join(' ') });
  }
  try {
    await fn();
  } finally {
    Object.assign(console, saved);
  }
  return logs;
}

function res() {
  const r: any = { statusCode: 0, headers: {}, body: '' };
  r.setHeader = (k: string, v: string) => (r.headers[k.toLowerCase()] = v);
  r.end = (b?: string) => (r.body = b ?? '');
  return r;
}

const valid = {
  verdict: 'down',
  reason: 'inaccurate',
  comment: 'The limit is 50, not 20.',
  path: '/storage/tables/',
  title: 'Tables | Keboola Docs',
};

const LINEAR = {
  FEEDBACK_LINEAR_API_KEY: 'lin_api_test',
  FEEDBACK_LINEAR_TEAM_ID: 'team-uuid',
  FEEDBACK_LINEAR_LABEL_IDS: 'label-a, label-b',
};

test('no sink configured: probe says disabled, a POST only reaches the logs', async () => {
  const mod = await load({}, 'stub');
  const calls = mockFetch();
  const probe = res();
  await mod.default(req('GET'), probe);
  assert.deepEqual(JSON.parse(probe.body), { enabled: false });

  const post = res();
  const logs = await captureLogs(() => mod.default(req('POST', valid), post));
  assert.equal(calls.length, 0);
  assert.equal(post.statusCode, 202, 'the comment reached no sink');
  assert.ok(logs.some((l) => l.text.startsWith('[feedback] undelivered comment')));
});

test('Linear configured: probe enabled, one issueCreate with team and labels', async () => {
  const mod = await load(LINEAR, 'linear');
  const calls = mockFetch();
  const probe = res();
  await mod.default(req('GET'), probe);
  assert.deepEqual(JSON.parse(probe.body), { enabled: true });

  const post = res();
  await captureLogs(() => mod.default(req('POST', valid), post));
  assert.equal(post.statusCode, 204);
  assert.equal(calls.length, 2, 'page lookup, then issueCreate');
  assert.equal(calls[0].url, 'https://api.linear.app/graphql');
  assert.equal(calls[0].init.headers.authorization, 'lin_api_test');
  const find = JSON.parse(op(calls, 'DocsFeedbackFind')!.init.body).variables.filter;
  assert.deepEqual(find.title, { endsWith: ' (/storage/tables/)' });
  assert.deepEqual(find.state, { type: { nin: ['completed', 'canceled'] } });
  const { variables } = JSON.parse(op(calls, 'DocsFeedbackIssue')!.init.body);
  assert.equal(variables.input.teamId, 'team-uuid');
  assert.deepEqual(variables.input.labelIds, ['label-a', 'label-b']);
  // PRDCT's default project and Backlog state would fail with another team.
  assert.equal(variables.input.projectId, undefined);
  assert.equal(variables.input.stateId, undefined);
  assert.equal(variables.input.title, 'Docs feedback: Tables | Keboola Docs (/storage/tables/)');
  assert.match(variables.input.description, /\[`\/storage\/tables\/`\]\(https:\/\/help\.keboola\.com\/storage\/tables\/\)/);
  assert.doesNotMatch(variables.input.description, /203\.0\.113\.7|user_agent|referrer/);
});

test('the API key alone is enough: built-in team, project, state and label', async () => {
  const mod = await load({ FEEDBACK_LINEAR_API_KEY: 'lin_api_test' }, 'defaults');
  const calls = mockFetch();
  const probe = res();
  await mod.default(req('GET'), probe);
  assert.deepEqual(JSON.parse(probe.body), { enabled: true });
  await captureLogs(() => mod.default(req('POST', valid), res()));
  const { input } = JSON.parse(op(calls, 'DocsFeedbackIssue')!.init.body).variables;
  assert.equal(input.teamId, '20917244-2e69-4226-8f05-d1bf40d99ea2');
  assert.equal(input.projectId, 'f5a83846-63e4-4ddd-b19f-0ddfb425fc8b');
  assert.equal(input.stateId, '78e62541-bf17-4628-8155-a3c12470c66b');
  assert.deepEqual(input.labelIds, ['9c08b2d5-1598-4aeb-bd4a-085349e371e2']);
});

test('OAuth token gets the Bearer scheme', async () => {
  const mod = await load({ ...LINEAR, FEEDBACK_LINEAR_API_KEY: 'oauth-token' }, 'oauth');
  const calls = mockFetch();
  await mod.default(req('POST', valid), res());
  assert.equal(calls[0].init.headers.authorization, 'Bearer oauth-token');
});

test('a thumb without a comment never files an issue', async () => {
  const mod = await load(LINEAR, 'nocomment');
  const calls = mockFetch();
  await mod.default(req('POST', { ...valid, comment: '' }), res());
  assert.equal(calls.length, 0);
});

test('an abandoned verdict drops its comment and files nothing (B1)', async () => {
  const mod = await load({ ...LINEAR, FEEDBACK_INGEST_URL: 'https://ingest.example/feedback' }, 'abandoned');
  const calls = mockFetch(() => new Response(null, { status: 200 }));
  await mod.default(req('POST', { ...valid, abandoned: true }), res());
  assert.equal(calls.length, 1, 'only the ingest call');
  assert.equal(calls[0].url, 'https://ingest.example/feedback');
  const row = JSON.parse(calls[0].init.body);
  assert.equal(row.abandoned, true);
  assert.equal(row.comment, '');
});

test('paths that could break out of the page link are dropped (B2)', async () => {
  const mod = await load(LINEAR, 'path');
  const calls = mockFetch();
  for (const path of ['/a](https://evil.example) @team', '/a\n# heading', 'relative', '/a b']) {
    const r = res();
    await mod.default(req('POST', { ...valid, path }), r);
    assert.equal(r.statusCode, 204);
  }
  assert.equal(calls.length, 0);
});

test('reader text stays inside a fence it cannot close (B2)', async () => {
  const mod = await load({}, 'fence');
  const nasty = 'hi\r# heading\r\n```\n@keboola/docs see keboola/connection-docs#1003\n````\nend';
  const record = mod.buildRecord({ ...valid, comment: nasty }, req('POST'));
  assert.ok(record);
  assert.doesNotMatch(record.comment, /\r/);
  const md: string = mod.issueMarkdown(record);
  const fenceLines = md.split('\n').filter((l) => /``/.test(l));
  assert.deepEqual(fenceLines, ['```text', '```'], 'no backtick run inside the fence, by any parser');
  const body = md.slice(md.indexOf('```text\n') + 8, md.lastIndexOf('\n```'));
  assert.equal(body.replaceAll('\u200B', ''), record.comment, 'only zero-width spaces were added');
});

test('sinks are independent: a Linear failure still delivers to ingest (I1)', async () => {
  const mod = await load({ ...LINEAR, FEEDBACK_INGEST_URL: 'https://ingest.example/feedback' }, 'allsettled');
  const calls = mockFetch((c) =>
    c.url.includes('linear')
      ? new Response(JSON.stringify({ errors: [{ message: 'Entity not found' }] }), { status: 200 })
      : new Response(null, { status: 200 }),
  );
  const r = res();
  const logs = await captureLogs(() => mod.default(req('POST', valid), r));
  assert.equal(calls.length, 3, 'lookup and create both fail, ingest still runs');
  assert.equal(r.statusCode, 202);
  const errors = logs.filter((l) => l.level === 'error');
  assert.equal(errors.length, 1, 'the sink error only; ingest kept the comment');
});

test('a thumb with no ingest is still logged as a countable vote', async () => {
  const mod = await load(LINEAR, 'vote');
  const calls = mockFetch();
  const r = res();
  const logs = await captureLogs(() => mod.default(req('POST', { ...valid, comment: '' }), r));
  assert.equal(calls.length, 0);
  assert.equal(r.statusCode, 204);
  const vote = logs.find((l) => l.text.startsWith('[feedback] vote'));
  assert.ok(vote, 'vote line logged');
  assert.match(vote.text, /"verdict":"down"/);
  assert.doesNotMatch(vote.text, /comment|user_agent|referrer/);
});

test('a comment Linear rejects is logged, not lost, when there is no ingest', async () => {
  const mod = await load(LINEAR, 'revoked');
  mockFetch(() => new Response(JSON.stringify({ errors: [{ message: 'Authentication required' }] }), { status: 200 }));
  const r = res();
  const logs = await captureLogs(() => mod.default(req('POST', valid), r));
  assert.equal(r.statusCode, 202);
  const lost = logs.find((l) => l.text.startsWith('[feedback] undelivered comment'));
  assert.ok(lost);
  assert.match(lost.text, /The limit is 50, not 20\./);
});

test('FEEDBACK_LINEAR_DAILY_CAP=0 stops Linear filing', async () => {
  const mod = await load({ ...LINEAR, FEEDBACK_LINEAR_DAILY_CAP: '0' }, 'cap0');
  const calls = mockFetch();
  const logs = await captureLogs(() => mod.default(req('POST', valid), res()));
  assert.equal(calls.length, 0);
  assert.ok(logs.some((l) => l.text.includes('Linear filing paused')));
  assert.ok(!logs.some((l) => l.text.includes('rate limit hit')));
});

test('the widget id becomes submission_id; anything else is replaced', async () => {
  const mod = await load({}, 'sid');
  const id = '3f2b8c1e-9a4d-4e6f-8b2a-1c3d5e7f9a0b';
  assert.equal(mod.buildRecord({ ...valid, sid: id }, req('POST')).submission_id, id);
  assert.match(mod.buildRecord({ ...valid, sid: 'x\n# hi' }, req('POST')).submission_id, /^fb-/);
});

test('caps never cut an emoji in half', async () => {
  const mod = await load({}, 'surrogate');
  const record = mod.buildRecord({ ...valid, comment: 'a'.repeat(999) + '😀' }, req('POST'));
  assert.equal(record.comment, 'a'.repeat(999));
});

test('secrets and emails are scrubbed before any sink', async () => {
  const mod = await load(LINEAR, 'scrub');
  const calls = mockFetch();
  const token = '264-123456-' + 'A1b2C3d4E5'.repeat(4);
  const comment = `My token ${token} and mail jane.doe@example.com, key lin_api_${'x'.repeat(30)}`;
  await captureLogs(() => mod.default(req('POST', { ...valid, comment }), res()));
  const body = JSON.stringify(JSON.parse(op(calls, 'DocsFeedbackIssue')!.init.body).variables);
  assert.doesNotMatch(body, /A1b2C3d4E5|jane\.doe|lin_api_x/);
  assert.match(body, /\[redacted token\].*\[redacted email\].*\[redacted token\]/);
  assert.match(body, /Redacted:\*\* 3 secret/);
});

test('ordinary text survives the scrub untouched', async () => {
  const mod = await load({}, 'scrub-clean');
  const text = 'Step 3 fails on project 264-abc, see /storage/tables/ and the 2026-10-14 run.';
  assert.deepEqual(mod.scrub(text), { text, redactions: 0 });
});

test('a second report on the same page becomes a comment, not a new issue', async () => {
  const mod = await load(LINEAR, 'comment');
  const calls = mockFetch(linearMock('issue-uuid-1'));
  const r = res();
  await captureLogs(() => mod.default(req('POST', valid), r));
  assert.equal(r.statusCode, 204);
  assert.equal(op(calls, 'DocsFeedbackIssue'), undefined);
  const { input } = JSON.parse(op(calls, 'DocsFeedbackComment')!.init.body).variables;
  assert.equal(input.issueId, 'issue-uuid-1');
  assert.match(input.body, /The limit is 50, not 20\./);
});

test('a failed page lookup still files a new issue', async () => {
  const mod = await load(LINEAR, 'lookup-fails');
  const ok = linearMock();
  const calls = mockFetch((c) =>
    JSON.parse(c.init.body).query.includes('DocsFeedbackFind')
      ? new Response(JSON.stringify({ errors: [{ message: 'Unknown field endsWith' }] }), { status: 200 })
      : ok(c),
  );
  const r = res();
  const logs = await captureLogs(() => mod.default(req('POST', valid), r));
  assert.equal(r.statusCode, 204);
  assert.ok(op(calls, 'DocsFeedbackIssue'));
  assert.ok(logs.some((l) => l.text.includes('page issue lookup failed')));
});

test('the issue names the section and links the page source', async () => {
  const mod = await load({}, 'source');
  const record = mod.buildRecord({ ...valid, source: 'src/content/docs/storage/tables.md' }, req('POST'));
  const md: string = mod.issueMarkdown(record);
  assert.match(md, /Section:\*\* storage/);
  assert.match(md, /\(https:\/\/github\.com\/keboola\/connection-docs\/blob\/main\/src\/content\/docs\/storage\/tables\.md\)/);
  for (const source of ['../../etc/passwd', 'src/content/docs/a](https://evil)/b.md', 'src/content/docs/../x.md', 'README.md']) {
    assert.equal(mod.buildRecord({ ...valid, source }, req('POST')).source, '', source);
  }
});

test('per-IP and daily caps stop issue floods (B3)', async () => {
  const mod = await load({ ...LINEAR, FEEDBACK_LINEAR_DAILY_CAP: '7' }, 'caps');
  const now = Date.parse('2026-10-13T10:00:00Z');
  const fromA = Array.from({ length: 6 }, () => mod.allowIssue('198.51.100.1', now));
  assert.deepEqual(fromA, [true, true, true, true, true, false]);
  assert.equal(mod.allowIssue('198.51.100.2', now), true);
  assert.equal(mod.allowIssue('198.51.100.2', now), true);
  assert.equal(mod.allowIssue('198.51.100.3', now), false, 'daily cap of 7 reached');
  assert.equal(mod.allowIssue('198.51.100.3', now + 24 * 3600 * 1000), true, 'new day resets');
});

test('honeypot, bad verdicts and non-object bodies are dropped quietly', async () => {
  const mod = await load(LINEAR, 'drops');
  const calls = mockFetch();
  for (const body of [{ ...valid, hp: 'x' }, { ...valid, verdict: 'meh' }, null, [1, 2], 42]) {
    const r = res();
    await mod.default(req('POST', body), r);
    assert.equal(r.statusCode, 204);
  }
  assert.equal(calls.length, 0);
});

test('CORS: allow-listed origins echoed, others get no allow header', async () => {
  const mod = await load(LINEAR, 'cors');
  mockFetch();
  const ok = res();
  await mod.default(req('OPTIONS', undefined, { origin: 'https://help.keboola.com' }), ok);
  assert.equal(ok.headers['access-control-allow-origin'], 'https://help.keboola.com');
  const dev = res();
  await mod.default(req('OPTIONS', undefined, { origin: 'http://localhost:4321' }), dev);
  assert.equal(dev.headers['access-control-allow-origin'], 'http://localhost:4321');
  for (const origin of ['https://evil.example', 'https://connection-docs-evil.vercel.app']) {
    const bad = res();
    await mod.default(req('OPTIONS', undefined, { origin }), bad);
    assert.equal(bad.headers['access-control-allow-origin'], undefined, origin);
  }
});

test('other methods get 405', async () => {
  const mod = await load({}, 'method');
  const r = res();
  await mod.default(req('PUT'), r);
  assert.equal(r.statusCode, 405);
});
