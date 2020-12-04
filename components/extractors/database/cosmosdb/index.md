---
title: Azure Cosmos DB
permalink: /components/extractors/database/cosmosdb/
---

* TOC
{:toc}

The Cosmos DB extractor allows you to fetch data from the NoSQL [Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction)
using the [SQL API](https://docs.microsoft.com/en-us/azure/cosmos-db/tutorial-query-sql-api). 
If your CosmosDB instance uses the [MongoDB API](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction), you should use the [MongoDB extractor](/components/extractors/database/mongodb/) instead.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **CosmosDB** extractor.  

Fill in the **Endpoint**, **Database ID** and **Key**. Then click **Save**.

{: .image-popup}
![Screenshot - Extractor configuration](/components/extractors/database/cosmosdb/config.png)

Click **Add Row** to add one or more [Configuration Rows](/components/#configuration-rows).

{: .image-popup}
![Screenshot - Extractor configuration](/components/extractors/database/cosmosdb/add-row.png)

Fill in the **name**, and optionally the **description**. Then click **Add Row**.

{: .image-popup}
![Screenshot - Extractor configuration](/components/extractors/database/cosmosdb/add-row-modal.png)

In the [Configuration Row](/components/#configuration-rows), fill in 
the [**Configuration Parameters**](#configuration-parameters). Then click **Save**. 

{: .image-popup}
![Screenshot - Extractor configuration](/components/extractors/database/cosmosdb/row-config.png)

### Configuration Parameters

- **`containerId`**: string (required); the ID of the Cosmos DB container
- **`output`**: string (required); the name of the output table in your bucket
- **`incremental`**: boolean (optional); enables [incremental loading](/storage/tables/#incremental-loading); the default is `false`
- **`incrementalFetchingKey`**: string (optional); the name of the key for [incremental fetching](/components/extractors/database/#incremental-fetching), e.g., `c.id`
- **`mode`**: enum (optional)
    - `mapping` (default) -- items are exported using specified `mapping`
    - `raw` - items are exported as plain JSON strings; the table will contain `id` and `data` columns
- **`mapping`**: string; required for `mode` = `mapping`
    - It is used to map the CosmosDB JSON item to one or more tables.
    - The same format is used as in the [MongoDB - configure-mapping](/components/extractors/database/mongodb/#configure-mapping).
    - See examples in the [MongoDB - Mapping Examples](/components/extractors/database/mongodb/mapping/).
    - For the details see the [keboola/php-csvmap](https://github.com/keboola/php-csvmap) library.
- **`maxTries`**: integer (optional); the max number of tries if an error occurs; the default is `5`
- **`ignoredKeys`**: array (optional) 
    - CosmosDB automatically adds some metadata keys when the item is inserted.
    - By default, the following keys are ignored: `["_rid", "_self", "_etag", "_attachments", "_ts"]`    

By default, the extractor exports all documents using **the generated SQL query**. 
The default query is `SELECT * FROM c`. The query can be modified with the following parameters:

- **`select`**: string (optional), e.g., `c.name, c.date`; the default is `*`; [read more](https://docs.microsoft.com/en-us/azure/cosmos-db/sql-query-select)
   - For `raw` mode the `id` field must be present in the query results.
- **`from`**: string (optional), e.g., `Families f`; the default is `c`; [read more](https://docs.microsoft.com/en-us/azure/cosmos-db/sql-query-from)
- **`sort`**: string (optional), e.g., `c.date`; [read more](https://docs.microsoft.com/en-us/azure/cosmos-db/sql-query-order-by)
- **`limit`**: integer (optional), e.g., `500`; [read more](https://docs.microsoft.com/en-us/azure/cosmos-db/sql-query-offset-limit)
    
Or you can set **a custom query** using the following parameter:

- **`query`**: string (optional), e.g., `SELECT f.name FROM Families f`

#### Examples 

Raw mode -- full load:
```json
{
  "containerId": "my-container",
  "output": "my-table",
  "mode": "raw"
}
```

Mapping mode -- full load:
```json
{
  "containerId": "my-container",
  "output": "my-table",
  "mode": "mapping", 
  "mapping": {
    "id": {
      "type": "column",
      "mapping": {
        "destination": "id",
        "primaryKey": true
      }
    },
    "business_name": "name",
    "result": "result",
    "address": {
      "type": "table",
      "destination": "city",
      "tableMapping": {
        "city": "name"
      }
    }
  }
}
```

Raw mode -- incremental load:
```json
{
  "containerId": "my-container",
  "output": "my-table",
  "mode": "raw",
  "incremental": true,
  "incrementalFetchingKey": "c.id"
}
```

Raw mode -- custom query:
```json
{
  "containerId": "my-container",
  "output": "my-table",
  "mode": "raw",
  "query": "SELECT f.name FROM Families f"
}
```
