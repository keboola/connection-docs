---
title: Use CSV files from Storage in Microsoft Excel
slug: 'storage/tables/csv-files/excel'
sidebar:
  label: CSV in Excel
description: 'Export an Excel sheet as a UTF-8 file that Storage accepts, and open a CSV file exported from Storage in Excel.'
search_keywords: [excel, csv, utf-8, export from excel, open csv in excel, import wizard, notepad]
---

Two tasks for moving data between Microsoft Excel and Storage. The format Storage accepts and the format it produces are listed in [CSV files](/storage/tables/csv-files/).

<!-- How-to-type page. Source: the Excel sections of the former CSV files page on main; text carried over and checked against it 2026-11-19. The Excel and Notepad steps were not re-run. -->

<!-- VERIFY(Nikita): both tasks describe an older Excel on Windows. Current Excel can save as "CSV UTF-8 (Comma delimited)" and imports with Data > From Text/CSV. Check whether the Notepad conversion and the import wizard steps should be replaced. -->

## Export an Excel sheet as a file for Storage

**Goal:** a UTF-8 file made from an Excel sheet that Storage imports correctly.

Because Microsoft Excel does not support UTF-8 encoding very well, it is a bit tricky to
export data correctly. There are a
[number of options](https://stackoverflow.com/questions/4221176/excel-to-csv-with-utf8-encoding),
but without using any non-standard Windows tools, the quickest is this:

1. Save the Excel sheet as `Unicode Text (*.txt)` format:

   ![Screenshot -- Excel Export - Save File](/storage/tables/excel-export-1.png)

   This will produce a tab-delimited file in UTF-16 encoding, which you can convert in Windows Notepad.

2. Open the file in Notepad and, without making any modifications, save it with `UTF-8` encoding (and .csv extension):

   ![Screenshot -- Excel Export - Notepad Convert](/storage/tables/excel-export-2.png)

3. Import the resulting file `import-data.txt.csv` into Keboola Storage as a tab delimited file:

   ![Screenshot -- Excel Export - KBC Import](/storage/tables/excel-export-3.png)

**Result:** the sheet is in Storage as a table, loaded from a UTF-8 file with the tab as its delimiter.

*Note: as long as your data does not contain any non-[ASCII](https://en.wikipedia.org/wiki/ASCII#Character_set) characters, you can simply save them as CSV.*

## Open a CSV file from Storage in Excel

**Goal:** a table exported from Storage, open in an Excel workbook with its columns and characters intact.

The easiest way to import the CSV file exported from Keboola into Microsoft Excel is this:

1. Start Excel and open a **blank workbook**.
2. Use the **Data** -- **From Text** function and select the exported file:

   ![Screenshot -- Excel Import -- Select file](/storage/tables/excel-import-1.png)

3. An import wizard will start. On its first screen, select the **delimited** file and **Unicode UTF-8** encoding:

   ![Screenshot -- Excel Import -- Import Wizard](/storage/tables/excel-import-2.png)

4. On the next screen, make sure that *only* the **comma** delimiter is selected:

   ![Screenshot -- Excel Import -- Import Wizard](/storage/tables/excel-import-3.png)

**Result:** the exported table is in the workbook, one CSV column per Excel column.

However, using this method, Excel is not able to import new lines contained in table cells.
If you need to do that, you have to use a more [complicated approach](https://stackoverflow.com/questions/2668678/importing-csv-with-line-breaks-in-excel-2007).

**Next:** [Back up and restore tables →](/storage/tables/backups/)
