---
title: Azure Cost Management
permalink: /components/extractors/other/azure-cost/
---

* TOC
{:toc}

This extractor uses the [Azure Cost Management API](https://docs.microsoft.com/en-us/rest/api/cost-management/)
to import cost and usage data of an [Azure subscription](https://techcommunity.microsoft.com/t5/azure/understanding-azure-account-subscription-and-directory/m-p/34800).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Azure Cost Management** extractor.  
Then click **Authorize Account** to [authorize the configuration](/components/#authorization) with your Azure account.

Fill in the **Subscription ID** and click **Save**.

Click **Add Row** to add one or more [configuration rows](/components/#configuration-rows).

{: .image-popup}
![Screenshot - Extractor configuration](/components/extractors/other/azure-cost/config.png)

Fill in the **name**, and, optionally, the **description**. Then click **Add Row**.

{: .image-popup}
![Screenshot - Add Row Modal](/components/extractors/other/azure-cost/modal.png)

In the [Configuration Row](/components/#configuration-rows) fill in 
- **Destination Table** -- the name of the table in the project's bucket where the results are written.
- **Grouping Dimension** -- the columns you are targeting.
- **Time Frame** -- the predefined or custom time frame.
- And, optionally, other fields. 

{: .image-popup}
![Screenshot - Configuration Row](/components/extractors/other/azure-cost/row.png)

If the [**Incremental Load**](/storage/tables/#incremental-loading) is set to true, the new data will be appended to the old ones. 
This way you can import new data, e.g., from today, without deleting the data imported before.

## Output Table

The output table contains the following columns:
- Time dimension, if enabled; art of the primary key
- Columns from the grouping dimension; part of the primary key
- **Cost**/**Usage** column
- **Currency** column

{: .image-popup}
![Screenshot - Configuration Row](/components/extractors/other/azure-cost/table.png)
