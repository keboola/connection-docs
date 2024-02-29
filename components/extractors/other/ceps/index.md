---
title: ČEPS
permalink: /components/extractors/other/ceps/
---

* TOC
{:toc}

ČEPS, a.s. is a company providing operation of the electricity transmission system in the Czech Republic
This component enables you to extract publicly available data from the Ceps API. More information on the data
itself can be found on the [Ceps Data Website](https://www.ceps.cz/cs/data).


## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **ČEPS** data source connector.
Specify the date from and date to which you want to extract data. You can use either an exact date in YYYY-MM-DD format,
or you can set a relative date e.g. 1 month ago, 5 days ago, yesterday, now. Then set the endpoints and granularity 
of those endpoints that you want to fetch. 

By default, all endpoints and their highest granularity are set. For more information on 
granularity look into the [Ceps Data Website](https://www.ceps.cz/cs/data) where all is explained and visualized.

Once you set the date range and specified the endpoints, save the configuration and run it. Each endpoint will have its own
table in the output.


{: .image-popup}
![Screenshot - Incremental fetching](/components/extractors/other/ceps/ceps_config.png)

