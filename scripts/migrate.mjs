#!/usr/bin/env node

/**
 * migrate.mjs — Jekyll-to-Starlight content migration script
 *
 * Transforms all Jekyll markdown files to Starlight format and copies them
 * (along with images) to src/content/docs/.
 *
 * Usage:  node scripts/migrate.mjs
 *
 * This script is idempotent — running it again produces the same result.
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, extname, relative, resolve } from 'path';
import yaml from 'js-yaml';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const DEST_DOCS = join(ROOT, 'src', 'content', 'docs');
const DEST_ASSETS = join(ROOT, 'src', 'assets');
const DEST_PUBLIC = join(ROOT, 'public');

/** Directories / path prefixes to skip when scanning for .md files */
const SKIP_DIRS = new Set([
  '_includes', '_layouts', '_sass', '_data', '_site',
  'node_modules', 'src', 'scripts', '.worktrees', '.git',
  '.github', '.claude', 'assets', 'public',
]);

/** Specific root-level files to skip */
const SKIP_FILES = new Set(['README.md', 'LICENSE', 'LICENSE.md', 'CONTRIBUTING.md']);

/** Image extensions to copy */
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']);

// ---------------------------------------------------------------------------
// Counters for the summary
// ---------------------------------------------------------------------------

const stats = {
  mdFiles: 0,
  imagesCopied: 0,
  permalinksConverted: 0,
  layoutsRemoved: 0,
  showBreadcrumbsRemoved: 0,
  sitemapConverted: 0,
  tocRemoved: 0,
  highlightBlocks: 0,
  tipIncludes: 0,
  warningIncludes: 0,
  publicBetaIncludes: 0,
  privateBetaIncludes: 0,
  imagePopupRemoved: 0,
  kramdownAttrsRemoved: 0,
  rawTagsStripped: 0,
  commentTagsConverted: 0,
  overviewHeadingsRemoved: 0,
  redirectToPagesSkipped: 0,
  redirectFromAliasesInjected: 0,
};

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

/**
 * Recursively collect file paths under `dir` that match a predicate.
 * Skips directories listed in SKIP_DIRS (only at the first path segment).
 */
function walkDir(dir, predicate, collected = [], depth = 0) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return collected;
  }

  for (const entry of entries) {
    // At the top level, skip excluded directories and specific files
    if (depth === 0 && SKIP_DIRS.has(entry)) continue;
    if (depth === 0 && SKIP_FILES.has(entry)) continue;
    // Skip any directory starting with _ at top level (catches future additions)
    if (depth === 0 && entry.startsWith('_')) continue;

    const full = join(dir, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }

    if (st.isDirectory()) {
      walkDir(full, predicate, collected, depth + 1);
    } else if (predicate(entry, full)) {
      collected.push(full);
    }
  }
  return collected;
}

/** Return all .md files that should be migrated. */
function findMarkdownFiles() {
  return walkDir(ROOT, (name) => extname(name) === '.md');
}

/** Return all image files that should be copied. */
function findImageFiles() {
  return walkDir(ROOT, (name) => IMAGE_EXTS.has(extname(name).toLowerCase()));
}

// ---------------------------------------------------------------------------
// Frontmatter transformation
// ---------------------------------------------------------------------------

/**
 * Split a file into { frontmatter: string, body: string }.
 * `frontmatter` includes the leading/trailing `---` lines.
 */
function splitFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { frontmatter: '', body: content };
  const fmRaw = match[1];
  const afterIdx = match[0].length;
  return { frontmatter: fmRaw, body: content.slice(afterIdx) };
}

/**
 * Transform Jekyll frontmatter lines to Starlight equivalents.
 * Returns the new frontmatter string (without surrounding ---).
 */
