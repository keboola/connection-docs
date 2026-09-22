---
title: Build an app locally
slug: 'data-apps/build-locally'
description: "How Python/JS app development works: the scaffold, the keboola-config folder Keboola needs, server-side data access, the dev loop, and syncing your own repository to a Keboola project."
redirect_from:
  - /data-apps/python-js/
---

Build an app in your own environment when you want full control over the code, your editor, and your Git workflow. Keboola still hosts and runs the app — it clones your repository, installs dependencies, starts the app, and serves it behind a secure URL. You don't manage servers, ports, or Docker: only your code and a small configuration folder.

For what the Python/JS stack can do (frameworks, full-stack, APIs for agents), see [What are Keboola apps](/data-apps/what-are-apps/#the-stack-pythonjs).

:::tip[Get your agent started right away]
Building with Claude Code, Cursor, or Copilot? Grab the skill and add it to your agent — or install the full [AI Kit](/ai/ai-kit/) plugin marketplace. The download is the complete skill folder: the skill itself, ready-made app templates (Python, Node.js, full-stack, Streamlit), and reference guides your agent can draw on.

<a class="skill-download-btn" href="/data-apps/keboola-dataapp-development-skill.zip" download="keboola-dataapp-development-skill.zip">⬇ Download the app-building skill (with templates)</a>
:::

## Before you start

- A Keboola project.
- Your local development tools.
- Optionally, your own Git account if you want to manage the repository yourself.

## App structure

A Keboola app is a standard web app: one process that listens on a port and serves HTTP. The shipped templates keep it flat.

- **Python** (`python-app`): `app.py` at the repository root, dependencies in `pyproject.toml`.
- **Node.js** (`nodejs-app`): `server.js` at the root with static files in `public/`, dependencies in `package.json`.
- **Split app** (`python-node-app`): a `backend/` folder (Python) and a `frontend/` folder (Node), each with its own dependency file.

All data-fetching logic — SQL queries and anything that uses your Storage token — belongs on the server side, never in browser code:

```js
// server.js — example route (illustrative)
app.get("/api/rows", async (req, res) => {
  // Use the Keboola Storage client here, server-side only.
  // Never expose your Storage token to the browser.
});
```

Using a bundler such as Vite or Next.js? **Build the frontend locally and commit the output.** Keboola installs dependencies before starting the app, but it does not run a build step.

:::caution
`KBC_TOKEN` is injected automatically and must stay server-side. Don't add it as a secret yourself, and never send it to the browser.
:::

## What the repository must contain

Keboola runs your code in a managed container: nginx in front, supervisord starting your processes. Your repository tells them how through a `keboola-config/` folder at its root. The layout is fixed. The [app-building skill](https://github.com/keboola/ai-kit/tree/main/plugins/dataapp-developer/skills/dataapp-development) ships it ready-made in three templates (`python-app`, `nodejs-app`, `python-node-app`) and explains every line in `references/python-js-apps.md`; the checklist below is what those files have to do.

- **`keboola-config/nginx/sites/*.conf`** — at least one nginx server block that listens on port **8888** and proxies to the port your app listens on. 8888 is fixed and already taken by nginx; your app can use any port from 1024 up and has to bind `127.0.0.1` (or all interfaces).
- **`keboola-config/supervisord/services/*.conf`** — at least one `[program:]` entry that starts your app: full script paths under `/app`, `directory=` set, Python commands prefixed with `uv run`, logs to `/dev/stdout` and `/dev/stderr` so they reach the **Terminal Logs** tab. No `[program:nginx]`; the image runs nginx itself.
- **`keboola-config/setup.sh`** — runs once before the app starts; install dependencies here (`uv sync` for Python, `npm install --omit=dev` for Node) and commit the file executable. Bare `pip install` is blocked in the image.
- **A dependency manifest** where `setup.sh` runs: `pyproject.toml` for Python, `package.json` for Node.
- **A root route that accepts POST as well as GET.** Keboola sends a POST to `/` to check the app is up; a GET-only route answers `Cannot POST /` or "Method Not Allowed". Flask: `methods=["GET", "POST"]`; Express: `app.all('/')`; Streamlit handles it on its own.

Bundling a frontend with Vite or Next.js? Build it locally and commit the output. Keboola installs dependencies before the start; it doesn't run your build.

Check the repository before you deploy:

```bash
kbagent data-app validate-repo --git-repo https://github.com/<owner>/<repo> --type python-js
```

It reports every missing or misplaced file against this contract.

## Develop with an AI coding tool

You can build the app with an AI coding assistant (Claude Code, Cursor, or Copilot). When you create a Python/JS app, Keboola offers a ready-made **skill file** — **Download Skill** or **View on GitHub** — that teaches your assistant the correct app structure, deployment config, and Keboola APIs, so you get working code with fewer errors. The app's **Overview** also links it as **AI Skill for Building**.

The full skill folder — the skill plus app templates and reference guides — is also [browsable on GitHub](https://github.com/keboola/ai-kit/tree/main/plugins/dataapp-developer/skills/dataapp-development). For the full toolkit — including the **Data App Developer plugin** with its validate → build → verify workflow — install [AI Kit](/ai/ai-kit/) in your assistant:

```bash
/plugin marketplace add keboola/ai-kit
/plugin install dataapp-developer
```

![The Create Python / JS App dialog, with a "Build Apps faster with AI" panel offering Download Skill and View on GitHub](/data-apps/python-js-ai-skill.png)

## How development works

The day-to-day loop, whichever way you build:

1. **Code lives in a Git repository** — yours, or a private Keboola-managed repo that Kai creates for the app (`git.<stack>.keboola.com/keboola/app-<id>.git`).
2. **Data access happens server-side.** Your backend queries Storage (Storage API or real-time SQL via the Query Service) using the auto-injected `KBC_TOKEN` — the browser never sees the token. Environment variables and code patterns are in [Reference → Data access](/data-apps/reference/#data-access).
3. **Ship a change**: push to the connected branch and hit **Redeploy** — or, if Kai built the app, just tell Kai what to change.
4. **Debug on the app detail**: the app's page has **Overview / Advanced Settings / All Runs / Terminal Logs / Versions** tabs (a **Drafts** tab appears while a draft exists). Env variables, theme, and data mappings live under **Advanced Settings**. The app **sleeps when idle** and wakes on the next visit; drafts hot-reload as Kai edits.

## Sync to your project

Keboola runs your app from a **Git repository** you point it at. Develop locally, push, and connect the repo:

1. In your project, create a **Python/JS app** (**Apps → + Create App → Python / JS**).
2. On the app's configuration page, open **Git Repository** and set the **Project URL**. For a private repo, switch on **Private** and add a **Username** and **Access Token**, or an **SSH Private Key**.
3. Set the **Branch**. The button beside it reads **Load Branches** until a repository is configured and **Reload Branches** afterwards. There's nothing to point at a start file — `keboola-config/supervisord/services/*.conf` is what starts your app.
4. Click **Deploy App** and complete the short wizard (backend size, inactivity timeout). Keboola clones the repo, runs `setup.sh`, and starts your processes. When the status turns **Active**, click **Open App**. Push changes and **Redeploy** to ship them.

![The Python/JS app configuration page: Authentication, a Git Repository section with Project URL and Load Branches, and the App Info panel showing the Python / JS backend](/data-apps/python-js-config.png)

## Access your data

Apps read Keboola data through Input Mapping, the Storage API, or Storage Access (real-time SQL via the Query Service). See [Reference → Data access](/data-apps/reference/#data-access) for environment variables, code patterns, and Storage Access setup.

## If the app doesn't start

The deployment job's event log holds the container output. While the app runs, its stdout and stderr are on the **Terminal Logs** tab, or one command away:

```bash
kbagent data-app logs --project <alias> --app-id <app id>
```

The usual causes:

| What you see | Why | Fix |
|---|---|---|
| `Cannot POST /`, "Method Not Allowed", or a blank page on first open | Keboola POSTs to `/` and your root route only accepts GET | Accept POST on `/` |
| `externally-managed-environment` | `pip install` somewhere in `setup.sh` | Use `uv sync` and list dependencies in `pyproject.toml` |
| The app restarts in a loop | A relative path in the supervisord config, a missing `uv run` prefix, a `setup.sh` without the executable bit, or a `[program:nginx]` entry | Use absolute `/app/...` paths, prefix Python with `uv run`, `chmod +x` the script, drop the nginx program |
| It works locally, not in Keboola | The `proxy_pass` port doesn't match the port the app listens on | Make them match |
| A streaming response arrives all at once | nginx buffers the whole response | `proxy_buffering off; proxy_cache off; proxy_request_buffering off;` in that location block |
| The page loads but never updates | The WebSocket handshake never completes | Add the WebSocket upgrade directives to that location block; the skill's nginx snippet has them |
| An environment variable is undefined | The secret isn't in the app configuration | Add it; see [Secrets](/data-apps/reference/#secrets) for how names become variables |
| The deploy fails while installing dependencies | No `pyproject.toml` or `package.json` where `setup.sh` looks | Commit the manifest at the path `setup.sh` runs in |
| The deploy succeeds, the app answers nothing | The app binds an interface nginx can't reach | Listen on `127.0.0.1` or all interfaces, not only an external one |
| A bundled frontend serves stale or missing files | The build output isn't committed | Build locally and commit the output; `setup.sh` installs, it doesn't build |

---

**Next:** [Authentication →](/data-apps/authentication/)
