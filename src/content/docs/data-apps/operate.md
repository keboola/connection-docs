---
title: Operate and update an app
slug: 'data-apps/operate'
description: "Day-to-day work on a deployed Keboola app: read its state, ship a code change, change settings, stop and start it, start it from a flow, rotate a secret, delete it."
---

Once an app is deployed, everything you do with it starts on its page under **Apps**. This page walks through the routine tasks; [Apps reference](/data-apps/reference/) has the full list of settings and actions.

Deploying, starting, stopping, deleting and setting secrets also work from a terminal with `kbagent`; kbagent has no draft or app-copy commands. `kbagent data-app deploy --config-version` deploys an older configuration once but doesn't restore it, so a real rollback is UI-only too. The `kbagent` commands below all take `--project <alias>`, the name you gave the project when you [connected it](/cli/concepts/#connections-and-config), and `--app-id`, the numeric **App ID** from the **App Info** panel.

## Read the app's state

The header shows the app's status and the actions that make sense for it: **Deploy** for an app that has never run, **Start** for a stopped or sleeping one, **Redeploy** for a running one, and **Open** once the app has been deployed. A Python/JS app with a [Keboola-managed repository](/data-apps/what-are-apps/#two-ways-to-run-an-app) also gets **Edit with Kai** if you can edit the app and [Kai can build apps](/kai/getting-started/#enabling-kai) in the project. The **⋮** (More actions) menu holds the rest: **Duplicate with Kai** (**Duplicate** on apps without a Keboola-managed repository), **Automate** (start it on a schedule), **Debug mode** and **Delete app**, plus **Pause app** while the app is running (**Cancel start** while it's starting).

The tabs below the header split the app's life into views: **Overview** (the app's settings and its App URL), **Advanced Settings** (environment variables and secrets, theme, data mappings), **All Runs** (every start attempt), **Terminal Logs** (stdout and stderr while it runs), **Versions** (the configuration history), and **Drafts** while Kai has a draft open. The **App Info** panel on the right shows the backend version and size, the auto-sleep timeout, the last change, the owner, and the App ID.

The **Overview** also tells you which kind of repository the app has. An app with a Keboola-managed repository says "The code of this app is stored in a Keboola-managed Git repository" there; any other app has a **Git Repository** or **Code Source** section in its place.

## Ship a code change

