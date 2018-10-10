---
title: HTTP
permalink: /extractors/storage/http/
redirect_from:
    - /extractors/other/http/
---

* TOC
{:toc}

This extractor loads a single CSV file from an HTTP/HTTPS URL and stores it in Storage.

## Create New Configuration

Find the HTTP extractor in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/extractors/storage/http/ui1.png)

## Set Base URL

Enter a base URL -- the prefix for all downloaded CSV files from a given website
*(for example, `https://help.keboola.com`; you can then test the extraction on our sample tables)*.

{: .image-popup}
![Screenshot - Base URL](/extractors/storage/http/ui2.png)

The base URL can also contain folder specification if the same folder is used for all files downloaded using this base URL.

## Add Tables

To create a new table, click the **New Table** button and assign a name.
It will be used to create the destination table name in Storage and can be modified.

{: .image-popup}
![Screenshot - Create table](/extractors/storage/http/ui3.png)

Each table has different settings (path, load type, etc.) but they all share the same base URL.

### Specify File to Download

For each table you have to specify a path that leads to a single CSV file or to an archive (GZ and ZIP are supported),
which will be imported into a single table in Storage. .

{: .image-popup}
![Screenshot - S3 Settings](/extractors/storage/http/ui5.png)

*(If you used our example base URL `https://help.keboola.com` and
want to load one of our tutorial tables, enter its path, e.g., /tutorial/opportunity.csv.)*


### Save Settings

{: .image-popup}
![Screenshot - Save Settings](/extractors/storage/http/ui6.png)

- The initial value in **Table Name** is derived from the configuration table name. You can change it at any time; however,
the [Storage bucket](/storage/buckets/) where the table will be saved to cannot be changed.
- **Incremental Load** will turn on [incremental loading to Storage](/storage/tables/#incremental-loading). The result of the
incremental load depends on other settings (mainly **Primary Key**).
- **Delimiter** and **Enclosure** specify the CSV settings.

### Header & Primary Key

{: .image-popup}
![Screenshot - Header & Primary Key](/extractors/storage/http/ui7.png)

There are three options for determining column names:

 - **Set header manually** --- This option enables the **Set Headers** input to manually specify all columns in the table.
 - **Read from the file(s) header** --- This option assumes that each file has a header on the first line.
 A random file will be chosen to extract the header and the first line in all files will be removed.
 - **Generate automatically** --- The columns will be named sequentially as `col_1`, `col_2` and so on.

**Primary Key** can be used to specify the primary key in Storage, which can be used with **Incremental Load**
and **New Files Only** to create a configuration that incrementally loads all new files into a table in Storage.

## List of Tables

The configuration can extract as many tables as you wish *(to add more test tables, use our other sample tables: /tutorial/account.csv, /tutorial/level.csv, and /tutorial/user.csv)*.

The list is fully searchable, and you can delete or disable each table. In addition, you can explicitly run an extraction of only one
table. The extraction order of the tables can be changed.

{: .image-popup}
![Screenshot - List tables](/extractors/storage/http/ui4.png)

## Advanced Mode

For more features, switch the configuration of each table to the **Power User Mode** by clicking the *Open JSON editor* link.

{: .image-popup}
![Screenshot - Advanced](/extractors/storage/http/ui8.png)

Through editing the full JSON configuration you can set up the component (all options
described in the [GitHub repository](https://github.com/keboola/http-extractor)) and also the
processors (to learn more about processors, see the [Developers Docs](https://developers.keboola.com/extend/docker-runner/processors/)).

Changing the JSON configuration may render the visual form unable to represent the configuration, and switching back may
be disabled. Reverting such changes will re-enable the visual form. But whenever possible, the JSON will translate back
to the visual form and vice versa.
