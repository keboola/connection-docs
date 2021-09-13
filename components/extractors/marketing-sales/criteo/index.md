---
title: Criteo
permalink: /components/extractors/marketing-sales/criteo/
redirect_from:
    - /extractors/makreting-sales/criteo/
---

* TOC
{:toc}

This extractor uses the Criteo Marketing Solutions API to extract data on Ad performance
## Getting credentials

Criteo oAuth flow requires client ids and secrets from a developer app. Since a developer app in criteo is universal, meaning it 
can fetch data from all clients who authorize the app using a consent screen, the component requires each client to create their own
developer app for security reasons. So there is no possibility for one user to access data of another user.

To create a Criteo developer app and get a client id and secret, follow the following steps:

 - Create a developer account [here](https://developers.criteo.com/)
 - In the section "My apps", create an application
 - Name the application, eg. Keboola Criteo App
 - In the "Service" section select "Marketing solutions" and press save
 - In the "Authorization" set all access to read access and press save
 - On the top right of the app creation page press the "Activate App" button
 - Press create key. A text file containing the client id and secret should be downloaded
 - Again on the top right of the app creation page click the "Generate new URL" button
 - Send this consent link to your Criteo account administrator, who then has to accept the access (Only an administrator can accept the consent screen)

Now you can use the client id and secret obtained from the text file

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Criteo** extractor.

To configure this extractor, you need to provide an API **Client ID**, and an **Client secret**. Then click **Add Row**
to create new report to download.

{: .image-popup}
![Screenshot - Auth configuration](/components/extractors/marketing-sales/criteo/auth.png)

## Row configuration

In the configuration parameters fill in the following:
- Fill in the output name, which will be the name of the output table in Keboola
- Fill in the [dimension](https://developers.criteo.com/marketing-solutions/docs/dimensions) for the report
- Fill in the [metrics](https://developers.criteo.com/marketing-solutions/docs/metrics) for the report
- Fill in the [currency](https://developers.criteo.com/marketing-solutions/docs/currencies-supported) of the report
- Fill in the date range of the report, either select a dynamic date range such as "Last week" or fill in a custom one with text such as 3 days ago, yesterday, a week ago, or exact dates like 1 september 2020
- Set the loading option; Full overwrites the existing table in storage and incremental appends new and updates existing passes in the table using a primary key.
- If loading is set to incremental set a primary key
- then click **save** to save the configuration

{: .image-popup}
![Screenshot - Row configuration](/components/extractors/marketing-sales/criteo/row.png)
