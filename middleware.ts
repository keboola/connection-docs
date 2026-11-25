/**
 * Vercel Routing Middleware: serve a page's markdown twin to a client that
 * asks for markdown.
 *
 *   curl -H 'Accept: text/markdown' https://help.keboola.com/storage/
 *
 * returns the same text as https://help.keboola.com/storage/index.md. Any other
 * request (every browser) gets the HTML page as before.
 *
 * Why middleware and not a `rewrites` rule in vercel.json: Vercel checks the
 * filesystem before rewrites, and /storage/ is a file (storage/index.html), so
 * a rewrite conditioned on the Accept header never fires for a page. Middleware
 * runs before the filesystem.
 *
 * Cost: it runs once per request to a page path (the matcher skips assets,
 * Pagefind, /api and anything with a file extension). `Vary: Accept` keeps
 * caches from handing the HTML to a markdown client or the reverse.
 */
import { next, rewrite } from '@vercel/functions/middleware';
import { prefersMarkdown, twinPath } from './src/lib/markdown-negotiation.mjs';

export const config = {
  // paths with no dot outside /api, /_astro and /pagefind: the pages
  matcher: ['/((?!api/|_astro/|pagefind/)[^.]*)'],
};

export default function middleware(request: Request): Response {
  const url = new URL(request.url);
  const twin = twinPath(url.pathname);
  if (twin && prefersMarkdown(request.headers.get('accept'))) {
    return rewrite(new URL(twin, url), { headers: { Vary: 'Accept' } });
  }
  return next({ headers: { Vary: 'Accept' } });
}
