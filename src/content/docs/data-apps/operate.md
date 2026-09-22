---
title: Operate and update an app
slug: 'data-apps/operate'
description: "Day-to-day work on a deployed Keboola app: read its state, ship a code change, change settings, stop and start it, rotate a secret, delete it."
---

Once an app is deployed, everything you do with it starts on its page under **Apps**. This page walks through the routine tasks; [Apps reference](/data-apps/reference/) has the full list of settings and actions.

## Read the app's state

The header shows the app's status and the one or two actions that make sense for it: **Deploy App** for an app that has never run, **Start App** for a stopped one, **Open App** and **Redeploy App** for a running one, and **Modify with Kai** on apps Kai built. The **⋯** menu holds the rest: **Suspend app**, **Copy app**, **Automate** (add it to a flow), **Debug mode**, **Delete app**.

The tabs below the header split the app's life into views: **Overview** (description, authentication, code source, App URL), **Advanced Settings** (environment variables and secrets, theme, data mappings), **All Runs** (every start attempt), **Terminal Logs** (stdout and stderr while it runs), **Versions** (every configuration change), and **Drafts** while Kai has a draft open. The **App Info** panel on the right shows the backend version and size, the auto-sleep timeout, the owner, and the App ID.

## Ship a code change

How depends on where the code lives; see [Two ways to run an app](/data-apps/what-are-apps/#two-ways-to-run-an-app).

- **Kai built the app.** Click **Modify with Kai** and describe the change. Kai works in a draft with its own live preview; when you're happy, publish it to production. The production app keeps serving the old version until you do. Details: [Build your first app with Kai](/data-apps/getting-started/#how-drafts-become-production).
- **Your own repository.** Push to the branch the app follows, then click **Redeploy App**. Keboola clones the branch again, runs `setup.sh`, and starts the new version; the old one serves until the new one is up. Push alone changes nothing.

## Change settings

Authentication, secrets, environment variables, the Git branch, backend size, and the auto-sleep timeout are all edited on the app's page, and none of them takes effect until the app starts again. After saving, click **Redeploy App** (running app) or **Start App** (stopped app). The deploy wizard asks for the backend size and the inactivity timeout every time; keep the current values unless you mean to change them.

Secrets deserve one note: after you save one, the field shows an encrypted value starting with `KBC::ProjectSecureGKMS::`. That's the secret stored encrypted, not a replacement. To rotate it, paste the new value over the encrypted one and redeploy. How secret names become environment variables: [Secrets](/data-apps/reference/#secrets).

## Stop, start, sleep

- **Sleeping** is automatic. After the inactivity timeout (five minutes to 24 hours, set in the deploy wizard) the app suspends; the next visit wakes it and shows a short **waking up** page. You pay only for time the app is awake or waiting to suspend.
- **Stopping** is deliberate: **⋯ → Suspend app** stops the container and takes the URL offline while keeping the configuration. Keboola asks you to confirm. **Start App** brings it back with the same settings.
- **Redeploy App** restarts a running app with the current configuration and, for apps on your own repository, the current branch head.

Sleep and wake behaviour in detail, including the wakeup error page: [Sleep and resume](/data-apps/reference/#sleep-and-resume).

## See what changed

The **Versions** tab lists every configuration change with who made it and when, from "Configuration created" onwards; **Show All Versions** opens the full history. Code changes for a Kai-built app are visible in the Builder's chat and drafts; for your own repository, in your Git history.

## Copy, automate, delete

- **Copy app** duplicates the configuration into a new app, so you can try a change without touching the one people use.
- **Automate** adds the app to a flow, for example to redeploy it after the data it reads has been refreshed.
- **Delete app** stops the app and deletes its configuration. The App URL stops working immediately; there is no undo.

## When something is off

Start with [Troubleshooting](/data-apps/troubleshooting/): where the logs are, what the common start failures look like, and what to do about each.

---

**Next:** [Troubleshooting →](/data-apps/troubleshooting/)
