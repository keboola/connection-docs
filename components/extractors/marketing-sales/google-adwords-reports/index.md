---
title: Google AdWords Reports
permalink: /components/extractors/marketing-sales/google-adwords-reports/
redirect_from:
    - /extractors/marketing-sales/google-adwords-reports/

---

* TOC
{:toc}

This extractor allows you to import data from Google AdWords reports.
If you do not have a Google AdWords account, create a [test account](https://developers.google.com/adwords/api/docs/guides/first-api-call#create_test_accounts).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Google AdWords Reports** extractor.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 

To run the extractor, specify your [customer ID](https://support.google.com/adwords/answer/1704344?hl=en).

{: .image-popup}
![Screenshot - Customer configuration](/components/extractors/marketing-sales/google-adwords-reports/google-adwords-reports-1.png)

To download a report, specify an [AWQL query](https://developers.google.com/adwords/api/docs/guides/awql),
through which you can customize the output of a [predefined report type](https://developers.google.com/adwords/api/docs/appendix/reports). 
There are some specific instructions for 
[using AWQL with reports](https://developers.google.com/adwords/api/docs/guides/awql#using_awql_with_reports) and
[mapping of AWQL reports to the UI](https://developers.google.com/adwords/api/docs/guides/uireports).

Optionally, you can specify the target *bucket* in Storage and the start (*since*) and end (*until*) dates of downloaded stats. 
The *Since*/*Until* parameter is parsed via the [strtotime function](https://www.php.net/manual/en/function.strtotime.php) and 
can be specified

- **absolutely** --- as a unix timestamp or in the `yyyy-mm-dd` format, or
- **relatively** --- e.g. `14 days ago` or `last month`.

In each AWQL query, pick columns to download from allowed report values, and the FROM clause from allowed report types.
You also need to specify the name of the query and destination table in Storage (in the specified bucket). 

**Important**: *customers* and *campaigns* are reserved names, thus cannot be used as table names.

Additionally, for each query, specify a list of columns to be used as a primary key. 
Use *Display Name* of the columns as defined in the [reports types documentation](https://developers.google.com/adwords/api/docs/appendix/reports) and replace spaces with underscores 
(for example, for CampaignId use Campaign_ID and for Date use Day).

{: .image-popup}
![Screenshot - Report column names](/components/extractors/marketing-sales/google-adwords-reports/report_types.png)

## Example
To download a keyword performance report, use the following query `SELECT Id, Criteria, AdGroupName FROM KEYWORDS_PERFORMANCE_REPORT` configuration:

{: .image-popup}
![Screenshot - Query configuration](/components/extractors/marketing-sales/google-adwords-reports/google-adwords-reports-2.png)

This downloads the report into a `keywords` table. The `Id` column is listed as `Keyword_ID` in the primary columns 
because that is [its display name](https://developers.google.com/adwords/api/docs/appendix/reports/keywords-performance-report#id).

When running the above configuration, you get three tables in the output bucket:
`campaigns`, `customers` and `keywords`. Incremental loading is turned on, so on subsequent runs, new rows are appended.

### Campaigns
This table is created automatically and contains a list of all campaigns in the used account, for instance:

| customerId | id        | name        | status  | servingStatus | startDate |
|------------|-----------|-------------|---------|---------------|-----------|
| 1111111111 | 610580109 | Campaign #1 | ENABLED | SUSPENDED     | 20160614  |

| endDate  | adServingOptimizationStatus | advertisingChannelType | displaySelect |
|----------|-----------------------------|------------------------|---------------|
| 20371230 | OPTIMIZE                    | SEARCH                 |               |

### Customers 
This table is created automatically and contains a list of all associated customers, for instance:

| customerId | name      | companyName     | canManageClients | currencyCode | dateTimeZone  |
|------------|-----------|-----------------|------------------|--------------|---------------|
| 1111111111 | mycompany | My Company Ltd. |                  | CZK          | Europe/Prague |

### Keywords
This table is created by the AWQL query you specified and contains the result of the defined AWQL query, for example:

| Keyword_ID | Keyword | Ad_group    |
|------------|---------|-------------|
| 12345678   | jumped  | Ad Group #1 |
| 90123456   | fox     | Ad Group #1 |
| 78901234   | quick   | Ad Group #1 |
| 56789012   | brown   | Ad Group #1 |
