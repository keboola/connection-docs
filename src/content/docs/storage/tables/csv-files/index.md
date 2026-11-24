---
title: CSV files
slug: 'storage/tables/csv-files'
sidebar:
  label: CSV Files
description: 'The CSV format Storage accepts on import and produces on export: delimiter, enclosure, line breaks, encoding and compression, with an example.'
search_keywords: [csv, csv format, delimiter, enclosure, RFC 4180, utf-8, gzip, export format]
---

All data imported to and exported from Storage has to be in the CSV format. This page lists the format Storage accepts and the format it produces. To get data out of or into Microsoft Excel, see [CSV files in Excel](/storage/tables/csv-files/excel/).

<!-- Reference-type page. Source: the former CSV files page on main; text carried over and checked against it 2026-11-19. -->

In many cases, our data source and destination connectors take care of the necessary conversion,
but sometimes you have to be aware of the supported formats — for
example, when you are [loading data with the HTTP connector](/getting-started/load/).

## Input CSV format
Storage accepts CSV files in the format defined by [RFC 4180 Specification](https://tools.ietf.org/html/rfc4180).
This is basically compatible with CSV exports from OpenOffice Calc, MS Excel, and Google Drive.

- **Delimiter** can be specified by a parameter, defaults to comma `,`.
- **Enclosure** can be specified by a parameter, defaults to double quote `"`.
- Enclosure is escaped by preceding it with another enclosure character.
- Header row is required.
- Supported line breaks:
    - Windows (CRLF -- \r\n)
    - Unix (LF -- \n)
- File encoding is `UTF-8`.
- File can be uncompressed or [gzipped](http://www.gzip.org/).

### Example

Source table:

| col1                                           | col2                                   |
|------------------------------------------------|----------------------------------------|
| line without enclosure                         | second column                          |
| column with enclosure ", and comma inside text | second column enclosure in text "      |
| column with <br />new line                     | columns with,tab                       |
| column with backslash \ inside                 | column with backslash and enclosure \" |
| column with \n \t \\                           | second col                             |

Imported file:

    col1,col2
    line without enclosure,second column
    "column with enclosure "", and comma inside text","second column enclosure in text """
    "columns with
    new line",columns with    tab
    column with backslash \ inside,"column with backslash and enclosure \"""
    column with \n \t \\,second col

A CSV file in this format can be exported from

- OpenOffice / LibreOffice Calc, where you simply save the file in a Text CSV file and select *Unicode (UTF-8)* encoding.
- Google Drive, where it is the default output format (note, however, that you might
    prefer to use the [Google Sheets data source connector](/getting-started/load/googlesheets/) instead).
- Microsoft Excel by following [Export an Excel sheet as a file for Storage](/storage/tables/csv-files/excel/#export-an-excel-sheet-as-a-file-for-storage).

## Output CSV format
When you export a table from Storage, the same format is used for import:

- **Delimiter** is set to comma `,`.
- **Enclosure** is set to double quote `"`.
- Enclosure is escaped by preceding it with another enclosure character.
- Header row is always present.
- Unix line breaks are used (LF -- \n)
- File encoding is `UTF-8`.
- File is exported uncompressed (export function in Storage Console) or [gzipped](http://www.gzip.org/) (internal exports).

The above format is again compatible with many applications; you can

- open it in OpenOffice / LibreOffice Calc without any conversion (just make sure you use only comma as a delimiter 
when asked about the file format).
- import it into Google Drive without any conversion (notice, however, that you might want to
    use the [Google Drive data destination connector](/components/writers/storage/google-drive/) instead)
- import it into Microsoft Excel by following [Open a CSV file from Storage in Excel](/storage/tables/csv-files/excel/#open-a-csv-file-from-storage-in-excel).

*Note: The rows are exported in random order and there is no way to specify ordering of rows in the exported file.*

**Next:** [CSV files in Excel →](/storage/tables/csv-files/excel/)
