---
title: Synapse Transformation
permalink: /transformations/synapse-plain/
---

* TOC
{:toc}

[Microsoft Synapse](https://azure.microsoft.com/en-us/services/synapse-analytics/) is an analytics 
service that brings together enterprise data warehousing and Big Data analytics. It runs natively
on Azure Cloud.

## Example
To create a simple Synapse transformation, follow these steps:

- upload the [sample CSV file](/transformations/source.csv) into your storage,
- set the input mapping from that table to `source` (expected by the Snowflake script),
- set the output mapping for the `destination` table (produced by the Snowflake script) to a new table in your Storage,
- copy & paste the below script into the transformation code, and, finally,
- save and run the transformation.

{% highlight sql %}
CREATE TABLE "result" WITH (DISTRIBUTION = ROUND_ROBIN) AS
	SELECT "first", "second" * 42 AS "larger_second" FROM "source";
{% endhighlight %}

{: .image-popup}
![Screenshot - Sample Transformation](/transformations/synapse-plain/sample-transformation.png)

You can organize the script into [blocks](/transformations/#writing-scripts).
