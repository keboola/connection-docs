---
title: Auth0
permalink: /components/data-apps/oidc/auth0/
---

* TOC
{:toc}

## Step 1: Create a New OAuth 2.0 Client ID in Auth0
Follow these steps to create a new OAuth 2.0 client ID in Auth0:

- Go to the Auth0 and log in.
- Select **Applications** and click **Applications**.
- Click **+Create Application**.
- Select **End users authenticate through my application**.
- Then select **Frontend**.
- Choose **Other browser technology** as an application technology and give your application a name, for example, "Streamlit OIDC Demo". Then click **Continue**.
- Choose **Python** as a technology you are using in your web app.
- You do not need to provide the **Allowed callback URL** yet; you will need to create a data app in Keboola first.
- Click **Save Changes** to finish.

## Step 2: Create a Data App in Keboola
Follow these steps to configure you data app in Keboola:

- Go to your Keboola project.
- Click **Data Apps**.
- Create a new data app by clicking the green **+** button.
- Give your app a name and click **Create Data App** to finalize the creation.

## Step 3: Set Up the Authentication Method
Follow these steps to set up the authentication method for your data app:

- Go to the newly created data app.
- Click the **Information & Settings** tab.
- Under **Authentication**, select **OIDC** and then **Generic OIDC**.
- Copy the client ID from your Auth0 application to the **Client ID** field in Keboola.
- Copy the client secret from the Auth0 application to the **Client secret** field in Keboola.
- In the **Issuer URL** field, enter `https://<yourDomain>.us.auth0.com/`, which is the correct issuer URL for Google OAuth 2.0.
- Click **Save** to apply the changes.

## Step 4: Set Up the Auth0 Consent Screen
Follow these steps to configure your data app's consent screen in Auth0:

- Go to the Auth0 and open your OIDC application.
- Go to the **Settings** tab and enter the **Allowed callback URL**. The format of the callback URL is as follows:
`https://<dataAppId>.hub.<keboolaConnectionHost>/_proxy/callback`
(e.g., `https://auth0-oidc-data-app-1181276170.hub.keboola.com/_proxy/callback`)
- Save the changes.
  
## Step 5: Deploy the Data App in Keboola
Follow these steps to deploy your data app in Keboola:

- Go back to your data app in Keboola.
- Click the **Deploy data app** tab.
- Select **Code** and paste your code. The example code in the video is `import streamlit as st st.write("Hello World")`.
- Click **Add Code** to save your code.
- Click the green **Deploy Data App** button to deploy the application.

## Step 6: Test your Data App
Follow these steps to test your new data app:

- Go to the data app's URL.
- You should be redirected to the Auth0 consent screen.
- Log in with your Auth0 account to verify your identity.
- The Data App should display the "Hello World" message.
 
 



