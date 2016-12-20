---
title: Extractors
permalink: /extractors/
---

* TOC
{:toc}

Extractors are [KBC components](/overview/) used for **importing data from external sources into KBC**. 

## Types of Extractors
Typically, extractors connect to external services [APIs](https://en.wikipedia.org/wiki/Application_programming_interface#Web_APIs), 
like Facebook, Youtube, etc. 
They can also connect directly to an arbitrary database, or, for instance, process incoming e-mails. 

Extractors can be grouped by their primary purpose: 

- Extractors for [SQL databases](/extractors/database/sqldb/) and [NoSQL MongoDB](/extractors/database/mongodb/))
- Extractors supporting [communication](/extractors/communication/), [social interaction](/extractors/social/), and [marketing and sales](/extractors/marketing-sales/)
- [Other](/extractors/other/) extractors

For a definitive list of usable extractors, see your project **Extractors** section. 

## Working with Extractors
Since each extractor connects to a different data source, their configurations might differ greatly.

Even though extractors are generally designed for **automated and repeated** data collection, 
they can be triggered manually at any time. 

- For manual import of ad-hoc data, see [Data Import in Storage](/storage/), or our tutorial on [manual data loading](/tutorial/load/).
- Configure a [sample extractor](/tutorial/load/googledrive/). 
- Configure a [database extractor](/tutorial/load/database/).

As bringing data into KBC is the main purpose of an extractor, go the path of least resistance:
**Get your data in first, and then convert it to what you want it to look like.** 
To give an example, when connecting to existing information systems, do not modify the data in them. 
Such data conversion can prove to be difficult and expensive. Extract what you need and shape it in KBC.

## Limitations
Some extractors have **limits inherent to their sources**. Unfortunately, there is not much we can do about it. 
For example, the Twitter extractor will not let you access the history of a particular tweet account beyond a certain point
because of the [limitations](http://stackoverflow.com/questions/1662151/getting-historical-data-from-twitter) of Twitter API.  


{% comment %}
organizace podstranek
- related veci bych dal k sobe - treba mame dva youtube extractory (pokud teda budem povazovat za svuj ten od RT) a 
mohli by byt podstejnou slozkou
- alternativne bysme mohli mit neco jako

extractors
- information systems (salesforce, appanie)
- generic databases (databazovy extractor, )
- social services (youtube, facebook, twitter)
- other services (generic extractor)

{% endcomment %}
