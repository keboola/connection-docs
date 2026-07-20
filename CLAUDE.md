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
- **Screenshots:** debug/dev screenshots → `/tmp`, never committed
  (`scripts/screenshot.mjs` is a local-only helper, gitignored). Doc UI-locator
  screenshots → `public/<section>/` (committed — they render on the page).
- **Ask a maintainer** for product facts vs. content choices instead of guessing.

## Docs authoring (house style)

- **Diátaxis:** each page is ONE type — tutorial / how-to / reference / explanation.
  Split "frankenstein" pages; don't over-split (nav suffers).
- How-to = short, action-first, show where to click. Overview/explanation = fuller,
  never stubs. Reference = dense; **limits at the bottom, never the top**.
- Voice: active, short, sentence-case headings, no filler; `connector`/`component`,
  never "plugin". Frontmatter `title` + `description` mandatory.
- Prefer generating volatile reference from the source of truth (OpenAPI, `--help`,
  configSchema) over hand-writing values.
- Weave Kai in as a REPLACEMENT for low-level manual steps, not a bolt-on section;
  prefer the Keboola Storage/Python client over raw CSV handling.
- Doc screenshots: UI-locator only; transcribe code-in-screenshots to fenced+masked
  blocks; drop decorative; never fabricate. Capture via Playwright against a
  logged-in browser, verify each shot, save to `public/<section>/`.
- Ship old→new redirects with every structural PR. Wrap wide tables (no h-scroll).
- Decide keep/delete by supported-status + code, NOT by traffic stats.

## Docs revamp process

- Four stages, in order, never mixed: structure → form → accuracy → Kai-weaving.
- Structure/form: the agent may decide. Facts and deletions: owner or code only —
  else keep and flag `VERIFY(<owner>)` / `TODO(human-review, <owner>)`.
- Conserve content: every removed paragraph → a new home or a logged deletion
  (CONSERVATION-REPORT + MISSING list). Never drop silently.
- Current guardrails: don't assert E2B as hosting; don't say Streamlit is retired;
  don't document pricing / in-app Kai-toggle / semantic layer.
- Stakeholder likes/dislikes + the paste-ready prompt block live in the local
  `apps-section/` bundle (gitignored), not here.
