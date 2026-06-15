# AGENTS.md — working in this repo

Guide for AI coding agents (and humans) contributing to the Keboola documentation
site. Read this before making changes.

## What this is

The official Keboola product documentation, served at **help.keboola.com**. Built
with **Astro + Starlight**. Content is Markdown; the site builds to static HTML
with full-text search (Pagefind), redirects, and a generated sidebar.

## Quick start

```bash
npm install
npm run dev        # dev server at http://localhost:4321 (hot reload)
npm run build      # production build → dist/
npm run gen:sidebar  # regenerate src/sidebar.mjs from _data/navigation.yml
```

- Node.js 22+.
- Search (Pagefind) only works in a production build/preview, **not** in `npm run dev`.

## ⚠️ Migration state — read this first

The repo is mid-migration from **Jekyll → Astro** and currently **duplicates**:

- **Jekyll source** lives in root content dirs (`transformations/`, `storage/`,
  `components/`, …) plus `_config.yml`, `_layouts`, `_includes`, `_sass`.
- **Astro content** in `src/content/docs/` is **generated from the Jekyll source**
  by `scripts/migrate.mjs`.

**Consequence:** until the switchover, **do not hand-edit `src/content/docs/`** —
it is regenerated and your edits will be lost. Edit the **Jekyll source** in the
root content dirs, then run `node scripts/migrate.mjs`.

The final cutover is scripted in **`scripts/switchover.mjs`** (dry-run by default):
it finalizes Astro, removes the Jekyll source, and makes `src/content/docs/` the
single source of truth. **After the switchover**, edit `src/content/docs/`
directly and `migrate.mjs` becomes obsolete.

## Repo structure

```
src/
  content/docs/   # GENERATED docs pages (do not hand-edit pre-switchover)
  components/     # Starlight component overrides (PageTitle, Head, AskKaiDrawer, …)
  styles/custom.css  # ALL UI/CSS customization lives here
  integrations/   # custom Astro integrations (redirect-from, beacon-transforms)
  sidebar.mjs     # GENERATED sidebar (from _data/navigation.yml)
public/           # static assets served as-is (images, favicon, llms)
api/chat.ts       # "Ask Kai" backend (Vercel function → Keboola AI Service)
scripts/
  migrate.mjs     # Jekyll → Astro content migration (source of truth pre-switchover)
  convert-nav.mjs # builds src/sidebar.mjs from _data/navigation.yml
  switchover.mjs  # final Jekyll→Astro cutover (dry-run by default)
  audit-phase2.mjs# read-only migration-fidelity audit (links/images/headings/…)
astro.config.mjs  # Astro + Starlight config
_data/navigation.yml  # sidebar source (consumed by convert-nav.mjs)
```

## Core rules

- **CSS / UI changes → only `src/styles/custom.css`.** Don't scatter `<style>`
  blocks; don't restyle in components.
- **Component behavior/markup → the relevant `src/components/*.astro`.**
- **Content (pre-switchover) → Jekyll source + `migrate.mjs`**, never
  `src/content/docs/` directly (see migration state above).
- **Sidebar → `_data/navigation.yml`**, then `npm run gen:sidebar`. Don't
  hand-edit `src/sidebar.mjs`.
- **After merging `main`** into the work branch, re-run:
  `node scripts/migrate.mjs && node scripts/convert-nav.mjs && npm run build`.
- **Durable fixes go in the script**, not the generated output — anything baked
  into `migrate.mjs` survives every rerun (see `AUDIT_LOG.md` for the pattern).
- **Product facts vs content choices:** when unsure whether something is accurate
  product behavior or a wording choice, ask a maintainer — don't guess.

## Authoring content

Frontmatter needs at least `title` and `slug`:

```yaml
---
title: My Page Title
slug: 'section/my-page'
description: One-line summary (feeds search/RAG, meta, and the page lede).
---
```

Admonitions:

```markdown
:::tip
Helpful info.
:::
:::caution[Public Beta]
Beta notice.
:::
```

Images: place alongside the Markdown and reference with an absolute path
(`![Alt](/section/page/image.png)`). Click-to-zoom is automatic.

## Verify before pushing

- `npm run build` is clean (no fatal errors).
- For migration/link/image/table changes, run `node scripts/audit-phase2.mjs`
  after building.
- For CSS that must survive client-side navigation, verify in a **production
  build** (`astro build && astro preview`) — dev injects `<style>` tags that
  don't survive Astro view-transition swaps.

## Workflow & deployment

- Docs-as-code: changes go through PRs; a maintainer reviews and merges.
- Production deploys via GitHub Actions (`.github/workflows/main.yml`) on push to
  `main` (build → `aws s3 sync` to `help.keboola.com`).
- The "Ask Kai" widget (`api/chat.ts`) is a Vercel function; it needs
  `AI_SERVICE_URL` + `KBC_STORAGE_API_TOKEN` env vars.

## Logs / references

- `AUDIT_LOG.md` — migration-fidelity findings and their durable fixes.
- `UI_FIXES_LOG.md` — UI/UX change log.
- `DEV_DOCS_INTEGRATION.md` — proposal for unifying the developer docs.