function transformFrontmatter(fmRaw) {
  const lines = fmRaw.split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    // Strip trailing \r to handle Windows line endings
    const line = lines[i].replace(/\r$/, '');

    // --- permalink → slug ---
    const permalinkMatch = line.match(/^permalink:\s*(.+)$/);
    if (permalinkMatch) {
      let value = permalinkMatch[1].trim();
      // Strip surrounding quotes if any
      value = value.replace(/^['"]|['"]$/g, '');

      if (value === '/') {
        // Homepage
        out.push("slug: ''");
      } else if (value === '/404.html') {
        out.push("slug: '404'");
      } else {
        // Strip leading slash, strip trailing slash
        let slug = value.replace(/^\//, '').replace(/\/$/, '');
        out.push(`slug: '${slug}'`);
      }
      stats.permalinksConverted++;
      i++;
      continue;
    }

    // --- Remove layout: ---
    if (/^layout:\s/.test(line)) {
      stats.layoutsRemoved++;
      i++;
      continue;
    }

    // --- Remove showBreadcrumbs: ---
    if (/^showBreadcrumbs:\s/.test(line)) {
      stats.showBreadcrumbsRemoved++;
      i++;
      continue;
    }

    // --- sitemap: false → pagefind: false ---
    if (/^sitemap:\s*false/.test(line)) {
      out.push('pagefind: false');
      stats.sitemapConverted++;
      i++;
      continue;
    }

    // Everything else passes through (title, redirect_from, etc.)
    out.push(line);
    i++;
  }

  return out.join('\n');
}

// ---------------------------------------------------------------------------
// Body / content transformations
// ---------------------------------------------------------------------------

/**
 * Remove TOC markers:  `* TOC` and `{:toc}` lines
 */
function removeTocMarkers(body) {
  const before = body;
  body = body.replace(/^[ \t]*\*\s*TOC\s*$/gm, '');
  body = body.replace(/^[ \t]*\{:toc\}\s*$/gm, '');
  if (body !== before) stats.tocRemoved++;
  return body;
}

/**
 * Convert Jekyll highlight blocks:
 *   {% highlight lang %}...{% endhighlight %}
 * →
 *   ```lang
 *   ...
 *   ```
 */
function convertHighlightBlocks(body) {
  return body.replace(
    /\{%\s*highlight\s+(\w+)\s*%\}\s*\n([\s\S]*?)\{%\s*endhighlight\s*%\}/g,
    (_match, lang, code) => {
      stats.highlightBlocks++;
      // Trim trailing whitespace/newlines from the code block content
      const trimmed = code.replace(/\n\s*$/, '\n');
      return '```' + lang + '\n' + trimmed + '```';
    }
  );
}

/**
 * Convert {% include tip.html ... %} to Starlight :::tip admonitions.
 *
 * Handles:
 *   - Single-line and multi-line content
 *   - Optional title= attribute
 *   - Closing `" %}` possibly split across lines (e.g. `"\n%}`)
 */
function convertTipIncludes(body) {
  // Pattern with title
  body = body.replace(
    /\{%\s*include\s+tip\.html\s+title="([^"]*?)"\s+content="([\s\S]*?)"\s*%\}/g,
    (_match, title, content) => {
      stats.tipIncludes++;
      const trimmed = content.replace(/^\n+/, '').replace(/\n+$/, '');
      return `:::tip[${title}]\n${trimmed}\n:::`;
    }
  );

  // Pattern without title
  body = body.replace(
    /\{%\s*include\s+tip\.html\s+content="([\s\S]*?)"\s*%\}/g,
    (_match, content) => {
      stats.tipIncludes++;
      const trimmed = content.replace(/^\n+/, '').replace(/\n+$/, '');
      return `:::tip\n${trimmed}\n:::`;
    }
  );

  return body;
}

/**
 * Convert {% include warning.html ... %} to Starlight :::caution admonitions.
 *
 * Same shape as tip includes.
 */
function convertWarningIncludes(body) {
  // Pattern with title
  body = body.replace(
    /\{%\s*include\s+warning\.html\s+title="([^"]*?)"\s+content="([\s\S]*?)"\s*%\}/g,
    (_match, title, content) => {
      stats.warningIncludes++;
      const trimmed = content.replace(/^\n+/, '').replace(/\n+$/, '');
      return `:::caution[${title}]\n${trimmed}\n:::`;
    }
  );

  // Pattern without title
  body = body.replace(
    /\{%\s*include\s+warning\.html\s+content="([\s\S]*?)"\s*%\}/g,
    (_match, content) => {
      stats.warningIncludes++;
      const trimmed = content.replace(/^\n+/, '').replace(/\n+$/, '');
      return `:::caution\n${trimmed}\n:::`;
    }
  );

  return body;
}

