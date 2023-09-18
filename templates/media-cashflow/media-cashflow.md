---
title: Media Cashflow
permalink: /templates/media-cashflow/
---

* TOC
{:toc}

This template combines data from various platforms (ECB currency rates, Meta, Google Ads, LinkedIn, TikTok, Sklik, etc.), transforms and joins them 
into a single data model for further deployment into a Data App where users can see and filter expenses by clients, identify upcoming payments or 
change budgets for campaigns.

In this section, we will provide you with instructions on how to build the Media Cashflow app using a pre-defined template. To learn more about how templates work, 
please refer to [this page](https://help.keboola.com/templates/). For more information on how data apps function and how to set them up, 
please refer to [this page](https://help.keboola.com/components/data-apps/).

## How to Use Template
To begin, click on **Templates** in the top menu and then select **Add Template**.

{: .image-popup}
![Add New Template](/templates/media-cashflow/add-template.png)

This will take you to the list of all available templates. Among the various categories available, we will focus on the Data App templates for our case. 
To do this, check the category for data app templates and obtain the list. From this list, select `**Marketing Cashflow** and click on **Use Template**.

{: .image-popup}
![Add New Template – Data Apps](/templates/media-cashflow/new-template-data-apps.png)

You will then be directed to the main Template page, where all components used are listed, and you can find a general description of the Template itself. 
Click **Use Template** to start. Name the template and click **Next Step**.

{: .image-popup}
![Name Template](/templates/media-cashflow/name-template.png)

Now it's time to configure the template.

{: .image-popup}
![Flow](/templates/media-cashflow/flow.png)

1. **Data extractions** – in the first section, you will select one or multiple data sources (extractors) that will provide all available data. See more details in the section **Data Sources** below.

2. **Snowflake SQL** – prepares all data to be sent to the Data App.

3. **Data app deployment** – This data app (third section) visualizes the campaign spending across various advertising platforms. 
It displays both the total budget and the budget spend per client on different advertising platforms. Additionally,
the app provides users with the capability to input or modify budgets for specific clients and choose the advertising platforms 
for which the specific budget will be applied. These changes are promptly saved to storage and become accessible for subsequent data refreshes 
from advertising campaigns.

After authorising at least one data source, click **Configure** in the **Data App** box to run it. You will need to provide your Keboola Token to do so. 
Once you enter, you can save the configuration and start using the app.

{: .image-popup}
![Configure Data App](/templates/media-cashflow/configure-data-app.png)

## Data Sources
The following data sources are available:

[ECB Currency Rates](https://fixer.io/documentation)
[Facebook Ads](https://www.facebook.com/business/)
[Google Ads](https://ads.google.com/)
[LinkedIn Ads](https://business.linkedin.com/marketing-solutions/)
[Sklik](https://www.sklik.cz/)
[TikTok Ads](https://business-api.tiktok.com/portal/docs?id=1740302848100353)

## Authorizing Data Sources
To use a selected data source component, you must first authorize the data source. You need to use at least one of the following marketing data sources.

### Facebook Ads

{: .image-popup}
![Facebook Ads Data Source](/templates/media-cashflow/fb-ads-source.png)

Log into Facebook with redirection from this step and allow Keboola Connection to access the data.
From the list of accounts select the accounts from which you want to download data.

### Google Ads

{: .image-popup}
![Google Ads Data Source](/templates/media-cashflow/google-ads-source.png)

Authorize your Google account and select the period for extracting the data.

### LinkedIn Ads

{: .image-popup}
![LinkedIn Ads Data Source](/templates/media-cashflow/linkedin-ads-source.png)

Authorize your LinkedIn account and then fill in the start and end dates following the example.

### Sklik

{: .image-popup}
![Sklik Data Source](/templates/media-cashflow/sklik-source.png)

Authorize the Sklik account using the Sklik Api token and define a list of account IDs to download. Find more details in the [documentation](https://help.keboola.com/components/extractors/marketing-sales/sklik/). 

### TikTok Ads

{: .image-popup}
![TikTok Ads Data Source](/templates/media-cashflow/tiktok-ads-source.png)

To access data from your TikTok account, authorize your account and define rows you want to use. Find more details in the [documentation](https://bitbucket.org/kds_consulting_team/kds-team.ex-tiktok-ads/src/master/README.md). 

## Setting Up Data App

{: .image-popup}
![Setting Up Data App](/templates/media-cashflow/setting-up-app.png)

**Deployment Type** - Git repository is used for this Data App

**Data App Repository** - To run the App from the Template, just use the Git repository - you can use the one which is used as an example or you can use your own Git repository. In order to run the App successfully you need to fill in all necessary fields (Project URL, Username, Access Token, Branch, Main File Path). 

**Secrets** - To provide your app with environment variables or sensitive information like credentials, API keys etc., enter them as key value pairs in the section Secrets. These secrets will be injected into the secrets.toml file upon deployment of the app.

**Table/File Input Mapping** - Just select table or files in the input mapping section
(Re)Deploy Data App - once everything is set up, just click.

When you need to go back to modify or view the data app, you can find it under **Components** > **Data App**. Simply search for your data app.

## Using Data App

{: .image-popup}
![Using Data App](/templates/media-cashflow/using-data-app.png)

The data app combines budget plans and actual expenditures from various campaigns across different platforms using interactive Data App. This app allows you to monitor campaign spending effortlessly and filter expenses by clients. Moreover, you can conveniently adjust the budget allocated for each campaign, ensuring optimal resource allocation and enhanced campaign performance.
