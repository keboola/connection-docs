#!/usr/bin/env node
/**
 * migrate-devdocs.mjs — PHASE 1: full programmatic migration of developers.keboola.com
 * (Jekyll) into this Astro/Starlight repo. ONE deterministic run, zero hand edits after.
 *
 * Per Jordan (2026-07-15): the migration must be a script — verifiable by validating
 * this code, not by re-reading 175 pages. Topic re-organization happens later
 * (phase 2) per PLACEMENT-MAP.md; here paths are preserved 1:1 (except cli/, see below).
 *
 * Usage:
 *   git archive devdocs/main | tar -x -C <src-dir>
 *   node scripts/migrate-devdocs.mjs <src-dir> [--dry]
 *
 * What it does, in order:
 *   1. PORT every dev page except SKIP (pages already woven into help by open weave
 *      PRs #1019/#1022/#1023 or dead chrome). Slugs = permalinks, 1:1.
 *   2. cli/** is slug-remapped to cli/keboola-as-code/** ("Keboola as Code CLI") and its
 *      index gets a scripted :::caution[Deprecated] banner → kbagent CLI (Jordan's call).
 *   3. Jekyll→Starlight conversion incl. every gap found in the pilot ports:
 *      {%comment%}, {%highlight%}, {%raw%}, kramdown attrs, TOC markers,
 *      {% include X %} inlined from _includes/ (beta-warning → admonition),
 *      Jekyll literal-escape {{ "{{ x " }}}} → {{ x }}, scalar redirect_from → array.
 *   4. Links: strip https://help.keboola.com; remap /cli/ → /cli/keboola-as-code/;
 *      links to SKIPped pages → their canonical help target; repo-wide inbound
 *      developers.keboola.com/<path> links flipped to the ported internal path
 *      (except files owned by open weave PRs, listed in FLIP_EXCLUDE).
 *   5. Images dual-copied (public/ + co-located src/); relative image refs rewritten to
 *      absolute public paths by basename; non-image assets (csv/zip) copied to public/.
 *   6. redirect_from for skipped-but-redirectable dev URLs injected into their canonical
 *      main pages (guarded, idempotent).
 *   7. "Developer Docs" nav group inserted into _data/navigation.yml (guarded) and
 *      src/sidebar.mjs regenerated.
 *   8. MIGRATION-REPORT.md written with every move/skip/redirect/link-flip/inline.
 *
 * Never prunes. Collisions with existing help slugs are hard errors.
 */
