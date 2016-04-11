---
title: Pigeon Importer
permalink: /extractors/pigeon/
---

Pigeon Importer allows you to import data from your e-mail attachments to Storage API (SAPI)
tables for future work.

* TOC
{:toc}

## First steps

Pigeon Importer is perfect for situations where CSV data are produced by your system
and only way you can export them is e-mail. 

Assume this table as sample CSV produced by that system:

| date | new | lost | total |
| ---| --- | --- | --- |
| 2016-03-29 | 8 | 5 | 256 |
| 2016-03-30 | 9 | 1 | 264 |
| 2016-03-31 | 15 | 3 | 276 |

And you need this table to be available to join with other data in Keboola Connection.

That's the place for Pigeon Importer.


### Create New Configuration

Find Pigeon Importer in Extractors section and create new configuration.

{: .image-popup}
![Pigeon Importer Screenshot](/extractors/pigeon/01-create-new-config.png)

Choose meaningful name, you will thank yourself later.

{: .image-popup}
![Pigeon Importer Screenshot](/extractors/pigeon/02-choose-name-and-desc.png)

### Create Email Import

{: .image-popup}
![Pigeon Importer Screenshot](/extractors/pigeon/03-create-email-import.png)

Choose table ID, then primary key if needed.

{: .image-popup}
![Pigeon Importer Screenshot](/extractors/pigeon/04-table-id-and-pk.png)

### Run E-mail Import

Now you can send e-mail with mentioned data as attachment to generated e-mail address and run e-mail import.

Click Run email report.

{: .image-popup}
![Pigeon Importer Screenshot](/extractors/pigeon/05-list-email-imports.png)

Then confirm.

{: .image-popup}
![Pigeon Importer Screenshot](/extractors/pigeon/06-run-email-import.png)

### Check Imported Data

After scheduling job for run, follow the UI instructions and navigate to job detail, where you
can check processed data in imported table.

{: .image-popup}
![Pigeon Importer Screenshot](/extractors/pigeon/07-check-processed-data.png)

## Tips and Tricks

- Also gzipped CSVs as attachments are allowed
- Every CSV file should have its own configuration (otherwise you'll get into error where columns
differ)
- To automate downloading of attachments regularly, setup Orchestration
