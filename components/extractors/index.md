---
title: Data Source Connectors
permalink: /components/extractors/
redirect_from:
    - /extractors/

---

* TOC
{:toc}

Data source connectors (formerly known as extractors) are [Keboola components](/components/) used for **importing data from external sources into Keboola**.

## Types of Data Source Connectors
Typically, data source connectors connect to [APIs](https://en.wikipedia.org/wiki/Application_programming_interface#Web_APIs)
external services, like Facebook, YouTube, Gmail and so on.
They can also connect directly to an arbitrary database.

They can be grouped by their primary purpose:

- Database data source connectors: [SQL Databases](/components/extractors/database/sqldb/) and [NoSQL MongoDB](/components/extractors/database/mongodb/) and data source connectors from generic [Storage services](/components/extractors/storage/)
- [Communication](/components/extractors/communication/),
[Social Networks](/components/extractors/social/) and [Marketing and Sales](/components/extractors/marketing-sales/) data source connectors
- [Other](/components/extractors/other/) data source connectors, such as Geocoding-Augmentation or Weather Forecast

For a definitive list of usable data source connectors, see your project **Data Sources** section or the
[public list of components](https://components.keboola.com/components).

## Working with Data Source Connectors
Even though data source connectors are generally designed for [**automated and repeated**](/orchestrator/) data collection,
they can be triggered manually at any time.

- For manual import of ad-hoc data, see [Data Import in Storage](/storage/files/), or our [tutorial on manual data loading](/tutorial/load/).
- Configure a [sample data source connector](/tutorial/load/googledrive/) (GoogleDrive).
- Configure a [database data source connector](/tutorial/load/database/);
other SQL database data source connectors are configured in the exact same way.

As bringing data into Keboola is the main purpose of a data source connectors, go the path of least resistance:
**Get your data in first, and then convert it to what you want it to look like.**
To give an example, when connecting to existing information systems, do not modify the data in them.
Such data conversion can prove to be difficult and expensive. Extract what you need and shape it in Keboola.

## Limitations
Some data source connectors have **limits inherent to their sources**. Unfortunately, there is not much we can do about it.
For example, the Twitter data source connectors will not let you access the history of a particular tweet account beyond a certain point
because of the [limitations](https://stackoverflow.com/questions/1662151/getting-historical-data-from-twitter) of Twitter API.