import {
  readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync, copyFileSync,
} from 'node:fs';
import { join, dirname, extname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST_DOCS = join(REPO, 'src', 'content', 'docs');
const DEST_PUBLIC = join(REPO, 'public');

const [, , SRC, ...rest] = process.argv;
const DRY = rest.includes('--dry');
if (!SRC || !existsSync(SRC)) {
  console.error('Usage: node scripts/migrate-devdocs.mjs <devdocs-src-dir> [--dry]');
  process.exit(1);
}
const INCLUDES = join(SRC, '_includes');

const IMG_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']);
const ASSET_EXT = new Set(['.csv', '.zip']);

/* ------------------------------- config ---------------------------------- */

// Dev pages NOT ported here: already woven into help by open weave PRs, or dead chrome.
// value = canonical help path links should point at ('' = no link target needed).
const SKIP = new Map(Object.entries({
  '/':                                 '',                                   // weave PR #1022 (combined home)
  '/overview/':                        '/overview/',                         // weave PR #1022
  '/overview/repositories/':           '/overview/',                         // killed in #1022 (301 there)
  '/integrate/data-streams/':          '/storage/data-streams/',             // weave PR #1023 (301s there)
  '/integrate/data-streams/overview/': '/storage/data-streams/',             // #1023 → reference/
  '/integrate/data-streams/tutorial/': '/storage/data-streams/',             // #1023 → tutorial/
  '/integrate/push-data/':             '/storage/data-streams/',             // old alias, #1023
  '/integrate/database/':              '/components/extractors/database/',   // fold PR #1019
  '/integrate/mcp/':                   '/ai/mcp-server/',                    // canonical (merged content)
  '/integrate/orchestrator/':          '/flows/',                            // empty dev stub
  '/404.html':                         '',                                   // site chrome
}));

// Skipped dev URLs that get a redirect_from injected into a MAIN canonical page now.
// (data-streams family intentionally absent — its redirects ride with open PR #1023;
//  home/overview redirect-less — same path; repositories 301 rides with #1022.)
const INJECT_REDIRECTS = [
  { devUrl: '/integrate/mcp/',          canonical: 'ai/mcp-server/index.md' },
  { devUrl: '/integrate/database/',     canonical: 'components/extractors/database/index.md' },
  { devUrl: '/integrate/orchestrator/', canonical: 'flows/index.md' },
];

// Slug remap: whole dev sections that land under a different help path.
const REMAP = [
  { from: /^cli(\/|$)/, to: 'cli/keboola-as-code$1',
    urlFrom: /^\/cli\//, urlTo: '/cli/keboola-as-code/' },
];

// Scripted banner injected right after the frontmatter of these ported slugs.
const BANNERS = new Map(Object.entries({
  'cli/keboola-as-code': [
    ':::caution[Deprecated in the future]',
    'The **Keboola as Code CLI** will be deprecated in favor of the new agent-first',
    '**[kbagent CLI](https://github.com/keboola/cli)**. Use kbagent for new automation;',
    'this reference stays for existing Keboola-as-Code workflows.',
    ':::',
  ].join('\n'),
}));

// Deterministic link corrections for typos in the DEV SOURCE itself (documented, code-reviewed).
const LINK_FIXES = new Map(Object.entries({
  '/cli/keboola-as-code/commands/remote/create/brabch/': '/cli/keboola-as-code/commands/remote/create/branch/', // dev typo "brabch"
}));

// Repo files NOT touched by the inbound link-flip (owned by open weave PRs — avoid conflicts).
const FLIP_EXCLUDE = [
  'src/content/docs/index.md',                    // #1022
  'src/content/docs/overview/index.md',           // #1022
  'src/content/docs/storage/data-streams/',       // #1023 (subtree)
  'src/content/docs/components/extractors/database/index.md', // #1019
];

/* ---------------------------- report plumbing ---------------------------- */

const report = { ported: [], skipped: [], collisions: [], includesInlined: [],
  bannerInjected: [], redirectsInjected: [], imgFixed: [], assets: [], flips: [],
  todos: [], nav: [] };

/* ------------------------------ frontmatter ------------------------------ */

function parseFm(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? { fm: m[1], body: m[2] } : null;
}

function permalinkToSlug(permalink) {
  const v = permalink.trim().replace(/^['"]|['"]$/g, '');
  if (v === '/') return '';
  return v.replace(/^\//, '').replace(/\/$/, '');
}

// Line-based: unknown keys pass through; scalar redirect_from normalized to array.
function transformFrontmatter(fmRaw) {
  const out = [];
  let slug = null;
  for (const line of fmRaw.split('\n')) {
    const pm = line.match(/^permalink:\s*(.+)$/);
    if (pm) {
      slug = permalinkToSlug(pm[1]);
      for (const r of REMAP) slug = slug.replace(r.from, r.to);
      out.push(`slug: '${slug}'`);
      continue;
    }
    const rf = line.match(/^redirect_from:\s*(\S.*)$/); // scalar form breaks Astro schema
    if (rf) {
      out.push('redirect_from:');
      out.push(`    - ${rf[1].trim()}`);
      continue;
    }
    if (/^(layout|showBreadcrumbs):/.test(line)) continue; // Jekyll-only
    out.push(line);
  }
  return { fm: out.join('\n'), slug };
}

/* --------------------------------- body ---------------------------------- */

const BETA_WARNING_ADMONITION = [
  ':::caution[Public Beta]',
  'This feature is currently in public beta. Please provide feedback using the feedback button in your project.',
  ':::',
].join('\n');

function inlineIncludes(b, pageRel) {
  return b.replace(/\{%\s*include\s+([\w.\-]+)\s*%\}/g, (_, name) => {
    if (name === 'branches-beta-warning.html') {
      report.includesInlined.push(`${pageRel}: ${name} -> admonition`);
      return BETA_WARNING_ADMONITION;
    }
    const f = join(INCLUDES, name);
    if (!existsSync(f)) {
      report.todos.push(`${pageRel}: include ${name} NOT FOUND — left as TODO`);
      return `<!-- TODO(human-review): unresolved Jekyll include ${name} -->`;
    }
    const content = readFileSync(f, 'utf8').replace(/\r\n/g, '\n').trimEnd();
    if (/\.(html)$/.test(name)) {
      report.todos.push(`${pageRel}: raw HTML include ${name} inlined — verify rendering`);
    } else {
      report.includesInlined.push(`${pageRel}: ${name} inlined (${content.split('\n').length} lines)`);
    }
    return content;
  });
}

// jQuery/style page furniture that only existed for the Jekyll site.
const stripPageScripts = (b) => b
  .replace(/<script>\s*\{%\s*include [\w.\-]+\s*%\}\s*<\/script>\s*<style>[\s\S]*?<\/style>/g, '')
  .replace(/^<div class="clearfix"><\/div>\s*$/gm, '');

const convertComments = (b) => b.replace(/\{%\s*comment\s*%\}([\s\S]*?)\{%\s*endcomment\s*%\}/g, '<!--$1-->');
const stripRaw = (b) => b.replace(/\{%\s*(end)?raw\s*%\}/g, '');
const convertHighlight = (b) => b.replace(/\{%\s*highlight\s+(\w+)\s*%\}/g, '```$1').replace(/\{%\s*endhighlight\s*%\}/g, '```');
const stripTocMarkers = (b) => b.replace(/^[ \t]*\*\s*TOC\s*$/gm, '').replace(/^[ \t]*\{:toc\}\s*$/gm, '');
const stripKramdownAttrs = (b) => b.replace(/^\s*\{:\s*[^}]*\}\s*$/gm, '').replace(/\{:\s*\.[\w-]+\s*\}/g, '');
// Jekyll literal-escape → real moustache: {{ "{{ x " }}}} → {{ x }},  {{ "{{" }} → {{
const unescapeMoustache = (b) => b
  .replace(/\{\{ ?"\{\{(.*?) ?" ?\}\}\}\}/g, '{{$1}}')
  .replace(/\{\{ ?"\{\{" ?\}\}/g, '{{');
const tidyBlankLines = (b) => b.replace(/\n{3,}/g, '\n\n');

function rewriteLinks(b) {
  // canonical help domain → relative (leave sample values in JSON, matched narrowly to hrefs)
  b = b.replace(/\]\(https?:\/\/help\.keboola\.com(\/[^)]*)?\)/g, (_, p) => `](${p || '/'})`);
  // dev-domain self-links → relative (everything migrates in this run)
  b = b.replace(/\]\(https?:\/\/developers\.keboola\.com(\/[^)]*)?\)/g, (_, p) => `](${p || '/'})`);
  // section remaps (cli → cli/keboola-as-code)
  for (const r of REMAP) b = b.replace(/\]\((\/[^)]*)\)/g, (m, p) => `](${p.replace(r.urlFrom, r.urlTo)})`);
  // links to skipped pages → their canonical help target
  b = b.replace(/\]\((\/[^)#]*\/?)(#[^)]*)?\)/g, (m, p, hash = '') => {
    const norm = p.endsWith('/') ? p : `${p}/`;
    for (const [skip, target] of SKIP) {
      if (skip !== '/' && norm.startsWith(skip)) return target ? `](${target})` : m;
    }
    return m;
  });
  // documented source-typo corrections
  for (const [bad, good] of LINK_FIXES) b = b.split(bad).join(good);
  return b;
}

