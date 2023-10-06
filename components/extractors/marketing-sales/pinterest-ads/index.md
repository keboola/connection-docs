---
title: Pinterest Ads
permalink: /components/extractors/marketing-sales/pinterest-ads/
---

* TOC
{:toc}

## Introduction

[Pinterest](https://www.pinterest.com/) is a social media platform and visual discovery engine that allows users to discover, save, and share creative
ideas and inspirations through images and links.

The Pinterest Ads Extractor is a powerful component that automates the retrieval of [Ad Analytics reports]((https://help.pinterest.com/en/business/article/create-edit-and-review-custom-reports), allowing users to
schedule and download predefined reports effortlessly. With the ability to fetch reports across multiple Ad Accounts
simultaneously, it streamlines the data collection process. Users can select the granularity and relative time period
for incremental data fetching. This component empowers marketers with comprehensive insights into their Pinterest ad
campaigns.

## Prerequisites


To get Pinterest Ad Analytics reports, you need to follow a few steps:

1. **Have a Pinterest Business Account**: The first step is to create a Pinterest Business account if you don't have one already. This account will be used to manage your ads and access your analytics reports. [Get a business account](https://help.pinterest.com/en/business/article/get-a-business-account)
2. **Have active Ad Campaigns**: Once you have a business account, you can start setting up your ad campaigns to collect analytics. This includes choosing your target audience, setting your budget, and selecting the pins you want to promote. [Set an Ad Campaign](https://help.pinterest.com/en/business/article/set-up-your-campaign)


Remember, it may take some time for your ads to start running and for data to accumulate in your analytics reports. 

## Configuration Guide

- [Create a new configuration](https://help.keboola.com/components/#creating-component-configuration) of the **Pinterest Ads extractor**.
- Click `Authorize Account` button and log in with your Pinterest Business account.

Now you can define reports to download:

- Click on a `ADD ROW` to create a report definition. Each row translates to different output table / report.
- Select account(s) you wish to get reports from. You may select multiple accounts.

### Define a time range

- These dates can be exact dates in `YYYY-MM-DD` format or relative dates; i.e., `5 days ago`, `1 month ago`, `yesterday`,
  now, today, etc. We recommend selecting a larger relative date window, the result data will be upserted to the destination so there
  are no data duplication issues.
- Select report granularity -> this defines the aggregation level of the report.
- The time range will be applied to any report you choose.

There are two modes this component operates, you can either define your own report or use an existing [Custom Report](https://help.pinterest.com/en/business/article/create-edit-and-review-custom-reports)

### Defining custom report via configuration

This report definition will be executed to across all selected accounts. Results will be stored in the same table linked to related account ID.

- In the `Report Specification` section select **Custom Report** option.
- In report details select required columns.
- Select the report granularity Level e.g. `Advertiser` or `Campaign`
- Select the conversion window - for more information refer to the [documentation](https://help.pinterest.com/en/business/article/conversions-campaigns#section-10906)
- Select the Conversion Report Time:
  - `TIME_OF_AD_ACTION`: The time when the user interacted with the ad.
  - `TIME_OF_CONVERSION`: The time when the user completed a conversion event.

### Using existing report template

To get more options while building the report, you can leverage the Pinterest Ads report builder and create a report
Templates in the [Pinterest UI](https://help.pinterest.com/en/business/article/create-edit-and-review-custom-reports)

These can be then downloaded via the component, the reporting time range will be overriden from the configuration:

- Create a report template with no schedule in the [Pinterest UI](https://help.pinterest.com/en/business/article/create-edit-and-review-custom-reports)
- In the `Report Specification` section select **Existing Report Template ID(s)** option.
- Select template(s) in the `Existing Custom Report Template(s)`
- More templates may be selected in case they exist across multiple AD accounts and share the same structure.

### Destination / Output
- Fill in the name of the result table; This will be the name of the result table in the Storage. Make sure that each configuration row leads to a different table to prevent any conflicts.
- Select `Load Type`, choose between `Full Load` and `Incremental Load`. If full load is used, the destination table will be overwritten with every run. If incremental load is used, data will be upserted into the destination table.

