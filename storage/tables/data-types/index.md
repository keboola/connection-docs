---
title: Data Types
permalink: /storage/tables/data-types/
---

* TOC
{:toc}

Some components (especially extractors) store metadata about the table columns. For example, when a [DB extractor](/components/extractors/database/sqldb/)
loads a table from the source database, it also records the physical column types from that table.
These are stored with each table column and can be used later on when working with the table. For
example, the transformation [`COPY` mapping](/transformations/snowflake/#load-type) allows you to set data types for the tables inside
the transformations. Also, some writers, e.g., the [Snowflake writer](/components/writers/database/snowflake/) use
the table metadata to [pre-fill the table columns](/components/writers/database/snowflake/#table-configuration) configuration for you.

Even if a data type is available for a column, storage always creates internally all columns for table as text not null and null-able values are converted to empty strings (except for Exasol where everything is null). Keep this in mind
especially in [Transformations](/transformations/mappings/#output-mapping), where the output is always cast to text. This behavior can be changed in certain cases with feature [native datatypes](#native-datatypes).
The non-text column type is used only during a component (transformation or writer) execution.
The basic idea behind this is that a text type has the best interoperability, so this averts many issues (e.g., some 
date values stored in a MySQL database might not be accepted by a Snowflake database and vice-versa). 

## Base Types
Data types from a source are mapped to a destination using a **Base Type**. The current base types are
[`STRING`](#string), [`INTEGER`](#integer), [`NUMERIC`](#numeric), [`FLOAT`](#float), [`BOOLEAN`](#boolean), 
[`DATE`](#date), and [`TIMESTAMP`](#timestamp). This means that, for example, a MySQL extractor
may store the value `BIGINT` as a type of a column; that type maps to the `INTEGER` general type. When the Snowflake writer consumes this value, it will
read the general type `INTEGER` and choose a corresponding type for Snowflake, which happens to be also `INTEGER`.
This logic is again designed to ensure high interoperability between the components. See the [conversion table below](#data-type-conversions).

You view the extracted data types in the [Storage Table](/storage/tables/) detail:

{: .image-popup}
![Screenshot - View Column Data Type](/storage/tables/data-types/column-data-type.png)

You can also override the data type:

{: .image-popup}
![Screenshot - Set Column Data Type](/storage/tables/data-types/column-data-type-override.png)

When you use the table (e.g. in [Snowflake writer](/components/writers/database/snowflake/)), you'll see the data type you configured:

{: .image-popup}
![Screenshot - Set Column Data Type](/storage/tables/data-types/column-data-type-use.png)

Note that the column type setting is in all cases only a metadata setting. It has no effect on the actual 
stored data. The data is converted only at the point of writing/copying (e.g to transformation or writer). 
That means that you can extract an *integer* column, mark it as *timestamp* in Storage and write it as 
*integer* into a target database (though you'll be offered to write it as timestamp).

Through the corresponding [API](https://keboola.docs.apiary.io/#reference/metadata)
you access both the source and base type metadata.

## Data Type Conversions
As described above, the **source data type** is converted to a **base data type** which is stored in metadata storage. The base type is then converted to the **target data type**. The following tables show mappings for each base type. The mapping 
causes possible information loss (e.g. assigning `SMALLINT` to `INTEGER`). To minimize this, we also keep track of the data type 
size and transfer that if possible. For example that a `SMALLINT` column would be stored as base type `INTEGER` with size `2`. If the target database supports integer sizes, you will be offered to set the type in the target database as `INTEGER(2)`. 

### STRING
Base type `STRING` represents any textual type - both `CHARACTER VARYING` (or `VARCHAR`) and `TEXT` types are included.
Also the string base type is used for any other unrecognized type on input. That means in the following table the 
*source type* column is **not an exhaustive list**. It's a list of reasonable string types which are converted to string, all 
other unknown types are converted to string as well.

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
The `BOOLEAN` base type represents a true/false values.

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

### Native datatypes

As mentioned above, Keboola stores data in storage as text by default. Native datatypes feature breaks this paradigm. If this feature is enabled, data in storage are stored in columns which have datatypes as described in Keboola metadata. 

There are two options how typed tables can be created
1. manually using [tables-definition enpoint](https://keboola.docs.apiary.io/#reference/tables/create-table-definition/create-new-table-definition) and then loaded with data in output mapping. Datatypes used in this endpoint have to correspond with the storage backend which your project uses. Or you can use [BASETYPES](#base-types).
2. by a component which can provide information about columns datatypes
  - database extractors and transformations matching storage backend will create storage tables with same types
  - database extractors and transformations not matching backend will create storage tables using [BASETYPES](#base-types)
  - Other components will create non-typed table, where all columns have text type.

   **_NOTE:_**  Not all database extractors and transformations can produce basetypes.

   **_NOTE:_**  Some components may produce basetypes for columns and thus produce typed tables

#### Pros and cons
- **Pros**
  - Manipulation with such data is easier and un/loading can be faster.
  - There is no need for casting when using [Read-only IM](/storage/backends/byodb/#read-only-access-to-project-storage)
- **Cons**
  - Datatypes in typed tables are given and there is no way how it can be altered (neither UI nor API)

Table with native datatypes is labeled in UI with a badge:

{: .image-popup}
![Screenshot - Table with native datatypes](/storage/tables/data-types/typed-table.png)