/**
 * Convert {% include public-beta-warning.html %} to a :::caution admonition.
 */
function convertPublicBetaWarning(body) {
  return body.replace(
    /\{%\s*include\s+public-beta-warning\.html\s*%\}/g,
    () => {
      stats.publicBetaIncludes++;
      return ':::caution[Public Beta]\nThis feature is currently in public beta. Please provide feedback using the feedback button in your project.\n:::';
    }
  );
}

/**
 * Convert {% include private-beta-warning.html %} to a :::caution admonition.
 */
function convertPrivateBetaWarning(body) {
  return body.replace(
    /\{%\s*include\s+private-beta-warning\.html\s*%\}/g,
    () => {
      stats.privateBetaIncludes++;
      return ':::caution[Private Beta]\nThis feature is currently in private beta.\n:::';
    }
  );
}

/**
 * Remove `{: .image-popup}` lines entirely.
 */
function removeImagePopup(body) {
  return body.replace(/^[ \t]*\{:\s*\.image-popup\}\s*\n?/gm, () => {
    stats.imagePopupRemoved++;
    return '';
  });
}

/**
 * Remove other Kramdown attribute lists `{: .something}` lines.
 */
function removeKramdownAttrs(body) {
  return body.replace(/^[ \t]*\{:\s*\.[^}]+\}\s*\n?/gm, () => {
    stats.kramdownAttrsRemoved++;
    return '';
  });
}

/**
 * Strip `{% raw %}` and `{% endraw %}` tags — they are no-ops in Astro.
 */
function stripRawTags(body) {
  const before = body;
  body = body.replace(/\{%\s*(?:end)?raw\s*%\}/g, '');
  if (body !== before) stats.rawTagsStripped++;
  return body;
}

/**
 * Convert `{% comment %}...{% endcomment %}` blocks to HTML comments.
 */
function convertCommentTags(body) {
  const before = body;
  body = body.replace(
    /\{%\s*comment\s*%\}([\s\S]*?)\{%\s*endcomment\s*%\}/g,
    (_match, content) => `<!-- ${content.trim()} -->`
  );
  if (body !== before) stats.commentTagsConverted++;
  return body;
}

/**
 * Apply all body transformations in the correct order.
 */
/**
 * Strip a leading `## Overview` H2 heading. Only removes when `## Overview`
 * is the first H2 in the body — a Jekyll-era organizational wrapper that's
 * redundant under Starlight's page-title + intro lede convention. A mid-page
 * `## Overview` (i.e. preceded by other H2s) is preserved.
 */
function stripLeadingOverviewHeading(body) {
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!/^## /.test(lines[i])) continue;
    if (/^##\s+Overview\s*$/.test(lines[i])) {
      lines.splice(i, 1);
      if (i < lines.length && lines[i] === '') lines.splice(i, 1);
      stats.overviewHeadingsRemoved++;
    }
    break;
  }
  return lines.join('\n');
}

function transformBody(body) {
  body = removeTocMarkers(body);
  body = convertHighlightBlocks(body);
  body = convertTipIncludes(body);
  body = convertWarningIncludes(body);
  body = convertPublicBetaWarning(body);
  body = convertPrivateBetaWarning(body);
  // image-popup must come before generic kramdown attrs
  // (since {: .image-popup} also matches the generic pattern)
  body = removeImagePopup(body);
  body = removeKramdownAttrs(body);
  // Strip residual Liquid tags that are no-ops in Astro
  body = stripRawTags(body);
  body = convertCommentTags(body);
  body = stripLeadingOverviewHeading(body);
  return body;
}

// ---------------------------------------------------------------------------
// Full file transform
// ---------------------------------------------------------------------------

/**
 * Inject extra entries into the frontmatter's `redirect_from:` list.
 * If a `redirect_from:` block exists, appends entries at the end of its list.
 * If not, appends a new `redirect_from:` block at the end of the frontmatter.
 */
