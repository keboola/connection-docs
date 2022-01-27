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
