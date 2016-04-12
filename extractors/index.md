---
title: Extractors
permalink: /extractors/
---


{%comment %}

*Extractors* are [KBC components](/overview/) used for gathering data from sources. Typically, they connect to external
services (like facebook, youtube). But they can also connect directly to an arbitrary database, or process incoming e-mails. For a definitive list of usable extractors, see your project **Extractors** section. Since each extractor connects to a different data source, their configurations might differ greatly

Extractors are designed for automated of data collection (though they can of course always be triggered manually). If you really want to import data ad-hoc manually, see [data import in storage](/storage/import) or consult the corresponding
[part of tutorial](/overview/tutorial/load/)

  - introduction (goal, limits, sources)

The goal of extractor is to bring data into KBC. We encourage you to the path of least resistance, so always try to bring the data in, and then convert them to what you want them to look like. This is a typicall example when connecting to existing databases of your system, which store data in their tables. Converting data on the side of the legacy system can be difficult and
expensive task, just extract what you need and convert it in KBC.

Some extractors may have limits which are inherent to their sources, e.g. Twitter extractor won't let you acces history of tweets of an account, unless you pay big bucks for it. There is not much we can do about these things.

organizace podstranek
- related veci bych dal k sobe - treba mame dva youtube extractory (pokud teda budem povazovat za svuj ten od RT) a mohli by byt podstejnou slozkou
- alternativne bysme mohli mit neco jako

extractors
- generic databases (databazovy extractor, )
- information systems (salesforce, appanie)
- socieal services (youtube, facebook, twitter)
- other services (generic extractor)

{% endcomment %}
