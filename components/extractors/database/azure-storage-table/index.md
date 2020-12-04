---
title: Azure Storage Table
permalink: /components/extractors/database/azure-storage-table/
---

* TOC
{:toc}

The Azure Storage Table extractor allows you to fetch data from the:
- [Azure Table storage](https://azure.microsoft.com/en-us/services/storage/tables) or
- [Azure Cosmos DB Table API](https://docs.microsoft.com/en-us/azure/cosmos-db/table-introduction)

If you want to use:
- [Cosmos DB Mongo DB API](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction), use the [MongoDB extractor](/components/extractors/database/mongodb/).
- [Cosmos DB SQL API](https://docs.microsoft.com/en-us/azure/cosmos-db/tutorial-query-sql-api), use the [CosmosDB extractor](/components/extractors/database/cosmosdb/).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Azure Storage Table** extractor.  

Fill in the **Connection String**. Then click **Save**.

{: .image-popup}
![Screenshot - Extractor configuration](/components/extractors/database/azure-storage-table/config.png)

Click **Add Row** to add one or more [Configuration Rows](/components/#configuration-rows).

{: .image-popup}
![Screenshot - Extractor configuration](/components/extractors/database/azure-storage-table/add-row.png)

Fill in the **name**,  and optionally the **description**. Then click **Add Row**.

{: .image-popup}
![Screenshot - Extractor configuration](/components/extractors/database/azure-storage-table/add-row-modal.png)

In the [Configuration Row](/components/#configuration-rows) fill in 
the [**Configuration Parameters**](#configuration-parameters). Then click **Save**. 

{: .image-popup}
![Screenshot - Extractor configuration](/components/extractors/database/azure-storage-table/row.png)

### Configuration Parameters

- **`table`** - string (required): Name of the input table in the Table storage.
- **`output`** - string (required): Name of the output CSV file.
- **`maxTries`**- integer (optional): Number of the max retries if an error occurred. Default `5`.
- **`incremental`** - boolean (optional): Enables [Incremental Loading](https://help.keboola.com/storage/tables/#incremental-loading). Default `false`.
- **`incrementalFetchingKey`** - string (optional): Name of the key for [Incremental Fetching](https://help.keboola.com/components/extractors/database/#incremental-fetching).
- **`mode`** - enum (optional)
  - `mapping` (default) 
    - Row is exported using specified `mapping`.
  - `raw` 
    - Row is exported as plain JSON strings. 
    - Table will contain `PartitionKey`, `RowKey` and `data` columns.
- **`mapping`** - string - required for `mode` = `mapping`.
  - It is used to map the row to one or more tables.
  - The same format is used as in the [MongoDB - configure-mapping](/components/extractors/database/mongodb/#configure-mapping).
  - See examples in the [MongoDB - Mapping Examples](/components/extractors/database/mongodb/mapping/).
  - For the details see [keboola/php-csvmap](https://github.com/keboola/php-csvmap) library.

By default, extractor exports all rows and columns. It can be adjusted using these settings.
- **`select`** - string (optional), eg. `PartitionKey, RowKey, Name, Age`.
  - For `raw` mode must be `PartitionKey` and `RowKey` fields present in the query results.
- **`limit`** - integer (optional), maximum number of the exported rows, eg. `500`.
- **`filter`** - string (optional), [OData query $filter](https://docs.microsoft.com/en-us/azure/search/search-query-odata-filter), eg. `RowKey ge '2' and age gt 17`
  


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
