---
title: Geocoding Augmentation
permalink: /extractors/geocoding-augmentation/
redirect_from:
  - /extractors/geocoding-augumentation/
---

* TOC
{:toc}

This extractor provides detailed data for locations specified by their names, address or coordinates.

## Create New Configuration
Find Geocoding Augmentation in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/extractors/geocoding-augmentation/ui1.png)

## Augment Locations
In this case, specify the location. The extractor will fetch its geographical latitude and longitude 
using a specified [provider](#providers).
Specify one or more tables which have exactly one column with textual specification of the location. 
If the source table does not meet these requirements, 
edit the [input mapping](/manipulation/transformations/mappings/#input-mapping) details accordingly. 

You can test the extraction on this [sample file](/extractors/geocoding-augmentation/locations.csv). 
Upload it to the 'in.c-main' bucket in Storage first and call it *locations*.
Specify a single table in the [output mapping](/manipulation/transformations/mappings/#output-mapping) 
and select the **geocode** method in the configuration.
(The names of the input and CSV files are arbitrary, and so are the names of the columns.)

{: .image-popup}
![Screenshot - Add coordinates to locations](/extractors/geocoding-augmentation/ui2.png)

## Augment Coordinates
In this mode of operation, specify the geographical latitude and longitude. The extractor
will then fetch information about the closest place found on the map of the given [provider](#providers).
Specify one or more tables which have exactly two columns; the first column with a latitude, the second 
one with a longitude. If the source table does not meet these requirements, edit the [input mapping](/manipulation/transformations/mappings/#input-mapping) details accordingly. 

You can test the extraction on this [sample file](/extractors/geocoding-augmentation/coords.csv). 
Specify a single table in the [output mapping](/manipulation/transformations/mappings/#output-mapping), 
and select the **reverse** method in the configuration.
(The names of the input and CSV files are arbitrary, so are the names of the columns.) 

{: .image-popup}
![Screenshot - Add locations to coordinates](/extractors/geocoding-augmentation/ui3.png)

## Providers
In the component configuration, specify different providers of the location data. Usage limits and the result data may differ between various providers. 
Some of the providers require the `locale` parameter to be set. If you are unsure, leave it empty or use `us`. 
The following are the available providers that will be queried for the data:

- **google_maps** - [Google Maps](https://developers.google.com/maps/documentation/geocoding/intro) provider, needs parameter **apiKey** with your access key to the API (you need "Server" type of key)
- **google_maps_business** - [Google Maps](https://developers.google.com/maps/premium/faq#getting_started) for Business provider, needs parameters **clientId** and **privateKey**
- **bing_maps** - [Bing Maps](https://msdn.microsoft.com/en-us/library/ff701733.aspx) provider, needs attribute **apiKey**
- **yandex** - [Yandex](https://tech.yandex.com/maps/doc/geocoder/desc/concepts/About-docpage/) provider, does not need any API key, locale parameter may be one of these values: uk-UA, be-BY, en-US, en-BR, tr-TR
- **map_quest** - [MapQuest](https://www.mapquestapi.com/geocoding/) provider, needs parameter **apiKey**
- **tomtom** - [TomTom](http://www.programmableweb.com/api/tomtom-geocoding) provider, needs parameter **apiKey**, parameter locale may have one of these values: de, es, fr, it, nl, pl, pt, sv
- **opencage**: [OpenCage](https://geocoder.opencagedata.com/) provider, needs parameter **apiKey**
- **openstreetmap**: [OpenStreetMap](http://wiki.openstreetmap.org/wiki/Nominatim) provider, does not need any API key