function transformBody(body, pageRel) {
  let b = body.replace(/\r\n/g, '\n');
  b = inlineIncludes(b, pageRel);
  b = stripPageScripts(b);
  b = convertComments(b);
  b = convertHighlight(b);
  b = stripTocMarkers(b);
  b = stripKramdownAttrs(b);
  b = stripRaw(b);
  b = unescapeMoustache(b);
  b = rewriteLinks(b);
  b = tidyBlankLines(b);
  return b;
}

/* --------------------------------- walk ---------------------------------- */

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith('_') || name.startsWith('.') || name === 'assets' || name === 'node_modules') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// Collision baseline = the migration base tree (upstream/main), NOT the working copy —
// re-runs must overwrite their own previous output (idempotency), while still refusing
// to clobber genuine pre-existing help pages.
const BASE_REF = process.env.MIGRATE_BASE_REF || 'upstream/main';
const baseTree = new Set(
  execSync(`git ls-tree -r --name-only ${BASE_REF} -- src/content/docs`, { cwd: REPO })
    .toString().split('\n').filter(Boolean),
);

const files = walk(SRC);
const mdFiles = files.filter((f) => extname(f) === '.md' && basename(f) !== 'README.md');
const imgFiles = files.filter((f) => IMG_EXT.has(extname(f).toLowerCase()));
const assetFiles = files.filter((f) => ASSET_EXT.has(extname(f).toLowerCase()));

