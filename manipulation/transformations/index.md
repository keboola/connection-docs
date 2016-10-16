---
title: Transformations
permalink: /manipulation/transformations/
---

* TOC
{:toc}

*To create your first transformation, and to see how Transformations are an integral part of the KBC workflow, go to our [Getting Started tutorial](/tutorial/manipulate/).*

**Transformations** allow you to manipulate data in your project. They are the tasks you want to perform 
(*Marketing data preaggregation*, *Tableau denormalizer*, *Integrity checker* or *Join marketing channels and sales*, etc.), and are grouped into folders called **Transformation buckets**. 

No transformation can be created without

1. **Input Mapping** — what Storage tables are used in your transformation.
2. **Output Mapping** — what tables are written into Storage after running the transformation.
3. **Transformation Script** — SQL, Python or R code defining what happens with the data; 
it takes the tables from *Input Mapping*, modifies them and produces the tables referenced in *Output Mapping*.

{: .image-popup}
![Simple input and output mapping](./mappings.png)

## Backends
How to decide which backend is appropriate for each task? A rule of thumb is that SQL performs better 
for joining tables, filtering data,grouping and simple aggregations. Script languages are more suitable 
for processing one line at a time, raw data processing or custom analytical tasks.

Each transformation within a bucket can use a different backend to perform the task 
with the most suitable tool and programming language. As some tasks are difficult to solve in SQL, 
feel free to step in with Python and finish the work with SQL again. 

The following are the currently available backends:

- **SQL** --- Choosing between [MySQL](./mysql/), [Redshift](./redshift/) and [Snowflake](./snowflake/) 
can be a matter of your preference or the overall performance. Many projects start with MySQL and as they grow, 
they are switched to Redshift on a dedicated cluster. That unfortunately requires rewriting the SQL code.

- **Script** --- [Python](./python/) or [R](./r/)? Choose according to your taste and available libraries.


## Mappings
To make sure your SQL code or script does not harm the source tables, 
the [input and output mapping](/manipulation/transformations/mappings/) **separates** the source data 
from your transformation, creating a **secure workspace with data copied** from the tables 
specified in the input mappings. 

## Versions

Each change in the transformation configuration creates a new version of the whole bucket configuration. 
You can easily access previous versions of all transformations in a bucket and see what has changed.

## Developing Transformations

You can easily develop MySQL and Redshift transformations using [Sandbox](/manipulation/transformations/sandbox). 
We provide you with a safe workspace with required data where you can play with your SQL code.

## Advanced Features

### Phases

Phases allow you to run multiple transformation steps within a single workspace, for example, a single MySQL database. 
If multiple steps use the same input mapping (they share data), it might save a bit of processing time, but, ultimately, it makes everything less clear and isolated. 
To save time, you can run multiple orchestration tasks in parallel.

### Dependencies

Dependencies allow you to chain transformation steps. A given transformation is executed after all required steps have been executed. 

Originally, we thought this was a cool idea; it allowed everyone to build a network of interdependent and reusable blocks of SQL code. However, a network of nontransparent dependency trees was usually created, so we have decided to abolish this feature in the near future. If possible, please do not use dependencies as it will make future migrations easier.