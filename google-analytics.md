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
![Business Data Model](/templates/google-analytics/business-data-model.png)

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
