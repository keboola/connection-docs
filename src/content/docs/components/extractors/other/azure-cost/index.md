---
title: Azure Cost Management
slug: 'components/extractors/other/azure-cost'
description: Import cost and usage data of an Azure subscription, signed in with your Microsoft account or as a service principal.
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

In the [Configuration Row](/components/#configuration-rows) fill in 
- **Destination Table** -- the name of the table in the project's bucket where the results are written.
- **Grouping Dimension** -- the columns you are targeting.
- **Time Frame** -- the predefined or custom time frame.
- And, optionally, other fields. 

![Screenshot - Configuration Row](/components/extractors/other/azure-cost/row.png)

If the [**Incremental Load**](/storage/tables/#incremental-loading) is set to true, the new data will be appended to the old ones. 
This way you can import new data, e.g., from today, without deleting the data imported before.

## Service principal variant

The **Azure Cost Management Service Principal** connector reads the same cost and usage data, but signs in as an application instead of a personal Microsoft account, so no one has to click **Authorize Account** and the configuration keeps working when that person leaves. Use it for scheduled extractions owned by a team rather than a user.

[Create a new configuration](/components/#creating-component-configuration) of the **Azure Cost Management Service Principal** connector and fill in the **Subscription ID** and the service principal's **Tenant ID**, **Username** and **Password**. Username is the application (client) ID and Password is the client secret of the [service principal](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals) registered in your tenant; the password is stored encrypted. The service principal needs read access to Cost Management for that subscription. The rows, their fields and the output table are the same as above.

<!-- VERIFY(Jiří Soukup): the exact Azure role the service principal needs (Cost Management Reader on the subscription?); the README of keboola/ex-azure-cost-management names tenant, username and password but no role. -->

## Output Table

The output table contains the following columns:
- Time dimension, if enabled; art of the primary key
- Columns from the grouping dimension; part of the primary key
- **Cost**/**Usage** column
- **Currency** column

![Screenshot - Configuration Row](/components/extractors/other/azure-cost/table.png)
