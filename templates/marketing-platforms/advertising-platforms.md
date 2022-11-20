---
title: Advertising Platforms
permalink: /templates/marketing-platforms/
---

* TOC
{:toc}

Using this template will give you an overview of the costs of all your campaigns in the marketing channels you use. All data will be stored in one table 
and one location. That means that you won't have to go to multiple systems and collect data manually anymore. Keboola Connection will do it for you.

With this end-to-end flow you can bring into Keboola Connection data from one or more marketing channels of your choice (Facebook Ads, LinkedIn Ads, Google Ads, 
and Bing Ads). After all the necessary tasks are performed on the data, you load the results into BigQuery. You can also enrich the data with Google Analytics.

**The flow, in a nutshell:**
{: .image-popup}
![Flow](/templates/marketing-platforms/adplatforms-flow.png)

- First, you will select one or multiple data source components (extractors) that will provide all your available data about your campaigns.
 
- To enrich the marketing model with keywords, ad groups, and marketing transactions, you can also bring in your Google Analytics data (data about basic sessions and transactions).
 
- The data extracted from the ad platform or platforms will be placed into one output table containing basic information about campaigns, impressions, clicks, costs, and cost conversions.
 
- Then, optionally, Google Analytics session (new and returns), page views, and bounces will be added to the output table, and two new tables will be created for transactions and keyword ad groups.
 
- The data will be written into a selected destinations, for example, your Google Sheets account via the Google Sheets destination component (writer).

- Finally, you will return the entire flow (i.e., the sequence of all the prepared, above mentioned steps, in the correct order). All your selected source components, all data manipulations, and the Google Sheets destination component, will be processed.

## Entity Relationship Diagram
An entity-relationship diagram is a specialized graphic that illustrates the relationships between entities in a data destination.

{: .image-popup}
![Business Data Model](/templates/marketing-platforms/business-data-model.png)

### Table Description

| Name | Description |
|---|---|
| ONLINE MARKETING | contains data about impressions, clicks, costs per clicks, and costs per conversions |
| ONLINE MARKETING TRANSACTIONS | contains a list of campaigns of each account |
| ONLINE MARKETING TRAFFIC | contains data about sessions, pageviews, bounces, and cpc of each campaign per day |
| KEYWORDS ADGROUP | contains a list of keywords and ad groups|

## Data Sources

These data sources are available in Public Beta: 

