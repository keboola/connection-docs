---
title: What3words Augmentation
permalink: /extractors/other/what3words/
---

* TOC
{:toc}

This extractor allows you to translate [what3words](https://what3words.com/) addresses to coordinates and vice versa.
Before using the extractor, you need to [obtain a what3words API key](https://docs.what3words.com/api/v2/#overview).
Notice that each translated address requires one API call.

## Create New Configuration
Find the what3words augmentation in the list of extractors, and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/extractors/other/what3words/ui1.png)

## Augment What3words Address
In this mode of operation, you identify [what3words](https://what3words.com/about/) addresses, and the extractor
then fetches the geographical latitude and longitude coordinates for the places. 
Specify a single table which has exactly one column with what3words addresses.
If the source table does not meet this requirement, 
edit the [input mapping](/transformations/mappings/#input-mapping) details accordingly. 

You can test the extraction on this [sample file](/extractors/other/what3words/words.csv). 
Upload it to the 'in.c-w3w' bucket in Storage first, and call it *words*.
After that, specify the table in the [input mapping](/transformations/mappings/#input-mapping) as the source table, 
and select the **forward** method in the configuration.
(The names of the columns and the csv file in the input mapping are not important, use any names you like.)

{: .image-popup}
![Screenshot - Add coordinates to w3w address](/extractors/other/what3words/ui2.png)

## Augment Coordinates
In this case, you specify geographical latitude and longitude coordinates, and the extractor fetches their what3words addresses.
Select one or more tables which have exactly two columns: the first column with a latitude, the second one with a longitude. 
If the source table does not meet these requirements, edit the [input mapping](/transformations/mappings/#input-mapping) 
details accordingly. 

You can test the extraction on this [sample file](/extractors/other/what3words/coords.csv). 
Upload it to the 'in.c-w3w' bucket in Storage first, and call it *coords*.
Specify the table in the [input mapping](/transformations/mappings/#input-mapping) as the source, 
and select the **reverse** method in the configuration.
(The names of the columns and the csv file in the input mapping are not important, use any name you like.)

{: .image-popup}
![Screenshot - Add w3w address to coordinates](/extractors/other/what3words/ui3.png)