How depends on where the code lives; see [Two ways to run an app](/data-apps/what-are-apps/#two-ways-to-run-an-app).

- **A Keboola-managed repository.** Every app the Kai builder creates has one. Click **Edit with Kai** and describe the change. Kai works in a draft with its own live preview; when you're happy, publish it to production. The production app keeps serving the old version until you do. Details: [Build your first app with Kai](/data-apps/getting-started/#how-drafts-become-production). Without Kai, push to the managed repository yourself ([Change the app later](/data-apps/build-locally/#change-the-app-later) shows how), then redeploy as in the next bullet.
- **Your own repository.** Push to the branch set under **Git Repository** on the app's page, then click **Redeploy** (**Start** if the app is sleeping or stopped). Keboola clones that branch again, runs your repository's `keboola-config/setup.sh` if it has one, and starts the new version. Push alone changes nothing. The app can report **stopped** for a moment while it restarts, so give it a reload before you worry.

<!-- VERIFY(Nikita): in the 2026-10-01 UI build, Start and Redeploy send the same request (patchApp with desiredState running, restartIfRunning and the saved configVersion). Not yet tried on a sleeping app after a push: does Start clone the branch again, or reuse the setup from the last deploy? The same applies to build-locally's "Sync to your project" step 4. -->

From a terminal, a redeploy is `kbagent data-app deploy --project <alias> --app-id <id> --wait`.

## Change settings

Authentication, secrets, environment variables and the Git branch are edited on the app's page; the backend size and the inactivity timeout are set in the deploy wizard ([pay-as-you-go](/management/payg-project/) projects have no backend size field). Nothing you edit on the page takes effect until the app runs again, so after saving click **Redeploy** on a running app or **Start** on a stopped or sleeping one. **Redeploy** opens the wizard with the current backend version, backend size and inactivity timeout in a collapsed **Deploy settings** section; keep them unless you mean to change them. **Start** skips the wizard and uses the saved values, unless Kai has undeployed drafts of the app. To change the size or timeout of a stopped or sleeping app, start it, then redeploy.

Secrets deserve one note: after you save one, the field is masked, and revealing it shows an encrypted value starting with `KBC::ProjectSecure`. That's the secret stored [encrypted](/extend/encryption/), not a replacement, and the rest of the prefix depends on which cloud your stack runs on. To rotate it, paste the new value over the encrypted one and redeploy. How secret names become environment variables: [Secrets](/data-apps/reference/#secrets).

From a terminal: `kbagent data-app secrets-set --project <alias> --app-id <id> --secret '#API_KEY=…'`, then `kbagent data-app deploy`.

## Stop, start, sleep

- **Sleeping** is automatic. After the inactivity timeout (five minutes to 30 days, set in the deploy wizard) the app suspends; the next visit wakes it and shows a short **waking up** page. You pay only for time the app is awake or waiting to suspend.
- **A failed start** is the exception. If a deploy or start of a stopped or sleeping app fails, Keboola stops trying, and visits no longer wake the app. Fix the cause, then click **Start**, which turns waking on visits back on (`kbagent data-app deploy` starts the app from a terminal). [Troubleshooting](/data-apps/troubleshooting/#sleeping-and-waking) has the steps.
- **Pausing** is deliberate: **⋮ → Pause app**, confirmed with **Pause now**, puts a running app to sleep right away, before its inactivity timeout runs out. Its page then says **Stopped**, with **Start** in the header, while the Apps list says **Sleeping**. It keeps the configuration and, like any sleeping app, wakes on the next visit or when you click **Start**. Use it when nobody needs the app for a while, so you don't pay for the rest of the timeout.
- **Redeploy** restarts a running app with the current configuration and, for apps on your own repository, the current branch head.

<!-- Checked 2026-10-08 in project 264 on a temporary app (74023248, deleted afterwards) through the data-science API: one failed start from stopped (StartupProbeFailed, repository without keboola-config/) set autoRestartEnabled to false and showed the disabled warning; a visit got "This app is not running" and did not wake it. After pointing it at keboola/data-app-python-js-hello-world, clicking Start set autoRestartEnabled back to true at once, and after Pause app a visit woke it (503 "Starting" page, state starting). A failed redeploy of the running app kept the old version running with autoRestartEnabled true. Not tested separately: an app asleep after its inactivity timeout (treated like a paused one), and whether kbagent data-app deploy restores autoRestartEnabled the way Start does. -->

From a terminal: `kbagent data-app stop`, which does what **Pause app** does, and `kbagent data-app start`, both with `--project` and `--app-id`. `start` keeps the configuration version the app was last deployed with, so after a fix use `kbagent data-app deploy` instead.

Sleep and wake behaviour in detail, including the wakeup error page: [Sleep and resume](/data-apps/reference/#sleep-and-resume).

## See what changed, and go back

The **Versions** tab lists the app's configuration history: who changed what, and when. An app is a component configuration like any other, so you can compare versions and [roll back](/components/#rollback-version) to an earlier one. A rollback changes the configuration only, so redeploy afterwards to put the old settings back in service.

Code changes are tracked separately from configuration: for a Kai-built app they're in the Builder's chat and drafts, and for your own repository they're in your Git history.

## Copy, automate, delete

- **Duplicate with Kai** has Kai copy an app with a Keboola-managed repository, so you can try a change without touching the one people use. It opens a new Kai chat and asks Kai to copy the app. The request tells Kai to check whether a copy is possible, to say what carries over and what you'll have to set up again, and to make the copy only once you confirm. Only Kai can copy these apps, so the item is disabled when Kai isn't available.
- **Duplicate** does the same for any other app. It copies the app's code (or its repository and branch) and settings into a new app, which starts undeployed and gets its own address when you deploy it. If the app runs from your own repository, the copy deploys the same branch, so switch the copy to a branch of its own before you push experiments.
- **Automate** creates a flow that starts the app on a schedule. In its dialog, name the flow (leave the name blank for "Scheduled" plus the app's name), pick the schedule and click **Automate**. The schedule is preset to **Once per hour**, which starts the app every hour, restarting it with a new build if it's running. For a time of day you choose, pick **Custom schedule**; times follow the timezone shown next to **Schedule**, UTC unless you change it. A started app still goes back to sleep after its inactivity timeout if nobody opens it. The new flow has the app as its only task and is listed with your other [flows](/flows/); [Start the app from a flow](#start-the-app-from-a-flow) explains what that task does. Only the **Admin** and **Share** [roles](/management/project/users/#user-roles) see **Automate**.
- **Delete app** stops the app and deletes its configuration. The App URL stops working immediately; there is no undo. The terminal equivalent, `kbagent data-app delete`, says the same thing in its own words: cascade, irreversible.

## Start the app from a flow

Add the app to a [flow](/flows/) when it should start after other work, for example after the transformation that refreshes the tables in its [Input Mapping](/data-apps/reference/#input-mapping). **Automate** builds a flow with the app as its only task; to add the app to a flow you already have:

1. Open the flow and click **+** where the app should run, then **Component**.
2. Switch to the **Apps** tab, or search for the app's name, and select the app.
3. Save the flow.

When the flow runs, the task starts a stopped or sleeping app and restarts a running one, the way **Redeploy** does:

- Keboola builds the app again from the latest code in its repository, the current head of the branch for an app on your own repository. It keeps the configuration version the app was last deployed with and the package versions frozen in earlier builds, so settings saved since the last deploy still need a **Redeploy**.
- The app loads its Input Mapping again and gets a new `KBC_TOKEN`.
- The task waits until the app is running, up to five minutes. If a stopped or sleeping app fails to start or doesn't make it in time, the task fails, and so does an app that was deleted. Use a [condition](/flows/#conditions), such as [Continue on Failure](/flows/#4-continue-on-failure), if the rest of the flow should go on.
- A running app can report **running** for the whole restart, so its task may finish before the new build is live, and a failed rebuild doesn't fail the task. Don't count on the new build in the next task.

The flows **Automate** creates use the same task, so each scheduled run restarts the app with a new build even when people are using it.

<!-- VERIFY(Miroslav Čillík): taken from keboola/component-data-app-control (PR #7: forceRestart defaults to true, known limit of the final wait on a running app) and the flows-v2 builder; not yet run end to end on a stack. Check that a restart reruns the Input Mapping load, how long a restarted running app is unavailable to its users, and which project roles can run a flow with an app task. -->

In the flow's configuration, the task runs the **Data App Control** component, `keboola.data-app-control`, with the **App ID** from the app's **App Info** panel and no `configId`:

```json
{
  "type": "job",
  "componentId": "keboola.data-app-control",
  "configData": {
    "parameters": {
      "appId": "<App ID>"
    }
  },
  "mode": "run"
}
```

To only start a stopped or sleeping app and leave a running one alone, add `"forceRestart": false` to `configData.parameters`. In the flow builder, select the task and click **Set advanced parameters** at the bottom of its panel; through the API, edit the flow's configuration. A running app then keeps its build and its `KBC_TOKEN`.

If the task shows `keboola.data-apps` with a `configId` instead, it was added before the app was first deployed or on a stack without Data App Control. It restarts the app the same way, but `forceRestart` has no effect there. Deploy the app, then remove the task and add the app again.

## When something is off

Start with [Troubleshooting](/data-apps/troubleshooting/): where the logs are, what the common start failures look like, and what to do about each.

---

**Next:** [Troubleshooting →](/data-apps/troubleshooting/)