- [Bing Ads](https://ads.microsoft.com/)
- [LinkedIn Ads](https://business.linkedin.com/marketing-solutions/)
- [Facebook Ads](https://www.facebook.com/business/)
- [Google Analytics](https://analytics.google.com/analytics/web/)
- [Google Ads](https://ads.google.com/)

<!-- 
The following data sources will be coming soon: 

- [Twitter Analytics](https://analytics.twitter.com/about/)
- [YouTube Analytics](https://developers.google.com/youtube/reporting)
- [TicToc Analytics](https://ads.tiktok.com/help/)
- [Instagram Advertising](https://www.facebook.com/business/tools/ads-manager/)
 -->
 
## Data Destinations

These data destinations are available in Public Beta: 

- [Snowflake database provided by Keboola](https://help.keboola.com/components/writers/database/snowflake/)
- [Snowflake database](https://www.snowflake.com/)
- [Google BigQuery database](https://cloud.google.com/bigquery/) 
- [Google Sheets](https://www.google.com/sheets/about/)

<!-- 
The following data destinations will be coming soon: 
- [GoodData](https://www.gooddata.com/)
- [Tableau](https://www.tableau.com/)
- [Redshift database](https://aws.amazon.com/redshift/)
- [Google Drive](https://www.google.com/drive/) 
- [Amazon S3](https://www.aws.amazon.com/)
 -->
 
## How to Use Template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the destination component.

First decide which data source and which data destination you want to use. Then select the corresponding template 
from the **Use Case** tab in your Keboola Connection project. When you are done, click **+ Use Template**.

{: .image-popup}
![Add New Use Case](/templates/marketing-platforms/add-new-use-case.png)

This page contains information about the template. Click **+ Use Template** again.

{: .image-popup}
![Add Ad Platforms to Google Sheets](/templates/marketing-platforms/add-adplatforms-to-google-sheets.png)

You’ll be asked to write a name for the template instance you are about to create. You can use the template as many times as you want 
and still keep everything organized.

{: .image-popup}
![Ad Platforms to Google Sheets - Template Name](/templates/marketing-platforms/adplatforms-to-google-sheets-name.png)

After clicking **Next Step**, you will see the template builder. Fill in all needed credentials and 
perform the required OAuth authorizations. 

**Important:** Make sure to follow all the steps very carefully to prevent the newly created flow failing because of any user 
authorization problems. If you are struggling with this part, go to the section [Authorizing Destinations](/templates/marketing-platforms/authorizing-destinations/) below.

Follow the steps one by one and authorize at least one data source from the list. Finally, the destination must be authorized as well.

> Please, read carefully the instructions within this step. If you encounter any difficulties, go to the section 
> [Authorizing Destinations](/templates/marketing-platforms/authorizing-destinations/) below.

{: .image-popup}
![Ad Platforms to Google Sheets](/templates/marketing-platforms/adplatforms-to-google-sheets.png)

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration, and 
when it is done, you will see the newly created flow. 

Click **Run Use Case** and start building your visualizations a few minutes after. 

{: .image-popup}
![Ad Platforms to Google Sheets - Flows](/templates/marketing-platforms/adplatforms-to-google-sheets-flow.png)

## Authorizing Data Sources
To use a selected data source component, you must first authorize the data source. 

Using at least one data source is required. Google Analytics can be used in addition to your selected data source/-s.

*Note: Using the following marketing data sources is optional. Select the ones you wish to use.*

### Facebook Ads

{: .image-popup}
![Facebook Ads Data Source](/templates/marketing-platforms/facebook-ads-data-source.png)

Log into Facebook with redirection from this step and allow Keboola Connection to access the data. 

From the list of accounts select the accounts from which you want to download data.

### Bing Ads

{: .image-popup}
![Bing Ads Data Source](/templates/marketing-platforms/bing-ads-data-source.png)

First, authorize your Google account. To configure this source component, you must also have a Microsoft account
where you find the [Developer Token]](https://learn.microsoft.com/en-us/) (Developer Account).

The Account ID (aid) and Customer ID (cid) can be found in the URL of your campaign (https://ui.ads.microsoft.com/campaign/vnext/campaigns?aid=XXXXXXXXX&cid=XXXXXXXXX&uid=XXXXXXXXX).

### LinkedIn Ads

{: .image-popup}
![LinkedIn Ads Data Source](/templates/marketing-platforms/linkedin-ads-data-source.png)

Authorize your LinkedIn account and then fill in the start and end dates according to the example.

### Google Ads

{: .image-popup}
![Google Ads Data Source](/templates/marketing-platforms/google-ads-data-source.png)

Authorize your Google account and select the period for extracting the data.

### Google Analytics

{: .image-popup}
![Google Analytics Data Source](/templates/marketing-platforms/google-analytics-data-source.png)

Authorize your Google account and select the period for extracting the data.

## Authorizing Data Destinations
To create a working flow, you must select at least one data destination.

### BigQuery Database

{: .image-popup}
![BigQuery Destination](/templates/marketing-platforms/bigquery-destination.png)

To configure the destination component, you need to set up a [Google Service Account](https://console.cloud.google.com/iam-admin/serviceaccounts) and create a new JSON key.

A detailed guide is available [here](https://help.keboola.com/components/writers/database/bigquery/).

### Google Sheets

{: .image-popup}
![Google Sheets Destination](/templates/marketing-platforms/google-sheets-destination.png)

Authorize your Google account.

Duplicate the sheet into your Google Drive and paste the file ID back to Keboola Connection. It is needed for correct mapping 
in your duplicated Google sheet. 

<!-- 
*Note: We are working on automatization. In the future, you won't have to duplicate the sheet by yourself, we will do that for you.*
 -->

### Snowflake Database Provided by Keboola

If you do not have your own data warehouse, follow the instructions and we will create a database for you: 

1. After clicking **Save**, the template will be used in your project. You will see a flow. 
2. Go there and click on **Snowflake Data Destination** to configure it. You will be redirected to the data destination configuration and asked to set up the credentials. 
3. Select **Keboola Snowflake database**. 
4. Then go back to the flow and click **Run**. 

{: .image-popup}
![DWH Provided by Keboola](/templates/marketing-platforms/keboola-dwh-instructions1.png)
![DWH Provided by Keboola](/templates/marketing-platforms/keboola-dwh-instructions2.png)
![DWH Provided by Keboola](/templates/marketing-platforms/keboola-dwh-instructions3.png)
![DWH Provided by Keboola](/templates/marketing-platforms/keboola-dwh-instructions4.png)

Everything is set up.

### Snowflake Database

If you want to use your own Snowflake database, you must provide the host name (account name), user name, password, database name, 
schema, and a [warehouse](https://docs.snowflake.net/manuals/user-guide/warehouses.html).

{: .image-popup}
![Snowflake Destination](/templates/marketing-platforms/snowflake-destination.png)

We highly recommend that you create a dedicated user for the destination component in your Snowflake database. Then you must provide 
the user with access to the Snowflake [Warehouse](https://docs.snowflake.net/manuals/user-guide/warehouses.html). 

**Warning:** Keep in mind that Snowflake is **case sensitive** and if identifiers are not quoted, they are converted to upper case. 
So if you run, for example,  a query CREATE SCHEMA john.doe;, you must enter the schema name as DOE in the destination component configuration.

More info [here](https://help.keboola.com/components/writers/database/snowflake/).

## Most Common Errors
Before turning to the Keboola support team for help, make sure your error is not a common problem that can be solved without our help.

### Missing Credentials to Snowflake Database 
If you see the error pictured below, you have probably forgotten to set up the Snowflake database. 

Click on the text under Configuration in the top left corner. This will redirect you to the Snowflake Database component.
Now follow the **Snowflake Database provided by Keboola** on the page **Authorizations/destinations**. 

Then go to the **Flows** tab and **Run** the flow again.  

{: .image-popup}
![Job - Snowflake](/templates/marketing-platforms/snowflake-job.png)

 
