---
title: Google Search Console
permalink: /components/extractors/other/google-search-console/
redirect_from:
    - /extractors/other/google-search-console/
---

* TOC
{:toc}

This component allows you to extract statistics and site data of domains that are linked to your Google account. Using
the [Google Search Console API](https://developers.google.com/webmaster-tools/search-console-api-original).
The component supports the
[Search Analytics](https://developers.google.com/webmaster-tools/search-console-api-original/v3/searchanalytics) 
endpoint and the [Sitemaps](https://developers.google.com/webmaster-tools/search-console-api-original/v3/sitemaps)
endpoint.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Google Search Console** extractor.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization).

## Row configuration

Add a row to the configuration to extract a specific report.

{: .image-popup}
![Screenshot - Component Config](/components/extractors/other/google-search-console/config.png)

### Search analytics endpoint
To extract a search analytics report select the "Search analytics" endpoint.

{: .image-popup}
![Screenshot - Search analytics Config](/components/extractors/other/google-search-console/search_analytics_main.png)

- Fill in the domain to extract data from, it should not contain "https://www." before the name of the domain.
- Fill in the dimensions you wish extract data from. Possible dimensions are; country, device, page, query,searchAppearance (searchAppearance cannot be combined with other fields)
- Select a date range to extract data from, either set dynamic date ranges; last week or last month, or a set custom date range where you specify a date from and a date to. Custom dates can be filled in with :
    - Relative dates like: '1 min ago', '2 weeks ago', '3 months, 1 week and 1 day ago', 'in 2 days', 'tomorrow'.
    - Exact dates like: 'August 14, 2015 EST', 'July 4, 2013 PST', '21 July 2013 10:15 pm +0500'
- Fill in the output table name. The name should only contain alphanumeric characters and underscores
- Next you can add filters to the data using the Filters section
  - Filters are managed with filter groups, filters within a group work with AND, therefore all statements must be true. While filter groups work with OR, therefore at least one filter group must be true to return data
- To create a new filter group click the **Add Filter Group** button 
  
{: .image-popup}
![Screenshot - Search analytics Config](/components/extractors/other/google-search-console/filter1.png)

- To create a new filter within a filter group click the **Add Filter** button and specify the dimension, operator and expression

{: .image-popup}
![Screenshot - Search analytics Config](/components/extractors/other/google-search-console/filter2.png)

Click save and run the configuration.

### Sitemaps endpoint

To extract a search analytics report select the "Sitemaps" endpoint.

{: .image-popup}
![Screenshot - Sitemaps Config](/components/extractors/other/google-search-console/row_config_sitemaps.png)

- Fill in the domain to get the data from, it should not contain "https://www." before the name.
- Fill in the output table name. The name should only contain alphanumeric characters and underscores  

Click save and run the configuration.