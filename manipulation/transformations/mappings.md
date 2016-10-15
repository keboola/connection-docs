---
title: Input and Output Mapping
permalink: /manipulation/transformations/mappings/
---

*To see how input and output mappings are created and used in creating a transformation, 
go to our [Getting Started tutorial](/tutorial/manipulation/).*

* TOC
{:toc}

To make sure your SQL code or script does not harm the source tables, the input and output mapping **separates** 
the source data from your transformation, creating a **secure workspace with data copied** from the tables 
specified in the input mappings. 

Apart from the transformation script, which defines what happens with data, 
[creating a transformation](/tutorial/manipulate/) requires you to fill in also

1. **Input Mapping** — what Storage tables are used in your transformation; 
tables not mentioned in *Input Mapping* cannot be used in the transformation. 
2. **Output Mapping** — what tables are written into Storage after running the transformation; 
tables not mentioned in *Output Mapping* are never modified nor permanently stored (i.e. they are temporary). 
They are deleted permanently from the transformation workspace when the execution finishes. 

{: .image-popup}
![Simple input and output mapping](/manipulation/transformations/mappings.png)

### Input Mapping

The input mapping defines data you have in Storage and want to use in a transformation. 
This data will be made available as a table for SQL, or as a CSV file for R and Python.

{: .image-popup}
![Input mapping](/manipulation/transformations/input-mapping.png)

Any input mapping has the following options:

- **Source** -- Identify a table in Storage
- **File name**/**Destination** - A destination file name for your script, or a table name for your SQL; file names should end with `.csv`
- **Columns** -- Select specific columns if you do not want to import them all; this saves processing time for larger tables
- **Days** -- If you are into incremental processing, this comes in handy; import only rows changed during a given number of days (`0` downloads all)
- **Data filter** -- Download only rows that will match this single column multiple values filter

You can combine these options freely. Input mappings for Snowflake, MySQL and Redshift include more options specific to the particular backend:

- **Data types** (MySQL, Redshift, Snowflake) -- Data type for each column (Redshift allows to set a [column compression type](http://docs.aws.amazon.com/redshift/latest/dg/t_Compressing_data_on_disk.html) as well)
- **Indexes** (MySQL) -- Create indexes on the destination table
- **Sort key** (Redshift) -- Table [sort key](http://docs.aws.amazon.com/redshift/latest/dg/t_Sorting_data.html)
- **Dist key** (Redshift) -- Table [distribution key](http://docs.aws.amazon.com/redshift/latest/dg/t_Distributing_data.html) and  [distribution style](http://docs.aws.amazon.com/redshift/latest/dg/c_choosing_dist_sort.html)
- **COPY options** (Redshift) -- Specifies options for the Redshift [COPY command](http://docs.aws.amazon.com/redshift/latest/dg/r_COPY.html)


### Output Mapping

The output mapping takes results (tables and files) from your transformation and stores them back in Storage. It can create, overwrite, and append any table. 
These tables are typically derived from the tables/files in the Input mapping. In SQL transformations, 
you can use any `CREATE TABLE`, `CREATE VIEW`, `INSERT`, `UPDATE` or `DELETE` queries to create the desired result.

{: .image-popup}
![Output mapping](/manipulation/transformations/output-mapping.png)

An output mapping has the following options:

- **Source** -- Either a table name in the transformation database or a file name (including `.csv`)
- **Destination** -- Identify a table in Storage
- **Incremental** -- If the destination table already exists, it is not overwritten, but resulting data are appended to it. 
- **Primary key** -- The primary key of the destination table; if the table already exists, the primary key must match. Feel free to use a multi-column primary key.
- **Delete rows** -- Delete rows matching the criteria from the destination table before importing the data