function injectRedirectAliases(fmRaw, aliases) {
  if (!aliases || aliases.length === 0) return fmRaw;

  const lines = fmRaw.split('\n');
  let listStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^redirect_from:\s*$/.test(lines[i])) {
      listStart = i;
      break;
    }
  }

  const aliasLines = aliases.map((a) => `  - ${a}`);
  if (listStart >= 0) {
    let endIdx = listStart + 1;
    while (endIdx < lines.length && /^\s+-\s/.test(lines[endIdx])) endIdx++;
    lines.splice(endIdx, 0, ...aliasLines);
  } else {
    // Drop any trailing blank line so the new block sits flush
    while (lines.length && lines[lines.length - 1] === '') lines.pop();
    lines.push('redirect_from:', ...aliasLines);
  }

  stats.redirectFromAliasesInjected += aliases.length;
  return lines.join('\n');
}

/**
 * Pre-scan all markdown files for `redirect_to:` frontmatter and build:
 *   - aliasMap: target permalink → array of paths to append to its redirect_from
 *   - skipPaths: absolute paths of files to skip writing (the redirect stubs)
 *
 * This replicates Jekyll's jekyll-redirect-from behavior for `redirect_to`,
 * which the Astro redirect-from integration does not honor natively.
 */
function buildRedirectAliasMap(mdFiles) {
  const aliasMap = new Map();
  const skipPaths = new Set();

  for (const absPath of mdFiles) {
    const content = readFileSync(absPath, 'utf-8');
    const { frontmatter } = splitFrontmatter(content);
    if (!frontmatter) continue;

    let fm;
    try {
      fm = yaml.load(frontmatter);
    } catch {
      continue;
    }
    if (!fm || typeof fm !== 'object' || !fm.redirect_to) continue;

    const target = String(fm.redirect_to).replace(/\/$/, '') + '/';
    const aliases = [];
    if (fm.permalink) aliases.push(String(fm.permalink));
    if (Array.isArray(fm.redirect_from)) {
      for (const r of fm.redirect_from) aliases.push(String(r));
    }

    if (!aliasMap.has(target)) aliasMap.set(target, []);
    aliasMap.get(target).push(...aliases);
    skipPaths.add(absPath);
  }

  return { aliasMap, skipPaths };
}

/**
 * Extract this file's permalink (with trailing slash) so we can look it up
 * in the redirect alias map.
 */
function getPermalinkForLookup(frontmatter) {
  if (!frontmatter) return null;
  let fm;
  try {
    fm = yaml.load(frontmatter);
  } catch {
    return null;
  }
  if (!fm || typeof fm !== 'object' || !fm.permalink) return null;
  return String(fm.permalink).replace(/\/$/, '') + '/';
}

function transformFile(content, aliases) {
  const { frontmatter, body } = splitFrontmatter(content);

  let fmToTransform = frontmatter;
  if (frontmatter && aliases && aliases.length) {
    fmToTransform = injectRedirectAliases(frontmatter, aliases);
  }

  const newFm = fmToTransform ? transformFrontmatter(fmToTransform) : '';
  const newBody = transformBody(body);

  if (newFm) {
    return '---\n' + newFm + '\n---' + newBody;
  }
  return newBody;
}

// ---------------------------------------------------------------------------
// File writing helpers
// ---------------------------------------------------------------------------

function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

function writeFileSafe(dest, content) {
  ensureDir(dest);
  writeFileSync(dest, content, 'utf-8');
}

