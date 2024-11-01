---
title: Azure Storage Table
permalink: /components/extractors/database/azure-storage-table/
---

* TOC
{:toc}

The Azure Storage Table data source connector allows you to fetch data from the
- [Azure Table storage](https://azure.microsoft.com/en-us/services/storage/tables) or the
- [Azure Cosmos DB Table API](https://docs.microsoft.com/en-us/azure/cosmos-db/table-introduction).

If you want to use
- the [Cosmos DB Mongo DB API](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction), use the [MongoDB data source connector](/components/extractors/database/mongodb/).
- the [Cosmos DB SQL API](https://docs.microsoft.com/en-us/azure/cosmos-db/tutorial-query-sql-api), use the [CosmosDB data source connector](/components/extractors/database/cosmosdb/).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Azure Storage Table** connector.  

Fill in the **Connection String**. Then click **Save**.

{: .image-popup}
![Screenshot - Extractor configuration](/components/extractors/database/azure-storage-table/config.png)

Click **Add Row** to add one or more [configuration rows](/components/#configuration-rows).

{: .image-popup}
![Screenshot - Extractor configuration](/components/extractors/database/azure-storage-table/add-row.png)

Fill in the **Name**, and, optionally, the **Description**. Then click **Add Row**.

{: .image-popup}
![Screenshot - Extractor configuration](/components/extractors/database/azure-storage-table/add-row-modal.png)

In the [Configuration Row](/components/#configuration-rows), fill in 
the [**Configuration Parameters**](#configuration-parameters). Then click **Save**. 

{: .image-popup}
![Screenshot - Extractor configuration](/components/extractors/database/azure-storage-table/row.png)

### Configuration Parameters

- **`table`**: string (required); the name of the input table in the Table storage
- **`output`**: string (required); the name of the output CSV file
- **`maxTries`**: integer (optional); the max number of retries if an error occurs; the default is `5`
- **`incremental`**: boolean (optional); enables [Incremental Loading](https://help.keboola.com/storage/tables/#incremental-loading); the default is `false`
- **`incrementalFetchingKey`**: string (optional); the name of the key for [incremental fetching](https://help.keboola.com/components/extractors/database/#incremental-fetching)
- **`mode`**: enum (optional)
  - `mapping` (default) 
    - Row is exported using specified `mapping`.
  - `raw` 
    - Row is exported as plain JSON strings. 
    - Table will contain `PartitionKey`, `RowKey` and `data` columns.
- **`mapping`**: string; required for `mode` = `mapping`
  - It is used to map the row to one or more tables.
  - The same format is used as in the [MongoDB - configure-mapping](/components/extractors/database/mongodb/#configure-mapping).
  - See examples in the [MongoDB - Mapping Examples](/components/extractors/database/mongodb/mapping/).
  - For the details see the [keboola/php-csvmap](https://github.com/keboola/php-csvmap) library.

By default, the data source connector exports all rows and columns. It can be adjusted using the following settings:
- **`select`**: string (optional); e.g., `PartitionKey, RowKey, Name, Age`
  - For `raw` mode, `PartitionKey` and `RowKey` fields must be present in the query results.
- **`limit`**: integer (optional); the maximum number of exported rows; e.g., `500`
- **`filter`**: string (optional); [OData query $filter](https://docs.microsoft.com/en-us/azure/search/search-query-odata-filter); e.g., `RowKey ge '2' and age gt 17`
  
#### Examples

Raw mode -- full load:
```json
{
  "table": "my-table",
  "output": "output-table",
  "mode": "raw"
}
```

Mapping mode -- full load:
```json
{
  "table": "my-table",
  "output": "output-table",
  "mode": "mapping",
  "mapping": {
    "RowKey": {
      "type": "column",
      "mapping": {
        "destination": "rowKey",
        "primaryKey": true
      }
    },
    "updated_at": "updated_at",
    "business_name": "name",
    "result": "result"
  }
}
```

Raw mode -- incremental load:
```json
{
  "table": "my-table",
  "output": "output-table",
  "mode": "raw",
  "incremental": true,
  "incrementalFetchingKey": "updated_at"
}
```

Mapping mode -- incremental load:
```json
{
  "table": "my-table",
  "output": "output-table",
  "mode": "mapping",
  "mapping": {
    "RowKey": {
      "type": "column",
      "mapping": {
        "destination": "rowKey",
        "primaryKey": true
      }
    },
    "updated_at": "updated_at",
    "business_name": "name",
    "result": "result"
  },
  "incremental": true,
  "incrementalFetchingKey": "updated_at"
}
```

Raw mode -- custom filter:
```json
{
  "table": "my-table",
  "output": "output-table",
  "mode": "raw",
  "filter": "RowKey ge '2' and age gt 17"
}
```
