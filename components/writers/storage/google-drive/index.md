---
title: Google Drive
permalink: /components/writers/storage/google-drive/
redirect_from:
    - /writers/storage/google-drive/
---

* TOC
{:toc}

This writer sends tables as CSV files into a single [Google Drive](https://www.google.com/drive/) account.
It allows you to write entire tables as CSV files, or Google Sheets files. To write tables as partial modifications
to an existing sheet, use the [Google Sheets writer](/components/writers/storage/google-sheets/). Writing tables as CSV files
is not bound by [Google Sheets limits](https://gsuitetips.com/tips/sheets/google-spreadsheet-limitations/).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Google Drive** writer.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 
Then click the **New Table** button to add a new table:

{: .image-popup}
![Screenshot - Add Table Step 1](/components/writers/storage/google-drive/google-drive-1.png)

Select a table from Storage. You may also specify additional filters as well as [incremental processing](/storage/tables/#incremental-processing).
All options may be modified later. Click **Next** to select how to load the table to Google Drive:

{: .image-popup}
![Screenshot - Add Table Step 2](/components/writers/storage/google-drive/google-drive-2.png)

When the **Update file** option is selected, the file name (specified in the next step) will be honored and the file
will be overwritten with each run of the writer. When the **Create new file** option is selected, the creation time will
be appended to the file name -- e.g. `cars (2019-01-06 17:46:22)`. Click **Next** to configure where the file should be stored:

{: .image-popup}
![Screenshot - Add Table Step 3](/components/writers/storage/google-drive/google-drive-3.png)

In the last step, you can select the folder and file name on Google Drive, where the table will be stored. When you select the
*Convert to Google Docs format* option, the file will be saved as a Google Sheets table; otherwise it will be saved as
a CSV file. Keep in mind that the Google Sheets format is subject to [certain limits](https://gsuitetips.com/tips/sheets/google-spreadsheet-limitations/),
If these are exceeded, the table load will fail.

When done, click the **Save** button to finish the table configuration. 
Configured tables are stored as [configuration rows](/components/#configuration-rows).
