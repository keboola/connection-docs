---
title: Okta
permalink: /components/data-apps/oidc/okta/
---

* TOC
{:toc}

Okta
Step 1: Create a new OAuth 2.0 Client ID in Okta
Go to the Okta Admin Console.
Click on the "Applications" section and then again on the “Applications”.
Click on "Create App Integration".
Select “OIDC - OpenID Connect" as the sign-in method
Choose "Web application" as the application type.
Give your wep app integration a name, for example, "Streamlit OIDC Demo".
Your “Sign-in redirect URIs ” is currently not known to you and you first need to create a data app in Keboola Connection.
Click on "Save" to finish.
Step 2: Configure your Data App in Keboola.
Go to your Keboola project.
Click on "Data Apps".
Create a new Data App by clicking on the green "+" button.
Give your app a name and click on "Create data app" to create the app.
Step 3: Configure the authentication method for your Data App.
Go to the newly created Data App.
Click on the "Information & Settings" tab.
Under "Authentication", select "OIDC" and then "Generic OIDC".
Copy the Client ID from your Okta application to the "Client ID" field in Keboola.
Copy the Client secret from Okta application to the "Client secret" field in Keboola.
In the "Issuer URL" field, enter "https://<yourOktaOrg>.okta.com/oauth2/default". This is the correct issuer URL for Okta OIDC Setup
Click on "Save" to apply the changes.
Step 4: Configure your Data App's consent screen in Okta.
Go to the Okta Admin Console and open your web app integration..
Enter the Sign-in redirect URIs back to your data app. Make sure to add "/_proxy/callback" to the end of your redirect URL. This is how Keboola will send the authentication response to your app.
The format of the redirect url is as follows:
https://<dataAppId>.hub.<keboolaConnectionHost>/_proxy/callback
(e.g.https://https://okta-oidc-data-app-1181276170.hub.north-europe.azure.keboola.com/_proxy/callback)
Click on "Save" to finish.
Step 5: Deploy your Data App in Keboola.
In your Data App in Keboola click on the "Deploy data app" tab.
Select "Code" and paste your code. For example you can paste this code: "import streamlit as st st.write("Hello World")"
Click on "Add code" to save your code.
Click on the green "Deploy data app" button to deploy the application.
Step 6: Test your Data App.
Go to the Data App's URL.
You should be redirected to the Okta consent screen.
Log in with your Okta account to verify your identity.
The Data App should display the "Hello World" message.
 
 




