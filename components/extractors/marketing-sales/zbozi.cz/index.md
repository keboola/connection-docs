---
title: Zboží.cz
permalink: /components/extractors/marketing-sales/zbozi.cz/
redirect_from:
    - /extractors/marketing-sales/zbozi.cz/
---

* TOC
{:toc}

The Zboží.cz extractor fetches data from the [Zboží.cz e-shop API](https://api.zbozi.cz/). Specifically, each configuration row can be set up to extract any one of these 3 types of reports:
 - aggregated shop statistics,
 - shop statistics by item categories or
 - shop item statistics.

Most of the API methods require user authentication. The user authentication consists of a pair of a shop ID (ID provozovny) and a generated API key (API klíč). Both of these credentials can be obtained from the [Zboží.cz Admin interface](https://admin.zbozi.cz).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Zboží.cz** extractor.

### Global configuration

First open the Global Configuration:

{: .image-popup}
![Global Configuration opening](/components/extractors/marketing-sales/zbozi.cz/global_config_collapsed.png)

Then provide your Shop ID and API key:

{: .image-popup}
![API key and Shop ID entry](/components/extractors/marketing-sales/zbozi.cz/global_config.png)

Don't forget to save.

### Configure Reports (Configuration rows)
Now you can configure the reports to extract as configuration rows. First, **Add Row**:

{: .image-popup}
![Add Row](/components/extractors/marketing-sales/zbozi.cz/add_row.png)

Then select the type of report you want to extract, and, finally, set up the reporting period by specifying its start, end and granularity.

 - **Report type** (report_type) - Which report type you want to extract.
 - **Period start** (period_start) - Period start specification used to request the report. This can be formatted in various different ways (e.g. `2022-05-17 15:30:12`, `2 days ago`, `yesterday` and other formats supported by the [dateparser library](https://dateparser.readthedocs.io/en/latest/)). Has to be less than 400 days old. It is rounded down to previous midnight (including) in CET.
 - **Period end** (period_end) - Period start specification used to request the report. This can be formatted in various different ways (e.g. `2022-05-17 15:30:12`, `2 days ago`, `yesterday` and other formats supported by the [dateparser library](https://dateparser.readthedocs.io/en/latest/)). Has to be less than 400 days old. It is rounded up to next midnight (excluding) in CET.
 - **Granularity** (granularity) - What granularity should be used for the time dimension. This must be either of these:
    - `daily` to download a report with daily granularity,
    - `monthly` to download a report with monthly granularity or
    - `hourly` to download a report with hourly granularity. **NOTE** Available only for `Aggregated Shop Statistics` report
    - `entire_period` to extract the entire specified period as one report. **NOTE** Available only for `Shop by category statistics` or `shop item statistics` reports

{: .image-popup}
![Row configuration entry](/components/extractors/marketing-sales/zbozi.cz/row_config.png)

Once again: don't foget to save.

### Example configuration

Let's say you want to extract item statistics by day for both yesterday and the day before that, and combine them together into a single output table. In that case you would:
1. Set the **Report type** to `shop_item_statistics`,
2. the **Period start** to `2 days ago`,
3. the **Period end** to `1 day ago`, and
4. the **Granularity** to `daily`.

## Output
No matter what kind of report is being extracted, the output of each configuration row is one table with a hardcoded name. [Incremental loading](/storage/tables/#incremental-loading) is always enabled.

### Aggregated shop statistics
Aggregated shop statistics are extracted as a table called `shop_aggregated_stats` that contains all the fields [the JSON schema](https://api.zbozi.cz/#/statistics/get_v1_shop_statistics_aggregated) the API specifies flattned as columns (with the underscore `_` used as a separator), and one new columns `granularity` that contains the used granularity (same as in user configuration). The field/column `startTimestamp` that originally contains the starts of the given time periods as [Unix time](https://en.wikipedia.org/wiki/Unix_time) is translated into [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) encoded date and time strings.
<!-- 
The primary key is composed of these two columns: `startTimestamp`, and `granularity`.
 -->
### Shop statistics by category
Shop item statistics are extracted as a table called `shop_stats_by_category` that contains all the fields [the JSON schema](https://api.zbozi.cz/#/statistics/get_v1_shop_statistics_category) the API specifies flattned as columns (with the underscore `_` used as a separator), and two new columns `timestampFrom` and `timestampTo` that contain [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) encoded date and time strings of the start and end of the period of each report.

Unless `entire_period` granularity is specified, these will be [CET](https://en.wikipedia.org/wiki/Central_European_Time) or [CEST](https://en.wikipedia.org/wiki/Central_European_Summer_Time) midnights (for each day if the `daily` granularity is used). If `monthly` granularity is specified, these will be such midnights at the start of each month.
<!-- 
The primary key is composed of these three columns: `categoryId`, `timestampFrom` and `timestampTo`.
 -->
### Shop item statistics
Shop item statistics are extracted as a table called `shop_item_stats` that contains all the columns [the CSV schema](https://api.zbozi.cz/#/statistics/get_v1_shop_statistics_item_csv) the API specifies, and two new columns `timestampFrom` and `timestampTo` that contain [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) encoded date and time strings of the start and end of the period of each report.

Unless `entire_period` granularity is specified, these will be [CET](https://en.wikipedia.org/wiki/Central_European_Time) or [CEST](https://en.wikipedia.org/wiki/Central_European_Summer_Time) midnights (for each day if the `daily` granularity is used). If `monthly` granularity is specified, these will be such midnights at the start of each month.
<!-- 
The primary key is composed of these three columns: `itemId`, `timestampFrom` and `timestampTo`.
 -->

## API Limits
In the case of shop item statistics there is a limit of 50 requests per 24 hours. Make sure your extractor configuration(s) do not cause this limit to be exceeded. The code checks whether the batch of report requests required to process the current configuration row will exceed this limit and fails before enqueuing them if it would.
