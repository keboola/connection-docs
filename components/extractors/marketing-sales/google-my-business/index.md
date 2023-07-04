---
title: Google My Business
permalink: /components/extractors/marketing-sales/google-my-business/
redirect_from:
    - /extractors/marketing-sales/google-my-business/
---

* TOC
{:toc}

This extractor allows you to collect Daily metrics, reviews, media and questions for your Businesses that have a [Google Business profile](https://www.google.com/business/).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Google My Business** extractor.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 

Please ensure your account has the access right to the locations you are interested in. For a list of available locations for you Google Account, please visit [business.google.com/locations](https://business.google.com/locations).

Next, specify from which endpoints you want to fetch the data from.

For daily metrics, you also have an option to specify for what Date Range you want to fetch the data for. 

Lastly, in the Destionation options, you can select if you want to be doing full load or incremental load.
If Full load is used, the destination table will be overwritten every run. If incremental load is used, data will be upserted into the destination table. 
