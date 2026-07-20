#!/usr/bin/env node
/**
 * phase2-replace.mjs — PHASE 2: topic re-placement of migrated dev pages, driven by
 * the reviewed PLACEMENT-MAP.md. One batch = one target section = one PR.
 *
 * Usage:
 *   node scripts/phase2-replace.mjs --dry               # dry-run ALL batches (summary)
 *   node scripts/phase2-replace.mjs --batch "Storage › Storage API" [--dry]
 *
 * Per move row (kind=move in the map): relocate the page from its phase-1 path to its
 * topic path, set the new slug, append redirect_from (the phase-1/dev path), rewrite
 * inbound links repo-wide, and update navigation. Public image paths are left in place
 * (pages reference them absolutely), so no asset churn. Idempotent: rows whose target
 * already exists and whose source is gone are skipped as done.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync, readdirSync, statSync, rmdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(REPO, 'src', 'content', 'docs');
const MAP = join(REPO, 'PLACEMENT-MAP.md');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const BATCH = args.includes('--batch') ? args[args.indexOf('--batch') + 1] : null;

// phase-1 slug remaps (dev URL -> where phase 1 actually put the page)
const PHASE1_REMAP = [[/^\/cli\//, '/cli/keboola-as-code/']];

/* ------------------------------- parse map ------------------------------- */
const rows = [];
for (const line of readFileSync(MAP, 'utf8').split('\n')) {
  if (!line.startsWith('| `')) continue;
  const c = line.split('|').map((x) => x.trim());
  if (c.length < 9) continue; // UNSURE 2-col table
  const [ , src, oldUrl, section, target, dia, conf, dedup ] = c;
  const url = oldUrl.replace(/`/g, ''); const tgt = target.replace(/`/g, '');
  const kind = /REDIRECT|MERGED|NOT MIGRATED/.test(dedup) ? 'redirect' : conf === 'flag' ? 'flag' : 'move';
  rows.push({ src: src.replace(/`/g, ''), url, section, target: tgt, conf, kind });
}

const moves = rows.filter((r) => r.kind === 'move');
const bySection = new Map();
for (const m of moves) bySection.set(m.section, [...(bySection.get(m.section) || []), m]);

function phase1Path(url) { let p = url; for (const [re, to] of PHASE1_REMAP) p = p.replace(re, to); return p; }
const slugOf = (p) => p.replace(/^\//, '').replace(/\/$/, '');

/* ------------------------------ dry summary ------------------------------ */
if (!BATCH) {
  console.log('Dry summary per batch (moves | already-in-place | pending):');
  for (const [sec, list] of [...bySection.entries()].sort((a, b) => b[1].length - a[1].length)) {
    let done = 0, pending = 0, collisions = 0;
    for (const m of list) {
      const cur = join(DOCS, slugOf(phase1Path(m.url)), 'index.md');
      const dst = join(DOCS, slugOf(m.target), 'index.md');
      if (phase1Path(m.url) === m.target || (!existsSync(cur) && existsSync(dst))) done++;
      else if (existsSync(dst)) collisions++;
      else pending++;
    }
    console.log(`  ${String(list.length).padStart(3)}  ${sec}  (in-place: ${done}, pending: ${pending}${collisions ? `, COLLISIONS: ${collisions}` : ''})`);
  }
  process.exit(0);
}

/* ------------------------------ batch apply ------------------------------ */
const batch = bySection.get(BATCH);
if (!batch) { console.error(`Unknown batch "${BATCH}". Known: ${[...bySection.keys()].join(' | ')}`); process.exit(1); }

const report = { moved: [], skipped: [], flips: [], errors: [] };

for (const m of batch) {
  const curUrl = phase1Path(m.url);
  if (curUrl === m.target) { report.skipped.push(`${m.url} (already at target via phase 1)`); continue; }
  const cur = join(DOCS, slugOf(curUrl), 'index.md');
  const dst = join(DOCS, slugOf(m.target), 'index.md');
  if (!existsSync(cur)) {
    if (existsSync(dst)) { report.skipped.push(`${m.url} (already moved)`); continue; }
    report.errors.push(`${m.url}: source missing at ${relative(REPO, cur)}`); continue;
  }
  if (existsSync(dst)) { report.errors.push(`${m.url}: target exists ${relative(REPO, dst)}`); continue; }

  let t = readFileSync(cur, 'utf8');
  t = t.replace(/^slug: '.*'$/m, `slug: '${slugOf(m.target)}'`);
  if (/^redirect_from:/m.test(t)) {
    const indent = (t.match(/^redirect_from:\n(\s+)- /m) || [, '    '])[1];
    t = t.replace(/^redirect_from:\n/m, `redirect_from:\n${indent}- ${curUrl}\n`);
  } else {
    t = t.replace(/^(slug: .+)$/m, `$1\nredirect_from:\n    - ${curUrl}`);
  }
  if (!DRY) { mkdirSync(dirname(dst), { recursive: true }); writeFileSync(dst, t); renameSync(cur, join(dirname(cur), '.removed-index.md')); }
  report.moved.push(`${curUrl} -> ${m.target}`);
}

// physically drop tombstones + empty dirs
function cleanup(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) cleanup(p);
    else if (n === '.removed-index.md' && !DRY) execSync(`rm '${p}'`);
  }
  if (!DRY && readdirSync(dir).length === 0) rmdirSync(dir);
}
cleanup(DOCS);

/* --------------------- mirror public assets of moved slugs ---------------- */
const PUB = join(REPO, 'public');
for (const s of report.moved) {
  const [from, to] = s.split(' -> ');
  const src = join(PUB, slugOf(from)); const dst = join(PUB, slugOf(to));
  if (existsSync(src) && !DRY) execSync(`mkdir -p '${dst}' && cp -Rn '${src}/.' '${dst}/' 2>/dev/null || true`);
}

/* ------------------------ inbound link rewrite --------------------------- */
const moveMap = new Map(report.moved.map((s) => s.split(' -> ')));
function walkDocs(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...walkDocs(p));
    else if (/\.(md|mdx)$/.test(n)) out.push(p);
  }
  return out;
}
for (const f of walkDocs(DOCS)) {
  let t = readFileSync(f, 'utf8'); const before = t;
  for (const [from, to] of moveMap) {
    const fromN = from.replace(/\/$/, ''), toN = to.replace(/\/$/, '');
    // markdown links: with trailing slash, bare no-slash, anchored, and Jekyll
    // dev-server artifacts (frontmatter redirect_from lines match none of these)
    t = t.split(`](${from}`).join(`](${toN}/`);
    t = t.split(`](${fromN})`).join(`](${toN}/)`);
    t = t.split(`](${fromN}#`).join(`](${toN}/#`);
    t = t.split(`](http://localhost:4000${from}`).join(`](${toN}/`);
    t = t.split(`](http://localhost:4000${fromN}#`).join(`](${toN}/#`);
    // HTML anchors in embedded markup/scripts
    for (const q of [`'`, `"`]) {
      t = t.split(`href=${q}${from}`).join(`href=${q}${toN}/`);
      t = t.split(`href=${q}${fromN}${q}`).join(`href=${q}${toN}/${q}`);
      t = t.split(`href=${q}${fromN}#`).join(`href=${q}${toN}/#`);
    }
  }
  if (t !== before) { if (!DRY) writeFileSync(f, t); report.flips.push(relative(REPO, f)); }
}

