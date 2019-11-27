---
title: Sklik
permalink: /components/extractors/marketing-sales/sklik/
redirect_from:
    - /extractors/marketing-sales/sklik/
---

* TOC
{:toc}

The Sklik extractor fetches data from [Sklik](https://www.sklik.cz/). It downloads configured reports for all specified accounts.

Before you start, have a working [Sklik](https://www.sklik.cz/) account, and get an Sklik 
API [key](https://www.sklik.cz/generateToken). Select Settings from the drop-down menu next to your account name
in the top right corner of the screen. The API key is on the bottom of the Account Settings page. Copy it to your clipboard.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Sklik** extractor.

Then provide your API key:

{: .image-popup}
![Sklik API Key](/components/extractors/marketing-sales/sklik/sklik-1.png)

The extractor gets a list of all accessible accounts unless you restrict them explicitly.

### Configure Reports
Now configure your reports:

{: .image-popup}
![Sklik Report](/components/extractors/marketing-sales/sklik/sklik-2.png)

- **name** -- your name for the report; it will be used for the name of the table in Storage. *(Note that `accounts` is a reserved name thus it cannot be used as a report name.)*
- **resource** -- name of the resource on which you want the report to be created. Supported resources are all from [api.sklik.cz/drak](https://api.sklik.cz/drak/) which support the `createReport` and `readReport` methods (see [Blog post](https://blog.seznam.cz/2017/12/spravne-pouzivat-limit-offset-metodach-statisticke-reporty-api-drak/) for more information):
  - `ads`
  - `banners`
  - `campaigns`
  - `groups`
  - `intends`
  - `intends.negative`
  - etc.
- **restrictionFilter** -- Json object of the restriction filter configuration for the `createReport` API call.
  - `dateFrom` and `dateTo` are required values. If omitted, yesterday's and today's dates will be used.
  - The extractor allows you to use relative days in [these supported formats](https://www.php.net/manual/en/datetime.formats.relative.php).
- **displayOptions** -- Json object of the display options configuration for the `createReport` API call
- **displayColumns** -- array of columns to get
  - Column `id` as the identifier of the resource is downloaded every time.

***Warning:**
The main account used for access to the API is queried for campaigns and stats too. It is also saved to the table accounts
but has the columns access, relationName,relationStatus and relationType empty.
Prices are in halers so you need to divide by 100 to get prices in CZK.*

## API Limits
The current listing limit supported by the Sklik API is 100. A problem appears when `statGranularity` is added to `displayOptions`.
If you define `daily` granularity, the limit is divided by the number of days in the specified interval.
It means the interval between `dateFrom` and `dateTo` must not exceed 100 days.

## Report Tables

Each report creates two tables: one with metadata and one with actual stats by date.

The metadata table named after the report has a primary key `id` (the column `id` is added to `displayColumns` automatically). Dots (`.`) in nested values will be replaced with underscores (`_`). The table is complemented with the column `accountId` with the id of the account.

The stats table is also named after the report with the suffix `-stats` and has a primary key comprised of `id` and `date`.

For instance, if you configure to download the columns `name, clicks, impressions` from the resource `campaigns` and call the report `report1`, you will get the table `report1` with the columns `id, name` and the table `report1-stats` with the columns `id, date, impressions, clicks`.

## Example

Let's say we want to download daily stats for campaigns. The report will look like this:

- name: `report1`
- resource: `campaigns`
- restrictionFilter: `{ "dateFrom": "2018-07-01", "dateTo": "2018-07-03" }`
- displayOptions: `{ "statGranularity": "daily" }`
- displayColumns: `id, name, clicks, impressions`

The extractor will create the table `report1` which will look like:

|id|accountId|name|
|---|---|---|
|15001|123|Keboola.com - content|
|15002|123|Keboola.com - search|

And the table `report1-stats`:

|id|clicks|date|impressions|
|---|---|---|---|
|15001|0||0|
|15002|5|20180701|26|
|15002|0|20180702|10|
|15002|0|20180703|2|