function copyFileSafe(src, dest) {
  ensureDir(dest);
  copyFileSync(src, dest);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log('=== Jekyll → Starlight migration ===');
  console.log(`Root:        ${ROOT}`);
  console.log(`Destination: ${DEST_DOCS}`);
  console.log();

  // ---- 1. Migrate markdown files ----
  console.log('Scanning for markdown files...');
  const mdFiles = findMarkdownFiles();
  console.log(`Found ${mdFiles.length} markdown files to process.\n`);

  // Pre-scan for redirect_to pages so we can skip them and fold their
  // permalinks into the target page's redirect_from list.
  const { aliasMap, skipPaths } = buildRedirectAliasMap(mdFiles);

  for (const absPath of mdFiles) {
    if (skipPaths.has(absPath)) {
      stats.redirectToPagesSkipped++;
      continue;
    }
    const rel = relative(ROOT, absPath);
    const content = readFileSync(absPath, 'utf-8');

    const { frontmatter } = splitFrontmatter(content);
    const permalink = getPermalinkForLookup(frontmatter);
    const aliases = permalink ? aliasMap.get(permalink) : null;

    const transformed = transformFile(content, aliases);
    const dest = join(DEST_DOCS, rel);
    writeFileSafe(dest, transformed);
    stats.mdFiles++;
  }

  console.log(`Transformed and wrote ${stats.mdFiles} markdown files.\n`);

  // ---- 2. Copy image files from content directories ----
  console.log('Scanning for image files in content directories...');
  const imageFiles = findImageFiles();
  console.log(`Found ${imageFiles.length} image files.\n`);

  for (const absPath of imageFiles) {
    const rel = relative(ROOT, absPath);
    const dest = join(DEST_DOCS, rel);
    copyFileSafe(absPath, dest);
    stats.imagesCopied++;
  }

  console.log(`Copied ${stats.imagesCopied} image files.\n`);

  // ---- 3. Copy special asset files ----
  const logoSrc = join(ROOT, 'assets', 'img', 'logo.png');
  const logoDest = join(DEST_ASSETS, 'logo.png');
  if (existsSync(logoSrc)) {
    copyFileSafe(logoSrc, logoDest);
    console.log(`Copied logo: assets/img/logo.png → src/assets/logo.png`);
  } else {
    console.warn(`WARNING: ${logoSrc} not found — skipping logo copy.`);
  }

  const koleckoSrc = join(ROOT, 'keboola-kolecko.png');
  const koleckoDest = join(DEST_PUBLIC, 'keboola-kolecko.png');
  if (existsSync(koleckoSrc)) {
    copyFileSafe(koleckoSrc, koleckoDest);
    console.log(`Copied: keboola-kolecko.png → public/keboola-kolecko.png`);
  } else {
    console.warn(`WARNING: ${koleckoSrc} not found — skipping.`);
  }

  const faviconSrc = join(ROOT, 'favicon.ico');
  const faviconDest = join(DEST_PUBLIC, 'favicon.ico');
  if (existsSync(faviconSrc)) {
    copyFileSafe(faviconSrc, faviconDest);
    console.log(`Copied: favicon.ico → public/favicon.ico`);
  } else {
    console.warn(`WARNING: ${faviconSrc} not found — skipping.`);
  }

  // ---- Summary ----
  console.log('\n=== Migration Summary ===');
  console.log(`  Markdown files processed:     ${stats.mdFiles}`);
  console.log(`  Images copied:                ${stats.imagesCopied}`);
  console.log(`  Permalinks → slug:            ${stats.permalinksConverted}`);
  console.log(`  layout: lines removed:        ${stats.layoutsRemoved}`);
  console.log(`  showBreadcrumbs: removed:     ${stats.showBreadcrumbsRemoved}`);
  console.log(`  sitemap → pagefind:           ${stats.sitemapConverted}`);
  console.log(`  TOC markers removed:          ${stats.tocRemoved}`);
  console.log(`  highlight blocks converted:   ${stats.highlightBlocks}`);
  console.log(`  tip includes converted:       ${stats.tipIncludes}`);
  console.log(`  warning includes converted:   ${stats.warningIncludes}`);
  console.log(`  public-beta-warning includes: ${stats.publicBetaIncludes}`);
  console.log(`  private-beta-warning includes:${stats.privateBetaIncludes}`);
  console.log(`  {: .image-popup} removed:     ${stats.imagePopupRemoved}`);
  console.log(`  Kramdown attrs removed:       ${stats.kramdownAttrsRemoved}`);
  console.log(`  raw tags stripped:            ${stats.rawTagsStripped}`);
  console.log(`  comment tags converted:       ${stats.commentTagsConverted}`);
  console.log(`  leading ## Overview removed:  ${stats.overviewHeadingsRemoved}`);
  console.log(`  redirect_to stubs skipped:    ${stats.redirectToPagesSkipped}`);
  console.log(`  redirect_from aliases added:  ${stats.redirectFromAliasesInjected}`);
  console.log('\nDone.');
}

main();