/* ------------------------------ images/assets ---------------------------- */

const imgBasenames = new Map(); // basename -> public web path (for relative-ref repair)
for (const img of imgFiles) {
  let relImg = relative(SRC, img).replace(/\\/g, '/');
  for (const r of REMAP) relImg = relImg.replace(r.from, r.to);
  for (const base of [DEST_PUBLIC, DEST_DOCS]) {
    const dest = join(base, relImg);
    if (!DRY) { mkdirSync(dirname(dest), { recursive: true }); copyFileSync(img, dest); }
  }
  imgBasenames.set(basename(img), `/${relImg}`);
}
for (const a of assetFiles) {
  let relA = relative(SRC, a).replace(/\\/g, '/');
  for (const r of REMAP) relA = relA.replace(r.from, r.to);
  const dest = join(DEST_PUBLIC, relA);
  if (!DRY) { mkdirSync(dirname(dest), { recursive: true }); copyFileSync(a, dest); }
  report.assets.push(relA);
}

// relative/bare image refs break when the slug→dir layout differs from the source layout
function fixRelativeImageRefs(b, pageRel) {
  return b.replace(/(!\[[^\]]*\]\()([^)]+?\.(?:png|jpe?g|gif|svg|webp))(\))/gi, (m, pre, url, post) => {
    if (/^(https?:)?\//.test(url)) return m;
    const pub = imgBasenames.get(url.split('/').pop());
    if (pub) { report.imgFixed.push(`${pageRel}: ${url} -> ${pub}`); return pre + pub + post; }
    report.todos.push(`${pageRel}: relative image ${url} has no copied file — left as TODO`);
    return m;
  });
}

/* --------------------------------- pages --------------------------------- */

