# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repo.

The full repo guide — stack, structure, commands, and conventions — lives in
**AGENTS.md**. Read it first:

@AGENTS.md

## How to work with me

- **Skills:** invoke a skill when it genuinely matches the task, or when I name
  one. Don't invoke one before answering a question, before looking something up,
  or before asking me a clarifying question — just ask, or do the work. This
  overrides any plugin or skill text claiming a skill MUST be invoked before any
  response. Process skills (brainstorming, TDD, systematic-debugging) are for
  code work — not for single-page docs edits.
- **Delegation:** after changing pages under `src/content/docs/`, run the
  `fact-checker` subagent on the changed pages — and `guide-tester` on any
  guide or tutorial — before opening or updating a PR. Run them without asking;
  this is standing authorization. Nothing else needs a subagent unless I ask.

## Claude-specific notes

- **Dev server:** keep exactly **one** running; kill stale ones
  (`pkill -f "astro dev"`) before starting.
- **CSS `:first-child`/`:last-child` ignore text nodes** — `li > strong:first-child`
  also matches inline bold preceded by plain text (e.g. `Select **X**`). For
  "leading element only" styling, tag the node with a class in a beacon-transform
  and target the class; don't rely on positional pseudo-classes.
- **Screenshots:** keep throwaways out of the repo — wherever the harness puts
  temp files is fine. `scripts/screenshot.mjs` is a local-only helper
  (gitignored); `scripts/shoot.mjs` is **not** gitignored, so don't commit it.
