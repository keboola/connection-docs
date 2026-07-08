#!/usr/bin/env node
// vault-refresh.mjs — bounded, READ-ONLY refresh for the Docs Revamp Obsidian vault.
//
// WHAT IT DOES
//   • Pulls PRDCT issues (Linear) + open PRs (GitHub) read-only.
//   • Rewrites ONLY the text between <!-- AUTO:start --> / <!-- AUTO:end --> fences
//     in _Index.md and Sections/*.md (the DERIVED layer).
//   • Detects status changes since the last run and APPENDS "PROPOSED — review"
//     blocks to the bottom of Decisions.md for the authored layer. It never edits
//     or deletes authored text, never rewrites past decisions.
//   • Prints a diff summary of the derived layer and a count of proposals.
//
// WHAT IT NEVER DOES
//   • Never deletes notes. Never touches authored paragraphs. Never git-commits.
//   • Not wired to any timer/hook — you run it explicitly.
//
// USAGE
//   node scripts/vault-refresh.mjs                 # live: gh + LINEAR_API_KEY
//   node scripts/vault-refresh.mjs --dry           # show what would change, write nothing
//   node scripts/vault-refresh.mjs --data feed.json# use agent-provided data (no secrets)
//   VAULT_DIR="/path/to/vault" node scripts/vault-refresh.mjs
//
// DATA SOURCES
//   GitHub : `gh` CLI (must be installed + authenticated). Read-only `gh pr list`.
//   Linear : LINEAR_API_KEY env var (GraphQL, read-only). If absent, Linear data
//            is skipped and only PR-derived info is refreshed (with a warning),
//            unless --data is supplied.
//   --data : a JSON file shaped { "issues": [...], "prs": [...] } that an agent
//            with Linear/GitHub MCP access can produce. Bypasses both of the above.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_VAULT =
  '/Users/nikita/Library/CloudStorage/OneDrive-Personal/Obsidian/Docs Revamp';

const LINEAR_PROJECT = 'Help Documentation Revamp';
const GH_REPO = 'keboola/connection-docs';

// PRDCT id → section note. Issues not listed here fall back to keyword matching;
// still-unmatched issues appear only in _Index and are reported as "unmapped".
const SECTION_MAP = {
  'PRDCT-358': 'Apps',
  'PRDCT-354': 'Transformations', 'PRDCT-372': 'Transformations',
  'PRDCT-373': 'Transformations', 'PRDCT-376': 'Transformations',
  'PRDCT-384': 'Transformations',
  'PRDCT-350': 'Storage',
  'PRDCT-359': 'Flows',
  'PRDCT-342': 'Components', 'PRDCT-343': 'Components', 'PRDCT-348': 'Components',
  'PRDCT-349': 'Components', 'PRDCT-351': 'Components', 'PRDCT-361': 'Components',
};
// Section notes that exist as files (get an AUTO block refreshed).
const SECTIONS = ['Apps', 'Transformations', 'Storage', 'Flows', 'Components'];

// Keyword fallback for issues not in SECTION_MAP.
const SECTION_KEYWORDS = [
  ['Apps', /\bdata[- ]?apps?\b/i],
  ['Transformations', /\btransformation/i],
  ['Storage', /\bstorage\b/i],
  ['Flows', /\bflows?\b/i],
  ['Components', /\b(extractor|writer|component)/i],
];

// Issue-state transitions worth proposing a decision note for.
const NOTABLE_STATES = new Set(['Done', 'Completed', 'On Hold', 'Canceled', 'Backlog']);

const AUTO_RE = /(<!--\s*AUTO:start\s*-->)([\s\S]*?)(<!--\s*AUTO:end\s*-->)/;

// ─────────────────────────────────────────────────────────────────────────────
// Args
// ─────────────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const valOf = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : undefined; };
if (has('--help') || has('-h')) { printHelp(); process.exit(0); }

const DRY = has('--dry');
const VAULT_DIR = valOf('--vault') || process.env.VAULT_DIR || DEFAULT_VAULT;
const DATA_FILE = valOf('--data') || process.env.DATA_FILE;
const STATE_FILE = path.join(VAULT_DIR, '.vault-refresh-state.json');
const today = new Date().toISOString().slice(0, 10);

