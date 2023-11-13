---
title: Weather API
permalink: /components/extractors/other/weather-api/
---

* TOC
{:toc}

[Weather API](https://weatherapi.com) is a free service that offers information on forecasted, real-time, and historical weather, including marine weather.

This component enables users to load data from [Weather API](https://weatherapi.com) and bring it into Keboola Connection.

## Prerequisites

To use [Weather API](https://weatherapi.com), you must first register to obtain an API token.
Subscribe to the plan that fits your expected consumption.

## Configuration

* **Authentication**
    * **Api Token**: Your Weather API token
* **Fetching Settings**
    * **Parameters From** 
      - Choose `Configuration Parameters` to define the location, request type, and date range directly in the configuration.
      - Choose `Using an Input Table` to set the fetching parameters dynamically from an input table. This approach is beneficial when determining the location based on data from an upstream pipeline. 
    * **Request Type**  
      * Choose `Forecast` to obtain a forecast (use `Forecast days` to specify how many days ahead you want data for). 
      * Choose `History` to retrieve historical data. Use `Historical Date` to specify the period in the past.
    * **Location Query** (location_query): A query parameter for location. It can be latitude and longitude in decimal degrees, e.g., 48.8567,2.3508, a city name, e.g., Paris, or even an IP address like `100.0.0.1`. Learn more in the [documentation](https://www.weatherapi.com/docs/).
    * **Forecast Days** (forecast_days): The number of forecast days required.
    * **Historical Date** (historical_date): The date from which to fetch historical data, either in `YYYY-MM-DD` format or a relative date like `last week`.
    * **Continue On Failure** (continue_on_failure): A Boolean value. If set to `True`, the process will continue dispite fetching errors, and failed responses will be saved in the `failed_fetches.csv` file. 
  If set to `False`, the component run will terminate with an error as soon as one request fails.
* **Destination Settings** (destination_settings)
    * **Load Type** (load_type): If full load is selected, the destination table will be overwritten with every run. If incremental load is used, data will be upserted into the existing destination table. Full load overwrites the destination table each time.

## Input
If `fetch_parameter_from` is set to `input_table`, you can use a single input table to set fetching parameters.

* The table must have a 'location' column, or both `latitude` and `longitude` columns to specify the data fetching location.
  * The location column can also contain other [supported queries](https://www.weatherapi.com/docs/).
* If the request type is `forecast`, you can include a `forecast_days` column. It will define the `forecast_days` configuration value. If not provided, the `forecast_days` value will default to 10.
* If the request type is `history`, a `historical_date` column must be added. It will define the `historical_date` configuration value.

Each row in the input table represents a single API request.

## Output
There are four output tables:

- `weather_astronomical.csv`: Contains daily historical and future astronomical data.
- `weather_daily.csv`: Contains daily forecasts and historical data.
- `weather_hourly.csv`: Contains hourly forecasts and historical data.
- `failed_fetches.csv`: If the 'continue on failure' parameter is set to `true`, this table will record any errors that occurr during data fetching.
