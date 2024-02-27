---
title: FTP 
permalink: /components/extractors/storage/ftp/
redirect_from:
    - /extractors/storage/ftp/
---

* TOC
{:toc}

The FTP extractor loads a single, or multiple CSV files from FTP, FTPS and SFTP servers, and stores them in Keboola Storage.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **FTP** extractor.
To access the files on FTP, you need to set up access credentials.

{: .image-popup}
![Screenshot - FTP extractor server configuration](/components/extractors/storage/ftp/ftp-1.png)

You can use a private key for the **SFTP** connection type. If you fill in the private key,
the extractor will use it for login instead of the password. You can also change
the port for each connection method. The default port for **FTP** and **FTPS** is **21**, and for **SFTP**, it is **22**.

## Add Tables
To create a new table, click the **Add Table** button and assign a name. It will
be used to create the destination table name in Storage and can be modified.

{: .image-popup}
![Screenshot - FTP extractor create table](/components/extractors/storage/ftp/ftp-2.png)

Configured tables are stored as [configuration rows](/components/#configuration-rows).
Each table has a different setting, but all tables share the same credentials to the server.

### Specify Files to Download
For each table, you have to specify a path. Use the path to a specific file, or
use the glob syntax (for testing the glob path, you can use the [Glob tester](https://www.digitalocean.com/community/tools/glob)).
If you want to list inside subdirectories (e.g., `/dir/**/*.csv`), please make sure that your FTP server
supports a recursive list of directories.

{: .image-popup}
![Screenshot - FTP extractor download settings](/components/extractors/storage/ftp/ftp-3.png)

- **New Files Only**: The extractor will keep track of downloaded files and will continue with the unprocessed files
 on the next run. To reset the state which keeps track of the progress and enables to continue with new files, 
 use the **Reset State** button or uncheck the **New Files Only** option and run the extractor again.
 - **Decompress**: All downloaded files will be decompressed (currently supporting ZIP and GZIP). All files in all archives
 will be imported into a single Storage table.

### Save Settings
Now determine how to save the data in Storage.

{: .image-popup}
![Screenshot - FTP extractor save settings](/components/extractors/storage/ftp/ftp-4.png)

- The initial value in **Table Name** is derived from the configuration table name. You can change it at any time; however,
the [Storage bucket](/storage/buckets/) where the table will be saved cannot be changed.
- **Incremental Load** will turn on [incremental loading to Storage](/storage/tables/#incremental-loading). The result of the
incremental load depends on other settings (mainly **Primary Key**).
- **Delimiter** and **Enclosure** specify the CSV settings.

### Header & Primary Key
There are three options for determining column names:

{: .image-popup}
![Screenshot - FTP extractor header & primary key](/components/extractors/storage/ftp/ftp-5.png)

- **Set header manually** -- enables the Set Header input to manually specify all columns in the table.
- **Read from the file header** -- assumes that each file has a header in the first row. A random file will be chosen to extract the header, and the first row in all files will be removed.
- **Generate automatically** -- names the columns sequentially as col_1, col_2, and so on.

**Primary Key** can be used to specify the primary key in Storage. It can be used with **Incremental Load**
and **New Files Only** to create a configuration that incrementally loads all new files into a table in Storage.

### Audit
The extractor can optionally add audit columns to the table. `ftp_filename` adds the processed file name, and `ftp_row_number`
adds the row number in the source file.

{: .image-popup}
![Screenshot - FTP extractor audit](/components/extractors/storage/ftp/ftp-6.png)

The extractor also supports [Advanced mode](/components/#advanced-mode), all supported
parameters are described in the [GitHub repository](https://github.com/keboola/ex-ftp).
