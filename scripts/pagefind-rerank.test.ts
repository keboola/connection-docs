// Tests for public/pagefind-rerank.js, the search ranking the site loads in
// place of /pagefind/pagefind.js: title matches first (#1173), then prefix-only
// matches ("Apple" for "apps") moved down (#1176). Run: npm test
//
// The script imports the real Pagefind bundle as './pagefind/pagefind.js?core',
// which only exists in a build. A resolve hook swaps in a fake bundle whose
// search() returns whatever the test puts in `fake.results`, and fetch() serves
// the titles file, so the script loads here exactly as the site ships it.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

const fake: { results: any[] } = { results: [] };
(globalThis as any).fakePagefind = {
  search: async () => ({ results: fake.results }),
  debouncedSearch: async () => ({ results: fake.results }),
};
const FAKE_CORE =
  'data:text/javascript,' +
  encodeURIComponent(
    'export const search = (...a) => globalThis.fakePagefind.search(...a);' +
      'export const debouncedSearch = (...a) => globalThis.fakePagefind.debouncedSearch(...a);',
  );
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === './pagefind/pagefind.js?core') return { url: FAKE_CORE, shortCircuit: true };
    return nextResolve(specifier, context);
  },
});

// /pagefind-titles.json rows: [id, title, url, search_keywords]
const TITLES = [
  ['apps-hub', 'Apps', '/data-apps/'],
  ['dark-sky', 'Dark Sky', '/components/extractors/other/dark-sky/'],
  ['streamlit', 'Streamlit', '/components/applications/streamlit/'],
  ['snowflake', 'Snowflake', '/components/writers/database/snowflake/'],
  ['sheets', 'Google Sheets', '/components/writers/other/google-sheets/'],
  ['kbagent', 'Command-line agent', '/management/kbagent/'],
  ['overview', 'Overview', '/overview/'],
  ['tde', 'TDE Exporter', '/components/writers/other/tableau-tde/'],
  ['storage-api', 'Storage API', '/storage/api/'],
  ['flows', 'Flows', '/flows/'],
];
globalThis.fetch = (async (url: URL) => {
  assert.match(String(url), /pagefind-titles\.json$/);
  return new Response(JSON.stringify(TITLES));
}) as typeof fetch;

const { search } = await import('../public/pagefind-rerank.js');

// A Pagefind result whose fragment has `text` as its content and a location
// for every word in it that `matches` accepts, the way Pagefind lists each
// matched word. `load` replaces the fragment download.
function result(id: string, text: string, matches: RegExp, load?: () => Promise<unknown>) {
  const contentWords = text.split(/\s+/);
  const locations = contentWords.flatMap((w, i) => (matches.test(w) ? [i] : []));
  const r = {
    id,
    loads: 0,
    data() {
      r.loads += 1;
      return load ? load() : Promise.resolve({ content: text, locations });
    },
  };
  return r;
}

const repeat = (word: string, n: number) => Array(n).fill(word).join(' ');
const ids = (response: { results: { id: string }[] }) => response.results.map((r) => r.id);

test('"apps": the title match comes first and the Apple page moves below real app matches', async () => {
  const darkSky = result(
    'dark-sky',
    `${repeat('Apple', 6)} apples appKey ${repeat('weather', 20)} apps`,
    /^app/i,
  );
  const streamlit = result('streamlit', `${repeat('apps', 4)} Python ${repeat('code', 10)}`, /^app/i);
  const hub = result('apps-hub', repeat('apps', 5), /^app/i);
  fake.results = [darkSky, streamlit, hub];
  assert.deepEqual(ids(await search('apps')), ['apps-hub', 'streamlit', 'dark-sky']);
  // the UI's own data() call reuses the download the check made
  await darkSky.data();
  assert.equal(darkSky.loads, 1);
});

test('"how to export data": stop words and other query words do not demote a real match', async () => {
  // 40 "to"/"how", 10 "export"/"data": the old ratio counted every location
  // and moved this page down. Only "data" (the last word) counts now.
  const snowflake = result(
    'snowflake',
    `${repeat('how to', 20)} ${repeat('export data', 5)} database`,
    /^(how|to|export|data)/i,
  );
  const sheets = result('sheets', `${repeat('export', 3)} ${repeat('data', 2)}`, /^(how|to|export|data)/i);
  fake.results = [snowflake, sheets];
  assert.deepEqual(ids(await search('how to export data')), ['snowflake', 'sheets']);
});

test('"keboola cli": "keboola" on every page does not demote the CLI page', async () => {
  const kbagent = result(
    'kbagent',
    `${repeat('Keboola', 12)} ${repeat('CLI', 3)} client`,
    /^(keboola|cli)/i,
  );
  // the old ratio counted all 16 locations, 3 of them "cli", and moved
  // kbagent below this page
  const overview = result('overview', `${repeat('CLI', 2)} commands`, /^(keboola|cli)/i);
  fake.results = [kbagent, overview];
  assert.deepEqual(ids(await search('keboola cli')), ['kbagent', 'overview']);
});

test('a fragment whose load failed gets its original data() back', async () => {
  const failing = result('dark-sky', '', /x/, () => Promise.reject(new Error('offline')));
  const original = failing.data;
  const streamlit = result('streamlit', repeat('apps', 3), /^app/i);
  fake.results = [failing, streamlit];
  assert.deepEqual(ids(await search('apps')), ['dark-sky', 'streamlit']);
  assert.equal(failing.data, original);
});

test('slow fragments: after the timeout the ranking comes back unchanged', async () => {
  // dark-sky alone would be demoted, but streamlit's fragment never arrives
  const darkSky = result('dark-sky', `${repeat('Apple', 6)} apps`, /^app/i);
  const stalled = result('streamlit', '', /x/, () => new Promise(() => {}));
  fake.results = [darkSky, stalled];
  const started = Date.now();
  assert.deepEqual(ids(await search('apps')), ['dark-sky', 'streamlit']);
  assert.ok(Date.now() - started < 1000, 'waited past the timeout');
  // the finished load is still handed to the UI
  await darkSky.data();
  assert.equal(darkSky.loads, 1);
});

test('"export": longer forms like "exporter" and "exported" are real matches, not prefix noise', async () => {
  // 10 "exporter", 4 "export": the plural fold alone counted this page as
  // prefix-only and moved it below the Storage API page
  const tde = result('tde', `${repeat('exporter', 10)} ${repeat('export', 4)} Tableau`, /^export/i);
  const storageApi = result('storage-api', `${repeat('exported', 3)} exporting export`, /^export/i);
  const flows = result('flows', `${repeat('export', 2)} schedule`, /^export/i);
  const kbagent = result('kbagent', `export ${repeat('command', 5)}`, /^export/i);
  fake.results = [tde, storageApi, flows, kbagent];
  assert.deepEqual(ids(await search('export')), ['tde', 'storage-api', 'flows', 'kbagent']);
});

test('"config": when most checked pages are prefix-only, the last word is a prefix and nothing moves', async () => {
  // "configuration" outnumbers "config" on almost every page; demoting them
  // all would only put the unchecked results first
  const flows = result('flows', `${repeat('configuration', 6)} config`, /^config/i);
  const storageApi = result('storage-api', `${repeat('configured', 4)} configs`, /^config/i);
  const tde = result('tde', `${repeat('configuration', 3)} Tableau`, /^config/i);
  const kbagent = result('kbagent', `${repeat('config', 5)} configuration`, /^config/i);
  fake.results = [flows, storageApi, tde, kbagent];
  assert.deepEqual(ids(await search('config')), ['flows', 'storage-api', 'tde', 'kbagent']);
});
