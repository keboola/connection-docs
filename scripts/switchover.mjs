#!/usr/bin/env node
/**
 * switchover.mjs — final Jekyll → Astro cutover.
 *
 * The repo currently DUPLICATES: the Jekyll source (content dirs + _layouts/
 * _includes/_sass/_config.yml) lives alongside the Astro site generated from it
 * (src/content/docs via migrate.mjs). This script performs the one-time switch
 * so Astro becomes the single source of truth and Jekyll is removed.
 *
 * It is intentionally cautious — run it WITH a maintainer (Jordan), review the
 * diff, then commit. It NEVER commits or pushes on its own.
 *
 *   node scripts/switchover.mjs            # DRY RUN — prints the plan only
 *   node scripts/switchover.mjs --apply    # actually performs the cutover
 *   node scripts/switchover.mjs --apply --skip-build   # skip the build checks
 *   node scripts/switchover.mjs --force    # proceed despite a page-tree mismatch
 *
 * Note: even a DRY RUN regenerates the Astro content/nav in step 2 (that's how
 * the page-tree diff stays honest), so it can leave src/content/docs +
 * src/sidebar.mjs dirty. That's expected — preflight tolerates changes confined
 * to those generated paths, and --apply stages them into the cutover commit.
 *
 * Steps:
 *   1. Preflight (on a branch, not main, src/content/docs present; tree clean
 *      except for regenerated content, which step 2 owns).
 *   2. Finalize Astro: run migrate.mjs + convert-nav.mjs so content + nav are
 *      fully current with the Jekyll source (incl. anything just synced from
 *      main), and report which generated files were refreshed.
 *   3. Pre-cutover build — must pass.
 *   4. Validate migration: page-tree diff (every Jekyll source page must have a
 *      matching Astro page). Aborts on any missing page unless --force.
 *   5. git rm the Jekyll source (content dirs + SSG config + root index/404).
 *   6. Post-cutover build — must STILL pass (proves Astro is self-contained).
 *   7. Print the summary + manual next steps. No commit.
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const APPLY = process.argv.includes('--apply');
const SKIP_BUILD = process.argv.includes('--skip-build');
const FORCE = process.argv.includes('--force');

const sh = (cmd, opts = {}) =>
  execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
const log = (m) => console.log(m);
const hr = (t) => log(`\n${'─'.repeat(66)}\n${t}\n${'─'.repeat(66)}`);
const die = (m) => { console.error(`\n✗ ${m}\n`); process.exit(1); };

// ── What gets removed ──────────────────────────────────────────────────────
// Jekyll content directories (their Astro copies already live in src/content/docs).
const JEKYLL_CONTENT_DIRS = [
  'ai', 'catalog', 'components', 'data-apps', 'external-integrations', 'flows',
  'kai', 'management', 'overview', 'storage', 'transformations', 'tutorial',
  'workspace',
];
// Jekyll static-site machinery.
const JEKYLL_SSG = [
  '_includes', '_layouts', '_sass', 'assets',
  '_config.yml', 'Gemfile', 'Gemfile.lock',
];
// Root Jekyll source pages (migrated to src/content/docs/{index,404}.md).
const JEKYLL_ROOT_PAGES = ['index.md', '404.md'];

// Top-level entries that must NEVER be touched.
const KEEP = new Set([
  'src', 'public', 'scripts', 'api', 'node_modules', 'dist', '.git', '.github',
  '.claude', '.astro', '.vercel', '.worktrees', '.gitignore', '.vercelignore',
  'package.json', 'package-lock.json', 'astro.config.mjs', 'tsconfig.json',
  'README.md', 'LICENSE', 'LICENSE.md', 'AUDIT_LOG.md', 'UI_FIXES_LOG.md',
  'DEV_DOCS_INTEGRATION.md', 'AGENTS.md', 'claude.md', 'CLAUDE.md', 'keboola-kolecko.png',
  'wishlist.png', 'favicon.ico', 'google9cde6c6b9250e5a4.html', 'docker-compose.yml',
  // _data/navigation.yml is still consumed by convert-nav.mjs → keep _data.
  '_data',
]);

const REMOVE = [...JEKYLL_CONTENT_DIRS, ...JEKYLL_SSG, ...JEKYLL_ROOT_PAGES]
  .filter((p) => existsSync(join(ROOT, p)));

// Pages migrate.mjs intentionally does NOT produce an Astro page for, so they
// must be excluded from the page-tree diff (kept in sync with migrate.mjs):
//   - POST_MIGRATE_DELETE: generated dirs deleted after migration.
//   - redirect stubs: Jekyll pages whose frontmatter has `redirect_to:` (handled
//     by the redirect-from integration, not written as Astro pages).
const POST_MIGRATE_DELETE = ['flows/conditional-flows'];

/** Collect .md/.mdx paths under `dir`, relative to `base`, as posix strings. */
function collectMd(dir, base = dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) collectMd(full, base, out);
    else if (/\.mdx?$/.test(e)) out.push(relative(base, full).split(/[\\/]/).join('/'));
  }
  return out;
}

