---
title: GitHub
permalink: /components/data-apps/oidc/github/
---

* TOC
{:toc}

This document will guide you through the steps needed to set up the oAuth2 for Keboola data apps, specifically for use on GitHub.

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
- Give your application a name, for example, "Streamlit oAuth2 Demo".
- Enter the **Homepage URL** - data app id copied from Keboola `https://<dataAppId>.hub.<keboolaConnectionHost>`
- Enter the **Authorization callback URL** to your data app. <br>Make sure to add `/_proxy/callback` to the end of your redirect URL. <br>This is how Keboola will send the authentication response to your app. The format of the redirect URL is as follows: `https://<dataAppId>.hub.<keboolaConnectionHost>/_proxy/callback`
(e.g., `https://github-oauth2-data-app-1234567890.hub.north-europe.azure.keboola.com/_proxy/callback`).
- Click **Register application** to finish.

## Step 4: Create a new Personal access token in Github
- Go to Settings.
- Click **Developer settings** and then click **Personal access tokens**.
- Choose **Tokens (classic)** and click on **Generate new token**.
- Select Expiration date, select scopes and click the green **Generate token** button.

## Step 5: Configure the Authentication Method for Your Data App
Follow these steps to set up the authentication method for your data app:

- Go to the newly created data app.
- Click the **Information & Settings** tab.
- Under **Authentication**, select **OIDC** and then **GitHub**.
- Copy the Client ID from your GitHub application to the **Client ID** field in Keboola.
- Copy the Client secret from your GitHub application to the **Client secret** field in Keboola.
- Copy Personal access token from Github to the **Personal access token** field in Keboola.
- When using Github Enterpise, paste your GitHub url (`https://github.example.com`) to **URL** field in Keboola, otherwise leave this field empty.
- Other fields (**Organization**, **Team**, **Repository**, **Users**) are optional.
- Click **Save** to apply the changes.

## Step 6: Deploy Your Data App in Keboola
Follow these steps to deploy your data app in Keboola again to apply changes:

- Click the green **Start Data App** button to deploy the application.

## Step 7: Test Your Data App
Follow these steps to test your new data app:

- Go to the data app's URL.
- You should be redirected to the GitHub consent screen.
- Log in with your GitHub account to verify your identity.
- The data app should display its content. 