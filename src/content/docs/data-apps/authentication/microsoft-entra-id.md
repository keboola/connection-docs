---
title: Microsoft Entra ID OIDC
slug: 'data-apps/authentication/microsoft-entra-id'
description: "Protect a Keboola app with Microsoft Entra ID (Azure AD) sign-in: register the app in Entra, add the callback URL and a client secret, optionally restrict who can sign in, and pick Azure OIDC in Keboola."
redirect_from:
  - /components/data-apps/oidc/microsoft-entra-id/
  - /data-apps/oidc/microsoft-entra-id/
---

Let people open your app with their Microsoft work account. You'll register the app in Microsoft Entra ID (formerly Azure AD), give Keboola the client ID, client secret, and tenant ID, and optionally restrict who can sign in.

**Before you start**

- You need permission to register applications in your tenant; the **Application Developer** role is enough for the registration itself. Restricting who can sign in (step 4) needs **Cloud Application Administrator** or higher.

## 1. Create the app in Keboola and copy its callback URL

Entra needs the app's callback URL, so create the app first.

1. In your Keboola project, open **Apps**, click **+ Create App**, and [create the app manually](/data-apps/getting-started/#create-an-app-manually). The app opens on its configuration page. (Adding sign-in to an existing app? Open its configuration instead.)
2. Scroll to the **App URL** block. It shows the app's host as a URL prefix plus a generated part, for example `toy-store-sales` and `-74016144.hub.europe-west3.gcp.keboola.com`. Your callback URL is `https://`, that whole host, and `/_proxy/callback`:

   ```
   https://<url-prefix>-<app-id>.hub.<stack-host>/_proxy/callback
   ```

   For example: `https://toy-store-sales-74016144.hub.europe-west3.gcp.keboola.com/_proxy/callback`

   The block is there from the moment the app exists; you don't have to deploy first.

![The app's configuration page with the App URL block: the URL prefix, the generated host, and a copy button](/data-apps/publish-config.png)

Keep this tab open; you'll come back to it in step 5.

## 2. Register the app in Microsoft Entra ID

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) and go to **Entra ID → App registrations → New registration**.
2. Enter a **Name** your users will recognize.
3. Under **Supported account types**, keep **Single tenant only - <your tenant>**: only users and guests of your tenant can sign in.
4. Under **Redirect URI (optional)**, choose **Web** and paste the callback URL from step 1.
5. Click **Register**. The app's **Overview** page opens. Copy the **Application (client) ID** and the **Directory (tenant) ID**; Keboola needs both.

## 3. Create a client secret

1. Under **Manage**, open **Certificates & secrets** and click **New client secret**.
2. Enter a description, pick an expiry, and click **Add**.
3. Copy the secret's **Value** right away; Entra hides it once you leave the page. Note the expiry, too: before it passes, create a new secret and update the app's authentication settings, or sign-in stops working.

## 4. Optional: restrict who can sign in

Out of the box, anyone in your tenant can sign in to the app. To let in only specific people or groups, require assignment on the Entra side:

1. Go to **Entra ID → Enterprise apps**, open your app, and under **Manage → Properties** set **Assignment required?** to **Yes**. Save.
2. Under **Manage → Users and groups**, click **Add user/group** and pick who may sign in. Assigning groups, rather than single users, needs a Microsoft Entra ID P1 or P2 license.

Everyone else now gets `AADSTS50105` at sign-in.

## 5. Point the app at Entra ID

Back on the app's configuration page in Keboola:

1. Under **Authentication**, set **Authentication Type** to **OIDC (Custom)**.
2. In the **Provider** dropdown, select **Azure OIDC**.
3. Paste the **Client ID**, **Client secret**, and **Tenant ID** from steps 2 and 3. Keboola builds the issuer from the tenant ID (`https://login.microsoftonline.com/<tenant ID>/v2.0`).
4. Click **Save**. If the app is already deployed, click **Redeploy App** so the change takes effect.

## 6. Deploy and test

1. Set the app's code source and click **Deploy App**; the short wizard asks for the backend size and an inactivity timeout. (Details: [Create an app manually](/data-apps/getting-started/#create-an-app-manually). Just testing sign-in? A **Streamlit** app with a one-line inline script is the quickest thing to deploy.)
2. When the status turns **Active**, click **Open App**. Microsoft asks you to sign in (and, the first time, to accept the permissions), then sends you into the app.

## If sign-in fails

- **`AADSTS50011: The redirect URI … does not match`** — the redirect URI in the registration differs from the app's callback URL. Fix it under **Manage → Authentication**.
- **`AADSTS7000215: Invalid client secret provided`** — you pasted the secret's **Secret ID** instead of its **Value**, or the secret expired. Create a new one and update the app.
- **`AADSTS50105: … is not assigned to a role for the application`** — you required assignment in step 4 and this user isn't assigned. Add them under **Enterprise apps → your app → Users and groups**.

---

**Next:** [Publish and share →](/data-apps/publish-and-share/)
