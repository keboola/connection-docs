---
title: Google My Business
permalink: /components/extractors/marketing-sales/google-my-business/
redirect_from:
    - /extractors/marketing-sales/google-my-business/
---

* TOC
{:toc}

This extractor allows you to collect daily metrics, reviews, media and questions for your businesses that have a [Google Business profile](https://www.google.com/business/).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Google My Business** extractor.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 

Please ensure that your account has the right to access the locations you are interested in. For a list of available locations for your Google Account, please visit [business.google.com/locations](https://business.google.com/locations).

Next, specify the endpoints from which you want to fetch data.

For daily metrics, you also have an option to specify a date range for fetching data. 

Lastly, in the Destination options, you can select a full load or an incremental load.
The destination table is overwritten for every run of a full load. In contrast, data are upserted into the destination table for an incremental load. 
