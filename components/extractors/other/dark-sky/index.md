---
title: Dark Sky
permalink: /extractors/other/dark-sky/
---

* TOC
{:toc}

This extractor allows you to look up the weather anywhere on the globe, returning hour-by-hour or day-by-day observations going back decades.
Data are provided by the [Dark Sky API](https://darksky.net/dev).

## Configuring Extractor

To configure the extractor, you need to provide tables with locations, your Dark Sky API key, units to use and a desired forecast granularity.

### API Secret Key

Before you start, please create an account in the [Dark Sky API](https://darksky.net/dev). Log in and get your API Secret key.
Dark Sky offers 1,000 API calls a day for free.

{: .image-popup}
![Screenshot - Dark Sky API key](/extractors/other/dark-sky/dark-sky-token.png)


### Source Data Input Mapping
The extractor fetches weather conditions for locations provided by you in one or more tables.
Each table must contain the following columns in this particular order:

- `latitude` --- The latitude of a location (in decimal degrees); positive is north, negative is south.
- `longitude` --- The longitude of a location (in decimal degrees); positive is east, negative is west.
- `date` (optional) --- The date in format `YYYY-MM-DD`. By default, the current date is used.

Column names are not important. The only condition that has to be matched is the column order. 
If you have a table with more columns, or the order of your columns is different, use the advanced input mapping and 
select the required columns in the desired order.

{: .image-popup}
![Screenshot - Advanced Input Mapping](/extractors/other/dark-sky/input-mapping.png)

#### Sample input table

|latitude|longitude|
|-----|----|
|50.0939141|14.45694|
|49.2577142|-123.194115|

You can test the extraction on this [sample file](/extractors/other/dark-sky/coords.csv).

## Extraction Output
The extractor produces one table called `weather` with the following columns:

- `primary` --- hash of the latitude, longitude, date and key used for incremental saving of data
- `latitude` --- latitude of the location
- `longitude` --- longitude of the location
- `date` --- date and time of the weather condition
- `key` --- name of the weather condition (e.g., `temperature`, `windSpeed`)
- `value` --- value of the weather condition

Data are always imported incrementally.
You can find the description of all weather conditions in the [Dark Sky API Documentation](https://darksky.net/dev/docs#data-point-object).


