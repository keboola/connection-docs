---
title: OneDrive Files
permalink: /components/extractors/storage/onedrive-files/
---

* TOC
{:toc}

This connector downloads files from the [Microsoft OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/online-cloud-storage) cloud storage and stores them in your project.

The Microsoft OneDrive cloud storage integrates the [Office365](https://www.office.com/) and [SharePoint](https://www.microsoft.com/en-us/microsoft-365/sharepoint/collaboration) sites. 
So, with this connector, you can access all your files in your personal or business account.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **OneDrive Files** connector.  

Then, click **Authorize Account** to [authorize the configuration](/components/#authorization).

### Account Type
Next, go to the **account configuration** section and select the **Account Type** you are using:

- **Private OneDrive**: No additional information is needed. 
- **OneDrive for Business**: You must provide a **Tenant ID**. You can find the Tenant ID in the [Azure Portal](https://portal.azure.com/#home). After signing in, click on 'Azure Active Directory' in the left-hand menu. The Tenant ID can be found in the 'Tenant information' section on the 'Azure Active Directory' overview page.
- **Sharepoint**: You must provide the **Tenant ID** and the **Site URL** which can be found in your browser's address bar when you visit the SharePoint site (e.g., https://your_domain.sharepoint.com/sites/your_site_name). Lastly, if you are using Sharepoint Libraries, you can use the **List Libraries** sync action to list libraries for your account.

### Add Row
Click **Add Row** to configure the extraction, fill in the **name**, and then click the **Create** button.  

The **File Path** parameter defines the location of the file/s that you will be retrieving.

**Examples:** 
- `*.csv`: Downloads all available CSV files.
- `/reports/*.csv`: Downloads all available CSV files from the "reports" folder and its subfolders.
- `db_exports/report_*.xlsx`: Downloads all .xlsx files named like "report_*" (* is a wildcard) from the "db_exports" folder and its subfolders.
- `db_exports/2022_*/.csv`: Downloads all CSV files from folders matching "db_exports/2022_*" (* is a wildcard).

**new_files_only (optional)**: If set to true, the component will use the timestamp of the freshest file downloaded at the last run to download only newer files. The `LastModifiedAt` value from the GraphAPI is used.

### Destination Options

- **Custom Tag (optional)**: Adds a custom tag to Keboola Storage for all downloaded files. Only one custom tag is supported.
- **Permanent Files (optional)**: If set to true, downloaded files will be stored as permanent in Keboola Storage. Otherwise, they will be deleted after 14 days.

Click **Save** when you're done and run the component.

### Output
Downloaded files will be available in your project's storage/files menu.
