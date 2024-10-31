---
title: MongoDB
permalink: /components/extractors/database/mongodb/
redirect_from:
    - /extractors/database/mongodb/
---

* TOC
{:toc}

The MongoDB data source connector allows you to fetch data from the NoSQL [MongoDB database](https://www.mongodb.com/). Supported MongoDB versions are from 4.4 to latest (6.0). 4.2 could work also, but not guaranteed. Lower version are not supported by version of mongoexport.
Complete the following steps to configure it.

## Set Up Database Credentials
[Create a new configuration](/components/#creating-component-configuration) and click **Set Up Database Credentials** and fill in the form. 
Then test the new credentials and save them. Optionally, set up an [SSH tunnel](/components/extractors/database/#connecting-to-database).

{: .image-popup}
![MongoDB new credentials](/components/extractors/database/mongodb/mongodb-1.png)

## Configure Exports
Click the **New Export** button and configure your first export using the following options:

{: .image-popup}
![MongoDB new export](/components/extractors/database/mongodb/mongodb-2.png)

- **Name** -- Identifies your export; its value has to be unique across all exports and exported tables in
your configuration. Also, the main exported table will be named after the value of the Name field.

- **Collection** -- Represents the collection name in your MongoDB database.

- **Query** (optional) -- JSON string specifying a query which limits documents data in exported data.
Must be specified in a [strict format](#strict-format).

- **Sort** (optional) -- JSON string specifying the order of documents in exported data.
Must be specified in a [strict format](#strict-format).

- **Limit** (optional) -- Limits the number of exported documents.

- **Incremental** -- Loads data to your tables incrementally.

- **Mode** -- Specifies the export mode: *Mapping* or *Raw*. Start by exporting few documents using the 
[Raw mode](#raw-export-mode) first -- it will help you see the document structure for which you need to write mapping.

- **Mapping** -- This is the most important section in case you have selected the *Mapping* mode; 
it defines [how documents in the collection are mapped](#configure-mapping) to the output tables.
It, too, has to be valid JSON. 

*Tip: Use a combination of a limit (for example, only 10 documents) and a query (for example, 
only a document with specific ID) while playing with the mapping section to prevent a full collection export.*

### Strict Format
A strict format means standard valid JSON must be used, and you cannot use MongoDB objects as in the
[JavaScript shell interface](https://docs.mongodb.com/v3.2/reference/program/mongo/#bin.mongo).
Thus using objects such as *ObjectId*, *Date* or *NumberLong* is not allowed until you specify them
in the strict format. Read more on the [strict format](https://docs.mongodb.com/v3.2/reference/mongodb-extended-json/).

## Incremental Fetching

To improve data extraction performance and reduce data transfer volume, you can use incremental fetching. 
Incremental fetching ensures that only new or modified records are retrieved from MongoDB instead of re-fetching the entire dataset.

### How It Works

1. **Specify a Cursor Field**: Select a field in your MongoDB collection to act as the "cursor" for incremental fetching (such as a timestamp field `updated_at` or an auto-generated MongoDB `_id` containing a time component).

2. **Configure and Enable Incremental Fetching**: In your MongoDB extractor configuration, set the `Property` field in the Incremental Fetching block, to specify the cursor field. The extractor will then limit the query on each run, fetching only records where the cursor field value is different than the last recorded value.

3. **State Management for Continuity**: After each execution, the extractor saves the highest cursor value to maintain state. This allows future extractions to continue from the previous endpoint, ensuring only new or updated records are fetched.

## Configure Mapping
By defining mapping, you specify the structure and content of your output tables, 
their columns and relations between them.

{: .image-popup}
![MongoDB new export filled](/components/extractors/database/mongodb/mongodb-3.png)

*Tip: Export few documents using the [Raw Export Mode](#raw-export-mode) first -- it will help you see
the document structure (in Strict Format) for which you need to write mapping.*

### Primary Key
Since MongoDB identifies each document in a collection uniquely by `_id`, we recommend to set
a primary key to this field by defining the first item in a mapping section:

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

*Note: The destination column with the primary key should be named `id` not `_id` to prevent problems with
the data import.*

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
