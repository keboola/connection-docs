# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repo. A
self-improving rule set — extend it via the Self-improvement protocol below.

@AGENTS.md

## Architecture

- Read **AGENTS.md** first — stack, structure, commands, conventions.
- Astro + Starlight; docs are Markdown in `src/content/docs/`; static build with
  Pagefind full-text search.
- Sidebar is generated from `_data/navigation.yml` via `npm run gen:sidebar` —
  never hand-edit `src/sidebar.mjs`.

## Style

- CSS/UI changes go **only** in `src/styles/custom.css` — no scattered `<style>`
  blocks, no restyling in components.
- Match the surrounding code's conventions (naming, idiom, comment density).

## Bug fix protocol

- Before editing code, state the bug's root cause in one line.
- If the bug is intermittent, write a test that catches it first, then fix.
- After a successful fix, propose a new rule covering that class of error.
- If asked to redo a bad fix, don't patch over it — revert and reimplement with
  the new understanding.
- After any dependency install, run the build before declaring success. If it
  breaks, diff the lockfile for re-hoisted/duplicated transitives BEFORE assuming
  your own change is at fault; pin with `overrides` when a framework-internal
  shared dep gets shadowed.

## Self-improvement protocol

- Write rules about a **class** of error, never a single incident.
- If a new rule conflicts with an earlier one, flag the conflict explicitly and
  let me choose which to keep — don't decide yourself.
- Keep this file short and dense: one tight rule beats a paragraph.
- Show the diff and wait for my confirmation before writing to CLAUDE.md.

## Project-specific

- Content → edit `src/content/docs/` directly (Markdown).
- `overrides` pins `@astrojs/markdown-remark` to `7.2.0`: Astro 6.4.7 needs that
  version (it exports `unified`), but Starlight depends on `^7.0.0`, so a plain
  install re-hoists `7.1.2` (no `unified` export) and shadows it — the build then
  fails generating static routes. Don't drop the pin without re-checking
  `npm ls @astrojs/markdown-remark`.
- One dev server only: `npm run dev` → http://localhost:4321; kill stale ones
  (`pkill -f "astro dev"`) before starting.
- Verify view-transition-sensitive CSS in a production build
  (`astro build && astro preview`), not `npm run dev` — Vite injects `<style>`
  tags that don't survive Astro view-transition swaps.
- Screenshots → `/tmp`, not the repo (`scripts/screenshot.mjs` is gitignored).
- Ask a maintainer for product facts vs. content choices — don't guess.
