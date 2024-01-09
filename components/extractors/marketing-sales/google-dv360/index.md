---
title: Google Display & Video 360
permalink: /components/extractors/marketing-sales/google-dv360/
---

* TOC
{:toc}

[Google Display & Video 360](https://marketingplatform.google.com/about/display-video-360/) is an integrated solution for end-to-end advertising campaigns.

This data source connector uses the Google Bid Manager API to create and run reports that measure the results of Display & Video 360 advertising campaigns. 
It automates data retrieval from [Display & Video 360 Reports](https://marketingplatform.google.com/about/display-video-360/), allowing you to run
existing reports defined via the [DV360 Report Builder](https://support.google.com/displayvideo/answer/6375151?hl=en&ref_topic=2798432&sjid=18233030458040234650-EU)
or create ad-hoc reports directly from the configuration.

## Prerequisites
Before using the connector, make sure the following prerequisites are met:

1. Get access to the [Display & Video 360](https://marketingplatform.google.com/about/display-video-360/) account.

2. Log in to your account using the **Authorize Account** button in the Keboola interface.

## Configuration

The connector supports two modes:

1. Running and downloading an existing report definition. Such a report may be defined using the [DV360 Report Builder](https://support.google.com/displayvideo/answer/6375151?hl=en&ref_topic=2798432&sjid=15077049489643424211-EU).
   - This option is suitable when you need more control over the report definition.
2. Defining the report definition directly in the UI.
   - This allows you to define simple report definition directly in the configuration UI.
   - This mode will automatically create an offline report in the [DV360 console](https://displayvideo.google.com/ng_nav/reporting) that will be linked to the configuration. The naming convention of the created report is: `keboola_generated_{PROJECT_ID}_{CONFIG_ID}_{ROWID}`

### Running Existing Report

1. Define your report in the [DV360 Report Builder](https://displayvideo.google.com/ng_nav/reporting). See the official [docs](https://support.google.com/displayvideo/answer/6375151?hl=en&ref_topic=2798432&sjid=15077049489643424211-EU).
2. Select the `Existing report ID` in the `Report definition mode` configuration option.
3. Select the existing report ID from the dropdown of available reports.
4. Define the desired `Time Range`.
   - You may select either a predefined period or a `Custom Date Range`.
   - This option allows you to define a relative report period range.
5. Define the **destination** parameters to control how the result is stored. See the **Destination** section.

### Defining Report Directly in the UI

1. Select the `Report specification` in the `Report definition mode` configuration option.
2. Define your report in  `Report Details`.
   1. Select the `Report Type`.
   2. Select desired dimensions.
   3. Select the desired metrics.
   4. Optionally, specify filters.
3. Define the desired `Time Range`.
   - You may select either a predefined period or a `Custom Date Range`.
   - This option allows you to define a relative report period range.
4. Define the **destination** parameters to control how the result is stored. See the **Destination** section.

### Destination / Output

This section defines how the extracted data will be saved in Keboola Storage.

- **Load Type**: If `Full Load` is used, the destination table will be overwritten every run. If `Incremental Load` is used, data will be “upserted” into the destination table.
- **Storage Table Name**: The name assigned to the table in Keboola Storage.
- **Primary Key**: Since the reports are always custom-defined, you need to define what dimensions (columns) represent the unique primary key. This is then used to perform "upserts."
  - *Note that if the primary key is not defined properly, you may lose some data during deduplication. If there is no primary key defined and `Incremental Load` mode is used, each execution will lead to a new set of records.*

