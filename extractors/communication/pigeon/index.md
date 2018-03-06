---
title: Pigeon
permalink: /extractors/communication/pigeon/
---

Pigeon allows you to import data from email attachments to KBC. 
It extracts data from systems generating exports only as CSV files attached to an email, and
can also be used instead of repeated [manual imports of CSV](/tutorial/load/) files.

Tables only get imported with the extractor running. The import is **not** triggered by an email 
being sent or received. When running, the extractor will import all emails received since its previous run. 
Therefore it is a good idea to set up Pigeon in a [**scheduled** orchestration](/orchestrator/scheduling/). 

## Create New Configuration
Find Pigeon in the Extractors section and create a new configuration. 
As each configuration can import multiple tables, there is no need to create more than one unless 
you want to better organize your data. Let's say one configuration would load your daily data and
another one your yearly reports.
 
{: .image-popup}
![Screenshot - Create New Pigeon Configuration](/extractors/communication/pigeon/01-create-new-config.png)

Choose a meaningful name for your configuration.

{: .image-popup}
![Screenshot - Create Name Confgiruation](/extractors/communication/pigeon/02-choose-name-and-desc.png)

## User Email Import
An email address intended for sending attachments will be generated when the configuration is created. Use it to send .csv files. 

{: .image-popup}
![Screenshot - Create New Email Import](/extractors/communication/pigeon/03-create-email-import.png)

If needed, specify the primary key and CSV options in **Import Settings**.

{: .image-popup}
![Screenshot - Configure email import](/extractors/communication/pigeon/04-import-settings.png)

## Test Email Import
Send an email with a data attachment to the generated email address.
Use the following [sample table](/extractors/communication/pigeon/pigeon-importer-sample.csv):

| date | new | lost | total |
| --- | --- | --- | --- |
| 2016-03-29 | 8 | 5 | 256 |
| 2016-03-30 | 9 | 1 | 264 |
| 2016-03-31 | 15 | 3 | 276 |

With the email message content being completely arbitrary, all that matters is the attached CSV file. 
It must always adhere to the format specified in **Import Settings**. It can also be [gzipped](http://www.gzip.org/). 

Click **Run** and confirm.

{: .image-popup}
![Screenshot - List email imports](/extractors/communication/pigeon/05-list-email-imports.png)

If the extraction is successful, you will be able to check the processed data in the imported table by clicking on the link. 
There may be a delay between the time the email is sent, received, and picked up by the importer.

{: .image-popup}
![Screenshot - Job Detail](/extractors/communication/pigeon/07-check-processed-data.png)
