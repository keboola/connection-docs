---
title: /data/out/tables manifests with Native Types
slug: 'extend/common-interface/manifest-files/out-tables-manifests-native-types'
---

Native Types provide a structured way for components to define their handling of data types, referred to as “Native Types.”

The level of type handling is specified by the dataTypeSupport property, which can take one of three values:
- Authoritative: The component reliably enforces specific data types.
- Hints: The component provides type suggestions that may not always be reliable.
- None: Represents the legacy state with no explicit type handling.

This design overcomes limitations in current settings, where all components automatically produce typed tables when a project switches to Native Types. For instance, Data Sources that output unreliable type hints (e.g., an int column containing values like N/A) can now explicitly signal their limitations, reducing downstream issues.

An output table manifest sets options for transferring a table to Storage. The following examples list available
manifest fields; **all of them are optional**. The `destination` field overrides the table name generated
from the file name; it can (and commonly is) overridden by the end-user configuration.

```json
{
    "destination": "out.c-main.Leads",
    "incremental": true,
    "delimiter": "\t",
    "enclosure": "\"",
    "manifest_type": "output",
    "has_header": true,
    "description": "Best table",
    "table_metadata": ...
    "schema": ...
}
```

The `table_metadata` fields allow you to set
Metadata for the table.
The `table_metadata` field corresponds to the [Table Metadata API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/tables/-id-/metadata).
The `key` and `value` of the object are passed directly to the API; the `provider` value is
filled by the Id of the running component (e.g., `keboola.ex-db-snowflake`).

```json
{
    ...
    "table_metadata": {
        "something else": "a value"
    }
}
```

