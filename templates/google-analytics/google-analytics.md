---
title: Google Analytics
permalink: /templates/google-analytics/
---

* TOC
{:toc}

With this end-to-end flow you can extract your updated data from Google Analytics and bring it into Keboola Connection. 
You can also import your Google Search Console data. After all the necessary tasks are performed on the data, you can transform the results into visualizations 
in any BI tool of your choice.

**The flow, in a nutshell:**

- First, the Google Analytics source component will collect data from your Google Analytics account, and the Google Search Console source component (if selected) 
will get your Google Search Console data.

- Then we will put your data into the requested shape, and the Snowflake destination component will load the results into a Snowflake database.

- Finally, you will schedule and run the entire flow (i.e., the sequence of all the prepared, above mentioned steps, in the correct order). 
The Google Analytics or Google Search Console source components (if selected), all data manipulations, and the Snowflake destination component, will be processed.

## Entity Relationship Diagram
An entity-relationship diagram is a specialized graphic that illustrates the relationships between entities in a data destination.

{: .image-popup}
![Business Data Model](/templates/google-analytics/erd-google-analytics.png)

### Table Description

| Name | Description |
|---|---|
| GA AD ANALYTICS | contains data about impressions, clicks, costs, sessions, bounces, pageviews of each campaign per day |
| GA DEMOGRAPHIC AUDIENCE | contains high level age/gender focused view of traffic (session) data |
| GA GEO AUDIENCE | contains geographical data that tells you who are your visitors coming to website and where are they coming from |
| GA PAGE BEHAVIOUR | contains data about visitors behaviour on the pages - pageviews, sessions, entrances and time spent on page |
| GA SITE STATISTICS | contains data about site statistics contains sessions, pageviews and also average time data (page load time, download time, redirection time, server connection time) per day |
| GA TRAFFIC SOURCE | contains data about traffic sources of each campaign and source per day (sessions, bounces, users, session duration and pageviews) |
| GSC RANKING | contains data about average ranking of each page per day |

## Data Sources
These data sources are available in Public Beta:

- [Google Analytics](https://analytics.google.com/analytics/web/)
- [Google Search Console](https://search.google.com/search-console/about)

## Data Destinations
These data destinations are available in Public Beta:

- [Snowflake database provided by Keboola](https://help.keboola.com/components/writers/database/snowflake/)
- [Snowflake database](https://www.snowflake.com/)
- [Google BigQuery database](https://cloud.google.com/bigquery/) 
- [Google Sheets](https://www.google.com/sheets/about/)

## How to Use Template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the destination component.

First decide which data source and which data destination you want to use. Then select the corresponding template 
from the **Templates** tab in your Keboola Connection project. When you are done, click **+ Use Template**.

{: .image-popup}
![Add New Template](/templates/google-analytics/add-new-template.png)

This page contains information about the template. Click **+ Use Template** again.

{: .image-popup}
![Add Google Analytics to Snowflake](/templates/google-analytics/add-google-analytics-to-snowflake.png)

You’ll be asked to write a name for the template instance you are about to create. You can use the template as many times as you want 
and still keep everything organized.

{: .image-popup}
![Google Analytics to Snowflake - Template Name](/templates/google-analytics/google-analytics-to-snowflake-name.png)

After clicking **Next Step**, you will see the template builder. Fill in all needed credentials and 
perform the required OAuth authorizations. 

**Important:** Make sure to follow all the steps very carefully to prevent the newly created flow from failing because of any user 
authorization problems. If you are struggling with this part, go to the section [Authorizing Destinations](/templates/google-analytics/authorizing-destinations/) below.

Follow the steps one by one and authorize at least one data source from the list. Finally, the destination must be authorized as well.

{: .image-popup}
![Google Analytics to Snowflake](/templates/google-analytics/google-analytics-to-snowflake-steps.png)

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration, and 
when it is done, you will see the newly created flow. 

Click **Run Template** and start building your visualizations a few minutes later. 

{: .image-popup}
![Ad Platforms to Google Sheets - Flows](/templates/google-analytics/google-analytics-to-snowflake-flow.png)

## Authorizing Data Sources

To use a selected data source component, you must first authorize the data source. 
In addition to Google Analytics, you can also add data from the Google Search Console. 

### Google Analytics

{: .image-popup}
![Google Analytics Data Source](/templates/google-analytics/google-analytics-data-source.png)

Authorize your Google account and select the period for extracting the data. The list will automatically appear after authorization.

### Google Search Console
Using this data source is optional.

{: .image-popup}
![Google  Data Search Console Data Source](/templates/google-analytics/google-search-console-data-source.png)

Authorize your Google Account and then fill in your domain.

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
2. Go there and click on **Snowflake Data Destination** to configure it. You will be redirected to the data destination configuration and asked to set up credentials. 
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

Click on the text under Configuration in the top left corner. This will redirect you to the Snowflake Database component.
Now follow the **Snowflake Database provided by Keboola** on the page **Authorizations/destinations**. 

Then go to the **Flows** tab and **Run** the flow again.  

{: .image-popup}
![Job - Snowflake](/templates/marketing-platforms/snowflake-job.png)
