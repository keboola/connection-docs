---
title: Social Media Engagement
permalink: /templates/social-media-engagement/
---

* TOC
{:toc}

With this flow, you can obtain aggregated engagement data from different social networks. The output is two tables—the first is table pages_engagement 
containing daily metrics for each social media platform and the second is posts_engagement containing all posts from selected social media.

**The flow, in a nutshell:**

- First, the Social Media Engagement source components will collect data from your selected social networks. Currently, these networks are available:
    
    - Facebook
    - Instagram
    - YouTube
    - LinkedIn
    - Twitter – has announced the end of the free API

- We then add NULL values if any columns are missing, convert dates to a standard format, and add information about the source's social network to the source column.

- Finally, the combined data will be exported to the destination tables.

## Output Tables

{: .image-popup}
![Output Table 1](/templates/social-media-engagement/output-table-1.png)

{: .image-popup}
![Output Table 2](/templates/social-media-engagement/output-table-2.png)

**Output table: pages_engagement**

Table containing daily overall engagement metrics for whole page from selected social media. Primary keys are date and social network.

| metric | Facebook | Instagram | LinkedIn | Twitter | YouTube |  
|---|---|---|---|---|---|
| page_followers | ✅ | ✅ | ✅ | ✅ | :x: |
| page_posts_impressions | ✅ | ✅ | ✅ | :x: | :x: |
| page_views_total | ✅ | ✅ | ✅ | :x: | :x: |


**Output table: posts_engagement**

Table containing engagement data for all posts from selected social media. 
Primary key is a uid composed from date, source social media and id of post withing the social media.

| metric | Facebook | Instagram | LinkedIn | Twitter | YouTube |  
| --- | --- | --- | --- | --- | --- |
| likes | ✅ | ✅ | ✅ | ✅ | ✅ |
| comments | :x: | ✅ | :x: | :x: | ✅ |
| shares | ✅ | :x: | :x: | ✅ | :x: |
| views | :x: | :x: | :x: | :x: | ✅ |
| all_reactions | likes <br> shares | likes <br> comments | likes | likes <br> shares | likes <br> comments <br> favourites |

## Availability of Historical Data

Each social network allows access to the history of page engagement differently:

- Facebook – maximum 93 days ago
- Instagram – maximum 30 days ago
- LinkedIn – without known limit
- Twitter – since the first run of a component 
- YouTube – currently not available in this template

## Data Sources

These data sources are available in Public Beta: 

- [Twitter](https://twitter.com/)
- [YouTube Channel](https://www.youtube.com/)
- [Facebook Page](https://www.facebook.com/business/tools/facebook-pages)
- [Instagram](https://www.instagram.com/)
- [LinkedIn](https://www.linkedin.com/)

## Data Destinations

These data destinations are available (click the links for detailed documentation): 

- [Snowflake database provided by Keboola](https://help.keboola.com/components/writers/database/snowflake/)
- [Snowflake database](https://www.snowflake.com/)
- [MySQL](https://help.keboola.com/components/writers/database/mysql/)
- [PostgreSQL](https://help.keboola.com/components/writers/database/postgresql/)
- [MSSQL](https://help.keboola.com/components/writers/database/mssql/)
- [Google BigQuery database](https://cloud.google.com/bigquery/) 
- [Google Sheets](https://www.google.com/sheets/about/)

## How to Use Template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the destination component.

First decide which data source and which data destination you want to use. Then select the corresponding template 
from the **Templates** tab in your Keboola Connection project. When you are done, click **+ Use Template**.

{: .image-popup}
![Add New Template](/templates/social-media-engagement/add-new-template.png)

This page contains information about the template. Click **+ Use Template** again.

{: .image-popup}
![Add Social Media Engagement](/templates/social-media-engagement/add-socmed-eng.png)

You’ll be asked to write a name for the template instance you are about to create. You can use the template as many times as you want 
and still keep everything organized.

{: .image-popup}
![Add Social Media Engagement - Template Name](/templates/social-media-engagement/socmed-eng-name.png)

After clicking **Next Step**, you will see the template builder. Fill in all needed credentials and 
perform the required OAuth authorizations. 

{: .image-popup}
![Social Media Engagement - Steps](/templates/social-media-engagement/socmed-eng-steps.png)

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration, and 
when it is done, you will see the newly created flow. 

Click **Run Template** and start building your visualizations a few minutes later. 

{: .image-popup}
![Social Media Engagement - Flows](/templates/social-media-engagement/socmed-eng-flow.png)

## Authorizing Data Sources

To use a selected data source component, you must first authorize the data source. 
You need to use at least one of the following marketing data sources. In addition, Google Analytics can be used to enrich the data.

### Facebook Pages
For the Facebook Page component, log in with Facebook and choose the page from which you want to get data. You can set the period 
from which you want to get data or keep the default 30 days. Continue by saving the configuration.

{: .image-popup}
![Facebook Pages Data Source](/templates/social-media-engagement/facebook-pages-data-source.png)

### Instagram Page
To access the data from Instagram, you need to have Instagram Business Account connected to the Facebook page used for authorization. 
You can set the period from which you want to get data or keep the default 30 days. Continue by saving the configuration.

{: .image-popup}
![Instagram Page Data Source](/templates/social-media-engagement/instagram-pages-data-source.png)

### LinkedIn Page
For LinkedIn Page component just authorize access with your account and select the page from which you would like to obtain data. You can set the period from which you want to get data, or keep the default 30 days. Continue by saving configuration.

{: .image-popup}
![LinkedIn Pages Data Source](/templates/social-media-engagement/linkedin-pages-data-source.png)

### Twitter Page
To access data from Twitter authorize the account and fill the user name.

{: .image-popup}
![Twitter Page Data Source](/templates/social-media-engagement/twitter-page-data-source.png)

### YouTube Channel
To access data from YouTube Channel, just authorize by Open Authentication and save the configuration.

{: .image-popup}
![YouTube Channel Data Source](/templates/social-media-engagement/youtube-channel-data-source.png)

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

### Missing Credentials to Snowflake Database 
If you see the error pictured below, you have probably forgotten to set up the Snowflake database. 

Click on the text under Configuration in the top left corner. This will redirect you to the Snowflake Database component.
Now follow the **Snowflake Database provided by Keboola** on the page **Authorizations/destinations**. 

Then go to the **Flows** tab and **Run** the flow again.  

{: .image-popup}
![Job - Snowflake](/templates/marketing-platforms/snowflake-job.png)