---
title: Google Cloud OIDC
slug: 'data-apps/authentication/google-cloud-platform'
description: Protect a Keboola app with Google sign-in: create the OAuth client in Google Cloud, register the app's callback URL, and pick Google SSO in the app's authentication settings.
redirect_from:
  - /components/data-apps/oidc/google-cloud-platform/
  - /data-apps/oidc/google-cloud-platform/
---

Let people open your app with their Google account. You'll create an OAuth client in Google Cloud, tell it where to send users back after sign-in (the app's callback URL), and point the app at Google.

**Before you start**

- You need a Google Cloud project where you can manage the consent screen and OAuth clients: the project **Owner** role, or the **OAuth Config Editor** role.
- Decide who should get in. To limit sign-in to your Google Workspace organization, the Google Cloud project must belong to that organization; you'll pick the **Internal** audience below. Otherwise the audience is **External**: any Google account can sign in once you publish the app.

## 1. Create the app in Keboola and copy its callback URL

Google needs the app's callback URL, so create the app first.

1. In your Keboola project, open **Apps**, click **+ Create App**, and [create the app manually](/data-apps/getting-started/#create-an-app-manually). The app opens on its configuration page. (Adding sign-in to an existing app? Open its configuration instead.)
2. Scroll to the **App URL** block. It shows the app's host as a URL prefix plus a generated part, for example `toy-store-sales` and `-74016144.hub.europe-west3.gcp.keboola.com`. Your callback URL is `https://`, that whole host, and `/_proxy/callback`:

   ```
   https://<url-prefix>-<app-id>.hub.<stack-host>/_proxy/callback
   ```

   For example: `https://toy-store-sales-74016144.hub.europe-west3.gcp.keboola.com/_proxy/callback`

   Don't see the **App URL** block yet? Deploy the app once with the default **Basic (Password)** authentication and come back; every deployed app shows the block on its configuration page.

![The app's configuration page with the App URL block: the URL prefix, the generated host, and a copy button](/data-apps/publish-config.png)

Keep this tab open; you'll come back to it in step 4.

## 2. Set up the consent screen in Google Cloud

1. Open the [Google Cloud console](https://console.cloud.google.com/), select your project, and open **Google Auth Platform** (search for it in the console's top bar).
2. First time in this project? Click **Get started** and fill in the wizard: **App name** and **User support email**, the **Audience** (**Internal** for your Google Workspace organization only, **External** for any Google account), and a contact email, then click **Create**.
3. Open **Branding**. Under **Authorized domains**, add `keboola.com`, the domain your App URL belongs to, and save. If Google refuses the redirect URI in the next step, it's because the domain is missing here.
4. Chose **External**? Open **Audience** and add yourself and your testers under **Test users** (up to 100), or click **Publish app** to let anyone with a Google account sign in. Until you do one of these, Google turns everyone else away.

## 3. Create the OAuth client

1. Open **Clients** and click **Create client**.
2. Set **Application type** to **Web application** and give the client a name, for example `Keboola app - Toy store sales`.
3. Under **Authorized redirect URIs**, click **Add URI** and paste the callback URL from step 1. It has to match exactly: `https`, the full host, and `/_proxy/callback` with no trailing slash.
4. Click **Create**. Copy the **Client ID** and the **Client secret** now; Google shows the secret only at creation. If you lose it, open the client and click **Add Secret**.

## 4. Point the app at Google

Back on the app's configuration page in Keboola:

1. Under **Authentication**, set **Authentication Type** to **OIDC (Custom)**.
2. In the **Provider** dropdown, select **Google SSO**.
3. Paste the **Client ID** and **Client Secret**, and set **Issuer URL** to `https://accounts.google.com`.
4. Click **Save**. If the app is already deployed, click **Redeploy App** so the change takes effect.

## 5. Deploy and test

1. Set the app's code source and click **Deploy App**; the short wizard asks for the backend size and an inactivity timeout. (Details: [Create an app manually](/data-apps/getting-started/#create-an-app-manually). Just testing sign-in? A **Streamlit** app with a one-line inline script is the quickest thing to deploy.)
2. When the status turns **Active**, click **Open App**. Google asks you to sign in (and, for an External app, to allow access), then sends you into the app.

Changed the redirect URI or the audience on Google's side later? No redeploy needed; Google says such changes take from a few minutes to a few hours to apply.

## If sign-in fails

- **`Error 400: redirect_uri_mismatch`** — the URI in the OAuth client differs from the app's callback URL. Compare them character by character (scheme, host, `/_proxy/callback`, no trailing slash) and fix the client.
- **"Access blocked: … has not completed the Google verification process"**, or a colleague can't get past Google — the audience is External and the app is still in **Testing**, so only listed **Test users** can sign in (up to 100). Add them on the **Audience** page, or click **Publish app**.
- **Someone outside your organization can't sign in** — expected with the Internal audience. Switch to External on the **Audience** page if that's not what you want.
- **`invalid_client`**, or a token error right after signing in — the Client ID or Client Secret in Keboola doesn't match the OAuth client. Paste them again, or add a new secret in Google Cloud and update the app.

---

**Next:** [Publish and share →](/data-apps/publish-and-share/)
