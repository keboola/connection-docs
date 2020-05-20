---
title: OneDrive Excel Sheets
permalink: /components/extractors/storage/onedrive/
---

* TOC
{:toc}

This extractor loads Excel sheets from 
**[Microsoft OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/online-cloud-storage)**
and stores them as tables in a bucket in your current project.

**[Microsoft OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/online-cloud-storage)**
cloud storage integrates
**[Office365](https://www.office.com/)**
and **[SharePoint](https://www.microsoft.com/en-us/microsoft-365/sharepoint/collaboration)** sites,
so with this extractor you have access to all your Excel sheets on your personal or business account.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **OneDrive Excel Sheets** extractor.  
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 

Click **Add Table** to configure extraction.

{: .image-popup}
![Screenshot - Empty configuration](/components/extractors/storage/onedrive/onedrive-01.png)

Fill the **Name** and optionally the **Description**. Then click to **Add table**.  
These values will help you easily identify the extraction later.

{: .image-popup}
![Screenshot - Add table popup](/components/extractors/storage/onedrive/onedrive-02.png)

**Use file picker** to list accessible Excel files - workbooks.

{: .image-popup}
![Screenshot - Use file picker](/components/extractors/storage/onedrive/onedrive-03.png)

Go through the list and select file. Click **Open** to confirm the file you want to import.

{: .image-popup}
![Screenshot - Select file](/components/extractors/storage/onedrive/onedrive-04.png)

The file is specified by **Drive ID** and **File ID**. They are automatically filled in.   
**File Name** is for your information only and its change doesn't affect functionality.

{: .image-popup}
![Screenshot - Workbook config](/components/extractors/storage/onedrive/onedrive-05.png)

Click **Load worksheets** to select worksheet from the workbook configured in the previous step.

{: .image-popup}
![Screenshot - Empty worksheet config](/components/extractors/storage/onedrive/onedrive-06.png)

In the list that appeared, **click to the name** of the worksheet you want to import.

{: .image-popup}
![Screenshot - Select worksheet](/components/extractors/storage/onedrive/onedrive-07.png)

The worksheet is specified by **Worksheet ID**. It is automatically filled in.   
**Worksheet Name** is for your information only and its change doesn't affect functionality.

{: .image-popup}
![Screenshot - Save](/components/extractors/storage/onedrive/onedrive-08.png)

Output **Table Name** is automatically filled in with worksheet name.  
You can manually change it to suit your needs.
If the table doesn't exist, it will be created. 

{: .image-popup}
![Screenshot - Select worksheet](/components/extractors/storage/onedrive/onedrive-09.png)

Click **Save** when you're done.

{: .image-popup}
![Screenshot - Select worksheet](/components/extractors/storage/onedrive/onedrive-10.png)

## Modify Configuration
When a table is added to the extractor, it is displayed in the list of tables. 

Configured tables are stored as [configuration rows](/components/#configuration-rows).

{: .image-popup}
![Screenshot - Select worksheet](/components/extractors/storage/onedrive/onedrive-11.png)

Each table has a different setting, but all tables share the same authorization to OneDrive account.

The list shows the row name, and the destination table in [Storage](/storage/).

You can **click to the row to modify** the configuration.
