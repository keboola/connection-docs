---
title: Pigeon Importer
permalink: /extractors/pigeon/
---

* TOC
{:toc}

Pigeon Importer allows you to import data from e-mail attachments to KBC. Pigeon Importer should be
used in case you need to extract data from some system which can export data only in form of CSV files attached
to an email.
Pigeon Importer may also be used instead of [manualy importing CSV](/overview/tutorial/load/) files in 
case you need to do so more often.

It is important to note that the table is imported only when the extractor runs, i.e the table import is **not** triggered 
when the email is received (or sent). When the Pigeon Importer runs, it will import all received emails from the time it 
was last run. Generally, the Pigeon Importer therefore should be set up in 
a [**scheduled** orchestration](/orchestrator/scheduling/). 

## Create New Configuration
Find Pigeon Importer in Extractors section and create new configuration. Each configuration can import multiple
tables, so you should create multiple configurations if it makes organizational sense (e.g. you would create 
one configuration for daily data, and a second one for a yearly report).

{: .image-popup}
![Screenshot - Create New Pigeon Importer Configuration](/extractors/pigeon/01-create-new-config.png)

Choose meaningful name for the configuration:

{: .image-popup}
![Screenshot - Create Name Confgiruation](/extractors/pigeon/02-choose-name-and-desc.png)

## Create Email Import
An *Email import* defines the link between and email and a table in Storage. An *Email import* imports a 
single table into Storage.  

{: .image-popup}
![Screenshot - Create New Email Import](/extractors/pigeon/03-create-email-import.png)

Choose an existing table from Storage or write new table ID (bucket and table name), you can specify primary 
key or CSV options if needed.

{: .image-popup}
![Screenshot - Configure email import](/extractors/pigeon/04-table-id-and-pk.png)

## Test Email Import
Now you can send e-mail with witch attached data to the generated email address and run email import.
In case you want to test it, you can use a [sample table](/extractors/pigeon/pigeon-importer-sample.csv):

| date | new | lost | total |
| --- | --- | --- | --- |
| 2016-03-29 | 8 | 5 | 256 |
| 2016-03-30 | 9 | 1 | 264 |
| 2016-03-31 | 15 | 3 | 276 |

The email message content is completely arbitrary, all that matters is attached CSV file. The file must always be 
in the format specified in the *Email import*. It can also be [gzipped](http://www.gzip.org/). 

Click on *Run email import* and confirm.

{: .image-popup}
![Screenshot - List email imports](/extractors/pigeon/05-list-email-imports.png)

When you run the import Job, you can follow the UI instructions and navigate to job detail, where you
can check processed data in imported table. Note that there may be some delay between when the email message is sent 
and received (and picked up by the importer).

{: .image-popup}
![Screenshot - Job Detail](/extractors/pigeon/07-check-processed-data.png)
