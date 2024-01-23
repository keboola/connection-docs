---
title: ChartMogul
permalink: /components/extractors/marketing-sales/chartmogul/
redirect_from:
    - /extractors/marketing-sales/chartmogul/
---

* TOC
{:toc}

The ChartMogul data source connector fetches data from the [ChartMogul API](https://dev.chartmogul.com/). [ChartMogul](https://chartmogul.com/) offers subscription analytics and 
revenue recognition solutions to subscription businesses. 

With this connector, you can quickly obtain the following data:

- Activities
- Customers
- Subscriptions
- Invoices
- Key metrics for deeper insights

## Prerequisites
To use this component, ensure you have an `Active` API key with `Read-only` access level.

To obtain your API key, follow these steps in your ChartMogul web app:

- Go to your **Profile** at the bottom left corner of the platform screen.
- Select **Admin**.
- Click on the user you wish to authorize as.
- Then, select **API Keys**.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **ChartMogul** connector.

### Row Configuration

Select the **endpoint** from which you want to get the data.

### Individual Endpoint Parameters

- **Start date**: Start date of the request (e.g., 2021-01-01, 1 day ago, 2 weeks ago)
    -  Required for `key_metrics`, optional for `activities`
      
- **End date**: End date of the request (e.g., 2021-01-01, 1 day ago, 2 weeks ago)
    - Required for `key_metrics`, optional for `activities`
    - **Note:** If an end date is specified for `activities`, a start date is also required.
  
- **Interval**: Required for `key_metrics`
    - day
    - week
    - month
     
- **Geo**: A comma-separated list of ISO 3166-1 Alpha-2 formatted country codes to filter the results (e.g., US, GB, DE)
    - Optional for `key_metrics`
        
- **Plans**: A comma-separated list of plan names (as configured in your ChartMogul account) to filter the results
    - Optional for `key_metrics`
    - **Note:** Spaces must be URL-encoded, and the names are case-sensitive.

Click **Save** when you’re done.
