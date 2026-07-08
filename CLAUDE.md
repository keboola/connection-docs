# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repo.

The full repo guide — stack, structure, commands, and conventions — lives in
**AGENTS.md**. Read it first:

@AGENTS.md

## Claude-specific notes

- **Dev server:** `npm run dev` → http://localhost:4321. Keep exactly **one**
  dev server running; kill stale ones (`pkill -f "astro dev"`) before starting.
- **Content → edit `src/content/docs/` directly** (Markdown).
- **CSS/UI changes go only in `src/styles/custom.css`.**
- **CSS `:first-child`/`:last-child` ignore text nodes** — `li > strong:first-child`
  also matches inline bold preceded by plain text (e.g. `Select **X**`). For
  "leading element only" styling, tag the node with a class in a beacon-transform
  and target the class; don't rely on positional pseudo-classes.
- **Verify view-transition-sensitive CSS in a production build**
  (`astro build && astro preview`), not `npm run dev` — Vite injects `<style>`
  tags that don't survive Astro view-transition swaps.
- **Screenshots:** save throwaways to `/tmp`, not the repo. `scripts/screenshot.mjs`
  is a local-only helper (gitignored).
- **Ask a maintainer** for product facts vs. content choices instead of guessing.
