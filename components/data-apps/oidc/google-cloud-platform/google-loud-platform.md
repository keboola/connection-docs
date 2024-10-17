---
title: Google Cloud Platform
permalink: /components/data-apps/oidc/google-cloud-platform/
---

* TOC
{:toc}

Step 1: Create a new OAuth 2.0 Client ID in Google Cloud Platform
Go to the Google Cloud Platform console.
Click on the "APIs & Services" section.
Click on "Credentials" and then "Create credentials".
Select "OAuth 2.0 client ID".
Choose "Web application" as the application type.
Give your client ID a name, for example, "Streamlit OIDC Demo".
Enter the Authorized redirect URIs back to your data app. Make sure to add "/_proxy/callback" to the end of your redirect URL. This is how Keboola will send the authentication response to your app.
The format of the redirect url is as follows:
https://<dataAppId>.hub.<keboolaConnectionHost>/_proxy/callback
(e.g. https://google-oidc-data-app-1181276170.hub.keboola.com/_proxy/callback)
Click on "Create" to finish.
Step 2: Configure your Data App in Keboola.
Go to your Keboola project.
Click on "Data Apps".
Create a new Data App by clicking on the green "+" button.
Give your app a name and click on "Create data app" to create the app.
Step 3: Configure the authentication method for your Data App.
Go to the newly created Data App.
Click on the "Information & Settings" tab.
Under "Authentication", select "OIDC" and then "Generic OIDC".
Copy the Client ID from your Google Cloud Project to the "Client ID" field in Keboola.
Copy the Client secret from Google Cloud Project to the "Client secret" field in Keboola.
In the "Issuer URL" field, enter "https://accounts.google.com". This is the correct issuer URL for Google OAuth 2.0.
Click on "Save" to apply the changes.
Step 4: Configure your Data App's OAuth consent screen in Google Cloud Project.
Go to the OAuth 2.0 client ID you created in the first step.
Click on the "OAuth consent screen" tab.
Update the application details, including the app name, support email, and application homepage link.
Under "Authorized domains", add "http://keboola.com".
This ensures that Keboola's domain is recognized as an authorized domain for your OAuth 2.0 app.
Your redirect URl is currently not known to you and you first need to create a data app in Keboola Connection. 
Click on "Save and continue" to proceed.
Step 5: Deploy your Data App in Keboola.
Go back to your Data App in Keboola.
Click on the "Deploy data app" tab.
Select "Code" and paste your code. The example code in the video is "import streamlit as st st.write("Hello World")"
Click on "Add code" to save your code.
Click on the green "Deploy data app" button to deploy the application.
Step 6: Test your Data App.
Go to the Data App's URL.
You should be redirected to the Google OAuth consent screen.
Log in with your Google account to verify your identity.
The Data App should display the "Hello World" message.
 
 


