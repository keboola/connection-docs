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

Keboola runs your code in a managed container: nginx in front, supervisord starting your processes. Two files tell it how, and they live at fixed paths in a `keboola-config/` folder at the repository root:

- `keboola-config/nginx/sites/*.conf` — at least one nginx server block listening on port **8888**, proxying to the port your app listens on.
- `keboola-config/supervisord/services/*.conf` — at least one supervisord program that starts your app.

Alongside them, your repository needs whatever your dependency installer reads: `pyproject.toml` for Python with uv, `package.json` for Node. Without it the install step fails and the deploy stops.

Two more files are optional:

- `keboola-config/setup.sh` — runs once before the app starts. Install dependencies here. Almost every app needs it.
- `run.sh` at the repository root — replaces the default startup entirely. You almost never want this.

The folder names and port 8888 are fixed; the `.conf` filenames are yours. `default.conf` and `app.conf` below are just the names the templates use, and you can add more of each: a Python backend plus a JS frontend, for example, is two supervisord programs.

Port 8888 is where the proxy sends traffic, and nothing else is reachable from outside. Your own app can listen on any port from 1024 up, except 8888 itself, which nginx already holds. The container doesn't run as root, so privileged ports below 1024 are blocked.

The app-building skill ships ready-made templates (`python-app`, `nodejs-app`, `python-node-app`) with this folder filled in.

### nginx

Its only job is to forward traffic to your app:

```nginx
# keboola-config/nginx/sites/default.conf
server {
    listen 8888;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

The `proxy_pass` port must match the port your app actually listens on: Flask defaults to 5000, Express to 3000, uvicorn (FastAPI) to 8000. In a split app, Keboola's own convention is Python on 8050 and the Node frontend on 3000.

Bind your app to `127.0.0.1` or all interfaces. nginx proxies to `127.0.0.1`, so an app listening only on an external interface is unreachable.

Two things need extra directives in that `location` block.

**Streaming** (Server-Sent Events, long responses). By default nginx collects the whole response before forwarding it, so the output arrives in one lump at the end:

```nginx
proxy_buffering off;
proxy_cache off;
proxy_request_buffering off;
```

**WebSockets.** Without the upgrade handshake the page loads and then never updates:

```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_read_timeout 86400;
```

### supervisord

One `[program:]` entry per process. Several processes can share one file or live in separate files; the split template uses `backend.conf` and `frontend.conf`.

```ini
# keboola-config/supervisord/services/app.conf
[program:app]
command=uv run python /app/app.py
directory=/app
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
```

Your repository is checked out at `/app`. Give script paths in full (`/app/app.py`, `/app/server.js`) and set `directory=` to the folder the command runs in — that's what makes module-style commands such as `uv run uvicorn main:app --host 127.0.0.1 --port 8050` resolve. Python commands need the `uv run` prefix; for Node the command is simply `command=node /app/server.js`.

Don't add a `[program:nginx]` entry: the base image starts nginx itself, and a second one fails.

Logging to `/dev/stdout` and `/dev/stderr` is what puts your output in the app's **Terminal Logs** tab.

### setup.sh

```bash
#!/bin/bash
set -Eeuo pipefail
cd /app && uv sync
```

For Node:

```bash
#!/bin/bash
set -Eeuo pipefail
cd /app && npm install --omit=dev
```

Commit the file with the executable bit (`chmod +x keboola-config/setup.sh`), or it won't run.

Python dependencies are installed with [uv](https://docs.astral.sh/uv/) from `pyproject.toml`, not with `pip`. The base image blocks bare `pip install`, which surfaces as an `externally-managed-environment` error.

### One thing your app must handle

Keboola sends a **POST request to `/`** to check that the app is up. A root route that only accepts GET answers it with `Cannot POST /`, "Method Not Allowed", or a blank page on first open. In Flask, add `methods=["GET", "POST"]`; in Express, use `app.all('/')`. Streamlit handles this on its own.

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
3. Set the **Branch**; **Reload Branches** refreshes the list. There's nothing to point at a start file — `keboola-config/supervisord/services/*.conf` is what starts your app.
4. Click **Deploy App** and complete the short wizard (backend size, inactivity timeout). Keboola clones the repo, runs `setup.sh`, and starts your processes. When the status turns **Active**, click **Open App**. Push changes and **Redeploy** to ship them.

![The Python/JS app configuration page: Authentication, a Git Repository section with Project URL and Load Branches, and the App Info panel showing the Python / JS backend](/data-apps/python-js-config.png)

## Access your data

Apps read Keboola data through Input Mapping, the Storage API, or Storage Access (real-time SQL via the Query Service). See [Reference → Data access](/data-apps/reference/#data-access) for environment variables, code patterns, and Storage Access setup.

## If the app doesn't start

The deployment job's event log holds the container output, and the **Terminal Logs** tab shows stdout and stderr while the app runs. The usual causes:

| What you see | Why | Fix |
|---|---|---|
| `Cannot POST /`, "Method Not Allowed", or a blank page on first open | Keboola POSTs to `/` and your root route only accepts GET | Accept POST on `/` |
| `externally-managed-environment` | `pip install` somewhere in `setup.sh` | Use `uv sync` and list dependencies in `pyproject.toml` |
| The app restarts in a loop | A relative path in the supervisord config, a missing `uv run` prefix, a `setup.sh` without the executable bit, or a `[program:nginx]` entry | Use absolute `/app/...` paths, prefix Python with `uv run`, `chmod +x` the script, drop the nginx program |
| It works locally, not in Keboola | The `proxy_pass` port doesn't match the port the app listens on | Make them match |
| A streaming response arrives all at once | nginx buffers the whole response | Turn off buffering and caching in that location block |
| The page loads but never updates | The WebSocket handshake never completes | Add the upgrade directives to the location block |
| An environment variable is undefined | The secret isn't in the app configuration | Add it; see [Secrets](/data-apps/reference/#secrets) for how names become variables |
| The deploy fails while installing dependencies | No `pyproject.toml` or `package.json` where `setup.sh` looks | Commit the manifest at the path `setup.sh` runs in |
| The deploy succeeds, the app answers nothing | The app binds an interface nginx can't reach | Listen on `127.0.0.1` or all interfaces, not only an external one |
| A bundled frontend serves stale or missing files | The build output isn't committed | Build locally and commit the output; `setup.sh` installs, it doesn't build |

---

**Next:** [Authentication →](/data-apps/authentication/)
