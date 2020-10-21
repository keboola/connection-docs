---
title: Google Analytics
permalink: /components/extractors/marketing-sales/google-analytics/
redirect_from:
    - /extractors/marketing-sales/google-analytics/

---

* TOC
{:toc}

This extractor allows you to integrate your Google Analytics data into the Keboola Connection environment.
To do that, you will need a [Google Analytics account](https://analytics.google.com/analytics/web/).

## Features
The Google Analytics extractor works with the newest version of the [Google Analytics Reporting API - V4](https://developers.google.com/analytics/devguides/reporting/core/v4/)
and provides the following key features:

 - **Metric expressions** --- The API allows you to request not only built-in metrics but also combinations of metrics expressed in mathematical operations. For example, you can use the expression `ga:goal1completions/ga:sessions` to request the goal completions per number of sessions.

 - **Multiple date ranges** --- The API allows you to get data in two date ranges in a single request.

 - **Multiple segments** --- The API enables you to get multiple segments in a single request.
 
**Important:** Data is always imported incrementally.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Google Analytics** extractor.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 
Select the desired Google Analytics account and profiles (views) from which you would like to extract data.

{: .image-popup}
![Screenshot - Intro Page](/components/extractors/marketing-sales/google-analytics/google-analytics-1.png)

{: .image-popup}
![Screenshot - Select Profiles](/components/extractors/marketing-sales/google-analytics/google-analytics-2.png)

## Create New Query
Each query consists of metrics, dimensions and a date range. Optionally, it can be filtered by a filter expression or a segment.
Let's create a simple query with some basic metrics such as Sessions, Users and Pageviews.

{: .image-popup}
![Screenshot - Create New Query](/components/extractors/marketing-sales/google-analytics/google-analytics-3.png)

 1. Name your query, for example, "Audience".

 2. From the metrics selector, choose the following metrics: `ga:sessions`, `ga:users`, `ga:pageviews`.

 3. From the dimensions selector, choose the `ga:date` dimension.

 4. Leave the date range on default (last 4 days).

 5. See the query results by hitting the `Test query` button.

 6. Now you see sessions, users, and pageviews of the last five days sliced by date.

 7. When you are happy with the results, save your query.

 8. To store the results to Storage, click the "play" icon on the query list page.

{: .image-popup}
![Screenshot - Query Details](/components/extractors/marketing-sales/google-analytics/google-analytics-4.png)

## Date Ranges
A date range specifies a time window from which the data will be extracted.
You can use any expression compatible with the [PHP strtotime() function](https://www.php.net/manual/en/datetime.formats.php).

**Multiple date ranges** are useful, for example, when you want to compare metric performance to the previous date range.
Let's say you want to see Sessions by month, compared to the same month last year.
Of course, you can download all the data from last year, but with this approach, you can download just the data you need.

## Anti-Sampling
The Google Analytics API does not always return precise data. Under certain circumstances, the data 
returned is [sampled](https://support.google.com/analytics/answer/2637192?hl=en).
To work around this problem and get more precise results, choose either the DailyWalk or Adaptive 
anti-sampling algorithm. Both divide the wanted date range into smaller chunks. You can configure
anti-sampling in the query detail.

{: .image-popup}
![Screenshot - Anti Sampling](/components/extractors/marketing-sales/google-analytics/google-analytics-5.png)

**DailyWalk**, as the name suggests, divides the date range by days. It means that the extractor needs to 
make as many requests as there are days in the date range. Even though this algorithm might be more 
precise in some cases, you usually get the same results faster with the Adaptive algorithm.

The **Adaptive** algorithm uses a more sophisticated approach, splitting the original date range into 
few smaller date sections. To learn more about it, read this [in-depth explanation](http://code.markedmondson.me/anti-sampling-google-analytics-api/). 

## Filters
Filters allow you to limit and modify the data that is included in a view. For example, you can use 
filters to exclude traffic from particular IP addresses, focus on a specific subdomain or directory, or 
convert dynamic page URLs into readable text strings.
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
![Screenshot - Custom metric ID](/components/extractors/marketing-sales/google-analytics/google_console_metrics.png)

## Custom OAuth Credentials
To avoid hitting quota limits, you can use your own OAuth Client ID and Secret:

1. Visit the [Google API Console](https://console.developers.google.com/).
2. Select an existing project or create a new one.
 
    {: .image-popup}
    ![Screenshot - Google API Console - Project](/components/extractors/marketing-sales/google-analytics/google_console_project.png)

3. Enable the [**Google Analytics Reporting API**](https://console.developers.google.com/apis/library/analyticsreporting.googleapis.com). 
If you plan to use the [Multi-Channel Funnels API](https://developers.google.com/analytics/devguides/reporting/mcf/v3), you also need to enable **[Google Analytcics API](https://console.developers.google.com/apis/library/analytics.googleapis.com)**.
 
    {: .image-popup}
    ![Screenshot - Google API Console - Enable API](/components/extractors/marketing-sales/google-analytics/google_console_enable.png)
    
4. Select the **Credentials** section from the menu on the left, click the **Create credentials** button and select **OAuth client ID**.
  
    {: .image-popup}
    ![Screenshot - Google API Console - Create Credentials](/components/extractors/marketing-sales/google-analytics/google_console_credentials.png)
    
5. Choose **Web Application**. Into **Authorized redirect URIs** insert 
 ```https://oauth.keboola.com/authorize/keboola.ex-google-analytics-v4/callback```
    and ```https://oauth.eu-central-1.keboola.com/authorize/keboola.ex-google-analytics-v4/callback```. 
    The second one is needed for the EU region.

6. Click **Create** and a popup window will display your new Client ID and Client Secret credentials.
7. Find your credentials in the list of available credentials. You should see something like this:
 
    {: .image-popup}
    ![Screenshot - Google API Console - Credentials Detail](/components/extractors/marketing-sales/google-analytics/google_console_detail.png)
  
8. You can now use these credentials in the **Custom Authorization** tab when authorizing the Google Analytics Extractor.
 
    {: .image-popup}
    ![Screenshot - KBC - Custom Authorization](/components/extractors/marketing-sales/google-analytics/google-analytics-6.png)
