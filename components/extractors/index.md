---
title: Extractors
permalink: /components/extractors/
redirect_from:
    - /extractors/

---

* TOC
{:toc}

Extractors are [Keboola Connection components](/components/) used for **importing data from external sources into Keboola Connection**.

## Types of Extractors
Typically, extractors connect to [APIs](https://en.wikipedia.org/wiki/Application_programming_interface#Web_APIs)
external services, like Facebook, Youtube, Gmail and so on.
They can also connect directly to an arbitrary database.

Extractors can be grouped by their primary purpose:

- Database extractors: [SQL Databases](/components/extractors/database/sqldb/) and [NoSQL MongoDB](/components/extractors/database/mongodb/) and extractors from generic [Storage services](/components/extractors/storage/)
- [Communication](/components/extractors/communication/),
[Social Networks](/components/extractors/social/) and [Marketing and Sales](/components/extractors/marketing-sales/) extractors
- [Other](/components/extractors/other/) extractors such as Geocoding-Augmentation or Weather Forecast

For a definitive list of usable extractors, see your project **Extractors** section or the
[public list of components](https://components.keboola.com/components).

## Working with Extractors
Even though extractors are generally designed for [**automated and repeated**](/orchestrator/) data collection,
they can be triggered manually at any time.

- For manual import of ad-hoc data, see [Data Import in Storage](/storage/files/), or our [tutorial on manual data loading](/tutorial/load/).
- Configure a [sample extractor](/tutorial/load/googledrive/) (GoogleDrive).
- Configure a [Database extractor](/tutorial/load/database/);
other SQL database extractors are configured in the exact same way.

As bringing data into Keboola Connection is the main purpose of an extractor, go the path of least resistance:
**Get your data in first, and then convert it to what you want it to look like.**
To give an example, when connecting to existing information systems, do not modify the data in them.
Such data conversion can prove to be difficult and expensive. Extract what you need and shape it in Keboola Connection.

## Limitations
Some extractors have **limits inherent to their sources**. Unfortunately, there is not much we can do about it.
For example, the Twitter extractor will not let you access the history of a particular tweet account beyond a certain point
because of the [limitations](https://stackoverflow.com/questions/1662151/getting-historical-data-from-twitter) of Twitter API.
