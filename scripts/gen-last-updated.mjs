/**
 * Writes each page's real last-edit date into its frontmatter as `lastUpdated`.
 *
 *   npm run gen:lastupdated     # write the dates
 *   npm run check:lastupdated   # report drift, write nothing, exit 1 if stale
 *
 * ## Why the dates are precomputed rather than read at build time
 *
 * Starlight's `lastUpdated` normally shells out to `git log` during the build.
 * That does not work on Vercel, which is what serves help.keboola.com: a probe
 * deployed to a preview showed `.git` present and `git --version` fine, but
 * every other git command failing — `rev-parse --git-dir` included. Deepening
 * the clone and publishing `safe.directory` both failed to change it. What did
 * render on that same preview was the one page carrying a frontmatter
 * `lastUpdated`, because Starlight prefers frontmatter over git and never
 * shells out for it.
 *
 * So the dates are resolved here, from a machine that can read the history,
 * and committed. `.github/workflows/sync-last-updated.yml` re-runs this weekly
 * and opens a PR when anything moved, the same shape as the CLI reference sync.
 *
 * Merge commits are ignored (`--no-merges`): a merge touches every file it
 * brings in, so counting it would date a page by when its PR landed rather
 * than when its text last changed — and would stamp a branch merge's whole
 * incoming set with the merge day.
 *
 * ## Why the migration commit is skipped
 *
 * b3a2e34 "Migrate 264 markdown files and 1218 images to Starlight format" is
 * a mechanical reformat that touched every file. Counting it would stamp 70
 * pages 2026-03-18 whose content last changed between 2021 and 2024 — a date
 * that overstates freshness is worse than no date, since judging freshness is
 * the whole reason the reader looks at it. Those pages are resolved with
 * `git log --follow`, which crosses the rename the migration performed.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DOCS = 'src/content/docs';
const CHECK = process.argv.includes('--check');

/** The Jekyll→Starlight migration. Pinned by SHA: matching on the subject line
 *  would break if the commit were ever reworded, and this is the one commit
 *  whose date must never be shown as a content date. */
const MIGRATION_SHA = 'b3a2e34056019970bb29bedf748269b4d34614c7';

const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf-8', maxBuffer: 64 << 20 });

/**
 * Every commit touching each page, newest first, from one pass over the log.
 *
 * `--follow` cannot be batched — it takes a single path — so this cheap bulk
 * pass runs first and only the pages it cannot answer fall back to it. That is
 * exactly the set the migration created, since those paths have no earlier
 * commit under their current name.
 */
function historyFromOnePass() {
  const log = git(['log', '--no-merges', '--format=c:%H %cs', '--name-status', '--', DOCS]);
  const history = new Map();
  let commit = null;

  for (const line of log.split('\n')) {
    if (line.startsWith('c:')) {
      const [sha, date] = line.slice(2).split(' ');
      commit = { sha, date };
      continue;
    }
    if (!commit) continue;
    // Added/Modified entries are "A\t<path>" / "M\t<path>"; renames are
    // "R100\t<old>\t<new>" and the new path is what we key on.
    const parts = line.split('\t');
    if (parts.length < 2) continue;
    const path = parts[parts.length - 1];
    if (!history.has(path)) history.set(path, []);
    history.get(path).push(commit);
  }
  return history;
}

/**
 * True when a commit changed nothing in this page but its own `lastUpdated`.
 *
 * Without this the generator reads its own output: writing the date is itself
 * an edit, so the next run would see that commit as the page's newest change
 * and move the date to whenever the generator last ran. Every page would end
 * up looking freshly updated, which is worse than the problem being solved.
 */
function isDateOnlyEdit(sha, file) {
  let diff;
  try {
    diff = git(['show', '--format=', '--unified=0', sha, '--', file]);
  } catch {
    return false;
  }
  const changed = diff
    .split('\n')
    .filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l))
    .map((l) => l.slice(1).trim())
    .filter(Boolean);
  return changed.length > 0 && changed.every((l) => l.startsWith('lastUpdated:'));
}

/** First commit that actually changed the page's content. */
function realEditDate(commits, file) {
  for (const { sha, date } of commits) {
    if (sha === MIGRATION_SHA) continue;
    if (isDateOnlyEdit(sha, file)) continue;
    return date;
  }
  return undefined;
}

/** Follows the migration's rename to find a page's real previous edit. */
function dateViaFollow(file) {
  const commits = git(['log', '--follow', '--no-merges', '--format=%H %cs', '--', file])
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [sha, date] = line.split(' ');
      return { sha, date };
    });
  return realEditDate(commits, file);
}

const pages = git(['ls-files', DOCS])
  .split('\n')
  .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

const history = historyFromOnePass();
let written = 0;
const drift = [];
const unresolved = [];

for (const file of pages) {
  const date = realEditDate(history.get(file) ?? [], file) ?? dateViaFollow(file);
  if (!date) {
    unresolved.push(file);
    continue;
  }

  // Read as raw text so line endings survive — 23 pages are CRLF and a dozen
  // are mixed, and rewriting endings turns a one-line edit into a whole-file
  // diff. The terminator comes from the anchor line itself, never guessed.
  const raw = readFileSync(ROOT + file, 'utf-8');
  const existing = raw.match(/^lastUpdated:\s*(\S+)\s*$/m)?.[1];

  if (existing === date) continue;

  if (CHECK) {
    drift.push(`${file}: frontmatter ${existing ?? '(none)'} -> should be ${date}`);
    continue;
  }

  const updated = existing
    ? raw.replace(/^lastUpdated:.*$/m, `lastUpdated: ${date}`)
    : raw.replace(
        /^(title:[^\r\n]*)(\r?\n)/m,
        (_match, titleLine, eol) => `${titleLine}${eol}lastUpdated: ${date}${eol}`
      );

  if (updated === raw) {
    unresolved.push(`${file} (no title: line to anchor the insertion)`);
    continue;
  }
  writeFileSync(ROOT + file, updated);
  written++;
}

for (const file of unresolved) console.warn(`  unresolved: ${file}`);

if (CHECK) {
  // A page with no resolvable history is a failure too, not a pass: the
  // build would silently render it without a date. Seen when the generator
  // runs mid-merge on files that arrived from another branch — commit the
  // merge first, then re-run.
  if (unresolved.length) {
    console.error(`\n${unresolved.length} page(s) have no resolvable git history — see above.`);
    process.exit(1);
  }
  if (drift.length) {
    console.error(`${drift.length} page(s) have a stale or missing lastUpdated:\n`);
    for (const line of drift.slice(0, 40)) console.error(`  ${line}`);
    if (drift.length > 40) console.error(`  …and ${drift.length - 40} more`);
    console.error('\nRun `npm run gen:lastupdated` and commit the result.');
    process.exit(1);
  }
  console.log(`All ${pages.length} pages carry the right lastUpdated.`);
} else {
  console.log(`Updated ${written} of ${pages.length} pages.`);
}
