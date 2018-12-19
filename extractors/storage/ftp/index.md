---
title: FTP extractor
permalink: /extractors/storage/ftp/
---

* TOC
{:toc}

## FTP

FTP extractor can extracts multiple CSV files from FTP, FTPS of SFTP server.

After creating a new configuration, select files you want to extract. Then 
determine the way how to save data into KBC Storage.

## Create New Configuration
Find the FTP extractor in the list of extractors and create a new configuration.
Name it.

{: .image-popup}
![Screenshot - FTP extractor create](/extractors/storage/ftp/ftp-ex-1.png)

## Set FTP Credentials
In order to access the files on FTP, you need to set up access credentials.

{: .image-popup}
![Screenshot - FTP extractor server configuration](/extractors/storage/ftp/ftp-ex-2.png)

For **SFTP** type of connection you can use private key. If you fill private key 
extractor will use it for login instead of using password. You can also change 
port. Default port for **FTP(S)** is **21** and for **SFTP** is **22**. 


## Add Tables

{: .image-popup}
![Screenshot - FTP extractor create table](/extractors/storage/ftp/ftp-ex-3.png)

To create a new table, click the **New Table** button and assign a name. It will 
be used to create the destination table name in Storage and can be modified.

## List Tables

{: .image-popup}
![Screenshot - FTP extractor list tables](/extractors/storage/ftp/ftp-ex-4.png)


The configuration can extract as many tables as you wish. The list is fully 
searchable, and you can delete or disable each table. In addition, you can 
explicitly run extraction of only one table. The extraction order of the tables 
can be changed.

## Modify Table

Each table has different setting, but they share same credentials to the server. 

### Specify Files to Download

{: .image-popup}
![Screenshot - FTP extractor download settings](/extractors/storage/ftp/ftp-ex-5.png)

For each table you have to specify path. You can use path to specific file or
you can use glob syntax (for testing glob path you can use [Glob tester](http://www.globtester.com/)).

- **New Files Only** - The extractor will keep track of downloaded files and will continue with the unprocessed files
 on the next run.
 - **Decompress**: All downloaded files will be decompressed (currently supporting ZIP and GZIP). All files in all archives >>>>>>> Stashed changes
 will be imported into a single Storage table.
 
### Save Settings

{: .image-popup}
![Screenshot - FTP extractor save settings](/extractors/storage/ftp/ftp-ex-6.png)

- The initial value in **Table Name** is derived from the configuration table name. You can change it at any time; however,
the [Storage bucket](/storage/buckets/) where the table will be saved to cannot be changed.
- **Incremental Load** will turn on [incremental loading to Storage](/storage/tables/#incremental-loading). The result of the
incremental load depends on other settings (mainly **Primary Key**).
- **Delimiter** and **Enclosure** specify the CSV settings.

### Header & Primary Key

{: .image-popup}
![Screenshot - FTP extractor header & primary key](/extractors/storage/ftp/ftp-ex-7.png)

There are three options for determining column names:

 - **Set header manually** --- This option enables the **Set Header** input to manually specify all columns in the table.
 - **Read from the file(s) header** --- This option assumes that each file has a header on the first line.
 A random file will be chosen to extract the header and the first line in all files will be removed.
 - **Generate automatically** --- The columns will be named sequentially as `col_1`, `col_2` and so on.

**Primary Key** can be used to specify the primary key in Storage, which can be used with **Incremental Load**
and **New Files Only** to create a configuration that incrementally loads all new files into a table in Storage.


### Audit

{: .image-popup}
![Screenshot - FTP extractor audit](/extractors/storage/ftp/ftp-ex-8.png)

The extractor can optionally add audit columns to the table. `ftp_filename` adds the processed file name and `ftp_row_number`
adds the row number in the source file.

## Advanced Mode

{: .image-popup}
![Screenshot - FTP extractor audit](/extractors/storage/ftp/ftp-ex-9.png)

For more features, switch the configuration of each table to the **Power User Mode** by clicking the *Open JSON editor* link.
Through editing the full JSON configuration you can set up the component (all options
described in the [GitHub repository](https://github.com/keboola/ex-ftp)) and also the
processors (to learn more about processors, see the [Developers Docs](https://developers.keboola.com/extend/docker-runner/processors/)).

Changing the JSON configuration may render the visual form unable to represent the configuration, and switching back may
be disabled. Reverting such changes will re-enable the visual form. But whenever possible, the JSON will translate back
to the visual form and vice versa.