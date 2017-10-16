---
title: Dark Sky
permalink: /extractors/other/dark-sky/
---

* TOC
{:toc}

This extractor allows you to look up the weather anywhere on the globe, returning Hour-by-hour or day-by-day observations going back decades.
Data are provided by [Dark Sky API](https://darksky.net/dev).

## Configuring Extractor

### API Secret Key

Before you start please create an account in [Dark Sky API](https://darksky.net/dev), log in a grab your API Secret key .
Dark Sky provides a trial with 1000 API calls/day for free.

{: .image-popup}
![Screenshot - Dark Sky API key](/extractors/other/dark-sky/dark-sky-token.png)


### Source Data Input Mapping
Extractor will fetch weather conditions for locations provided by you in one or more tables.
The table should contain following columns in particular order:

- `latitude` - The latitude of a location (in decimal degrees). Positive is north, negative is south.
- `longitude` - The longitude of a location (in decimal degrees). Positive is east, negative is west.
-  `date` - (optional) in format `YYYY-MM-DD`. By default current date is used.

Column names aren't important, only condition that should be matched is columns order. 
If you have a table with more columns or different order of columns, you can use Advanced input mapping and select a columns in a desired order.

{: .image-popup}
![Screenshot - Advanced Input Mapping](/extractors/other/dark-sky/input-mapping.png)

#### Sample Input table

|latitude|longitude|
|-----|----|
|50.0939141|14.45694|
|49.2577142|-123.194115|

You can test the extraction on this [sample file](/extractors/other/dark-sky/coords.csv).


## Extraction Output

Extractor produces one table `forecast` with following columns:

- `primary` - hash of latitude, longitude, date and key used for incremental saving of data
- `latitude` - latitude of coordinates translated from the address
- `longitude` - longitude of coordinates translated from the address
- `date` - date and time of weather conditions validity
- `key` - name of weather condition
- `value` - value of weather condition

Data are always imported incrementally.
You can find the description of all weather conditions in [Dark Sky API Documentation](https://darksky.net/dev/docs#data-point-object)


