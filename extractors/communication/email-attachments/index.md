---
title: Email Attachments
permalink: /extractors/communication/email-attachments/
redirect_from:
    - /extractors/communication/pigeon/
---

* TOC
{:toc}

This extractor allows you to import data from email attachments to KBC.
It extracts data from systems generating exports only as CSV files attached to an email.
It can also be used instead of repeated [manual imports of CSV](/tutorial/load/) files.

Tables only get imported with the extractor running. The import is **not** triggered by an email
being sent or received. When running, the extractor imports all emails received since its previous run.
Therefore it is a good idea to set up the extractor in a [**scheduled** orchestration](/orchestrator/scheduling/).

## Create New Configuration
Find Email Attachments in the Extractors section and create a new configuration. Choose a meaningful
name for your configuration. Each configuration corresponds to a single target email address. If you need 
to import emails into different tables, it is advisable to create more configurations.

{: .image-popup}
![Screenshot - Create Name Confgiruation](/extractors/communication/email-attachments/01-choose-name-and-desc.png)


## User Email Import
An email address for sending attachments will be generated when the configuration is created. Use it to send .csv files.

{: .image-popup}
![Screenshot - Create New Email Import](/extractors/communication/email-attachments/02-create-email-import.png)

If needed, specify the primary key and CSV options under **Import Settings**.


## Test Email Import
Send an email with a data attachment to the generated email address.
Use the following [sample table](/extractors/communication/email-attachments/sample.csv):

| date | new | lost | total |
| --- | --- | --- | --- |
| 2016-03-29 | 8 | 5 | 256 |
| 2016-03-30 | 9 | 1 | 264 |
| 2016-03-31 | 15 | 3 | 276 |

With the email message content being completely arbitrary, all that matters is the attached files. The 
following conditions have to be met:

- Each e-mail must contain only one attachment.
- The attachment must by a CSV file.
- The attachment must always adhere to the format specified in **Import Settings**.

Click **Run** and confirm.

If the extraction is successful, you will be able to check the processed data in the imported table by clicking on the link.
There may be a delay between the time the email is sent, received, and picked up by the extractor.

{: .image-popup}
![Screenshot - Job Detail](/extractors/communication/email-attachments/03-check-processed-data.png)

*Notice:* When multiple valid e-mails are received between the extractor runs, they are imported into separate tables (`data1` -- `dataN`). IF the behavior is undesired, you have to take care in timing the e-mail sending and extractor orchestration to make sure only one e-mail is proccessed at a time.
