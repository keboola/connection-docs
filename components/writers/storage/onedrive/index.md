---
title: OneDrive Excel Sheets
permalink: /components/writers/storage/onedrive/
---

* TOC
{:toc}

This writer exports tables from your [Storage tables](/storage/tables) as Excel sheets to 
[Microsoft OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/online-cloud-storage).

**[Microsoft OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/online-cloud-storage)**
cloud storage integrates
**[Office365](https://www.office.com/)**
and **[SharePoint](https://www.microsoft.com/en-us/microsoft-365/sharepoint/collaboration)** sites,
so with this writer you can write to any Excel sheet on your personal or business account.

The contents of the sheet can be overwritten or new lines can be added at the end.


## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **OneDrive Excel Sheets** writer.  
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 

Click **Add Table** to configure export.

{: .image-popup}
![Screenshot - Empty configuration](/components/writers/storage/onedrive/onedrive-01.png)

Select a **Table** from your buckets. Then click to **Add table**.

{: .image-popup}
![Screenshot - Add table popup](/components/writers/storage/onedrive/onedrive-02.png)

**Use file picker** to list accessible Excel files - workbooks.  
Alternatively, you can [Create a new workbook](#create-a-new-workbook).

{: .image-popup}
![Screenshot - Use file picker](/components/writers/storage/onedrive/onedrive-03.png)

Go through the list and select file. Click **Open** to confirm the file you want to write to.

{: .image-popup}
![Screenshot - Select file](/components/writers/storage/onedrive/onedrive-04.png)

The target file is specified by **Drive ID** and **File ID**. They are automatically filled in.   
**File Name** is for your information only and its change doesn't affect functionality.

{: .image-popup}
![Screenshot - Workbook config](/components/writers/storage/onedrive/onedrive-05.png)

Click **Load worksheets** to select worksheet from the workbook configured in the previous step.  
Alternatively, you can [Create a new worksheet](#create-a-new-worksheet).

{: .image-popup}
![Screenshot - Empty worksheet config](/components/writers/storage/onedrive/onedrive-06.png)

In the list that appeared, **click to the name** of the worksheet you want to set as target.

{: .image-popup}
![Screenshot - Select worksheet](/components/writers/storage/onedrive/onedrive-07.png)

The worksheet is specified by **Worksheet ID**. It is automatically filled in.   
**Worksheet Name** is for your information only and its change doesn't affect functionality.

You can check **Append** checkbox to append new rows after the existing ones,  
otherwise the contents of the worksheet will be overwritten.

{: .image-popup}
![Screenshot - Select worksheet](/components/writers/storage/onedrive/onedrive-08.png)

Click **Save** when you're done.

{: .image-popup}
![Screenshot - Select worksheet](/components/writers/storage/onedrive/onedrive-09.png)

## Modify Configuration
When a table is added to the writer, it is displayed in the list of tables. 

Configured tables are stored as [configuration rows](/components/#configuration-rows).

{: .image-popup}
![Screenshot - Save](/components/writers/storage/onedrive/onedrive-10.png)

Each table has a different setting, but all tables share the same authorization to OneDrive account.

The list shows the row name, and the source table in [Storage](/storage/).

You can **click to the row to modify** the configuration.

## Create a new workbook

You can create a new workbook instead of using existing. 

Click to **Create workbook**.

{: .image-popup}
![Screenshot - Create workbook button](/components/writers/storage/onedrive/onedrive-11.png)

Specify full file **Path** and click to **Create**.

{: .image-popup}
![Screenshot - Create workbook popup](/components/writers/storage/onedrive/onedrive-12.png)

**File Name**, **Drive ID**, and **File ID** are automatically filled in.

## Create a new worksheet

You can create a new worksheet instead of using existing.

Click to **Create worksheet**.

{: .image-popup}
![Screenshot - Create worksheet button](/components/writers/storage/onedrive/onedrive-13.png)

Specify the worksheet's **Name** and click to **Create**.

{: .image-popup}
![Screenshot - Create worksheet popup](/components/writers/storage/onedrive/onedrive-14.png)

**Worksheet Name**, and **Worksheet ID** are automatically filled in.
