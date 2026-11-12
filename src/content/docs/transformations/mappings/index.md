---
title: Input and Output Mapping
slug: 'transformations/mappings'
search_keywords: [input mapping, output mapping]
---

*To configure input and output mappings in the process of creating a transformation, 
go to our [Getting Started tutorial](/getting-started/transform/).*



When manipulating your data, there is no need to worry about accidentally modifying the wrong tables.
**Mapping separates the source data from your transformation script**. It creates a secure staging area
with data copied from specified tables and brings only specified tables and files back to Storage.
While the concept of mapping is most important for transformations, it actually applies to every 
single [component](/components/).

Two mapping types must be set up before running a transformation:

1. **Input Mapping** — This is a list of Storage tables used in your transformation.
If an input mapping does not fit well to your use case, then a [read-only input mapping](/transformations/mappings/#read-only-input-mapping) offers straightforward access to the data, and will drastically reduce the execution time.
This feature is useful in the following scenarios:
   - Slow transformations where a clone is not used (input mapping)
   - Complex flows that move data from a data source to the workspace where they are accessed by other apps
   - Cases where updating data in Storage via output mapping causes multiple data movement operations
2. **Output Mapping** — This is a list of tables written into Storage after running the transformation. 
Tables not listed are neither modified nor permanently stored (i.e., they are temporary). 
They are deleted from the transformation staging area when the execution finishes. 

![Simple input and output mapping](/transformations/mappings/mappings.png)

*Table names referenced by mappings are automatically quoted by Keboola. 
This is especially important for Snowflake, which is case sensitive.*

The concept of mapping helps to make the transformations repeatable and protect the project [Storage](/storage/). 
You can always rely on the following:
- Having an empty staging Storage (no need to clean up before transformations)
- Having an isolated staging Storage (no need to worry about interference with other transformations)
- Having a stateless transformation (no need to worry about having left-over variables and settings from something else)
- Resource cleanup (no need to worry about cleaning up temporary data after yourself)
- Resource conflict (no need to worry about naming data in the staging Storage)

While this makes some operations seemingly unnecessarily complicated, it ensures that transformations
are repeatable and you can't inadvertently overwrite data in the project Storage. For ad-hoc
operations, we recommend you use **[workspaces](/workspace/)**. For 
bulk operations, consider taking advantage of **[variables](/components/variables/)**
and [programmatic automation](https://developers.keboola.com/automate/).
