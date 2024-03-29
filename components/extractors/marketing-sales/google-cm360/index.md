---
title: Google Campaign Manager 360
permalink: /components/extractors/marketing-sales/google-cm360/
---

* TOC
{:toc}

[Google Campaign Manager 360](https://support.google.com/campaignmanager/answer/2709362?hl=en) orchestrates digital advertising campaigns, offering precise ad placements across multiple
channels. 

This connector enables easy retrieval of Campaign Manager 360 reports **from multiple ad accounts** and provides versatile report management functionalities:

1. Set up customized reports directly in the UI, tailoring data extraction to specific requirements.
2. Easily select multiple reports with identical structures across different accounts, streamlining data aggregation.
3. Use an existing report as a template, running it across selected accounts for efficient data collection.

## Prerequisites
Before using the connector, make sure the following prerequisites are met:

- Get access to the [Campaign Manager 360](https://support.google.com/campaignmanager?sjid=16894252783161215189-EU#topic=2758513) account.
- Log in to your account using the **Authorize Account** button in the Keboola interface.

## Functionality and Configuration
The connector supports three modes:

1. **Template-Based Report Execution:** Use an existing report definition as a template and execute it across selected accounts.
   - It's ideal if you need to set up a complex report in the [CM360 Report Builder](https://www.google.com/analytics/dfa/) and use it across multiple accounts. 
   - The selected report is left untouched, and its copy is created in all selected accounts. The resulting reports are linked to the configuration. Naming convention: `keboola_generated_{PROJECT_ID}_{CONFIG_ID}_{ROWID}`
2. **Running and Downloading Existing Report Definitions**: Suitable for multiple identical reports across required ad accounts, previously defined using the [CM360 Report Builder](https://support.google.com/campaignmanager/answer/2823849?sjid=16894252783161215189-EU&visit_id=638403222303021904-3691116343&rd=1).
3. **Direct UI Report Definition:** Set up accccccinerhkkecnclurugbvhilhegrldigernhneile
4.  simple report definition directly in the configuration UI, automatically creating an offline report in the [CM360 Report Builder](https://www.google.com/analytics/dfa/) that will be linked to the configuration. Naming convention: `keboola_generated_{PROJECT_ID}_{CONFIG_ID}_{ROWID}`

### Creating and Running Reports from Existing Report Definitions
This option is helpful if you need to definset up a complex report in the [CM360 Report Builder](https://www.google.com/analytics/dfa/) and use it across multiple accounts. 
The selected report is left untouched, and its copy is created in all selected accounts. The resulting reports are linked to the configuration.

The naming convention of the created report is: `keboola_generated_{PROJECT_ID}_{CONFIG_ID}_{ROWID}`

All results are downloaded into a single table.

To use an existing report as a template, follow these steps:
1. Set up your report in the [CM360 Report Builder](https://www.google.com/analytics/dfa/) (see the official [documentation](https://support.google.com/campaignmanager/answer/2823849?sjid=16894252783161215189-EU&visit_id=638403222303021904-3691116343&rd=1)).
2. Select `Report template` in `Report definition mode`.
3. Choose the existing report from the dropdown to be used as a template across selected accounts.
4. Set the desired `Time Range` (either a predefined period or `Custom date range`). This option allows you to define a relative report period range.
5. Set up the `Destination` parameters to control how the result is stored.

### Running Existing Reports

This option is suitable when you already have multiple identical reports set up across required ad accounts.

To run an existing report, follow these steps:
1. Set up your report in the [CM360 Report Builder](https://www.google.com/analytics/dfa/) (see the official [documentation](https://support.google.com/campaignmanager/answer/2823849?sjid=16894252783161215189-EU&visit_id=638403222303021904-3691116343&rd=1)).
2. Select `Existing report ID(s)` in `Report specification mode`.\
   **WARNING**: Ensure selected reports have the same structure and definition; otherwise extraction will fail.
3. Select the existing report ID from the dropdown of available reports.
4. The time range is, in this case, defined by the source report. This is to keep the source reports untouched since they are not controlled by the component.
5. Set the `Destination` parameters to control how the result is stored.

### Setting Up Reports Directly in the UI

1. Select `Report specification` in `Report specification mode`.
2. Configure your report in `Report Details`:
   - `Report Type`
   - `Dimensions`
   - `Metrics`
   - Optional filters
3. Select the desired `Time Range` (either a predefined period or `Custom Date Range`). This option allows you to define a relative report period range.
4. Configure the `Destination` parameters to control how the result is stored.

### Destination / Output

This section defines how the extracted data will be saved in Keboola Storage. The resulting table always contains the `Profile ID` and `Profile Name` columns because the component runs through multiple accounts.

- **Load type**: If `full load` is used, the destination table will be overwritten every run. If `incremental load` is used, data will be “upserted” into the destination table.
- **Storage table name**: Name of the resulting table stored in Storage.
- **Primary key**: Since the reports are always custom-defined, define what dimensions (columns) represent the unique primary key. This is then used to perform "upserts."
  **Note**: If the primary key is not defined properly, you may lose some data during deduplication. If there is no primary key defined and `Incremental load` mode is used, each execution will lead to a new set of records. Also, if this field is not empty, `Profile ID` and `Profile name` are always used as the primary key because the component runs through multiple accounts.

