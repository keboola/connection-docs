---
title: Teradata Transformation
permalink: /transformations/teradata/
---

* TOC
{:toc}

[Teradata Vantage™](https://www.teradata.com/) is the connected multi-cloud data platform for enterprise analytics that unifies everything—data lakes, data warehouses, analytics, and new data sources and types.
Leading the way with hybrid multi-cloud environments and priced for flexibility, Vantage delivers unlimited intelligence to build the future of your business.

## Example
To create a simple Teradata transformation, follow these steps:

- Create a table in Storage by uploading this [sample CSV file](/transformations/source.csv).
- Create an input mapping from that table, setting its destination to `source` (as expected by the Snowflake script).
- Create an output mapping, setting its destination to a new table in your Storage.
- Copy & paste the below script into the transformation code.
- Save and run the transformation.

{% highlight sql %}
CREATE TABLE "destinationTable" AS (SELECT "first", "second" FROM "sourceTable") WITH DATA;
{% endhighlight %}

{: .image-popup}
![Screenshot - Sample Transformation](/transformations/teradata/sample-transformation.png)

You can organize the script into [blocks](/transformations/#writing-scripts).
