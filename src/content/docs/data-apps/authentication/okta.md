---
title: Okta OIDC
slug: 'data-apps/authentication/okta'
description: "Protect a Keboola app with Okta sign-in: create an OIDC web app integration in Okta, register the app's callback URL, and pick Generic OIDC in Keboola."
redirect_from:
  - /components/data-apps/oidc/okta/
  - /data-apps/oidc/okta/
---

Let people open your app with their Okta account. You'll create an app integration in Okta, tell it where to send users back after sign-in (the app's callback URL), and point the app at your Okta org through Keboola's **Generic OIDC** option.

**Before you start**

- You need admin access to your Okta org (the **Application Administrator** or **Super Administrator** role) to create app integrations.

## 1. Create the app in Keboola and copy its callback URL

Okta needs the app's callback URL, so create the app first.

1. In your Keboola project, open **Apps**, click **+ Create App**, and [create the app manually](/data-apps/getting-started/#create-an-app-manually). The app opens on its configuration page. (Adding sign-in to an existing app? Open its configuration instead.)
2. Scroll to the **App URL** block. It shows the app's host as a URL prefix plus a generated part, for example `toy-store-sales` and `-74016144.hub.europe-west3.gcp.keboola.com`. Your callback URL is `https://`, that whole host, and `/_proxy/callback`:

   ```
   https://<url-prefix>-<app-id>.hub.<stack-host>/_proxy/callback
   ```

   For example: `https://toy-store-sales-74016144.hub.europe-west3.gcp.keboola.com/_proxy/callback`

   Don't see the **App URL** block yet? Deploy the app once with the default **Basic (Password)** authentication and come back; every deployed app shows the block on its configuration page.

![The app's configuration page with the App URL block: the URL prefix, the generated host, and a copy button](/data-apps/publish-config.png)

Keep this tab open; you'll come back to it in step 3.

## 2. Create the app integration in Okta

1. In the Okta Admin Console, go to **Applications → Applications** (in newer orgs the menu is called **Applications and Resources**) and click **Create App Integration**.
2. Choose **OIDC - OpenID Connect** as the **Sign-in method** and **Web Application** as the **Application type**, then click **Next**.
3. Enter an **App integration name**, for example `Keboola app - Toy store sales`.
4. Under **Sign-in redirect URIs**, replace the default value with the callback URL from step 1. You can remove the default **Sign-out redirect URIs** entry.
5. Under **Assignments**, decide who can sign in: **Allow everyone in your organization to access** or **Limit access to selected groups** (or skip the assignment for now and add people later).
6. Click **Save**. On the **General** tab, under **Client Credentials**, copy the **Client ID** and the **Client secret**.

## 3. Point the app at Okta

Back on the app's configuration page in Keboola:

1. Under **Authentication**, set **Authentication Type** to **OIDC (Custom)**.
2. In the **Provider** dropdown, select **Generic OIDC**.
3. Paste the **Client ID** and **Client Secret**. Set **Issuer URL** to `https://<yourOktaDomain>/oauth2/default`; your Okta domain is shown in the Admin Console when you click your name at the top right, for example `https://acme.okta.com/oauth2/default`. The `default` authorization server comes with the Integrator Free Plan and with API Access Management; if **Security → API → Authorization Servers** doesn't list it, use the org authorization server instead: `https://<yourOktaDomain>` with no path.
4. Click **Save**. If the app is already deployed, click **Redeploy App** so the change takes effect.

## 4. Deploy and test

1. Set the app's code source and click **Deploy App**; the short wizard asks for the backend size and an inactivity timeout. (Details: [Create an app manually](/data-apps/getting-started/#create-an-app-manually). Just testing sign-in? A **Streamlit** app with a one-line inline script is the quickest thing to deploy.)
2. When the status turns **Active**, click **Open App**. Okta asks you to sign in, then sends you into the app.

## If sign-in fails

- **"The 'redirect_uri' parameter must be a Login redirect URI in the client app settings"** — the URI in the integration differs from the app's callback URL. Fix **Sign-in redirect URIs** on the integration's **General** tab.
- **"User is not assigned to the client application"** — the user, or their group, isn't assigned to the integration. Add them on the **Assignments** tab.
- **Issuer or discovery error** when the app starts the sign-in — check the Issuer URL: `https://`, your Okta domain, `/oauth2/default`, no trailing slash. If your org has no `default` authorization server, use `https://<yourOktaDomain>` instead.

---

**Next:** [Publish and share →](/data-apps/publish-and-share/)
