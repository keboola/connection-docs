---
title: Google BigQuery
permalink: /writers/database/bigquery/
---

* TOC
{:toc}

This writer sends data to a [Google BigQuery](https://cloud.google.com/bigquery/) dataset.

## Create New Configuration
Find the BigQuery writer in the list of writers and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/writers/database/bigquery/ui1.png)

## Create Service Account

To access and write to your BigQuery dataset you need to set up a Google Service Account. 

- Go to [**Google Cloud Platform Console > IAM & admin > Service accounts**](https://console.cloud.google.com/iam-admin/serviceaccounts)
- Select a project where you want the writer to have access to
- Click on **+ Create Service Account**
- Select an appropriate **Service account name** (eg `Keboola Connection BigQuery Writer`)

{: .image-popup}
![Screenshot - Create service account](/writers/database/bigquery/serviceaccount1.png)

- In the next step add `BigQuery User` and `BigQuery Job User` roles

{: .image-popup}
![Screenshot - Create service account](/writers/database/bigquery/serviceaccount2.png)

- In the last step create a new JSON key (click on **+ Create key**) and download it to your computer (click on **Create**)

{: .image-popup}
![Screenshot - Create service account](/writers/database/bigquery/serviceaccount3.png)

- You can now close the Google Cloud Platform Console and go back to your BigQuery writer configuration
- In the **Google Service Account Key** section click on **Set Service Account Key** button

{: .image-popup}
![Screenshot - Set Service Account Key](/writers/database/bigquery/ui2.png)


- Open the downloaded key in any text editor, copy & paste it in the input field, click on **Submit** and then do not forget to click on **Save** 

{: .image-popup}
![Screenshot - Copy & Paste Service Account Key](/writers/database/bigquery/ui3.png)


Do not worry, the private key is stored in an encrypted form and only the nonsensitive parts are visible in the UI for your verification. 
The key can be deleted or replaced by a new one at any time.

{: .image-popup}
![Screenshot - Copy & Paste Service Account Key](/writers/database/bigquery/ui4.png)


## Google BigQuery Dataset

{: .image-popup}
![Screenshot - BigQuery Dataset](/writers/database/bigquery/ui5.png)

There is one more thing to do before you can start adding tables. Specify the Google BigQuery Dataset and click on the **Save** button.
All tables in this configuration will be written to this dataset. 
The dataset must exist, the writer does not have permissions to create the dataset.

## Add Tables

{: .image-popup}
![Screenshot - Add Table](/writers/database/bigquery/ui6.png)


To add a new table the writer, click the **+ Add Table** button and select a table. 
The table name will be used to create the destination table name in BigQuery and can be modified.


## List Tables

{: .image-popup}
![Screenshot - Tables List](/writers/database/bigquery/ui7.png)

The configuration can write as many tables as you wish. The list is fully searchable, and you can delete or disable each table. 
In addition, you can explicitly run only one table. The writing order of the tables can be changed.


## Modify Table

{: .image-popup}
![Screenshot - Table Detail](/writers/database/bigquery/ui8.png)

### Destination

You can specify the table name in BigQuery and set the load type to `Full Load` or `Incremental`. 

*Note: `Incremental` load type does not use a primary key to modify existing records, new records will be always appended to the table.*

### Columns

You can rename the destination column in BigQuery and specify the used datatype. 
The little eye icon on the right will show you preview of the values so you don't have to guess the datatype. 

*Note: you have to define a datatype on at least one column for the configuration to work.* 