# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repo.

The full repo guide — stack, structure, commands, conventions, and the critical
migration rules — lives in **AGENTS.md**. Read it first:

@AGENTS.md

## Claude-specific notes

- **Dev server:** `npm run dev` → http://localhost:4321. Keep exactly **one**
  dev server running; kill stale ones (`pkill -f "astro dev"`) before starting.
- **Pre-switchover, content is generated.** Do not hand-edit `src/content/docs/`
  — edit the Jekyll source in the root content dirs and run
  `node scripts/migrate.mjs`. (See AGENTS.md → "Migration state".)
- **CSS/UI changes go only in `src/styles/custom.css`.**
- **Verify view-transition-sensitive CSS in a production build**
  (`astro build && astro preview`), not `npm run dev` — Vite injects `<style>`
  tags that don't survive Astro view-transition swaps.
- **Screenshots:** save throwaways to `/tmp`, not the repo. `scripts/screenshot.mjs`
  is a local-only helper (gitignored).
- **Log changes:** UI changes → `UI_FIXES_LOG.md`; migration findings →
  `AUDIT_LOG.md`.
- **Ask a maintainer** for product facts vs. content choices instead of guessing.
