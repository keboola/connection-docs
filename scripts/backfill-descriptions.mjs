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

/** Headings, images, HTML, blockquotes, lists, and tables are never prose. */
const NOT_PROSE = /^(#|!\[|<|>|[-*]\s|\d+\.\s|\|)/;

const MIN = 25; // shorter than this is a label ("Video:"), not a description

const cleanParagraph = (lines) =>
  lines
    .join(' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → text
    .replace(/<[^>]*>/g, ' ') // stray inline HTML tags
    .replace(/[*_`]/g, '') // emphasis/code marks
    .replace(/\s+/g, ' ')
    .trim();

/** Long enough, and not a side-note or visual deixis — those aren't intros. */
const usable = (text) => {
  const t = text.replace(/[\s,;:]+$/, '');
  return t.length >= MIN && !/^note:/i.test(t) && !/^as you can see/i.test(t);
};

const VOID_TAG = /^<(br|hr|img|input|meta|link|source|wbr)\b/i;

/** Net change in open-HTML-block depth contributed by one line. */
const htmlDelta = (t) => {
  const opens = (t.match(/<[a-z][^>]*>/gi) || []).filter(
    (tag) => !/\/>$/.test(tag) && !VOID_TAG.test(tag)
  ).length;
  const closes = (t.match(/<\/[a-z][^>]*>/gi) || []).length;
  return opens - closes;
};

/**
 * First usable prose paragraph — skips headings, images, admonitions, HTML
 * comments/blocks, lists, and tables. A non-prose line *ends* the current
 * paragraph (a table or iframe is never absorbed as continuation), and an
 * unusable paragraph falls through to the next one.
 */
function leadProse(body) {
  // HTML comments span lines and leak template internals — drop them first.
  const lines = body.replace(/<!--[\s\S]*?-->/g, ' ').split(/\r?\n/);
  let para = [];
  let inAside = false;
  let inFence = false;
  let htmlDepth = 0; // >0 = inside a multi-line HTML block (tables can contain blank lines)
  const flush = () => {
    const text = cleanParagraph(para);
    para = [];
    return usable(text) ? text : '';
  };
  for (const line of lines) {
    const t = line.trim();
    if (/^```/.test(t)) { inFence = !inFence; continue; }
    if (inFence) continue;
    if (/^:::/.test(t)) { inAside = !inAside; continue; } // skip whole admonition
    if (inAside) continue;
    if (htmlDepth > 0) {
      htmlDepth = Math.max(0, htmlDepth + htmlDelta(t));
      continue;
    }
    if (!t) {
      const text = flush();
      if (text) return text;
      continue;
    }
    if (NOT_PROSE.test(t)) {
      const text = flush();
      if (text) return text;
      if (t.startsWith('<')) htmlDepth = Math.max(0, htmlDelta(t)); // enter the HTML block
      continue;
    }
    para.push(t);
  }
  return flush();
}

/** Trim to <= MAX chars on a word/sentence boundary. */
function clip(text) {
  if (text.length <= MAX) return text;
  const cut = text.slice(0, MAX);
  const sentence = cut.lastIndexOf('. ');
  if (sentence > MAX * 0.4) return cut.slice(0, sentence + 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '') + '…';
}

/** Final polish: a list-introducing colon becomes a period; a paragraph cut
 *  mid-sentence (prose running into a list) retreats to the previous sentence
 *  or gets an explicit ellipsis. */
function finish(text) {
  if (!text) return text;
  let t = text.replace(/\s+$/, '').replace(/[,;:]$/, '.');
  if (!/[.!?…"”')\]]$/.test(t)) {
    const s = t.lastIndexOf('. ');
    t = s >= MIN ? t.slice(0, s + 1) : `${t}…`;
  }
  return t;
}

const yamlEscape = (s) =>
  /[:#'"\[\]{}&*!|>%@`\\]/.test(s) ? `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : s;

const files = findMd(DOCS).sort();
let filled = 0;
let skippedNoProse = 0;

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const parts = splitFm(raw);
  if (!parts) continue;
  if (/^description:\s*\S/m.test(parts.fm)) continue; // already has one

  const draft = finish(clip(leadProse(parts.body)));
  if (!draft || draft.length < MIN) { skippedNoProse++; continue; }

  const line = `description: ${yamlEscape(draft)}`;
  // place after `title:` (or `slug:`) for readability; [^\n] (not `.`) so a
  // CRLF file keeps its `\r` on the anchor line, and the new line gets one too
  const anchored = parts.fm.match(/^(title:[^\n]*|slug:[^\n]*)$/m);
  const cr = anchored?.[0].endsWith('\r') ? '\r' : '';
  const newFm = anchored
    ? parts.fm.replace(anchored[0], `${anchored[0]}\n${line}${cr}`)
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
