---
title: LinkedIn Pages 
permalink: /components/extractors/marketing-sales/linkedin-pages/
redirect_from:
    - /extractors/marketing-sales/linkedin-pages/
---

* TOC
{:toc}

This extractor downloads data from the [LinkedIn Pages API](https://learn.microsoft.com/en-us/linkedin/marketing) related to organizations, their posts, and statistics about performance of their pages, as well as tables of enumerated types used therein.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **LinkedIn Pages** extractor.

### Global Configuration
To configure this extractor, you need to authenticate with a **LinkedIn Profile** using OAuth. More info on this topic can be found in [LinkedIn API Documentation](https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access).

 - **Organization IDs (organizations)** - [OPT] Comma-separated list of organization IDs you wish to fetch data from, e.g., 123, 234. If left empty, data from all organizations will be fetched.

### Row Configuration
 - **Endpoints** (endpoints) - [REQ] Select the data you wish to download. Lifetime statistics provide current totals. Time-bound statistics retrieve data about the specified time range with daily granularity. This must be one of these:
    - **Page Statistics (Time-Bound)** to download time-bound [Organization Page Statistics](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/page-statistics?view=li-lms-2022-08&tabs=http). The time range is determined by Sync Options (see below).
    - **Page Statistics (Lifetime)** to download lifetime [Organization Page Statistics](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/page-statistics?view=li-lms-2022-08&tabs=http).
    - **Follower Statistics (Time-Bound)** to download time-bound [Organization Follower Statistics](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/follower-statistics?view=li-lms-2022-08&tabs=http). The time range is determined by Sync Options (see below).
    - **Follower Statistics (Lifetime)** to download lifetime [Organization Follower Statistics](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/follower-statistics?view=li-lms-2022-08&tabs=http).
    - **Share Statistics (Time-Bound)** to download time-bound [Organization Share Statistics](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/share-statistics?view=li-lms-2022-08&tabs=http). The time range is determined by Sync Options (see below).
    - **Share Statistics (Lifetime)** to download lifetime [Organization Share Statistics](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/share-statistics?view=li-lms-2022-08&tabs=http).
    - Posts to download data about posts, their comments, and their likes.
    - Enumerated Types to download tables of enumerated types used in other data tables.
    - Organizations to download data about organizations themselves.
 - **Sync Options (sync_options)** [REQ] - Options pertaining to only time-bound data extraction:
    - **Date From (date_from)** - [REQ] Date from which data is downloaded. Either date in `YYYY-MM-DD` format or dateparser string; i.e., `5 days ago`, `1 month ago`, `yesterday`, etc. You can also set this as `last run`, which will fetch data from the last run of the component; if no previous successful run exists, all data since LinkedIn launch (2003-05-05) are downloaded. Values always get rounded down to the beginning of the day.
    - **Date To (date_to)** - [REQ] Date to which data is downloaded. Either date in `YYYY-MM-DD` format or dateparser string; i.e., `5 days ago`, `1 week ago`, `now`, etc. Values always get rounded down to the beginning of the day.
 - **Destination (destination)** - [REQ] Options specifying how to save extracted data into Keboola Storage:
    - **Load Type (load_type)** - [REQ] If full load is used, the destination table will be overwritten every run. If incremental load is used, data will be upserted into the destination table.


**Configuration example:**

{: .image-popup}
![LinkedIn Pages - Global Configuration](/components/extractors/marketing-sales/linkedin-pages/linkedin-pages-1.png)
![LinkedIn Pages - Row Configuration](/components/extractors/marketing-sales/linkedin-pages/linkedin-pages-2.png)
