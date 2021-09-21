---
title: Adform DSP Reports
permalink: /components/extractors/marketing-sales/adform-dsp-reports/
redirect_from:
    - /extractors/marketing-sales/adform-dsp-reports/
---

* TOC
{:toc}
  
Retrieve Buy-Side report data from the [Reporting Stats API](https://api.adform.com/help/guides/how-to-report-on-campaigns/reporting-stats).

This extractor may be used to retrieve similar data as via [MasterData extractor](https://components.keboola.com/components/ex-adform-masterdata), 
if the Master Data service is not enabled in your account.

Reporting Stats API returns report data consisting of statistics derived from the data collected by the Adform tracking code. 
Each report is organized as dimensions and metrics. Metrics are the individual measurements of user activity on your property, 
such as impressions, clicks and conversions. Dimensions break down metrics across some common criteria, 
such as campaign or line item. When you build a query, you specify which dimensions 
and metrics you want in your report data.

# Prerequisites

To use this extractor the user is required to register a client application using the `Credentials flow` authentication. 

To register the application follow the steps described in the [official documentation](https://api.adform.com/help/guides/getting-started/authorization-guide#prerequisites):

Contact Adform API support (technical@adform.com) and provide the **following information**:

- short description of your application (Adform's API use case): `Retrieve Buy-Side report data from the Reporting Stats API`
- authorization flow: `client credentials`
- a list of needed scopes for application: `https://api.adform.com/scope/buyer.stats`

You will then receive your `client secret` and `client id` that will be used for the authentication.


# Configuration

- Register new application and retrieve `client secret` and `client id` as described in the above section
- Set up parameters of the report by defining `Dimensions` and `Metrics`. Note that some combinations of metrics and/or dimensions are not supported. 
For detailed information see the `Filter` section bellow 

{: .image-popup}
![Screenshot - Config](/components/extractors/marketing-sales/adform-dsp-reports/config_adform_all.png)

## Authorization

- **API client secret**, **API client ID** - Adform client credentials for registered app with the `Client credentials flow` enabled.

## Result table name

Name of the Storage table where the result report data will be stored. The default is `report-data`. 

## Load type

If set to Incremental update, the result tables will be updated based on primary key consisting of all selected dimensions. Full load overwrites the destination table each time, with no primary keys.

**Note**: When set to incremental updates the primary key is set automatically based on the dimensions selected. 
If the dimension list is changed in an existing configuration, the existing result table might need to be dropped or the primary key changed before the load, since it structure 
will be different. If set to full load, **no primary key** is set.

## Filter

### Date

Report date range boundaries. The maximum date range accessible through API is 397 days (13 months) from today.

### Client IDS

Optional list of client IDs to retrieve. If left empty, data for all available clients will be retrieved.

## Dimensions

List of report dimensions. For full list of dimensions and its' description [refer here](/components/extractors/marketing-sales/adform-dsp-reports/available-dimensions). 
Or can be retrieved using this [API call](https://api.adform.com/help/references/buyer-solutions/reporting/metadata/dimensions) 

## Metrics

List of report metrics. Max 10. Note that some combinations of metrics and/or dimensions are not supported.

Each metric definition consists of a **metric name** and additional filtering possibilities (`Specs Metadata`) for individual metric. 
If no value is specified in the `Specs Metadata` the default metric is used.

For a full list of available metrics and specs [see here](/components/extractors/marketing-sales/adform-dsp-reports/available-metrics)
Or can be retrieved using thi [API call](https://api.adform.com/help/guides/how-to-report-on-campaigns/reporting-stats/metrics)