#!/usr/bin/env node
/**
 * chunk-docs.mjs — split the docs into embedding-ready chunks.
 *
 * Reads src/content/docs directly (same MDX flattening as the site's per-page
 * markdown export, so no build needed) and emits one record per section.
 * Sections are cut at H2/H3 (configurable); over-long sections are packed
 * paragraph by paragraph into `--max-chars` pieces without splitting a code
 * block. Headings that only appear inside fenced code are ignored.
 *
 * Every record carries the heading path and an `embed_text` field that
 * prefixes the text with `title > h2 > h3`, which is what you should embed —
 * a section body alone ("Click Save.") loses the page it belongs to.
 *
 * Usage:
 *   node scripts/chunk-docs.mjs [options]
 *
 *   --out <file>        default _graph/chunks.jsonl (extension picks format: .jsonl | .csv)
 *   --level <2|3|4>     deepest heading level that starts a new chunk (default 3)
 *   --max-chars <n>     soft max chunk size (default 2000 ≈ 500 tokens)
 *   --min-chars <n>     drop chunks shorter than this (default 80)
 *   --granularity page  one record per page instead of per section
 *   --strip-code        replace fenced code blocks with "[code: <lang>]"
 *   --plain             strip markdown syntax (links, emphasis) from `text` and `embed_text`
 *
 * Output fields:
 *   id, slug, url, title, section, section_title, heading_path, anchor,
 *   level, position, text, embed_text, chars, approx_tokens, has_code,
 *   links (slugs this chunk links to), legacy_urls
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve, extname } from 'node:path';
import {
  loadCorpus,
  splitByHeadings,
  headingAnchor,
  ROOT,
  isAssetPath,
} from './lib/docs-corpus.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i === -1 ? def : args[i + 1];
};
const OUT = resolve(ROOT, opt('--out', '_graph/chunks.jsonl'));
const LEVEL = Number(opt('--level', 3));
const MAX = Number(opt('--max-chars', 2000));
const MIN = Number(opt('--min-chars', 80));
const GRANULARITY = opt('--granularity', 'section');
const STRIP_CODE = args.includes('--strip-code');
const PLAIN = args.includes('--plain');

const FENCE = /^\s*(`{3,}|~{3,})/;

/** Collect internal page links in a text as slugs. */
function collectLinks(text, corpus) {
  const out = new Set();
  for (const m of text.matchAll(/\]\((\/[^)\s#]*)(?:#[^)]*)?\)/g)) {
    if (isAssetPath(m[1])) continue;
    const t = corpus.resolve(m[1]);
    if (t != null) out.add(t);
  }
  return [...out];
}

function stripCode(text) {
  const out = [];
  let fence = null;
  let lang = '';
  for (const line of text.split('\n')) {
    const f = line.match(FENCE);
    if (f) {
      if (!fence) {
        fence = f[1][0];
        lang = line.replace(FENCE, '').trim();
        out.push(`[code${lang ? `: ${lang}` : ''}]`);
      } else if (f[1][0] === fence) {
        fence = null;
      }
      continue;
    }
    if (!fence) out.push(line);
  }
  return out.join('\n');
}

function toPlain(text) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}:::[^\n]*$/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(^|[^*\w])[*_]([^*_\n]+)[*_](?=[^*\w]|$)/g, '$1$2')
    .replace(/<[^>\n]+>/g, '')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Split a block of text into pieces of at most MAX chars, cutting only at
 * blank lines and never inside a fenced code block.
 */
/**
 * A single unit (no blank lines) that is still over MAX — a huge code block or
 * a long table — is cut at line boundaries. Code blocks are re-fenced and
 * tables get their header rows repeated so each piece stays valid markdown.
 */
function hardSplit(unit) {
  if (unit.length <= MAX) return [unit];
  const lines = unit.split('\n');
  let prefix = [];
  let suffix = [];
  let bodyLines = lines;
  const open = lines[0].match(FENCE);
  if (open && lines.length > 2 && lines.at(-1).match(FENCE)) {
    prefix = [lines[0]];
    suffix = [lines.at(-1)];
    bodyLines = lines.slice(1, -1);
  } else if (lines.length > 2 && /^\s*\|?\s*:?-{3,}/.test(lines[1]) && lines[0].includes('|')) {
    prefix = lines.slice(0, 2);
    bodyLines = lines.slice(2);
  }
  const budget = Math.max(200, MAX - prefix.join('\n').length - suffix.join('\n').length - 2);
  const out = [];
  let cur = [];
  let len = 0;
  const wrapped = bodyLines.flatMap((line) => {
    if (line.length <= budget) return [line];
    const parts = [];
    for (let i = 0; i < line.length; i += budget) parts.push(line.slice(i, i + budget));
    return parts;
  });
  for (const line of wrapped) {
    if (cur.length && len + line.length + 1 > budget) {
      out.push([...prefix, ...cur, ...suffix].join('\n'));
      cur = [];
      len = 0;
    }
    cur.push(line);
    len += line.length + 1;
  }
  if (cur.length) out.push([...prefix, ...cur, ...suffix].join('\n'));
  return out;
}