if (!fs.existsSync(VAULT_DIR)) {
  fail(`Vault not found: ${VAULT_DIR}\nSet --vault <path> or VAULT_DIR.`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
run().catch((e) => fail(e?.stack || String(e)));

async function run() {
  log(`Docs Revamp vault refresh ${DRY ? '(dry-run)' : ''}`);
  log(`Vault: ${VAULT_DIR}`);

  const data = await loadData();
  const issues = data.issues || [];
  const prs = data.prs || [];
  log(`Loaded ${issues.length} PRDCT issues, ${prs.length} open PRs.`);

  // Index PRs by the PRDCT id mentioned in title/branch.
  const prByPrdct = new Map();
  for (const pr of prs) {
    const id = prdctIdOf(`${pr.title || ''} ${pr.branch || ''}`);
    if (id && !prByPrdct.has(id)) prByPrdct.set(id, pr);
  }
  const unlinkedPrs = prs.filter((pr) => !prdctIdOf(`${pr.title || ''} ${pr.branch || ''}`));

  // Decorate issues with their PR + section.
  const model = issues.map((i) => ({
    ...i,
    pr: prByPrdct.get(i.identifier) || prFromAttachments(i, prs) || null,
    section: sectionFor(i),
  })).sort((a, b) => idNum(a.identifier) - idNum(b.identifier));

  // ── DERIVED layer: rewrite AUTO blocks ──────────────────────────────────────
  const changes = [];
  changes.push(rewriteAuto(path.join(VAULT_DIR, '_Index.md'), renderIndexAuto(model, unlinkedPrs, prs)));
  for (const s of SECTIONS) {
    const f = path.join(VAULT_DIR, 'Sections', `${s}.md`);
    if (fs.existsSync(f)) changes.push(rewriteAuto(f, renderSectionAuto(s, model)));
  }

  // ── AUTHORED layer: propose (append-only), never edit ───────────────────────
  const { proposals, prevState, nextState } = diffState(model);
  const isFirstRun = Object.keys(prevState).length === 0;
  let proposalCount = 0;
  if (isFirstRun) {
    log('First run — establishing state baseline (no proposals generated).');
  } else if (proposals.length) {
    proposalCount = appendProposals(proposals);
  }

  // ── Persist state cache (not a note) ────────────────────────────────────────
  if (!DRY) fs.writeFileSync(STATE_FILE, JSON.stringify(nextState, null, 2));

  // ── Report ──────────────────────────────────────────────────────────────────
  reportDerived(changes);
  reportAuthored(proposals, proposalCount, isFirstRun);
  if (DRY) log('\nDry-run: no files were written.');
}

// ─────────────────────────────────────────────────────────────────────────────
// Data acquisition (all READ-ONLY)
// ─────────────────────────────────────────────────────────────────────────────
async function loadData() {
  if (DATA_FILE) {
    log(`Data source: --data file (${DATA_FILE})`);
    const j = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return { issues: j.issues || [], prs: (j.prs || []).map(normPr) };
  }
  const prs = fetchGithubPrs();
  let issues = [];
  if (process.env.LINEAR_API_KEY) {
    issues = await fetchLinearIssues();
  } else {
    warn('LINEAR_API_KEY not set — skipping Linear. Issue states/titles will not be');
    warn('refreshed this run (PR data still refreshes). Set LINEAR_API_KEY or use --data.');
    // Reuse last-known issues from the state cache so AUTO blocks don't lose rows.
    issues = issuesFromState();
  }
  return { issues, prs };
}

function fetchGithubPrs() {
  try {
    const out = execFileSync('gh', [
      'pr', 'list', '--repo', GH_REPO, '--state', 'open',
      '--json', 'number,title,author,headRefName,isDraft,url', '--limit', '200',
    ], { encoding: 'utf8' });
    return JSON.parse(out).map((p) => normPr({
      number: p.number, title: p.title,
      author: p.author?.login || p.author?.name || '',
      branch: p.headRefName, draft: p.isDraft, url: p.url,
    }));
  } catch (e) {
    warn(`gh PR fetch failed (${e.message.split('\n')[0]}). Continuing with no PR data.`);
    return [];
  }
}

async function fetchLinearIssues() {
  const query = `query($after:String){issues(first:100,after:$after,filter:{project:{name:{eq:"${LINEAR_PROJECT}"}}}){pageInfo{hasNextPage endCursor}nodes{identifier title url priority state{name type}assignee{name} attachments{nodes{url}}}}}`;
  const nodes = [];
  let after = null;
  for (;;) {
    const res = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: process.env.LINEAR_API_KEY },
      body: JSON.stringify({ query, variables: { after } }),
    });
    const j = await res.json();
    if (j.errors) throw new Error('Linear API: ' + JSON.stringify(j.errors));
    const page = j.data.issues;
    nodes.push(...page.nodes);
    if (!page.pageInfo.hasNextPage) break;
    after = page.pageInfo.endCursor;
  }
  return nodes
    .filter((n) => n.identifier?.startsWith('PRDCT-'))
    .map((n) => ({
      identifier: n.identifier,
      title: n.title,
      state: n.state?.name || 'Unknown',
      stateType: n.state?.type || '',
      assignee: n.assignee?.name || null,
      url: n.url,
      attachments: (n.attachments?.nodes || []).map((a) => a.url),
    }));
}

