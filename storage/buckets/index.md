---
title: Buckets
permalink: /storage/buckets/
---

Buckets are containers for tables in Storage. They are further organized into the following three **stages**:

1. **in** --- for input data (usually extractor results)
2. **out** --- for processed data (usually results of transformations or applications)
3. **sys** --- deprecated stage used for configuration of some components

The distinction between the input and output stage is purely conventional differentiation between raw and processed data.
When creating a new bucket, select one of the stages and a suitable [database backend](/storage/#backend-properties) based on its properties.
For information on how to load data into Storage, see the corresponding part of our [tutorial](/tutorial/load/).

{: .image-popup}
![Screenshot - Create bucket](/storage/buckets/create-bucket.png)

To review information about an existing bucket, hover over the bucket name and select **Bucket detail**:

{: .image-popup}
![Screenshot - Bucket information](/storage/buckets/bucket-info.png)

Apart from being used for organizing tables, buckets can also be used for [sharing tables](/storage/buckets/sharing).
