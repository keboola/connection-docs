---
title: Google My Business
slug: 'components/extractors/marketing-sales/google-my-business'
description: 'Collect daily metrics, reviews, media and questions for your businesses on a Google Business profile, choosing endpoints, a date range and the load type.'
redirect_from:
    - /extractors/marketing-sales/google-my-business/
---



The Google account you authorize must have access to every [Google Business profile](https://www.google.com/business/) location you want to read.

<!-- How-to-type page. Source: keboola/connection-docs history; classified 2026-10-13. -->

## Configuration
[Create a new configuration](/components/configurations/#create-a-configuration) of the **Google My Business** connector.
Then click **Authorize Account** to [authorize the configuration](/components/authorization/). 

Please ensure that your account has the right to access the locations you are interested in. For a list of available locations for your Google Account, please visit [business.google.com/locations](https://business.google.com/locations).

Next, specify the endpoints from which you want to fetch data.

For daily metrics, you also have an option to specify a date range for fetching data. 

Lastly, in the Destination options, you can select a full load or an incremental load.
The destination table is overwritten for every run of a full load. In contrast, data are upserted into the destination table for an incremental load. 
