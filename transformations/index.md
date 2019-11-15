---
title: Transformations
permalink: /transformations/
redirect_from:
    - /manipulation/transformations/
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
![Transformations schema](/transformations/transformations-schema.svg)

A transformation is represented by a **Transformation Script** (SQL, R, Python or OpenRefine [backend](#backend)) which you
can use to manipulate your data. To ensure safety of the data in Storage, a transformation
operates in a completely separate provisioned **workspace** created for each transformation. When a
transformation runs, it takes the required data from Storage and copies them to the
workspace. This process is called [**Input Mapping**](#mappings). The transformation engine
then takes the Transformation Script and runs it in the workspace. Depending
on the transformation backend, the input mapping process can do the following:

- Create a new database (Snowflake, optionally Redshift) and import the selected tables from Storage into it.
- Export selected tables from Storage to CSV files and make them available in the workspace for Python, R or OpenRefine scripts.

When the transformation is finished, the **Output Mapping** process moves the transformation results back to
the designated tables in Storage. The **Input** and **Output** mappings ensure complete safety of
the transformation processes -- the transformation always operates in an isolated workspace.

Each transformation has its own workspace. The transformation [sandbox](/transformations/sandbox/)
uses the same workspace as the corresponding transformation. The [plain sandbox](/transformations/sandbox/#plain-loading)
uses a separate workspace.

## Mappings
No transformation can be created without

1) [**Input and Output Mapping**](/transformations/mappings/) --- separates the source data from your transformation. Mapping creates a secure workspace with data copied from the tables specified in the input mappings.
Database table names and CSV file names in transformations are completely unrelated to names of tables in Storage.

2) **Transformation Script** --- SQL, Python, R or OpenRefine code: defines what happens with the data while taking the
 tables from Input Mapping, modifying them and producing the tables referenced in Output Mapping.

{: .image-popup}
![Simple input and output mapping](/transformations/mappings.png)

*When writing transformation scripts, keep in mind that the table names referenced by mappings
are automatically quoted by KBC. This is especially important for Snowflake, which is case sensitive.*

## Backends
A backend is the engine running the transformation script. It is either a database server
[Redshift](https://aws.amazon.com/redshift/) and [Snowflake](https://www.snowflake.com/), or a language interpreter ([R](https://www.r-project.org/about.html), [Python](https://www.python.org/about/)).

How to decide **which backend is appropriate for each task**? A rule of thumb is that SQL performs better
for joining tables, filtering data, grouping and simple aggregations. Script languages are more suitable
for processing one line at a time, raw data processing or custom analytical tasks.

Each transformation within a bucket can use a different backend to perform the task
with the most suitable tool and programming language. As some tasks are difficult to solve in SQL,
feel free to step in with Python and finish the work with SQL again.

The following are the currently available backends:

- **SQL** --- [Snowflake](./snowflake/) is offered as the default backend, but you can apply for your own [Redshift](./redshift/) cluster.
Switching between backends unfortunately requires rewriting the SQL code.

- **Script** --- [Python](./python/), [R](./r/), [OpenRefine](./openrefine/) or [Julia](./julia/). Choose according to your taste and available libraries.

## Versions
Each change in the transformation configuration creates a new [version](/components/#configuration-versions) of the whole transformation bucket.
You can easily access previous versions of all transformations in a bucket and see what has changed.

## Copy Transformation
You can copy an individual transformation into a transformation bucket (either the same or different one).

{: .image-popup}
![Screenshot - Copy transformation](/transformations/copy.png)

The copied transformation is independent of the original transformation.

## Developing Transformations
You can easily develop Snowflake, Redshift transformations using [Sandbox](/transformations/sandbox),
a separate database storage. As a safe workspace with required data,
it allows you to run and play with your arbitrary SQL scripts on the copies of your tables
without affecting data in your Storage, or your transformations. For Julia, Python and R transformations,
you can also use a [Sandbox](/transformations/sandbox) represented by an isolated [Jupyter](https://jupyter.org/) notebook.

## Advanced Features

### Phases
Phases in older projects allow multiple transformation steps to be run within a single workspace.
Multiple steps with the same input mapping (sharing data) might save a bit of processing time, but ultimately,
everything is less clear and isolated. To save time, run multiple orchestration tasks in parallel instead.

### Dependencies
Dependencies allow you to chain transformation steps in older projects. A given transformation is executed after all required steps have been executed.

Originally, we thought this was a cool idea; it allowed everyone to build a network of interdependent and reusable blocks of SQL code. However, a network of nontransparent dependency trees was usually created, so we have decided to abolish this feature in the near future. If possible, please do not use dependencies as it will make future migrations easier.