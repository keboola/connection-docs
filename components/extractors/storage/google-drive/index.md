---
title: Google Drive
permalink: /components/extractors/storage/google-drive/
redirect_from:
    - /extractors/storage/google-drive/

---

* TOC
{:toc}

This extractor loads sheets from Google Drive Sheets and stores them as tables in a bucket in your
current project.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Google Drive** extractor.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 

Click **New Sheet** to configure extraction and **Select spreadsheet** to list accessible spreadsheets 
in your account:

{: .image-popup}
![Screenshot - Empty configuration](/components/extractors/storage/google-drive/google-drive-1.png)

You may be asked once again to log in. In that case, use the same account in which you authorized the first step of the setup.
Choose the document you want to import:

{: .image-popup}
![Screenshot - Select document](/components/extractors/storage/google-drive/google-drive-2.png)

The sheets of the selected document are shown; you can select which sheets you want to import:

{: .image-popup}
![Screenshot - Select sheet](/components/extractors/storage/google-drive/google-drive-3.png)

## Modify Configuration
When a sheet is added to the extractor, it is displayed in the list of extracted sheets:

{: .image-popup}
![Screenshot - Sheet list](/components/extractors/storage/google-drive/google-drive-4.png)

Configured tables are stored as [configuration rows](/components/#configuration-rows).
The list shows the name (and the link) of the imported document and sheet, and also the name of the destination
table in [Storage](/storage/). You can modify the destination table name by editing the sheet extraction.

## Advanced Configuration
When editing the sheet extraction configuration, you may **Enable Output Processor** for advanced options:

{: .image-popup}
![Screenshot - Advanced options](/components/extractors/storage/google-drive/google-drive-5.png)

The options will be demonstrated on the following table:

|ID|Manufacturer|Model|Axles|Wheels|Length|
|---|---|---|---|---|---|
|1|British Motor Corporation|Mini|2|4|3054|
|2|General Motors|PD-4501 Scenicruiser|3|10|12190|
|3|Reliant Motor Company|Reliant Robin|2|3|3327|
|4|Associated Equipment Company|Routemaster|2|4|8400|
|5|BMW|Isetta|2|3|2285|

### Number of Header Rows
This option allows you to set the index of the first data row. The row before that is the header row used to import the table.
Using this option allows you to import tables which contain text before the actual table, tables with merged rows in
the header, or tables with strange data in headers (e.g., pictures).
For example, when *Number of header rows* is set to `1`, the example table will be imported as follows:

|ID|Manufacturer|Model|Axles|Wheels|Length|
|---|---|---|---|---|---|
|1|British Motor Corporation|Mini|2|4|3054|
|2|General Motors|PD-4501 Scenicruiser|3|10|12190|
|3|Reliant Motor Company|Reliant Robin|2|3|3327|
|4|Associated Equipment Company|Routemaster|2|4|8400|
|5|BMW|Isetta|2|3|2285|

Data starts at the row with index = 1, the row before that (index = 0) is the header row.

When set to `4`, the table import will fail, and the attempted import table (available from [Files](/storage/files/))
will look as follows:

|empty|Reliant_Motor_Company|Reliant_Robin|empty|empty|3327|
|---|---|---|---|---|---|
|4|Associated Equipment Company|Routemaster|2|4|8400|
|5|BMW|Isetta|2|3|2285|

Data starts at the row with index = 4, the row before that (index = 3) is the header row. The header row values are sanitized to acceptable
column names. That means that numbers are turned into the string `empty` and the import fails because of duplicated column names.
This can be fixed with the following option.

### Header Column Names
This options allows you to specify destination table column names. This effectively means that the header row read from
the source sheet is ignored. Using this option allows you to import partial tables, tables with some strange column names
(where the automatic sanitization fails), tables with empty or duplicate column names, etc.

{: .image-popup}
![Screenshot - Advanced options - Headers](/components/extractors/storage/google-drive/google-drive-6.png)

With the above setting and the sample sheet, the following destination table will be created:

|ID|Manufacturer|Model|Number_of_axles|Number_of_wheels|Length_mm|
|---|---|---|---|---|---|
|4|Associated Equipment Company|Routemaster|2|4|8400|
|5|BMW|Isetta|2|3|2285|

### Transpose Header Row Number
This option has no effect.

### Transpose from Column
This option enables table transformation into a key-value table. For example, with setting `1`, the following table will be extracted:

|key|value|
|---|---|
|ID|1|
|Manufacturer|British Motor Corporation|
|Model|Mini|
|Axles|2|
|Wheels|4|
|Length|3054|
|ID|2|
|Manufacturer|General Motors|
|Model|PD-4501 Scenicruiser|
|Axles|3|
|Wheels|10|
|Length|12190|
|...|...|


This means that all columns beginning with the first one were turned into key-value pairs.
Setting the value to `4` will produce the following table:

|ID|Manufacturer|Model|key|value|
|---|---|---|---|---|---|
|1|British Motor Corporation|Mini|Axles|2|
|1|British Motor Corporation|Mini|Wheels|4|
|1|British Motor Corporation|Mini|Length|3054|
|2|General Motors|PD-4501 Scenicruiser|Axles|3|
|2|General Motors|PD-4501 Scenicruiser|Wheels|10|
|2|General Motors|PD-4501 Scenicruiser|Length|12190|
|3|Reliant Motor Company|Reliant Robin|Axles|2|
|3|Reliant Motor Company|Reliant Robin|Wheels|3|
|3|Reliant Motor Company|Reliant Robin|Length|3327|
|4|Associated Equipment Company|Routemaster|Axles|2|
|4|Associated Equipment Company|Routemaster|Wheels|4|
|4|Associated Equipment Company|Routemaster|Length|8400|
|5|BMW|Isetta|Axles|2|
|5|BMW|Isetta|Wheels|3|
|5|BMW|Isetta|Length|2285|

This means that the columns of the original table beginning with the fourth column (`Axles`) are converted to
key-value rows.

*Note: Rows are numbered from zero, i.e., a typical header is at the row with index = 0, and data start at the row with index = 1. 
Columns are always numbered from 1 (there are no headers).*

### Transposed Header Column Name
When table transformation is enabled ([**Transpose from column**](#transpose-from-column) greater than `0`)
and [**Number of header rows**](#number-of-header-rows) is greater than `1`, the transformation produces an extra column. 
The name of this column is specified in [**Transposed header column name**](#transposed-header-column-name).

{: .image-popup}
![Screenshot - Advanced options Header row column](/components/extractors/storage/google-drive/google-drive-7.png)

With [**Transpose from column**](#transpose-from-column) set to `1`, [**Number of header rows**](#number-of-header-rows) set to `2` and
[**Transposed header column name**](#transposed-header-column-name) set to `second`, a table which doesn't make much sense will be produced:

<details>
  <summary>Click to see the table.</summary>
    <table>
    <thead><tr><th>key</th><th>value</th><th>second</th></tr></thead>
    <tbody>
        <tr><td>British Motor Corporation</td><td>General Motors</td><td>Manufacturer</td></tr>
        <tr><td>3054</td><td>12190</td><td>Length</td></tr>
        <tr><td>2</td><td>2</td><td>Axles</td></tr>
        <tr><td>British Motor Corporation</td><td>Associated Equipment Company</td><td>Manufacturer</td></tr>
        <tr><td>3054</td><td>8400</td><td>Length</td></tr>
        <tr><td>2</td><td>2</td><td>Axles</td></tr>
        <tr><td>Mini</td><td>PD-4501 Scenicruiser</td><td>Model</td></tr>
        <tr><td>1</td><td>3</td><td>Id</td></tr>
        <tr><td>4</td><td>3</td><td>Wheels</td></tr>
        <tr><td>Mini</td><td>Routemaster</td><td>Model</td></tr>
        <tr><td>1</td><td>5</td><td>Id</td></tr>
        <tr><td>4</td><td>3</td><td>Wheels</td></tr>
        <tr><td>2</td><td>3</td><td>Axles</td></tr>
        <tr><td>British Motor Corporation</td><td>Reliant Motor Company</td><td>Manufacturer</td></tr>
        <tr><td>3054</td><td>3327</td><td>Length</td></tr>
        <tr><td>2</td><td>2</td><td>Axles</td></tr>
        <tr><td>British Motor Corporation</td><td>BMW</td><td>Manufacturer</td></tr>
        <tr><td>3054</td><td>2285</td><td>Length</td></tr>
        <tr><td>1</td><td>2</td><td>Id</td></tr>
        <tr><td>4</td><td>10</td><td>Wheels</td></tr>
        <tr><td>Mini</td><td>Reliant Robin</td><td>Model</td></tr>
        <tr><td>1</td><td>4</td><td>Id</td></tr>
        <tr><td>4</td><td>4</td><td>Wheels</td></tr>
        <tr><td>Mini</td><td>Isetta</td><td>Model</td></tr>
    </tbody>
    </table>
</details>

<br>

Let's consider a table modified to have two header rows:

|Car|Manufacturer|Manufacturer|Car|Car|Car|
|Id|Name|Model|Axles|Wheels|Length|
|---|---|---|---|---|---|
|1|British Motor Corporation|Mini|2|4|3054|
|2|General Motors|PD-4501 Scenicruiser|3|10|12190|
|3|Reliant Motor Company|Reliant Robin|2|3|3327|
|4|Associated Equipment Company|Routemaster|2|4|8400|
|5|BMW|Isetta|2|3|2285|

The `second` column now contains the row preceding the actual header row which was transformed into the `key`
column, i.e., the column class.

|key|value|second|
|---|---|---|
|Name|British Motor Corporation|Manufacturer|
|Length|3054|Car|
|Axles|3|Car|
|Name|Reliant Motor Company|Manufacturer|
|Length|3327|Car|
|Axles|2|Car|
|Name|BMW|Manufacturer|
|Length|2285|Car|
|Model|Mini|Manufacturer|
|ID|2|Car|
|Wheels|10|Car|
|Model|Reliant Robin|Manufacturer|
|ID|4|Car|
|Wheels|4|Car|
|Model|Isetta|Manufacturer|
|Axles|2|Car|
|Name|General Motors|Manufacturer|
|Length|12190|Car|
|Axles|2|Car|
|Name|Associated Equipment Company|Manufacturer|
|Length|8400|Car|
|Axles|2|Car|
|ID|1|Car|
|Wheels|4|Car|
|Model|PD-4501 Scenicruiser|Manufacturer|
|ID|3|Car|
|Wheels|3|Car|
|Model|Routemaster|Manufacturer|
|ID|5|Car|
|Wheels|3|Car|
