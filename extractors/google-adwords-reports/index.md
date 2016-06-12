---
title: Google Adwords Reports
permalink: /extractors/google-adwords-reports/
---

* TOC
{:toc}

This extractor allows you to extract data from Google AdWords reports.
Before you start, you need to 
[obtain a Google Adwords API developer token](https://developers.google.com/adwords/api/docs/guides/signup#token_review_team_has_approved_my_developer_token) 
and your Google AdWords [customer ID](https://support.google.com/adwords/answer/1704344?hl=en).

If you don't have an account, you can create a [test account](https://developers.google.com/adwords/api/docs/guides/first-api-call#create_test_accounts).

## Create New Configuration

Create new configuration and give it some name

{: .image-popup}
![Screenshot - Create configuration](/extractors/google-adwords-reports/ui_create_config.png)

When you the configuration is created, you need to authorize the extractor to access your AdWords 
reports. Clicking on the button will redirect you to Google and ask for authorization.

{: .image-popup}
![Screenshot - Create configuration](/extractors/google-adwords-reports/ui_authorize_config.png)

## Configuration
You must specify your *developer token* and *customer id* to run the extractor. To download a report, you 
need to specify an [AWQL query](https://developers.google.com/adwords/api/docs/guides/awql) for downloading Ad-hoc report. 
Optionally you can specify the target *bucket* in storage and start date (*since*) of downloaded stats.
and end date (*until*) of downloaded stats.

In each AWQL query, you should pick columns to download from allowed report values and FROM clause from allowed report types.
You also need to name each query. Name of query will be used as the name of the table in Storage (in the 
specified bucket). Note that *customers* and *campaigns* are reserved names, thus cannot be used as query names.

Additionally, for each query, you can specify array of columns to be used as primary key. You must use Display Name of the columns as defined in 
[reports types documentation](https://developers.google.com/adwords/api/docs/appendix/reports) and replace spaces with underscores 
(e.g. for CampaignId use Campaign_ID and for Date use Day)

{: .image-popup}
![Screenshot - Report column names](/extractors/google-adwords-reports/report_types.png)
