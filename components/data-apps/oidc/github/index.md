---
title: GitHub
permalink: /components/data-apps/oidc/github/
---

* TOC
{:toc}

This document will guide you through the steps needed to set up the OpenID Connect (OIDC) protocol for Keboola data apps, specifically for use on GitHub.

## Step 1: Configure Your Data App in Keboola
Follow these steps to set up a new data app in Keboola:

- Go to your Keboola project.
- Click **Data Apps**.
- Create a new data app by clicking the green **+** button.
- Give your app a name and click **Create Data App** to create the app.

## Step 2: Deploy Your Data App in Keboola
Follow these steps to deploy your data app in Keboola:

- In your data app in Keboola, under the **Deployment** tab, select the **Code** or **GitHub** deployment type, and add the code for your application.
- Click the green **Deploy Data App** button to deploy the application.
- After that the app creates its id.

## Step 3: Create a new OAuth 2.0 Client ID in GitHub
Follow these steps to create a new OAuth 2.0 client ID in GitHub:

- Go to Settings.
- Click **Developer settings** and then click **OAuth Apps**.
- Create a new OAuth Apps by clicking on **New OAuth App**.
- Give your application a name, for example, "Streamlit OIDC Demo".
- Enter the **Homepage URL** - data app id copied from Keboola `https://<dataAppId>.hub.<keboolaConnectionHost>`
- Enter the **Authorization callback URL** to your data app. <br>Make sure to add `/_proxy/callback` to the end of your redirect URL. <br>This is how Keboola will send the authentication response to your app. The format of the redirect URL is as follows: `https://<dataAppId>.hub.<keboolaConnectionHost>/_proxy/callback`
(e.g., `https://github-oidc-data-app-1234567890.hub.north-europe.azure.keboola.com/_proxy/callback`).
- GitHub automatically enables these scopes for OAuth Apps:
  - **read:user** - Read access to profile info
  - **user:email** - Access to user email addresses
  - These scopes are sufficient for OIDC authentication
- Click **Register application** to finish.

## Step 4: Configure the Authentication Method for Your Data App
Follow these steps to set up the authentication method for your data app:

- Go to the newly created data app.
- Click the **Information & Settings** tab.
- Under **Authentication**, select **OIDC** and then **Generic OIDC**.
- Copy the Client ID from your GitHub application to the **Client ID** field in Keboola.
- Copy the Client secret from your GitHub application to the **Client secret** field in Keboola.
- Leave the **Issuer URL** field empty - GitHub uses a different OIDC implementation that doesn't require an issuer URL
- Click **Save** to apply the changes.

## Step 5: Deploy Your Data App in Keboola
Follow these steps to deploy your data app in Keboola again to apply changes:

- Click the green **Start Data App** button to deploy the application.

## Step 6: Test Your Data App
Follow these steps to test your new data app:

- Go to the data app's URL.
- You should be redirected to the GitHub consent screen.
- Log in with your GitHub account to verify your identity.
- The data app should display its content. 


