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
need to specify an [AWQL query](https://developers.google.com/adwords/api/docs/guides/awql) through which
you can customize the output of a 
[predefined report type](https://developers.google.com/adwords/api/docs/appendix/reports). 
There are some specific instructions for 
[using AWQL with reports](https://developers.google.com/adwords/api/docs/guides/awql#using_awql_with_reports) and
[mapping of AWQL reports to the UI](https://developers.google.com/adwords/api/docs/guides/uireports)

Optionally you can specify the target *bucket* in storage and start date (*since*) of downloaded stats.
and end date (*until*) of downloaded stats.

In each AWQL query, you should pick columns to download from allowed report values and FROM clause from allowed report types.
You also need to specify name of the query and destination table in Storage (in the 
specified bucket). Note that *customers* and *campaigns* are reserved names, thus cannot be used as table names.

Additionally, for each query, you can specify list of columns to be used as primary key. You must use *Display Name* of the columns as defined in 
[reports types documentation](https://developers.google.com/adwords/api/docs/appendix/reports) and replace spaces with underscores 
(e.g. for CampaignId use Campaign_ID and for Date use Day)

{: .image-popup}
![Screenshot - Report column names](/extractors/google-adwords-reports/report_types.png)

### Example
To download a keyword performance report, you would use the following query configuration:

{: .image-popup}
![Screenshot - Query configuration](/extractors/google-adwords-reports/ui_queries.png)

This will download the report in to a table `keywords`. Note that the column `Id` is listed
as `Keyword_ID` in the primary columns, because that is 
[its display name](https://developers.google.com/adwords/api/docs/appendix/reports/keywords-performance-report#id).

When you run the above configuration, you will obtain three tables in the output bucket -
`campaigns`, `customers` and `keywords`. Note that the tables will be overwritten on each run,
incremental downloads are not supported.

#### campaigns
This table is created automatically and contains list of all campaigns in the used account, e.g.:

| customerId | id        | name        | status  | servingStatus | startDate |
|------------|-----------|-------------|---------|---------------|-----------|
| 1111111111 | 610580109 | Campaign #1 | ENABLED | SUSPENDED     | 20160614  |

| endDate  | adServingOptimizationStatus | advertisingChannelType | displaySelect |
|----------|-----------------------------|------------------------|---------------|
| 20371230 | OPTIMIZE                    | SEARCH                 |               |

#### customers 
This table is created automatically and contains list of all associated customers, e.g.:

| customerId | name      | companyName     | canManageClients | currencyCode | dateTimeZone  |
|------------|-----------|-----------------|------------------|--------------|---------------|
| 1111111111 | mycompany | My Company Ltd. |                  | CZK          | Europe/Prague |

#### keywords
This table is created by the AWQL query you specified and contains the result of the defined AWQL query, e.g.:

| Keyword_ID | Keyword | Ad_group    |
|------------|---------|-------------|
| 12345678   | jumped  | Ad Group #1 |
| 90123456   | fox     | Ad Group #1 |
| 78901234   | quick   | Ad Group #1 |
| 56789012   | brown   | Ad Group #1 |
