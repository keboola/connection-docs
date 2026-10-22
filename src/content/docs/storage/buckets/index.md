---
title: Buckets
slug: 'storage/buckets'
---

Buckets are containers for tables in Storage. They are further organized into the following two **stages**:

1. **in** — for input data (usually data source connector results)
2. **out** — for processed data (usually results of transformations or applications)

The distinction between the input and output stages is purely conventional differentiation between raw and processed data.
When creating a new bucket, select one of the stages and a suitable [database backend](/storage/#storage-backend-types-and-features) based on its properties.
For information on how to load data into Storage, see the corresponding part of our [tutorial](/tutorial/load/).
<!-- VERIFY(Jordan Burger): the Create Bucket dialog in project 264 (2026-10-20) has only Name and Stage, no backend choice. Does a backend field appear in projects with more than one backend? If not, drop the backend half of this sentence. -->

To create a bucket, click **Create bucket** on the **Storage** page, enter a name, choose the stage, and click **Create bucket** in the dialog:

<video autoplay loop muted playsinline poster="/storage/buckets/create-bucket-poster.png" aria-label="The Storage page with the Create bucket button marked, then the Create Bucket dialog with the name my-tutorial-bucket, stage IN, and its Create bucket button marked (an example project: the bucket names, counts and dates vary)">
  <source src="/storage/buckets/create-bucket.mp4" type="video/mp4" />
</video>

To review information about an existing bucket, hover over the bucket name and select **Bucket detail**:

![Screenshot - Bucket information](/storage/buckets/bucket-info.png)

Apart from being used for organizing tables, buckets can also be used for [sharing tables](/catalog/).
