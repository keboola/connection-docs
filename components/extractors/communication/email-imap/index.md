---
title: IMAP Email Contents and Attachments
permalink: /components/extractors/communication/email-imap/
redirect_from:
    - /extractors/communication/email-imap/
---

* TOC
{:toc}

This data source connector allows you to automatically retrieve email contents and/or it's attachments via the [IMAP protocol](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol). 
It supports incremental loads and IMAP query to define specific criteria. 

The IMAP protocol provides several advantages:

- Emails stay intact in your original inbox
- Emails can be queried using a standardized [query syntax](query-syntax).
- Can be used with *almost* any provider, so it will work with Gmail as well as with Outlook and others.

## Features



| **Feature**                | **Note**                                                                                                                   |
|----------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Generic UI form            | Dynamic UI form                                                                                                            |             
| Row based configuration    | Allows execution of each row in parallel.                                                                                  |             
| Incremental loading        | Allows fetching data in new increments.                                                                                    |
| IMAP query syntax          | Filter emails using standard [IMAP query](query-syntax)                                                                    |
| Download email contents    | Full body of email downloaded into the Storage column                                                                      |
| Download email attachments | All attachments downloaded by default into a file storage.                                                                 |
| Filter email attachments   | Download only attachments matching specified regex expression                                                              |
| Processors support         | Use processor to modify the outputs before saving to storage, e.g. process attachments to be stored in the Tabular Storage |


## Getting Started


Have IMAP service enabled on your Email account. You will need the IMAP credentials (name, password) and the hostname and port information of the IMAP server.

Please refer to your email provider for more information.

Note that the app fetches emails from the root `INBOX` folder. If you use labels and filters in Gmail for instance, that move the messages to a different folder, 
please set the `imap_folder` configuration parameter.

### Example Using GMAIL Account

- Enable and create [App Password](https://support.google.com/accounts/answer/185833?hl=en) that will be specific for your integration. Name it for instance as `Keboola Extractor`
- Fill in your email address in the `Username` field.
- Fill in your generated App Password in the `Password` field.
- Fill in the Gmail imap address: `imap.gmail.com` in the `IMAP host field`
- Use port `993`

## Configuration

### IMAP Settings

Fill in the `Username`, `Password` and the `Hostname` and `Port` of your providers IMAP server. See the [Gmail example](#example-using-gmail-account) for inspiration.

{: .image-popup}
![Screenshot - Auth configuration](/components/extractors/communication/email-imap/auth.png)


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

