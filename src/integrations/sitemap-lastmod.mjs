import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

/**
 * `lastmod` for the sitemap, from each page's frontmatter `lastUpdated`.
 *
 * Starlight adds @astrojs/sitemap with no options when the config has no
 * sitemap of its own; astro.config.mjs now adds it with `serialize` from here,
 * which Starlight then leaves alone (the only option Starlight sets is i18n,
 * and this site has one locale).
 *
 * The dates are the ones PageTitle.astro shows as "Updated <date>", which
 * scripts/gen-last-updated.mjs writes into frontmatter (PR #1134). Reading the
 * same field keeps the sitemap and the page from disagreeing. A page without a
 * date gets no `lastmod`, which the sitemap protocol allows; a wrong date
 * would be worse than none.
 */

function findPages(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) findPages(full, files);
    else if (extname(full) === '.md' || extname(full) === '.mdx') files.push(full);
  }
  return files;
}

/** `slug` and `lastUpdated` from a page's frontmatter, as written in this repo. */
export function pageDates(content) {
  const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return null;
  const field = (name) => fm[1].match(new RegExp(`^${name}:[ \\t]*['"]?([^'"\\r\\n]*?)['"]?[ \\t]*$`, 'm'))?.[1];
  const slug = field('slug');
  const date = field('lastUpdated');
  if (slug === undefined || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return { slug: slug.replace(/^\/|\/$/g, ''), date };
}

/** Page URL (as the sitemap writes it) to its `YYYY-MM-DD` date. */
export function lastmodByUrl(contentDir, site) {
  const map = new Map();
  for (const file of findPages(contentDir)) {
    const page = pageDates(readFileSync(file, 'utf-8'));
    if (page) map.set(new URL(page.slug ? `/${page.slug}/` : '/', site).href, page.date);
  }
  return map;
}

/** Options for @astrojs/sitemap: `serialize` stamps each URL that has a date. */
export function sitemapOptions({ contentDir, site }) {
  let dates;
  return {
    serialize(item) {
      dates ??= lastmodByUrl(contentDir, site);
      const date = dates.get(item.url);
      return date ? { ...item, lastmod: date } : item;
    },
  };
}