/** A Jekyll page with `redirect_to:` in frontmatter is not migrated to a page. */
function isRedirectStub(absPath) {
  const fm = readFileSync(absPath, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return fm ? /^\s*redirect_to\s*:/m.test(fm[1]) : false;
}

/**
 * Diff the Jekyll source page tree against the generated Astro page tree.
 * migrate.mjs mirrors source paths into src/content/docs, so a faithful
 * migration means every real Jekyll page has a same-path Astro page.
 */
function diffPageTrees() {
  const jekyllAll = [
    ...JEKYLL_CONTENT_DIRS.flatMap((d) => collectMd(join(ROOT, d), ROOT)),
    ...JEKYLL_ROOT_PAGES.filter((f) => existsSync(join(ROOT, f))),
  ];
  const jekyll = jekyllAll.filter(
    (rel) =>
      !POST_MIGRATE_DELETE.some((p) => rel === p || rel.startsWith(p + '/')) &&
      !isRedirectStub(join(ROOT, rel)),
  );
  const astro = collectMd(join(ROOT, 'src', 'content', 'docs'));
  const astroSet = new Set(astro);
  const jekyllSet = new Set(jekyll);
  return {
    jekyllCount: jekyll.length,
    astroCount: astro.length,
    excluded: jekyllAll.length - jekyll.length, // redirect stubs + post-delete
    missing: jekyll.filter((p) => !astroSet.has(p)), // in Jekyll, not in Astro
    extra: astro.filter((p) => !jekyllSet.has(p)),    // in Astro, not in Jekyll
  };
}

// ── 1. Preflight ────────────────────────────────────────────────────────────
hr(`Jekyll → Astro switchover  ${APPLY ? '(APPLY)' : '(DRY RUN)'}`);

let branch;
try { branch = sh('git rev-parse --abbrev-ref HEAD'); } catch { die('Not a git repo.'); }
if (branch === 'main') die('Refusing to run on main. Use a dedicated branch.');
// Changes confined to the generated outputs are tolerated: step 2 regenerates
// src/content/docs + src/sidebar.mjs deterministically, so a prior (dry) run
// that left them dirty must NOT block a re-run or the --apply run. Anything
// else (or a dirty claude.md) still aborts so the cutover stays a clean diff.
const isGenerated = (p) =>
  p.startsWith('src/content/docs/') || p === 'src/sidebar.mjs';
const isIgnored = (p) => /^claude\.md$/i.test(p);
const dirty = sh('git status --porcelain')
  .split('\n')
  .filter(Boolean)
  // porcelain line is "XY <path>"; sh() trims the output, so the first line's
  // leading space is gone — strip the status token by whitespace, not columns.
  .map((l) => l.trim().replace(/^\S+\s+/, '').replace(/^"|"$/g, ''))
  .filter((p) => !isGenerated(p) && !isIgnored(p));
if (dirty.length) {
  die(`Working tree not clean. Commit or stash first (the cutover should be a reviewable diff):\n    ${dirty.join('\n    ')}`);
}
if (!existsSync(join(ROOT, 'src', 'content', 'docs'))) die('src/content/docs missing — nothing to switch to.');
log(`✓ branch: ${branch}, tree clean (or only regenerated content), Astro content present`);

// ── 2. Finalize Astro (content + nav current with the Jekyll source) ─────────
hr('2. Finalize Astro from the current Jekyll source');
log('› node scripts/migrate.mjs');
log(sh('node scripts/migrate.mjs').split('\n').slice(-3).join('\n'));
log('› node scripts/convert-nav.mjs');
sh('node scripts/convert-nav.mjs');
log('✓ migrate + convert-nav done');

// Surface what the finalize step actually changed — these are pages/nav that
// were stale in the committed Astro content (e.g. updates synced from main but
// not yet re-migrated). They become part of the cutover commit in --apply mode.
const regen = sh('git status --porcelain -- src/content/docs src/sidebar.mjs')
  .split('\n')
  .filter(Boolean);
if (regen.length) {
  log(`\nℹ ${regen.length} generated file(s) refreshed by migrate/convert-nav — ${APPLY ? 'these will be staged into the cutover commit' : 'commit these (or they ride along with --apply)'}:`);
  regen.slice(0, 20).forEach((l) => log(`    ${l.trim()}`));
  if (regen.length > 20) log(`    …and ${regen.length - 20} more`);
} else {
  log('✓ generated content already current (no refresh needed)');
}

// ── 3. Pre-cutover build ─────────────────────────────────────────────────────
if (!SKIP_BUILD) {
  hr('3. Pre-cutover build');
  try { sh('npx astro build'); log('✓ build passes (pre-cutover)'); }
  catch (e) { die(`Pre-cutover build failed:\n${e.stdout || e.message}`); }
}

// ── Surface any unexpected top-level entries (neither KEEP nor REMOVE) ───────
const known = new Set([...KEEP, ...REMOVE]);
const unknown = readdirSync(ROOT).filter(
  (e) => !known.has(e) && !e.startsWith('.') && statSync(join(ROOT, e)),
);
if (unknown.length) {
  log('\n⚠ Unrecognized top-level entries — review manually, NOT auto-removed:');
  unknown.forEach((e) => log(`    ${e}`));
}

// ── 4. Validate migration — page-tree diff (Jekyll ↔ Astro) ─────────────────
hr('4. Validate migration — page-tree diff (Jekyll ↔ Astro)');
const { jekyllCount, astroCount, excluded, missing, extra } = diffPageTrees();
log(`Jekyll source pages: ${jekyllCount} real (+${excluded} redirect-stub/intentional-delete, excluded)`);
log(`Astro pages:         ${astroCount}`);

if (missing.length) {
  log(`\n✗ ${missing.length} Jekyll page(s) have NO matching Astro page (content would be lost):`);
  missing.slice(0, 50).forEach((p) => log(`    ${p}`));
  if (missing.length > 50) log(`    …and ${missing.length - 50} more`);
  if (!FORCE) die('Page-tree mismatch — aborting before deletion. Investigate the missing pages, or re-run with --force if they are known/intentional.');
  log('\n⚠ --force given: continuing despite missing pages.');
} else {
  log('✓ every Jekyll source page has a matching Astro page — migration is complete');
}
if (extra.length) {
  log(`\nℹ ${extra.length} Astro-only page(s) (no Jekyll source — new/authored-in-Astro, fine):`);
  extra.slice(0, 30).forEach((p) => log(`    ${p}`));
  if (extra.length > 30) log(`    …and ${extra.length - 30} more`);
}

// ── 5. Remove Jekyll ─────────────────────────────────────────────────────────
hr(`5. Remove Jekyll source  (${REMOVE.length} entries)`);
REMOVE.forEach((p) => log(`    ${APPLY ? 'rm' : 'would rm'}  ${p}`));

if (!APPLY) {
  hr('DRY RUN — nothing changed');
  log('Re-run with --apply (ideally alongside Jordan) to perform the cutover.');
  process.exit(0);
}

for (const p of REMOVE) {
  try { sh(`git rm -r --quiet -- "${p}"`); }
  catch { sh(`rm -rf -- "${join(ROOT, p)}"`); } // untracked fallback
}
log('✓ Jekyll source removed (staged)');

// Stage the regenerated content/nav from step 2 too, so the cutover is one
// complete, reviewable diff (deletions + any pages refreshed from the source).
sh('git add -A -- src/content/docs src/sidebar.mjs');
log('✓ regenerated content + nav staged');

// ── 6. Post-cutover build ────────────────────────────────────────────────────
if (!SKIP_BUILD) {
  hr('6. Post-cutover build (Astro must be self-contained now)');
  try { sh('npx astro build'); log('✓ build passes (post-cutover) — Astro stands alone'); }
  catch (e) { die(`Post-cutover build FAILED — do NOT commit. Restore everything (incl. the git-rm'd Jekyll source) with \`git reset --hard HEAD\`:\n${e.stdout || e.message}`); }
}

// ── 6. Summary + next steps ──────────────────────────────────────────────────
hr('Switchover staged ✓ — review, then commit manually');
log(`Removed: ${REMOVE.length} Jekyll entries. Astro (src/content/docs) is now the only source.`);
log(`
NOTES / follow-ups (decide with the team):
  • scripts/migrate.mjs is now OBSOLETE (no Jekyll source to read). Keep for
    reference or remove in a follow-up.
  • Navigation: _data/navigation.yml was KEPT so convert-nav.mjs still works.
    Decide whether to internalize nav into src/sidebar.mjs and drop _data/.
  • docker-compose.yml may be Jekyll-only — review.
  • Content is now edited DIRECTLY in src/content/docs (no more migrate step).

NEXT:
  git status                 # review the deletion
  git commit -m "chore: switch over from Jekyll to Astro (remove Jekyll source)"
  git push
  → then merge feature/astro-migration → main (#897) and switch the help.keboola.com domain.
`);
