# Keboola User Documentation

[![Build and deploy](https://github.com/keboola/connection-docs/actions/workflows/main.yml/badge.svg)](https://github.com/keboola/connection-docs/actions/workflows/main.yml)

The official documentation for Keboola, available at [help.keboola.com](https://help.keboola.com). Built with [Astro Starlight](https://starlight.astro.build/).

[How to write documentation](https://keboola.atlassian.net/wiki/spaces/KB/pages/82935879/Public+documentation)

## Prerequisites

- [Node.js](https://nodejs.org/) 22 or later

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Documentation will be available at http://localhost:4321

The dev server supports hot reload — changes to content files are reflected immediately.

## Project Structure

```
├── src/
│   ├── content/docs/   # All documentation pages (Markdown)
│   ├── assets/         # Site logo and other processed assets
│   ├── components/     # Custom Starlight component overrides
│   ├── integrations/   # Custom Astro integrations (redirect-from)
│   ├── styles/         # Custom CSS (Keboola brand overrides)
│   └── sidebar.mjs     # Generated sidebar navigation config
├── public/             # Static assets (images, favicon) served as-is
├── scripts/
│   ├── migrate.mjs     # Content migration script (Jekyll → Starlight)
│   └── convert-nav.mjs # Sidebar generator from _data/navigation.yml
├── astro.config.mjs    # Astro + Starlight configuration
└── package.json
```

## Writing Content

Documentation pages are Markdown files in `src/content/docs/`. Each page needs frontmatter with at least a `title` and `slug`:

```yaml
---
title: My Page Title
slug: 'section/my-page'
---
```

### Admonitions

Use fenced directives for tips, warnings, and notes:

```markdown
:::tip
Helpful information here.
:::

:::caution
Important warning here.
:::

:::caution[Public Beta]
This feature is currently in public beta.
:::
```

### Images

Place images alongside the Markdown files in `src/content/docs/` and reference them with absolute paths:

```markdown
![Screenshot](/components/extractors/database/bigquery/bigquery-1.png)
```

Images are also available in `public/` for absolute path serving. Click-to-zoom is enabled automatically on all images via the `starlight-image-zoom` plugin.

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. This generates static HTML with:
- 264 documentation pages
- 162 redirect pages (from `redirect_from` frontmatter)
- Full-text search index (via Pagefind)
- Sitemap

## Regenerating Sidebar

If you modify `_data/navigation.yml`, regenerate the sidebar config:

```bash
npm run gen:sidebar
```

This updates `src/sidebar.mjs`.

## Deployment

Deployment is automated via GitHub Actions. Pushing to `main` triggers a build and deploy to the S3 bucket at `help.keboola.com`.

The CI workflow (`.github/workflows/main.yml`) runs:
1. `npm ci` — install dependencies
2. `npm run build` — build the site
3. `aws s3 sync` — deploy `dist/` to S3

## Key Features

- **Full-text search** — built-in Pagefind search, no external service required
- **Dark/light mode** — automatic theme switching
- **Image zoom** — click any image to view full-size
- **Copy as Markdown** — every page has a button to copy content as Markdown (useful for AI workflows)
- **Redirects** — old URLs are preserved via auto-generated redirect pages
- **Table of contents** — auto-generated on every page

## License

MIT licensed, see [LICENSE](./LICENSE) file.
