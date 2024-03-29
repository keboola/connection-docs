---
title: Google Cloud Storage
permalink: /components/writers/storage/google-cloud-storage/
redirect_from:
    - /writers/storage/google-cloud-storage/
---

* TOC
{:toc}
  
This data destination connector sends tables as CSV or other files to a [Google Cloud Storage](https://cloud.google.com/storage) bucket.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Google Cloud Storage** data destination connector.
To authorize the connector, you can either choose to use a Google service account or [instant authorization](/components/#instant-authorization).

The service account login is the recommended way of authorizing this component. 

{: .image-popup}
![Screenshot - Authorize account](/components/writers/storage/google-cloud-storage/authorization-gcs.png)

### Setting Up Service Account
To create a service account, go to your Google Cloud Platform console
[Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) page.
There, click **Create Service Account**, provide a name to the account, e.g., `keboola-cloud-storage`, and click **Create**. 

In the section *Grant this service account access to project*, select the role `Storage Object Admin`,
and click **Continue**. 

You can keep the section *Grant users access to this service account* blank and press the **Done** button.
Once you see your newly created service account in the service account list, click the three dots in the actions column 
and select `Manage Keys`. Then click **Add Key** and select `Create New Key`. Select the JSON key and press **Create**; 
the key should be automatically downloaded to your computer. 

Locate the JSON key file, and copy and paste the whole JSON to the Service Account Key field in the Google Cloud Storage
Service Account login. Then click **Save**. It might take up to ten minutes for the service account scope rights to be 
granted to the service account.

### Row Configuration

Create a new row by clicking **Add Row**.

{: .image-popup}
![Screenshot - Add row](/components/writers/storage/google-cloud-storage/add-row-gcs.png)

Specify the row name and add a description, then click **Add Row**.

{: .image-popup}
![Screenshot - New row](/components/writers/storage/google-cloud-storage/new-row-gcs.png)

In the row configuration, you may specify Storage [tables](/storage/tables/) or [files](/storage/files/) 
to be written to the target Google Cloud Storage bucket. Then specify the bucket in Google Cloud Storage to which you
want to send the tables and files. Use the checkbox to select whether you would like to append a timestamp to the file 
names. Finally, you can apply processors to the files before writing them to the bucket.

{: .image-popup}
![Screenshot - Row configuration](/components/writers/storage/google-cloud-storage/row-config-gcs.png)
