---
title: Google Cloud Platform
permalink: /components/data-apps/oidc/google-cloud-platform/
---

* TOC
{:toc}

This document will guide you through the steps needed to set up the OpenID Connect (OIDC) protocol for Keboola data apps, specifically for use on Google Cloud Platform (GCP).

## Step 1: Create a New OAuth 2.0 Client ID in GCP
Follow these steps to create a new OAuth 2.0 client ID in GCP:

- Go to the GCP console.
- Select **APIs & Services**.
- Click **Credentials**, then **Create Credentials**.
- Select **OAuth 2.0 Client ID**.
- Choose **Web application** as the application type.
- Give your client ID a name, for example, "Streamlit OIDC Demo".
- Enter the **Authorized redirect URIs** pointing back to your data app. <br>Make sure to add `/_proxy/callback` to the end of your redirect URL. This is how Keboola will send the authentication response to your app. The format of the redirect URL is as follows: `https://<dataAppId>.hub.<keboolaConnectionHost>/_proxy/callback` (e.g., `https://google-oidc-data-app-1181276170.hub.keboola.com/_proxy/callback`).
- Click **Create** to finish.

## Step 2: Create a New Data App in Keboola
Follow these steps to start configuring your data app in Keboola:

- Go to your Keboola project.
- Select **Data Apps**.
- Create a new data app by clicking the green **+** button.
- Give your app a name and click **Create Data App** to finalize the creation.

## Step 3: Set Up the Authentication Method
Follow these steps to set up the authentication method for your data app:

- Go to the newly created data app.
- Click the **Information & Settings** tab.
- Under **Authentication**, select **OIDC** and then **Generic OIDC**.
- Copy the client ID from your Google Cloud Project to the **Client ID** field in Keboola.
- Copy the client secret from your Google Cloud Project to the **Client secret** field in Keboola.
- In the **Issuer URL** field, enter `https://accounts.google.com`, which is the correct issuer URL for Google OAuth 2.0.
- Click **Save** to apply the changes.

## Step 4: Configure the OAuth Consent Screen
Follow these steps to configure your data app's OAuth consent screen in your Google Cloud project:

- Go to the OAuth 2.0 client ID you created in the first step.
- Click the **OAuth consent screen** tab.
- Update the application details, including the app name, support email, and application homepage link.000
- Under **Authorized domains**, add `http://keboola.com`. This ensures that Keboola's domain is recognized as an authorized domain for your OAuth 2.0 app.
- You do not need to provide the redirect URl yet; you will need to deploy your data app in Keboola first. 
- Click on **Save and continue** to proceed.

## Step 5: Deploy the Data App
Follow these steps to deploy your data app in Keboola:

- Go back to your data app in Keboola.
- Click the **Deploy Data App** tab.
- Select **Code** and paste your code. The example code in the video is `import streamlit as st st.write("Hello World")`.
- Click **Add Code** to save your code.
- Click the green **Deploy Data App** button to deploy the application.

## Step 6: Test the Data App
Follow these step to test your new data app:

- Go to the data app's URL.
- You should be redirected to the Google OAuth consent screen.
- Log in with your Google account to verify your identity.
- The data app should display the "Hello World" message.