Additionally, the following options will cause the specified rows to be deleted from the source table before the new
table is imported. See an [example](/extend/common-interface/config-file/#output-mapping---delete-rows).
Using this option makes sense only with [incremental loads](/components/extractors/generic-extractor/incremental/).

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

The `schema` [optional] field allow you to create a table with Native Data Types columns.
Each object in the `schema` array represents one column:
- The `name` [required] field specifies the column name.
- The `data_type` [optional] field defines the data type for different [storage backends](/storage/#storage-data), referred to as "Native Types".
  - The `base` [required] type is always required and can have values specified in the [Base Types documentation](/storage/tables/data-types/#base-types). 
  - Other types like Snowflake and BigQuery are optional and allows you to specify settings for a particular database backend.
- The `nullable` [optional] field indicates if the column can be null.
- The `primary_key` [optional] field specifies if the column is a primary key.
- The `description` [optional] field provides a description of the column.
- The `metadata` [optional] field allows setting additional metadata for the column.

```json
{
    "schema": [
        {
            "name": "id",
            "data_type": {
                "base": {
                    "type": "INTEGER",
                    "length": "11",
                    "default": "123"
                },
                "snowflake": {
                    "type": "GEOMETRY",
                    "length": "123,123,4455",
                    "default": "POINT(1 1)"
                },
                "bigquery": {
                    "type": "VARCHAR",
                    "length": "123",
                    "default": null
                }
            },
            "nullable": false,
            "primary_key": true,
            "description": "Optional description of the column",
            "metadata": {
                "KBC.someColumnMetadata": "value1"
                "KBC.someOther": "value2"
            }
        }
    ]
}
```

## Base Types
Source data types are mapped to a destination using a **base type**. The current base types are
[`STRING`](#string), [`INTEGER`](#integer), [`NUMERIC`](#numeric), [`FLOAT`](#float), [`BOOLEAN`](#boolean),
[`DATE`](#date), and [`TIMESTAMP`](#timestamp). This means that, for example, a MySQL extractor
may store the value `BIGINT` as a type of column; that type maps to the `INTEGER` base type. When the Snowflake writer consumes this value, it will
read the base type `INTEGER` and choose a corresponding type for Snowflake, which happens to be also `INTEGER`.
This ensures high interoperability between the components. Please take a look at the [conversion table below](#data-type-conversions).

View the extracted data types in the storage tables detail:

![Screenshot - View Column Data Type](/extend/common-interface/manifest-files/column-data-type.png)

You can also override the data type:

![Screenshot - Set Column Data Type](/extend/common-interface/manifest-files/column-data-type-override.png)

When you use the table (e.g., in the Snowflake writer), you'll see the data type you have configured:

![Screenshot - Set Column Data Type](/extend/common-interface/manifest-files/column-data-type-use.png)

The data is converted only when writing or copying (e.g., to a transformation or a writer).
That means that you can extract an *integer* column, mark it as a *timestamp* in storage and write it as
an *integer* into a target database (though you'll be offered to write it as a timestamp).

You access both the source and base data type through the corresponding [API](https://api.keboola.com/?service=storage#get-/v2/storage/branch/-branchId-/tables/-id-).

## Nullable Conversion
Nullable conversion, which transforms an empty string originating from data into a null value, refers to the process where a textual value consisting solely of an empty string `""` is replaced with the value null.

## Data Type Conversions
As described above, the **source data type** is converted to a **base data type** stored in metadata storage. The base type is then converted to the **target data type**. The following tables show mappings for each base type. The mapping
causes possible information loss (e.g., assigning `SMALLINT` to `INTEGER`). To minimize this, we also keep track of the data type
size and transfer that if possible. For example, a `SMALLINT` column would be stored as base type `INTEGER` with size `2`. If the target database supports integer sizes, you will be offered to set the type in the target database as `INTEGER(2)`.

### STRING
Base type `STRING` represents any textual type; both `CHARACTER VARYING` (or `VARCHAR`) and `TEXT` types are included.
Also, the string base type is used for any other unrecognized type on input. It means that the
*source type* column is **not an exhaustive list** in the following table. It's a list of suitable string types converted to a string. All
other unknown types are converted to a string as well.

<table>
<tr>
    <th>Source</th>
    <th>Source Type</th>
    <th>Base Type</th>
    <th>Target Type</th>
    <th>Target</th>
</tr>
<tr>
    <th rowspan='4'>Generic</th>
    <td>char</td>
    <td rowspan='35'>STRING</td>
    <td rowspan='4' colspan='2'>N/A</td>
</tr>
<tr>
    <td>character varying</td>
</tr>
<tr>
    <td>text</td>
</tr>
<tr>
    <td>varchar</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>STRING</td>
    <th>Hive</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>STRING</td>
    <th>Impala</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>TEXT</td>
    <th>MS SQL Server</th>
</tr>
<tr>
    <th rowspan='3'>MySQL</th>
    <td>CHAR</td>
    <td rowspan='3'>VARCHAR</td>
    <th rowspan='3'>MySQL</th>
</tr>
<tr>
    <td>TEXT</td>
</tr>
<tr>
    <td>VARCHAR</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>VARCHAR2</td>
    <th>Oracle</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>VARCHAR</td>
    <th>PostgreSQL</th>
</tr>
<tr>
    <th rowspan='8'>Redshift</th>
    <td>BPCHAR</td>
    <td rowspan='8'>VARCHAR</td>
    <th rowspan='8'>Redshift</th>
</tr>
<tr>
    <td>CHAR</td>
</tr>
<tr>
    <td>CHARACTER</td>
</tr>
<tr>
    <td>CHARACTER VARYING</td>
</tr>
<tr>
    <td>NCHAR</td>
</tr>
<tr>
    <td>NVARCHAR</td>
</tr>
<tr>
    <td>TEXT</td>
</tr>
<tr>
    <td>VARCHAR</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>VARCHAR</td>
    <th>SiSense</th>
</tr>
<tr>
    <th rowspan='7'>Snowflake</th>
    <td>BINARY</td>
    <td rowspan='7'>VARCHAR</td>
    <th rowspan='7'>Snowflake</th>
</tr>
<tr>
    <td>CHAR</td>
</tr>
<tr>
    <td>CHARACTER</td>
</tr>
<tr>
    <td>STRING</td>
</tr>
<tr>
    <td>TEXT</td>
</tr>
<tr>
    <td>VARBINARY</td>
</tr>
<tr>
    <td>VARCHAR</td>
</tr>
<tr>
    <th rowspan='6'>Synapse</th>
    <td>BINARY</td>
    <td rowspan='6'>NVARCHAR</td>
    <th rowspan='6'>Synapse</th>
</tr>
<tr>
    <td>CHAR</td>
</tr>
<tr>
    <td>NCHAR</td>
</tr>
<tr>
    <td>NVARCHAR</td>
</tr>
<tr>
    <td>VARBINARY</td>
</tr>
<tr>
    <td>VARCHAR</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>VARCHAR</td>
    <th>Thoughtspot</th>
</tr>
<tr>
    <th>Source</th>
    <th>Source Type</th>
    <th>Base Type</th>
    <th>Target Type</th>
    <th>Target</th>
</tr>
</table>

### INTEGER
The `INTEGER` base type represents data types for whole numbers.

<table>
<tr>
    <th>Source</th>
    <th>Source Type</th>
    <th>Base Type</th>
    <th>Target Type</th>
    <th>Target</th>
</tr>
<tr>
    <th rowspan='12'>Generic</th>
    <td>bigint</td>
    <td rowspan='42'>INTEGER</td>
    <td rowspan='12' colspan='2'></td>    
</tr>
<tr>
    <td>bigserial</td>
</tr>
<tr>
    <td>mediumint</td>
</tr>
<tr>
    <td>smallint</td>
</tr>
<tr>
    <td>int</td>
</tr>
<tr>
    <td>int2</td>
</tr>
<tr>
    <td>int4</td>
</tr>
<tr>
    <td>int64</td>
</tr>
<tr>
    <td>int8</td>
</tr>
<tr>
    <td>integer</td>
</tr>
<tr>
    <td>serial8</td>
</tr>
<tr>
    <td>tinyint</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>INT</td>
    <th>Hive</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>INT</td>
    <th>Impala</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>BIGINT</td>
    <th>MS SQL</th>
</tr>
<tr>
    <th rowspan='6'>MySQL</th>
    <td>BIGINT</td>
    <td rowspan='6'>INTEGER</td>
    <th rowspan='6'>MySQL</th>
</tr>
<tr>
    <td>INT</td>
</tr>
<tr>
    <td>INTEGER</td>
</tr>
<tr>
    <td>MEDIUMINT</td>
</tr>
<tr>
    <td>SMALLINT</td>
</tr>
<tr>
    <td>TINYINT</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>N/A</td>
    <th>Oracle</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>INTEGER</td>
    <th>Postgres</th>
</tr>
<tr>
    <th rowspan='7'>Redshift</th>
    <td>BIGINT</td>
    <td rowspan='7'>INTEGER</td>
    <th rowspan='7'>Redshift</th>
</tr>
<tr>
    <td>INT</td>
</tr>
<tr>
    <td>INT2</td>
</tr>
<tr>
    <td>INT4</td>
</tr>
<tr>
    <td>INT8</td>
</tr>
<tr>
    <td>INTEGER</td>
</tr>
<tr>
    <td>SMALLINT</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>BIGINT</td>
    <th>SiSense</th>
</tr>
<tr>
    <th rowspan='6'>Snowflake</th>
    <td>BIGINT</td>
    <td rowspan='6'>INTEGER</td>
    <th rowspan='6'>Snowflake</th>
</tr>
<tr>
    <td>BYTEINT</td>
</tr>
<tr>
    <td>INT</td>
</tr>
<tr>
    <td>INTEGER</td>
</tr>
<tr>
    <td>SMALLINT</td>
</tr>
<tr>
    <td>TINYINT</td>
</tr>
<tr>
    <th rowspan='4'>Synapse</th>
    <td>BIGINT</td>
    <td rowspan='4'>INT</td>
    <th rowspan='4'>Synapse</th>
</tr>
<tr>
    <td>INT</td>
</tr>
<tr>
    <td>SMALLINT</td>
</tr>
<tr>
    <td>TINYINT</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>INT</td>
    <th>Thoughtspot</th>
</tr>
<tr>
    <th>Source</th>
    <th>Source Type</th>
    <th>Base Type</th>
    <th>Target Type</th>
    <th>Target</th>
</tr>
</table>

### NUMERIC
The `NUMERIC` base type represents [fixed-point](https://en.wikipedia.org/wiki/Fixed-point_arithmetic) fractional numbers
(`real`, `numeric` or `decimal` data types).

<table>
<tr>
    <th>Source</th>
    <th>Source Type</th>
    <th>Base Type</th>
    <th>Target Type</th>
    <th>Target</th>
</tr>
<tr>
    <th rowspan='7'>Generic</th>
    <td>dec</td>
    <td rowspan='25'>NUMERIC</td>
    <td rowspan='7' colspan='2'></td>    
</tr>
<tr>
    <td>decimal</td>
</tr>
<tr>
    <td>fixed</td>
</tr>
<tr>
    <td>money</td>
</tr>
<tr>
    <td>number</td>
</tr>
<tr>
    <td>numeric</td>
</tr>
<tr>
    <td>smallmoney</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>DECIMAL</td>
    <th>Hive</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>DECIMAL</td>
    <th>Impala</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>DECIMAL</td>
    <th>MS SQL Server</th>
</tr>
<tr>
    <th rowspan='4'>MySQL</th>
    <td>DEC</td>
    <td rowspan='4'>NUMERIC</td>
    <th rowspan='4'>MySQL</th>
</tr>
<tr>
    <td>DECIMAL</td>
</tr>
<tr>
    <td>FIXED</td>
</tr>
<tr>
    <td>NUMERIC</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>NUMBER</td>
    <th>Oracle</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>NUMERIC</td>
    <th>PostgreSQL</th>
</tr>
<tr>
    <th rowspan='2'>Redshift</th>
    <td>DECIMAL</td>
    <td rowspan='2'>NUMERIC</td>
    <th rowspan='2'>Redshift</th>
</tr>
<tr>
    <td>NUMERIC</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>DECIMAL</td>
    <th>SiSense</th>
</tr>
<tr>
    <th rowspan='3'>Snowflake</th>
    <td>DECIMAL</td>
    <td rowspan='3'>NUMBER</td>
    <th rowspan='3'>Snowflake</th>
</tr>
<tr>
    <td>NUMBER</td>
</tr>
<tr>
    <td>NUMERIC</td>
</tr>
<tr>
    <th rowspan='2'>Synapse</th>
    <td>NUMERIC</td>
    <td rowspan='2'>NUMERIC</td>
    <th rowspan='2'>Synapse</th>
</tr>
<tr>
    <td>DECIMAL</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>N/A</td>
    <th>Thoughtspot</th>
</tr>
<tr>
    <th>Source</th>
    <th>Source Type</th>
    <th>Base Type</th>
    <th>Target Type</th>
    <th>Target</th>
</tr>
</table>

### FLOAT
The `FLOAT` base type represents [floating-point](https://en.wikipedia.org/wiki/Floating_point) fractional numbers
(`float` or `double` data types).

<table>
<tr>
    <th>Source</th>
    <th>Source Type</th>
    <th>Base Type</th>
    <th>Target Type</th>
    <th>Target</th>
</tr>
<tr>
    <th rowspan='10'>Generic</th>
    <td>binary_double</td>
    <td rowspan='34'>FLOAT</td>
    <td rowspan='10' colspan='2'></td>    
</tr>
<tr>
    <td>binary_float</td>
</tr>
<tr>
    <td>double</td>
</tr>
<tr>
    <td>double precision</td>
</tr>
<tr>
    <td>d_float</td>
</tr>
<tr>
    <td>float</td>
</tr>
<tr>
    <td>float4</td>
</tr>
<tr>
    <td>float8</td>
</tr>
<tr>
    <td>quad</td>
</tr>
<tr>
    <td>real</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>FLOAT</td>
    <th>Hive</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>FLOAT</td>
    <th>Impala</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>FLOAT</td>
    <th>MS SQL Server</th>
</tr>
<tr>
    <th rowspan='4'>MySQL</th>
    <td>DOUBLE</td>
    <td rowspan='4'>FLOAT</td>
    <th rowspan='4'>MySQL</th>
</tr>
<tr>
    <td>DOUBLE PRECISION</td>
</tr>
<tr>
    <td>FLOAT</td>
</tr>
<tr>
    <td>REAL</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>N/A</td>
    <th>Oracle</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>REAL</td>
    <th>PostgreSQL</th>
</tr>
<tr>
    <th rowspan='5'>Redshift</th>
    <td>DOUBLE PRECISION</td>
    <td rowspan='5'>FLOAT</td>
    <th rowspan='5'>Redshift</th>
</tr>
<tr>
    <td>FLOAT</td>
</tr>
<tr>
    <td>FLOAT4</td>
</tr>
<tr>
    <td>FLOAT8</td>
</tr>
<tr>
    <td>REAL</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>FLOAT</td>
    <th>SiSense</th>
</tr>
<tr>
    <th rowspan='6'>Snowflake</th>
    <td rowspan='6'>FLOAT</td>
    <td>DOUBLE</td>
    <th rowspan='6'>Snowflake</th>
</tr>
<tr>
    <td>DOUBLE PRECISION</td>
</tr>
<tr>
    <td>FLOAT</td>
</tr>
<tr>
    <td>FLOAT4</td>
</tr>
<tr>
    <td>FLOAT8</td>
</tr>
<tr>
    <td>REAL</td>
</tr>
<tr>
    <th rowspan='2'>Synapse</th>
    <td>FLOAT</td>
    <td rowspan='2'>FLOAT</td>
    <th rowspan='2'>Synapse</th>
</tr>
<tr>
    <td>REAL</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>FLOAT</td>
    <th>Thoughtspot</th>
</tr>
<tr>
    <th>Source</th>
    <th>Source Type</th>
    <th>Base Type</th>
    <th>Target Type</th>
    <th>Target</th>
</tr>
</table>

### BOOLEAN
The `BOOLEAN` base type represents a true or false value.

<table>
<tr>
    <th>Source</th>
    <th>Source Type</th>
    <th>Base Type</th>
    <th>Target Type</th>
    <th>Target</th>
</tr>
<tr>
    <th rowspan='2'>Generic</th>
    <td>bool</td>
    <td rowspan='14'>BOOLEAN</td>
    <td rowspan='2' colspan='2'></td>    
</tr>
<tr>
    <td>boolean</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>BOOLEAN</td>
    <th>Hive</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>BOOLEAN</td>
    <th>Impala</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>BIT</td>
    <th>MS SQL Server</th>
</tr>
<tr>
    <td>N/A</td>
    <th>MySQL</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>N/A</td>
    <th>Oracle</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>BOOLEAN</td>
    <th>PostgreSQL</th>
</tr>
<tr>
    <th rowspan='2'>Redshift</th>
    <td>BOOL</td>
    <td rowspan='2'>BOOLEAN</td>
    <th rowspan='2'>Redshift</th>
</tr>
<tr>
    <td>BOOLEAN</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>BIT</td>
    <th>SiSense</th>
</tr>
<tr>
    <th>Snowflake</th>
    <td>BOOLEAN</td>
    <td>BOOLEAN</td>
    <th>Snowflake</th>
</tr>
<tr>
    <th>Synapse</th>
    <td>BIT</td>
    <td>BIT</td>
    <th>Synapse</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>BOOL</td>
    <th>Thoughtspot</th>
</tr>
<tr>
    <th>Source</th>
    <th>Source Type</th>
    <th>Base Type</th>
    <th>Target Type</th>
    <th>Target</th>
</tr>
</table>

### DATE
The `DATE` base type represents a date value without a time portion.

<table>
<tr>
    <th>Source</th>
    <th>Source Type</th>
    <th>Base Type</th>
    <th>Target Type</th>
    <th>Target</th>
</tr>
<tr>
    <th>Generic</th>
    <td>date</td>
    <td rowspan='12'>DATE</td>
    <td>DATE</td>
    <td colspan='2'></td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>N/A</td>
    <th>Hive</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>N/A</td>
    <th>Impala</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>DATE</td>
    <th>MS SQL Server</th>
</tr>
<tr>
    <th>MySQL</th>
    <td>DATE</td>
    <td>DATE</td>
    <th>MySQL</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>DATE</td>
    <th>Oracle</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>DATE</td>
    <th>PostgreSQL</th>
</tr>
<tr>
    <th>Redshift</th>
    <td>DATE</td>
    <td>DATE</td>
    <th>Redshift</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>DATE</td>
    <th>SiSense</th>
</tr>
<tr>
    <th>Snowflake</th>
    <td>DATE</td>
    <td>DATE</td>
    <th>Snowflake</th>
</tr>
<tr>
    <th>Synapse</th>
    <td>DATE</td>
    <td>DATE</td>
    <th>Synapse</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>DATE</td>
    <th>Thoughtspot</th>
</tr>
<tr>
    <th>Source</th>
    <th>Source Type</th>
    <th>Base Type</th>
    <th>Target Type</th>
    <th>Target</th>
</tr>
</table>

### TIMESTAMP
The `TIMESTAMP` base type represents a date value with a time portion.

<table>
<tr>
    <th>Source</th>
    <th>Source Type</th>
    <th>Base Type</th>
    <th>Target Type</th>
    <th>Target</th>
</tr>
<tr>
    <th rowspan='12'>Generic</th>
    <td>datetime</td>
    <td rowspan='35'>TIMESTAMP</td>
    <td rowspan='12' colspan='2'></td>    
</tr>
<tr>
    <td>datetime2</td>
</tr>
<tr>
    <td>datetimeoffset</td>
</tr>
<tr>
    <td>smalldatetime</td>
</tr>
<tr>
    <td>timestamp</td>
</tr>
<tr>
    <td>timestamptz</td>
</tr>
<tr>
    <td>timestamp_LTZ</td>
</tr>
<tr>
    <td>timestamp_NTZ</td>
</tr>
<tr>
    <td>TIMESTAMP_TZ</td>
</tr>
<tr>
    <td>timestamp with local time zone</td>
</tr>
<tr>
    <td>timestamp with time zone</td>
</tr>
<tr>
    <td>timestamp without time zone</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>TIMESTAMP</td>
    <th>Hive</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>TIMESTAMP</td>
    <th>Impala</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>DATETIME2</td>
    <th>MS SQL Server</th>
</tr>
<tr>
    <th rowspan='2'>MySQL</th>
    <td>DATETIME</td>
    <td rowspan='2'>TIMESTAMP</td>
    <th rowspan='2'>MySQL</th>
</tr>
<tr>
    <td>TIMESTAMP</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>TIMESTAMP</td>
    <th>Oracle</th>
</tr>
<tr>
    <td colspan='2'></td>
    <td>TIMESTAMP</td>
    <th>PostgreSQL</th>
</tr>
<tr>
    <th rowspan='4'>Redshift</th>
    <td>TIMESTAMP</td>
    <td rowspan='4'>TIMESTAMP</td>
    <th rowspan='4'>Redshift</th>
</tr>
<tr>
    <td>TIMESTAMPTZ</td>
</tr>
<tr>
    <td>TIMESTAMP WITH TIME ZONE</td>
</tr>
<tr>
    <td>TIMESTAMP WITHOUT TIME ZONE</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>N/A</td>
    <th>SiSense</th>
</tr>
<tr>
    <th rowspan='5'>Snowflake</th>
    <td>DATETIME</td>
    <td rowspan='5'>TIMESTAMP</td>
    <th rowspan='5'>Snowflake</th>
</tr>
<tr>
    <td>TIMESTAMP</td>
</tr>
<tr>
    <td>TIMESTAMP_NTZ</td>
</tr>
<tr>
    <td>TIMESTAMP_LTZ</td>
</tr>
<tr>
    <td>TIMESTAMP_TZ</td>
</tr>
<tr>
    <th rowspan='5'>Synapse</th>
    <td>DATETIMEOFFSET</td>
    <td rowspan='5'>DATETIMEOFFSET</td>
    <th rowspan='5'>Synapse</th>
</tr>
<tr>
    <td>DATETIME</td>
</tr>
<tr>
    <td>DATETIME2</td>
</tr>
<tr>
    <td>SMALLDATETIME</td>
</tr>
<tr>
    <td>TIME</td>
</tr>
<tr>
    <td colspan='2'></td>
    <td>TIMESTAMP</td>
    <th>Thoughtspot</th>
</tr>
<tr>
    <th>Source</th>
    <th>Source Type</th>
    <th>Base Type</th>
    <th>Target Type</th>
    <th>Target</th>
</tr>
</table>
