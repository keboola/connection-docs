---
title: Build an app locally
slug: 'data-apps/build-locally'
description: How Python/JS app development works — the scaffold, server-side data access, the dev loop, and syncing your own repository to a Keboola project.
redirect_from:
  - /data-apps/python-js/
---



Build an app in your own environment when you want full control over the code, your editor, and your Git workflow. Keboola still hosts and runs the app — it clones your repository, installs dependencies, starts the app, and serves it behind a secure URL. You don't manage servers, ports, or Docker: only your code and a small configuration folder.

For what the Python/JS stack can do (frameworks, full-stack, APIs for agents), see [What are Keboola apps](/data-apps/what-are-apps/#the-stack-pythonjs).

:::tip[Get your agent started right away]
Building with Claude Code, Cursor, or Copilot? Grab the skill and add it to your agent — or install the full [AI Kit](/ai/ai-kit/) plugin marketplace. The download is the complete skill folder: the skill itself, ready-made app templates (Python, Node.js, full-stack, Streamlit), and reference guides your agent can draw on.

<a class="skill-download-btn" href="/data-apps/keboola-dataapp-development-skill.zip" download="keboola-dataapp-development-skill.zip">⬇ Download the app-building skill (with templates)</a>
<!-- Full skill folder vendored verbatim from keboola/ai-kit@b7f57df (plugins/dataapp-developer/skills/dataapp-development/) as a zip so the download works same-origin. Per Jordan (Jul 14 sync): ship the whole folder — skill + templates + references — not just SKILL.md. TODO: sync mechanism when repo→docs mirroring lands (Jordan). -->
:::

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

The full skill folder — the skill plus app templates and reference guides — is also [browsable on GitHub](https://github.com/keboola/ai-kit/tree/main/plugins/dataapp-developer/skills/dataapp-development). For the full toolkit — including the **Data App Developer plugin** with its validate → build → verify workflow — install [AI Kit](/ai/ai-kit/) in your assistant:

```bash
/plugin marketplace add keboola/ai-kit
/plugin install dataapp-developer
```

![The Create Python / JS App dialog, with a "Build Apps faster with AI" panel offering Download Skill and View on GitHub](/data-apps/python-js-ai-skill.png)

<!-- VERIFY(Adam Vyborny): "Download Skill" / "View on GitHub" observed live in the Create Python/JS dialog (us-east4). Confirm the GitHub destination / canonical skill resource to link directly. -->

## How development works

The day-to-day loop, whichever way you build:

1. **Code lives in a Git repository** — yours, or a private Keboola-managed repo that Kai creates for the app (`git.<stack>.keboola.com/keboola/app-<id>.git`).
2. **Data access happens server-side.** Your backend queries Storage (Storage API or real-time SQL via the Query Service) using the auto-injected `KBC_TOKEN` — the browser never sees the token. Environment variables and code patterns are in [Reference → Data access](/data-apps/reference/#data-access).
3. **Ship a change**: push to the connected branch and hit **Redeploy** — or, if Kai built the app, just tell Kai what to change.
4. **Debug on the app detail**: the app's page has **Overview / Advanced Settings / All Runs / Terminal Logs / Versions** tabs (a **Drafts** tab appears while a draft exists). Env variables, theme, and data mappings live under **Advanced Settings**. The app **sleeps when idle** and wakes on the next visit; drafts hot-reload as Kai edits.

## Sync to your project

Keboola runs your app from a **Git repository** you point it at. Develop locally, push, and connect the repo:

1. In your project, create a **Python/JS app** (**Apps → + Create App → Python / JS**).
2. On the app's configuration page, open **Git Repository** and set the **Project URL**. For a private repo, toggle **Private** and add your credentials.
3. Pick the **branch** (**Load Branches**) and the entrypoint.
4. Click **Deploy App**. Keboola clones the repo, installs dependencies, and runs it. Push changes and **Redeploy** to ship them.

![The Python/JS app configuration page: Authentication, a Git Repository section with Project URL and Load Branches, and the App Info panel showing the Python / JS backend](/data-apps/python-js-config.png)

## Access your data

Apps read Keboola data through Input Mapping, the Storage API, or Storage Access (real-time SQL via the Query Service). See [Reference → Data access](/data-apps/reference/#data-access) for environment variables, code patterns, and Storage Access setup.

---

**Next:** [Authentication →](/data-apps/authentication/)
