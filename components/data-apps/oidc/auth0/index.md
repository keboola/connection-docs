---
title: Auth0
permalink: /components/data-apps/oidc/auth0/
---

* TOC
{:toc}

Auth0
Step 1: Create a new OAuth 2.0 Client ID in Auth0
Go to the Auth0 and log in.
Click on the "Applications" section and then again on the “Applications”.
Click on "+Create Application".
Select “End users authenticate through my application".
Then select “Frontend”.
And choose “Other browser technology” as an application technology and give your application a name, for example, "Streamlit OIDC Demo" and click on “Continue”.
Choose “Python” as a technology you are using in your web app.
Your “Allowed callback URL” is currently not known to you and you first need to create a data app in Keboola Connection.
Click on "Save Changes" to finish.
Step 2: Configure your Data App in Keboola.
Go to your Keboola project.
Click on "Data Apps".
Create a new Data App by clicking on the green "+" button.
Give your app a name and click on "Create data app" to create the app.
Step 3: Configure the authentication method for your Data App.
Go to the newly created Data App.
Click on the "Information & Settings" tab.
Under "Authentication", select "OIDC" and then "Generic OIDC".
Copy the Client ID from your Auth0 application to the "Client ID" field in Keboola.
Copy the Client secret from the Auth0 application to the "Client secret" field in Keboola.
In the "Issuer URL" field, enter "https://<yourDomain>.us.auth0.com/". This is the correct issuer URL for Google OAuth 2.0.
Click on "Save" to apply the changes.
Step 4: Configure your Data App's consent screen in Auth0.
Go to the Auth0 and open your OIDC application.
Go to the “Settings” tab and enter the “Allowed callback URL”.
The format of the callback url is as follows:
https://<dataAppId>.hub.<keboolaConnectionHost>/_proxy/callback
(e.g. https://auth0-oidc-data-app-1181276170.hub.keboola.com/_proxy/callback)
And save the changes.
Step 5: Deploy your Data App in Keboola.
Go back to your Data App in Keboola.
Click on the "Deploy data app" tab.
Select "Code" and paste your code. The example code in the video is "import streamlit as st st.write("Hello World")"
Click on "Add code" to save your code.
Click on the green "Deploy data app" button to deploy the application.
Step 6: Test your Data App.
Go to the Data App's URL.
You should be redirected to the Auth0 consent screen.
Log in with your Auth0 account to verify your identity.
The Data App should display the "Hello World" message.
 
 



