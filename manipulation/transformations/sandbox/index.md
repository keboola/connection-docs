---
title: Sandbox
permalink: /manipulation/transformations/sandbox/
---

* TOC
{:toc}

*See how Sandbox is an integral part of the KBC workflow in our [Getting Started tutorial](/overview/tutorial/manipulate/sandbox/).*

A sandbox is a **safe environment** for you to 

- explore, analyze and experiment with copies of selected Storage data. 
- test, troubleshoot and develop transformations without modifying any Storage data.

You can fill a sandbox with any data from Storage. However, to simplify transformation development, 
KBC provides a specific loader for your transformations. 
It automatically fills the sandbox with relevant tables and takes the Input Mapping of the transformation into account.

Each user has **one sandbox per project and backend** (MySQL, Snowflake and Redshift) to their disposal. 
Sandboxes with different backends are very similar; but there are few specifics, mostly related to access management -- see below. 

{: .image-popup}
![Sandbox credentials](/manipulation/transformations/sandbox/sandbox-credentials.png)

**Important:** The backend of the sandbox does not have to match the backend of the original data. 
For example, you can load data from Snowflake into a Redshift sandbox.


## Loading Data

Data can be loaded into your sandbox in two different ways:

- Plain loading -- Copying any tables from Storage into a Sandbox database. 
- Transformation loading -- Loading specifically tailored for transformation development. 
Select a transformation and all relevant tables based on transformation input mapping are automatically loaded. 

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

The imported tables will have full tables names -- including both a bucket and table name.

By default, the sandbox content is deleted before loading new data. 
Use the *Preserve existing data* option to keep its content and add new data to it.


### Transformation Loading

This type of loading is intended for **gradual development and debugging** of your transformation code. 
Data loaded through the transformation loading is tied to a specific transformation bucket and input mapping. 
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
![Screenhost - Transformation Sandbox](/manipulation/transformations/sandbox/transformation-sandbox.png)

Choose how the data will be loaded and processed:

 - *Load input tables only* -- load the tables specified in the input mapping; 
 - *Prepare transformation* -- execute [transformation dependencies](/manipulation/transformations/#dependencies), that means the sandbox workspace is prepared for the current transformation (use only if there are any dependencies); and
 - *Execute transformation without writing to Storage API* -- this is a dry-run for validation.
 
Once the sandbox is ready, you will get a notification. Or, watch the progress on the Jobs page. 

Note that transformation loading always deletes the contents of the sandbox first. 

[TODO- nasledujici vete nerozumim. Transformation Load prece vzdycky nejdriv smaze obsah. Nebo ne? Pokud ne, tak jak ten loader pozna, kdy to ma smazat a kdy jsem jenom zmenil strukturu a nema to smazat? A co se mysli tou zmenou vstupni struktury? Zmena Input Mapping? Takze treba v IM zmenim jmeno sloupecku a on se mi v sandboxu taky prejmenuje, aniz by se mi prepsaly data? A co kdyz v IM pridam/uberu sloupecek?]
However, the input structure can be modified without deleting the current state of the sandbox. 


## Additional Sandbox Actions

Except loading data, sandbox supports several other basic actions. To access them, go to the **Transformations** section 
and click the **Sandbox** button at the top.

  - *Connect* -- Connect to the sandbox using a web SQL client. TODO: tohle asi plati jen pro MySQL, ostani nemuzu vyzkouset (pro Snowflake mi to zobrazi login dlg a Redshift backend nemuzu do projektu pridat)
  - *SSL* (MySQL and Redshift only) -- Show secure connection information.
  - *Refresh privileges* (Redshift only) -- REVOKE and GRANT privileges on tables and schemas to the current Redshift user. Because  Redshift privileges are granted on a per-table basis, tables created later than the current user are not available unless you refresh the privileges.
  - *Drop Sandbox* -- Deletes the sandbox database (and all its tables)

In the same place you can also see the sandbox connection credentials. To copy & paste individual values, use the *copy icon*:

{: .image-popup}
![Screenshot - Plain Sandbox](/manipulation/transformations/sandbox/howto-plain-sandbox-3.png)

## Backend Specifics

Even though sandboxes with different backends are very similar, let's take a look at a few specifics that are mostly related to access management.

### MySQL Sandbox

For a single user, MySQL credentials are shared within all projects. Each project sandbox is represented as a database assigned to the user. 
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

![Sequel Pro Configuration Screenshot](/manipulation/transformations/sandbox/sequelpro-ssl.png)

DBeaver configuration:

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
You can easily access a table in Storage using schema/bucket namespacing. For example: `SELECT * FROM "in.c-main"."mytable"`. 
Use double quotes, as the schema (= bucket) name always contains a dot.
   
We do not recommend working with Storage tables directly in your SQL code. 
Always use input mapping to bring tables to your schema. 
This adds another level of security and features to your transformation. 

#### Version

A Redshift sandbox always uses the latest Redshift version available on the cluster.  

### Snowflake Sandbox

TODO 