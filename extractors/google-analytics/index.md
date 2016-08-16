---
title: Google Analytics
permalink: /extractors/google-analytics/
---

* TOC
{:toc}

This extractor allows you to integrate your Google Analytics data into KBC environment.
You will need a Google Analytics account to use this extractor, if you don't have one, [create it here](https://analytics.google.com).

## Features
Google Analytics Extractor works with the newest version of the Google Analytics Reporting API - V4.
The Extractor provides these key features:

 - **Metric expressions**
 
    The API allows you to request not only built-in metrics but also combination of metrics expressed in mathematical operations. For example, you can use the expression ga:goal1completions/ga:sessions to request the goal completions per number of sessions.
    
 - **Multiple date ranges**
 
    The API allows you in a single request to get data in two date ranges.     
        
 - **Multiple segments**
 
    The API enables you to get multiple segments in a single request.


## Create New Configuration
 1. Find Google Analytics in the list of extractors and create a new configuration. Name it.

    ![Screenshot - Create configuration](/extractors/google-analytics/ui_new_config.png)
    {: .image-popup}

 2. **Authorize Account** to be redirected to Google, and authorize the extractor to access your Google Analytics data.

 3. Select Google Analytics account and choose profiles (views), from which you would like to extract data. 

    ![Screenshot - Select profiles](/extractors/google-analytics/ui_profiles.png)
    {: .image-popup}

## Create New Query
Each query consists of metrics, dimensions and date range. Optionally it can be filtered by filter expression or segment.
Lets create simple query with some basic metrics like Sessions, Users and Pageviews.

 1. Name your query, for example "Audience"
 
 2. From the metrics selector, choose following metrics: `ga:sessions`, `ga:users`, `ga:pageviews`
 
 3. From the dimensions selector, choose `ga:date` dimension
 
 4. Leave the date range on default (last 5 days) 
 
 5. See query results by hiting `Test query` button
 
 6. Now you see sessions, users and pageviews in last 5 days, sliced by date
 
 7. When you are happy with the results, save your query
 
 8. To store results to Storage, click on the "play" icon on the query list page
 
 ![Screenshot - Create New Query](/extractors/google-analytics/ui_new_query.png)
 {: .image-popup}

## Date Ranges
Date range specifies a time window from which the data will be extracted.
You can use any expression compatible with [PHP strtotime() function](http://php.net/manual/en/datetime.formats.php).
 
### Multiple Date Ranges
Multiple date ranges are useful for example, when you want to compare metric performance to previous date range. 
Lets say you want to see Sessions by month, compared to the same month last year.
Of course, you can download all the data from last year, but with this approach, you can download just the data you need.
 
## Filters
Filters allow you to limit and modify the data that is included in a view. For example, you can use filters to exclude traffic from particular IP addresses, focus on a specific subdomain or directory, or convert dynamic page URLs into readable text strings.
Read more in this [article about how to use filters](https://support.google.com/analytics/answer/1033162).

[Learn how to construct a filter expression](https://developers.google.com/analytics/devguides/reporting/core/v3/reference#filters).

## Segments
A segment is a subset of your Analytics data. For example, of your entire set of users, one segment might be users from a particular country or city. Another segment might be users who purchase a particular line of products or who visit a specific part of your site.
[Read more](https://support.google.com/analytics/answer/3123951?hl=en)

**IMPORTANT: When you want to use segments, you have to use `ga:segments` dimension, however this dimension is not in the option list of dimensions, you have to type it in.**  


