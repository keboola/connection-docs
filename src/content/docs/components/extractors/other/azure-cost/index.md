---
title: Azure Cost Management
slug: 'components/extractors/other/azure-cost'
---



This data source connector uses the [Azure Cost Management API](https://docs.microsoft.com/en-us/rest/api/cost-management/)
to import cost and usage data of an [Azure subscription](https://techcommunity.microsoft.com/t5/azure/understanding-azure-account-subscription-and-directory/m-p/34800).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Azure Cost Management** connector.  
Then click **Authorize Account** to [authorize the configuration](/components/#authorization) with your Azure account.

Fill in the **Subscription ID** and click **Save**.

Click **Add Row** to add one or more [configuration rows](/components/#configuration-rows).

![Screenshot - Extractor configuration](/components/extractors/other/azure-cost/config.png)

Fill in the **name**, and, optionally, the **description**. Then click **Add Row**.

![Screenshot - Add Row Modal](/components/extractors/other/azure-cost/modal.png)

In the [Configuration Row](/components/#configuration-rows) fill in:

- **Destination Table** -- the name of the table in the project's bucket where the results are written.
- **Type** -- the cost data type: `ActualCost` (default), `AmortizedCost`, or `Usage`.
- **Aggregation** -- the cost metric to aggregate: `Cost` (default), `CostUSD`, `PreTaxCostUSD`, `UsageQuantity`, or `PreTaxCost`.
- **Granularity** -- time granularity of the results: `Daily` (default), `Monthly`, or `None`.
- **Grouping Dimension** -- one or more columns to group costs by. Available values: `ServiceName`, `ResourceGroupName`, `ResourceLocation`, `ResourceType`, `ResourceId`, `MeterCategory`, `MeterSubCategory`, `Meter`, `ServiceTier`, `BillingPeriod`, `InvoiceNumber`, `PartNumber`, `PricingModel`, `ChargeType`, `PublisherType`, `ReservationId`, `ReservationName`, `Frequency`, `ResourceGuid`.
- **Time Frame** -- the predefined or custom time frame: `WeekToDate`, `MonthToDate` (default), `BillingMonthToDate`, `TheLastMonth`, `TheLastBillingMonth`, or `Custom`. When `Custom` is selected, specify a **Start** and **End** date in `YYYY-MM-DD` format.

![Screenshot - Configuration Row](/components/extractors/other/azure-cost/row.png)

If the [**Incremental Load**](/storage/tables/#incremental-loading) is set to true, the new data will be appended to the old ones.
This way you can import new data, e.g., from today, without deleting the data imported before.

### Authentication
The connector supports two authentication methods:

- **OAuth** -- click **Authorize Account** to authorize with your Azure account. You can optionally specify a **Tenant ID** to restrict authorization to a specific Azure AD tenant.
- **Service Principal** -- provide `tenant`, `username`, and `password` credentials for a registered Azure AD application. This method is useful for automated or headless scenarios.

## Output Table

The output table contains the following columns:
- Time dimension, if enabled; part of the primary key
- Columns from the grouping dimension; part of the primary key
- **Cost**/**Usage** column
- **Currency** column

![Screenshot - Configuration Row](/components/extractors/other/azure-cost/table.png)
