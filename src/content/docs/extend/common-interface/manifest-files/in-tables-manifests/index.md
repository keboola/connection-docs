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
  "description": "My table description",
  "metadata": {
    "KBC.createdBy.component.id": "keboola.python-transformation",
    "KBC.createdBy.configuration.id": "123456"
  },
  "column_metadata": {
    "id": [],
    "name": [],
    "text": []
  },
  "schema": [
    {
      "name": "id",
      "data_type": {
        "base": {
          "type": "INTEGER"
        },
        "snowflake": {
          "type": "NUMBER",
          "length": "38,0"
        }
      },
      "nullable": false,
      "primary_key": true,
      "description": "Identifier of the record"
    },
    {
      "name": "name",
      "data_type": {
        "base": {
          "type": "STRING"
        },
        "snowflake": {
          "type": "VARCHAR",
          "length": "16777216"
        }
      },
      "nullable": true,
      "primary_key": false
    },
    {
      "name": "text",
      "data_type": {
        "base": {
          "type": "STRING"
        },
        "snowflake": {
          "type": "VARCHAR",
          "length": "16777216"
        }
      },
      "nullable": true,
      "primary_key": false
    }
  ]
}
```

The `name` node refers to the name of the component configuration.
The `metadata` and `column_metadata` fields contain
Metadata for the table and its columns.
The `metadata` field corresponds to the [Table Metadata API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/tables/-id-/metadata).
The `column_metadata` field corresponds to the [Column Metadata API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/columns/-id-/metadata).

The `description` field contains the table description. It is read primarily from the table's
native description field; when that field is empty, it falls back to the `KBC.description` value
in the table `metadata`. The field is omitted when no description is available.

The `schema` field describes the columns of the downloaded table, including their data types. It is
built from the [table definition](/storage/tables/data-types/). The columns it
lists, and their order, match the `columns` node. Each object in the `schema` array represents one column:
- The `name` field specifies the column name.
- The `data_type` field describes the column's data type. The `base` type is the backend-agnostic
  [base type](/storage/tables/data-types/#base-types); an additional key named
  after the table's [storage backend](/storage/#storage-data) (e.g., `snowflake`,
  `bigquery`) carries the type as it exists on that backend, together with its `length` and `default`
  when set. This field is omitted for columns that are not typed.
- The `nullable` field indicates whether the column can contain null values.
- The `primary_key` field indicates whether the column is part of the table's primary key.
- The `description` field contains the column description, read primarily from the column's native
  description field and falling back to its `KBC.description` metadata. It is omitted when no description
  is available.

The `schema` field uses the same structure as the
[output table manifest schema](/extend/common-interface/manifest-files/out-tables-manifests-native-types/).