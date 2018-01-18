---
title: CSV Files
permalink: /storage/tables/csv-files/
---

* TOC
{:toc}

All data imported to and exported from Storage has to be in the CSV format.

In many cases, our extractors and writers take care of the necessary conversion,
but sometimes you have to be aware of the supported formats --- for
example, when you are [loading data manually](/tutorial/load/).

## Input CSV Format
Storage accepts CSV files in the format defined by [RFC 4180 Specification](http://tools.ietf.org/html/rfc4180).
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

- OpenOffice / LibreOffice Calc, where you simply save the file in Text CSV file and select *Unicode (UTF-8)* encoding.
- Google Drive, where it is the default output format (note, however, that you might
    prefer to use the [Google Drive Extractor](/tutorial/load/googledrive/) instead).
- Microsoft Excel by following the below instructions.

### Exporting from Microsoft Excel
Because Microsoft Excel does not support UTF-8 encoding very well, it is a bit tricky to
export data correctly. There are a
[number of options](http://stackoverflow.com/questions/4221176/excel-to-csv-with-utf8-encoding),
but without using any non-standard Windows tools, the quickest is to save the Excel sheet as `Unicode Text (*.txt)`
format:

{: .image-popup}
![Screenshot -- Excel Export - Save File](/storage/tables/excel-export-1.png)

This will produce a tab-delimited file in UTF-16 encoding, which you can convert in Windows
Notepad. Simply open the file, and without making any modifications, save it with `UTF-8` encoding (and .csv extension):

{: .image-popup}
![Screenshot -- Excel Export - Notepad Convert](/storage/tables/excel-export-2.png)

The resulting file `import-data.txt.csv` can now be imported into KBC Storage as a tab delimited file.

{: .image-popup}
![Screenshot -- Excel Export - KBC Import](/storage/tables/excel-export-3.png)

*Note: as along your data do not contain any non-[ASCII](https://en.wikipedia.org/wiki/ASCII#Character_set) characters, you can simply save them as CSV.*

## Output CSV Format
When you export a table from Storage, the same format is used for import:

- **Delimiter** is set to comma `,`.
- **Enclosure** is set double quote `"`.
- Enclosure is escaped by preceding it with another enclosure character.
- Header row is always present.
- Unix line breaks are used (LF -- \n)
- File encoding is `UTF-8`.
- File is exported uncompressed (export function in Storage Console) or [gzipped](http://www.gzip.org/) (internal exports).

The above format is again compatible with many applications; you can

- Open it in OpenOffice / LibreOffice Calc without any conversion (just make sure you use only comma as a delimiter 
when asked about the file format).
- Import it into Google Drive without any conversion (notice, however, that you might want to
    use Google Drive Writer instead)
- Import it into Microsoft Excel by following the below instructions.

*Note: The rows are exported in random order and there is no way to specify ordering of rows in the exported file.*

### Opening in Microsoft Excel
The easiest way to import the CSV file exported from KBC into Microsoft Excel is by starting Excel and opening 
a **blank workbook**. Then use the **Data** -- **From Text** function and select the exported file:

{: .image-popup}
![Screenshot -- Excel Import -- Select file](/storage/tables/excel-import-1.png)

An import wizard will start. On its first screen, make sure you have selected the **delimited** file
and **Unicode UTF-8** encoding:

{: .image-popup}
![Screenshot -- Excel Import -- Import Wizard](/storage/tables/excel-import-2.png)

On the next screen, make sure that *only* the **comma** delimiter is selected:

{: .image-popup}
![Screenshot -- Excel Import -- Import Wizard](/storage/tables/excel-import-3.png)

However, using this method, Excel is not able to import new lines contained in table cells. 
If you need that, you have to use a more [complicated approach](http://stackoverflow.com/questions/2668678/importing-csv-with-line-breaks-in-excel-2007).
