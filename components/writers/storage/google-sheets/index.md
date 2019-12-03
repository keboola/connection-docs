---
title: Google Sheets
permalink: /components/writers/storage/google-sheets/
redirect_from:
    - /writers/storage/google-sheets/
---

* TOC
{:toc}

This writer sends tables as worksheets into a single [Google Sheets](https://www.google.com/sheets/about/) account.
It allows you to write tables into individual sheets of a spreadsheet document and append rows into an existing sheet.
Be aware that Google Sheets have [strict limits](https://gsuitetips.com/tips/sheets/google-spreadsheet-limitations/)
on the size of the document. If you are getting close to them, use the [Google Drive writer](/components/writers/storage/google-drive/) to avoid failed writes.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Google Sheets** writer.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 
Then click the **New Table** button to add a new table:

{: .image-popup}
![Screenshot - Add Table Step 1](/components/writers/storage/google-sheets/google-sheets-1.png)

Select a table from Storage. You may also specify additional filters as well as [incremental processing](/storage/tables/#incremental-processing).
All options may be modified later. Click **Next** to select whether to create a new file or write to an existing one:

{: .image-popup}
![Screenshot - Add Table Step 2](/components/writers/storage/google-sheets/google-sheets-2.png)

In the last step, you can select to which worksheet the data should be written and whether to append or overwrite
worksheet rows. When worksheet rows are appended, the table header is written only when the worksheet is empty.

{: .image-popup}
![Screenshot - Add Table Step 3](/components/writers/storage/google-sheets/google-sheets-2.png)

When done, click the **Save Sheet** button to finish the table configuration. 
Configured tables are stored as [configuration rows](/components/#configuration-rows).
