---
title: Sandbox
permalink: /manipulation/transformations/sandbox/
---

* TOC
{:toc}

Sandbox allows you to test, troubleshoot and develop MySQL and Redshift transformations. Sandbox can also help you to look into and analyze data from your Storage.

## Credentials

Each user gets a set credentials for a MySQL and Redshift (for Redshift enabled projects) sandbox in each project.

{: .image-popup}
![Sandbox credentials](/manipulation/transformations/sandbox/sandbox-credentials.png)
 
### MySQL

MySQL credentials are shared for a single user within multiple projects. Each project sandbox is represented as a database assigned to the user. The user and password remain the same until you delete all MySQL sandboxes in all your projects.  

Eg. `user_4` has assigned database `sand_232_3800`, `sand_258_3849` and `sand_1067_46400`. These are sandboxes in projects `232`, `258` and `1067`. You can easily switch between them in your favorite MySQL client.

{: .image-popup}
![MySQL sandbox database picker](/manipulation/transformations/sandbox/sandbox-mysql-databases.png)

#### Version

MySQL sandbox uses MariaDB 5.5.44. 

### Redshift

Credentials for Redshift sandboxes are not shared between projects, as each project sits on a different cluster. For each project you'll have it's own set of credentials.
 
#### Direct access to Storage tables

In a Redshift sandbox you have native access to all Redshift buckets in the project. You can easily access a table in storage using schema/bucket namespacing, eg. `SELECT * FROM "in.c-main"."mytable"`. Use double quotes as the schema (= bucket) name always contains a dot.
   
We do not recommend working with Storage tables directly in your SQL code, always use input mapping to bring the table to your schema. This adds another level of security and features to your transformation. 

#### Refreshing privileges

As Redshift privileges are granted on a per-table basis, tables created later than your credentials will not be available. Use **Refresh privileges** button to re-grant all privileges for the current user.

#### Version

Redshift sandbox always uses the latest Redshift version available on the cluster.  

## Connecting to sandbox

### MySQL

You can use any MySQL client to connect to the MySQL sandbox. We recommend using [this SSL certificate](https://d3iz2gfan5zufq.cloudfront.net/files/sh-tapi.ca.pem) for secure connection.

### Redshift

Almost any PGSQL client can connect to a AWS Redshift cluster. We have tested Navicat and DBeaver (free) and they both work fine. For a secure connection follow [this guide](http://docs.aws.amazon.com/redshift/latest/mgmt/connecting-ssl-support.html). 

## Loading data into sandbox

There are two ways to create a sandbox. A plain sandbox simply loads tables from Storage into your sandbox. Transformation sandbox is used for developing transformations and allows you to continue your work where a transformation finished.

### Plain sandbox

{: .image-popup}
![MySQL sandbox](/manipulation/transformations/sandbox/sandbox-mysql-load-data.png)

Use the **Load data** button to load tables or whole buckets into a sandbox. You can limit the number of rows, that are loaded (that is useful for sampling a large table) or use the **preserve** option to keep the current state of your sandbox (otherwise it will be emptied). The **preserver** option is handy when you need to add a table to your working sandbox.

Imported tables will have their full names including bucket names as table names.

### Transformation sandbox

To start or continue work on your transformation you can create a transformation sandbox using **Create sandbox** button in the transformation detail. 

{: .image-popup}
![MySQL transformation sandbox](/manipulation/transformations/sandbox/transformation-sandbox.png)

There you can  

 - load the tables specified in the input mapping 
 - load the input tables and execute required transformations - that prepares the sandbox workspace for the current transformation (if there are any dependencies)
 - execute the transformation (and all dependencies) without writing back to Storage - that's a dry-run for validation
 
Once the sandbox is ready, you'll get a notification or you can watch the progress on the Jobs page. To add tables to an existing sandbox, use the plain sandbox. 

 

 
