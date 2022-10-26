---
title: Advertising Platforms
permalink: /components/use-cases/advertising-platforms/
---

* TOC
{:toc}

With this end-to-end flow you can bring into Keboola Connection data from one or more marketing channels of your choice (Facebook Ads, LinkedIn Ads, Google Ads, and Bing Ads). 
After all the necessary tasks are performed on the data, you load the results into BigQuery. You can also enrich the data with Google Analytics.
 
**The flow, in a nutshell:**

- First, you will select one or multiple data source components that will provide all your available data about your campaigns.
 
- To enrich the marketing model with keywords, ad groups, and marketing transactions, you can also bring in your Google Analytics data (data about basic sessions and transactions).
 
- The data extracted from the ad platform or platforms will be placed into one output table containing basic information about campaigns, impressions, clicks, costs, and cost conversions.
 
- Then, optionally, Google Analytics session (new and returns), page views, and bounces will be added to the output table, and two new tables will be created for transactions and keyword ad groups.
 
- The data will be written into a selected destinations, for example Google Sheets account via the  Google Sheets destination component.

- Finally, you will return the entire flow (i.e., the sequence of all the prepared, above mentioned steps, in the correct order). All your selected source components, all data manipulations, and the Google Sheets destination component, will be processed.

## Business Data Model

![Business Data Model](/components/use-cases/advertising-platforms/business-data-model.jpg)

## Table Description

| Name | Description |
|---|---|
| ONLINE MARKETING TRANSACTIONS | contains a list of campaigns of each account |
| ONLINE MARKETING TRAFFIC | contains data about sessions, pageviews, bounces, and cpc of each campaign per day |
| KEYWORDS ADGROUP | contains a list of keywords and ad groups|
| ONLINE MARKETING | contains data about impressions, clicks, costs per clicks, and costs per conversions |

## Data Sources

These data sources are available in Public Beta: 

- [Bing Ads](https://ads.microsoft.com/)
- [LinkedIn Ads](https://business.linkedin.com/marketing-solutions/)
- [Facebook Ads](https://www.facebook.com/business/tools)
- [Google Analytics]()
- [Google Ads]()

The following data sources will be coming soon: 

- [Twitter Analytics]()
- [YouTube Analytics]()
- [TicToc Analytics]()
- [Instagram Advertising]()

## Data Destinations

These data destinations are available in Public Beta: 

- [Snowflake database provided by Keboola](/components/writers/database/snowflake/)
- [Snowflake database](https://www.snowflake.com/)
- [Google BigQuery database](https://cloud.google.com/bigquery/) 
- [Google Sheets](https://www.google.com/sheets/about/)

The following data destinations will be coming soon: 
- [GoodData](https://www.gooddata.com/)
- [Tableau](https://www.tableau.com/)
- [Redshift database](https://aws.amazon.com/redshift/)
- [Google Drive](https://www.google.com/drive/) 
- [Amazon S3](https://www.aws.amazon.com/)

## How to Use Template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the destination component.

First decide which data source and which data destination you want to use. Then select the corresponding template from the **Use Case** tab in your Keboola Connection 
project. When you are done, click **+ Use Template**.

![Add New Use Case](/components/use-cases/advertising-platforms/add-new-use-case.png)

This page contains information about the template. Click **+ Use Template** again.

![Add Ad Platforms to Google Sheets](/components/use-cases/advertising-platforms/ad-platforms-to-google-sheets.png)
