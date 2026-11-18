---
title: Data types reference
slug: 'storage/tables/data-types/reference'
description: 'Reference for column data types in Storage: base types, how to define a type, NULL handling per backend, and the data types in the table definition.'
---

Base types, NULL handling and the data types in the table definition, for [native data types](/storage/tables/data-types/).

## Base Types
Source data types are mapped to a destination using a **base type**. The current base types are `STRING`, `INTEGER`, `NUMERIC`, `FLOAT`, `BOOLEAN`, `DATE`, and `TIMESTAMP`. For example, a MySQL extractor may store a column with the data type `BIGINT`. This type is mapped to the `INTEGER` base type, ensuring high interoperability between components. 

For detailed mappings, please refer to the [conversion table](https://developers.keboola.com/extend/common-interface/manifest-files/out-tables-manifests-native-types/#data-type-conversions). You can also view the extracted data types in the [storage table](/storage/tables/) detail.

### How to Define Data Types

#### Using actual data types of the storage backend
For example, in the case of Snowflake, you can create a column with a specific type like `TIMESTAMP_NTZ` or `DECIMAL(20,2)`. This approach allows you to define all details of the data type, including precision and scale. An example of such a column definition in a table-definition API endpoint call might look like this:

```
{
  "name": "id",
  "definition": {
    "type": "DECIMAL",
      "length": "20,2",
      "nullable": false,
      "default": "999"
  }
}
```

#### Using Keboola-provided base types
Specifying native types using Keboola’s [base types](/storage/tables/data-types/#base-types) is ideal for component-provided types, as these are storage backend agnostic. This method ensures compatibility across different storage backends. Additionally, base types can also be used when defining tables via the table-definition API endpoint. The definition format is as follows:

```
{
  "name": "id",
  "basetype": "NUMERIC"
}
```

## Handling NULLs
Data can contain `NULL` values or empty strings, which are converted differently based on the processing backend.

### CSV Format: Unquoted vs Quoted Empty Values
In CSV files, there are two ways to represent an empty value:

- **Unquoted empty** (`,,`) — the field is completely absent between delimiters
- **Quoted empty** (`""`) — the field explicitly contains an empty string

This distinction matters because backends treat them differently.

### Backend Behavior

| CSV value | Snowflake (STRING) | BigQuery (STRING) | BigQuery (INT64/NUMERIC) |
|---|---|---|---|
| `,,` (unquoted empty) | `NULL` | `NULL` | `NULL` |
| `""` (quoted empty) | `NULL` | `’’` (empty string) | `NULL` |

**Key difference:** Snowflake converts both `,,` and `""` to `NULL` for string columns. BigQuery preserves `""` as an empty string for STRING columns but coerces it to `NULL` for numeric columns (since an empty string is not a valid number).

This means the **same CSV file** can produce different NULL semantics depending on the target column type in BigQuery. Numeric columns will have `NULL` where string columns will have an empty string, even though the source CSV value is the same.

**Note:** This is a behavior of BigQuery's CSV parser, not Keboola Storage. BigQuery does not provide any option (similar to Snowflake's `EMPTY_FIELD_AS_NULL`) to change how quoted empty strings are handled during CSV loading. There is no available workaround at the BigQuery level.

### The `treatValuesAsNull` Parameter
When importing data, you can use the `treatValuesAsNull` parameter to specify which values should be treated as `NULL`. For example, `treatValuesAsNull: [""]` tells the system to treat empty strings as `NULL`.

However, in BigQuery, this parameter maps to BigQuery’s native [`nullMarker`](https://cloud.google.com/bigquery/docs/loading-data-cloud-storage-csv#csv-options) CSV load option, which **only applies to unquoted CSV fields**. Quoted values bypass the null marker check entirely — this is a limitation of BigQuery’s CSV parser, not Keboola Storage.

In practice:

| CSV value | `treatValuesAsNull: [""]` | BigQuery STRING result |
|---|---|---|
| `,,` (unquoted empty) | matches null marker → **NULL** | `NULL` |
| `""` (quoted empty) | skipped (quoted) | `’’` (empty string) |

If your data source (e.g., a database extractor) writes `NULL` values as `""` instead of `,,`, string columns will contain empty strings instead of `NULL` in BigQuery, while numeric columns will still show `NULL` due to type coercion. To ensure correct NULL handling, the data source must represent NULL values as unquoted empty fields (`,,`) in the CSV.

### NULL and Incremental Loading
Columns without native types are always `VARCHAR NOT NULL`. This means you don’t need to worry about specific `NULL` behavior. However, this changes with typed columns. 

In most databases, `NULL` does not equal `NULL` (`NULL == NULL` is not `TRUE`, but `NULL`). This behavior can disrupt the incremental loading process, where columns are compared to detect changes.
 
To avoid such issues, ensure that your primary key columns are **not nullable**. This is especially relevant in `CTAS` (Create Table As Select) queries, where columns are nullable by default. To address this, explicitly define the columns as non-nullable in the `CTAS` expression. For example:

```
CREATE TABLE "ctas_table" (
    "id" NUMBER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP_NTZ NOT NULL
) AS SELECT * FROM "typed_table";
```

## Data Types in the Table Definition
The column data types of a [typed table](/storage/tables/data-types/) are part of the same table definition as the
descriptions. For each column the definition holds the `type`, `nullable` and, where they apply, `length` and
`default`, next to the column's `basetype`. The table detail returns them, and the
[table list](https://api.keboola.com/?service=storage#get-/v2/storage/branch/-branchId-/table-list) returns them
with `include=definition`. The stored type is the one the backend reports: a column created as `INT` on Snowflake
is returned with `type` `NUMBER`, `length` `38,0` and `basetype` `INTEGER`.

- **Non-typed tables:** the definition of a non-typed table carries descriptions only. Type information for
  such a table exists only as `KBC.datatype.*` [metadata](/storage/tables/#metadata), for example `KBC.datatype.basetype`.
- **Aliases:** an alias that synchronizes its columns with its source shows the types of the source table for
  the columns of the alias.
- **Table list:** for some tables the table list returns `definition` as `null`. Use the table detail for those
  tables; the [table list reference](https://api.keboola.com/?service=storage#get-/v2/storage/branch/-branchId-/table-list)
  lists the cases.

### Changing Column Definitions
The data type of a typed column cannot be changed. On Snowflake and BigQuery you can
[update the table definition](https://api.keboola.com/?service=storage#put-/v2/storage/branch/-branchId-/tables/-tableId-/definition)
to change some column properties. The table shows which alterations each backend supports:

| Alteration | Snowflake | BigQuery |
|---|---|---|
| Change the data type | No | No |
| Increase text length | Yes | Yes |
| Decrease text length | No | No |
| Increase numeric precision | Yes | Yes |
| Decrease numeric precision | No | No |
| Change numeric scale | No | Yes |
| Make a column nullable | Yes | Yes |
| Make a column required | Yes | No |
| Add a default | No | Yes |
| Change a default | No | Yes |
| Drop a default | Yes | Yes |

### Relation to KBC.datatype Metadata
For a typed table the definition is the source of truth for the types. Storage still keeps `KBC.datatype.*` copies
under the `storage` provider for compatibility, and `KBC.datatype.*` rows written by other providers do not change
the definition of a typed table. New integrations should read the types from the `definition` of the table, not from
the metadata.

**Next:** [CSV files →](/storage/tables/csv-files/)
