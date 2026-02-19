---
title: Google Analytics 4
permalink: /flows/templates/google-analytics4/
redirect_from:
    - /templates/google-analytics4/
---

* TOC
{:toc}

Using the Google Analytics 4 template will provide you with insights into site activities: the length of visits, the number of pages seen per visit, the 
bounce rate, and many other statistics, which you can see in time or by the traffic source. You can also enrich your Google Analytics data with 
Google Search Console data. This will show you the average rank of your page in time.
After all the necessary tasks are performed on the data, you can load the results into the data destination of your choice or use a data app for visualization.

**The flow, in a nutshell:**

- First, the Google Analytics 4 data source connector will collect data from your Google Analytics account, and the Google Search Console data source connector (if selected) 
will get your Google Search Console data.

- Then we will put your data into the requested shape, and the selected data destination connector will load the results into your database.

- Finally, you will schedule and run the entire flow (i.e., the sequence of all the prepared, above mentioned steps, in the correct order). 
The Google Analytics 4 or Google Search Console data source connectors (if selected), all data manipulations, and the data destination connector, will be processed.

## Entity Relationship Diagram
An entity-relationship diagram is a specialized graphic that illustrates the relationships between entities in a data destination.

{: .image-popup}
![Business Data Model](/flows/templates/google-analytics4/ga4-erd.png)

## Table Description

| Name | Description |
|---|---|
| GA4 AD ANALYTICS | contains data about impressions, clicks, costs, sessions, conversions, bounces, and pageviews of each campaign per day |
| GA4 AUDIENCE | contains aggregated data about set audiences, i.e., active, new or total users, sessions, average session duration, screen page views, etc.|
| GA4 DEMOGRAPHIC AUDIENCE | contains a high-level age/gender focused view of traffic (session) data |
| GA4 EVENT | contains aggregated data about events, i.e., count, value, total users, active users, new users |
| GA4 GEO AUDIENCE | contains geographical data that tells you who your visitors coming to website are and where they are coming from |
| GA4 PAGE BEHAVIOUR | contains data about visitor behaviour on the pages – pageviews, sessions, entrances, and time spent on a page |
| GA4 TRAFFIC SOURCE | contains data about traffic sources of each campaign and source per day (sessions, bounces, users, session duration, and pageviews) |
| GSC RANKING | contains data about average ranking of each page per day |

## Data Sources
These data sources are available in Public Beta:

