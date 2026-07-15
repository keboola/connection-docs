---
title: /data/out/tables manifests
slug: 'extend/common-interface/manifest-files/out-tables-manifests'
---

An output table manifest sets options for transferring a table to Storage. The following examples list available
manifest fields; **all of them are optional**. The `destination` field overrides the table name generated
from the file name; it can (and commonly is) overridden by the end-user configuration. The `columns` option defines
the columns of the imported table. If the `columns` option is provided, then the CSV files are **assumed to be headless**.
If you the component is producing [Sliced tables](/extend/common-interface/folders/#sliced-tables), then they are always
assumed to be headless and you *have to* use the `columns` option.

```json
{
  "destination": "out.c-main.Leads",
  "columns": ["column1", "column2", "column3"],
  "incremental": true,
  "primary_key": ["column1", "column2"],
  "delimiter": "\t",
  "enclosure": "\"",
  "metadata": ...,
  "column_metadata": ...
}
```

Additionally, the following options can be specified:

```json
{
  ...
  "delete_where": [
    {
      "where_filters": [
        {
          "column": "column name",
          "operator": "eq",
          "values_from_set": ["value1", "value2"]
        }
      ]
    }
  ]
}
```

The options will cause the specified rows to be deleted from the source table before the new
table is imported. See an [example](/extend/common-interface/config-file/#output-mapping---delete-rows).
Using this option makes sense only with [incremental loads](/extend/generic-extractor/incremental/).

The `metadata` and `column_metadata` fields allow you to set
Metadata for the table and its columns.
The `metadata` field corresponds to the [Table Metadata API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/tables/-id-/metadata).
The `column_metadata` field corresponds to the [Column Metadata API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/columns/-id-/metadata).
In both cases, the `key` and `value` are passed directly to the API; the `provider` value is
filled by the Id of the running component (e.g., `keboola.ex-db-snowflake`).

```json
{
  ...,
  "metadata": [
    {
      "key": "an.arbitrary.key",
      "value": "Some value"
    },
    {
      "key": "another.arbitrary.key",
      "value": "A different value"
    }
  ],
  "column_metadata": {
    "column1": [
      {
        "key": "yet.another.key",
        "value": "Some other value"
      }
    ]
  }
}
```
