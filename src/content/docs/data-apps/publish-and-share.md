---
title: Publish and share
lastUpdated: 2026-11-27
slug: 'data-apps/publish-and-share'
description: Publish a Keboola app and share it with your team or external users.
---

Once your app is ready, publish it and share the link with the people who need it.

<!-- How-to-type page. Typed 2026-11-27 with its prerequisites and check step (T4/T5). -->

## Before you start

- **An app in your project**, built with Kai ([Build your first app with Kai](/data-apps/getting-started/)) or from your own code ([Build locally](/data-apps/build-locally/)).
- **A project role that can edit the app**, to deploy it and change its authentication.
- **For OIDC, GitHub, GitLab or JumpCloud sign-in:** an OAuth app in that provider's console (for OIDC, admin rights there). **Basic (Password)**, the default, needs nothing outside Keboola. See [Authentication](/data-apps/authentication/).

## Publish the app

An app is "published" once it's deployed and reachable at its URL, with the right people able to open it:

1. **Deploy the app.** From the app's configuration, click **Deploy**. A short wizard asks for the **backend version**, the **backend size** (not on [pay-as-you-go](/management/payg-project/) projects) and an **inactivity timeout**; click **Deploy** in the wizard, and once the status turns **Active**, the app is served at its public URL. See [App actions](/data-apps/reference/#app-actions).

   ![The Deploy wizard of an app that has never run: the Backend version, Backend size and Inactivity timeout fields (1.6.3, XSmall, 15 minutes), and the Deploy button](/data-apps/deploy-wizard.png)

2. **Set authentication.** Choose who can open it — a shared password, SSO, GitHub, and more. See [Authentication](/data-apps/authentication/).
3. **Share the URL.** Anyone who passes the app's authentication can open it.

**Check:** the app's status badge reads **Running**, and the **App access** card on its **Overview** tab shows the **App URL**
with an **Open** button. Open the URL: with **Basic (Password)**, the app asks for the password before it opens.
<!-- Source for Running: operate.md, checked 2026-10-14 (Start shows Starting, then Deploying, then Running). VERIFY(Nikita): the badge after a first deploy, and whether the Apps list uses the same label. -->

## Share with your team

Copy the app URL from the app's **Overview** tab. It's in the **App access** card: the **App URL** block shows the URL prefix plus a generated part, and its copy button (**Copy the address**) copies the whole URL. Once the app has been deployed, the card's own **Open** button, at its top right, opens the app in a new tab. Before the first deploy there's no **Open**, and the card shows a notice such as **Not deployed yet. Deploy it to get an address you can share.**

The app's [authentication](/data-apps/authentication/) decides who gets in once they have the link. If the app is asleep, the first visit wakes it; [Stop, start, sleep](/data-apps/operate/#stop-start-sleep) has the details.

With **Basic (Password)**, share the password too. It's in the same card, in the **Password** field under **Authentication**: hidden until you click the eye icon, with a copy button that copies it even while it's hidden. If the card shows a notice asking you to deploy, start or redeploy the app instead of the field, do that first; it generates the password. **Reset** replaces it with a new password after you confirm, and the old one stops working for everyone who has it, usually within a minute.

![Part of a deployed app's Overview tab: the Used in and Description cards, then the App access card with Open at the top right, the App URL block (the prefix toy-store-sales, the generated part and a copy button) and Authentication set to Basic (Password), with the hidden password and its Reset, eye and copy controls; on the right, the App Info panel, Last App Runs and Versions](/data-apps/publish-config.png)

## Manage a deployed app

From the app's header you can click **Open** and **Start** or **Redeploy**, depending on its state, and **Edit with Kai** on a Python/JS app with a [Keboola-managed repository](/data-apps/what-are-apps/#two-ways-to-run-an-app) if you can edit the app and Kai can build apps in the project. The **⋮** (More actions) menu holds the rest: **Duplicate with Kai** (**Duplicate** on apps without a Keboola-managed repository), **Automate** (start it on a schedule), **Debug mode** and **Delete app**, plus **Pause app** while the app is running. [Operate and update an app](/data-apps/operate/) walks through each one.

![A stopped app's header with Open and the ⋮ menu open over the Start button: Duplicate with Kai, Automate, Debug mode and Delete app](/data-apps/app-actions-menu.png)

---

**Next:** [Operate and update an app →](/data-apps/operate/)