function pack(text) {
  if (text.length <= MAX) return [text];
  const units = [];
  let cur = [];
  let fence = null;
  const flush = () => {
    const s = cur.join('\n').trim();
    if (s) units.push(s);
    cur = [];
  };
  for (const line of text.split('\n')) {
    const f = line.match(FENCE);
    if (f) fence = fence ? (f[1][0] === fence ? null : fence) : f[1][0];
    if (!fence && line.trim() === '') {
      cur.push(line);
      flush();
    } else cur.push(line);
  }
  flush();

  const pieces = [];
  let buf = '';
  for (const u of units.flatMap(hardSplit)) {
    if (buf && buf.length + u.length + 2 > MAX) {
      pieces.push(buf);
      buf = u;
    } else buf = buf ? `${buf}\n\n${u}` : u;
  }
  if (buf) pieces.push(buf);
  return pieces;
}

function main() {
  const corpus = loadCorpus();
  const records = [];

  for (const page of corpus.pages) {
    const base = {
      slug: page.slug,
      url: page.url,
      title: page.title,
      section: page.section || 'home',
      section_title: page.sectionTitle,
      legacy_urls: page.redirectFrom.map((r) => `/${r}/`),
    };

    let body = page.body;
    if (STRIP_CODE) body = stripCode(body);

    if (GRANULARITY === 'page') {
      const text = PLAIN ? toPlain(body) : body.trim();
      const embed = `${page.title}\n\n${page.description ? page.description + '\n\n' : ''}${text}`;
      records.push({
        id: page.slug || 'home',
        ...base,
        heading_path: page.title,
        anchor: '',
        level: 1,
        position: 0,
        text,
        embed_text: embed,
        chars: text.length,
        approx_tokens: Math.round(embed.length / 4),
        has_code: /^\s*```/m.test(body),
        links: collectLinks(body, corpus),
      });
      continue;
    }

    const blocks = splitByHeadings(body, LEVEL);
    const path = []; // heading stack by level
    const seen = new Map();
    let position = 0;

    for (const block of blocks) {
      if (block.level > 0) {
        path.length = block.level - 1; // H2 -> index 1, H3 -> index 2
        path[block.level - 1] = block.heading;
      }
      const headings = path.filter(Boolean);
      const raw = block.lines.join('\n').trim();
      if (!raw) continue;

      let anchor = block.heading ? headingAnchor(block.heading) : '';
      if (anchor) {
        const n = seen.get(anchor) ?? 0;
        seen.set(anchor, n + 1);
        if (n) anchor = `${anchor}-${n}`;
      }

      const pieces = pack(raw);
      pieces.forEach((piece, i) => {
        const text = PLAIN ? toPlain(piece) : piece;
        if (text.length < MIN) return;
        const headingPath = [page.title, ...headings].join(' > ');
        const embed = `${headingPath}\n\n${text}`;
        const idBase = anchor ? `${page.slug || 'home'}#${anchor}` : page.slug || 'home';
        records.push({
          id: pieces.length > 1 ? `${idBase}~${i + 1}` : idBase,
          ...base,
          heading_path: headingPath,
          anchor,
          level: block.level || 1,
          position: position++,
          text,
          embed_text: embed,
          chars: text.length,
          approx_tokens: Math.round(embed.length / 4),
          has_code: /^\s*```/m.test(piece),
          links: collectLinks(piece, corpus),
        });
      });
    }
  }

  mkdirSync(dirname(OUT), { recursive: true });
  if (extname(OUT) === '.csv') {
    const cols = Object.keys(records[0]);
    const esc = (v) => {
      const s = Array.isArray(v) ? v.join(' ') : String(v ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [cols.join(','), ...records.map((r) => cols.map((c) => esc(r[c])).join(','))];
    writeFileSync(OUT, lines.join('\n') + '\n');
  } else {
    writeFileSync(OUT, records.map((r) => JSON.stringify(r)).join('\n') + '\n');
  }

  const sizes = records.map((r) => r.chars).sort((a, b) => a - b);
  const q = (p) => sizes[Math.min(sizes.length - 1, Math.floor(p * sizes.length))];
  const perSection = {};
  for (const r of records) perSection[r.section] = (perSection[r.section] ?? 0) + 1;
  console.log(
    `chunks: ${OUT}\n` +
      `records ${records.length} from ${corpus.pages.length} pages | ` +
      `chars p50 ${q(0.5)} p90 ${q(0.9)} max ${sizes.at(-1)} | ` +
      `approx tokens total ${records.reduce((s, r) => s + r.approx_tokens, 0)}\n` +
      `per section: ${Object.entries(perSection).map(([k, v]) => `${k} ${v}`).join(', ')}`,
  );
}

main();
