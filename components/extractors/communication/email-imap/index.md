---
title: IMAP Email Contents and Attachments
permalink: /components/extractors/communication/email-imap/
redirect_from:
    - /extractors/communication/email-imap/
---

* TOC
{:toc}

This extractor allows you to automatically retrieve email contents and/or attachments via the [IMAP protocol](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) using [basic authentication](https://en.wikipedia.org/wiki/Basic_access_authentication). 
It supports incremental loads and IMAP queries to define specific criteria. 


The IMAP protocol offers several advantages:

- Emails remain intact in your original inbox.
- Emails can be queried using a standardized [query syntax](query-syntax).
- It is compatible with *almost* any provider that supports **basic authentication**, including Gmail and others.
  <br>***Note:** If you wish to use IMAP with MS Outlook, use this component: [MS Outlook IMAP Email Content and Attachments (Office 365)](/components/extractors/communication/ms-outlook/).*


<div class="alert alert-warning" style="max-width: 450px;">
    <strong>Warning:</strong>
    This component supports IMAP only with <b>basic authentication</b>. If you wish to use IMAP with MS Outlook, use this component instead: <a href="/components/extractors/communication/ms-outlook/">MS Outlook IMAP Email Content and Attachments (Office 365)</a>.
</div>


## Features

| **Feature**                | **Note**                                                                                                                   |
|----------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Generic UI form            | Dynamic UI form adapting to various configurations.                                                                                                            |             
| Row based configuration    | Execute each row in parallel.                                                                                  |             
| Incremental loading        | Fetch new data in increments.                                                                                    |
| IMAP query syntax          | Filter emails using standardized [IMAP query syntax](query-syntax).                                                                    |
| Download email contents    | Download the full email body into the Storage column.                                                                      |
| Download email attachments | All attachments are downloaded by default into File Storage.                                                                 |
| Filter email attachments   | Download only attachments that match a specified regex expression.                                                              |
| Processors support         | Use processors to modify outputs before saving to Storage; e.g., process attachments to be stored in Tabular Storage. |


## Getting Started
Enable IMAP service on your email account. You will need your IMAP credentials (name, password), as well as the hostname and port of your IMAP server.
Check with your email provider if you need more details.

***Note:** The app fetches emails from the root `INBOX` folder. If you use labels or filters in email providers (e.g., Gmail) that move messages to a different folder, 
 set the `imap_folder` configuration parameter.*

### Example Using GMAIL Account

- Enable and create an [app password](https://support.google.com/accounts/answer/185833?hl=en) specificly for this integration. Name it, for instance, `Keboola extractor`.
- Enter your email address in the `Username` field.
- Enter the generated app password in the `Password` field.
- In the `IMAP host field`, entere the Gmail imap address: `imap.gmail.com`.
- Use port `993`.

## Configuration

### IMAP Settings

Fill in the `Username`, `Password`, `Hostname`, and `Port` of your provider's IMAP server. See the [Gmail example](#example-using-gmail-account) for guidance.

{: .image-popup}
![Screenshot - Auth configuration](/components/extractors/communication/email-imap/auth.png)

## Row Configuration

Click `Add Row` and name the row accordingly.

### Search Query

Enter a `Search query` to filter the emails you want. By default, all emails are downloaded. A common use case is to filter 
by Subject and Sender, e.g., `(FROM "sender-email@example.com" SUBJECT "the subject")`. More complex queries are also supported; 
refer to the [query syntax](query-syntax) for examples. 

{: .image-popup}
![Screenshot - Row configuration](/components/extractors/communication/email-imap/row.png)

### IMAP Folder

Specify the folder to fetch emails from. Defaults to the root folder `INBOX`. For example, in Gmail, a label can function as a folder.

### Mark as Seen

When selected, emails that have been extracted will be marked as "seen" in the inbox.

### Period from Date

Use this field to filter emails received since a specific date. The field supports fixed dates in the format `YYYY-MM-DD` as well as 
relative dates like `yesterday`, `1 month ago`, `2 days ago`, etc. To avoid missing data, set this to cover a buffer period, e.g., `2 days ago` when 
running daily. The data is always incrementally upserted, so duplicates won't appear in the resulting table.

### Download Content

Select this option to download the email content.

### Download Attachments

When enabled, attachments are also downloaded. You may use a regex pattern to filter for attachments that match your definition. 

For example, to match only PDF files, use the pattern `.+\.pdf`. If left empty, all attachments are downloaded by default.

The files are saved in File Storage by default. Use [processors](https://components.keboola.com/components?type=processor) 
to control the behaviour.

#### Example 1 - Processing CSV attachments

If your attachments are in CSV format, you can use this combination of processors to store them in Table Storage:

- Set the `folder` parameter in the [first processor](https://github.com/keboola/processor-move-files) to match the resulting table name.
- Use the [second processor](https://components.keboola.com/components/keboola.processor-create-manifest) to define that the result will always replace the destination table and expects header in the CSV file.
- ***Note:** In this setup, all attachments will be stored in the same table, so they msut share the same structure.*

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

If your attachments are in XLSX format, you can use this combination of processors to store them in Table Storage:

- The [first processor](https://components.keboola.com/components/kds-team.processor-xlsx2csv) converts each XSLX sheet into a separate table.
- The [second processor](https://github.com/keboola/processor-move-files) moves the converted files for output staging to the tables folder.

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


#### Example 3 - Storing attachments in File Storage and adding custom tags

Use [this processor](https://components.keboola.com/components/kds-team.processor-create-file-manifest) to store attachments in File Storage with custom tags. 
It adds custom tags to the resulting files and offers additional options to create tags based on the file name.

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

A single table named `emails` contains the email contents.

Results are inserted incrementally to avoid duplicates.

**Columns:** `'pk', 'uid', 'mail_box', 'date', 'from', 'to', 'body', 'headers', 'number_of_attachments', 'size'`


### Attachments

**Attachments** are stored by default in File Storage, with filenames prefixed by the generated message primary key, e.g., `bb41793268d4a8710fb5ebd94eaed6bc_some_file.pdf`.

Files include tags to distinguish their source:

{: .image-popup}
![Screenshot - Tags](/components/extractors/communication/email-imap/tags.png)

Additional tags can be specified with the [Create File Manifest processor](https://components.keboola.com/components/kds-team.processor-create-file-manifest). 
Attachments can also be further processed and stored in Table Storage using other processors.

