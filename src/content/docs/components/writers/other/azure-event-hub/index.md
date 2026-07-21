---
title: Azure Event Hub
description: This data destination connector allows you to publish events to the Azure Event Hubs.
slug: 'components/writers/other/azure-event-hub'
redirect_from:
    - /writers/other/azure-event-hub/
---



This data destination connector allows you to publish events to the [Azure Event Hubs](https://azure.microsoft.com/en-us/services/event-hubs/).

## Mapping Mode

There are two **mapping modes**:
 - **`row_as_json` mode**: message is the table's row in JSON format
 - **`column_value` mode**: message is the value of the specified column, from the table's row
 
## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Azure Event Hub** connector.

Fill in the **Connection String** and **Event Hub Name**. Then click **Save**.

![Screenshot - Configuration](/components/writers/other/azure-event-hub/config.png)

Click **Add Row** to add one or more [configuration rows](/components/#configuration-rows).

![Screenshot - Add Row](/components/writers/other/azure-event-hub/add-row.png)

Fill in the **Name**, and, optionally, the **Description**. Then click **Add Row**.

![Screenshot - Add Row Modal](/components/writers/other/azure-event-hub/add-row-modal.png)

Click **New Table Input** to add one table to the [Input Mapping](/transformations/mappings/).

![Screenshot - Configuration Row](/components/writers/other/azure-event-hub/add-table.png)

Fill in the **Source** table. You can also fill in other fields. Then click **Add Input**.

![Screenshot - Configuration Row](/components/writers/other/azure-event-hub/add-table-modal.png)

In the [Configuration Row](/components/#configuration-rows), fill in the [**Mapping Mode**](#mapping-mode).

For the **`column_value`** mapping mode, also fill in the **Message Column**.

Then click **Save**.

![Screenshot - Configuration Row](/components/writers/other/azure-event-hub/row-save.png)
