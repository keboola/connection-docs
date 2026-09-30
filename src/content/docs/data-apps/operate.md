---
title: Operate and update an app
slug: 'data-apps/operate'
description: "Day-to-day work on a deployed Keboola app: read its state, ship a code change, change settings, stop and start it, rotate a secret, delete it."
---

Once an app is deployed, everything you do with it starts on its page under **Apps**. This page walks through the routine tasks; [Apps reference](/data-apps/reference/) has the full list of settings and actions.

Deploying, starting, stopping, deleting and setting secrets also work from a terminal with `kbagent`; kbagent has no draft or app-copy commands. `kbagent data-app deploy --config-version` deploys an older configuration once but doesn't restore it, so a real rollback is UI-only too. The `kbagent` commands below all take `--project <alias>`, the name you gave the project when you [connected it](/cli/concepts/#connections-and-config), and `--app-id`, the numeric **App ID** from the **App Info** panel.

## Read the app's state

The header shows the app's status and the one or two actions that make sense for it: **Deploy App** for an app that has never run, **Start App** for a stopped one, **Open App** and **Redeploy App** for a running one, and **Modify with Kai** on apps Kai built. The **⋯** menu holds the rest, and its contents depend on the state too: **Copy app**, **Automate** (add it to a flow), **Debug mode** and **Delete app** are always there, with **Suspend app** on a running app.

The tabs below the header split the app's life into views: **Overview** (the app's settings and its App URL), **Advanced Settings** (environment variables and secrets, theme, data mappings), **All Runs** (every start attempt), **Terminal Logs** (stdout and stderr while it runs), **Versions** (the configuration history), and **Drafts** while Kai has a draft open. The **App Info** panel on the right shows the backend version and size, the auto-sleep timeout, the last change, the owner, and the App ID.

## Ship a code change

How depends on where the code lives; see [Two ways to run an app](/data-apps/what-are-apps/#two-ways-to-run-an-app).

- **Kai built the app.** Click **Modify with Kai** and describe the change. Kai works in a draft with its own live preview; when you're happy, publish it to production. The production app keeps serving the old version until you do. Details: [Build your first app with Kai](/data-apps/getting-started/#how-drafts-become-production).
- **Your own repository.** Push to the branch set under **Git Repository** on the app's page, then click **Redeploy App**. Keboola clones that branch again, runs your repository's `keboola-config/setup.sh` if it has one, and starts the new version. Push alone changes nothing. The app can report **stopped** for a moment while it restarts, so give it a reload before you worry.

From a terminal, a redeploy is `kbagent data-app deploy --project <alias> --app-id <id> --wait`.

## Change settings

Authentication, secrets, environment variables and the Git branch are edited on the app's page; the backend size and the inactivity timeout are chosen in the deploy wizard each time you deploy or start the app. Nothing you edit on the page takes effect until the app runs again, so after saving click **Redeploy App** on a running app or **Start App** on a stopped one. The wizard asks for backend version, backend size and inactivity timeout every time; keep the current values unless you mean to change them.

Secrets deserve one note: after you save one, the field is masked, and revealing it shows an encrypted value starting with `KBC::ProjectSecure`. That's the secret stored [encrypted](/extend/encryption/), not a replacement, and the rest of the prefix depends on which cloud your stack runs on. To rotate it, paste the new value over the encrypted one and redeploy. How secret names become environment variables: [Secrets](/data-apps/reference/#secrets).

From a terminal: `kbagent data-app secrets-set --project <alias> --app-id <id> --secret '#API_KEY=…'`, then `kbagent data-app deploy`.

## Stop, start, sleep

- **Sleeping** is automatic. After the inactivity timeout (five minutes to 24 hours, set in the deploy wizard) the app suspends; the next visit wakes it and shows a short **waking up** page. You pay only for time the app is awake or waiting to suspend.
- **Stopping** is deliberate: **⋯ → Suspend app** stops the container and keeps the configuration, so the app stops serving until you bring it back with **Start App**. Use this when an app should be off for days; sleeping already covers being idle overnight.
- **Redeploy App** restarts a running app with the current configuration and, for apps on your own repository, the current branch head.

From a terminal: `kbagent data-app stop` and `kbagent data-app start`, both with `--project` and `--app-id`.

Sleep and wake behaviour in detail, including the wakeup error page: [Sleep and resume](/data-apps/reference/#sleep-and-resume).

## See what changed, and go back

The **Versions** tab lists the app's configuration history: who changed what, and when. An app is a component configuration like any other, so you can compare versions and [roll back](/components/#rollback-version) to an earlier one. A rollback changes the configuration only, so redeploy afterwards to put the old settings back in service.

Code changes are tracked separately from configuration: for a Kai-built app they're in the Builder's chat and drafts, and for your own repository they're in your Git history.

## Copy, automate, delete

- **Copy app** duplicates the configuration into a new app, so you can try a change without touching the one people use.
- **Automate** adds the app to a flow, for example to redeploy it after the data it reads has been refreshed.
- **Delete app** stops the app and deletes its configuration. The App URL stops working immediately; there is no undo. The terminal equivalent, `kbagent data-app delete`, says the same thing in its own words: cascade, irreversible.

## When something is off

Start with [Troubleshooting](/data-apps/troubleshooting/): where the logs are, what the common start failures look like, and what to do about each.

---

**Next:** [Troubleshooting →](/data-apps/troubleshooting/)
