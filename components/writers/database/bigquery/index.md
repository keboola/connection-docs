---
title: Google BigQuery
permalink: /components/writers/database/bigquery/
redirect_from:
    - /writers/database/bigquery/

---

* TOC
{:toc}

This writer sends data to a [Google BigQuery](https://cloud.google.com/bigquery/) dataset.

## Create Service Account
To access and write to your BigQuery dataset, you need to set up a Google Service Account. 

- Go to [**Google Cloud Platform Console > IAM & admin > Service accounts**](https://console.cloud.google.com/iam-admin/serviceaccounts)
- Select the project you want the writer to have access to
- Click **Create Service Account**
- Select an appropriate **Service account name** (e.g. `Keboola Connection BigQuery Writer`)

{: .image-popup}
![Screenshot - Create service account](/components/writers/database/bigquery/google-1.png)

Then add the `BigQuery Data Editor` and `BigQuery Job User` roles.

{: .image-popup}
![Screenshot - Create service account](/components/writers/database/bigquery/google-2.png)

Finally, create a new JSON key (click **+ Create key**) and download it to your computer (click **Create**).

{: .image-popup}
![Screenshot - Create service account](/components/writers/database/bigquery/google-3.png)

You can now close the Google Cloud Platform Console and go back to writer configuration.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **BigQuery** writer.
Click on the **Set Service Account Key** button
Open the [downloaded key](#create-service-account) in a text editor, copy & paste it in the input field, click **Submit** and then **Save**. 

{: .image-popup}
![Screenshot - Copy & Paste Service Account Key](/components/writers/database/bigquery/bigquery-1.png)

**Important:** The private key is stored in an **encrypted** form and only the non-sensitive parts are visible in the UI for your verification. 
The key can be deleted or replaced by a new one at any time. Don't forget to *Save* the credentials.

There is one more thing left to do before you can start adding tables. Specify the Google BigQuery Dataset and **Save** it.

{: .image-popup}
![Screenshot - BigQuery Dataset](/components/writers/database/bigquery/bigquery-2.png)

All tables in this configuration will be written to this dataset. 
If the dataset does not exist, the roles assigned to the Google Service Account will allow the writer to create it.

## Add Tables
To add a new table to the writer, click **Add Table** and select the table. 
The table name will be used to create the destination table name in BigQuery and can be modified.

{: .image-popup}
![Screenshot - Add Table](/components/writers/database/bigquery/bigquery-3.png)

Configured tables are stored as [configuration rows](/components/#configuration-rows).

### Destination
You can specify the table name in BigQuery and set the load type to `Full Load` or `Incremental`. 

{: .image-popup}
![Screenshot - Table Detail](/components/writers/database/bigquery/bigquery-4.png)

*Note: `Incremental` load type does not use a primary key to modify existing records, new records will be always appended to the table.*

### Columns
You can rename the destination column in BigQuery and specify the used data type. 
The little eye icon on the right will show you a preview of the values so you don't have to guess the data type. 

*Note: You have to define a data type on at least one column for the configuration to work.* 
