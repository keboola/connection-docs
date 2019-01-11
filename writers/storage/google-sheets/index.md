---
title: Google Sheets
permalink: /writers/storage/google-sheets/
---

* TOC
{:toc}

This writer sends tables as worksheets into a single [Google Sheets](https://www.google.com/sheets/about/) account.
It allows you to write tables into individual sheets of a spreadsheet document and append rows into an existing sheet.
Be aware that Google sheets have [strict limits](https://gsuitetips.com/tips/sheets/google-spreadsheet-limitations/)
on the size of the document. If you are getting close to them, use the [Google Drive Writer](/writers/storage/google-drive/) to avoid failed writes.

## Create New Configuration
Find the Google Sheets writer in the list of writers and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/writers/storage/google-sheets/ui1.png)

As the next step, click the **Authorize Account** button. Select one of the two authorization methods:

{: .image-popup}
![Screenshot - Authorize account](/writers/storage/google-sheets/ui2.png)

- **Instant** -– Use this if you have access to the Google Drive account; the authorization will be done immediately.
- **External** –- If you need to authorize access to the service from someone who does not have an account in KBC, you can 
generate an external link, which will guide them through this process.

## Configure Tables
Click the **New Table** button to add a new table:

{: .image-popup}
![Screenshot - Add Table Step 1](/writers/storage/google-sheets/ui3.png)

Select a table from Storage. You may also specify additional filters as well as [incremental processing](/storage/tables/#incremental-processing).
All options may be modified later. Click next to select whether to create a new file or write to an existing one:

{: .image-popup}
![Screenshot - Add Table Step 2](/writers/storage/google-sheets/ui4.png)

In the last step, you can select to which worksheet the data should be written and whether to append or overwrite
worksheet rows. When worksheet rows are appended, the table header is written only when the worksheet is empty.

{: .image-popup}
![Screenshot - Add Table Step 3](/writers/storage/google-sheets/ui5.png)

When done, click the **Save Sheet** button to finish the table configuration. The table is added to the configuration:

{: .image-popup}
![Screenshot - Table List](/writers/storage/google-sheets/ui6.png)

You can add other tables, or run (write to Google Drive) the individual tables or the entire configuration.
The configuration can write as many tables as you wish. The list is fully searchable, and you can delete or disable each table. 
In addition, you can explicitly write one table only.
