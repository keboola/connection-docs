---
title: MongoDB
permalink: /extractors/mongodb/
---

* TOC
{:toc}

MongoDB Extractor allows you to extract data from MongoDB database.

## Configuring

By following these steps you should be able to prepare MongoDB Extractor for your first data extraction.

### Create new configuration

{: .image-popup}
![MongoDB add configuration](/extractors/mongodb/01-add-configuration.png)


### Setup database credentials

After adding configuration, click on the button *Setup Database Credentials* and fill form data with
your credentials. We recommend you to test new database credentials before saving. Optionally set up
SSH tunnel.

{: .image-popup}
![MongoDB new credentials](/extractors/mongodb/02-new-credentials.png)

### Configure export(s)

When database credentials setting and testing is done, click on the *Add Export* button and fill form data to
configure your first export.


{: .image-popup}
![MongoDB new export](/extractors/mongodb/03-new-export.png)

Options:

- **Name**: Identifies your export and its value has to be unique across all exports and exported tables in
your configuration. Also, main exported table will be named after value of the name field.

- **Collection**: Represents collection name in your MongoDB database.

- **Query** (optional): JSON string as a query which limits documents data in exported data.
Must be specified in [strict format](#strict-format).

- **Sort** (optional): JSON string to specify order of documents in exported data.
Must be specified in [strict format](#strict-format).

- **Limit** (optional): Limits number of exported documents.

- **Incremental**: By checking this option, data will be loaded to your tables incrementally.

- **Mapping**: Most important part. In this section you define how documents in your collections will be
mapped to output tables. Mapping has to be valid JSON too. To learn more about mapping follow
[next section](#configure-mapping).

#### Strict format

Strict format means JSON must be valid and you cannot use objects as in
[JavaScript shell interface](https://docs.mongodb.com/v3.2/reference/program/mongo/#bin.mongo).
Thus using objects such *ObjectId*, *Date* or *NumberLong* is not allowed until you specify them
in strict format. More about strict format can be found
[here](https://docs.mongodb.com/v3.2/reference/mongodb-extended-json/).

### Configure mapping

By defining mapping the extractor allows you to set how output tables and theirs columns will look like,
how they'll be connected and which columns will consist.

{: .image-popup}
![MongoDB new export filled](/extractors/mongodb/04-new-export-filled.png)

Check out [more mapping examples](/extractors/database/mongodb/mapping/).


## Running

After successful mapping configuration you can run extractor by hitting *Run Extraction* button.

{: .image-popup}
![MongoDB new export](/extractors/mongodb/05-exports-index.png)


