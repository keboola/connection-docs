---
title: /data/in/tables manifests
slug: 'extend/common-interface/manifest-files/in-tables-manifests'
---

An input table manifest stores metadata about a downloaded table from Storage Tables to the component’s working directory.
For example, a table
with the ID `in.c-docker-demo.data` will be downloaded into
`/in/tables/in.c-docker-demo.data.csv` (unless stated otherwise in the
[input mapping](/extend/common-interface/config-file/) and a manifest file
'/in/tables/in.c-docker-demo.data.csv.manifest' will be created with the following
contents:

```json
{
  "id": "in.c-docker-demo.data",
  "uri": "https://connection.keboola.com//v2/storage/tables/in.c-docker-demo.data",
  "name": "data",
  "primary_key": [],
  "created": "2015-01-25T01:35:14+0100",
  "last_change_date": "2015-01-25T01:35:14+0100",
  "last_import_date": "2015-01-25T01:35:14+0100",
  "table_metadata": {
    "KBC.createdBy.component.id": "keboola.python-transformation",
    "KBC.createdBy.configuration.id": "123456",
  },
  "column_metadata": {
    "id": [],
    "name": [],
    "text": []
  }
}
```

The `name` node refers to the name of the component configuration.
The `metadata` and `column_metadata` fields contain
Metadata for the table and its columns.
The `metadata` field corresponds to the [Table Metadata API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/tables/-id-/metadata).
The `column_metadata` field corresponds to the [Column Metadata API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/columns/-id-/metadata).