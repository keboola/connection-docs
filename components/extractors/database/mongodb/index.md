---
title: MongoDB
permalink: /components/extractors/database/mongodb/
redirect_from:
    - /extractors/database/mongodb/
---

* TOC
{:toc}

The MongoDB data source connector allows you to fetch data from the NoSQL [MongoDB database](https://www.mongodb.com/). Supported MongoDB versions are from 4.4 to the latest (6.0). 
Version 4.2 may work, though it is not guaranteed, and lower version are not supported due to `mongoexport` compatibility.
Follow these steps to configure it.

## Set Up Database Credentials
[Create a new configuration](/components/#creating-component-configuration), click **Set Up Database Credentials**, and complete the form. 
Then test the credentials and save them. Optionally, set up an [SSH tunnel](/components/extractors/database/#connecting-to-database).

{: .image-popup}
![MongoDB new credentials](/components/extractors/database/mongodb/mongodb-1.png)

## Configure Exports
Click the **New Export** button to configure your first export, using the following options:

{: .image-popup}
![MongoDB new export](/components/extractors/database/mongodb/mongodb-2.png)

- **Name:** Identifies your export; this value must be unique across all exports and exported tables in
your configuration. The main exported table will be named after the value in the Name field.

- **Collection:** Represents the collection name in your MongoDB database.

- **Query** (optional): A JSON string specifying a query to limit the documents included in the exported data.
Must be specified in a [strict format](#strict-format).

- **Sort** (optional): A JSON string specifying the order of documents in the exported data.
Must be specified in a [strict format](#strict-format).

- **Limit** (optional): Limits the number of exported documents.

- **Incremental:** Loads data to your tables incrementally.

- **Mode:** Specifies the export mode, either *Mapping* or *Raw*. Start by exporting a few documents using 
[Raw mode](#raw-export-mode) first; this helps you see the document structure for writing your mapping.

- **Mapping:** This section is crucial if you have selected *Mapping* mode as it defines [how documents in the collection are mapped](#configure-mapping) to the output tables.
The mapping must also be valid JSON. 

***Tip:** While experimenting with the mapping section, use a combination of a limit (e.g., only 10 documents) and a query (e.g., 
only documents with a specific ID) to avoid exporting the entire collection.*

## Incremental Fetching

To improve data extraction performance and reduce data transfer volume, you can use incremental fetching. 
Incremental fetching retrieves only new or modified records from MongoDB, avoiding the need to re-fetch the entire dataset.

### How It Works

1. **Specify a Cursor Field**: Select a field in your MongoDB collection to act as the "cursor" for incremental fetching, such as a timestamp field `updated_at` or an auto-generated MongoDB `_id` containing a time component.

2. **Configure and Enable Incremental Fetching**: In your MongoDB extractor configuration, set the `Property` field in the Incremental Fetching block to specify the cursor field. The extractor will then limit the query on each run, fetching only records where the cursor field value differs from the last recorded value.

3. **State Management for Continuity**: After each execution, the extractor saves the highest cursor value to maintain state. This allows future extractions to start from the previous endpoint, ensuring only new or updated records are fetched.

### Strict Format
A strict format requires standard valid JSON, so MongoDB objects typically used in the [JavaScript shell interface](https://docs.mongodb.com/v3.2/reference/program/mongo/#bin.mongo), such as
*ObjectId*, *Date*, or *NumberLong*, cannot be used unless specified in strict format. Read more on the [strict format](https://docs.mongodb.com/v3.2/reference/mongodb-extended-json/).

## Configure Mapping
By defining mapping, you specify the structure and content of your output tables, including their columns and relationships.

{: .image-popup}
![MongoDB new export filled](/components/extractors/database/mongodb/mongodb-3.png)

***Tip:** Export a few documents using the [Raw Export Mode](#raw-export-mode) first -- it will help you see
the document structure (in Strict Format) needed for writing your mapping.*

### Primary Key
Since MongoDB uniquely identifies each document in a collection by `_id`, we recommend setting
a primary key to this field by defining it as the first item in the mapping section:

{% highlight json %}
{
    "_id.$oid": {
        "type": "column",
        "mapping": {
            "destination": "id",
            "primaryKey": true
        }
    }
}
{% endhighlight %}

***Note:** The destination column for the primary key should be named `id` (not `_id`) to prevent issues with data import.*

### Other Data Types
To handle MongoDB data types correctly, define mapping similarly to the following example for
`MongoId`, `ISODate`, and `NumberLong` data types.

<table class="table table-bordered">
<tr>
<td>Document</td>
<td>
{% highlight javascript %}
{
    "_id" : ObjectId("5a9d1e9b00c99bbb33c9863a"),
    "publishedAt" : ISODate("2018-03-05T10:40:27.938Z"),
    "views" : NumberLong(1)
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Document in Strict Mode</td>
<td>
{% highlight json %}
{
    "_id": {
        "$oid": "5a9d1e9b00c99bbb33c9863a"
    },
    "publishedAt": {
        "$date": "2018-03-05T10:40:27.938Z"
    },
    "views": {
        "$numberLong": "1"
    }
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Mapping</td>
<td>
{% highlight json %}
{
    "_id.$oid": "id",
    "publishedAt.$date": "publishedAt",
    "views.$numberLong": "views"
}
{% endhighlight %}
</td>
</tr>
</table>

Check out [more mapping examples](/components/extractors/database/mongodb/mapping/).

## Raw Export Mode
In the raw export mode, documents are exported as plain JSON strings.

<table class="table table-bordered">
<tr>
<td>Document</td>
<td>
{% highlight javascript %}
{
    "_id" : ObjectId("5716054bee6e764c94fa7ddd"),
    "name" : "MongoDB connector"
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Document in Strict Mode</td>
<td>
{% highlight json %}
{
    "_id": {
        "$oid" : "5716054bee6e764c94fa7ddd"
    },
    "name": "MongoDB connector"
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Output</td>
<td>

<table>
<tr><th>id</th><th>data</th></tr>
<tr>
<td>5716054bee6e764c94fa7ddd</td>
<td>
{
    "_id": {
        "$oid" : "5716054bee6e764c94fa7ddd"
    },
    "name": "MongoDB connector"
}
</td>
</tr>
</table>

</td>
</tr>
</table>
