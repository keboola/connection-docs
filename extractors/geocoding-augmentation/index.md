---
title: Geocoding Augmentation
permalink: /extractors/geocoding-augumentation/
---

* TOC
{:toc}

This extractor allows you to do extract additonal data about locations given by their coordinates 
and vice versa.

## Create new configuration
Find Geocoding Augmentation in the list of extractors and create a new configuration.

{: .image-popup}
![Screenshot - Create configuration](/extractors/geocoding-augumentation/ui1.png)

## Augment locations
In this mode operation, you need to specify location, and the extractor
will fetch its geographical lattitude and longitude using a specified [provided](#providers).
Specify one or more tables which have exactly one column which contains textual 
specification of the location. If the source table does not meet these requirements, edit
the *input mapping details* accordingly. You can test extraction 
on [sample file](/extractors/geocoding-augmentation/locations.csv). 
Specify a single table in the output mapping and select **geocode** method in configuration.
(names of input and CSV files are arbitrary, so are the names of the columns). 

{: .image-popup}
![Screenshot - Add coordinates to locations](/extractors/geocoding-augumentation/ui2.png)

## Augment coordinates
In this mode operation, you need to specify geographical lattitude and longitude, and the extractor
will fetch information about the closest place found on the map of the given [provided](#providers)
Specify one or more tables which have exactly two columns, first column must be lattitude, second 
column is longitude. If the source table does not meet these requirements, edit
the *input mapping details* accordingly. You can test extraction 
on [sample file](/extractors/geocoding-augmentation/coords.csv). 
Specify a single table in the output mapping and select **reverse** method in configuration.
(names of input and CSV files are arbitrary, so are the names of the columns). 

{: .image-popup}
![Screenshot - Add locations to coordinates](/extractors/geocoding-augumentation/ui3.png)

## Providers
In component configuration, you can specify different providers of the location 
data. Usage limits and the result data may differ between various providers. Some of the providers 
require the parameter `locale` to be set, if you are unsure, leave it empty or use `us`. 
Available providers which will be queried for the data, are:

- **google_maps** - [Google Maps](https://developers.google.com/maps/documentation/geocoding/intro) provider, needs parameter **apiKey** with your access key to the API (you need "Server" type of key)
- **google_maps_business** - [Google Maps](https://developers.google.com/maps/premium/faq#getting_started) for Business provider, needs parameters **clientId** and **privateKey**
- **bing_maps** - [Bing Maps](https://msdn.microsoft.com/en-us/library/ff701733.aspx) provider, needs attribute **apiKey**
- **yandex** - [Yandex](https://tech.yandex.com/maps/doc/geocoder/desc/concepts/About-docpage/) provider, does not need any API key, locale parameter may be one of these values: uk-UA, be-BY, en-US, en-BR, tr-TR
- **map_quest** - [MapQuest](https://www.mapquestapi.com/geocoding/) provider, needs parameter **apiKey**
- **tomtom** - [TomTom](http://www.programmableweb.com/api/tomtom-geocoding) provider, needs parameter **apiKey**, parameter locale may have one of these values: de, es, fr, it, nl, pl, pt, sv
- **opencage**: [OpenCage](https://geocoder.opencagedata.com/) provider, needs parameter **apiKey**
- **openstreetmap**: [OpenStreetMap](http://wiki.openstreetmap.org/wiki/Nominatim) provider, does not need API key
