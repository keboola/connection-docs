---
title: Extractors
permalink: /extractors/
---

*Extractors* are [KBC components](/overview/) used for importing data from external sources into KBC. Typically, 
they connect to external services [APIs](https://en.wikipedia.org/wiki/Application_programming_interface#Web_APIs) 
(like Facebook, Youtube). But they can also connect directly to an arbitrary database, or e.g. process 
incoming e-mails. For a definitive list of usable extractors, see your project **Extractors** section. 
Since each extractor connects to a different data source, their configurations might differ greatly.

Extractors are generally designed for automated or repeated data collection, though they can of course 
always be triggered manually at any time. If you want to import ad-hoc data manually, see 
[data import in storage](/storage/) or consult the corresponding [part of tutorial](/overview/tutorial/load/).
There is also tutorial for configuring [sample extractor](/overview/tutorial/load/googledrive/), or 
[database extractor](/overview/tutorial/load/database/).

The goal of an extractor is to bring data into KBC. We encourage you to the path of least resistance, 
so always try to bring the data in, and **then** convert them to what you want them to look like. 
For example, when you are connecting to existing information systems, you should not modify data 
in that system. Converting data on the side of the legacy system can be difficult and
expensive task, just extract what you need and convert it to the right shape in KBC.

Also note that some extractors may have limits which are inherent to their sources, e.g. Twitter extractor 
won't let you access history of tweets of an account, because 
the Twitter API [does not do so](http://stackoverflow.com/questions/1662151/getting-historical-data-from-twitter). 
There is not much we can do about these kind of things.

{% comment %}
organizace podstranek
- related veci bych dal k sobe - treba mame dva youtube extractory (pokud teda budem povazovat za svuj ten od RT) a mohli by byt podstejnou slozkou
- alternativne bysme mohli mit neco jako

extractors
- generic databases (databazovy extractor, )
- information systems (salesforce, appanie)
- social services (youtube, facebook, twitter)
- other services (generic extractor)

{% endcomment %}
