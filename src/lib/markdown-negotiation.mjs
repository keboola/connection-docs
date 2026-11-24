/**
 * Content negotiation for the markdown twins, used by middleware.ts.
 *
 * A request that prefers `text/markdown` over `text/html` gets the page's
 * twin (<page>/index.md, written by src/integrations/page-markdown.mjs) at
 * the page's own URL. A browser never lists text/markdown, so it always gets
 * the HTML. Kept apart from middleware.ts so scripts/markdown-negotiation.test.ts
 * can run it without the Vercel runtime.
 */

/** Pages with no twin: Astro pages under <StarlightPage> (src/pages/). */
const NO_TWIN = new Set(['/404/', '/changelog/']);

/** Path prefixes that are never pages. */
const NOT_PAGES = /^\/(api|_astro|pagefind|fonts|assets)\//;

/**
 * The quality of each listed media range. A range without `q` counts as 1;
 * a malformed `q` counts as 0, as RFC 9110 has it ignored.
 */
function qualities(accept) {
  const q = new Map();
  for (const part of String(accept ?? '').split(',')) {
    const [type, ...params] = part.split(';').map((s) => s.trim().toLowerCase());
    if (!type) continue;
    const qp = params.find((p) => p.startsWith('q='));
    const value = qp ? Number(qp.slice(2)) : 1;
    q.set(type, Math.max(q.get(type) ?? 0, Number.isFinite(value) ? value : 0));
  }
  return q;
}

/**
 * True when the Accept header asks for markdown at least as much as HTML.
 * Wildcards are not read as a wish for markdown: `*\/*` is what every client
 * sends, and it must keep getting the page it always got.
 */
export function prefersMarkdown(accept) {
  const q = qualities(accept);
  const md = q.get('text/markdown') ?? 0;
  if (md <= 0) return false;
  return md >= (q.get('text/html') ?? 0);
}

/**
 * The twin's path for a page URL path, or null when the path is not a page
 * with a twin (an asset, a function, a file with an extension).
 */
export function twinPath(pathname) {
  if (NOT_PAGES.test(pathname)) return null;
  const last = pathname.split('/').pop() ?? '';
  if (last.includes('.')) return null;
  const page = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (NO_TWIN.has(page)) return null;
  return `${page}index.md`;
}
