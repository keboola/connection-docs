---
title: Google Analytics 4 (GA4)
description: This data source connector allows you to integrate your Google Analytics 4 data into the Keboola environment.
slug: 'components/extractors/marketing-sales/google-analytics'
redirect_from:
    - /extractors/marketing-sales/google-analytics/

---

This data source connector allows you to integrate your Google Analytics 4 data into the Keboola environment.
To do that, you will need a [Google Analytics account](https://analytics.google.com/analytics/web/) with at least one GA4 property.

:::caution[Universal Analytics Sunset]
Google discontinued Universal Analytics on July 1, 2024. The UA Reporting API and Multi-Channel Funnels API are no longer available.
This connector now works exclusively with **Google Analytics 4 (GA4)** via the [Data API](https://developers.google.com/analytics/devguides/reporting/data/v1).
:::

## Features
The Google Analytics connector uses the [Google Analytics Data API (v1)](https://developers.google.com/analytics/devguides/reporting/data/v1), which provides:

 - **Flexible metrics and dimensions** --- Query any combination of GA4 metrics and dimensions available in your property.

 - **Multiple date ranges** --- Get data in up to four date ranges in a single request, useful for period-over-period comparisons.

 - **Dimension and metric filters** --- Filter the report data server-side before it reaches Keboola.

## How Data Loading Works

There are two distinct "incremental" concepts in this connector:

| Concept | What it means | How it's controlled |
|---------|--------------|-------------------|
| **Incremental storage writes** | Data is always **upserted** into Keboola Storage tables using primary keys. Existing rows with matching keys are updated; new rows are appended. Old data is never deleted or replaced. | **Always on** — this is hardcoded in the connector and cannot be changed. |
| **Incremental date fetching** | The connector fetches only data **since the last successful run** instead of re-downloading a fixed date range each time. | **Optional** — controlled by the "Incremental load" checkbox in the date range settings. |

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Google Analytics** connector.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization).
Select the desired Google Analytics account and GA4 properties from which you would like to extract data.

![Screenshot - Intro Page](/components/extractors/marketing-sales/google-analytics/google-analytics-1.png)

![Screenshot - Select Properties](/components/extractors/marketing-sales/google-analytics/google-analytics-2.png)

## Create a New Query
Each query consists of metrics, dimensions, and a date range. Optionally, it can be filtered.

1. Name your output table in Storage, for example, `sessions_overview`.

2. From the metrics selector, choose the desired metrics (e.g., `sessions`, `totalUsers`, `screenPageViews`).

3. From the dimensions selector, choose dimensions (e.g., `date`, `sessionSource`).

4. Configure the date range (default is last 4 days).

5. Click **Test query** to preview results.

6. Save your query when you are satisfied with the results.

7. To run the extraction, click the "play" icon on the query list page.

## Date Ranges
A date range specifies a time window from which the data will be extracted.
You can use any expression compatible with the [PHP strtotime() function](https://www.php.net/manual/en/datetime.formats.php).

**Multiple date ranges** are useful when you want to compare metric performance across periods.
For example, you can compare sessions this month to the same period last year without downloading all historical data.

### Incremental Date Fetching
When you want to download only data that appeared since the previous extraction run, enable **Incremental load** in the date range settings. This sets the start date to the date of the last successful run.

:::note
**Multiple date ranges** and **Incremental load** cannot be used together. When incremental load is active, only one date range is allowed.
:::

## Anti-Sampling
The Google Analytics API does not always return precise data. Under certain circumstances, the data
returned is [sampled](https://support.google.com/analytics/answer/2637192?hl=en).
To work around this problem and get more precise results, choose the **DailyWalk**
anti-sampling algorithm. It divides the date range into daily chunks, making separate requests for each day.

You can configure anti-sampling in the query detail.

![Screenshot - Anti Sampling](/components/extractors/marketing-sales/google-analytics/google-analytics-5.png)

## Dimension and Metric Filters
Filters allow you to limit the data included in a report. For example, you can filter by a specific
country, traffic source, or device category.

Learn how to construct filters in the [GA4 Data API documentation](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/FilterExpression).

## Custom OAuth Credentials
To avoid hitting quota limits, you can use your own OAuth Client ID and Secret:

1. Visit the [Google API Console](https://console.developers.google.com/).
2. Select an existing project or create a new one.

![Screenshot - Google API Console - Project](/components/extractors/marketing-sales/google-analytics/google_console_project.png)

3. Enable the [Google Analytics Data API](https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com) and [Google Analytics Admin API](https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com).

![Screenshot - Google API Console - Enable API](/components/extractors/marketing-sales/google-analytics/google_console_enable.png)

4. Select the **Credentials** section from the menu on the left, click the **Create credentials** button and select **OAuth client ID**.

![Screenshot - Google API Console - Create Credentials](/components/extractors/marketing-sales/google-analytics/google_console_credentials.png)

5. Choose **Web Application**. Into **Authorized redirect URIs** insert:
    - `https://oauth.keboola.com/authorize/keboola.ex-google-analytics-v4/callback`
    - or `https://oauth.eu-central-1.keboola.com/authorize/keboola.ex-google-analytics-v4/callback`
    - or `https://oauth.north-europe.azure.keboola.com/authorize/keboola.ex-google-analytics-v4/callback`

6. Click **Create** and a popup window will display your new Client ID and Client Secret credentials.
7. Find your credentials in the list of available credentials. You should see something like this:

![Screenshot - Google API Console - Credentials Detail](/components/extractors/marketing-sales/google-analytics/google_console_detail.png)

8. You can now use these credentials in the **Custom Authorization** tab when authorizing the Google Analytics data source connector.

![Screenshot - KBC - Custom Authorization](/components/extractors/marketing-sales/google-analytics/google-analytics-6.png)
