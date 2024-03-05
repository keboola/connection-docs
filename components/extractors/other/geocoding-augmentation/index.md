---
title: Geocoding Augmentation
permalink: /components/extractors/other/geocoding-augmentation/
redirect_from:
    - /extractors/other/geocoding-augmentation/
---

* TOC
{:toc}

This data source connector provides detailed data for locations specified by their names, addresses, or coordinates.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Geocoding Augmentation** connector.

### Augment Locations
In this case, specify the location. The data source connector will fetch its geographical latitude and longitude 
using a specified [provider](#providers).
Specify one or more tables which have exactly one column with textual specification of the location. 
If the source table does not meet these requirements, 
edit the [input mapping](/transformations/mappings/#input-mapping) details accordingly. 

You can test the extraction on this [sample file](/components/extractors/other/geocoding-augmentation/locations.csv). 
Upload it to the `in.c-main` bucket in Storage first and call it `locations`.
Specify a single table in the [output mapping](/transformations/mappings/#output-mapping) 
and select the **geocode** method in the configuration. You can use the `openstreetmap` provider for free.
(The names of the input and CSV files are arbitrary, and so are the names of the columns.)

{: .image-popup}
![Screenshot - Add coordinates to locations](/components/extractors/other/geocoding-augmentation/geocoding-1.png)

### Augment Coordinates
In this mode of operation, specify the geographical latitude and longitude. The connector
will then fetch information about the closest place found on the map of the given [provider](#providers).
Specify one or more tables which have exactly two columns; the first column with a latitude, the second 
one with a longitude. If the source table does not meet these requirements, edit the [input mapping](/transformations/mappings/#input-mapping) details accordingly. 

You can test the extraction on this [sample file](/components/extractors/other/geocoding-augmentation/coords.csv). 
Specify a single table in the [output mapping](/transformations/mappings/#output-mapping), 
and select the **reverse** method in the configuration.
(The names of the input and CSV files are arbitrary, so are the names of the columns.) 

{: .image-popup}
![Screenshot - Add locations to coordinates](/components/extractors/other/geocoding-augmentation/geocoding-2.png)

## Providers
In the component configuration, specify different providers of the location data. Usage limits and the result data may differ between various providers. 
Some of the providers require the `locale` parameter to be set. If you are unsure, leave it empty or use `us`. 
The following are the available providers that will be queried for the data:

- **google_maps** - [Google Maps](https://developers.google.com/maps/documentation/geocoding/intro) provider, needs parameter **apiKey** with your access key to the API (you need "Server" type of key).
- **google_maps_business** - [Google Maps](https://developers.google.com/maps/premium/faq#getting_started) for Business provider, needs parameters **clientId** and **privateKey**.
- **bing_maps** - [Bing Maps](https://docs.microsoft.com/en-us/bingmaps/spatial-data-services/geocode-dataflow-api/?redirectedfrom=MSDN) provider, needs attribute **apiKey**.
- **yandex** - [Yandex](https://tech.yandex.com/maps/geocoder/doc/desc/concepts/about-docpage/) provider, does not need any API key, locale parameter may be one of these values: uk-UA, be-BY, en-US, en-BR, tr-TR.
- **map_quest** - [MapQuest](https://developer.mapquest.com/documentation/geocoding-api/) provider, needs parameter **apiKey**.
- **tomtom** - [TomTom](https://www.programmableweb.com/api/tomtom-geocoding) provider, needs parameter **apiKey**, parameter locale may have one of these values: de, es, fr, it, nl, pl, pt, sv.
- **opencage**: [OpenCage](https://opencagedata.com/) provider, needs parameter **apiKey**.
- **openstreetmap**: [OpenStreetMap](https://wiki.openstreetmap.org/wiki/Nominatim) provider, does not need any API key.
