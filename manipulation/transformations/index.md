---
title: Transformations
permalink: /manipulation/transformations/
---

* TOC
{:toc}

*To create your first transformation, and to see how Transformations are an integral part of the KBC workflow, 
go to our [Getting Started tutorial](/tutorial/manipulate/).*

**Transformations** allow you to manipulate data in your project. They are the tasks you want to perform 
(Marketing data preaggregation, Tableau denormalizer, Integrity checker or Join marketing channels 
and sales, etc.), and are grouped into folders called **Transformation buckets**. 
Each transformation bucket can contain any number of individual transformations. 
It should represent a logical set of operations you want to perform together.

## Overview
The schema below shows the important components of the Transformation engine:

{: .image-popup}
![Transformations schema](/manipulation/transformations/transformations-schema.svg)

A transformation is represented by a **Transformation Script** (SQL, R, Python or OpenRefine [backend](#backend)) which you 
can use to manipulate your data. To ensure safety of the data in Storage, a transformation
operates in a completely separate provisioned **workspace** created for each transformation. When a 
transformation runs, it takes the required data from Storage and copies them to the 
workspace. This process is called [**Input Mapping**](#mappings). The transformation engine 
then takes the Transformation Script and runs it in the workspace. Depending 
on the transformation backend, the input mapping process can do the following:

- Create a new database (Snowflake, Redshift, MySQL) and import the selected tables from Storage into it.
- Export selected tables from Storage to CSV files and make them available in the workspace for Python, R or OpenRefine scripts.

When the transformation is finished, the **Output Mapping** process moves the transformation results back to
the designated tables in Storage. The **Input** and **Output** mappings ensure complete safety of
the transformation processes -- the transformation always operates in an isolated workspace.

Each transformation has its own workspace. The transformation [sandbox](/manipulation/transformations/sandbox/)
uses the same workspace as the corresponding transformation. The [plain sandbox](/manipulation/transformations/sandbox/#plain-loading) 
uses a separate workspace.

## Mappings
No transformation can be created without 

1) [**Input and Output Mapping**](/manipulation/transformations/mappings/) --- separates the source data from your transformation. Mapping creates a secure workspace with data copied from the tables specified in the input mappings.
Database table names and CSV file names in transformations are completely unrelated to names of tables in Storage.

2) **Transformation Script** --- SQL, Python, R or OpenRefine code: defines what happens with the data while taking the
 tables from Input Mapping, modifying them and producing the tables referenced in Output Mapping.
 
{: .image-popup}
![Simple input and output mapping](/manipulation/transformations/mappings.png)

*When writing transformation scripts, keep in mind that the table names referenced by mappings 
are automatically quoted by KBC. This is especially important for Snowflake, which is case sensitive.*

## Backends
A backend is the engine running the transformation script. It is either a database server 
[MySQL](http://www.mysql.com/), [Redshift](https://aws.amazon.com/redshift/), 
and [Snowflake](http://www.snowflake.net/), or a language interpreter ([R](https://www.r-project.org/about.html), [Python](https://www.python.org/about/)).

How to decide **which backend is appropriate for each task**? A rule of thumb is that SQL performs better 
for joining tables, filtering data,grouping and simple aggregations. Script languages are more suitable 
for processing one line at a time, raw data processing or custom analytical tasks.

Each transformation within a bucket can use a different backend to perform the task 
with the most suitable tool and programming language. As some tasks are difficult to solve in SQL, 
feel free to step in with Python and finish the work with SQL again. 

The following are the currently available backends:

- **SQL** --- Choosing between [MySQL](./mysql/), [Redshift](./redshift/) and [Snowflake](./snowflake/) 
can be a matter of your preference or the overall performance. Many projects start with MySQL and as they grow, 
they are switched to Redshift on a dedicated cluster. That unfortunately requires rewriting the SQL code.

- **Script** --- [Python](./python/), [R](./r/) or [OpenRefine](./openrefine/). Choose according to your taste and available libraries.

## Versions
Each change in the transformation configuration creates a new version of the whole bucket configuration. 
You can easily access previous versions of all transformations in a bucket and see what has changed.

## Developing Transformations
You can easily develop MySQL and Redshift transformations using [Sandbox](/manipulation/transformations/sandbox),
a separate database storage. As a safe workspace with required data, 
it allows you to run and play with your arbitrary SQL scripts on the copies of your tables 
without affecting data in your Storage, or your transformations.

<<<<<<< HEAD
## Deprecated Features
Our goal is to make Transformations more transparent and understandable. That is the reason why the features below are no 
longer available for new projects. Your older projects, however, have a slightly different UI with these features still 
turned on.

### Mixing Backends
In your older projects, transformations with mixed backends (e.g., MySQL and Python) can be run in a single bucket.
=======

## Advanced Features
>>>>>>> parent of f90e389... fix(manipulation): simple transformations

### Phases
Phases in older projects allow multiple transformation steps to be run within a single workspace, for example, a single MySQL 
database. Multiple steps with the same input mapping (sharing data) might save a bit of processing time, but ultimately, 
everything is less clear and isolated. To save time, run multiple orchestration tasks in parallel instead.

### Dependencies
<<<<<<< HEAD
Dependencies allow you to chain transformation steps in older projects. A given transformation is executed after all required steps have been executed. 

Originally, we thought this was a cool idea; it allowed everyone to build a network of interdependent and reusable blocks of 
SQL code. However, a network of nontransparent dependency trees was usually created, leading to confusion and, sometimes, 
cyclical dependencies. 
=======
Dependencies allow you to chain transformation steps. A given transformation is executed after all required steps have been executed. 

Originally, we thought this was a cool idea; it allowed everyone to build a network of interdependent and reusable blocks of SQL code. However, a network of nontransparent dependency trees was usually created, so we have decided to abolish this feature in the near future. If possible, please do not use dependencies as it will make future migrations easier.
>>>>>>> parent of f90e389... fix(manipulation): simple transformations