/* ------------------------------ navigation ------------------------------- */
// update nav URLs in-place (entry moves out of the Developer Docs group in a later
// hand-verified nav edit per batch; URL rewrite keeps links valid either way)
const navFile = join(REPO, '_data', 'navigation.yml');
let nav = readFileSync(navFile, 'utf8'); const navBefore = nav;
for (const [from, to] of moveMap) nav = nav.split(`url: ${from}`).join(`url: ${to}`);
if (nav !== navBefore && !DRY) { writeFileSync(navFile, nav); execSync('node scripts/convert-nav.mjs', { cwd: REPO, stdio: 'inherit' }); }

/* -------------------------------- report --------------------------------- */
const R = [`# PHASE-2 BATCH REPORT — ${BATCH}`, '',
  `moved: ${report.moved.length} · skipped: ${report.skipped.length} · link-flipped files: ${report.flips.length} · errors: ${report.errors.length}`, ''];
for (const [k, arr] of Object.entries(report)) { R.push(`## ${k} (${arr.length})`, ...arr.map((x) => `- ${x}`), ''); }
if (!DRY) writeFileSync(join(REPO, `MIGRATION-REPORT-phase2.md`), R.join('\n'));
console.log(`${DRY ? '[dry] ' : ''}${BATCH}: moved=${report.moved.length} skipped=${report.skipped.length} flips=${report.flips.length} errors=${report.errors.length}`);
for (const e of report.errors) console.error('  ERROR: ' + e);
if (report.errors.length) process.exit(2);
