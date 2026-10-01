---
title: Publish and share
slug: 'data-apps/publish-and-share'
description: Publish a Keboola app and share it with your team or external users.
---

Once your app is ready, publish it and share the link with the people who need it.

## Publish the app

An app is "published" once it's deployed and reachable at its URL, with the right people able to open it:

1. **Deploy the app.** From the app's configuration, click **Deploy**. A short wizard asks for the **backend version**, the **backend size** (not on [pay-as-you-go](/management/payg-project/) projects) and an **inactivity timeout**, then deploys it; when the status turns **Active**, it's served at its public URL. See [App actions](/data-apps/reference/#app-actions).

   ![The deploy wizard on a running app, with Backend Version (Python/JS), Backend Size and Inactivity Timeout fields](/data-apps/deploy-timeout-backedsize.png)

2. **Set authentication.** Choose who can open it — a shared password, SSO, GitHub, and more. See [Authentication](/data-apps/authentication/).
3. **Share the URL.** Anyone who passes the app's authentication can open it.

## Share with your team

Share the app URL — found on the app's **Overview** tab (the **App URL** block, with a copy button and **Open in new tab**). Anyone who passes the app's authentication can open it — control that with [Authentication](/data-apps/authentication/).

![The app's Overview tab: the App URL block with a copy button and Open in new tab, plus the App Info panel](/data-apps/publish-config.png)

## Manage a deployed app

<!-- VERIFY(Michal Ševčík): on 2026-09-29 a Python/JS app built with kbagent (project 264, App ID 74021867) showed Edit with Kai in the header, running and stopped, and Duplicate with Kai, Automate, Debug mode and Delete app in the ⋯ menu while stopped, not Modify with Kai and Copy app. The 2026-07-10 screenshots of the Kai-built app 74016144 show Modify with Kai and Copy app. Renamed since, or does it depend on who built the app? -->

From the app's header you can **Modify with Kai**, **Open App**, and **Start** / **Redeploy** depending on its state. The **⋯** menu holds the rest: **Copy app**, **Automate** (add it to a flow), **Debug mode** and **Delete app**, plus **Suspend app** while the app is running. [Operate and update an app](/data-apps/operate/) walks through each one.

![A stopped app's header with Modify with Kai and Open App, and the ⋯ menu open: Copy app, Automate, Debug mode and Delete app](/data-apps/app-actions-menu.png)

---

**Next:** [Operate and update an app →](/data-apps/operate/)
