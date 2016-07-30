---
title: Sandbox
permalink: /manipulation/transformations/sandbox/
---

* TOC
{:toc}

*See how Sandbox is an integral part of the KBC workflow in our [Getting Started tutorial](/overview/tutorial/manipulate/sandbox/).*

A sandbox is a safe environment for you to test, troubleshoot and develop MySQL and Redshift transformations. 
It can also help you safely analyze data from your Storage as operations executed in a sandbox do not modify any Storage data.

Each user gets credentials for MySQL and Redshift sandboxes with each project (where applicable). 

{: .image-popup}
![Sandbox credentials](/manipulation/transformations/sandbox/sandbox-credentials.png)

## MySQL

For a single user, MySQL credentials are shared within all projects. Each project sandbox is represented as a database assigned to the user. 
The user and password remain the same until you delete all MySQL sandboxes in all your projects.  

For instance, `user_4` can have assigned `sand_232_3800`, `sand_258_3849` and `sand_1067_46400` database. 
These are sandboxes in projects `232`, `258` and `1067`. You can easily switch between them in your favorite MySQL client.

### Actions

No credentials available

  - *Create credentials* -- Create new MySQL credentials. If there is already a MySQL user assigned to the current KBC user, username
and password remain the same, the user only gets a new database assigned. 
  
