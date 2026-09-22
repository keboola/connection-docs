---
title: Troubleshooting
slug: 'data-apps/troubleshooting'
description: "What to do when a Keboola app doesn't start, doesn't behave, or won't let people in: where the evidence is, the usual causes, and the fix for each."
---

Most app problems fall into a handful of patterns. Find where the evidence is first, then your symptom below.

## Where to look

- **The deployment job.** Every **Deploy** and **Redeploy** runs as a job, and its event log keeps the container output from the start attempt, including the runtime's own `[ERROR]` lines. Open it from the app's **All Runs** tab or from **Jobs**.
- **Terminal Logs**, the app's tab: stdout and stderr while the app runs. Keboola keeps them only while the app is running.
- **From a terminal**, if you use the [Keboola CLI](/cli/):

  ```bash
  kbagent data-app runs --project <alias> --app-id <app id>
  kbagent data-app logs --project <alias> --app-id <app id>
  ```

  The first lists recent start attempts with their outcome; the second tails the container log.
- **Kai**, for an app it built: ask it why the app isn't running. It reads the same logs.

## The app doesn't start

| What you see | Why | Fix |
|---|---|---|
| **Data App is not running** right after a deploy, and the run lasted about a second | The repository lacks the `keboola-config/` folder, or part of it. The runtime log says `App must have keboola-config/nginx/ directory` (or `supervisord/`) and the container exits. This is the single most common start failure. | Add the folder; [what the repository must contain](/data-apps/build-locally/) lists exactly what goes in it. Check with `kbagent data-app validate-repo` before the next deploy. |
| `fatal: Authentication failed` in the job log | Keboola couldn't clone the repository: the access token or SSH key for a private repository is missing, wrong, or expired. | Open **Git Repository** on the app, update **Username** and **Access Token** or the **SSH Private Key**, and redeploy. For a Keboola-managed repository this shouldn't happen; redeploy, and if it repeats, report it with the job ID. |
| The app starts and stops in a loop | The supervisord program can't start the process: a relative path where a full `/app/...` path is needed, a Python command without `uv run`, a `setup.sh` committed without the executable bit, or a `[program:nginx]` entry the image already provides. | Fix the config; the [layout contract](/data-apps/build-locally/) spells out each rule. |
| The install step fails | No `pyproject.toml` or `package.json` where `setup.sh` runs, or `pip install` in `setup.sh`; the image blocks bare `pip` (`externally-managed-environment`). | Commit the manifest; use `uv sync` or `npm install --omit=dev`. |
| The deploy job fails on a package conflict | Two dependencies want incompatible versions, or an unpinned package moved. | Pin versions. Streamlit apps: [Lock package versions](/data-apps/streamlit/lock-version/). |

## The app runs but misbehaves

| What you see | Why | Fix |
|---|---|---|
| `Cannot POST /`, "Method Not Allowed", or a blank page on first open | Keboola checks the app with a POST to `/`, and the root route only accepts GET. | Accept POST on `/`: Flask `methods=["GET", "POST"]`, Express `app.all('/')`. Streamlit handles it on its own. |
| Works locally, not in Keboola | The port in nginx's `proxy_pass` doesn't match the port the app listens on, or the app binds an interface nginx can't reach. | Make the ports match and listen on `127.0.0.1` or all interfaces. |
| A streaming response arrives all at once | nginx buffers the whole response before forwarding it. | `proxy_buffering off; proxy_cache off; proxy_request_buffering off;` in that `location` block. |
| The page loads but never updates | The WebSocket handshake isn't upgraded. | Add the WebSocket upgrade directives to that `location` block; the app-building skill's nginx snippet has them. |
| An environment variable is undefined | The secret isn't in the app's configuration, or you're using the wrong name. | Add it; `#my-key` becomes `MY_KEY`. See [Secrets](/data-apps/reference/#secrets). |
| A bundled frontend serves stale or missing files | The build output isn't committed. | Build locally and commit the output; Keboola installs dependencies, it doesn't run your build. |
| A Streamlit app shows an error in the browser, but the logs are empty | Streamlit renders uncaught exceptions in the page and doesn't write them to stderr. | Wrap your entry point so exceptions are logged to stderr before Streamlit shows them. |

## Sign-in problems

- **Basic (Password):** the password is on the app's configuration page next to **Open App** once the app is deployed.
- **OIDC:** each provider tab on [Authentication](/data-apps/authentication/) ends with an "If sign-in fails" list for that provider's error texts, redirect-URI mismatches, and audience settings.
- **Nobody can get in after you changed the authentication settings:** the change takes effect on the next start. Click **Redeploy App** (running app) or **Start App** (stopped app).

## Sleeping and waking

An idle app suspends after its inactivity timeout. The next visit wakes it and shows a **waking up** page for a moment; if waking fails, a **wakeup error** page appears with a **Show More** link to the reason. Details and the timeout setting: [Sleep and resume](/data-apps/reference/#sleep-and-resume).

---

**Next:** [Apps reference →](/data-apps/reference/)
