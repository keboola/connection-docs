#!/usr/bin/env node
/**
 * audit-rendering.mjs — find pages where the beacon-transforms card/grid
 * layouts scatter rich inline content (mixed text+bold, inline code, links)
 * into columns / vertical character stacks.
 *
 * Root cause: layouts like `.beacon-steps` (flex <li> + number ::before) and
 * `.beacon-glossary` (2-col grid + `p{display:contents}`) only behave when a
 * list item resolves to a single inline piece. In a "tight" list the <li> has
 * no <p> wrapper, so every inline node (text / strong / code / link) becomes
 * its own flex/grid item → it wraps word-by-word (see the OAuth/Auth0 pages).
 *
 * This reuses the REAL beacon-transforms plugin so detection can't drift from
 * what actually ships, then flags the lists whose items would break.
 *
 * Usage:  node scripts/audit-rendering.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { gfm } from 'micromark-extension-gfm';
import { visit } from 'unist-util-visit';
import beaconTransforms from '../src/integrations/beacon-transforms.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'src', 'content', 'docs');
const transform = beaconTransforms();

// Layout classes that lay <li> children out as flex/grid items.
const RISK_CLASSES = ['beacon-steps', 'beacon-glossary', 'beacon-check-grid'];

const classesOf = (n) => {
  const c = n?.data?.hProperties?.className;
  return Array.isArray(c) ? c : c ? [c] : [];
};
const paragraphOf = (li) => li.children?.find((c) => c.type === 'paragraph') || null;
const textOf = (n) =>
  !n ? '' : typeof n.value === 'string' ? n.value
    : Array.isArray(n.children) ? n.children.map(textOf).join('') : '';

/**
 * Decide whether an <li> will visually scatter under the given layout.
 *  - glossary / check-grid: 2-col layouts that expect exactly [term, definition].
 *    Any extra inline piece (more bold, code, link) overflows into the columns.
 *    A clean `**Term** — text` (2 children, one bold) renders fine.
 *  - steps: a tight <li> (no <p>) becomes a flex row whose every inline node is
 *    a flex item; 3+ pieces or inline code/link wrap word-by-word.
 */
function isBroken(cls, li) {
  const kids = paragraphOf(li)?.children || [];
  if (kids.length <= 1) return false;
  const strongs = kids.filter((k) => k.type === 'strong').length;
  const codeOrLink = kids.some((k) => k.type === 'inlineCode' || k.type === 'link');
  if (cls === 'beacon-steps') {
    const tight = li.spread !== true;
    return tight && (kids.length > 2 || codeOrLink);
  }
  return kids.length > 2 || strongs > 1 || codeOrLink;
}

function findMd(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    statSync(p).isDirectory() ? findMd(p, out) : /\.mdx?$/.test(e) && out.push(p);
  }
  return out;
}

const files = findMd(DOCS).sort();
const findings = [];

for (const file of files) {
  let raw = readFileSync(file, 'utf8').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  let tree;
  try {
    tree = fromMarkdown(raw, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] });
    transform(tree, {});
  } catch {
    continue;
  }
  visit(tree, 'list', (node) => {
    const cls = classesOf(node).find((c) => RISK_CLASSES.includes(c));
    if (!cls) return;
    const items = node.children || [];
    const broken = items.filter((li) => isBroken(cls, li));
    if (!broken.length) return;
    findings.push({
      file: relative(DOCS, file),
      cls,
      line: node.position?.start?.line ?? '?',
      items: items.length,
      broken: broken.length,
      sample: textOf(paragraphOf(broken[0])).replace(/\s+/g, ' ').slice(0, 70),
    });
  });
}

// ── Report ──────────────────────────────────────────────────────────────
const byClass = {};
for (const f of findings) (byClass[f.cls] ??= []).push(f);
console.log(`Scanned ${files.length} pages. Found ${findings.length} broken layout list(s).\n`);
for (const cls of Object.keys(byClass).sort()) {
  console.log(`## ${cls}  (${byClass[cls].length})`);
  for (const f of byClass[cls]) {
    console.log(`  ${f.file}:${f.line}  ${f.broken}/${f.items} items  — “${f.sample}…”`);
  }
  console.log('');
}
