---
title: Publish and share
slug: 'data-apps/publish-and-share'
description: Publish a Keboola app and share it with your team or external users.
---



Once your app is ready, publish it and share the link with the people who need it.

## Publish the app

An app is "published" once it's deployed and reachable at its URL, with the right people able to open it:

1. **Deploy the app.** From the app's configuration, click **Deploy App**. A short wizard asks for the **backend size** and an **inactivity timeout**, then deploys it; when the status turns **Active**, it's served at its public URL. See [App actions](/data-apps/reference/#app-actions).

   ![The Deploy App wizard: Backend Version (Python/JS), Backend Size, and Inactivity Timeout, with a Deploy App button](/data-apps/deploy-timeout-backedsize.png)

2. **Set authentication.** Choose who can open it — a shared password, SSO, GitHub, and more. See [Authentication](/data-apps/authentication/).
3. **Share the URL.** Anyone who passes the app's authentication can open it.

<!-- VERIFY(Miro / Adam Vyborny): confirm precisely what "publish" / "promote to production" means for apps — deploy + branch-merge vs an app-level production version — and the exact steps / URL / state changes. Flagged internally as confusing. -->

## Share with your team

Share the app URL — found on the app's **Overview** tab (the **App URL** block, with a copy button and **Open in new tab**). Anyone who passes the app's authentication can open it — control that with [Authentication](/data-apps/authentication/).

![The app's Overview tab: the App URL block with a copy button and Open in new tab, plus the App Info panel](/data-apps/publish-config.png)

## Manage a deployed app

From the app's header you can **Modify with Kai**, **Open App**, and **Start App** / **Redeploy App** depending on its state. The **⋯** menu holds the rest — **Copy app**, **Automate** (add it to a flow), **Debug mode**, and **Delete app**. See [App actions](/data-apps/reference/#app-actions) in the reference.

![The app header with Modify with Kai / Open App / Start App and the ⋯ menu open showing Copy app, Automate, Debug mode, and Delete app](/data-apps/app-actions-menu.png)

---

**Next:** [Apps reference →](/data-apps/reference/)
