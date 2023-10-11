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
    * Api Token (#api_token) : Weather API token
* Fetching Settings (fetching_settings) :
    * Fetch Parameter From (fetch_parameter_from) : Choose one of ['config_parameters', 'input_table'], if 'config_parameters' the fetching parameters should be set and will be used for fetching. 
The 'input_table' is to be used if you want to use an input table to fetch data with a list of parameters, see the input table section for more information
    * Request Type (request_type) : One of ['forecast', 'history']. 
With 'forecast' the forecast data for the upcoming days will be fetched (use 'forecast_days' to set how many days in the future you wish to fetch data for).
With 'history' historical forecast data is fetched for a selected date that is set with the 'historical_date' parameter.
    * Location Query (location_query) : Query parameter for location. It could be Latitude and Longitude (Decimal degree) e.g 48.8567,2.3508, or city name e.g. Paris
    * Forecast Days (forecast_days) : Number of days of forecast required.
    * Historical Date (historical_date) : Date to fetch historical data from, either exact date in YYYY-MM-DD format or relative date e.g: last week.
    * Continue On Failure (continue_on_failure) : Boolean value, if set to True, when an error occurs in fetching, the fetching will continue and failed responses will be saved in the **failed_fetches.csv** file. 
  If set to False the component run will end with an error as soon as a single request fails.
* Destination Settings (destination_settings) :
    * Load Type (load_type) : one of ['full_load', 'incremental_load'] If set to Incremental load, the result tables will be updated based on primary key. 
Full load overwrites the destination table each time.


## Input

If the 'fetch_parameter_from' is set to 'input_table', a single input table can be used to set parameters for fetching.

* The table must contain a 'location' column, or a 'latitude' and 'longitude' column to define the location to fetch for.
* If Request Type is set to 'forecast', a 'forecast_days' column can be added, that defines the 'forecast_days' from the configuration, If it is not added, the 'forecast_days' defaults to 10.
* If Request Type is set to 'history', a 'historical_date' column must be added, that defines the 'historical_date' from the configuration.

Each row in the input table is a single request to the API.

## Output

There are 4 output tables:

- `weather_astronomical.csv`: Contains daily astronomical future and historical forecasts.
- `weather_daily.csv`: Contains daily future and historical forecasts.
- `weather_hourly.csv`: Contains hourly future and historical forecasts.
- `failed_fetches.csv`: If continue on failure parameter is set to True, then this table will get filled with errors that occurred during fetching.
