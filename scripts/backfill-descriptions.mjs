#!/usr/bin/env node
/**
 * backfill-descriptions.mjs — add a draft `description:` to every page missing one.
 *
 * `description` feeds search snippets, the <meta> tag, the page lede, and Ask
 * Kai / RAG context — yet all migrated pages lack it. This proposes a first
 * draft from each page's opening prose so a human only has to refine, not write
 * from scratch. Drafts are deliberately plain; treat them as a starting point.
 *
 * Usage:
 *   node scripts/backfill-descriptions.mjs            # DRY RUN — preview only
 *   node scripts/backfill-descriptions.mjs --apply    # write the frontmatter
 *
 * Idempotent: pages that already have a non-empty description are left untouched.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'src', 'content', 'docs');
const APPLY = process.argv.includes('--apply');
const MAX = 160; // search-snippet sweet spot

function findMd(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    statSync(p).isDirectory() ? findMd(p, out) : /\.mdx?$/.test(e) && out.push(p);
  }
  return out;
}

const splitFm = (raw) => {
  const m = raw.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n?)/);
  return m ? { open: m[1], fm: m[2], close: m[3], body: raw.slice(m[0].length) } : null;
};

/** First real sentence(s) of prose — skip headings, images, admonitions, html, lists. */
function leadProse(body) {
  const lines = body.split(/\r?\n/);
  const para = [];
  let inAside = false;
  let inFence = false;
  for (const line of lines) {
    const t = line.trim();
    if (/^```/.test(t)) { inFence = !inFence; continue; }
    if (inFence) continue;
    if (/^:::/.test(t)) { inAside = !inAside; continue; } // skip whole admonition
    if (inAside) continue;
    if (!para.length) {
      if (!t) continue;
      if (/^(#|!\[|<|>|[-*]\s|\d+\.\s|\|)/.test(t)) continue; // not prose
      para.push(t);
    } else {
      if (!t) break; // paragraph ended
      para.push(t);
    }
  }
  return para
    .join(' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → text
    .replace(/[*_`]/g, '') // emphasis/code marks
    .replace(/\s+/g, ' ')
    .trim();
}

/** Trim to <= MAX chars on a word/sentence boundary. */
function clip(text) {
  if (text.length <= MAX) return text;
  const cut = text.slice(0, MAX);
  const sentence = cut.lastIndexOf('. ');
  if (sentence > MAX * 0.5) return cut.slice(0, sentence + 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '') + '…';
}

const yamlEscape = (s) =>
  /[:#'"\[\]{}&*!|>%@`]/.test(s) ? `"${s.replace(/"/g, '\\"')}"` : s;

const files = findMd(DOCS).sort();
let filled = 0;
let skippedNoProse = 0;

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const parts = splitFm(raw);
  if (!parts) continue;
  if (/^description:\s*\S/m.test(parts.fm)) continue; // already has one

  const draft = clip(leadProse(parts.body));
  if (!draft || draft.length < 25) { skippedNoProse++; continue; }

  const line = `description: ${yamlEscape(draft)}`;
  // place after `title:` (or `slug:`) for readability
  const anchored = parts.fm.match(/^(title:.*|slug:.*)$/m);
  const newFm = anchored
    ? parts.fm.replace(anchored[0], `${anchored[0]}\n${line}`)
    : `${parts.fm}\n${line}`;

  filled++;
  if (filled <= 8 || !APPLY) {
    console.log(`\n${relative(DOCS, file)}`);
    console.log(`  + ${line}`);
  }
  if (APPLY) writeFileSync(file, parts.open + newFm + parts.close + parts.body);
}

console.log(`\n${'─'.repeat(50)}`);
console.log(`${APPLY ? 'Wrote' : 'Would write'} description to ${filled} page(s).`);
if (skippedNoProse) console.log(`Skipped ${skippedNoProse} page(s) with no usable opening prose — fill by hand.`);
if (!APPLY) console.log('Dry run — re-run with --apply to write.');
