---
title: Google Analytics
permalink: /extractors/marketing-sales/google-analytics/
redirect_from:
  - /extractors/google-analytics/
---

* TOC
{:toc}

This extractor allows you to integrate your Google Analytics data into the KBC environment.
To do that, you will need a Google Analytics account. If you do not have one, create it [here](https://analytics.google.com).

## Features
Google Analytics Extractor works with the newest version of the [Google Analytics Reporting API - V4](https://developers.google.com/analytics/devguides/reporting/core/v4/),
and provides the following key features:

 - **Metric expressions**
  The API allows you to request not only built-in metrics but also combinations of metrics expressed in mathematical operations. For example, you can use the expression ga:goal1completions/ga:sessions to request the goal completions per number of sessions.

 - **Multiple date ranges**
  The API allows you to get data in two date ranges in a single request.

 - **Multiple segments**
  The API enables you to get multiple segments in a single request.


## Create New Configuration
Find Google Analytics in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/extractors/google-analytics/ui_new_config.png)

**Authorize Account** to be redirected to Google, and authorize the extractor to access your Google Analytics data.

Select Google Analytics account and choose profiles (views) from which you would like to extract data.

{: .image-popup}
![Screenshot - Select profiles](/extractors/google-analytics/ui_profiles.png)

## Create New Query
Each query consists of metrics, dimensions and a date range. Optionally, it can be filtered by a filter expression or segment.
Let's create a simple query with some basic metrics such as Sessions, Users and Pageviews.

 1. Name your query, for example "Audience".

 2. From the metrics selector, choose the following metrics: `ga:sessions`, `ga:users`, `ga:pageviews`.

 3. From the dimensions selector, choose the `ga:date` dimension.

 4. Leave the date range on default (last 5 days).

 5. See the query results by hitting the `Test query` button.

 6. Now you see sessions, users and pageviews of the last five days sliced by date.

 7. When you are happy with the results, save your query.

 8. To store the results to Storage, click the "play" icon on the query list page.

{: .image-popup}
![Screenshot - Create New Query](/extractors/google-analytics/ui_new_query.png)

## Date Ranges
A date range specifies a time window from which the data will be extracted.
You can use any expression compatible with the [PHP strtotime() function](http://php.net/manual/en/datetime.formats.php).

**Multiple date ranges** are useful, for example, when you want to compare metric performance to the previous date range.
Let's say you want to see Sessions by month, compared to the same month last year.
Of course, you can download all the data from last year, but with this approach, you can download just the data you need.

## Filters
Filters allow you to limit and modify the data that is included in a view. For example, you can use filters to exclude traffic from particular IP addresses, focus on a specific subdomain or directory, or convert dynamic page URLs into readable text strings.
If interested, read more about [how to use filters](https://support.google.com/analytics/answer/1033162).

Learn how to [construct a filter expression](https://developers.google.com/analytics/devguides/reporting/core/v3/reference#filters).

## Segments
A segment is a subset of your Analytics data. For example, of your entire set of users,
one segment might be users from a particular country or city.
Another segment might be users who purchase a particular line of products or who visit a specific part of your site.
[Read more](https://support.google.com/analytics/answer/3123951?hl=en).

**Important:** When you want to use segments, use the `ga:segments` dimension.
You will have to type it in, however, because it is not in the option list of dimensions.

## Custom Dimensions and Metrics
It is possible to use custom dimensions and metrics.
Although they are not listed in the selector options, you can type them in manually.
Insert the dimension or metric ID in the format of `ga:metricXX` or `ga:dimensionXX` where XX is a number, for example `ga:metric1`.

You can find the IDs on the Google Analytics page:

{: .image-popup}
![Screenshot - Custom metric ID](/extractors/google-analytics/ga_custom_metrics.png)
