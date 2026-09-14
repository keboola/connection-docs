---
title: Microsoft Entra ID OIDC
slug: 'data-apps/authentication/microsoft-entra-id'
description: "Protect a Keboola app with Microsoft Entra ID (Azure AD) sign-in: register the app in Entra, add the callback URL and a client secret, optionally limit access to groups, and pick Azure OIDC in Keboola."
redirect_from:
  - /components/data-apps/oidc/microsoft-entra-id/
  - /data-apps/oidc/microsoft-entra-id/
---

Let people open your app with their Microsoft work account. You'll register the app in Microsoft Entra ID (formerly Azure AD), give Keboola the client ID, client secret, and tenant ID, and optionally limit access to specific groups.

**Before you start**

- You need permission to register applications in your tenant; the **Application Developer** role is enough for the registration itself. Group claims and group assignment need **Cloud Application Administrator** or higher.

## 1. Create the app in Keboola and copy its callback URL

Entra needs the app's callback URL, so create the app first.

1. In your Keboola project, open **Apps**, click **+ Create App**, and [create the app manually](/data-apps/getting-started/#create-an-app-manually). The app opens on its configuration page. (Adding sign-in to an existing app? Open its configuration instead.)
2. Scroll to the **App URL** block. It shows the app's host as a URL prefix plus a generated part, for example `toy-store-sales` and `-74016144.hub.europe-west3.gcp.keboola.com`. Your callback URL is `https://`, that whole host, and `/_proxy/callback`:

   ```
   https://<url-prefix>-<app-id>.hub.<stack-host>/_proxy/callback
   ```

   For example: `https://toy-store-sales-74016144.hub.europe-west3.gcp.keboola.com/_proxy/callback`

   Don't see the **App URL** block yet? Deploy the app once with the default **Basic (Password)** authentication and come back; every deployed app shows the block on its configuration page.

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

## 4. Optional: limit access to specific groups

Skip this if everyone in the tenant may open the app. Otherwise, make Entra include the user's groups in the token, then tell Keboola which groups to accept:

1. Under **Manage**, open **Token configuration** and click **Add groups claim**.
2. Choose which groups to send. For anything but a small tenant, pick **Groups assigned to the application**: a token carries at most 200 groups, and a user who belongs to more gets no groups claim at all. Click **Save**.
3. If you picked **Groups assigned to the application**, assign the groups: go to **Entra ID → Enterprise apps**, open your app, and under **Users and groups** click **Add user/group**. (Assigning groups, rather than single users, needs a Microsoft Entra ID P1 or P2 license.)

Note the **Object ID** of each allowed group (shown on the group's overview page); you'll enter them in Keboola in the next step.

## 5. Point the app at Entra ID

Back on the app's configuration page in Keboola:

1. Under **Authentication**, set **Authentication Type** to **OIDC (Custom)**.
2. In the **Provider** dropdown, select **Azure OIDC**.
3. Paste the **Client ID**, **Client Secret**, and **Tenant ID** from steps 2 and 3.
4. Restricting access to groups (step 4)? Under **Allowed Roles**, enter the groups' **Object IDs**; Keboola checks them against the `groups` claim in the token, which carries object IDs, not names. Leave the field empty to let in every user who can sign in.
5. Click **Save**. If the app is already deployed, click **Redeploy App** so the change takes effect.

## 6. Deploy and test

1. Set the app's code source and click **Deploy App**; the short wizard asks for the backend size and an inactivity timeout. (Details: [Create an app manually](/data-apps/getting-started/#create-an-app-manually). Just testing sign-in? A **Streamlit** app with a one-line inline script is the quickest thing to deploy.)
2. When the status turns **Active**, click **Open App**. Microsoft asks you to sign in (and, the first time, to accept the permissions), then sends you into the app.

## If sign-in fails

- **`AADSTS50011: The redirect URI … does not match`** — the redirect URI in the registration differs from the app's callback URL. Fix it under **Manage → Authentication**.
- **`AADSTS7000215: Invalid client secret provided`** — you pasted the secret's **Secret ID** instead of its **Value**, or the secret expired. Create a new one and update the app.
- **`AADSTS50105: … is not assigned to a role for the application`** — the enterprise app requires assignment (**Enterprise apps → your app → Properties → Assignment required?**) and the user isn't assigned. Add them under **Users and groups**.
- **A member of an allowed group is refused** — the token carries no groups claim (step 4), the user is in more than 200 groups, or **Allowed Roles** holds group names instead of object IDs. Switch the claim to **Groups assigned to the application**, assign the group, and check the IDs.

---

**Next:** [Publish and share →](/data-apps/publish-and-share/)
