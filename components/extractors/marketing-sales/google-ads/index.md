---
title: Google Ads
permalink: /components/extractors/marketing-sales/google-ads/
redirect_from:
    - /extractors/marketing-sales/google-adwords-reports/
    - /components/extractors/marketing-sales/google-adwords-reports/

---

* TOC
{:toc}

This extractor allows you to import data from Google Ads.
If you do not have a Google Ads manager account, follow this [guide](https://support.google.com/google-ads/answer/7459399?hl=en) to set it up.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Google Ads** extractor.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 

To run the extractor, specify your [customer ID](https://support.google.com/google-ads/answer/1704344?hl=en).

{: .image-popup}
![Screenshot - Customer configuration](/components/extractors/marketing-sales/google-ads/google-ads-1.png)

To download a report, specify a [GAQL query](https://developers.google.com/google-ads/api/docs/query/overview),
through which you can customize the output of a [predefined report type](https://developers.google.com/google-ads/api/docs/reporting/overview). 
You can use the [Query Builder](https://developers.google.com/google-ads/api/fields/v11/overview_query_builder) to simplify the development of the query.

Optionally, you can specify the start (*since*) and end (*until*) dates of downloaded stats. 
The *Since*/*Until* parameter is parsed via the [strtotime function](https://www.php.net/manual/en/function.strtotime.php) and 
can be specified

- **absolutely** --- as a unix timestamp or in the `yyyy-mm-dd` format, or
- **relatively** --- e.g. `14 days ago` or `last month`.

In each GAQL query, pick columns to download from allowed report values, and the FROM clause from allowed report types.
You also need to specify the name of the query and destination table in Storage. 

**Important**: *customers* and *campaigns* are reserved names, thus cannot be used as table names.

Additionally, for each query, specify a list of columns to be used as a primary key. 
Use *Display Name* of the columns replace dot with upper case first letter
(for example, for campaign.id use campaignId and for metrics.clicks use metricsClicks).

## Example
To download a campaign report, use the following query `SELECT campaign.id, campaign.name, metrics.clicks, metrics.impressions FROM campaign` configuration:

{: .image-popup}
![Screenshot - Query configuration](/components/extractors/marketing-sales/google-ads/example-config.png)

This downloads the report into a `campaigns` table. The `campaign.id` column is listed as `campaignId` in the primary columns.

When running the above configuration, you get three tables in the output bucket:
`campaigns`, `customers` and `report-campaign`. Incremental loading is turned on, so on subsequent runs, new rows are appended.

### Customers 
This table is created automatically and contains a list of all associated customers, for instance:

| id         | descriptiveName | currencyCode | timeZone      |
|------------|-----------------|--------------|---------------|
| 1111111111 | mycompany       | CZK          | Europe/Prague |

### Campaigns
This table is created automatically and contains a list of all campaigns, for instance:

| customerId | id        | name        | status  | servingStatus |
|------------|-----------|-------------|---------|---------------|
| 1111111111 | 610580109 | Campaign #1 | ENABLED | SUSPENDED     |

| adServingOptimizationStatus | advertisingChannelType | startDate | endDate  |
|-----------------------------|------------------------|-----------|----------|
| OPTIMIZE                    | SEARCH                 | 20160614  | 20371230 |

### report-campaign
This table is created by the GAQL query you specified and contains the result of the defined GAQL query, for example:

| campaignId | campaignName | metricsClicks | metricsImpressions |
|------------|--------------|---------------|--------------------|
| 12345678   | jumped       | Ad Group #1   | Ad Group #2        |
| 90123456   | fox          | Ad Group #1   | Ad Group #2        |
| 78901234   | quick        | Ad Group #1   | Ad Group #2        |
| 56789012   | brown        | Ad Group #1   | Ad Group #2        |
