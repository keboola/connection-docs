---
title: Sandbox
permalink: /manipulation/transformations/sandbox/
---

* TOC
{:toc}

*To create your first Sandbox, and to see how it is an integral part of the KBC workflow in our [Getting Started tutorial](/tutorial/manipulate/sandbox/).*

A sandbox is a **safe environment** for you to

- explore, analyze and experiment with copies of selected Storage data.
- test, troubleshoot and develop transformations without modifying any Storage data.

You can fill a sandbox with any data from Storage. However, to simplify transformation development,
KBC provides a specific loader for your transformations.
It automatically fills the sandbox with relevant tables and takes
the [Input Mapping](/manipulation/transformations/mappings/#input-mapping) of the transformation into account.

Each user has **one sandbox per project and [backend](/manipulation/transformations/#backend)**
(MySQL, Snowflake and Redshift) to their disposal.
Sandboxes with different backends are very similar; but there are few specifics, mostly related to access management --- see below.

{: .image-popup}
![Sandbox credentials](/manipulation/transformations/sandbox/sandbox-credentials.png)

**Important:** The backend of the sandbox does not have to match the backend of the original data.
For example, you can load data from Snowflake into a Redshift sandbox.

Also, your sandbox might be deleted after 7 days of inactivity; make sure not to use it as a permanent data storage!

## Loading Data

Data can be loaded into your sandbox in two different ways:

- Plain loading --- Copying any tables from Storage into a Sandbox database.
- Transformation loading --- Loading specifically tailored for transformation development.
Select a transformation and all relevant tables based on the transformation input mapping are automatically loaded.

If you, while developing your transformation, need to add data to the tables already specified in the input mapping,
the two ways can be combined. However, in that case, perform the plain load *after* the transformation load,
because the transformation load deletes all data in the sandbox.

### Plain Loading

Go to the **Transformations** section and click the **Sandbox** button in the upper right corner.

{: .image-popup}
![Screenshot - Plain Sandbox](/manipulation/transformations/sandbox/howto-plain-sandbox-1.png)

If no sandbox exists, create it first by clicking **Create Sandbox** for the desired backend:

{: .image-popup}
![Screenshot - Plain Sandbox](/manipulation/transformations/sandbox/howto-plain-sandbox-2.png)

Then click the **Load data** button to load tables or whole buckets into the sandbox.
You can limit the number of rows that are loaded; this is useful for sampling a large table.

{: .image-popup}
![MySQL sandbox](/manipulation/transformations/sandbox/sandbox-mysql-load-data.png)

The imported tables will have full tables names --- including both a bucket and table name.

By default, the sandbox content is deleted before loading new data.
Use the *Preserve existing data* option to keep its content and add new data to it.


### Transformation Loading

This type of loading is intended for **gradual development and debugging** of your transformation code.
Data loaded through the transformation loading is tied to a specific transformation bucket and
[input mapping](/manipulation/transformations/mappings/#input-mapping).
Only data specified in the input mapping is loaded into your transformation sandbox.
You can choose whether the transformation itself is performed on the load or not.

To create a sandbox for a specific transformation, go to the **Transformations** section and select the respective transformation:

{: .image-popup}
![Screenshot - Transformation Sandbox](/manipulation/transformations/sandbox/howto-transformation-sandbox-1.png)

The Sandbox backend is defined by the transformation backend. In the transformation detail,
click the **Create Sandbox** button:

{: .image-popup}
![Screenshot - Transformation Sandbox](/manipulation/transformations/sandbox/howto-transformation-sandbox-2.png)

Clicking the **Create** button will get you the connection credentials:

{: .image-popup}
![Screenshot - Transformation Sandbox](/manipulation/transformations/sandbox/transformation-sandbox.png)

Choose how the data will be loaded and processed:

 - *Load input tables only* --- load the tables specified in the input mapping;
 - *Prepare transformation* --- execute [transformation dependencies](/manipulation/transformations/#dependencies), that means the sandbox workspace is prepared for the current transformation (use only if there are any dependencies); and
 - *Execute transformation without writing to Storage API* --- this is a dry-run for validation.

Once the sandbox is ready, you will get a notification. Or, watch the progress on the Jobs page.

**Important:** Transformation loading always deletes the contents of the sandbox first.

## Additional Sandbox Actions

Except loading data, sandbox supports several other basic actions.
To access them, go to the **Transformations** section and click the **Sandbox** button at the top.

  - *Connect* (MySQL and Snowflake only) --- Connect to the sandbox using a web SQL client.
  - *SSL* (MySQL and Redshift only) --- Show secure connection information.
  - *Refresh privileges* (Redshift only) --- REVOKE and GRANT privileges on tables and schemas to the current Redshift user. Because  Redshift privileges are granted on a per-table basis, tables created later than the current user are not available unless you refresh the privileges.
  - *Drop Sandbox* --- Deletes the sandbox database (and all its tables)

In the same place you can also see the sandbox connection credentials. To copy & paste individual values,
use the *copy icon*:

{: .image-popup}
![Screenshot - Plain Sandbox](/manipulation/transformations/sandbox/howto-plain-sandbox-3.png)

## Backend Specifics

Even though sandboxes with different backends are very similar, let's take a look at a few specifics
that are mostly related to access management.

### MySQL Sandbox

For a single user, MySQL credentials are shared within all projects.
Each project sandbox is represented as a database assigned to the user.
The user and password remain the same until you delete all MySQL sandboxes in all your projects.

For instance, `user_4` can have assigned the `sand_232_3800`, `sand_258_3849` and `sand_1067_46400` databases.
These are sandboxes in projects `232`, `258` and `1067`. You can easily switch between them in your favorite MySQL client.


#### Connecting to Sandbox

To connect to a MySQL sandbox, use any MySQL client; for instance, [Sequel Pro](http://www.sequelpro.com/) or
[DBeaver](http://dbeaver.jkiss.org/download/).
We recommend using an SSL secure connection.
To use a secure connection, download the [SSL certificate](https://d3iz2gfan5zufq.cloudfront.net/files/sh-tapi.ca.pem)
and use it in your MySQL client.

Sequel Pro configuration:

{: .image-popup}
![Sequel Pro Configuration Screenshot](/manipulation/transformations/sandbox/sequelpro-ssl.png)

DBeaver configuration:

{: .image-popup}
![DBeaver Configuration Screenshot](/manipulation/transformations/sandbox/dbeaver-ssl.png)

#### Version

MySQL sandboxes use MariaDB 5.5.44.

### Redshift Sandbox

Credentials for Redshift sandboxes are not shared between projects. Each project, including the sandbox,
sits on a different cluster. Therefore, all your projects have their own set of credentials.

For a Redshift Sandbox, there is an additional action available: *Refresh privileges*.
It is used to REVOKE and GRANT privileges on tables and schemas to the current Redshift user.
As Redshift privileges are granted on a per-table basis, tables created later than the current user are not
available unless you refresh the privileges.

#### Connecting to Sandbox

Almost any PostgreSQL client can connect to an AWS Redshift cluster. We have tested Navicat and DBeaver (free), and
they work fine. You can use both a [Redshift driver](http://docs.aws.amazon.com/redshift/latest/mgmt/configure-jdbc-connection.html)
and a PostgreSQL driver.

If using the PostgreSQL driver, do not forget to change the connection port to 5439.
For an SSL secure connection, follow [this guide](http://docs.aws.amazon.com/redshift/latest/mgmt/connecting-ssl-support.html).
To establish a secure connection to a Redshift sandbox, follow the
[official instructions from Amazon](http://docs.aws.amazon.com/redshift/latest/mgmt/connecting-ssl-support.html).

#### Direct Access to Storage Tables

In a Redshift sandbox, you have native access to all Redshift buckets in the project.
You can easily access a table in Storage using schema/bucket namespacing.
For example: `SELECT * FROM "in.c-main"."mytable"`.
Use double quotes, as the schema (= bucket) name always contains a dot.

We do not recommend working with Storage tables directly in your SQL code.
Always use the input mapping to bring tables to your schema.
This adds another level of security and features to your transformation.

#### Version

A Redshift sandbox always uses the latest Redshift version available on the cluster.

### RStudio Sandbox

**Important:** Currently, this feature is in beta and is available only on request. [Contact us on support](mailto:support@keboola.com) to enable this feature.

[RStudio](https://www.rstudio.com/) sandbox is available only as a plain sandbox:

{: .image-popup}
![Screenshot - Plain Sandbox](/manipulation/transformations/sandbox/howto-plain-sandbox-1.png)

Click on create sandbox button:

{: .image-popup}
![Screenshot - RStudio Sandbox](/manipulation/transformations/sandbox/rstudio-sandbox-1.png)

And select the tables you want to load into the sandbox.

{: .image-popup}
![Screenshot - RStudio Sandbox](/manipulation/transformations/sandbox/rstudio-sandbox-2.png)

Depending on the size of the input tables, the sandbox creation may take some time. You can review the progress in
*Jobs*. When the sandbox is created, you can **Connect** to it. You will be taken to a web version of RStudio. The
loaded tables will be available at the same locations as in [R Transformations](https://help.keboola.com/manipulation/transformations/r/#development-tutorial).
Also the R version is the same as in [R Transformations](https://help.keboola.com/manipulation/transformations/r/#environment).

{: .image-popup}
![Screenshot - RStudio Sandbox](/manipulation/transformations/sandbox/rstudio-sandbox-3.png)

#### Limitations
- HTTPS is not yet supported.
- Sandbox disk space is limited to 10GB.
- Memory is limited to 8GB.
- The UI allows loading only tables to the Sandbox. Loading input files and transformation script is supported only by the [API](http://docs.provisioningapi.apiary.io/#reference/credentials-async-actions/create-credentials-async).
- Sandboxes will be deleted after 5 days.
- Adding data to existing sandboxes is not supported yet.

### Jupyter Notebook Sandbox
[Jupyter Notebook](http://jupyter.org/) sandbox is available only as a plain sandbox. It is created the same way as the
[RStudio Sandbox](#rstudio-sandbox), also the same **[limitations](#limitations)** apply.

{: .image-popup}
![Screenshot - Jupyter Sandbox](/manipulation/transformations/sandbox/jupyter-sandbox-1.png)

The Python environment for Jupyter notebook is the same as in [Python Transformations](https://help.keboola.com/manipulation/transformations/python/#environment)
The Jupyter notebook does not have a built-in file browser, but the loaded tables are present at the same
locations as in [Python Transformations](https://help.keboola.com/manipulation/transformations/python/#development-tutorial). To list the
available table data files, you can use e.g. this script:

{% highlight python %}
from os import listdir
from os.path import isfile, join

mypath = '/data/in/tables'
onlyfiles = [f for f in listdir(mypath)]
print(onlyfiles)
{% endhighlight %}