- [Google Analytics 4](https://analytics.google.com/analytics/web/)
- [Google Search Console](https://search.google.com/search-console/about)

## Data Destinations
These data destinations are available in Public Beta:

- [Snowflake database provided by Keboola](https://help.keboola.com/components/writers/database/snowflake/)
- [Snowflake database](https://www.snowflake.com/)
- [Google BigQuery database](https://cloud.google.com/bigquery/) 
- [Google Sheets](https://www.google.com/sheets/about/)
- [PostgreSQL](https://www.postgresql.org/)
  
## How to Use Template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the data destination connector.

Select the template from the **Templates** tab in your Keboola project. When you are done, click **+ Use Template**.

{: .image-popup}
![Add New Template](/flows/templates/google-analytics4/ga4-add-new-template.png)

This page contains information about the template. Click **+ Set Up Template**.

{: .image-popup}
![Google Analytic 4 - Set Up Template](/flows/templates/google-analytics4/ga4-set-up-template.png)

You’ll be asked to write a name for the template instance you are about to create. You can use the template as many times as you want 
and still keep everything organized.

{: .image-popup}
![Google Analytics 4 - Template Name](/flows/templates/google-analytics4/ga4-template-name.png)

After clicking **Set Up Template** again, you will see the template builder. Fill in all needed credentials and 
perform the required OAuth authorizations. 

**Important:** Make sure to follow all the steps very carefully to prevent the newly created flow from failing because of any user 
authorization problems. If you are struggling with this part, go to the section [Authorizing Data Destinations](/flows/templates/google-analytics4/#authorizing-data-destinations) below.

Follow the steps one by one and authorize the Google Analytics 4 data source and, optionally, the Google Search Console data source. If you want to upload the data to the database, choose one (or more) of the destinations and authorize it.

{: .image-popup}
![Google Analytics 4 - Flow](/flows/templates/google-analytics4/ga4-flow.png)

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration, and 
when it is done, you will see the newly created flow. 

Click **Run Template** and start building your visualizations a few minutes later. 

## Authorizing Data Sources

To use a selected data source connector, you must first authorize the data source. 
In addition to Google Analytics, you can also add data from the Google Search Console. 

### Google Analytics 4

{: .image-popup}
![Google Analytics 4 Data Source](/flows/templates/google-analytics4/ga4-source.png)

Authorize your Google account and select the period for extracting the data. The list of Google Analytics Profiles will automatically appear after the authorization.

### Google Search Console
Using this data source is optional.

{: .image-popup}
![Google  Data Search Console Data Source](/flows/templates/google-analytics4/google-search-console-data-source.png)

Authorize your Google Account and then fill in your domain.

## Authorizing Data Destinations
When creating a working flow, you can select one or more data destinations.

### BigQuery Database

{: .image-popup}
![BigQuery Destination](/flows/templates/google-analytics4/bigquery-destination.png)

To configure the data destination connector, you need to set up a [Google Service Account](https://console.cloud.google.com/iam-admin/serviceaccounts) and create a new JSON key.

A detailed guide is available [here](https://help.keboola.com/components/writers/database/bigquery/).

### Google Sheets

{: .image-popup}
![Google Sheets Destination](/flows/templates/marketing-platforms/google-sheets-destination.png)

Authorize your Google account.

Duplicate the sheet into your Google Drive and paste the file ID back to Keboola. It is needed for correct mapping 
in your duplicated Google sheet. 

<!-- 
*Note: We are working on automatization. In the future, you won't have to duplicate the sheet by yourself, we will do that for you.*
 -->

### Snowflake Database Provided by Keboola

If you do not have your own data warehouse, follow the instructions and we will create a database for you: 

1. Configure the Snowflake destination and click **Save Configuration**.
2. After clicking **Save**, the template will be used in your project. You will see a flow. 
3. Go there and click on **Snowflake Data Destination** to configure it. You will be redirected to the data destination configuration and asked to set up credentials. 
4. Select **Keboola Snowflake database**. 
5. Then go back to the flow and click **Run**. 

{: .image-popup}
![DWH Provided by Keboola](/flows/templates/google-analytics4/keboola-dwh-instructions1.png)
![DWH Provided by Keboola](/flows/templates/google-analytics4/keboola-dwh-instructions2.png)
![DWH Provided by Keboola](/flows/templates/google-analytics4/keboola-dwh-instructions3.png)
![DWH Provided by Keboola](/flows/templates/google-analytics4/keboola-dwh-instructions4.png)

Everything is set up.

### Snowflake Database

If you want to use your own Snowflake database, you must provide the host name (account name), user name, password, database name, 
schema, and a [warehouse](https://docs.snowflake.com/en/user-guide/warehouses).

{: .image-popup}
![Snowflake Destination](/flows/templates/google-analytics4/snowflake-destination.png)

We highly recommend that you create a dedicated user for the data destination connector in your Snowflake database. Then you must provide 
the user with access to the Snowflake [Warehouse](https://docs.snowflake.com/en/user-guide/warehouses). 

**Warning:** Keep in mind that Snowflake is **case sensitive** and if identifiers are not quoted, they are converted to upper case. 
So if you run, for example,  a query CREATE SCHEMA john.doe;, you must enter the schema name as DOE in the data destination connector configuration.

More info [here](https://help.keboola.com/components/writers/database/snowflake/).

## Most Common Errors
Before turning to the Keboola support team for help, make sure your error is not a common problem that can be solved without our help.

Click on the text under Configuration in the top left corner. This will redirect you to the Snowflake Database connector.
Now follow the **Snowflake Database provided by Keboola** on the page **Authorizations/destinations**. 

Then go to the **Flows** tab and **Run** the flow again.  

{: .image-popup}
![Job - Snowflake](/flows/templates/google-analytics4/snowflake-job.png)