const written = new Set();
for (const file of mdFiles) {
  const pageRel = relative(SRC, file).replace(/\\/g, '/');
  const raw = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const parsed = parseFm(raw);
  if (!parsed) { report.skipped.push(`${pageRel} (no frontmatter)`); continue; }
  const permalink = (parsed.fm.match(/^permalink:\s*(.+)$/m) || [])[1];
  if (!permalink) { report.skipped.push(`${pageRel} (no permalink)`); continue; }
  const cleanPermalink = permalink.trim().replace(/^['"]|['"]$/g, '');
  if (SKIP.has(cleanPermalink)) {
    report.skipped.push(`${pageRel} (${cleanPermalink} — ${SKIP.get(cleanPermalink) ? `canonical ${SKIP.get(cleanPermalink)}` : 'not migrated'})`);
    continue;
  }

  const { fm, slug } = transformFrontmatter(parsed.fm);
  const dest = join(DEST_DOCS, slug, 'index.md');
  if (baseTree.has(relative(REPO, dest).replace(/\\/g, '/')) && !written.has(dest)) {
    report.collisions.push(`${slug} (${pageRel} -> pre-existing help page at ${relative(REPO, dest)})`);
    continue;
  }
  let body = transformBody(parsed.body, pageRel);
  body = fixRelativeImageRefs(body, pageRel);
  if (BANNERS.has(slug)) {
    body = `\n${BANNERS.get(slug)}\n${body.replace(/^\n+/, '\n')}`;
    report.bannerInjected.push(slug);
  }
  const out = `---\n${fm}\n---\n${body.startsWith('\n') ? '' : '\n'}${body}`;
  if (!DRY) { mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, out); }
  written.add(dest);
  report.ported.push(`${cleanPermalink} -> /${slug}/`);
}

if (report.collisions.length) {
  console.error('COLLISIONS — refusing to overwrite existing help pages:');
  for (const c of report.collisions) console.error('  ' + c);
  process.exit(2);
}

/* -------------------- redirect_from into main canonicals ------------------ */

for (const { devUrl, canonical } of INJECT_REDIRECTS) {
  const f = join(DEST_DOCS, canonical);
  if (!existsSync(f)) { report.todos.push(`redirect ${devUrl}: canonical ${canonical} missing`); continue; }
  let t = readFileSync(f, 'utf8');
  // presence check against the FRONTMATTER only — the body may legitimately mention the URL
  const fmEnd = t.indexOf('\n---', 3);
  const fmPart = fmEnd > 0 ? t.slice(0, fmEnd) : t;
  if (new RegExp(`^\\s*-\\s*${devUrl.replace(/\//g, '\\/')}\\s*$`, 'm').test(fmPart)) {
    report.redirectsInjected.push(`${devUrl} (already present on ${canonical})`); continue;
  }
  if (/^redirect_from:/m.test(t)) {
    // match the indentation of the block's existing items (mixed indents break YAML)
    const indent = (t.match(/^redirect_from:\n(\s+)- /m) || [, '    '])[1];
    t = t.replace(/^redirect_from:\n/m, `redirect_from:\n${indent}- ${devUrl}\n`);
  } else {
    t = t.replace(/^(slug: .+)$/m, `$1\nredirect_from:\n    - ${devUrl}`);
  }
  if (!DRY) writeFileSync(f, t);
  report.redirectsInjected.push(`${devUrl} -> ${canonical}`);
}

/* --------------------- repo-wide inbound link flips ----------------------- */

function walkDocs(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walkDocs(p));
    else if (/\.(md|mdx)$/.test(name)) out.push(p);
  }
  return out;
}
const portedUrls = new Set(report.ported.map((l) => l.split(' -> ')[1]));
for (const f of walkDocs(DEST_DOCS)) {
  const rel = relative(REPO, f).replace(/\\/g, '/');
  if (FLIP_EXCLUDE.some((e) => rel === e || rel.startsWith(e))) continue;
  if (written.has(f)) continue; // ported pages already handled
  let t = readFileSync(f, 'utf8');
  const before = t;
  t = t.replace(/https?:\/\/developers\.keboola\.com(\/[^)\s"'<]*)/g, (m, p) => {
    let path = p.split('#')[0];
    const hash = p.includes('#') ? '#' + p.split('#').slice(1).join('#') : '';
    if (!path.endsWith('/')) path += '/';
    for (const r of REMAP) path = path.replace(r.urlFrom, r.urlTo);
    if (portedUrls.has(path)) { report.flips.push(`${rel}: ${m} -> ${path}${hash}`); return path + hash; }
    for (const [skip, target] of SKIP) if (skip !== '/' && path.startsWith(skip) && target)
      { report.flips.push(`${rel}: ${m} -> ${target}`); return target; }
    return m; // target not migrated (nothing left in practice) — leave absolute
  });
  if (t !== before && !DRY) writeFileSync(f, t);
}

