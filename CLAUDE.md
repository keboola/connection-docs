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

## Migrating dev docs into help (Jordan, 2026-07-30)

- **De-duplicate, never add-alongside.** Moving a page is not the goal; *unifying* is.
  Lifecycle: merge the information into the help page → update the links pointing at it →
  then kill/redirect the old page. If a competing overview survives, the migration is not
  done. Before placing anything, search for where that concept **already lives** (expand every
  `**/other/` nav subgroup — thin stubs hide there) and dedup into **one** canonical page.
- **Never let an agent decide information architecture.** Placement is a human call made
  against the **live preview**; automated audit output is evidence, not a verdict. Recommend a
  home and **surface the decision** — don't self-place cross-cutting features. Use the
  `migration-placement` skill; it encodes this and the known failure cases.
- **Never hard-delete a dev page without checking what links to it**
  (`gh search code "developers.keboola.com/<section>" --owner keboola`, plus non-GitHub
  callers). Some sections have hundreds of inbound references — see the scan table in
  `DEV-MIGRATION-PLAN.md`.
