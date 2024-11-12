---
title: MS Outlook IMAP Email Content and Attachments (Office 365)
permalink: /components/extractors/communication/ms-outlook/
redirect_from:
    - /extractors/communication/ms-outlook/
---

* TOC
{:toc}

Microsoft Outlook data source connector for Office 365 is based on IMAP. It allows you to download emails and their attachments from Office 365 accounts.

## Authorization
[Create a new configuration](/components/#creating-component-configuration) of the **MS Outlook** connector.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization).

## IMAP Settings
To configure the connection, please specify following parameters in IMAP Settings:

#### User Name
Your email address, for example: data@keboola.onmicrosoft.com

#### IMAP Host
Address of the IMAP server. Use outlook.office365.com for Office 365. 

#### IMAP Port
Port of the IMAP server. Use 993 for Office 365.

## Row Configuration

Click the `Add Row` button and name the row accordingly.

### Search Query

Fill in a `Search query` to filter only the emails you want. By default all emails are downloaded. The most common usecase would be to filter the emails 
by the Subject and Sender, e.g. `(FROM "sender-email@example.com" SUBJECT "the subject")`. You can create much more complex queries if needed. 
Refer to the [query syntax](query-syntax) for more examples. 

{: .image-popup}
![Screenshot - Row configuration](/components/extractors/communication/email-imap/row.png)

### IMAP Folder

Folder to get the emails from. Defaults to the root folder `INBOX`. For example a label name in GMAIL = folder.

### Mark as Seen

When checked, emails that have been extracted will be marked as seen in the inbox.

### Period from Date

Use this field to filter only emails received since the specified date. This field supports fixed dates in a format `YYYY-MM-DD` as well as 
relative date period e.g. `yesterday`, `1 month ago`, `2 days ago`, etc. We recommend setting this to cover some safety interval, for example `2 days ago` when 
scheduled to run every day. The data is always upserted incrementally, so there won't be any duplicates in the resulting table.

### Download Content

Check this option to download email content.

### Download Attachments

When set to true, also the attachments will be downloaded. You may use regex pattern to filter only attachments that are matching your definition. 

For example to match only pdf files you can use `.+\.pdf` pattern. If left empty, all attachments are downloaded.

By default, the files are downloaded into the File Storage. Use [processors](https://components.keboola.com/components?type=processor) 
to control the behaviour.

#### Example 1 - Processing CSV attachments

If your attachments are in csv format you can use this combination of processors to store them in the Table Storage:

- The `folder` parameter of the [first processor](https://github.com/keboola/processor-move-files) matches the resulting table name
- The [second processor](https://components.keboola.com/components/keboola.processor-create-manifest) defines that the result will always replace the destination table and expects header in the csv file.
- NOTE that in this setup all attachments will be stored in the same table, so they have to share the same structure.

```json
{
  "before": [],
  "after": [
    {
      "definition": {
        "component": "keboola.processor-move-files"
      },
      "parameters": {
        "direction": "tables",
        "folder": "result_table"
      }
    },
    {
      "definition": {
        "component": "keboola.processor-create-manifest"
      },
      "parameters": {
        "delimiter": ",",
        "enclosure": "\"",
        "incremental": false,
        "primary_key": [],
        "columns_from": "header"
      }
    },
    {
      "definition": {
        "component": "keboola.processor-skip-lines"
      },
      "parameters": {
        "lines": 1
      }
    }
  ]
}
```

#### Example 2 - Processing XLSX attachments

If your attachments are in xlsx format you can use this combination of processors to store them in the Table Storage:

- The [first processor](https://components.keboola.com/components/kds-team.processor-xlsx2csv) converts each of the XSLX tabs into a table.
- The [second processor](https://github.com/keboola/processor-move-files) is there to move the converted files for output staging to tables folder.

```json
{
  "before": [],
  "after": [
    {
      "definition": {
        "component": "kds-team.processor-xlsx2csv"
      },
      "parameters": {
        "addFileName": true,
        "selectSheets": [],
        "ignoreSheets": []
      }
    },
    {
      "definition": {
        "component": "keboola.processor-move-files"
      },
      "parameters": {
        "direction": "tables"
      }
    }
  ]
}
```


#### Example 3 - Storing attachments in File storage and adding custom tags

Use this combination of processors to store them in the File Storage with a custom tags set:

- The [first processor](https://components.keboola.com/components/kds-team.processor-create-file-manifest) adds custom tags to the result files, it also provides additional options to add tags based on the result file name.

```json
{
  "before": [],
  "after": [
    {
      "definition": {
        "component": "kds-team.processor-create-file-manifest"
      },
      "parameters": {
        "tags": [
          "SOME_TAG"
        ],
        "is_permanent": false,
        "tag_functions": []
      }
    }
  ]
}
```


## Output

### Table

Single table named **`emails`** containing the email contents.

The results are always inserted incrementally to avoid duplicates.

**Columns:** `['pk', 'uid', 'mail_box', 'date', 'from', 'to', 'body', 'headers', 'number_of_attachments', 'size']`


### Attachments

**Attachments** are stored by default in the File Storage prefixed by the generated message pk. `bb41793268d4a8710fb5ebd94eaed6bc_some_file.pdf`.

The files will contain additional tags to distinguish the source:

{: .image-popup}
![Screenshot - Tags](/components/extractors/communication/email-imap/tags.png)

Additional tags can be specified by the [Create File Manifest processor](https://components.keboola.com/components/kds-team.processor-create-file-manifest) 
or further processed and stored in the Table Storage by other processors.