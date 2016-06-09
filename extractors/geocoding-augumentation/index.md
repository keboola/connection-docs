---
title: Geocoding Augmentation
permalink: /extractors/geocoding-augumentation/
---

* TOC
{:toc}

This extractor allows you to do geocoding of locations to GPS coordinates and vice versa.

## Create new configuration

{: .image-popup}
![](/extractors/geocoding-augumentation/ui2.png)

## Configure Extraction

1. Add one or more input tables to input mapping. Please note that the table must have exactly one column with
locations (or two columns with latitudes and longitudes in case of reverse geocoding) or you have to map the
one (or two) columns in the configuration.

2. Add exactly one table to output mapping which will be filled with result of geocoding.

3. Fill [parameters configuration](#parameters). It is in JSON format and must contain method of geocoding,
data provider and other optional parameters like API key or locale.

{: .image-popup}
![](/extractors/geocoding-augumentation/ui3.png)

### Parameters

- **method** - method of geocoding, allowed values are:
    - **geocode** - standard geocoding of locations to coordinates
    - **reverse** - reverse geocoding of coordinates to locations
- **provider** - name of provider which will be queried for the data, allowed values are:
    - **google_maps** - Google Maps provider, needs parameter **apiKey** with your access key to the API (you need "Server" type of key)
    - **google_maps_business** - Google Maps for Business provider, needs parameters **clientId** and **privateKey**
    - **bing_maps** - Bing Maps provider, needs attribute **apiKey**
    - **yandex** - Yandex provider, does not need any API key, locale parameter may be one of these values: uk-UA, be-BY, en-US, en-BR, tr-TR
    - **map_quest** - MapQuest provider, needs parameter **apiKey**
    - **tomtom** - TomTom provider, needs parameter **apiKey**, parameter locale may have one of these values: de, es, fr, it, nl, pl, pt, sv
    - **opencage**: OpenCage provider, needs parameter **apiKey**
    - **openstreetmap**: OpenStreetMap provider, does not need API key
- **locale** - code of language used for local names

### Example

{% highlight json %}
{
    "method": "reverse",
    "provider": "google_maps",
    "#apiKey": "jfdksjknvmcxmvnc,x",
    "locale": "de"
}
{% endhighlight %}
