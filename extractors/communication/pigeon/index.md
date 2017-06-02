---
title: Pigeon Importer
permalink: /extractors/communication/pigeon/
---

Pigeon Importer allows you to import data from e-mail attachments to KBC. 
It extracts data from systems generating exports only as CSV files attached to an email, and
can also be used instead of repeated [manual imports of CSV](/tutorial/load/) files.

Tables only get imported with the extractor running. The import is **not** triggered by an email 
being sent or received. When running, the extractor will import all emails received since its previous run. 
Therefore it is a good idea to set up Pigeon Importer in a [**scheduled** orchestration](/orchestrator/scheduling/). 

## Create New Configuration
Find Pigeon Importer in the Extractors section and create a new configuration. 
As each configuration can import multiple tables, there is no need to create more than one unless 
you want to better organize your data. Let's say one configuration would load your daily data, and
another one your yearly reports.
 
{: .image-popup}
![Screenshot - Create New Pigeon Importer Configuration](/extractors/pigeon/01-create-new-config.png)

Choose a meaningful name for your configuration.

{: .image-popup}
![Screenshot - Create Name Confgiruation](/extractors/pigeon/02-choose-name-and-desc.png)

## Create Email Import
*Email Import* defines the link between an email and a table in Storage. It imports a single table into Storage.  

{: .image-popup}
![Screenshot - Create New Email Import](/extractors/pigeon/03-create-email-import.png)

Select an existing table from Storage, or create a new table ID: a bucket and table name. Specify the primary 
key and CSV options if needed.

{: .image-popup}
![Screenshot - Configure email import](/extractors/pigeon/04-table-id-and-pk.png)

## Test Email Import
Send an e-mail with a data attachment to the generated email address.
Use the following [sample table](/extractors/pigeon/pigeon-importer-sample.csv):

| date | new | lost | total |
| --- | --- | --- | --- |
| 2016-03-29 | 8 | 5 | 256 |
| 2016-03-30 | 9 | 1 | 264 |
| 2016-03-31 | 15 | 3 | 276 |

With the email message content being completely arbitrary, all that matters is the attached CSV file. 
It must always adhere to the format specified in *Email Import*. It can also be [gzipped](http://www.gzip.org/). 

Click **Run email import** and confirm.

{: .image-popup}
![Screenshot - List email imports](/extractors/pigeon/05-list-email-imports.png)

When running the import job, follow the UI instructions to check the processed data in the imported table. 
There may be a delay between the time the email is sent, received, and picked up by the importer.

{: .image-popup}
![Screenshot - Job Detail](/extractors/pigeon/07-check-processed-data.png)
