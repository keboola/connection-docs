---
title: OneDrive Excel Sheets
permalink: /components/extractors/storage/onedrive-excel-sheets/
redirect_from:
    - /components/extractors/storage/onedrive/
---

* TOC
{:toc}

This data source connector loads Excel sheets from 
**[Microsoft OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/online-cloud-storage)**
and stores them as tables in a bucket in your current project.

**[Microsoft OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/online-cloud-storage)**
cloud storage integrates
**[Office365](https://www.office.com/)**
and **[SharePoint](https://www.microsoft.com/en-us/microsoft-365/sharepoint/collaboration)** sites,
so with this connector, you have access to all your Excel sheets in your personal account or in your business account.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **OneDrive Excel Sheets** connector.  
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 

Click **Add Table** to configure extraction.

{: .image-popup}
![Screenshot - Empty configuration](/components/extractors/storage/onedrive-excel-sheets/onedrive-01.png)

Fill in the **name** and, optionally, the **description**. Then click **Add Table**.  
These values will help you easily identify the extraction later.

{: .image-popup}
![Screenshot - Add table popup](/components/extractors/storage/onedrive-excel-sheets/onedrive-02.png)

**Use the file picker** to list accessible Excel files -- workbooks.

{: .image-popup}
![Screenshot - Use file picker](/components/extractors/storage/onedrive-excel-sheets/onedrive-03.png)

Go through the list and select a file. Click **Open** to confirm the file you want to import.

{: .image-popup}
![Screenshot - Select file](/components/extractors/storage/onedrive/onedrive-04.png)

The file is specified by a **Drive ID** and by a **File ID**. They are automatically filled in.   
The **file name** is for your information only and changing it doesn't affect functionality.

{: .image-popup}
![Screenshot - Workbook config](/components/extractors/storage/onedrive-excel-sheets/onedrive-05.png)

Click **Load Worksheets** to select a worksheet from the workbook you configured in the previous step.

{: .image-popup}
![Screenshot - Empty worksheet config](/components/extractors/storage/onedrive/onedrive-06.png)

In the list that appeared, **click on the name** of the worksheet you want to import.

{: .image-popup}
![Screenshot - Select worksheet](/components/extractors/storage/onedrive-excel-sheets/onedrive-07.png)

The worksheet is specified by a **Worksheet ID**. It is automatically filled in.   
The **worksheet name** is for your information only and changing it doesn't affect functionality.

{: .image-popup}
![Screenshot - Save](/components/extractors/storage/onedrive-excel-sheets/onedrive-08.png)

The output **table name** is automatically filled in with the worksheet name.  
You can manually change it to suit your needs. If the table doesn't exist, it will be created. 

{: .image-popup}
![Screenshot - Select worksheet](/components/extractors/storage/onedrive-excel-sheets/onedrive-09.png)

Click **Save** when you're done.

{: .image-popup}
![Screenshot - Select worksheet](/components/extractors/storage/onedrive-excel-sheets/onedrive-10.png)

## Modify Configuration
When a table is added to the connector, it is displayed in the list of tables. 

Configured tables are stored as [configuration rows](/components/#configuration-rows).

{: .image-popup}
![Screenshot - Select worksheet](/components/extractors/storage/onedrive-excel-sheets/onedrive-11.png)

Each table has a different setting, but all tables share the same authorization to your OneDrive account.

The list shows the row name and the destination table in [Storage](/storage/).

You can **click on the row to modify** the configuration.
