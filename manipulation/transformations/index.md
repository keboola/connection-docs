---
title: Transformations
permalink: /manipulation/transformations/
---

* TOC
{:toc}

We consider transformation a unit of work, that runs a custom process on (a segment of) data in your project. A transformation can consist of multiple steps using different languages or environments.

## Transformation Steps

Think of a transformation as a task you want to achieve - eg. *Marketing data preaggregation*, *Tableau denormalizer*, *Integrity checker* or *Join marketing channels and sales*. By deconstructing these complex tasks into simple steps allows you to deploy correct tool (*transformation backend*) for each part. Currently we offer these transformation backends

 - SQL (MySQL, Redshift, Snowflake)
 - R
 - Python

In a single transformation you can freely mix & match backends. Some tasks are difficult to solve in SQL, so don't be afraid to step in with Python and finish the transformation with SQL again.

{: .image-popup}
![Transformation steps](/manipulation/transformations/transformation-steps.png)

You won't be able to run a single transformation step from an orchestration, only the whole transformation.

## Mappings

Each transformation step has a predefined sets of inputs and outputs. 

**Input mapping** defines data, that you have in the Storage and want to use in a transformation. This data will be made available as a table (for SQL) or a CSV file (for R and Python).
   
**Output mapping** takes the results (tables or files) from you transformation and stores it back in Storage. It can create/overwrite/append any table.

## Data flow

Steps of a transformation run in a defined sequential order and are completely independent and isolated. You can store the results of a step in a table in Storage and pick it up from there in a following step. 

## Versions

Each change in the transformation configuration (and all it's steps) creates a new version of the configuration. You can easily access previous versions and see what's changed. 

## Soon to be deprecated

### Naming

The current UI refers to **Transformation buckets** and **Transformations**. We'll be changing the names to provide a better and simpler user experience. What we call a Transformation bucket in current UI will become a Transformation, a Transformation will become a *[Transformation]* Step. 

### Phases

Phases allow you to run multiple transformation steps within a single workspace (eg. single MySQL database). It might save a bit of processing time if multiple steps use the same input mapping (they share data), but ultimately makes everything less clear and isolated. To save time you can run multiple orchestration tasks in parallel. 
  
### Dependencies

Dependencies allow you to chain transformation steps. The given transformation is executed after all required steps have been executed. Originally we thought this was a cool idea and it allowed everyone to build a network of interdependent and reusable blocks of SQL code.  

Today we think simplicity is better. Linear and sequential execution is a no-hassle solution with a self-explaining visualization. You can chain transformations in an orchestration.
