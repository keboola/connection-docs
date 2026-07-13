---
title: Authentication
slug: 'data-apps/authentication'
description: Control who can open your Keboola app, including how to set up OIDC with Auth0, Google Cloud, Microsoft Entra ID, or Okta.
redirect_from:
  - /components/data-apps/authentication/
  - /data-apps/oidc/
  - /components/data-apps/oidc/
  - /data-apps/oidc/auth0/
  - /components/data-apps/oidc/auth0/
  - /data-apps/oidc/google-cloud-platform/
  - /components/data-apps/oidc/google-cloud-platform/
  - /data-apps/oidc/microsoft-entra-id/
  - /components/data-apps/oidc/microsoft-entra-id/
  - /data-apps/oidc/okta/
  - /components/data-apps/oidc/okta/
---



Once an app is deployed, its URL is publicly available. Protect it so only the right people can open it, and choose the method that fits your audience. You set it in the app's configuration under **Authentication → Authentication Type**, which offers six options.

![The Authentication Type dropdown in an app's configuration, listing None, Basic, OIDC, GitLab, GitHub, and JumpCloud](/data-apps/auth-options.png)

## Authentication methods

- **None (Public Access)** — the app is public to anyone with the URL. You can still add your own authorization inside the app; for Streamlit, use the [Streamlit authenticator](https://github.com/mkhorasani/Streamlit-Authenticator) ([example](https://github.com/KB-PS/mkt-bi-ocr/blob/master/Select_Invoices.py)).
- **Basic (Password)** — the **default** for new apps. Keboola generates a shared password; users enter it before the app opens. Once the app is deployed, the password is shown on the app's configuration page next to **Open App**, ready to copy — and when Kai builds an app, it shows the password as the last step. <!-- TODO(human-review, Miro): note the password-rotation gotcha flagged in Loop A. -->
- **OIDC (Custom)** — users sign in with your identity provider (Auth0, Google Cloud, Microsoft Entra ID, Okta). Recommended for anything beyond a quick share.
- **GitHub** — restrict access with GitHub OAuth by organization, team, repository, or allowed users.
- **GitLab** — restrict access with GitLab OAuth by groups, projects, or roles.
- **JumpCloud** — restrict access with JumpCloud OIDC, with optional role-based filtering.

<!-- Authentication Type dropdown options observed live (us-east4): None (Public Access), Basic (Password), OIDC (Custom), GitLab, GitHub, JumpCloud — the six-method list is accurate; these are top-level types, not sub-providers of OIDC. -->

## OIDC (single sign-on)

OIDC lets users log into your app through your single sign-on (SSO) provider. Keboola supports Auth0, Google Cloud, Microsoft Entra ID, and Okta. When you open an OIDC-protected app, you pick an **Authentication Provider** and sign in.

![Select OIDC provider](/data-apps/auth-select-oidc-provider.png)

### Set up OIDC

The flow is the same for every provider — only the provider option, issuer URL, and a few provider quirks differ (see the table below). You must register a callback URL for **each** app; credentials can't be reused across apps.

1. **Register the app with your identity provider.** Create an OIDC / OAuth 2.0 **web application** in the provider's console. You'll get a **Client ID** and **Client Secret**. Leave the callback URL for now — you don't have it until the Keboola app exists.
2. **Create the app in Keboola.** Open **Apps**, click the green **+**, name it, and click **Create App**.
3. **Set the authentication method.** In the app's **Information & Settings** tab, under **Authentication**, select **OIDC**, choose your provider option, and paste the **Client ID**, **Client Secret**, and **Issuer URL**. Click **Save**.
4. **Add the callback URL to your provider.** Register the app's [callback URL](#callback-url-format) as the authorized redirect URI in the provider's console.
5. **Deploy the app.** In the **Deploy App** tab, choose the **Code** or **GitHub** deployment type, add your code, and click **Deploy App**.
6. **Test.** Open the app URL — you should be redirected to your provider to sign in, then land in the app.

### Provider settings

| Provider | Keboola provider option | Issuer URL | Notes |
|---|---|---|---|
| **Auth0** | Generic OIDC | `https://<yourDomain>.us.auth0.com/` | Register a regular web application. <!-- VERIFY(Miro): confirm the Auth0 issuer format and provider option. The old page mislabeled this issuer as "Google OAuth 2.0" — do not carry that label forward. --> |
| **Google Cloud** | Google SSO | `https://accounts.google.com` | On the **OAuth consent screen**, add `keboola.com` under **Authorized domains**. <!-- VERIFY(Miro): old page used an invalid `http://keboola.com` (scheme); confirm the bare-domain value and the redirect-URI step order. --> |
| **Microsoft Entra ID** | Azure OIDC | *(from your tenant)* | Provide **Client ID**, **Client Secret**, and **Tenant ID**. To restrict by group, add a groups claim (**Manage → Token configuration → Add groups claim**; for large tenants, return only groups assigned to the app). <!-- VERIFY(Miro): confirm the "Tenant ID" field exists in the flow as described and the real field set. --> |
| **Okta** | Generic OIDC | `https://<yourOktaOrg>.okta.com/oauth2/default` | Register an **OIDC – OpenID Connect** web app. <!-- Loop A: Okta verified clean against appsproxy source. --> |

<!-- TODO(human-review, Miro): confirm the provider options, issuer URLs, and field names above against the live UI. -->

## GitHub authentication

Restrict access to your app using GitHub OAuth. Users authenticate via their GitHub account, and you can optionally restrict access to specific organizations, teams, repositories, or individual users.

### Required fields

| Field | Description | Example |
|---|---|---|
| **Client ID** | Client ID from GitHub Developer Settings > OAuth Apps. | `Ov23liABCDEF123456` |
| **Client Secret** | Client Secret from the same GitHub OAuth App. | *(paste your GitHub secret)* |

### Optional fields

| Field | Description | Example |
|---|---|---|
| **GitHub URL** | Your GitHub Enterprise Server URL. Leave empty for public GitHub. | `https://github.com` |
| **Organization** | URL slug of your GitHub organization. Restricts access to organization members. | `my-company` |
| **Team** | URL slug of the team within the organization. Requires Organization to be set. | `data-engineers` |
| **Repository** | Restrict to repository collaborators. Format: `owner/repo-name`. | `my-company/analytics` |
| **Access Token** | Required for private org/team/repo restrictions. Needs `read:org` scope. Generate at GitHub > Settings > Developer Settings > Personal Access Tokens. | `ghp_...` |
| **Allowed Users** | Comma-separated GitHub usernames. If set, only these users can log in. | `jane-smith, john-doe` |

### Setup instructions

1. Go to your GitHub account **Settings > Developer Settings > OAuth Apps** and create a new OAuth App.
2. Set the **Authorization callback URL** to: `https://<dataAppId>.hub.<keboolaConnectionHost>/_proxy/callback` (e.g., `https://my-app-12345678.hub.north-europe.azure.keboola.com/_proxy/callback`).
3. Copy the **Client ID** and **Client Secret** from the created OAuth App.
4. In your Keboola app configuration, select **GitHub** as the authentication method.
5. Paste the **Client ID** and **Client Secret**.
6. Optionally configure organization, team, repository, or allowed users restrictions.
7. If you use organization, team, or repository restrictions with a private organization, provide an **Access Token** with `read:org` scope.
8. Save and redeploy your app.

## GitLab authentication

Restrict access to your app using GitLab OAuth. Users authenticate via their GitLab account, and you can optionally restrict access by groups, projects, or roles.

### Required fields

| Field | Description | Example |
|---|---|---|
| **Client ID** | Application ID from GitLab > Settings > Applications. | `a1b2c3d4e5f6...` |
| **Client Secret** | Application secret from the same GitLab application. | `gloas-xxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| **GitLab Instance URL** | Use `https://gitlab.com` for public GitLab, or your self-hosted URL. | `https://gitlab.com` |

### Optional fields

| Field | Description | Example |
|---|---|---|
| **Groups** | Only members of these groups can access the app. Use the URL path, not the display name. Separate multiple groups with commas. | `my-org/data-team` |
| **Projects** | Restrict access to members of these projects. Format: `namespace/project-slug`. | `my-org/analytics-app` |
| **Allowed Roles** | Leave empty to allow any role. Valid values: `guest`, `reporter`, `developer`, `maintainer`, `owner`. | `developer, maintainer` |

### Setup instructions

1. Go to your GitLab instance **Settings > Applications** and create a new application.
2. Set the **Redirect URI** to: `https://<dataAppId>.hub.<keboolaConnectionHost>/_proxy/callback` (e.g., `https://my-app-12345678.hub.north-europe.azure.keboola.com/_proxy/callback`).
3. Ensure the `openid`, `profile`, and `email` scopes are selected. If you use group or project restrictions, also select `read_api`.
4. Copy the **Application ID** and **Secret**.
5. In your Keboola app configuration, select **GitLab** as the authentication method.
6. Paste the **Client ID**, **Client Secret**, and **GitLab Instance URL**.
7. Optionally configure groups, projects, or allowed roles restrictions.
8. Save and redeploy your app.

## JumpCloud authentication

Restrict access to your app using JumpCloud OIDC. Users authenticate via their JumpCloud account, and you can optionally restrict access by roles.

### Required fields

| Field | Description | Example |
|---|---|---|
| **Client ID** | Client ID from JumpCloud Admin Console > SSO > your app. | `6507c80f5f2b490a...` |
| **Client Secret** | Client Secret from JumpCloud Admin Console > SSO > your app > SSO tab. Treat like a password. | *(paste your JumpCloud secret)* |
| **Issuer URL** | Pre-filled. For custom tenants, ask your JumpCloud admin for the correct issuer URL. | `https://oauth.id.jumpcloud.com/` |
| **Logout URL** | Pre-filled. Change only if your JumpCloud admin provides a different logout endpoint. | `https://oauth.id.jumpcloud.com/oauth2/sessions/logout` |

### Optional fields

| Field | Description | Example |
|---|---|---|
| **Allowed Roles** | Role values must match exactly what is set in JumpCloud's attribute mapping. Leave empty to allow any authenticated user. | `data-analyst, admin` |

### Setup instructions

1. In the **JumpCloud Admin Console**, go to **SSO** and create a new application (or use an existing one).
2. Configure the application as an **OIDC** application.
3. Set the **Redirect URI** to: `https://<dataAppId>.hub.<keboolaConnectionHost>/_proxy/callback` (e.g., `https://my-app-12345678.hub.north-europe.azure.keboola.com/_proxy/callback`).
4. Copy the **Client ID** and **Client Secret** from the SSO tab.
5. In your Keboola app configuration, select **JumpCloud** as the authentication method.
6. Paste the **Client ID**, **Client Secret**, **Issuer URL**, and **Logout URL**.
7. Optionally configure allowed roles to restrict access.
8. Save and redeploy your app.

## Callback URL format

All authentication methods that use OAuth or OIDC require a callback URL. The format is always:

```
https://<dataAppId>.hub.<keboolaConnectionHost>/_proxy/callback
```

For example: `https://my-app-12345678.hub.north-europe.azure.keboola.com/_proxy/callback`

You can find your app's full URL after the first deployment in the app configuration.

---

**Next:** [Publish and share →](/data-apps/publish-and-share/)
