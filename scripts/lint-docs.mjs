/**
 * Docs content lint — gates the PR build against *regressions*.
 *
 * Extends the read-only checks in audit-phase2.mjs with anchors, bare code
 * fences, frontmatter, deprecated terms, raw HTML tables / Liquid leftovers and
 * referenced placeholder images — then compares the findings against a committed
 * baseline (scripts/lint-baseline.json) and exits non-zero ONLY on findings that
 * are not already in the baseline. That way CI can gate today without first
 * clearing the whole existing backlog: new breakage fails, known debt doesn't.
 *
 * Run after `astro build`:
 *   node scripts/lint-docs.mjs                 # check (exit 1 on new findings)
 *   node scripts/lint-docs.mjs --update-baseline
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, dirname, resolve } from 'path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const DIST = join(ROOT, 'dist');
const SRC = join(ROOT, 'src', 'content', 'docs');
const BASELINE = join(ROOT, 'scripts', 'lint-baseline.json');
const UPDATE = process.argv.includes('--update-baseline');

if (!existsSync(DIST)) { console.error('No dist/ — run `astro build` first.'); process.exit(1); }

// ---- helpers (mirrors audit-phase2.mjs) -----------------------------------
function walk(dir, test) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full, test));
    else if (test(full)) out.push(full);
  }
  return out;
}
const htmlFiles = walk(DIST, (f) => f.endsWith('.html') && !f.includes('/pagefind/'));
const route = (f) => '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\.html$/, '');
const norm = (p) => ('/' + p.replace(/^\/+|\/+$/g, '')); // collapse trailing slash for matching
function resolves(p) {
  p = p.split('#')[0].split('?')[0];
  if (!p) return true;
  return [join(DIST, p), join(DIST, p, 'index.html'),
    join(DIST, p.replace(/\/$/, '') + '.html'),
    join(DIST, p.replace(/\/$/, '') + '/index.html')].some(existsSync);
}

// ---- build a route -> Set(ids) map from the built HTML ---------------------
const idsByRoute = new Map();
const bodyOf = (raw) => { const i = raw.search(/<body[\s>]/i); return i >= 0 ? raw.slice(i) : raw; };
for (const file of htmlFiles) {
  const html = bodyOf(readFileSync(file, 'utf8'));
  const ids = new Set();
  let m; const ID = /\bid\s*=\s*["']([^"']+)["']/gi;
  while ((m = ID.exec(html))) ids.add(m[1]);
  idsByRoute.set(norm(route(file)), ids);
}

// ---- findings --------------------------------------------------------------
const findings = []; // {type, sev, file, detail}
const add = (type, sev, file, detail) => findings.push({ type, sev, file, detail });
const key = (f) => `${f.type} | ${f.file} | ${f.detail}`;

// dist-level: links, anchors, images, placeholders
const ATTR = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;
for (const file of htmlFiles) {
  const raw = readFileSync(file, 'utf8');
  const html = bodyOf(raw);
  const r = route(file);
  let m; ATTR.lastIndex = 0;
  while ((m = ATTR.exec(html))) {
    const url = m[1].trim();
    const isImg = m[0].toLowerCase().startsWith('src');
    if (/^(mailto:|tel:|javascript:|data:)/i.test(url)) continue;
    if (/^https?:\/\//i.test(url)) continue;

    // same-page or cross-page anchor
    const hash = url.includes('#') ? url.slice(url.indexOf('#') + 1) : '';
    const path = url.split('#')[0].split('?')[0];
    if (hash) {
      const targetRoute = path ? norm(path) : norm(r);
      const ids = idsByRoute.get(targetRoute);
      if (ids && !ids.has(hash)) add('broken-anchor', 'error', r, `${url}`);
    }
    if (!path.startsWith('/')) continue;
    if (/\.html(\?|#|$)/i.test(path) && !path.startsWith('/_astro/')) add('jekyll-html-link', 'warn', r, path);
    if (!resolves(path)) {
      if (isImg || /\.(png|jpe?g|gif|svg|webp|avif)$/i.test(path)) add('missing-image', 'error', r, path);
      else add('broken-link', 'error', r, path);
    } else if (isImg && /\.(png|jpe?g|gif|webp|avif)$/i.test(path)) {
      // referenced placeholder: resolves but suspiciously tiny
      const f = [join(DIST, path), join(DIST, path.replace(/^\//, ''))].find(existsSync);
      try { if (f && statSync(f).size < 6000) add('placeholder-image', 'warn', r, path); } catch {}
    }
  }
}

// source-level: frontmatter, fences, deprecated terms, raw tables, liquid
const mdFiles = walk(SRC, (f) => f.endsWith('.md') || f.endsWith('.mdx'));
const DEPRECATED = [
  [/\borchestrations?\b/i, 'orchestration→Flows'],
  [/\bsandbox(es)?\b/i, 'Sandbox→Workspace'],
];
for (const file of mdFiles) {
  const rel = relative(SRC, file);
  const raw = readFileSync(file, 'utf8');
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const front = fm ? fm[1] : '';
  const body = fm ? raw.slice(fm[0].length) : raw;

  if (!/^\s*title\s*:/m.test(front)) add('missing-title', 'error', rel, 'frontmatter has no title');
  if (!/^\s*slug\s*:/m.test(front)) add('missing-slug', 'error', rel, 'frontmatter has no slug');
  if (!/^\s*description\s*:/m.test(front)) add('missing-description', 'warn', rel, 'frontmatter has no description');

  // fenced-code scan: track open/close, flag bare opening fences
  const lines = body.split('\n');
  let inFence = false, fenceLines = 0;
  for (let i = 0; i < lines.length; i++) {
    const fm2 = lines[i].match(/^(\s*)```(.*)$/);
    if (fm2) {
      fenceLines++;
      if (!inFence) { if (fm2[2].trim() === '') add('bare-code-fence', 'warn', rel, `line ${i + 1}`); inFence = true; }
      else inFence = false;
      continue;
    }
    if (inFence) continue;
    if (/<table[\s>]/i.test(lines[i])) add('raw-html-table', 'warn', rel, `line ${i + 1}`);
    if (/\{%|\{\{/.test(lines[i])) add('liquid-leftover', 'warn', rel, `line ${i + 1}`);
    for (const [re, label] of DEPRECATED) if (re.test(lines[i])) add('deprecated-term', 'warn', rel, `${label} (line ${i + 1})`);
  }
  if (fenceLines % 2 !== 0) add('unclosed-fence', 'error', rel, `${fenceLines} fences`);
}

// ---- baseline diff ---------------------------------------------------------
const keys = findings.map(key).sort();
if (UPDATE) {
  writeFileSync(BASELINE, JSON.stringify(keys, null, 2) + '\n');
  console.log(`Baseline updated: ${keys.length} known findings → scripts/lint-baseline.json`);
  process.exit(0);
}
const baseline = existsSync(BASELINE) ? new Set(JSON.parse(readFileSync(BASELINE, 'utf8'))) : new Set();
const regressions = findings.filter((f) => !baseline.has(key(f)));

const head = (t) => `\n${'─'.repeat(64)}\n${t}\n${'─'.repeat(64)}`;
const byType = (arr) => arr.reduce((a, f) => ((a[f.type] = (a[f.type] || 0) + 1), a), {});
console.log(head('DOCS LINT'));
console.log(`Pages: ${htmlFiles.length}   Markdown: ${mdFiles.length}   Findings: ${findings.length}   Baseline: ${baseline.size}`);
console.log('By type:', JSON.stringify(byType(findings)));

if (!regressions.length) { console.log(head('OK — no new findings vs baseline')); process.exit(0); }
console.log(head(`NEW FINDINGS (not in baseline): ${regressions.length}`));
for (const f of regressions.slice(0, 100)) console.log(`  [${f.sev}] ${f.type}  ${f.file}  ${f.detail}`);
if (regressions.length > 100) console.log(`  …and ${regressions.length - 100} more`);
console.log('\nIf these are intentional, refresh the baseline: node scripts/lint-docs.mjs --update-baseline');
process.exit(1);
