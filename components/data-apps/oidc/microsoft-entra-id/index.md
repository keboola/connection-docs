---
title: Microsoft Entra ID
permalink: /data-apps/oidc/microsoft-entra-id/
redirect_from:
  - /components/data-apps/oidc/microsoft-entra-id/
---

* TOC
{:toc}

This document will guide you through the steps needed to set up the OpenID Connect (OIDC) protocol for Keboola data apps, specifically for use on Microsoft Entra ID.

## Step 1: Create a New OAuth 2.0 Client ID
Follow these steps to create a new OAuth 2.0 client ID in Microsoft Entra ID:

- Go to portal.azure.com.
- Search for **Entra ID** and select **Microsoft Entra ID**.
- Click **+ Add** and select **App registration**.
- Provide a human-readable name for the app.
- Open your app. Go to **Manage → Authentication** and click **Add a platform**.
- Choose **Web**.
- You do not know your redirect URL yet; first, you need to create a data app in Keboola. 
- Set up group claim. <br>The app needs to be able to provide all user groups because this will be necessary later to authenticate users based on groups. To enable  this, go to **Manage -> Token configuration** and click **Add groups claim**. 
- For large companies, we recommend using the last option to retrieve only the groups assigned to the application. Otherwise, all user roles will be included in the response.

This step is unnecessary if you selected **All groups** in the previous step: 
- Assign appropriate groups to the application. Go to **Overview** and click the link `Managed application in local directory`.
- Add groups to your application.
- Assign groups and click **Assign**.

Then you will generate app secrets. Go back to app registrations, then continue to **Manage -> Certificates and secrets** and create **New client secret**.
Provide a human-readable description and click **Add**. Save **Value** because you won’t be able to reveal it.

## Step 2: Configure Your Data App in Keboola
Follow these steps to configure you data app in Keboola:

- Go to your Keboola project.
- Click **Data Apps**.
- Create a new data app by clicking the green **+** button.
- Give your app a name and click **Create Data App** to create the app.

## Step 3: Configure the Authentication Method for Your Data App
Follow these steps to set up the authentication method for you data app:

- Go to the newly created data app.
- Click the **Information & Settings** tab.
- Under **Authentication**, select **OIDC** and then **Azure OIDC**.
- Provide credentials from the Azure portal, such as the **Client ID**, **Client Secret**, and **Tenant ID**.
- Click **Save** to apply the changes.
- Deploy the data app to get the data app URL, which you will need to specify as the redirect URL.

## Step 4: Configure the OAuth Consent Screen
Follow these steps to set up your data app's OAuth consent screen in the Azure portal.

- Go to the Azure portal and open your app.
- Enter the redirect URL. <br>Make sure to add `/_proxy/callback` to the end of your redirect URL. This is how Keboola will send the authentication response to your app. Format of the redirect URL is as follows:
`https://<dataAppId>.hub.<keboolaConnectionHost>/_proxy/callback` (e.g., `https://123456789.hub.europe-west3.gcp.keboola.com/_proxy/callback`).
- Save the changes.

## Step 5: Deploy Your Data App in Keboola
Follow these steps to deploy the data app in Keboola:

- Go back to your data app in Keboola.
- Click the **Deploy Data App** tab.
- Select the **Code** or **GitHub** deployment type, and add the code for your application.
- Click the green **Deploy Data App** button to deploy the application.

## Step 6: Test Your Data App
Follow these steps to test your new data app:

- Go to the data app's URL.
- You should be asked to log in using your Entra ID account.
- After successfully loging in, you will be redirected to the app.
- The data app should display its content.
