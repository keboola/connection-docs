---
title: FTP extractor
permalink: /extractors/storage/ftp/
---

* TOC
{:toc}

The FTP extractor loads a single, or multiple CSV files from FTP, FTPS and SFTP servers, and stores them in Keboola Connection Storage.

## Create New Configuration
Find the FTP extractor in the list of extractors and create a new configuration.
Name it.

{: .image-popup}
![Screenshot - FTP extractor create](/extractors/storage/ftp/ftp-ex-1.png)

## Set Credentials
To access the files on FTP, you need to set up access credentials.

{: .image-popup}
![Screenshot - FTP extractor server configuration](/extractors/storage/ftp/ftp-ex-2.png)

You can use a private key for the **SFTP** connection type. If you fill in the private key,
the extractor will use it for login instead of the password. You can also change
the port for each connection method. The default port for **FTP** and **FTPS** is **21**, and for **SFTP**, it is **22**.

## Add Tables
To create a new table, click the **New Table** button and assign a name. It will
be used to create the destination table name in Storage and can be modified.

{: .image-popup}
![Screenshot - FTP extractor create table](/extractors/storage/ftp/ftp-ex-3.png)

## List Tables
The configuration can extract as many tables as you wish. The list is fully
searchable, and you can delete or disable each table. In addition, you can
explicitly run extraction of only one table. The extraction order of the tables
can be changed.

{: .image-popup}
![Screenshot - FTP extractor list tables](/extractors/storage/ftp/ftp-ex-4.png)

## Modify Table
Each table has a different setting, but all tables share the same credentials to the server.

### Specify Files to Download
For each table, you have to specify a path. Use the path to a specific file, or
use the glob syntax (for testing the glob path, you can use the [Glob tester](http://www.globtester.com/)).
If you want to list inside subdirectories (e.g., `/dir/**/*.csv`), please make sure that your FTP server
supports a recursive list of directories.

{: .image-popup}
![Screenshot - FTP extractor download settings](/extractors/storage/ftp/ftp-ex-5.png)

- **New Files Only**: The extractor will keep track of downloaded files and will continue with the unprocessed files
 on the next run.
 - **Decompress**: All downloaded files will be decompressed (currently supporting ZIP and GZIP). All files in all archives
 will be imported into a single Storage table.

### Save Settings
Now determine how to save the data in Storage.

{: .image-popup}
![Screenshot - FTP extractor save settings](/extractors/storage/ftp/ftp-ex-6.png)

- The initial value in **Table Name** is derived from the configuration table name. You can change it at any time; however,
the [Storage bucket](/storage/buckets/) where the table will be saved cannot be changed.
- **Incremental Load** will turn on [incremental loading to Storage](/storage/tables/#incremental-loading). The result of the
incremental load depends on other settings (mainly **Primary Key**).
- **Delimiter** and **Enclosure** specify the CSV settings.

### Header & Primary Key
There are three options for determining column names:

{: .image-popup}
![Screenshot - FTP extractor header & primary key](/extractors/storage/ftp/ftp-ex-7.png)

- **Set header manually** -- enables the Set Header input to manually specify all columns in the table.
- **Read from the file header** -- assumes that each file has a header in the first row. A random file will be chosen to extract the header, and the first row in all files will be removed.
- **Generate automatically** -- names the columns sequentially as col_1, col_2, and so on.

**Primary Key** can be used to specify the primary key in Storage. It can be used with **Incremental Load**
and **New Files Only** to create a configuration that incrementally loads all new files into a table in Storage.

### Audit
The extractor can optionally add audit columns to the table. `ftp_filename` adds the processed file name, and `ftp_row_number`
adds the row number in the source file.

{: .image-popup}
![Screenshot - FTP extractor audit](/extractors/storage/ftp/ftp-ex-8.png)

## Advanced Mode
For more features, switch the configuration of each table to the **Power User Mode** by clicking the *Open JSON editor* link.

{: .image-popup}
![Screenshot - FTP extractor audit](/extractors/storage/ftp/ftp-ex-9.png)

Through editing the full JSON configuration, you can set up 

- the component (all options are
described in the [GitHub repository](https://github.com/keboola/ex-ftp)), and also 
- the processors (to learn more about processors, see our [developers docs](https://developers.keboola.com/extend/docker-runner/processors/)).

Changing the JSON configuration may render the visual form unable to represent the configuration, and switching back may
be disabled. Reverting such changes will re-enable the visual form. But whenever possible, the JSON will translate back
to the visual form and vice versa.