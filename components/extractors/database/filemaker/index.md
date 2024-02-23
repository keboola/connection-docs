---
title: FileMaker
permalink: /components/extractors/database/filemaker/
---

* TOC
{:toc}

FileMaker is a cross-platform relational database application from Claris International.

Extract layout data from [FileMaker](https://www.claris.com/filemaker/) relational database via [FileMaker Data API](https://help.claris.com/en/data-api-guide/content/write-data-api-calls.html).


## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **FileMaker** Data Source (Extractor).


### Prepare the FileMaker database 

- Prepare your database for FileMaker Data API access, by [creating specific layouts](https://help.claris.com/en/data-api-guide/content/prepare-databases-for-access.html)
- Obtain FileMaker Data API credentials, host URL + username and password

### Authorization setup

Fill in the required authorization parameters:

 - `Host URL` of the FileMaker server. (base_url) - [REQ] Host url of the FileMaker instance
 - `User Name` (username) - [REQ] Username 
 - `Password` (#password) - [REQ] Password
 - `Verify SSL certificate` (ssl_verify) - [OPT] Set to false to disable SSL (https) certificate verification. Use with caution.


{: .image-popup}
![Screenshot - Authorization](/components/extractors/database/filemaker/image_auth.png)

**Save** the configuration and then click **Add Row** to create a new row configuration.


### Row configuration

Define what type of objects you wish to download and the Storage syncing options.

#### Object type

##### Metadata

{: .image-popup}
![Screenshot - Metadata](/components/extractors/database/filemaker/image_metadata.png)

Download schemas of selected layouts. Provide list of Database and Layout names which you like to get the metadata of. 

**NOTE** You can leave the list empty to get metadata of all available objects.

##### Layout

{: .image-popup}
![Screenshot - Metadata](/components/extractors/database/filemaker/image_layout.png)

Download data of particular layout with specified query


**Parameters:**

- `Database` (database) - [OPT] FileMaker database name
- `FileMaker layout name` (layout_name) - [OPT] Name of the Layout
- `Query Group` (query) - [OPT] Groups of filter criteria. 'OR' logical operation is applied to each group. 'AND' logical operation is applied to each set of queries. Note that if you include field used for incremental fetching, the incremental fetching will not work as expected.
  - For more information on the syntax see the [documentation](https://fmhelp.filemaker.com/help/18/fmp/en/#page/FMP_Help%2Ffinding-ranges.html%23)
- `Load Type` (incremental) - Defines a way how he result is stored in the Storage.
  - `Full load` - data in destination are overwritten each run
  - `Incremental Update` - data in destination are upserted each run.
- `Primary key` (pkey) - list of primary key columns if present. Needed for incremental load type
- `Incremental fetching` (incremental_fetch) - If true each consecutive run will return only records with values >= than the highest incremental fields values from last run.
- `Incremental fields` (incremental_fields) - List of columns used for incremental fetching. If multiple specified AND relation is used.
- Page size (page_size) - [OPT] Number of records retrieved in single API call. Note that to large page size may affect load on the destination database


Output
======

**NOTE** The columns prefixed `_` are prefixed with hsh prefix in the result table. 
This is because the Keboola Storage does not allow to store columns prefixed with underscore. So the column `_Timestamp` will be stored as `hsh_Timestamp` in the resulting table.


### Metadata Tables


#### `layouts`

- List of available layouts

columns: [`table`, `layout_name`, `parent_layout_name`] 

  
#### `layout_fields_metadata`

-  Schema and metadata describing the particular layout.

columns: [ `displayType`,
	`repetitionEnd`,
	`numeric`,
	`maxCharacters`,
	`maxRepeat`,
	`fourDigitYear`,
	`layout_name`,
	`database_name`,
	`type`,
	`repetitionStart`,
	`autoEnter`,
	`name`,
	`global`,
	`result`,
	`notEmpty`,
	`timeOfDay`]


### Layouts Tables

Layout data defined by the particular query definition.