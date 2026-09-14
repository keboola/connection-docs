---
title: Auth0 OIDC
slug: 'data-apps/authentication/auth0'
description: "Protect a Keboola app with Auth0 sign-in: register a Regular Web Application in Auth0, add the app's callback URL, and pick Auth0 in Keboola."
redirect_from:
  - /components/data-apps/oidc/auth0/
  - /data-apps/oidc/auth0/
---

Let people open your app through Auth0, with whatever connections your Auth0 tenant offers: username and password, social logins, or enterprise identity providers. You'll register the app in Auth0, tell it where to send users back after sign-in (the app's callback URL), and point the app at your tenant with Keboola's **Auth0** provider option.

**Before you start**

- You need the **Admin** role on your Auth0 tenant; the Editor roles can't create applications.

## 1. Create the app in Keboola and copy its callback URL

Auth0 needs the app's callback URL, so create the app first.

1. In your Keboola project, open **Apps**, click **+ Create App**, and [create the app manually](/data-apps/getting-started/#create-an-app-manually). The app opens on its configuration page. (Adding sign-in to an existing app? Open its configuration instead.)
2. Scroll to the **App URL** block. It shows the app's host as a URL prefix plus a generated part, for example `toy-store-sales` and `-74016144.hub.europe-west3.gcp.keboola.com`. Your callback URL is `https://`, that whole host, and `/_proxy/callback`:

   ```
   https://<url-prefix>-<app-id>.hub.<stack-host>/_proxy/callback
   ```

   For example: `https://toy-store-sales-74016144.hub.europe-west3.gcp.keboola.com/_proxy/callback`

   The block is there from the moment the app exists; you don't have to deploy first.

![The app's configuration page with the App URL block: the URL prefix, the generated host, and a copy button](/data-apps/publish-config.png)

Keep this tab open; you'll come back to it in step 3.

## 2. Register the application in Auth0

1. In the [Auth0 Dashboard](https://manage.auth0.com/), go to **Applications → Applications** and click **Create Application**.
2. Name it, choose **Regular Web Applications**, and click **Create**.
3. Open the **Settings** tab. Under **Basic Information**, copy the **Domain**, **Client ID**, and **Client Secret**.
4. Scroll down to **Application URIs** and paste the callback URL from step 1 into **Allowed Callback URLs**.
5. Click **Save Changes** at the bottom of the page.

## 3. Point the app at Auth0

Back on the app's configuration page in Keboola:

1. Under **Authentication**, set **Authentication Type** to **OIDC (Custom)**.
2. In the **Provider** dropdown, select **Auth0**.
3. Paste the **Client ID** and **Client secret**. Set **Issuer URL** to your tenant **Domain** with `https://` in front and a trailing slash, for example `https://acme.us.auth0.com/` (or a custom domain such as `https://login.acme.com/`). The field's example omits the slash, but Auth0's issuer ends with one; when in doubt, copy the `issuer` value from `https://<yourAuth0Domain>/.well-known/openid-configuration`.
4. **Logout URL** is optional: `https://<yourAuth0Domain>/oidc/logout` also ends the Auth0 session when someone signs out of the app.
5. Click **Save**. If the app is already deployed, click **Redeploy App** so the change takes effect.

## 4. Deploy and test

1. Set the app's code source and click **Deploy App**; the short wizard asks for the backend size and an inactivity timeout. (Details: [Create an app manually](/data-apps/getting-started/#create-an-app-manually). Just testing sign-in? A **Streamlit** app with a one-line inline script is the quickest thing to deploy.)
2. When the status turns **Active**, click **Open App**. Auth0 shows its login page, then sends you into the app.

## If sign-in fails

- **"Callback URL mismatch"** on an Auth0 error page — the URL in **Allowed Callback URLs** differs from the app's callback URL. Fix it under **Settings → Application URIs**.
- **Issuer mismatch or discovery error** when the app starts the sign-in — the **Issuer URL** must match the `issuer` in Auth0's discovery document character for character: `https://`, your Auth0 domain, trailing slash.
- **Users of one connection can't sign in** — that connection isn't enabled for this application. Turn it on under the application's **Connections** tab.

---

**Next:** [Publish and share →](/data-apps/publish-and-share/)
