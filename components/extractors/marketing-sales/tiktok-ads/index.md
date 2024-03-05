---
title: TikTok Ads
permalink: /components/extractors/marketing-sales/tiktok-ads/
---

* TOC
{:toc}

This data source connector uses the [TikTok Marketing Reports API](https://ads.tiktok.com/marketing_api/docs?id=1740302665828417) to extract 
reports on performance of ads. Depending on the data you need to extract, 
there are [four report types](https://ads.tiktok.com/marketing_api/docs?id=1738864835805186): basic reports, audience reports, playable ads reports, and DSA reports.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **TikTok Ads** connector.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization) with access to the Ad Account you want to extract.

Once the component is authorized, click **Add Row** in order to create a new report to download. Each report you will download will be a [configuration row](https://help.keboola.com/components/#configuration-rows).

Name the row with a descriptive name of the report and click **Create**.

Once the new row configuration is created, you can start filling in the necessary fields. 
First fill in the Advertiser IDs field if you wish to only download data of specific Advertiser IDs. To load all the possible Advertiser IDs, click the **Re-load Advertiser IDs** button
and select which ones you want to download data from. You can select multiple Advertiser IDs. If you leave the field empty, all Advertiser IDs will be downloaded.

Fill in the report settings based on what you require from the report:
* Select the report type from the list of available report types.
* Select the service type from the list of available service types.
* Select the data level from the list of available data levels.
* Fill in a comma-separated list of dimensions in the Dimensions field.
* Fill in a comma-separated list of metrics in the Metrics field.
* Fill in the required date range for the report, these dates can be exact dates in YYYY-MM-DD format or relative dates; i.e., 5 days ago, 1 month ago, yesterday, now, today, etc.

The exact descriptions of the four report types can be found in their corresponding documentations:
* [Basic report](https://ads.tiktok.com/marketing_api/docs?id=1738864915188737)
* [Audience report](https://ads.tiktok.com/marketing_api/docs?id=1738864928947201)
* [Playable Material report](https://ads.tiktok.com/marketing_api/docs?id=1738864940608513)
* [Catalog report](https://ads.tiktok.com/marketing_api/docs?id=1738864960144385)

Finally, fill in the destination settings in the Destination section below the Report settings section:
* Fill in the name of the report in the Storage Table Name; this will be the name of the table you will see in Keboola storage.
* Decide if you want to use incremental load or not. If incremental load is selected, the report data will append new data and update existing records in the table using a primary key (the dimensions columns).
If incremental load is not selected, full load will be used. It will overwrite the table every run, if such a table already exists in storage.

Once all the settings are configured, click **Save** and run the configuration.

