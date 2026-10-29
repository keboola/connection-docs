#!/usr/bin/env node
/**
 * content-lint.mjs — content-quality linter for the docs.
 *
 * Walks every page in src/content/docs and reports issues that hurt search,
 * Ask Kai, and reader trust — the things a Phase-3 content pass should clear:
 *
 *   • missing `description:`   — feeds search snippets, <meta>, the page lede,
 *                                and Ask Kai/RAG context
 *   • liquid           — leftover Jekyll `{% … %}` / `{{ … }}` template tags
 *   • html-links       — links to `*.html` (old Jekyll URLs; should be clean paths)
 *   • visual-deixis    — "as shown above/below", "see the screenshot above" — prose
 *                        that assumes an image that may not be there / is being removed
 *   • deprecated       — terms we've renamed/retired (configurable below)
 *
 * Usage:
 *   node scripts/content-lint.mjs            # full report
 *   node scripts/content-lint.mjs --rule=description   # one rule only
 *   node scripts/content-lint.mjs --quiet    # counts only (good for CI)
 *
 * Exit code is non-zero when any issue is found, so it can gate CI later.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'src', 'content', 'docs');

const onlyRule = process.argv.find((a) => a.startsWith('--rule='))?.split('=')[1];
const QUIET = process.argv.includes('--quiet');

/** Terms we've renamed/retired. Keep conservative — add as the IA settles. */
const DEPRECATED = [
  { term: /\bOrchestr(ation|ator)s?\b/g, use: 'Flows' },
  { term: /\bSandbox(es)?\b/g, use: 'Workspaces' },
  { term: /\bProcessed Tags?\b/g, use: '(deprecated — file input mapping)' },
];

const VISUAL_DEIXIS =
  /\b(as (shown|seen|illustrated|depicted) (above|below)|(screenshot|picture|image|figure) (above|below)|see (the )?(screenshot|picture|image|figure) (above|below)|in the (screenshot|picture|image) (above|below))\b/gi;

const LIQUID = /\{%[^%]*%\}|\{\{[^}]*\}\}/g;
const HTML_LINK = /\]\(([^)\s]*\.html(#[^)]*)?)\)/g;

/** Internal links only: relative paths or help.keboola.com — external sites that
 *  happen to end in `.html` (oracle.com/index.html, debezium.io/…​.html) are fine. */
const isInternal = (url) =>
  !/^https?:\/\//i.test(url) || /^https?:\/\/help\.keboola\.com/i.test(url);

function findMd(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    statSync(p).isDirectory() ? findMd(p, out) : /\.mdx?$/.test(e) && out.push(p);
  }
  return out;
}

function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  return m ? { fm: m[1], body: raw.slice(m[0].length) } : { fm: '', body: raw };
}

function fmField(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
}

/** strip fenced code blocks so we don't lint code samples */
const stripCode = (body) => body.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');

const RULES = {
  description(fm) {
    const d = fmField(fm, 'description');
    return !d || !d.length ? [{ msg: 'no description' }] : [];
  },
  liquid(_fm, body) {
    // Only prose Liquid is a Jekyll artifact — `{{ }}`/`{% %}` inside code blocks
    // are legit (dbt `env_var`, Streamlit/Jinja examples), so strip code first.
    return [...stripCode(body).matchAll(LIQUID)].map((m) => ({ msg: m[0].slice(0, 40) }));
  },
  'html-links'(_fm, body) {
    return [...body.matchAll(HTML_LINK)]
      .filter((m) => isInternal(m[1]))
      .map((m) => ({ msg: m[1] }));
  },
  'visual-deixis'(_fm, body) {
    return [...stripCode(body).matchAll(VISUAL_DEIXIS)].map((m) => ({ msg: `“${m[0]}”` }));
  },
  deprecated(_fm, body) {
    const text = stripCode(body);
    const out = [];
    for (const { term, use } of DEPRECATED) {
      for (const m of text.matchAll(term)) out.push({ msg: `“${m[0]}” → ${use}` });
    }
    return out;
  },
};

const ruleNames = Object.keys(RULES).filter((r) => !onlyRule || r === onlyRule);
const findings = Object.fromEntries(ruleNames.map((r) => [r, []]));

for (const file of findMd(DOCS).sort()) {
  const raw = readFileSync(file, 'utf8');
  const { fm, body } = splitFrontmatter(raw);
  const rel = relative(DOCS, file);
  for (const r of ruleNames) {
    for (const hit of RULES[r](fm, body)) findings[r].push({ file: rel, ...hit });
  }
}

// ── Report ────────────────────────────────────────────────────────────────
let total = 0;
console.log(`\nContent lint — ${findMd(DOCS).length} pages\n${'─'.repeat(50)}`);
for (const r of ruleNames) {
  const hits = findings[r];
  total += hits.length;
  const pages = new Set(hits.map((h) => h.file)).size;
  console.log(`\n${r.toUpperCase()}  —  ${hits.length} issue(s) across ${pages} page(s)`);
  if (!QUIET) {
    for (const h of hits.slice(0, 60)) console.log(`  ${h.file}${h.msg ? `  ·  ${h.msg}` : ''}`);
    if (hits.length > 60) console.log(`  …and ${hits.length - 60} more`);
  }
}
console.log(`\n${'─'.repeat(50)}\nTOTAL: ${total} issue(s)\n`);
process.exit(total > 0 ? 1 : 0);
