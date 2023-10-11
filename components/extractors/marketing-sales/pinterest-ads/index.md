---
title: Pinterest Ads
permalink: /components/extractors/marketing-sales/pinterest-ads/
---

* TOC
{:toc}

[Pinterest](https://www.pinterest.com/) is a social media platform and a visual discovery engine that allows users to discover, save, and share creative
ideas and inspirations through images and links.

The Pinterest Ads extractor is a powerful component that automates the retrieval of [ad analytics reports](https://help.pinterest.com/en/business/article/create-edit-and-review-custom-reports), 
enabling users to schedule and download predefined reports effortlessly. This component streamlines the data collection process by allowing you to fetch reports from multiple ad accounts simultaneously.

Users can select the granularity and the relative period for incremental data fetching. This component empowers marketers with comprehensive insights into their Pinterest ad campaigns.

## Prerequisites
To get Pinterest Ad Analytics reports, have

1. **a Pinterest business account** that you use to manage your ads and access your analytics reports. [Create your own business account](https://help.pinterest.com/en/business/article/get-a-business-account).
2. **active ad campaigns**, including a selected target audience, budget, and pins you want to promote. [Create an ad campaign](https://help.pinterest.com/en/business/article/set-up-your-campaign).
   
*Note: Remember, it may take some time for your ads to start running and for data to accumulate in your analytics reports.* 

## Configuration
First, [create a new configuration](https://help.keboola.com/components/#creating-component-configuration) of the Pinterest Ads extractor.
Then, click the **Authorize Account** button and log in with your Pinterest business account.

Now, you can define reports to download:

- Click **Add Row** to create a report definition. Each row translates to a different output table/report.
- Select account(s) you wish to get reports from. You may select multiple accounts.

### Define Time Range
These dates can be exact dates in `YYYY-MM-DD` format or relative dates, i.e., `5 days ago`, `1 month ago`, `yesterday`,
now, today, etc. We recommend selecting a larger relative date window. The result data will be upserted to the destination, so there
are no data duplication issues.

Select report granularity; this defines the aggregation level of the report. The time range will be applied to any report you choose.

There are two modes in which this component operates. You can either define your own report, 
or you can use an existing [custom report](https://help.pinterest.com/en/business/article/create-edit-and-review-custom-reports).

### Define Custom Report via Configuration
This report definition will be executed across all selected accounts. Results will be stored in the same table, linked to the related account ID.

- In the Report Specification section, select the **Custom Report** option.
- In report details, select the required columns.
- Select the report granularity level, e.g., `Advertiser` or `Campaign`.
- Select the conversion window. For more information, refer to the [documentation](https://help.pinterest.com/en/business/article/conversions-campaigns#section-10906).
- Select the conversion report time:
  - `TIME_OF_AD_ACTION`: The time when the user interacted with the ad.
  - `TIME_OF_CONVERSION`: The time when the user completed a conversion event.

### Use Existing Report Template
To get more options while building the report, you can leverage the Pinterest Ads report builder and create a report
template in the [Pinterest UI](https://help.pinterest.com/en/business/article/create-edit-and-review-custom-reports).

These can then be downloaded via the component. The reporting time range will be overridden from the configuration:

- Create a report template with no schedule in the [Pinterest UI](https://help.pinterest.com/en/business/article/create-edit-and-review-custom-reports).
- In the Report Specification section, select the **Existing Report Template ID(s)** option.
- Select template(s) in the section Existing Custom Report Template(s).
- Additional templates may be selected in case they exist across multiple ad accounts and share the same structure.

### Destination / Output
Fill in the name of the result table. This will be the name of the result table in Storage. Make sure that each configuration row leads to a different table to prevent any conflicts.

Then select a load type. If full load is used, the destination table will be overwritten with every run. If incremental load is used, data will be upserted into the destination table.
