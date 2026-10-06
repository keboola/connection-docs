/**
 * pagefind-rerank.js: Pagefind with title matches moved to the top.
 *
 * Why: Pagefind treats the last query word as a prefix, so "apps" also
 * matches "Apple", "apples" and "appKey". Those rare words carry a much higher
 * IDF than "app", so for "apps" the Dark Sky extractor page outranked the whole
 * Apps section, and the Apps hub itself sat at #79. Pagefind's ranking weights
 * can't fix that (we tried a grid of them), and quoted queries come back
 * unranked.
 *
 * What: re-exports the real Pagefind API unchanged, except search() and
 * debouncedSearch(), which reorder the results:
 *   1. pages whose title is exactly the query ("limits" → "Limits"),
 *   2. pages whose title has every query word,
 *   3. pages where the title and URL together have every word
 *      ("app authentication" → /data-apps/authentication/),
 *   4. everything else, in Pagefind's order.
 * Inside each group, shallower pages come first, so a section hub beats its
 * sub-pages, then shorter titles, then Pagefind's order. The home page is left
 * out: its title "Keboola User Documentation" would win "users".
 *
 * Titles come from /pagefind-titles.json (src/integrations/pagefind-titles.mjs),
 * keyed by Pagefind's result id, so reordering costs no fragment downloads. If
 * that file is missing, results pass through untouched.
 *
 * How it's wired: Head.astro maps /pagefind/pagefind.js to this file with an
 * import map, so Starlight's search modal loads it without a fork of
 * Search.astro. We import the real bundle with "?core" so the import map
 * doesn't send that import back here.
 */
import * as core from './pagefind/pagefind.js?core';

export * from './pagefind/pagefind.js?core';

// Long natural-language queries are what Pagefind's ranking handles fine.
const MAX_QUERY_WORDS = 4;

// Words that say nothing about which page is meant. "keboola" is in the
// queries people type but on every page, so a title like "Keboola Overview"
// shouldn't win "keboola cli".
const STOP_WORDS = new Set(
  'keboola a an and are can do does for from how i in is it my of on or the to what when where why with'.split(' '),
);

const words = (s) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/[\s-]+/)
    // single letters stay: "R" is a language here
    .filter((w) => w && !STOP_WORDS.has(w))
    // fold plurals: "apps" → "app", "branches" → "branch", "policies" → "policy"
    .map((w) =>
      w
        .replace(/ies$/, 'y')
        .replace(/(?<=(?:ch|sh|ss|x))es$/, '')
        .replace(/(?<=[a-z]{2}[^s])s$/, ''),
    );

let pages;
const loadPages = () =>
  (pages ??= fetch(new URL('./pagefind-titles.json', import.meta.url))
    .then((response) => (response.ok ? response.json() : []))
    .catch(() => [])
    .then(
      (rows) =>
        new Map(
          rows.map(([id, title, url]) => {
            const segments = url.split('/').filter(Boolean);
            if (!segments.length) return [id, null];
            const titleWords = new Set(words(title));
            return [
              id,
              {
                titleWords,
                urlWords: new Set([...titleWords, ...words(segments.join(' '))]),
                depth: segments.length,
              },
            ];
          }),
        ),
    ));

async function rerank(response, term) {
  const queryWords = [...new Set(words(term || ''))];
  if (!response?.results?.length || !queryWords.length || queryWords.length > MAX_QUERY_WORDS) {
    return response;
  }
  const byId = await loadPages();
  if (!byId.size) return response;

  const ranked = response.results.map((result, index) => {
    const page = byId.get(result.id);
    const tier = !page
      ? 0
      : queryWords.every((w) => page.titleWords.has(w))
        ? page.titleWords.size === queryWords.length
          ? 3
          : 2
        : queryWords.every((w) => page.urlWords.has(w))
          ? 1
          : 0;
    return { result, index, tier, depth: page?.depth ?? 0, titleLength: page?.titleWords.size ?? 0 };
  });
  ranked.sort(
    (a, b) =>
      b.tier - a.tier ||
      (a.tier ? a.depth - b.depth || a.titleLength - b.titleLength : 0) ||
      a.index - b.index,
  );
  return { ...response, results: ranked.map((r) => r.result) };
}

export async function search(term, options) {
  return rerank(await core.search(term, options), term);
}

export async function debouncedSearch(term, options, debounceTimeoutMs) {
  const response = await core.debouncedSearch(term, options, debounceTimeoutMs);
  // null means a newer call superseded this one; pass that through.
  return response === null ? null : rerank(response, term);
}