Credentials available  
  
  - *Load data* -- Load data into the sandbox; see [Loading data](/manipulation/transformations/sandbox/#loading-data).
  - *Connect* -- Connect to the sandox using a web SWL client.
  - *SSL* -- Show secure connection information.
  - *Drop credentials* -- Delete the database (and all tables); if this is the last MySQL sandbox of the KBC user, delete the MySQL user. 

### Connecting to Sandbox
To connect to a MySQL sandbox, use any MySQL client. We 
recommend using SSL secure connection. To use secure connection, download the 
[SSL certificate](https://d3iz2gfan5zufq.cloudfront.net/files/sh-tapi.ca.pem) 
and use it in your preferred MySQL client, eg. [Sequel Pro](http://www.sequelpro.com/) or
 [DBeaver](http://dbeaver.jkiss.org/download/).

Sequel Pro configuration:

![Sequel Pro Configuration Sceenshot](/manipulation/transformations/sandbox/sequelpro-ssl.png)

DBeaver configuration:

![DBeaver Configuration Sceenshot](/manipulation/transformations/sandbox/dbeaver-ssl.png)

### Version

MySQL sandboxes use MariaDB 5.5.44. 

## Redshift
Credentials for Redshift sandboxes are not shared between projects as each project sits on a 
different cluster. For each project you have its own set of credentials.

### Actions

No credentials available

  - *Create credentials* -- Create new Redshift credentials on the Redshift cluster assigned to this project, and assign an empty schema to the Redshift user. 
  
Credentials available  
  
  - *Load data* -- Load data into the sandbox; see [Loading data](/manipulation/transformations/sandbox/#loading-data).
  - *Refresh privileges* -- REVOKE and GRANT privileges on tables and schemas to the current Redshift user. As Redshift privileges are granted on a per-table basis; tables created later than the current user are not available unless you refresh the privileges.
  - *SSL* -- Show secure connection information.
  - *Drop credentials* -- Delete the database (and all tables); if this is the last MySQL sandbox of the KBC user, delete the MySQL user. 

### Connecting to Sandbox

Almost any PostgreSQL client can connect to an AWS Redshift cluster. We have tested Navicat and DBeaver (free) and 
they both work fine. You can use both [Redshift driver](http://docs.aws.amazon.com/redshift/latest/mgmt/configure-jdbc-connection.html)
and PostgreSQL driver. If you use PostgreSQL driver, don't forget to change the connection port to 5439.
For a SSL secure connection follow [this guide](http://docs.aws.amazon.com/redshift/latest/mgmt/connecting-ssl-support.html). 
To establish a secure connection to a Redshift sanbox, follow the 
[official instructions from Amazon](http://docs.aws.amazon.com/redshift/latest/mgmt/connecting-ssl-support.html).


### Direct Access to Storage Tables

In a Redshift sandbox, you have native access to all Redshift buckets in the project. You can easily access a table in Storage using schema/bucket namespacing, for example, `SELECT * FROM "in.c-main"."mytable"`. Use double quotes as the schema (= bucket) name always contains a dot.
   
We do not recommend working with Storage tables directly in your SQL code. Always use the input mapping to bring tables to your schema. This adds another level of security and features to your transformation. 

### Version

A Redshift sandbox always uses the latest Redshift version available on the cluster.  

## Working with Sandbox
There are two types of sandboxes -- **Transformation Sandbox**
and **Plain sandbox**. Transformation sandbox is tied to a specific
tranformation bucket. Data are loaded into it through input mapping. Transformation sandbox is useful for
developing and debugging transformation code. Plain Sandbox allows you to load any data from Storage and is 
usefuly for data exploration and experiments. 

The sandboxes have some differences in behaviour: 

- **Plain sandbox** -- Load tables from Storage into your sandbox. The data are always loaded from scratch.
When you modify the input mapping (for example, by adding another table), the old sandbox is deleted and a new one is created. 

- **Transformation sandbox** -- Use for gradual development of transformations; the input structure 
can be modified during the process without deleting the current state of the sandbox.

### Plain Sandbox
To create credentials to Plain Sandbox go to **Transformations** section and use the **Sandbox** button.

{: .image-popup}
![Screenshot - Plain Sandbox](/manipulation/transformations/sandbox/howto-plain-sandbox-1.png)

Choose a backend you want to use and click **Create Credentials**: 

{: .image-popup}
![Screenshot - Plain Sandbox](/manipulation/transformations/sandbox/howto-plain-sandbox-2.png)

You now have connection credentials, use the *copy icon* to copy & paste individual values:

{: .image-popup}
![Screenshot - Plain Sandbox](/manipulation/transformations/sandbox/howto-plain-sandbox-3.png)

Use the **Load data** button to load tables or whole buckets into a sandbox. You can limit the number of rows that are loaded;
this is useful for sampling a large table. 

{: .image-popup}
![MySQL sandbox](/manipulation/transformations/sandbox/sandbox-mysql-load-data.png)

Or, use the **Preserve** option to keep the current state of your sandbox. 
Otherwise, it will be emptied. The **Preserve** option comes in handy when you need to add a table to your working sandbox.

The imported tables will have full tables names - including both bucket name and table name.

### Transformation Sandbox

To create credentials to Transformation Sandbox go to **Transformations** section and select the respective transformation:

{: .image-popup}
![Screenshot - Transformation Sandbox](/manipulation/transformations/sandbox/howto-transformation-sandbox-1.png)

The Sandbox backend is defined, by the transformation backend. In the transformation detail, 
click the **Create Sandbox** button:

{: .image-popup}
![Screenshot - Transformation Sandbox](/manipulation/transformations/sandbox/howto-transformation-sandbox-2.png)

When you press the **Create** button, you will obtaion the connection credentials 
(use the *copy icon* to copy & paste individual values). Also the tables from transformation input mapping will
be loaded into the sandbox database.

{: .image-popup}
![Screenhost - Transformation Sandbox](/manipulation/transformations/sandbox/transformation-sandbox.png)

In the transformation sandbox dialog you can
 - load the tables specified in the input mapping, 
 - load the input tables and execute required transformations -- that prepares the sandbox workspace for the current transformation (if there are any dependencies), and
 - execute the transformation and all dependencies, without writing back to Storage -- that is a dry-run for validation.
 
Once the sandbox is ready, you will get a notification. Or, watch the progress on the Jobs page. To 
add tables to an existing sandbox, use the plain sandbox. 
