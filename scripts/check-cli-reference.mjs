#!/usr/bin/env node
/**
 * check-cli-reference.mjs — freshness gate: docs `kbagent …` usage vs the CLI's
 * own generated command reference.
 *
 * The kbagent CLI publishes `command-reference.md` with every release (built
 * from the Typer app — keboola/cli#500). A synced copy lives at
 * `_data/cli/command-reference.md` (auto-PR'd by .github/workflows/
 * sync-cli-reference.yml — don't hand-edit). This script asserts that every
 * command and flag the docs mention still exists in that reference, so a CLI
 * rename/removal turns the PR build red instead of silently shipping stale docs.
 *
 * What is checked (and where):
 *   1. every backticked/fenced `kbagent …` invocation, repo-wide
 *      — command path must exist; every flag must exist for that command
 *        (or be a global option)
 *   2. fenced bash/console invocations additionally: options the reference
 *      marks Required must be present (recipes are complete commands);
 *      skipped when the invocation is truncated with `...`
 *   3. cli/commands.md curated group bullets — every listed subcommand token
 *      must resolve to a real command of its group
 *   4. cli/commands.md global-flags table ⊆ the reference's Global options
 *
 * Escape hatch: a `kbagent-check: skip-next` comment on the preceding line
 * suppresses findings from the next line.
 *
 * Known limitation: one invocation per line — text after a control operator
 * (`&&`, `|`, `;`) is not scanned for a second `kbagent` command.
 *
 * Usage:
 *   node scripts/check-cli-reference.mjs                # full report
 *   node scripts/check-cli-reference.mjs --quiet        # counts only (CI)
 *   node scripts/check-cli-reference.mjs --ref <file> --docs <dir>
 *
 * Exit codes: 0 clean · 1 findings · 2 setup/format error (missing or
 * unparseable reference — fails loudly rather than passing an empty gate).
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : dflt;
};
const REF = resolve(arg('--ref', join(ROOT, '_data', 'cli', 'command-reference.md')));
const DOCS = resolve(arg('--docs', join(ROOT, 'src', 'content', 'docs')));
const QUIET = process.argv.includes('--quiet');

const BUILTIN_FLAGS = new Set(['--help', '-h']); // Typer adds these; the generator doesn't list them
const FENCE_LANGS = new Set(['', 'bash', 'sh', 'shell', 'zsh', 'console']);

// ── Reference parser ────────────────────────────────────────────────────────

/** One option-table row → { aliases:[..], takesValue, required, positional } */
function parseOptionRow(line) {
  const cells = line.split('|').map((c) => c.trim());
  if (cells.length < 4) return null; // | a | b | c | → ['', a, b, c, '']
  const [cell1, cell2] = [cells[1], cells[2]];
  if (!cell1 || /^-+$/.test(cell1) || cell1 === 'Option') return null; // header/separator
  const spans = [...cell1.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
  if (!spans.length) return null;
  const aliases = spans.filter((s) => s.startsWith('-'));
  // Metavar forms: `<str>` (current generator), bare `TEXT`/`INTEGER` (Click's
  // native make_metavar — emitted at v0.70.1, could return on a Typer/Click
  // bump), and choice `[a|b]`. Pinned as a contract in keboola/cli#513.
  const takesValue = spans.some((s) => /^<.*>$/.test(s) || /^[A-Z][A-Z0-9_]*$/.test(s) || s.startsWith('['));
  const positional = !aliases.length && cell1.includes('(positional)');
  return {
    aliases,
    takesValue,
    required: cell2 === 'yes',
    positional,
    name: spans[0],
  };
}

function parseReference(path) {
  if (!existsSync(path)) {
    console.error(`Reference file not found: ${path}`);
    process.exit(2);
  }
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  const commands = new Map(); // 'project add' → { options:[], positionals:[] }
  const groups = new Set(); // 'project', 'org', …
  const globals = []; // option rows of ## Global options
  let section = null; // 'globals' | current command entry | null

  for (const line of lines) {
    const h2 = line.match(/^## (.+)$/);
    if (h2) {
      const name = h2[1].trim();
      if (name === 'Global options') section = 'globals';
      else {
        section = null;
        const g = name.match(/^`([^`]+)`$/);
        if (g) groups.add(g[1]);
      }
      continue;
    }
    const h3 = line.match(/^### `kbagent ([^`]+)`\s*$/);
    if (h3) {
      section = { options: [], positionals: [] };
      commands.set(h3[1].trim(), section);
      continue;
    }
    if (!section || !line.startsWith('|')) continue;
    const row = parseOptionRow(line);
    if (!row) continue;
    if (section === 'globals') globals.push(row);
    else if (row.positional) section.positionals.push(row);
    else section.options.push(row);
  }

  if (commands.size < 50 || !globals.length) {
    console.error(
      `Reference at ${path} parsed to ${commands.size} commands / ${globals.length} global options — format changed upstream? Refusing to run an empty gate.`
    );
    process.exit(2);
  }
  const globalFlags = new Set(globals.flatMap((o) => o.aliases));
  // every proper prefix of a command path (for partial mentions like `kbagent semantic-layer add`)
  const prefixes = new Set(groups);
  for (const path of commands.keys()) {
    const words = path.split(' ');
    for (let i = 1; i < words.length; i++) prefixes.add(words.slice(0, i).join(' '));
  }
  return { commands, groups, globals, globalFlags, prefixes };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 3) return 99;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

function nearest(needle, haystack) {
  let best = null, bestD = 3; // suggest only close matches
  for (const c of haystack) {
    const d = levenshtein(needle, c);
    if (d < bestD || (d === bestD && best === null)) { best = c; bestD = d; }
  }
  return best;
}

/** Quote-aware shell-ish tokenizer; stops at control operators and comments. */
function tokenize(text) {
  const tokens = [];
  let cur = '', quote = null;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
      continue;
    }
    if (ch === "'" || ch === '"') { quote = ch; continue; }
    if (/\s/.test(ch)) { if (cur) { tokens.push(cur); cur = ''; } continue; }
    if (ch === '#') break; // comment
    if (ch === ';') break;
    if (ch === '>' && !cur) break; // redirect (but keep `>` inside `<task-id>` tokens)
    if ((ch === '&' && text[i + 1] === '&') || (ch === '|' && text[i + 1] === '|')) break;
    if (ch === '|') break;
    cur += ch;
  }
  if (cur) tokens.push(cur);
  return tokens;
}

const isPlaceholder = (t) => /^<.*>$/.test(t);
const isTruncation = (t) => t === '...' || t === '…' || t === '[...]' || t === '[…]';

// ── Invocation validator ────────────────────────────────────────────────────

/**
 * Validate one `kbagent …` invocation.
 * ctx: { requiredCheck: boolean } — fenced recipes get the required-flag pass.
 * Returns array of finding messages.
 */
function checkInvocation(tokens, ref, ctx) {
  const msgs = [];
  let i = 1; // tokens[0] === 'kbagent'

  // pre-command global flags: kbagent --json project list
  while (i < tokens.length && tokens[i].startsWith('-')) {
    const [flag] = tokens[i].split('=');
    const known = ref.globals.find((o) => o.aliases.includes(flag));
    if (!known && !BUILTIN_FLAGS.has(flag)) {
      const hint = nearest(flag, [...ref.globalFlags]);
      msgs.push(`unknown global flag \`${flag}\`${hint ? ` (did you mean \`${hint}\`?)` : ''}`);
    }
    if (known?.takesValue && !tokens[i].includes('=')) i++;
    i++;
  }
  if (i >= tokens.length) return msgs; // bare `kbagent --version`

  if (isPlaceholder(tokens[i]) || isTruncation(tokens[i])) return msgs; // `kbagent <group> --help`

  // longest-prefix command resolution
  const path = [];
  while (
    i < tokens.length &&
    /^[a-z][a-z0-9-]*$/.test(tokens[i]) &&
    (ref.commands.has([...path, tokens[i]].join(' ')) || ref.prefixes.has([...path, tokens[i]].join(' ')))
  ) {
    path.push(tokens[i]);
    i++;
  }
  const cmdPath = path.join(' ');

  if (!path.length) {
    const hint = nearest(tokens[i], [...ref.groups, ...[...ref.commands.keys()].filter((c) => !c.includes(' '))]);
    msgs.push(`unknown command \`kbagent ${tokens[i]}\`${hint ? ` (did you mean \`kbagent ${hint}\`?)` : ''}`);
    return msgs;
  }

  const cmd = ref.commands.get(cmdPath);
  if (!cmd) {
    // resolved to a group/prefix only (`kbagent config …`, `kbagent semantic-layer add`)
    if (i < tokens.length && /^[a-z][a-z0-9-]*$/.test(tokens[i])) {
      // a concrete-looking subcommand that didn't resolve → real drift
      const cands = [...ref.commands.keys()].filter((c) => c.startsWith(cmdPath + ' '));
      const hint = nearest(`${cmdPath} ${tokens[i]}`, cands);
      msgs.push(
        `unknown command \`kbagent ${cmdPath} ${tokens[i]}\`${hint ? ` (did you mean \`kbagent ${hint}\`?)` : ''}`
      );
    }
    return msgs; // partial mention (placeholder/flags follow) — presence of the prefix is enough
  }

  // remainder: flags + positionals
  const seen = new Set();
  let positionals = 0;
  let truncated = false;
  for (; i < tokens.length; i++) {
    const t = tokens[i];
    if (isTruncation(t)) { truncated = true; continue; }
    if (t.startsWith('-') && t !== '-') {
      const [flag] = t.split('=');
      const opt =
        cmd.options.find((o) => o.aliases.includes(flag)) ??
        ref.globals.find((o) => o.aliases.includes(flag));
      if (!opt && !BUILTIN_FLAGS.has(flag)) {
        const hint = nearest(flag, [...cmd.options.flatMap((o) => o.aliases), ...ref.globalFlags]);
        msgs.push(
          `unknown flag \`${flag}\` for \`kbagent ${cmdPath}\`${hint ? ` (did you mean \`${hint}\`?)` : ''}`
        );
        continue;
      }
      if (opt) {
        for (const a of opt.aliases) seen.add(a);
        if (opt.takesValue && !t.includes('=')) i++; // consume the value token
      }
      continue;
    }
    positionals++;
  }

  if (ctx.requiredCheck && !truncated) {
    for (const opt of cmd.options) {
      if (opt.required && !opt.aliases.some((a) => seen.has(a))) {
        msgs.push(`missing required \`${opt.aliases[0]}\` for \`kbagent ${cmdPath}\``);
      }
    }
    const requiredPos = cmd.positionals.filter((p) => p.required).length;
    if (positionals < requiredPos) {
      const names = cmd.positionals.map((p) => `\`${p.name}\``).join(', ');
      msgs.push(`missing required positional (${names}) for \`kbagent ${cmdPath}\``);
    }
  }
  return msgs;
}

// ── Docs scanner ────────────────────────────────────────────────────────────

function findMd(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    statSync(p).isDirectory() ? findMd(p, out) : /\.mdx?$/.test(e) && out.push(p);
  }
  return out;
}

