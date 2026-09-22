#!/usr/bin/env node
/**
 * merge-tickets.mjs — normalise support-ticket dumps into one file.
 *
 * Reads every `_graph/tickets-*.jsonl` (dumps pulled from Linear, the Slack
 * #jira_support_feed mirror, or a Jira CSV export converted to JSONL) and
 * writes `_graph/tickets.jsonl` with one schema:
 *
 *   { id, title, text, embed_text, source, created_at, team, type, url }
 *
 * `id` is the SUPPORT-NNNNN key when one can be found in the title, so the
 * same ticket seen in two sources collapses into one record (the richer
 * record — the one with a description — wins). Internal test tickets
 * ("[Team] Eng Test", keyboard-mash titles) are dropped.
 *
 * Usage: node scripts/merge-tickets.mjs [--in _graph] [--out _graph/tickets.jsonl]
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ROOT } from './lib/docs-corpus.mjs';

const args = process.argv.slice(2);
const opt = (n, d) => (args.indexOf(n) === -1 ? d : args[args.indexOf(n) + 1]);
const IN = resolve(ROOT, opt('--in', '_graph'));
const OUT = resolve(ROOT, opt('--out', '_graph/tickets.jsonl'));

const KEY = /SUPPORT-(\d{4,6})/i;
const JUNK_TEAM = /Eng Test/i;
const JUNK_TITLE = /^(?:SUPPORT-\d+\s*)?(?:[a-z]{4,12}|test\b.*|title|2 balónky|testy.*)$/i;
const NOISE_PREFIX = /^(?:re|fw|fwd)\s*:\s*/i;
const COMPONENT_ID = /\b(?:kds-team|keboola|fisa|[a-z0-9-]+)\.(ex|wr|app|processor)-([a-z0-9-]+)/gi;
const KIND = { ex: 'extractor', wr: 'writer', app: 'application', processor: 'processor' };

function normalise(raw, file) {
  const title0 = String(raw.title ?? '').trim();
  const m = title0.match(KEY);
  const id = m ? `SUPPORT-${m[1]}` : raw.id ?? null;
  let title = title0.replace(KEY, '').replace(/^[\s:–-]+/, '').trim();
  title = title.replace(NOISE_PREFIX, '').replace(NOISE_PREFIX, '').trim();
  const text = String(raw.description ?? raw.text ?? '').replace(/\s+/g, ' ').trim();
  // "kds-team.ex-netsuite" says nothing to an embedding model; "netsuite extractor" does.
  const expanded = `${title} ${text}`.replace(COMPONENT_ID, (_, kind, name) =>
    `${name.replace(/-/g, ' ')} ${KIND[kind]}`);
  const source = file.includes('linear') ? 'linear' : file.includes('jira') ? 'jira-feed' : 'other';
  return {
    id,
    title,
    text,
    embed_text: expanded.trim(),
    source,
    created_at: raw.created_at ?? raw.createdAt ?? null,
    team: raw.team ?? null,
    type: raw.type ?? null,
    url: id?.startsWith('SUPPORT-') ? `https://keboola.atlassian.net/browse/${id}` : raw.url ?? null,
    linear_url: source === 'linear' ? raw.url : undefined,
  };
}

const byId = new Map();
let read = 0;
let dropped = 0;
for (const f of readdirSync(IN).filter((n) => /^tickets-.*\.jsonl$/.test(n)).sort()) {
  for (const line of readFileSync(join(IN, f), 'utf-8').split('\n')) {
    if (!line.trim()) continue;
    read += 1;
    const rec = normalise(JSON.parse(line), f);
    if (!rec.id || !rec.title || JUNK_TEAM.test(rec.team ?? '') || JUNK_TITLE.test(rec.title)) {
      dropped += 1;
      continue;
    }
    const prev = byId.get(rec.id);
    if (!prev || (!prev.text && rec.text)) {
      byId.set(rec.id, { ...prev, ...rec, sources: [...new Set([...(prev?.sources ?? []), rec.source])] });
    } else {
      prev.sources = [...new Set([...prev.sources, rec.source])];
      prev.team ??= rec.team;
      prev.created_at ??= rec.created_at;
    }
  }
}

const out = [...byId.values()].sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
writeFileSync(OUT, out.map((r) => JSON.stringify(r)).join('\n') + '\n');
const withText = out.filter((r) => r.text).length;
const dates = out.map((r) => r.created_at).filter(Boolean).sort();
console.log(
  `tickets: ${OUT}\nread ${read} | dropped ${dropped} | unique ${out.length} | with description ${withText}\n` +
    `range ${dates[0]?.slice(0, 10)} -> ${dates.at(-1)?.slice(0, 10)}`,
);
