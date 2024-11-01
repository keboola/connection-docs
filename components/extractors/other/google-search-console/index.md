---
title: Google Search Console
permalink: /components/extractors/other/google-search-console/
redirect_from:
    - /extractors/other/google-search-console/
---

* TOC
{:toc}

This data source connector allows you to extract statistics and site data of domains linked to your Google account using
the [Google Search Console API](https://developers.google.com/webmaster-tools/v1/api_reference_index).
The component supports the
[Search Analytics](https://developers.google.com/webmaster-tools/v1/searchanalytics/query) 
endpoint and the [Sitemaps](https://developers.google.com/webmaster-tools/v1/sitemaps)
endpoint.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Google Search Console** connector.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization).

{: .image-popup}
![Screenshot - Component Config](/components/extractors/other/google-search-console/auth.png)

## Row Configuration

Add a row to the configuration to extract a specific report.

{: .image-popup}
![Screenshot - Component Config](/components/extractors/other/google-search-console/config.png)

### Search Analytics Endpoint
To extract a search analytics report, select the "Search analytics" endpoint.

{: .image-popup}
![Screenshot - Search analytics Config](/components/extractors/other/google-search-console/row_config.png)

- Fill in the domain to extract data from; it should not contain "https://www." before the domain name.
- Fill in the dimensions you wish to extract data from. Possible dimensions are country, device, page, query, and searchAppearance (searchAppearance cannot be combined with other fields).
- Select a date range to extract data from, either set dynamic date ranges, such as last week or last month or a custom date range where you specify a date from and date to. Custom dates can be filled in with the following:
    - Relative dates like: '1 min ago', '2 weeks ago', '3 months, 1 week and 1 day ago', 'in 2 days', 'tomorrow'.
    - Exact dates like: '2023-12-31, August 14, 2015 EST', 'July 4, 2013 PST', '21 July 2013 10:15 pm +0500'
- Fill in the output table name. The name should only contain alphanumeric characters and underscores
- Next, you can add filters to the data using the Filters section.
  - Filters are managed with filter groups; filters within a group work with AND; therefore, all statements must be true. While filter groups work with OR, therefore at least one filter group must be true to return data.
- To create a new filter group, click the **Add Filter Group** button. 

{: .image-popup}
![Screenshot - Search analytics Config](/components/extractors/other/google-search-console/filters.png)
  
{: .image-popup}
![Screenshot - Search analytics Config](/components/extractors/other/google-search-console/filter1.png)

- To create a new filter within a filter group, click the **Add Filter** button and specify the dimension, operator, and expression.

When using filters, make sure to use the Incremental load option. Otherwise, there are possibilities for duplicate data.

{: .image-popup}
![Screenshot - Search analytics Config](/components/extractors/other/google-search-console/filter2.png)

#### Loading options

There is an option to select a load type. **Full load** is set by default, meaning the table in storage is overwritten
every time. **Incremental** appends new data and updates existing rows in the table using a primary key. The primary key is always set as the 
dimensions set in the configuration.

{: .image-popup}
![Screenshot - Sitemaps Config](/components/extractors/other/google-search-console/loading_options.png)

Click **Save** and run the configuration.

### Sitemaps Endpoint

To extract a search analytics report, select the "Sitemaps" endpoint.

{: .image-popup}
![Screenshot - Sitemaps Config](/components/extractors/other/google-search-console/row_config_sitemaps.png)

- Fill in the domain from which you want to get the data; it should not contain "https://www." before the name.
- Fill in the output table name. The name should only contain alphanumeric characters and underscores.  

Click **Save** and run the configuration.
