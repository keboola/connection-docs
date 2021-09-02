---
title: Exasol Transformation
permalink: /transformations/exasol/
---

* TOC
{:toc}

[Exasol](https://www.exasol.com/) is the high-performance, in-memory MPP(Massively Parallel Processing) database specifically designed for analytics. From business-critical data applications to advanced analytics, Exasol helps you analyze large volumes of data.



## Example
To create a simple Exasol transformation, follow these steps:

- Create a table in Storage by uploading the [sample CSV file](/transformations/source.csv).
- Create an input mapping from that table, setting its destination to `source` (as expected by the Snowflake script).
- Create an output mapping, setting its destination to a new table in your Storage.
- Copy & paste the below script into the transformation code.
- Save and run the transformation.

{% highlight sql %}
SELECT "first", "second" INTO TABLE "destinationTable" FROM "sourceTable";
{% endhighlight %}

{: .image-popup}
![Screenshot - Sample Transformation](/transformations/exasol/sample-transformation.png)

You can organize the script into [blocks](/transformations/#writing-scripts).
