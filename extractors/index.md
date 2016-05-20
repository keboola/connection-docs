---
title: Extractors
permalink: /extractors/
---

*Extractors* are [KBC components](/overview/) used for importing data from external sources into KBC. Typically, 
they connect to external services [APIs](https://en.wikipedia.org/wiki/Application_programming_interface#Web_APIs),
like Facebook, Youtube, etc. They can also connect directly to an arbitrary database, or, for instance, process 
incoming e-mails. For a definitive list of usable extractors, see your project **Extractors** section. 
Since each extractor connects to a different data source, their configurations might differ greatly.

Extractors are generally designed for automated or repeated data collection, though they can 
be triggered manually at any time. For manual import of ad-hoc data, see
[Data Import in Storage](/storage/) or consult our tutorial on [manual data loading](/overview/tutorial/load/).
A tutorial on configuring a [sample extractor](/overview/tutorial/load/googledrive/) and 
a [database extractor](/overview/tutorial/load/database/) is also available.

As bringing data into KBC is the main purpose of an extractor, go the path of least resistance,
get your data in first, and **then** convert it to what you want it to look like. 
To give an example, when you are connecting to existing information systems, do not modify the data in them. 
Such data conversion can prove to be difficult and expensive. Extract what you need and shape it in KBC.

Some extractors have limits inherent to their sources. Unfortunately, there is not much we can do about it. 
For example, the Twitter extractor will not let you access the history of a particular account tweets 
because the Twitter API [does not do so](http://stackoverflow.com/questions/1662151/getting-historical-data-from-twitter). 


{% comment %}
organizace podstranek
- related veci bych dal k sobe - treba mame dva youtube extractory (pokud teda budem povazovat za svuj ten od RT) a 
mohli by byt podstejnou slozkou
- alternativne bysme mohli mit neco jako

extractors
- generic databases (databazovy extractor, )
- information systems (salesforce, appanie)
- social services (youtube, facebook, twitter)
- other services (generic extractor)

{% endcomment %}
