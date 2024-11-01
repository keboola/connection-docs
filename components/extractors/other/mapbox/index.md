---
title: Mapbox
permalink: /components/extractors/other/mapbox/
---

* TOC
{:toc}

This data source connector enriches input data using outputs from the [Mapbox API](https://docs.mapbox.com/api/overview/) and currently supports two endpoints: Isochrone and Matrix.
The first computes areas accessible within the same travel time and distance; the latter endpoint provides travel times or distances between numerous points.

## Prerequisites
Before configuring the connector, you must get a [Mapbox API token](https://docs.mapbox.com/help/getting-started/access-tokens/).

## Supported Endpoints

| Feature | Description |
|---|---|
| Isochrone | Coordinates reachable from a central point within the same travel time or distance |
| Matrix | Travel times or distances between source and destination coordinates |

## Configuration
First, enter the Mapbox API token in the connector configuration tab. 

Then, create one or more row configurations.

Set a table input mapping, select the endpoint, and define specific parameters for that endpoint. 

Optionally, specify the output table name.

When done, **save** the configuration.

### Isochrone Parameters
For more information on the Isochrone API, see the official [Isochrone API documentation](https://docs.mapbox.com/api/navigation/isochrone/).

To define the parameters, use the [Isochrone API Playground](https://docs.mapbox.com/playground/isochrone/).

| Parameter | Description |
|---|---|
| Routing profile | Profile used for calculating travel time or distance |
| Source coordinate columns | Names of columns in the input table with [decimal degree](https://en.wikipedia.org/wiki/Decimal_degrees) coordinates |
| Contour type | Choose time or distance for isochrone calculations | 
| Contour value | Specify one or multiple values and separate them by commas (in minutes for time, meters for distance). Maximum values are 60 minutes or 100,000 meters, respectively |
| Generalize | A positive floating point value in meters for Douglas-Peucker generalization |
| Polygons | Choose true for GeoJSON polygons or false for lines |
| Destination table name (optional) | Name of the output table, defaults to configuration ID + endpoint name if not specified |

### Matrix Parameters
For more information on the Matrix API, see the official [Matrix API documentation](https://docs.mapbox.com/api/navigation/matrix/).

| Parameter | Description |
|---|---|
| Routing profile | Profile for calculating duration or distance |
| Source coordinates columns | Names of columns with in the input table with [decimal degree](https://en.wikipedia.org/wiki/Decimal_degrees) coordinates |
| Destination coordinates column | Column containing up to 24 longitude, latitude coordinates separated by semicolons, e.g., 14.538, 50.053; 13.538, 49.053 |
| Annotations | Choose duration, distance, or both |
| Destination table name (optional) | Name of the output table, defaults to configuration ID + endpoint name if not specified | 

## Output
The output is a table with columns from the input mapping and additional columns for:

- Each contour value in GeoJSON polygons or lines for the Isochrone endpoint.
- A list of travel times or distances for the Matrix endpoint.
