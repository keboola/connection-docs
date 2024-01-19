---
title: ChartMogul
permalink: /components/extractors/marketing-sales/chartmogul/
redirect_from:
    - /extractors/marketing-sales/chartmogul/
---

* TOC
{:toc}

The ChartMogul extractor fetches data from [ChartMogul](https://chartmogul.com/). With this extractor, you are able to get the following data:
- activities
- customers
- subscriptions
- invoices
- key metrics

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **ChartMogul** extractor.

To run this component, API key is required. API key is required to be `Active` and contains `Read` as a minimum access level. 

#### Obtaining API Tokens

Follow path below in your ChartMogul web app:
  1. **Profile** - bottom left corner of the platform
  2. **Admin**
  3. Click on the user you wish to authorize as
  4. **API Keys**

### Row configuration

- **Endpoint** -- Select the Endpoint you want to get the data from.

### Individual endpoints parameters

- **Start date** -- [REQ for `key_metrics`] [OPT for `activities`] Start date of the request. Eg: 2021-01-01, 1 day ago, 2 
weeks ago

- **End date** -- [REQ for `key_metrics`] [OPT for `activities`] 
      - End date of the request. Eg: 2021-01-01, 1 day ago, 2 weeks ago
      - If End Date is specified for `activities`, Start Date will be required.
- **Interval** -- [REQ for `key_metrics`]
  1. day
  2. week
  3. month
- **Geo** -- [OPT for `key_metrics`]
      - A comma-separated list of ISO 3166-1 Alpha-2 formatted country codes to filter the results to, e.g. US,GB,DE
- **Plans** -- [OPT for `key_metrics`]
      - A comma-separated list of plan names (as configured in your ChartMogul account) to filter the results to. Note that spaces must be url-encoded and the names are case-sensitive.

Click **Save** when you’re done.
