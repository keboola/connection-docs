---
title: Google Drive
permalink: /writers/storage/google-drive/
---

* TOC
{:toc}

This writer sends tables as CSV files into a single [Google Drive](https://www.google.com/drive/) account.
It allows you to write entire tables as CSV files, or Google Sheets files. To write tables as partial modifications
to an existing sheet, use the [Google Sheets Writer](/writers/storage/google-sheets/). Writing tables as CSV files
is not bound by [Google Sheet limits](https://gsuitetips.com/tips/sheets/google-spreadsheet-limitations/).

## Create New Configuration
Find the Google Drive writer in the list of writers and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/writers/storage/google-drive/ui1.png)

As the next step, click the **Authorize Account** button. Select one of the two authorization methods:

{: .image-popup}
![Screenshot - Authorize account](/writers/storage/google-drive/ui2.png)

- **Instant** –- Use this if you have access to the Google Drive account; the authorization will be done immediately.
- **External** -– If you need to authorize access to the service from someone who does not have an account in KBC, you can generate an external link, which will guide them through this process.

## Configure Tables
Click the **New Table** button to add a new table:

{: .image-popup}
![Screenshot - Add Table Step 1](/writers/storage/google-drive/ui3.png)

Select a table from Storage. You may also specify additional filters as well as [incremental processing](/storage/tables/#incremental-processing).
All options may be modified later. Click next to select how to load the table to Google Drive:

{: .image-popup}
![Screenshot - Add Table Step 2](/writers/storage/google-drive/ui4.png)

When the **Update file** option is selected, the file name (specified in the next step) will be honored and the file
will be overwritten with each run of the writer. When the **Create new file** option is selected, the creation time will
be appended to the file name -- e.g. `cars (2019-01-06 17:46:22)`. Click next to configure where the file should be stored:

{: .image-popup}
![Screenshot - Add Table Step 3](/writers/storage/google-drive/ui5.png)

In the last step, you can select the folder and file name on Google Drive, where the table will be stored. When you select the
*Convert to Google Docs format* option, the file will be saved as a Google Sheets table; otherwise it will be saved as
a CSV file. Beware that the Google Sheets format is subject to [certain limits](https://gsuitetips.com/tips/sheets/google-spreadsheet-limitations/),
If these are exceeded, the table load will fail.

When done, click the **Save** button to finish the table configuration. The table is added to the configuration:

{: .image-popup}
![Screenshot - Table List](/writers/storage/google-drive/ui6.png)

You can add other tables, or run (write to Google Drive) the individual tables or the entire configuration.
The configuration can write as many tables as you wish. The list is fully searchable, and you can delete or disable each table. 
In addition, you can explicitly write one table only.
