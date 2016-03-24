---
title: Part 2 - Data Manipulation
permalink: /overview/tutorial/manipulate/
---

In the [previous step](/overview/tutorial/load/) you learned, how to quickly load data into
KBC and you should now have tables *account*, *opportunity*, *user* and *usergoal* in bucket 
*in.c-tutorial*. In this part of the tutorial you will learn how to manipulate with data in storage 
using Transformations

To create a transformation, go to **Transformations** section:

{: .image-popup}
![Screenhost - Transformations Console](/overview/tutorial/manipulate/transformations-intro.png)

Like tables, Transformations are organized into *buckets*. Each transformation bucket can contain any number
of individiual transformations and it should represent a logical set (container) of operations you want to perform together.
Before you can start with transformations, you must create a bucket. Lets name the bucket *Opportunity*. 

{: .image-popup}
![Screenhost - Create Transformation Bucket](/overview/tutorial/manipulate/transformations-create-bucket.png)

When the bucket is created, you can create individual transformations by clicking on *Add Transformation*. Each 
transformation must have a *Name* and *Backend*. Backend is the engine running the transformation script, it can be
a database server (MySQL, Redshift, Snowflake) or a language interpreter (R, Python). Create a new tranformation
*Denormalize opportunities* on the *MySQL* backend.

{: .image-popup}
![Screenhost - Create Transformation Bucket](/overview/tutorial/manipulate/transformations-create.png)



