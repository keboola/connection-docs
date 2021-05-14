---
title: Google Cloud Storage
permalink: /components/writers/storage/google-cloud-storage/
redirect_from:
    - /writers/storage/google-cloud-storage/
---

* TOC
{:toc}
  
This writer sends tables as CSV or other files to a [Google Cloud Storage](https://cloud.google.com/storage) bucket.


## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Google Cloud Storage** writer.
To authorize the writer you can either choose to use a Google Service account or use [instant authorization](/components/#instant-authorization)

The Service account login is the recommended way of authorizing this component. 

{: .image-popup}
![Screenshot - Authorize account](/components/writers/storage/google-cloud-storage/authorization-gcs.png)

### Setting up a service account
To create a service account go to your Google Cloud Platform console
[Service accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) page.
There, click the **create service account** button, provide a name to the account, eg. keboola-cloud-storage, and click 
the **create** button. In the "Grant this service account access to project" section select the **Storage Object Admin** role
and click the **continue** button. You can keep the "Grant users access to this service account" blank and press the **done** button.
Once you see your newly created service account in the service account list, click the 3 dots in the actions column and
select **manage keys**. Then click the **add key** button and select **create new key**. Select the JSON key and press 
the **create** button, the key should be automatically downloaded to your computer. Locate the JSON key file and copy
and paste the whole JSON to the Service Account Key field in the Google Cloud Storage Service Account login and press 
the **save** button. It might take up to 10 minutes for the service account scope rights will be granted to the service account.

### Row configuration

Create a new row by clicking the **add row** button.

{: .image-popup}
![Screenshot - Add row](/components/writers/storage/google-cloud-storage/add-row-gcs.png)

Specify the row name and add a description, then click the **add row** button.

{: .image-popup}
![Screenshot - New row](/components/writers/storage/google-cloud-storage/new-row-gcs.png)

In the row configuration you may specify Storage [tables](/storage/tables/) or [files](/storage/files/) 
to be written to the target Google Cloud Storage bucket. Then specify the bucket in Google Cloud Storage that you
want to send the tables and files to. Use the checkbox to select whether you would like to append a 
timestamp to the file names. Finally, you can apply processors to the files before writing them to the bucket.

{: .image-popup}
![Screenshot - Row configuration](/components/writers/storage/google-cloud-storage/row-config-gcs.png)
