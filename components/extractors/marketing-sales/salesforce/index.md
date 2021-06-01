---
title: Salesforce
permalink: /components/extractors/marketing-sales/salesforce/
redirect_from:
    - /extractors/marketing-sales/salesforce/
---

* TOC
{:toc}
  
This extractor allows you to import data from Salesforce via the Bulk API. Data can can be fetched in two ways; by running
a specified SOQL query, or by selecting a salesforce object and getting all data from that object.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Salesforce V2** extractor.

To configure this extractor, you need to provide a **username**, **password**, and **API security token**. Then select if
you want to get data from your sandbox or production environment.

{: .image-popup}
![Screenshot - Config](/components/extractors/marketing-sales/salesforce/config.png)

After this you can configure individual queries or objects in the [row based configuration](https://help.keboola.com/components/#configuration-rows).

{: .image-popup}
![Screenshot - Row configuration](/components/extractors/marketing-sales/salesforce/row_config.png)

In the row configuration select either Query or Object and use the corresponding text input to input a single query or 
object. Then select if you wish to fetch deleted records as well. Finally, set the loading type to either Full or Incremental based
on your use case.

### Load Type
Select one of the following two load types: 

- `Incremental Update` -- updates the result tables based on the primary key set in the configuration
- `Full Load` -- overwrites the destination table each time

## Limitations

Due to the extractor utilizing the Salesforce Bulk API, it will not be possible to run all types of queries. 

Bulk API does not support queries with any of the following:
* GROUP BY, OFFSET, or TYPEOF clauses
* Aggregate functions such as COUNT()
* Date functions in GROUP BY clauses (date functions in WHERE clauses are supported)
 * Compound address fields or compound geolocations fields