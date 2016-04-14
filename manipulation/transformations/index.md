---
title: Transformations
permalink: /manipulation/transformations/
---

* TOC
{:toc}

**Transformation** allows you to manipulate data in your project. Transformation is a task you want to achieve - eg. *Marketing data preaggregation*, *Tableau denormalizer*, *Integrity checker* or *Join marketing channels and sales*.
Transformations are grouped into folders called **Transformation buckets** and each transformation within a bucket can use a different backend to perform the task with the most suitable tool or language. Some tasks are difficult to solve in SQL, so don't be afraid to step in with Python and finish the work with SQL again. Currently available backends are:

 - SQL
   - MySQL
   - Redshift
   - Snowflake
 - Script
   - R
   - Python

{: .image-popup}
![Transformation steps](/manipulation/transformations/transformation-steps.png)

## Mappings

Each transformation has a predefined sets of inputs and outputs.

**Input mapping** defines data, that you have in the Storage and want to use in a transformation. This data will be made available as a table (for SQL) or a CSV file (for R and Python).

**Output mapping** takes the results (tables or files) from you transformation and stores it back in Storage. It can create/overwrite/append any table.

## Data flow

Steps of a transformation run in a defined sequential order and are completely independent and isolated. You can store the results of a step in a table in Storage and pick it up from there in a following step.

## Versions

Each change in the transformation configuration creates a new version of the configuration. You can easily access previous versions of all transformations in a bucket and see what's changed.

## Developing transformations

You can easily develop MySQL and Redshift transformations using [Sandbox](/manipulation/transformations/sandbox). We provide you with a safe workspace with required data, where you can play with your SQL code.

## Advanced features

### Phases

Phases allow you to run multiple transformation steps within a single workspace (eg. single MySQL database). It might save a bit of processing time if multiple steps use the same input mapping (they share data), but ultimately makes everything less clear and isolated. To save time you can run multiple orchestration tasks in parallel.

### Dependencies

Dependencies allow you to chain transformation steps. The given transformation is executed after all required steps have been executed. Originally we thought this was a cool idea and it allowed everyone to build a network of interdependent and reusable blocks of SQL code.

