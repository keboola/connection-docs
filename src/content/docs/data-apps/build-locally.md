---
title: Build an app locally
slug: 'data-apps/build-locally'
description: Develop a Keboola app with your own tools and Git account, then sync it to your project.
---



Build an app in your own environment when you want full control over the code, your editor, and your Git workflow. Keboola still hosts and runs the app. This is the full-control path for [Python/JS apps](/data-apps/python-js/).

## Before you start

- A Keboola project.
- Your local development tools.
- Optionally, your own Git account if you want to manage the repository yourself.

## App structure

A Keboola app is a standard web app. The typical scaffold is:

- `src/App.tsx` — the frontend (React).
- `server/index.ts` — server-side API routes (Express).

All data-fetching logic — SQL queries and anything that uses your Storage token — belongs in the server-side routes.

```ts
// server/index.ts — example route (illustrative)
app.get("/api/rows", async (req, res) => {
  // Use the Keboola Storage client here, server-side only.
  // Never expose your Storage token to the browser.
});
```

:::caution
`KBC_TOKEN` is injected automatically and must stay server-side. Don't add it as a secret yourself, and never send it to the browser.
:::

<!-- VERIFY(Adam Vyborny): scaffold (React + Vite + Express), file paths, and the KBC_TOKEN guidance. Source: internal Devin answer grounded in keboola/ui SKILL.md. The current public page tells users to add #KBC_TOKEN as a secret — that is wrong (reserved, auto-injected, silently shadowed) and must be corrected here. -->

## Develop with an AI coding tool

You can build the app with an AI coding assistant (Claude Code, Cursor, or Copilot). When you create a Python/JS app, Keboola offers a ready-made **skill file** — **Download Skill** or **View on GitHub** — that teaches your assistant the correct app structure, deployment config, and Keboola APIs, so you get working code with fewer errors. The app's **Overview** also links it as **AI Skill for Building**.

![The Create Python / JS App dialog, with a "Build Apps faster with AI" panel offering Download Skill and View on GitHub](/data-apps/python-js-ai-skill.png)

<!-- VERIFY(Adam Vyborny): "Download Skill" / "View on GitHub" observed live in the Create Python/JS dialog (us-east4). Confirm the GitHub destination / canonical skill resource to link directly. -->

## Sync to your project

Keboola runs your app from a **Git repository** you point it at. Develop locally, push, and connect the repo:

1. In your project, create a **Python/JS app** (**Apps → + Create App → Python / JS**).
2. On the app's configuration page, open **Git Repository** and set the **Project URL**. For a private repo, toggle **Private** and add your credentials.
3. Pick the **branch** (**Load Branches**) and the entrypoint.
4. Click **Deploy App**. Keboola clones the repo, installs dependencies, and runs it. Push changes and **Redeploy** to ship them.

![The Python/JS app configuration page: Authentication, a Git Repository section with Project URL and Load Branches, and the App Info panel showing the Python / JS backend](/data-apps/python-js-config.png)

## Access your data

Apps read Keboola data through Input Mapping, the Storage API, or Storage Access (real-time SQL via the Query Service). See [Reference → Data access](/data-apps/reference/#data-access) for environment variables, code patterns, and Storage Access setup.

## Next steps

- [Authentication](/data-apps/authentication/)
- [Reference](/data-apps/reference/) — environment variables and settings.
