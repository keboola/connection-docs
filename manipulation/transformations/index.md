---
title: Transformations
permalink: /manipulation/transformations/
---

* TOC
{:toc}

*To create your first transformation, and to see how Transformations are an integral part of the KBC workflow, 
go to our [Getting Started tutorial](/tutorial/manipulate/).*

**Transformations** allow you to manipulate data in your project. They are the tasks you want to perform 
(*Marketing data preaggregation*, *Tableau denormalizer*, *Integrity checker* or *Join marketing channels 
and sales*, etc.), and are grouped into folders called **Transformation buckets**. 
Each transformation bucket can contain any number of individual transformations. 
It should represent a logical set of operations you want to perform together.

## Mappings
No transformation can be created without 

1) [**Input and Output Mapping**](/manipulation/transformations/mappings/) --- makes sure your SQL code or script 
does not harm the source tables, and separates the source data from your transformation. 
Mapping creates a secure workspace with data copied from the tables specified in the input mappings. 

2) **Transformation Script** --- SQL, Python or R code: defines what happens with the data while taking the
 tables from Input Mapping, modifying them and producing the tables referenced in Output Mapping.
 
{: .image-popup}
![Simple input and output mapping](./mappings.png)

*When writing transformation scripts, keep in mind that the table names referenced by mappings 
are automatically quoted by KBC. This is especially important for Snowflake, which is case sensitive.*

## Backends
A backend is the engine running the transformation script. It is either a database server 
[MySQL](http://www.mysql.com/), [Redshift](https://aws.amazon.com/redshift/), 
and [Snowflake](http://www.snowflake.net/), or a language interpreter ([R](https://www.r-project.org/about.html), 
[Python](https://www.python.org/about/) or [OpenRefine](http://openrefine.org/)).

How to decide **which backend is appropriate for each task**? A rule of thumb is that SQL performs better 
for joining tables, filtering data, grouping and simple aggregations. Script languages are more suitable 
for processing one line at a time, raw data processing or custom analytical tasks.

Each transformation within a bucket must use the backend chosen for the bucket. You can create as many buckets as you want 
to perform the task with the most suitable tool and programming language. [Orchestrator](/orchestrator/) will help you chain 
tasks if you need to combine multiple backends to perform one business operation. 

The following are the currently available backends:

- **SQL** --- Choosing between [MySQL](./mysql/), [Redshift](./redshift/) and [Snowflake](./snowflake/) 
can be a matter of your preference or the overall performance. Projects start with Snowflake and they can be switched to Redshift on a dedicated cluster. 
That unfortunately requires rewriting the SQL code. MySQL is slowly getting deprecated.

- **Script** --- [Python](./python/), [R](./r/) or [OpenRefine](./openrefine/). Choose according to your taste and available libraries.

## Versions
Each change in the transformation configuration creates a new version of the whole bucket configuration. 
You can easily access previous versions of all transformations in a bucket and see what has changed.

## Developing Transformations
You can easily develop Snowflake, Redshift and MySQL transformations using [Sandbox](/manipulation/transformations/sandbox),
a separate database storage. As a safe workspace with required data, 
it allows you to run and play with your arbitrary SQL scripts on the copies of your tables 
without affecting data in your Storage, or your transformations.


## Deprecated Features

Older projects have a slightly different UI that has several features turned on. 
Newly created projects do not display or allow these features. Our goal is to make the transformations more transparent 
and easier to understand. 

### Mixing Backends

It is possible to run transformations with mixed backends in a single bucket, e.g., MySQL and Python.

### Phases

Phases allow you to run multiple transformation steps within a single workspace, for example, a single MySQL database. 
If multiple steps use the same input mapping (they share data), it might save a bit of processing time, but, ultimately, it 
makes everything less clear and isolated. 
To save time, you can run multiple orchestration tasks in parallel.

### Dependencies

Dependencies allow you to chain transformation steps. A given transformation is executed after all required steps have been executed. 

Originally, we thought this was a cool idea; it allowed everyone to build a network of interdependent and reusable blocks of 
SQL code. However, a network of nontransparent dependency trees was usually created, which lead 
