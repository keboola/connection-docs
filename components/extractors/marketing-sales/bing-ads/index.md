---
title: Microsoft Advertising (Bing Ads)
permalink: /components/extractors/marketing-sales/bing-ads/
redirect_from:
    - /extractors/marketing-sales/bing-ads/
---

* TOC
{:toc}

The Microsoft Advertising (Bing Ads) extractor supports extracting either campaign entity data or various types of reports available. In case of reports you can specify your own set of columns and primary key to use in Keboola Storage, but there are also presets of columns and appropriate primary keys available.

## Prerequisites
First, you must create a Developer Token. To do so, please follow [this guide in the official documentation](https://learn.microsoft.com/en-us/advertising/guides/get-started?view=bingads-13#get-developer-token).

Then you must find your Bing Ads Account ID and Customer ID. Once again, please follow [this part of the official documentation](https://learn.microsoft.com/en-us/advertising/guides/get-started?view=bingads-13#get-ids). Both should be numbers such as `391827251`.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Microsoft Advertising (Bing Ads)** extractor.

### Global configuration
First open the Global Configuration:

{: .image-popup}
![Global Configuration opening](/components/extractors/marketing-sales/bing-ads/global_config_collapsed.png)

Then enter the created Developer Token as well as your Account ID and Customer ID into the components global configuration as you can see on the screenshot below. Don't forget to **Save** the configuration.

{: .image-popup}
![Global Configuration](/components/extractors/marketing-sales/bing-ads/config_global.png)

Finally, you must log into your account using the **Authorize Account** button in the Keboola interface. 

{: .image-popup}
![OAuth Authorization](/components/extractors/marketing-sales/bing-ads/config_oauth.png)

### Configure Reports (Configuration rows)
Now you can configure the reports to extract as configuration rows. First, **Add Row**:

{: .image-popup}
![Add Row](/components/extractors/marketing-sales/bing-ads/add_row.png)

Then you must select the **Object type**:
- **Entity** to extract campaign entities (such as Ads, Ad Groups, Campaigns etc.).
- **Report (Prebuilt)** to extract reports using one of the presets.
- **Report (Custom)** to extract reports using your own set of columns and primary key.

{: .image-popup}
![Row object type entry](/components/extractors/marketing-sales/bing-ads/row_object_type.png)

The rest of the configuration depends on what **Object Type** is selected.

#### Entities extraction

This part of row configuration only becomes available if `Entity` is selected as the **Object Type**. Here you must set these options:
- **Entities** - Comma separated list of entities (or rather entity types) to download, find supported entities in the [official documentation](https://learn.microsoft.com/en-us/advertising/bulk-service/downloadentity?view=bingads-13#values). Currently only the extraction of entities within the `EntityData` data scope is supported.
- **Only download changes since the last run** (since_last_sync_time) - If checked, only changes since the last component run will be downloaded. If checked for the first run of this component row, it will be ignored (i.e. all data will be downloaded).

{: .image-popup}
![Entities configuration entry](/components/extractors/marketing-sales/bing-ads/row_entities.png)


#### Prebuilt reports
This part of row configuration only becomes available if `Report (Prebuilt)` is selected as the **Object Type**. Here you must set these options:
- **Preset Name** (preset_name) - Select one of the available report presets. The columns and primary key that will be used for each preset are listed on [a separate page](/components/extractors/marketing-sales/bing-ads/report-presets-columns-and-pk/).
- **Report Aggregation** (aggregation) - The type of aggregation to use to aggregate the report data. For prebuilt report presets, only `Daily` and `Hourly` aggregation is available.
- **Time Range** (time_range) - Settings determining what time period the report should be about.
    - **Report Time Zone** (time_zone) - Determines the time zone that is used to establish today's date.
    - **Report Period** (period) - The time period the report should be about. If `CustomTimeRange` you will also need to provide the next 2 parameters:
    - **Date From** (date_from) - Start date of the report. Either date in YYYY-MM-DD format or a relative date string i.e. 5 days ago, 1 month ago, yesterday, etc., and other formats supported by the [dateparser library](https://dateparser.readthedocs.io/en/latest/)). Can also be specified as `last run` to start the reporting period at the time of last extraction (this cannot be done in case of the first run for obvious reasons).
    - **Date To** (date_to) - End date of the report. Either date in YYYY-MM-DD format or relative date string i.e. 5 days ago, 1 month ago, yesterday, etc., and other formats supported by the [dateparser library](https://dateparser.readthedocs.io/en/latest/)).
- **Return only complete data** (return_only_complete_data) - Determines whether or not the service must ensure that all the data has been processed and is available. If checked, and the requested data are (partially) incomplete or unavailable, an error will be raised.

{: .image-popup}
![Prebuilt reports configuration entry](/components/extractors/marketing-sales/bing-ads/row_reports_prebuilt.png)

#### Custom reports
This part of row configuration only becomes available if `Report (Custom)` is selected as the **Object Type**. Here you must set these options:
- **Report type** (report_type) - Select one of the available report types described in the [official documentation](https://learn.microsoft.com/en-us/advertising/guides/report-types?view=bingads-13).
- **Report Aggregation** (aggregation) - The type of aggregation to use to aggregate the report data.
- **Time Range** (time_range) - Settings determining what time period the report should be about.
    - **Report Time Zone** (time_zone) - Determines the time zone that is used to establish today's date.
    - **Report Period** (period) - The time period the report should be about. If `CustomTimeRange` you will also need to provide the next 2 parameters:
    - **Date From** (date_from) - Start date of the report. Either date in YYYY-MM-DD format or relative date string i.e. 5 days ago, 1 month ago, yesterday, etc., and other formats supported by the [dateparser library](https://dateparser.readthedocs.io/en/latest/)). Can also be specified as `last run` to start the reporting period at the time of last extraction (this cannot be done in case of the first run for obvious reasons).
    - **Date To** (date_to) - End date of the report. Either date in YYYY-MM-DD format or relative date string i.e. 5 days ago, 1 month ago, yesterday, etc., and other formats supported by the [dateparser library](https://dateparser.readthedocs.io/en/latest/)).
- **Return only complete data** (return_only_complete_data) - Determines whether or not the service must ensure that all the data has been processed and is available. If checked, and the requested data are (partially) incomplete or unavailable, an error will be raised.
- **Columns** (columns) - Comma separated list of columns to use for the report. For your convenience, available columns for each report type are listed in the appropriate format on [a separate page](/components/extractors/marketing-sales/bing-ads/reports-available-columns/).
- **Primary Key Columns** (primary_key) - Comma separated list of columns to be used as primary key. For your convenience, available columns for each report type are listed in the appropriate format on [a separate page](/components/extractors/marketing-sales/bing-ads/reports-available-columns/).

{: .image-popup}
![Custom reports configuration entry](/components/extractors/marketing-sales/bing-ads/row_reports_custom.png)

#### Destination
Finally, you must set how the extracted data will be saved in Keboola Storage.
- **Load Type** (load_type) - If Full load is used, the destination table will be overwritten every run. If Incremental Load is used, data will be upserted into the destination table.
- **Storage Table Name** (output_table_name) - Name of the table stored in Storage. Defaults are used if left empty (see the [Output section](#output) for details).

{: .image-popup}
![Destination configuration entry](/components/extractors/marketing-sales/bing-ads/row_destination.png)

Once again: don't foget to **Save**.

### Example configuration

Let's say you want to download an AdGroupPerformance report with [the preset columns and primary key](https://bitbucket.org/kds_consulting_team/kds-team.ex-bingads/src/master/docs/report_presets_columns_and_pk.md#adgroupperformance-report-presets) and upsert the data into a table called `AdGroupPerformance_Daily_Report`. In that case you would:
1. Set the **Object Type** to `Report (Prebuilt)`,
2. the **Preset Name** to `AdGroupPerformance`,
3. the **Report Aggregation** to `Daily`,
4. the **Report Period** to `ThisYear`,
5. uncheck **Return only complete data** (since we are using `ThisYear` as the reporting period, not all data is available), and
6. set the **Load Type** to `Incremental Load`.

If needed, you can also change the **Report Time Zone**, of course. We can leave **Storage Table Name** empty since we want the default table name of `AdGroupPerformance_Daily_Report`, but you can set your custom **Storage Table Name** if needed.

## Output
The output of every configuration row is always a single table in the Keboola Storage. If you specify the **Storage Table Name** in the [destination configuration](#destination), this name is used, otherwise a default name is generated as specified below.

### Entities
When extracting campaign entity data (i. e. when **Object Type** in row config is set to `Entity`), the default name of the Keboola Storage output table is `entities`. The schema of the output table is rather complicated (418 columns), since all possible entity fields need to be covered. It therefore is rather sparse (most values are empty because they do not apply to the entity type of any given row).

### Reports
#### Prebuilt
When extracting report data (i. e. when Object Type in row config is set to `Report (Prebuilt)`), the output table schema depends on which report preset specified in the Preset Name row configuration parameter and the chosen aggregation in the Aggregation parameter. You can see what columns are extracted for each combination of Preset Name and Aggregation in [this markdown file inside this git repository](https://bitbucket.org/kds_consulting_team/kds-team.ex-bingads/src/master/docs/report_presets_columns_and_pk.md). The default table name is constructed as `{preset_name}_{aggregation}_Report.csv`, where `{preset_name}` is the Preset Name parameter value and `{aggregation}` is the value of the Aggregation parameter.
#### Custom
When extracting report data (i. e. when Object Type in row config is set to `Report (Custom)`), the output table schema depends on the columns set in the Columns parameter. The default table name is constructed as `{report_type}_Report.csv`, where `{report_type}` is the Report Type parameter value specified in the row configuration.
