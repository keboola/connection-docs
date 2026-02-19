---
title: Criteo
permalink: /components/extractors/marketing-sales/criteo/
redirect_from:
    - /extractors/makreting-sales/criteo/
---

* TOC
{:toc}

This data source connector uses the Criteo Marketing Solutions API to extract data on ad performance.

## Getting Credentials

Criteo OAuth flow requires client IDs and client secrets from a developer app. Since a developer app in Criteo is universal, meaning it 
can fetch data from all clients who authorize the app using a consent screen, the component requires each client to create their own
developer app for security reasons. There is no possibility for one user to access data of another user.

To create a Criteo developer app and get a client ID and a client secret, take the following steps:

 - Create a developer account [here](https://developers.criteo.com/).
 - In the section "My apps", create an application.
 - Name the application, e.g., Keboola Criteo App.
 - In the "Service" section, select "Marketing solutions" and press Save.
 - In the "Authorization", set all access to read access and press Save.
 - On the top right of the app creation page, press the "Activate App" button.
 - Press Create Key. A text file containing the client ID and client secret should be downloaded.
 - Again on the top right of the app creation page, click the "Generate New URL" button.
 - Send this consent link to your Criteo account administrator, who then has to accept the access. (Only an administrator can accept the consent screen).

Now you can use the client ID and client secret obtained from the text file.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Criteo** connector.

To configure this connector, you need to provide an API **Client ID** and a **Client secret**. Then click **Add Row**
to create a new report to download.

{: .image-popup}
![Screenshot - Auth configuration](/components/extractors/marketing-sales/criteo/auth.png)

## Row Configuration

In the configuration parameters, do the following:
- Fill in the output name. It will be the name of the output table in Keboola.
- Fill in the [dimension](https://developers.criteo.com/marketing-solutions/docs/campaign-statistics#dimensions) for the report.
- Fill in the [metrics](https://developers.criteo.com/marketing-solutions/docs/campaign-statistics#metrics) for the report.
- Fill in the [currency](https://developers.criteo.com/marketing-solutions/docs/campaign-statistics#currencies) of the report.
- Fill in the date range of the report. Either select a dynamic date range such as "Last week", or fill in a custom one with text such as 3 days ago, yesterday, a week ago, or exact dates like 1 september 2020.
- Set the loading option. `Full` overwrites the existing table in Storage and `incremental` appends new data and updates existing passes in the table using a primary key.
- If loading is set to `incremental`, set a primary key.
- Click **Save** to save the configuration.

{: .image-popup}
![Screenshot - Row configuration](/components/extractors/marketing-sales/criteo/row.png)

For further details on the Criteo API and troubleshooting steps, please refer to Criteo's official [documentation](https://developers.criteo.com/marketing-solutions/docs/api-troubleshooting-tips).
