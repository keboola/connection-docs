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
  check-cli-reference.mjs  # CI gate: docs `kbagent` usage vs _data/cli/command-reference.md
  migrate.mjs, switchover.mjs  # legacy one-time Jekyll→Astro migration (no longer used)
astro.config.mjs  # Astro + Starlight config
_data/navigation.yml  # sidebar source (consumed by convert-nav.mjs)
_data/cli/command-reference.md  # generated kbagent reference, auto-synced from
                      # keboola/cli releases (sync-cli-reference.yml) — don't hand-edit
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
- `astro preview` enforces `trailingSlash: 'always'` and answers a URL without a
  slash with its own "Not Found" page instead of the site's 404. To check the 404
  locally, open `/404.html` directly; production normalizes the slash and does not
  behave this way.

## Workflow & deployment

- Docs-as-code: changes go through PRs; a maintainer reviews and merges.
- **`help.keboola.com` is served by Vercel.** Every PR also gets a Vercel preview
  deployment — use it to check rendering before asking for review.
- Vercel applies its defaults, since `vercel.json` only sets cache headers for
  `/pagefind/*`: a missing trailing slash is normalized, and `404.html` from the
  build root is returned for unmatched paths. **Don't move the 404 out of the
  build root.**
- `.github/workflows/main.yml` still builds and runs `aws s3 sync` to
  `s3://help.keboola.com` on every push to `main`. It succeeds, but it is not
  what serves the live domain — don't reason about production routing, redirects,
  or cache headers from it.
- The "Ask Kai" widget (`api/chat.ts`) is a Vercel function; it needs
  `AI_SERVICE_URL` + `KBC_STORAGE_API_TOKEN` env vars.
