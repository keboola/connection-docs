---
title: Tableau TDE
permalink: /writers/bi-tools/tableau/
redirect_from:
    - /writers/tableau/
---

* TOC
{:toc}

There is a wide range of options for sending data to the Tableau ecosystem. This writer creates
[Tableau Data Extract (TDE)](https://www.tableau.com/about/blog/2014/7/understanding-tableau-data-extracts-part1)
files and optionally uploads them to a destination (Tableau Server,
[Dropbox](https://www.dropbox.com/), [Google Drive](https://www.google.com/drive/)). As such it is more suitable
to be used together with [Tableau Desktop](https://www.tableau.com/products/desktop) or
[Tableau Server](https://www.tableau.com/products/server). An alternative approach is to send data using the
**[Snowflake writer](/writers/database/snowflake/)** through a
[Keboola provisioned database](/writers/database/snowflake/#using-keboola-provisioned-database). That is more suitable to be used
together with [Tableau Online](https://www.tableau.com/products/cloud-bi) and also for larger data sets.
Both approaches are interchangeable though.

Our Getting Started tutorial will guide you through the process of [writing data
from KBC to Tableau](/tutorial/write/). You can also watch our [Tableau Integration Demo](https://www.youtube.com/watch?v=FS1nndJ0vyQ) on YouTube.

## Create New Configuration
Find the Tableau writer in the list of writers and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/writers/bi-tools/tableau/ui1.png)

## Configure Tables
Create a new table configuration by clicking the **New Table** button. Select a table
from [Storage](/storage/tables/).

{: .image-popup}
![Screenshot - Select Table](/writers/bi-tools/tableau/select-table.png)

When you start configuring a table, it is possible to set all columns to the prevailing data type, e.g. `string` and
then configure only the differing columns.

{: .image-popup}
![Screenshot - Table Configuration Start](/writers/bi-tools/tableau/table-config-start.png)

For each column you may select one of the data types supported by
TDE (`string`, `boolean`, `number`, `decimal`, `date`, `datetime`) or `IGNORE`, which means that the column will not
be part od the TDE file. When configuring the data types, use the *Preview* icon to peek at the data. For `date` and
`datetime` columns, you also have to specify the format in which dates are present in the table.

{: .image-popup}
![Screenshot - Table Configuration Columns](/writers/bi-tools/tableau/table-config-columns.png)

As optional last steps in table configuration, you can configure the name of the TDE file (useful for uploading to Dropbox or Google Drive)
and *Table data filter*. The table data filter allows you to set a simple file for one column or
take advantage of [Incremental processing](https://help.keboola.com/storage/tables/#incremental-processing) by writing only
recently modified data.

{: .image-popup}
![Screenshot - Table Configuration Additional Settings](/writers/bi-tools/tableau/table-config-end.png)

When done with configuring the table, don't forget to **Save** the settings.

## Downloading the TDE file
You can configure as many tables as you want for the writer. Each table produces a separate TDE file, however. To download
the TDE file, you have to **Run** the entire writer or a single table. Then the TDE file name will turn into a link through
which you can download the TDE file to your computer.

{: .image-popup}
![Screenshot - TDE Download](/writers/bi-tools/tableau/tde-download.png)

## Uploading the TDE file
Apart from downloading the TDE files to your computer, you can also upload them to Tableau Server, Google Drive, or Dropbox.
Start the upload configuration by clicking on the **Upload Setup** link:

{: .image-popup}
![Screenshot - Upload Setup](/writers/bi-tools/tableau/ui2.png)

Then select the destination service. You can change the destination later, but only one destination can be used for one
writer configuration.

{: .image-popup}
![Screenshot - Upload Destination](/writers/bi-tools/tableau/select-destination.png)

For [Dropbox](https://www.dropbox.com/) and [Google Drive](https://www.google.com/drive/) configurations click the
**Authorize** button to sign-in into the respective service.

{: .image-popup}
![Screenshot - Google Drive / Dropbox Authorization](/writers/bi-tools/tableau/authorization.png)

For Google Drive, you may also select the destination
folder. For Dropbox, the destination folder is always `Apps\Keboola Connection Writer V2\`.
For writing to Tableau Server, you need to enter the credentials:

{: .image-popup}
![Screenshot - Tableau Server Authorization](/writers/bi-tools/tableau/tableau-server-auth.png)

To activate the table upload, click the *Enable instant upload* link. Only when **Instant Upload** is enabled, the
TDE files will be written to the selected destination.

{: .image-popup}
![Screenshot - Authorized](/writers/bi-tools/tableau/authorized.png)
