---
title: Microsoft Outlook (Office 365)
permalink: /components/extractors/communication/ms-outlook/
redirect_from:
    - /extractors/communication/ms-outlook/
---

* TOC
{:toc}

Microsoft Outlook extractor for Office 365

## Authorization
[Create a new configuration](/components/#creating-component-configuration) of the **MS Outlook** extractor.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization).

## IMAP Settings
To configure the connection, please specify following parameters in IMAP Settings:

#### User Name
Your email address, for example: data@keboola.onmicrosoft.com

#### Password 
Leave this field empty. The component will use oAuth 2.0 for authentication.

#### IMAP Host
Address of the IMAP server. Use outlook.office365.com for Office 365. 

#### IMAP Port
Port of the IMAP server. Use 993 for Office 365.

## Row Configuration

Click the `Add Row` button and name the row accordingly.

#### Search query

Fill in a `Search query` to filter only the emails you want. By default all emails are downloaded. The most common usecase would be to filter the emails 
by the Subject and Sender, e.g. `(FROM "sender-email@example.com" SUBJECT "the subject")`. You can create much more complex queries if needed. 
Refer to the [query syntax](/components/extractors/communication/email-imap/query-syntax/) for more examples. 

#### IMAP Folder

Folder to get the emails from. Defaults to the root folder `INBOX`. For example a label name in GMAIL = folder.

#### Mark seen

When checked, emails that have been extracted will be marked as seen in the inbox.

#### Period from date

Use this field to filter only emails received since the specified date. This field supports fixed dates in a format `YYYY-MM-DD` as well as 
relative date period e.g. `yesterday`, `1 month ago`, `2 days ago`, etc. We recommend setting this to cover some safety interval, for example `2 days ago` when 
scheduled to run every day. The data is always upserted incrementally, so there won't be any duplicates in the resulting table.

#### Download Content

Check this option to download email content.

#### Download attachments

When set to true, also the attachments will be downloaded. You may use regex pattern to filter only attachments that are matching your definition. 

For example to match only pdf files you can use `.+\.pdf` pattern. If left empty, all attachments are downloaded.

By default, the files are downloaded into the File Storage. Use [processors](https://components.keboola.com/components?type=processor) 
to control the behaviour.

## Output

#### Table

Single table named **`emails`** containing the email contents.

The results are always inserted incrementally to avoid duplicates.

**Columns:** `['pk', 'uid', 'mail_box', 'date', 'from', 'to', 'body', 'headers', 'number_of_attachments', 'size']`


#### Attachments

**Attachments** are stored by default in the File Storage prefixed by the generated message pk. `bb41793268d4a8710fb5ebd94eaed6bc_some_file.pdf`.

The files will contain additional tags to distinguish the source:

{: .image-popup}
![Screenshot - Tags](/components/extractors/communication/email-imap/tags.png)

Additional tags can be specified by the [Create File Manifest processor](https://components.keboola.com/components/kds-team.processor-create-file-manifest) 
or further processed and stored in the Table Storage by other processors.