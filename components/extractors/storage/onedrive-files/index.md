---
title: OneDrive Files
permalink: /components/extractors/storage/onedrive-files/
---

* TOC
{:toc}

This extractor downloads files from 
**[Microsoft OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/online-cloud-storage)**
and stores them in your project.

**[Microsoft OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/online-cloud-storage)**
cloud storage integrates
**[Office365](https://www.office.com/)**
and **[SharePoint](https://www.microsoft.com/en-us/microsoft-365/sharepoint/collaboration)** sites,
so with this extractor, you have access to all your files in your personal account or in your business account.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **OneDrive Files** extractor.  
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 

Next, select the **Account Type** you are using in the **Account configuration** section. 
- For **Private OneDrive**, you do not need to input additional information. 
- **OneDrive for Business** needs **Tenant ID** You can find the Tenant ID in the [Azure Portal](https://portal.azure.com/#home). After signing in, click on 'Azure Active Directory' in the left-hand menu. Tenant ID can be found in the 'Tenant information' section on the 'Azure Active Directory' overview page.
- **Sharepoint** account needs **Tenant ID**, **Site Url** which can be found in your browser's address bar when you visit the SharePoint site (e.g., https://your_domain.sharepoint.com/sites/your_site_name). Lastly, if you are using Sharepoint Libraries, you can use the **List Libraries** sync action to list libraries for your account.

Click **Add Row** to configure extraction.
Fill in the **Name** and then click **CREATE**.  

The **File Path** parameter defines the location of the file/s that you will be retrieving.

**Examples:** 
- `*.csv` - Downloads all available CSV files.
- `/reports/*.csv` - Downloads all available CSV files from the "reports" folder and its subfolders.
- `db_exports/report_*.xlsx` - Downloads all .xlsx files named like "report_*" (* is a wildcard) from the "db_exports" folder and its subfolders.
- `db_exports/2022_*/.csv` - Downloads all CSV files from folders matching "db_exports/2022_*" (* is a wildcard).

**new_files_only (optional)**: If set to true, the component will use timestamp of the freshest file downloaded last run to download only newer files. LastModifiedAt value from GraphAPI is used.

*Destination Options*

- **Custom Tag (optional)**: Adds custom tag to Keboola Storage for all downloaded files. Only one custom tag is supported.
- **Permanent Files (optional)**: If set to true, downloaded files will be stored as permanent in Keboola storage. Otherwise, they will be deleted after 14 days.

Click **Save** when you're done.

Downloaded files will be available in your project's storage/files menu.