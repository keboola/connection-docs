---
title: What3Words Augmentation
permalink: /extractors/other/what3words/
---

* TOC
{:toc}

This extractor allows you to translate [What3Words](https://what3words.com/) addresses to coordinates and vice versa.
Before using the extractor, you need to [obtain the API key](https://docs.what3words.com/api/v2/#overview).
Notice that each translated adress corresponds to a single API call.

## Create New Configuration
Find What3Words Augmentation in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/extractors/other/what3words/ui1.png)

## Augment What3words Address
In this mode of operation, specify the [What3words](https://what3words.com/about/) address. The extractor
will then fetch geographical latitude and longitude for the place. Specify a single table which has exactly 
one column with What3words address of the location.
If the source table does not meet these requirements, 
edit the [input mapping](/manipulation/transformations/mappings/#input-mapping) details accordingly. 

You can test the extraction on this [sample file](/extractors/other/what3words/words.csv). 
Upload it to the 'in.c-w3w' bucket in Storage first and call it *words*.
Specify a single table in the [output mapping](/manipulation/transformations/mappings/#output-mapping) 
and select the **forward** method in the configuration.
(The names of the input and CSV files are arbitrary, and so are the names of the columns.)

{: .image-popup}
![Screenshot - Add coordinates to w3w address](/extractors/other/what3words/ui2.png)

## Augment Coordinates
In this case, specify geographical latitude and longitude and the extractor will fetch What3words address.
Specify one or more tables which have exactly two columns; the first column with a latitude, the second 
one with a longitude. If the source table does not meet these requirements, edit the [input mapping](/manipulation/transformations/mappings/#input-mapping) details accordingly. 

You can test the extraction on this [sample file](/extractors/other/what3words/coords.csv). 
Upload it to the 'in.c-w3w' bucket in Storage first and call it *coords*.
Specify a single table in the [output mapping](/manipulation/transformations/mappings/#output-mapping) 
and select the **reverse** method in the configuration.
(The names of the input and CSV files are arbitrary, and so are the names of the columns.)

{: .image-popup}
![Screenshot - Add w3w address to coordinates](/extractors/other/what3words/ui3.png)
