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
 *
 * Steps:
 *   1. Preflight (git clean, on a branch, not main, src/content/docs present).
 *   2. Finalize Astro: run migrate.mjs + convert-nav.mjs so content + nav are
 *      fully current with the Jekyll source (incl. anything just synced from main).
 *   3. Pre-cutover build — must pass.
 *   4. git rm the Jekyll source (content dirs + SSG config + root index/404).
 *   5. Post-cutover build — must STILL pass (proves Astro is self-contained).
 *   6. Print the diff summary + manual next steps. No commit.
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const APPLY = process.argv.includes('--apply');
const SKIP_BUILD = process.argv.includes('--skip-build');

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
  'DEV_DOCS_INTEGRATION.md', 'claude.md', 'CLAUDE.md', 'keboola-kolecko.png',
  'wishlist.png', 'favicon.ico', 'google9cde6c6b9250e5a4.html', 'docker-compose.yml',
  // _data/navigation.yml is still consumed by convert-nav.mjs → keep _data.
  '_data',
]);

const REMOVE = [...JEKYLL_CONTENT_DIRS, ...JEKYLL_SSG, ...JEKYLL_ROOT_PAGES]
  .filter((p) => existsSync(join(ROOT, p)));

// ── 1. Preflight ────────────────────────────────────────────────────────────
hr(`Jekyll → Astro switchover  ${APPLY ? '(APPLY)' : '(DRY RUN)'}`);

let branch;
try { branch = sh('git rev-parse --abbrev-ref HEAD'); } catch { die('Not a git repo.'); }
if (branch === 'main') die('Refusing to run on main. Use a dedicated branch.');
if (sh('git status --porcelain').split('\n').filter((l) => l && !/ claude\.md$/.test(l)).length) {
  die('Working tree not clean. Commit or stash first (the cutover should be a reviewable diff).');
}
if (!existsSync(join(ROOT, 'src', 'content', 'docs'))) die('src/content/docs missing — nothing to switch to.');
log(`✓ branch: ${branch}, clean tree, Astro content present`);

// ── 2. Finalize Astro (content + nav current with the Jekyll source) ─────────
hr('2. Finalize Astro from the current Jekyll source');
log('› node scripts/migrate.mjs');
log(sh('node scripts/migrate.mjs').split('\n').slice(-3).join('\n'));
log('› node scripts/convert-nav.mjs');
sh('node scripts/convert-nav.mjs');
log('✓ migrate + convert-nav done');

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

// ── 4. Remove Jekyll ─────────────────────────────────────────────────────────
hr(`4. Remove Jekyll source  (${REMOVE.length} entries)`);
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

// ── 5. Post-cutover build ────────────────────────────────────────────────────
if (!SKIP_BUILD) {
  hr('5. Post-cutover build (Astro must be self-contained now)');
  try { sh('npx astro build'); log('✓ build passes (post-cutover) — Astro stands alone'); }
  catch (e) { die(`Post-cutover build FAILED — do NOT commit. Restore with \`git checkout -- .\`:\n${e.stdout || e.message}`); }
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
