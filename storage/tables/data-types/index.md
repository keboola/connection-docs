---
title: Data Types
permalink: /storage/tables/data-types/
---

* TOC
{:toc}

Some components, especially extractors (data sources), store metadata about the table columns. For example, when a [DB extractor](/components/extractors/database/sqldb/)
loads a table from a source database, it also records the physical column types from that table.
These are stored with each table column and can be used later when working with the table. For
instance, transformation [`COPY` mapping](/transformations/snowflake/#load-type) allows you to set data types for the tables inside
the transformations. Also, some writers (data destinations), e.g., the [Snowflake writer](/components/writers/database/snowflake/), use
the table metadata to [pre-fill the table columns](/components/writers/database/snowflake/#table-configuration) configuration for you.

Even if a data type is available for a column, storage always internally creates all table columns as text, not null, and nullable values are converted to empty strings (except for Exasol, where everything is null). Remember this,
especially in [transformations](/transformations/mappings/#output-mapping), where the output is always cast to text. This behavior can sometimes be changed with the [native data types](#native-data-types) feature.
The non-text column type is used only during a component (transformation or writer) execution.
The basic idea behind this is that a text type has the best interoperability, so this averts many issues (e.g., some 
date values stored in a MySQL database might not be accepted by a Snowflake database and vice-versa). 

## Base Types
Source data types are mapped to a destination using a **base type**. The current base types are
[`STRING`](#string), [`INTEGER`](#integer), [`NUMERIC`](#numeric), [`FLOAT`](#float), [`BOOLEAN`](#boolean), 
[`DATE`](#date), and [`TIMESTAMP`](#timestamp). This means that, for example, a MySQL extractor
may store the value `BIGINT` as a type of column; that type maps to the `INTEGER` base type. When the Snowflake writer consumes this value, it will
read the base type `INTEGER` and choose a corresponding type for Snowflake, which happens to be also `INTEGER`.
This ensures high interoperability between the components. Please take a look at the [conversion table below](#data-type-conversions).

View the extracted data types in the [storage table](/storage/tables/) detail:

{: .image-popup}
![Screenshot - View Column Data Type](/storage/tables/data-types/column-data-type.png)

You can also override the data type:

{: .image-popup}
![Screenshot - Set Column Data Type](/storage/tables/data-types/column-data-type-override.png)

When you use the table (e.g., in the [Snowflake writer](/components/writers/database/snowflake/)), you'll see the data type you have configured:

{: .image-popup}
![Screenshot - Set Column Data Type](/storage/tables/data-types/column-data-type-use.png)

Note that the column type setting is, in all cases, only a metadata setting. It does not affect the actual 
stored data. The data is converted only when writing or copying (e.g., to a transformation or a writer). 
That means that you can extract an *integer* column, mark it as a *timestamp* in storage and write it as 
an *integer* into a target database (though you'll be offered to write it as a timestamp).

You access both the source and base type metadata through the corresponding [API](https://keboola.docs.apiary.io/#reference/metadata). 

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

## Native Data Types

Specific behavior depends on the [backend of your project](/storage/#storage-data). We'll be using the Snowflake backend as an example.

As mentioned above, Keboola stores data in Storage as text (`VARCHAR NOT NULL`) by default. With native types, data is stored in columns with an actual data type (`DATETIME`, `BOOLEAN`, `DOUBLE`, etc.) based on Keboola metadata. 

Tables with native data types are labeled in the user interface with a badge:

{: .image-popup}
![Screenshot - Table with native datatypes](/storage/tables/data-types/typed-table.png)

### How to Create a Typed Table

#### Manually via an API

A table with a type definition is created using the [tables-definition endpoint](https://keboola.docs.apiary.io/#reference/tables/create-table-definition/create-new-table-definition), and data is loaded into it. Data types used in this endpoint have to correspond with the storage backend which your project uses. Alternatively, you can use [base types](#base-types).

#### Output mapping of a component

A component may provide information about column data types in its data manifest. Database extractors and transformations matching the storage backend (e.g., Snowflake SQL transformation on the Snowflake storage backend) will create storage tables with the same types. The database extractors and transformations that do NOT match the backend will create storage tables using [base types](#base-types). 

_**Note:** When a table is created from base types, it uses default lengths and precisions of the target backend. For example, in Snowflake, this means, that the NUMBER base type is created as NUMBER(38,0), which might be unexpected if the source database column is NUMBER(10,2)._  

_To work around this limitation, you can create the table in advance manually using [Table Definition API](https://keboola.docs.apiary.io/#reference/tables/create-table-definition/create-new-table-definition) with the correct precisions. Subsequent jobs will write data to this table respecting your defintion as long as the structure matches. You will need to keep this in mind in case you need to drop and recreate the table. If you let a job create it, it will again use the incorrect type from the basetype._ 

For example, this is how you can create typed tables in a Snowflake SQL transformation that will be imported to storage as typed tables: 

```sql
-- create a table with datatypes
CREATE OR REPLACE TABLE "typed_table" (
    "id" NUMBER,
    "name" VARCHAR(255),
    "created_at" TIMESTAMP_NTZ
);

-- insert some data
INSERT INTO "typed_table"
VALUES
    (1, '75', '2020-01-01 00:00:00');

-- create another table with datatypes based on an existing table
CREATE OR REPLACE TABLE "typed_table_2" AS
SELECT
    "id"::varchar AS "string_id",
    "name"::number AS "numeric_name",
    "created_at"::date AS "typed_date"
FROM
    "typed_table";
```

***Note:** The data type hinting is the components' responsibility, so components must be updated by their respective authors to support this. The database extractors that are maintained by Keboola already provide data types. There is no list of components that support this feature. You may check the component's documentation to see if it supports native data types.* 

### How to Define Data Types

#### Using actual data types of the storage backend

For example, in the case of Snowflake, you can create a column of type `TIMESTAMP_NTZ` or `DECIMAL(20,2)`. This allows you to specify all the data type details, for instance, including precision and scale. But it's tied to the specific storage backend, and thus it's not portable.

An example of such a column definition in a table-definition API endpoint call is as follows:

```json
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

#### Using Keboola-provided [base types](#base-types)

Specifying native types using [base types](#base-types) is ideal for component-provided types as they are storage backend agnostic. However, they can be used for the table-definition API endpoint as well. The definition is as follows:

```json
{
  "name": "id",
  "basetype": "NUMERIC"
}
```

### Changing Types of Existing Typed Columns

**You can't change the type of column of a typed table once it has been created.** There are multiple ways to work around this. 

First, if the table is loaded using full load, you can drop the table and create a new table with the correct types and load the data there. 

If the table is loaded incrementally, you must create a new column and copy the data from the old one.

* You have a column `date` of type `VARCHAR` in a typed table, and you want to change it to `TIMESTAMP`.
* You first add a new column `date_timestamp` of type `TIMESTAMP` to the table.
* Then you change all the jobs filling the table to fill the new and old columns.
* Then you run an ad-hoc transformation, which will copy data from `date` to `date_timestamp` in the existing rows.
* Then you can slowly change all the places where `date` is used to use `date_timestamp` instead.
* When you only use the new column, the old one can be removed.

In both cases, check all the other configurations using the table to avoid any schema mismatch. This is especially important for data destination components (writers), where a table exists in the destination.

### Incremental Loading

When you load data incrementally, there is a difference between typed and non-typed tables. Typed tables only compare the columns of the table's primary key, while non-typed tables compare the whole row, updating rows where any value changes. This is described in detail in our documentation on [incremental loading](/storage/tables/#difference-between-tables-with-native-datatypes-and-string-tables).

### Handling NULLs

Columns without native types are always `VARCHAR NOT NULL`. This means you don't need to care about a specific NULL behavior. This changes with typed columns. In most databases, NULL does not equal NULL (`NULL == NULL` is not `TRUE`, but `NULL`). This breaks the incremental loading flow where columns are compared against each other.

For this reason, please make sure that your primary key columns are not nullable. This is most relevant in CTAS queries, where columns are nullable by default. To work around this, specify the columns as part of the CTAS expression. For example:

```sql
CREATE TABLE "ctas_table" (
    "id" NUMBER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP_NTZ NOT NULL
) AS SELECT * FROM "typed_table";
```

### Pros and Cons

- **Pros**
  - Loading into a workspace is significantly faster than loading into a table without native data types. Casting data is not necessary when loading into a workspace.
  - A table accessed in a workspace via the [read-only input mapping](https://help.keboola.com/transformations/workspace/#read-only-input-mapping) already has typed columns.
  - Data types are strictly enforced, ensuring that data in a specific column (like a number column) is consistent with its type.
- **Cons**
  - Changing a column type is complicated; see [How to Change Column Types](#changing-types-of-existing-typed-columns).
  - Keboola does not perform any type conversion during loading. Your data must exactly match the column type in the table in Storage.
  - Any load of data with incompatible types will fail.
  - The filtering option in the input mapping section is unavailable for tables with defined data types. If filtering is crucial for your workflow, consider using SQL, Python, or even no-code transformations to filter the data and create a new filtered table.