function normPr(p) {
  return {
    number: p.number, title: p.title || '', author: p.author || '',
    branch: p.branch || p.headRefName || '', draft: !!(p.draft ?? p.isDraft),
    url: p.url || `https://github.com/${GH_REPO}/pull/${p.number}`,
  };
}

function issuesFromState() {
  if (!fs.existsSync(STATE_FILE)) return [];
  const s = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  return Object.entries(s).map(([identifier, v]) => ({
    identifier, title: v.title || '', state: v.state || 'Unknown',
    stateType: v.stateType || '', assignee: v.assignee || null, url: v.url, attachments: [],
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Section / PR helpers
// ─────────────────────────────────────────────────────────────────────────────
function prdctIdOf(s) { const m = /PRDCT-\d+/.exec(s || ''); return m ? m[0] : null; }
function idNum(id) { const m = /(\d+)/.exec(id || ''); return m ? +m[1] : 0; }

function prFromAttachments(issue, prs) {
  for (const url of issue.attachments || []) {
    const m = /\/pull\/(\d+)/.exec(url);
    if (m) { const pr = prs.find((p) => String(p.number) === m[1]); if (pr) return pr; }
  }
  return null;
}

function sectionFor(issue) {
  if (SECTION_MAP[issue.identifier]) return SECTION_MAP[issue.identifier];
  for (const [name, re] of SECTION_KEYWORDS) if (re.test(issue.title || '')) return name;
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Renderers (DERIVED content between AUTO fences)
// ─────────────────────────────────────────────────────────────────────────────
function issueLink(i) { return i.url ? `[${i.identifier}](${i.url})` : i.identifier; }
function prCell(pr) {
  if (!pr) return '—';
  return `[#${pr.number}](${pr.url})${pr.draft ? ' (draft)' : ''}`;
}
function secLink(s) { return s ? `[[Sections/${s}\\|${s}]]` : '_unmapped_'; }

function renderIndexAuto(model, unlinkedPrs, allPrs) {
  const rows = model.map((i) =>
    `| ${issueLink(i)} | ${esc(i.title)} | ${i.state} | ${prCell(i.pr)} | ${secLink(i.section)} |`);
  const drafts = allPrs.filter((p) => p.draft).length;
  const ready = allPrs.filter((p) => !p.draft).map((p) => `#${p.number}`).join(', ') || 'none';
  const unlinked = unlinkedPrs.length
    ? unlinkedPrs.map((p) => `[#${p.number}](${p.url}) — ${esc(p.title)} (${p.author})`).join('; ')
    : 'none';
  return [
    '<!-- Machine-maintained by scripts/vault-refresh.mjs. Do not edit by hand. -->',
    '## Current state — DERIVED',
    '',
    `> Refreshed **${today}**. Project: **${LINEAR_PROJECT}**.`,
    '',
    '| PRDCT | Title | Status | PR | Section |',
    '|---|---|---|---|---|',
    ...rows,
    '',
    `**Open PRs without a linked PRDCT:** ${unlinked}.`,
    '',
    `_${allPrs.length} open PRs total; ${drafts} draft. Ready (non-draft): ${ready}._`,
  ].join('\n');
}

function renderSectionAuto(section, model) {
  const rows = model.filter((i) => i.section === section).map((i) =>
    `| ${issueLink(i)} | ${esc(i.title)} | ${i.state} | ${prCell(i.pr)} |`);
  const body = rows.length
    ? ['| PRDCT | Title | State | PR |', '|---|---|---|---|', ...rows].join('\n')
    : '_No linked tickets._';
  return [
    '<!-- Machine-maintained by scripts/vault-refresh.mjs. Do not edit by hand. -->',
    `### Linked tickets — DERIVED (refreshed ${today})`,
    '',
    body,
  ].join('\n');
}

function esc(s) { return String(s).replace(/\|/g, '\\|'); }

// ─────────────────────────────────────────────────────────────────────────────
// AUTO-fence rewrite (the ONLY mutation of derived files)
// ─────────────────────────────────────────────────────────────────────────────
function rewriteAuto(file, innerNew) {
  const name = path.basename(file);
  if (!fs.existsSync(file)) return { name, status: 'missing' };
  const before = fs.readFileSync(file, 'utf8');
  if (!AUTO_RE.test(before)) return { name, status: 'no-fence' };

  const oldInner = AUTO_RE.exec(before)[2].trim();
  const after = before.replace(AUTO_RE, (_, s, __, e) => `${s}\n${innerNew}\n${e}`);
  const changed = before !== after;
  if (changed && !DRY) fs.writeFileSync(file, after);
  return { name, status: changed ? 'updated' : 'unchanged', diff: changed ? lineDiff(oldInner, innerNew.trim()) : null };
}

// Tiny line-level diff summary for the report.
function lineDiff(a, b) {
  const A = new Set(a.split('\n')); const B = new Set(b.split('\n'));
  const added = [...B].filter((l) => !A.has(l) && l.startsWith('|') && !l.startsWith('|---'));
  const removed = [...A].filter((l) => !B.has(l) && l.startsWith('|') && !l.startsWith('|---'));
  return { added: added.length, removed: removed.length };
}

// ─────────────────────────────────────────────────────────────────────────────
// Authored-layer proposals (append-only; never edits existing text)
// ─────────────────────────────────────────────────────────────────────────────
function diffState(model) {
  const prevState = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) : {};
  const nextState = {};
  const proposals = [];
  for (const i of model) {
    nextState[i.identifier] = {
      title: i.title, state: i.state, stateType: i.stateType, assignee: i.assignee, url: i.url,
    };
    const prev = prevState[i.identifier];
    if (!prev) continue; // new issue handled below only if baseline already exists
    if (prev.state !== i.state && NOTABLE_STATES.has(i.state)) {
      proposals.push({
        key: `${i.identifier}:${prev.state}->${i.state}`,
        text: `**${i.identifier}** (${esc(i.title)}) moved **${prev.state} → ${i.state}**. ` +
              `Does this imply a decision worth logging? If so, write it above in the Log.`,
      });
    }
  }
  // Newly-appeared issues (only flagged once a baseline exists) that lack a section.
  if (Object.keys(prevState).length) {
    for (const i of model) {
      if (!prevState[i.identifier] && !i.section) {
        proposals.push({
          key: `${i.identifier}:new-unmapped`,
          text: `New issue **${i.identifier}** (${esc(i.title)}) has no section mapping. ` +
                `Assign it a section in SECTION_MAP (scripts/vault-refresh.mjs).`,
        });
      }
    }
  }
  return { proposals, prevState, nextState };
}

function appendProposals(proposals) {
  const file = path.join(VAULT_DIR, 'Decisions.md');
  if (!fs.existsSync(file)) { warn('Decisions.md not found — skipping proposals.'); return 0; }
  let content = fs.readFileSync(file, 'utf8');
  const fresh = proposals.filter((p) => !content.includes(`<!-- proposal:${p.key} -->`));
  if (!fresh.length) return 0;
  const block = [
    '',
    `### PROPOSED ${today} — agent suggestion (review, do not auto-accept)`,
    ...fresh.map((p) => `- ${p.text} <!-- proposal:${p.key} -->`),
  ].join('\n');
  // Append at EOF — never touches existing authored paragraphs.
  if (!DRY) fs.writeFileSync(file, content.replace(/\s*$/, '') + '\n' + block + '\n');
  return fresh.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reporting
// ─────────────────────────────────────────────────────────────────────────────
function reportDerived(changes) {
  log('\n── DERIVED layer ──');
  for (const c of changes) {
    if (c.status === 'updated') log(`  ✏️  ${c.name}: updated (+${c.diff.added} / -${c.diff.removed} rows)`);
    else if (c.status === 'unchanged') log(`  ·   ${c.name}: no change`);
    else if (c.status === 'no-fence') warn(`  ⚠️  ${c.name}: no AUTO fence found — skipped`);
    else if (c.status === 'missing') warn(`  ⚠️  ${c.name}: file missing — skipped`);
  }
}

function reportAuthored(proposals, count, isFirstRun) {
  log('\n── AUTHORED layer ──');
  if (isFirstRun) { log('  baseline established; no proposals.'); return; }
  if (!proposals.length) { log('  0 proposals for review.'); return; }
  log(`  ${count} proposal(s) appended to Decisions.md "PROPOSED — review". ${count} for review.`);
  if (count < proposals.length) log(`  (${proposals.length - count} already present — not duplicated.)`);
}

// ─────────────────────────────────────────────────────────────────────────────
// utils
// ─────────────────────────────────────────────────────────────────────────────
function log(s) { process.stdout.write(s + '\n'); }
function warn(s) { process.stderr.write(s + '\n'); }
function fail(s) { warn('ERROR: ' + s); process.exit(1); }
function printHelp() {
  log(`vault-refresh.mjs — refresh DERIVED blocks + propose authored updates (read-only)

  node scripts/vault-refresh.mjs [--dry] [--vault <dir>] [--data <file>]

  --dry           Compute changes, write nothing.
  --vault <dir>   Vault path (default: $VAULT_DIR or the OneDrive vault).
  --data <file>   JSON { issues:[...], prs:[...] } from an agent; skips live fetch.
  -h, --help      This help.

  Live mode needs: gh (authenticated) for PRs, LINEAR_API_KEY for issues.`);
}