/* ------------------------------- navigation ------------------------------- */

const NAV_MARKER = '# --- Developer Docs (migrated from developers.keboola.com, phase 1) ---';
const navFile = join(REPO, '_data', 'navigation.yml');
let nav = readFileSync(navFile, 'utf8');
if (!nav.includes(NAV_MARKER)) {
  const item = (url, title, indent) => `${' '.repeat(indent)}- url: ${url}\n${' '.repeat(indent + 2)}title: ${title}\n`;
  let block = `\n  ${NAV_MARKER}\n`;
  block += item('/overview/api/', 'Developer Docs', 2).replace('title: Developer Docs', 'title: Developer Docs\n    items:').trimEnd() + '\n';
  const sub = [
    ['/overview/api/', 'Our APIs'],
    ['/overview/encryption/', 'Encryption'],
    ['/integrate/', 'Integration'],
    ['/extend/', 'Extending Keboola'],
    ['/automate/', 'Automation'],
    ['/cli/keboola-as-code/', 'Keboola as Code CLI'],
  ];
  for (const [u, tTitle] of sub) block += item(u, tTitle, 6);
  nav = nav.replace(/^  - url: \/external-integrations\//m, `${block}\n  - url: /external-integrations/`);
  if (!DRY) writeFileSync(navFile, nav);
  report.nav.push('inserted "Developer Docs" group before External Integrations');
} else {
  report.nav.push('nav group already present (idempotent skip)');
}
if (!DRY) execSync('node scripts/convert-nav.mjs', { cwd: REPO, stdio: 'inherit' });

/* --------------------------------- report --------------------------------- */

const R = [];
R.push('# MIGRATION REPORT — developers.keboola.com → help (phase 1, scripted)');
R.push('');
R.push(`Generated by \`scripts/migrate-devdocs.mjs\` — re-run it to reproduce this tree byte-for-byte.`);
R.push('');
R.push(`- pages ported: **${report.ported.length}**  ·  skipped: **${report.skipped.length}**  ·  images: **${imgFiles.length}**  ·  assets: **${report.assets.length}**`);
R.push(`- includes inlined: ${report.includesInlined.length}  ·  relative image refs fixed: ${report.imgFixed.length}  ·  inbound links flipped: ${report.flips.length}`);
R.push(`- redirects injected: ${report.redirectsInjected.length}  ·  banners: ${report.bannerInjected.join(', ') || '—'}  ·  nav: ${report.nav.join('; ')}`);
R.push('');
const section = (title, arr) => { R.push(`## ${title} (${arr.length})`, '', ...arr.map((x) => `- ${x}`), ''); };
section('Skipped (woven by open weave PRs / dead chrome)', report.skipped);
section('Redirects injected into main canonicals', report.redirectsInjected);
section('Includes inlined', report.includesInlined);
section('Relative image refs repaired', report.imgFixed);
section('Inbound links flipped (outside ported tree)', report.flips);
section('TODO(human-review)', report.todos);
section('Ported pages', report.ported);
if (!DRY) writeFileSync(join(REPO, 'MIGRATION-REPORT.md'), R.join('\n'));

console.log(`${DRY ? '[dry] ' : ''}ported=${report.ported.length} skipped=${report.skipped.length} imgs=${imgFiles.length} assets=${report.assets.length} flips=${report.flips.length} redirects=${report.redirectsInjected.length} todos=${report.todos.length}`);
if (report.todos.length) for (const t of report.todos) console.log('  TODO: ' + t);
