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
 *   0. pages that list the query in their `search_keywords` frontmatter,
 *      for when two pages fit and an editor picked one ("mcp"),
 *   1. pages whose title is exactly the query ("limits" → "Limits"),
 *   2. pages whose title has every query word,
 *   3. pages where the title and URL together have every word
 *      ("app authentication" → /data-apps/authentication/),
 *   4. everything else, in Pagefind's order, except that among Pagefind's
 *      first 30, pages whose title or URL has some of the words move up,
 *      rarer words counting more ("create app" → the Apps pages).
 * Then, among the first 20 results of group 4, pages where most matched words
 * are only prefix matches ("Apple" for "apps") move to the end.
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
  'keboola a an and are can do does for from how i in is it my of on or the to what when where why with'.split(
    ' ',
  ),
);

// keepStopWords is for the exact-title check, so "What are Keboola apps" is
// an exact match for that title and not for "Apps".
const words = (s, { keepStopWords = false } = {}) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/[\s-]+/)
    // single letters stay: "R" is a language here
    .filter((w) => w && (keepStopWords || !STOP_WORDS.has(w)))
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
    .then((rows) => {
      const byId = new Map(
        rows.map(([id, title, url, keywords = '']) => {
          const segments = url.split('/').filter(Boolean);
          if (!segments.length) return [id, null];
          const titleWords = new Set(words(title));
          const allTitleWords = new Set(words(title, { keepStopWords: true }));
          return [
            id,
            {
              titleWords,
              allTitleWords,
              keywords: keywords
                .split('|')
                .map((phrase) => new Set(words(phrase)))
                .filter((phrase) => phrase.size),
              urlWords: new Set([...titleWords, ...words(segments.join(' '))]),
              depth: segments.length,
            },
          ];
        }),
      );
      // How many pages name each word in their title or URL, for weighting
      // partial matches: "variables" says more than "data".
      const pageCount = new Map();
      for (const page of byId.values()) {
        for (const w of page?.urlWords ?? []) pageCount.set(w, (pageCount.get(w) ?? 0) + 1);
      }
      return { byId, pageCount, total: byId.size };
    }));

// Partial title/URL matches only reorder Pagefind's first results; further
// down, a shared word is more often a coincidence than a hint.
const PARTIAL_DEPTH = 30;

async function rerank(response, term) {
  const queryWords = [...new Set(words(term || ''))];
  const allQueryWords = new Set(words(term || '', { keepStopWords: true }));
  if (!response?.results?.length || !queryWords.length || queryWords.length > MAX_QUERY_WORDS) {
    return response;
  }
  const { byId, pageCount, total } = await loadPages();
  if (!byId.size) return response;
  const weight = (w) => Math.log(total / (pageCount.get(w) ?? total));

  const ranked = response.results.map((result, index) => {
    const page = byId.get(result.id);
    const tier = !page
      ? 0
      : page.keywords.some(
            (phrase) => phrase.size === queryWords.length && queryWords.every((w) => phrase.has(w)),
          )
        ? 4
        : queryWords.every((w) => page.titleWords.has(w))
          ? page.allTitleWords.size === allQueryWords.size &&
            [...allQueryWords].every((w) => page.allTitleWords.has(w))
            ? 3
            : 2
          : queryWords.every((w) => page.urlWords.has(w))
            ? 1
            : 0;
    const partial =
      tier || !page || index >= PARTIAL_DEPTH
        ? 0
        : queryWords.reduce((sum, w) => sum + (page.urlWords.has(w) ? weight(w) : 0), 0);
    return {
      result,
      index,
      tier,
      partial,
      depth: page?.depth ?? 0,
      titleLength: page?.titleWords.size ?? 0,
    };
  });
  ranked.sort(
    (a, b) =>
      b.tier - a.tier ||
      (a.tier ? a.depth - b.depth || a.titleLength - b.titleLength : b.partial - a.partial) ||
      a.index - b.index,
  );
  return { ...response, results: await demotePrefixOnly(ranked, queryWords) };
}

// How many of the first results without a title or URL match get their text
// checked. Each check downloads one ~3 KB fragment, which the UI reuses when
// it renders the result.
const PREFIX_CHECK_DEPTH = 20;

// Pagefind always matches the last query word as a prefix, so "apps" finds
// Dark Sky through "Apple", "apples" and "appKey". Among the first results
// that the title tiers didn't place, move down every page where most of the
// matched words aren't the query words themselves.
async function demotePrefixOnly(ranked, queryWords) {
  const checked = ranked.filter((r) => r.tier === 0).slice(0, PREFIX_CHECK_DEPTH);
  const weak = new Set(
    (
      await Promise.all(
        checked.map(async (r) => {
          const loaded = r.result.data();
          r.result.data = () => loaded;
          const data = await loaded.catch(() => null);
          if (!data?.locations?.length) return null;
          const contentWords = data.content.split(/\s+/);
          const exact = data.locations.filter((location) =>
            words(contentWords[location] ?? '').some((w) => queryWords.includes(w)),
          ).length;
          return exact * 2 < data.locations.length ? r : null;
        }),
      )
    ).filter(Boolean),
  );
  return [...ranked.filter((r) => !weak.has(r)), ...ranked.filter((r) => weak.has(r))].map(
    (r) => r.result,
  );
}

export async function search(term, options) {
  return rerank(await core.search(term, options), term);
}

export async function debouncedSearch(term, options, debounceTimeoutMs) {
  const response = await core.debouncedSearch(term, options, debounceTimeoutMs);
  // null means a newer call superseded this one; pass that through.
  return response === null ? null : rerank(response, term);
}
