/**
 * docs-corpus.mjs — shared loader for scripts that read the docs as a corpus
 * (vault export, chunking, future embedding/audit tooling).
 *
 * Reads every page under src/content/docs, parses its frontmatter with a real
 * YAML parser (so list fields such as `redirect_from` survive), flattens MDX
 * to plain markdown with the same `stripMdx` the site build uses for the
 * per-page `index.md` copies, and joins it with `_data/navigation.yml` so each
 * page knows its section and nav parent.
 *
 * Nothing here writes to disk.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { stripMdx, stripFrontmatter } from '../../src/integrations/page-markdown.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, '..', '..');
export const CONTENT_DIR = join(ROOT, 'src', 'content', 'docs');
export const NAV_FILE = join(ROOT, '_data', 'navigation.yml');
export const SITE = 'https://help.keboola.com';

const ASSET_EXT = /\.(png|jpe?g|gif|svg|webp|pdf|docx?|xlsx?|csv|json|zip|txt|xml|mp4|ipynb|md)$/i;

/** Normalise any site URL / path to a slug: "/storage/api/" -> "storage/api", "/" -> "". */
export function toSlug(url) {
  if (url == null) return null;
  let s = String(url).trim();
  s = s.replace(/^https?:\/\/help\.keboola\.com/i, '');
  s = s.split('#')[0].split('?')[0];
  s = s.replace(/^\/+|\/+$/g, '');
  return s;
}

export function slugToUrl(slug) {
  return slug ? `${SITE}/${slug}/` : `${SITE}/`;
}

/** True for absolute-path links that point at a static asset rather than a page. */
export function isAssetPath(path) {
  return ASSET_EXT.test(path.split('#')[0].split('?')[0]);
}

function findMarkdownFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) findMarkdownFiles(full, files);
    else if (extname(full) === '.md' || extname(full) === '.mdx') files.push(full);
  }
  return files;
}

export function parseFrontmatterYaml(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  try {
    return yaml.load(match[1]) ?? {};
  } catch {
    return {};
  }
}

/**
 * Load the sidebar tree and return { sectionTitle: Map<slug,title>,
 * parent: Map<slug, slug|null>, order: Map<slug, number>, depth: Map<slug, number> }.
 * The section of a page is the top-level nav item it sits under.
 */
export function loadNav() {
  const nav = yaml.load(readFileSync(NAV_FILE, 'utf-8'));
  const parent = new Map();
  const depth = new Map();
  const order = new Map();
  const navTitle = new Map();
  const section = new Map();
  let i = 0;

  const walk = (items, parentSlug, sectionSlug, d) => {
    for (const item of items ?? []) {
      if (!item.url) continue;
      const slug = toSlug(item.url);
      const sec = d === 0 ? slug : sectionSlug;
      parent.set(slug, parentSlug);
      depth.set(slug, d);
      order.set(slug, i++);
      navTitle.set(slug, item.title);
      section.set(slug, sec);
      walk(item.items, slug, sec, d + 1);
    }
  };
  walk(nav.items, null, null, 0);
  return { parent, depth, order, navTitle, section };
}

/** Drop inline <script>/<style> blocks — page-embedded JS/CSS, never prose. */
export function stripEmbeddedCode(body) {
  return body.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
}

/**
 * Load every docs page.
 *
 * Returns { pages, bySlug, resolve } where `resolve(path)` maps any absolute
 * site path (current slug, legacy `redirect_from` URL, with or without slash)
 * to a canonical slug, or null when nothing matches.
 */
export function loadCorpus() {
  const nav = loadNav();
  const pages = [];
  const bySlug = new Map();
  const legacy = new Map();

  for (const file of findMarkdownFiles(CONTENT_DIR).sort()) {
    const raw = readFileSync(file, 'utf-8');
    const fm = parseFrontmatterYaml(raw);
    if (fm.slug == null) continue;
    const slug = toSlug(fm.slug);
    const body = stripEmbeddedCode(stripMdx(stripFrontmatter(raw))).trim();
    const redirects = []
      .concat(fm.redirect_from ?? [])
      .map(toSlug)
      .filter((s) => s !== slug);

    const sectionSlug = nav.section.has(slug) ? nav.section.get(slug) : slug.split('/')[0];
    const page = {
      slug,
      url: slugToUrl(slug),
      file: relative(ROOT, file),
      title: String(fm.title ?? slug),
      description: fm.description ? String(fm.description).replace(/\s+/g, ' ').trim() : '',
      redirectFrom: redirects,
      section: sectionSlug,
      navParent: nav.parent.get(slug) ?? null,
      navDepth: nav.depth.get(slug) ?? null,
      navOrder: nav.order.get(slug) ?? null,
      inNav: nav.parent.has(slug),
      body,
    };
    pages.push(page);
    bySlug.set(slug, page);
    for (const r of redirects) if (!legacy.has(r)) legacy.set(r, slug);
  }

  // Section title = title of the section's root page, falling back to nav title.
  for (const p of pages) {
    p.sectionTitle = bySlug.get(p.section)?.title ?? nav.navTitle.get(p.section) ?? p.section;
  }

  const resolveSlug = (path) => {
    const s = toSlug(path);
    if (s == null) return null;
    if (bySlug.has(s)) return s;
    if (legacy.has(s)) return legacy.get(s);
    return null;
  };

  return { pages, bySlug, nav, resolve: resolveSlug };
}

/**
 * Split a markdown body into { heading, level, lines } blocks, ignoring `#`
 * lines that sit inside fenced code (shell comments look like H1s otherwise).
 * The first block (before any heading) has level 0 and heading null.
 */
export function splitByHeadings(body, maxLevel = 6) {
  const blocks = [{ heading: null, level: 0, lines: [] }];
  let fence = null;
  for (const line of body.split('\n')) {
    const f = line.match(/^\s*(`{3,}|~{3,})/);
    if (f) {
      if (!fence) fence = f[1][0];
      else if (f[1][0] === fence) fence = null;
      blocks[blocks.length - 1].lines.push(line);
      continue;
    }
    const h = !fence && line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (h && h[1].length <= maxLevel) {
      blocks.push({ heading: h[2].trim(), level: h[1].length, lines: [] });
    } else {
      blocks[blocks.length - 1].lines.push(line);
    }
  }
  return blocks;
}

/** GitHub-style heading anchor. */
export function headingAnchor(text) {
  return String(text)
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}
