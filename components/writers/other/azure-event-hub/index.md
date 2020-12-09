---
title: Azure Event Hub
permalink: /components/writers/other/azure-event-hub/
---

* TOC
{:toc}

This writer allows you to publish events to the [Azure Event Hubs](https://azure.microsoft.com/en-us/services/event-hubs/).

## Mapping Mode

There are two **Mapping Modes**:
 - **`row_as_json` mode**:  message is table's row in the JSON format.
 - **`column_value_mode` mode**: message is value of the specified column, from the table's row.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Azure Event Hub** writer.

Fill in the **Connection String** and **Event Hub Name**. Then click **Save**.

{: .image-popup}
![Screenshot - Extractor configuration](/components/writers/other/azure-event-hub/config.png)

Click **Add Row** to add one or more [configuration rows](/components/#configuration-rows).

{: .image-popup}
![Screenshot - Extractor configuration](/components/writers/other/azure-event-hub/add-row.png)

Fill in the **Name**, and optionally the **Description**. Then click **Add Row**.

{: .image-popup}
![Screenshot - Extractor configuration](/components/extractors/database/cosmosdb/add-row-modal.png)

Click **New Table Input** to add one table to the [Input Mapping](https://help.keboola.com/transformations/mappings/).

{: .image-popup}
![Screenshot - Configuration Row](/components/writers/other/azure-event-hub/add-table.png)

Fill in **Source** table. You can also fill in other fields. Then click **Add Input**.

{: .image-popup}
![Screenshot - Configuration Row](/components/writers/other/azure-event-hub/add-table-modal.png)

In the [Configuration Row](/components/#configuration-rows) fill in the [**Mapping Mode**](#mapping-mode).

For **`column_value`** mapping mode, also fill in the **Message Column**.

Then click **Save**.

{: .image-popup}
![Screenshot - Configuration Row](/components/writers/other/azure-event-hub/row-save.png)

