---
title: Weather API
permalink: /components/extractors/other/weather-api/
---

* TOC
{:toc}

# Introduction

[Weather API](https://weatherapi.com) is a service that provides data of Real Time, Forecasted, Future, Marine and Historical Weather

This component enables users to extract forecast and historical weather data from the [Weather API](https://weatherapi.com).

## Prerequisites

To utilize the [Weather API](https://weatherapi.com) you must first register and get an API token.
You should subscribe to the plan based on your expected consumption.

## Configuration Guide

* Authentication (authentication) :
    * **Api Token**: Weather API token
* **Fetching Settings** :
    * **Parameters From** 
      - Select `Configuration Parameters` to define the location, request type and date range directly in the configuration.
      - Select `Using an Input Table` to define the fetching parameters dynamically from the input table. This is useful when you want to define the location based on your data in the upstream pipeline. 
    * **Request Type**  
      * Select `Forecast` to get forecast in the future (use `Forecast days` to set how many days in the future you wish to fetch data for). 
      * Select `History` to get historical data. The `Historical Date` controls how long in the past.
    * **Location Query** (location_query) : Query parameter for location. It could be Latitude and Longitude (Decimal degree) e.g. 48.8567,2.3508, or city name e.g. Paris or even IP address `100.0.0.1`. More in the [docs](https://www.weatherapi.com/docs/)
    * **Forecast Days** (forecast_days) : Number of days of forecast required.
    * **Historical Date** (historical_date) : Date to fetch historical data from, either exact date in `YYYY-MM-DD` format or relative date e.g: `last week`.
    * **Continue On Failure** (continue_on_failure) : Boolean value, if set to True, when an error occurs in fetching, the fetching will continue and failed responses will be saved in the **failed_fetches.csv** file. 
  If set to False the component run will end with an error as soon as a single request fails.
* **Destination Settings** (destination_settings) :
    * **Load Type** (load_type) : If full load is used, the destination table will be overwritten with every run. If incremental load is used, data will be upserted into the destination table. Full load overwrites the destination table each time.


## Input

If the 'fetch_parameter_from' is set to 'input_table', a single input table can be used to set parameters for fetching.

* The table must contain a 'location' column, or a 'latitude' and 'longitude' column to define the location to fetch for.
  * Location column may contain other [supported queries](https://www.weatherapi.com/docs/)
* If Request Type is set to 'forecast', a 'forecast_days' column can be added, that defines the 'forecast_days' from the configuration, If it is not added, the 'forecast_days' defaults to 10.
* If Request Type is set to 'history', a 'historical_date' column must be added, that defines the 'historical_date' from the configuration.

Each row in the input table is a single request to the API.

## Output

There are 4 output tables:

- `weather_astronomical.csv`: Contains daily astronomical future and historical forecasts.
- `weather_daily.csv`: Contains daily future and historical forecasts.
- `weather_hourly.csv`: Contains hourly future and historical forecasts.
- `failed_fetches.csv`: If continue on failure parameter is set to True, then this table will get filled with errors that occurred during fetching.