const blankOut = (m) => m.replace(/[^\n]/g, ' '); // strip but keep line numbers

function scanFile(file, ref, findings) {
  const rel = relative(DOCS, file);
  let raw = readFileSync(file, 'utf8');
  raw = raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, blankOut); // frontmatter

  const skipLines = new Set();
  raw.split(/\r?\n/).forEach((l, idx) => {
    if (/kbagent-check:\s*skip-next/.test(l)) skipLines.add(idx + 1);
  });
  raw = raw.replace(/<!--[\s\S]*?-->/g, blankOut).replace(/\{\/\*[\s\S]*?\*\/\}/g, blankOut);

  const lines = raw.split(/\r?\n/);
  const add = (lineNo, snippet, msg) => {
    if (skipLines.has(lineNo - 1) || skipLines.has(lineNo - 2)) return;
    findings.push({ file: rel, line: lineNo, snippet, msg });
  };

  const isCommandsPage = /cli[\\/]commands\.md$/.test(rel);
  let fenceLang = null;
  for (let n = 0; n < lines.length; n++) {
    const line = lines[n];
    const fence = line.match(/^\s*```(\S*)/);
    if (fence) {
      fenceLang = fenceLang === null ? fence[1].toLowerCase() : null;
      continue;
    }

    if (fenceLang !== null) {
      if (!FENCE_LANGS.has(fenceLang)) continue;
      let text = line;
      if (fenceLang === 'console') {
        if (!/^\s*\$\s/.test(text)) continue;
        text = text.replace(/^\s*\$\s/, '');
      }
      const startLine = n + 1;
      while (text.trimEnd().endsWith('\\') && n + 1 < lines.length) {
        n++;
        text = text.trimEnd().replace(/\\$/, ' ') + lines[n];
      }
      const kb = text.match(/(?:^|\s)(kbagent\s.*|kbagent)$/);
      if (!kb) continue;
      const tokens = tokenize(kb[1]);
      if (tokens[0] !== 'kbagent') continue;
      for (const msg of checkInvocation(tokens, ref, { requiredCheck: true }))
        add(startLine, text.trim(), msg);
      continue;
    }

    // outside fences: inline code spans
    for (const m of line.matchAll(/`([^`]+)`/g)) {
      const span = m[1];
      if (/^kbagent(\s|$)/.test(span)) {
        const tokens = tokenize(span);
        for (const msg of checkInvocation(tokens, ref, { requiredCheck: false }))
          add(n + 1, span, msg);
      } else if (isCommandsPage) {
        checkCommandsPageSpan(span, line, n + 1, ref, add);
      }
    }
  }
}

