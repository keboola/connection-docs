---
title: Email Attachments
permalink: /components/extractors/communication/email-attachments/
redirect_from:
    - /extractors/communication/email-attachments/
---

* TOC
{:toc}

This data source connector allows you to import data from email attachments to Keboola.
It extracts data from systems generating exports only as CSV files attached to an email.
It can also be used instead of repeated [manual imports of CSV](/tutorial/load/) files.

Tables only get imported with the data source connector running. The import is **not** triggered by an email
being sent or received. When running, the data source connector imports all emails received since its previous run.
Therefore, it is a good idea to set up the data source connector in a [**scheduled** orchestration](/flows/orchestrator/running/#time-schedule).

<div class="alert alert-warning">
    <strong>Warning:</strong>
    This component is available only on AWS multitenant stacks <a href="https://connection.keboola.com">connection.keboola.com</a> and <a href="https://connection.eu-central-1.keboola.com">connection.eu-central-1.keboola.com</a>
</div>

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Email Attachments** data source connector.
Each configuration corresponds to a single target email address. If you need 
to import emails into different tables, it is advisable to create more configurations.
An email address for sending attachments will be generated when the configuration is created. Use it to send 
files with the extension `.csv`.

{: .image-popup}
![Screenshot - Configuration](/components/extractors/communication/email-attachments/email-attachments-1.png)

If needed, specify the primary key and CSV options under **Import Settings**.

## Test Email Import
Send an email with a data attachment to the generated email address.
Use the following [sample table](/components/extractors/communication/email-attachments/sample.csv):

| date | new | lost | total |
| --- | --- | --- | --- |
| 2016-03-29 | 8 | 5 | 256 |
| 2016-03-30 | 9 | 1 | 264 |
| 2016-03-31 | 15 | 3 | 276 |

With the email message content being completely arbitrary, all that matters are the attached files. 
The following conditions must be met:

- Each email must contain only one attachment.
- The attachment must be a CSV file.
- The attachment must always adhere to the format specified in **Import Settings**.

Click **Run** and confirm.

If the extraction is successful, you will be able to check the processed data in the imported table by clicking on the link.
There may be a delay between the time the email is sent, received, and picked up by the data source connector.

{: .image-popup}
![Screenshot - Job Detail](/components/extractors/communication/email-attachments/email-attachments-2.png)

***Note:** When multiple valid emails are received between the data source connector runs, they are imported into separate tables 
(`data1` -- `dataN`). If this is not desired, time the sending of the emails and configure the connector orchestration 
to make sure only one email is processed at a time.*
