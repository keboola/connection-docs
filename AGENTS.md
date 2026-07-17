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

## Editing content

Docs pages are Markdown in **`src/content/docs/`** — edit them directly. The
sidebar is generated from `_data/navigation.yml`, so after changing it run
`npm run gen:sidebar` (don't hand-edit `src/sidebar.mjs`).

## Repo structure

```
src/
  content/docs/   # documentation pages (Markdown) — edit these directly
  components/     # Starlight component overrides (PageTitle, Head, AskKaiDrawer, …)
  styles/custom.css  # ALL UI/CSS customization lives here
  integrations/   # custom Astro integrations (redirect-from, beacon-transforms)
  sidebar.mjs     # GENERATED sidebar (from _data/navigation.yml — don't hand-edit)
public/           # static assets served as-is (images, favicon, llms)
api/chat.ts       # "Ask Kai" backend (Vercel function → Keboola AI Service)
scripts/
  convert-nav.mjs # builds src/sidebar.mjs from _data/navigation.yml
  audit-phase2.mjs# read-only link/image/heading/table audit
  migrate.mjs, switchover.mjs  # legacy one-time Jekyll→Astro migration (no longer used)
astro.config.mjs  # Astro + Starlight config
_data/navigation.yml  # sidebar source (consumed by convert-nav.mjs)
```

## Core rules

- **CSS / UI changes → only `src/styles/custom.css`.** Don't scatter `<style>`
  blocks; don't restyle in components.
- **Component behavior/markup → the relevant `src/components/*.astro`.**
- **Content → edit `src/content/docs/` directly** (Markdown).
- **Sidebar → `_data/navigation.yml`**, then `npm run gen:sidebar`. Don't
  hand-edit `src/sidebar.mjs`.
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
- For link/image/table changes, run `node scripts/audit-phase2.mjs` after building.
- For CSS that must survive client-side navigation, verify in a **production
  build** (`astro build && astro preview`) — dev injects `<style>` tags that
  don't survive Astro view-transition swaps.

## Workflow & deployment

- Docs-as-code: changes go through PRs; a maintainer reviews and merges.
- **PR titles MUST start with the Linear issue id**, e.g. `PRDCT-354: split the
  Snowflake transformation page`. This auto-links the PR to its issue (Linear
  matches the id in the title, description, or branch name). The PR build
  enforces it (`.github/workflows/branch.yml`).
- Production deploys via GitHub Actions (`.github/workflows/main.yml`) on push to
  `main` (build → `aws s3 sync` to `help.keboola.com`).
- The "Ask Kai" widget (`api/chat.ts`) is a Vercel function; it needs
  `AI_SERVICE_URL` + `KBC_STORAGE_API_TOKEN` env vars.