// ── cli/commands.md curated-page checks (tiers 3–4) ────────────────────────

/** `description-get/set` → ['description-get', 'description-set'] (alternatives swap the last segment) */
function expandCompressed(token) {
  if (!token.includes('/')) return [token];
  const [first, ...alts] = token.split('/');
  const segs = first.split('-');
  return [first, ...alts.map((a) => [...segs.slice(0, -1), a].join('-'))];
}

function checkCommandsPageSpan(span, line, lineNo, ref, add) {
  if (span.startsWith('-')) {
    // a flag token: only the global-flags table rows are checkable (per-command
    // flags on bullet lines are ambiguous) — table rows start with '|'
    if (/^\s*\|/.test(line)) {
      const [flag] = span.split(/[\s=]/);
      if (!ref.globalFlags.has(flag) && !BUILTIN_FLAGS.has(flag)) {
        const hint = nearest(flag, [...ref.globalFlags]);
        add(lineNo, span, `unknown global flag \`${flag}\` in the flags table${hint ? ` (did you mean \`${hint}\`?)` : ''}`);
      }
    }
    return;
  }

  // group bullet: - **`project`** — `add`, `list`, …
  const bullet = line.match(/^\s*-\s+\*\*`([a-z][a-z0-9-]*)`\*\*\s*—/);
  if (bullet) {
    const group = bullet[1];
    if (!ref.groups.has(group) && !ref.commands.has(group)) {
      if (span === group) add(lineNo, group, `unknown command group \`${group}\``); // once per line
      return;
    }
    if (span === group) return; // the group token itself
    if (/^[a-z][a-z0-9-]*\*?(\/[a-z0-9-]+)*$/.test(span)) {
      for (const t of expandCompressed(span)) {
        const full = `${group} ${t}`;
        const ok = t.endsWith('-*')
          ? [...ref.commands.keys()].some((c) => c.startsWith(`${group} ${t.slice(0, -1)}`))
          : ref.commands.has(full) || ref.prefixes.has(full);
        if (!ok) {
          const cands = [...ref.commands.keys()].filter((c) => c.startsWith(group + ' '));
          const hint = nearest(full, cands);
          add(lineNo, span, `\`${full}\` is not a command of \`${group}\`${hint ? ` (did you mean \`${hint}\`?)` : ''}`);
        }
      }
    }
    return;
  }

  // self-qualifying multi-word span outside bullets: `lineage server`, `kai ask`
  if (/^[a-z][a-z0-9-]*( [a-z][a-z0-9-]*)+$/.test(span)) {
    if (!ref.commands.has(span) && !ref.prefixes.has(span)) {
      const hint = nearest(span, [...ref.commands.keys()]);
      add(lineNo, span, `unknown command \`kbagent ${span}\`${hint ? ` (did you mean \`kbagent ${hint}\`?)` : ''}`);
    }
    return;
  }

  // bare single token on an enumeration line ("Setup & info" style — the line
  // is nothing but backticked tokens): lenient membership. Prose mentions of
  // backticked words (JSON field names etc.) are not command claims — skipped.
  if (/^[a-z][a-z0-9-]*$/.test(span) && /^\s*(`[a-z][a-z0-9-]*`[,.]?\s*)+$/.test(line)) {
    const known =
      ref.groups.has(span) ||
      ref.commands.has(span) ||
      [...ref.commands.keys()].some((c) => c.split(' ').includes(span));
    if (!known) add(lineNo, span, `\`${span}\` is not a known kbagent group, command, or subcommand`);
  }
}

// ── Run ─────────────────────────────────────────────────────────────────────

const ref = parseReference(REF);
if (!existsSync(DOCS)) {
  console.error(`Docs dir not found: ${DOCS}`);
  process.exit(2);
}

const findings = [];
for (const file of findMd(DOCS).sort()) scanFile(file, ref, findings);

const version = readFileSync(REF, 'utf8').match(/Generated from kbagent (v[\d.]+)/)?.[1] ?? 'unknown';
console.log(`CLI reference gate — ${ref.commands.size} commands (${version}) vs ${findMd(DOCS).length} pages`);
if (!QUIET) {
  for (const f of findings) {
    console.log(`\n${f.file}:${f.line}  ${f.snippet.length > 90 ? f.snippet.slice(0, 90) + '…' : f.snippet}`);
    console.log(`  ✗ ${f.msg}`);
  }
}
console.log(`${'─'.repeat(50)}\n${findings.length} finding(s).`);
process.exit(findings.length ? 1 : 0);
