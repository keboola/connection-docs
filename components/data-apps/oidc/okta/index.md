---
title: Okta
permalink: /components/data-apps/oidc/okta/
---

* TOC
{:toc}

This document will guide you through the steps needed to set up the OpenID Connect (OIDC) protocol for Keboola data apps, specifically for use on Okta.

## Step 1: Create a new OAuth 2.0 Client ID in Okta
Follow these steps to create a new OAuth 2.0 client ID in Okta:

- Go to the Okta Admin Console.
- Click **Applications** and then click **Applications** again.
- Click **Create App Integration**.
- Select **OIDC - OpenID Connect** as the sign-in method.
- Choose **Web application** as the application type.
- Give your web app integration a name, for example, "Streamlit OIDC Demo".
- You do not have your sign-in redirect URI yet; you'll need to create a data app in Keboola first.
- Click **Save** to finish.

## Step 2: Configure Your Data App in Keboola
Follow these steps to set up a new data app in Keboola:

- Go to your Keboola project.
- Click **Data Apps**.
- Create a new data app by clicking the green **+** button.
- Give your app a name and click **Create Data App** to create the app.

## Step 3: Configure the Authentication Method for Your Data App
Follow these steps to set up the authentication method for your data app:

- Go to the newly created data app.
- Click the **Information & Settings** tab.
- Under **Authentication**, select **OIDC** and then **Generic OIDC**.
- Copy the client ID from your Okta application to the **Client ID** field in Keboola.
- Copy the client secret from your Okta application to the **Client secret** field in Keboola.
- In the **Issuer URL** field, enter `https://<yourOktaOrg>.okta.com/oauth2/default`. This is the correct issuer URL for Okta OIDC setup.
- Click **Save** to apply the changes.

## Step 4: Configure Your Data App's Consent Screen in Okta
Follow these steps to set up your data app's consent screen in Okta:

- Go to the Okta Admin Console and open your web app integration.
- Enter the sign-in redirect URIs back to your data app. <br>Make sure to add `/_proxy/callback` to the end of your redirect URL. <br>This is how Keboola will send the authentication response to your app. The format of the redirect URL is as follows: `https://<dataAppId>.hub.<keboolaConnectionHost>/_proxy/callback`
(e.g., `https://okta-oidc-data-app-1181276170.hub.north-europe.azure.keboola.com/_proxy/callback`).
- Click **Save** to finish.

## Step 5: Deploy Your Data App in Keboola
Follow these steps to deploy your data app in Keboola:

- In your data app in Keboola, click the **Deploy Data App** tab.
- Select **Code** and paste your code. For example, you can paste this code: `import streamlit as st st.write("Hello World")`.
- Click **Add code** to save your code.
- Click the green **Deploy Data App** button to deploy the application.

## Step 6: Test Your Data App
Follow these steps to test your new data app:

- Go to the data app's URL.
- You should be redirected to the Okta consent screen.
- Log in with your Okta account to verify your identity.
- The data app should display the "Hello World" message. 
