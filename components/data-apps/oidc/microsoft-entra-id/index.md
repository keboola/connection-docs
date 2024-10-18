---
title: Microsoft Entra ID
permalink: /components/data-apps/oidc/microsoft-entra-id/
---

* TOC
{:toc}

## Step 1: Create a New OAuth 2.0 Client ID
Follow these steps to create a new OAuth 2.0 client ID in Microsoft Entra ID:

- Go to portal.azure.com.
- Search for **Entra ID** and select **Microsoft Entra ID**.
- Click on **+ Add** and select **App registration**.
- Provide a human-readable name for the app.
- Open your app. Go to **Manage → Authentication** and click **Add a platform**.
- Choose **Web**.
- You do not know your redirect URL yet; first, you need to create a data app in Keboola. 
- Set up group claim. The app needs to be able to provide all user groups because this will be necessary later to authenticate users based on groups. To enable  this, go to **Manage -> Token configuration** and click **Add groups claim**. 
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
- Click on **Data Apps**.
- Create a new Data App by clicking on the green **+** button.
- Give your app a name and click on **Create Data App** to create the app.

## Step 3: Configure the Authentication Method for Your Data App
Follow these steps to set up the authentication method for you data app:

- Go to the newly created Data App.
- Click on the **Information & Settings** tab.
- Under **Authentication**, select **OIDC** and then **Azure OIDC**.
- Provide credentials from the Azure portal, such as the **Client ID**, **Client Secret**, and **Tenant ID**.
- Click on **Save** to apply the changes.
- Deploy the data app to get the data app URL, which you will need to specify as the redirect URL.

## Step 4: Configure the OAuth Consent Screen
Follow these steps to set up your data app's OAuth consent screen in the Azure portal.

- Go to the Azure Portal and open your app.
- Enter the redirect URL. Make sure to add `/_proxy/callback` to the end of your redirect URL. This is how Keboola will send the authentication response to your app. Format of the redirect URL is as follows:
`https://<dataAppId>.hub.<keboolaConnectionHost>/_proxy/callback` (e.g., `https://630064.hub.europe-west3.gcp.keboola.com/_proxy/callback`).
- Save the changes.

## Step 5: Deploy Your Data App in Keboola
Follow these steps to deploy the data app in Keboola:

- Go back to your Data App in Keboola.
- Click on the **Deploy data app** tab.
- Select **Code** and paste your code. The example code in the video is `import streamlit as st st.write("Hello World")`
- Click on **Add code** to save your code.
- Click on the green **Deploy data app** button to deploy the application.

## Step 6: Test Your Data App
Follow these steps to test your new data app:

- Go to the Data App's URL.
- You should be asked to log in using your Entra ID account.
- After successfully loging in, you will be redirected to the app.
- The data app should display the "Hello World" message.
