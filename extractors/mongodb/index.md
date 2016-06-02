---
title: MongoDB
permalink: /extractors/mongodb/
---

* TOC
{:toc}

The MongoDB extractor allows you to fetch data from the [MongoDB database](https://www.mongodb.com/).
Complete the following steps to configure it:

### Create New Configuration

Find MongoDB in the Extractors section. Create a new configuration and name it.

{: .image-popup}
![MongoDB add configuration](/extractors/mongodb/01-add-configuration.png)


### Setup Database Credentials

Click **Setup Database Credentials** and fill in the form. Then test the new credentials and save them.
Optionally, set up a SSH tunnel.

{: .image-popup}
![MongoDB new credentials](/extractors/mongodb/02-new-credentials.png)

### Configure export(s)

Click the *Add Export* button and configure your first export using the following options:

{: .image-popup}
![MongoDB new export](/extractors/mongodb/03-new-export.png)

- **Name** -- Identifies your export; its value has to be unique across all exports and exported tables in
your configuration. Also, the main exported table will be named after the value of the Name field.

- **Collection** -- Represents the collection name in your MongoDB database.

- **Query** (optional) -- JSON string specifying a query which limits documents data in exported data.
Must be specified in [strict format](#strict-format).

- **Sort** (optional) -- JSON string specifying the order of documents in exported data.
Must be specified in [strict format](#strict-format).

- **Limit** (optional) -- Limits the number of exported documents.

- **Incremental** -- Loads data to your tables incrementally.

- **Mapping** -- This is the most important section, defining how documents in the collection are mapped to the output tables.
It, too, has to be valid JSON. To learn more about mapping, go to the [next section](#configure-mapping).

#### Strict Format

Strict format means standard valid JSON must be used, and you cannot use Mongo extensions as in the
[JavaScript shell interface](https://docs.mongodb.com/v3.2/reference/program/mongo/#bin.mongo).
Thus using objects such as *ObjectId*, *Date* or *NumberLong* is not allowed until you specify them
in the strict format. Read more on the [strict format](https://docs.mongodb.com/v3.2/reference/mongodb-extended-json/).

### Configure Mapping

By defining mapping, you to specify the structure and content of output tables, their columns and relations between them.

{: .image-popup}
![MongoDB new export filled](/extractors/mongodb/04-new-export-filled.png)

#### Primary Key

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


#### Other Data Types

To handle MongoDB data types correctly, define mapping similarly to the following example for
`MongoId`, `ISODate` and `NumberLong` data types:

{% highlight json %}
{
    "_id.$oid": "id",
    "publishedAt.$date": "publishedAt",
    "views.$numberLong": "views"
}
{% endhighlight %}

#### Mapping Examples

Check out [more mapping examples](/extractors/mongodb/mapping/).

### Run Extractor

Having successfuly mapped the configuration, run the extractor by hitting the *Run Extraction* button.

{: .image-popup}
![MongoDB new export](/extractors/mongodb/05-exports-index.png)


