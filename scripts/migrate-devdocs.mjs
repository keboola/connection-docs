#!/usr/bin/env node
/**
 * migrate-devdocs.mjs — port developer-docs (Jekyll) pages into this Astro/Starlight repo.
 *
 * Part of the help + developers unification: developers.keboola.com is integrated INTO
 * help.keboola.com (one site). This is the mechanical, lossless port — NO content rework.
 *
 * Usage:
 *   node scripts/migrate-devdocs.mjs <devdocs-src-dir> <section> [--dry]
 *   e.g. node scripts/migrate-devdocs.mjs /tmp/devdocs-src automate
 *
 * URL scheme: PRESERVE dev paths (permalink -> slug, no namespace prefix). Dev top-levels
 * (/extend/, /cli/, /integrate/, /automate/) are disjoint from help's, so paths survive as-is.
 * Collisions with an existing help slug are a hard error (fix via SLUG_OVERRIDES), never a
 * silent overwrite. Never prunes; only writes.
 *
 * Reuses the transform ideas from the legacy scripts/migrate.mjs (Jekyll->Astro) but is
 * parameterized on an explicit source dir + single section, and drops all first-site specifics.
 */
import {
  readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync, copyFileSync,
} from 'node:fs';
import { join, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST_DOCS = join(REPO, 'src', 'content', 'docs');
const DEST_PUBLIC = join(REPO, 'public');

const [, , SRC_ARG, SECTION, ...rest] = process.argv;
const DRY = rest.includes('--dry');
if (!SRC_ARG || !SECTION) {
  console.error('Usage: node scripts/migrate-devdocs.mjs <devdocs-src-dir> <section> [--dry]');
  process.exit(1);
}
const SRC = SRC_ARG;
const SRC_SECTION = join(SRC, SECTION);
if (!existsSync(SRC_SECTION)) {
  console.error(`Section not found: ${SRC_SECTION}`);
  process.exit(1);
}

const IMG_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']);

// Pages whose derived slug would collide with an existing help page — map to a new slug here.
const SLUG_OVERRIDES = {
  // 'overview': 'overview/api-docs',  // dev /overview/ index vs help /overview/ (handle in the overview PR)
};

/* ------------------------------ frontmatter ------------------------------ */

function permalinkToSlug(permalink) {
  const v = permalink.trim().replace(/^['"]|['"]$/g, '');
  if (v === '/') return '';
  return v.replace(/^\//, '').replace(/\/$/, '');
}

// Line-based transform so unknown keys pass through untouched (matches migrate.mjs approach).
function transformFrontmatter(fmRaw) {
  const out = [];
  let slug = null;
  for (const line of fmRaw.split('\n')) {
    const m = line.match(/^permalink:\s*(.+)$/);
    if (m) {
      slug = permalinkToSlug(m[1]);
      if (SLUG_OVERRIDES[slug] !== undefined) slug = SLUG_OVERRIDES[slug];
      out.push(`slug: '${slug}'`);
      continue;
    }
    if (/^(layout|showBreadcrumbs):/.test(line)) continue; // Jekyll-only, drop
    out.push(line);
  }
  return { fm: out.join('\n'), slug };
}

/* --------------------------------- body ---------------------------------- */

const stripTocMarkers = (b) =>
  b.replace(/^[ \t]*\*\s*TOC\s*$/gm, '').replace(/^[ \t]*\{:toc\}\s*$/gm, '');

const stripImagePopup = (b) => b.replace(/^\s*\{:\s*\.image-popup\}\s*$/gm, '');

const stripKramdownAttrs = (b) => b.replace(/^\s*\{:\s*\.[^}]*\}\s*$/gm, '');

const convertComments = (b) =>
  b.replace(/\{%\s*comment\s*%\}([\s\S]*?)\{%\s*endcomment\s*%\}/g, '<!--$1-->');

const stripRaw = (b) => b.replace(/\{%\s*(end)?raw\s*%\}/g, '');

const convertHighlight = (b) =>
  b
    .replace(/\{%\s*highlight\s+(\w+)\s*%\}/g, '```$1')
    .replace(/\{%\s*endhighlight\s*%\}/g, '```');

// Collapse blank-line runs (leftovers from stripped markers) to at most one blank line.
const tidyBlankLines = (b) => b.replace(/\n{3,}/g, '\n\n');

function transformBody(body) {
  let b = body;
  b = convertComments(b);
  b = convertHighlight(b);
  b = stripImagePopup(b);
  b = stripTocMarkers(b);
  b = stripKramdownAttrs(b);
  b = stripRaw(b);
  b = tidyBlankLines(b);
  return b;
}

/* --------------------------------- walk ---------------------------------- */

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function destForSlug(slug) {
  // Repo convention: every page is <slug>/index.md with an explicit slug.
  return join(DEST_DOCS, slug, 'index.md');
}

const files = walk(SRC_SECTION);
const mdFiles = files.filter((f) => extname(f) === '.md');
const imgFiles = files.filter((f) => IMG_EXT.has(extname(f).toLowerCase()));

const written = [];
const collisions = [];

for (const file of mdFiles) {
  const raw = readFileSync(file, 'utf8').replace(/\r\n/g, '\n'); // normalize CRLF (dev repo is mixed)
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!fmMatch) {
    console.warn(`skip (no frontmatter): ${relative(SRC, file)}`);
    continue;
  }
  const [, fmRaw, bodyRaw] = fmMatch;
  const { fm, slug } = transformFrontmatter(fmRaw);
  if (slug == null) {
    console.warn(`skip (no permalink): ${relative(SRC, file)}`);
    continue;
  }
  const dest = destForSlug(slug);
  // Collision guard: refuse to overwrite an existing help page.
  if (existsSync(dest) && !written.includes(dest)) {
    collisions.push({ slug, dest: relative(REPO, dest), from: relative(SRC, file) });
    continue;
  }
  const body = transformBody(bodyRaw);
  const outContent = `---\n${fm}\n---\n${body.startsWith('\n') ? '' : '\n'}${body}`;
  if (!DRY) {
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, outContent);
  }
  written.push(dest);
  console.log(`${DRY ? '[dry] ' : ''}page  ${slug}  <- ${relative(SRC, file)}`);
}

// Images: dev docs reference them by ABSOLUTE path (/section/img.png) from multiple pages, so
// copy to BOTH public/ (absolute refs resolve as static files for any page) and the co-located
// src/content/docs (repo convention + click-to-zoom). Mirrors the legacy migrate.mjs.
for (const img of imgFiles) {
  const relImg = relative(SRC, img); // e.g. automate/job-parameters.png
  for (const base of [DEST_PUBLIC, DEST_DOCS]) {
    const dest = join(base, relImg);
    if (!DRY) {
      mkdirSync(dirname(dest), { recursive: true });
      copyFileSync(img, dest);
    }
  }
  console.log(`${DRY ? '[dry] ' : ''}image ${relImg}`);
}

console.log(`\n${DRY ? '[dry] ' : ''}${written.length} page(s), ${imgFiles.length} image(s).`);
if (collisions.length) {
  console.error(`\nCOLLISIONS (add to SLUG_OVERRIDES and re-run):`);
  for (const c of collisions) console.error(`  ${c.slug}  (${c.from} -> existing ${c.dest})`);
  process.exit(2);
}
