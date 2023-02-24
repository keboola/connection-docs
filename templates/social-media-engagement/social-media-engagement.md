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
|---|---|---|---|---|---|
| likes | ✅ | ✅ | ✅ | ✅ | ✅ |
| comments | :x: | ✅ | :x: | :x: | ✅ |
| shares | ✅ | :x: | :x: | ✅ | :x: |
| views | :x: | :x: | :x: | :x: | ✅ |
| all_reactions |likes <br> shares| likes <br> comments | likes | likes <br> shares | likes <br> comments <br> favourites |

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

