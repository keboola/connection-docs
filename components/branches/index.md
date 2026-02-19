---
title: Development Branches
permalink: /components/branches/
---

* TOC
{:toc}

*If you already know how development branches work in general and want to create and start using your first branch, 
go to our [Getting Started tutorial](/tutorial/branches/).*

Development Branches allow you to modify [component configurations](/components/) without interfering with running 
configurations or entire [orchestrated pipelines](/flows/orchestrator/). They are ideal to use when making bigger changes 
to a project or when you need to be extra careful about performing your changes safely. 

To give an example, let's say that you have an ordinary orchestration that extracts, transforms and writes data 
to a target system, and you need to remove a column from the source. To do that, you must modify several configurations, 
and ideally, also perform a dry run to check that the data in the target system is correct. However, modifying a pipeline 
that runs, e.g., every ten minutes, is difficult without an outage of the pipeline. Development Branches are designed 
to help in such situations.

{% include public-beta-warning.html %}

## How Branches Work
When you create a development branch in your project, you obtain an exact copy of the project and all its current 
configurations. You can then modify these configurations without ever touching the original ones in production, 
and these will keep running in orchestrations. 

When you run a configuration in a branch, it can **read** the [tables](/storage/tables/) and [files](/storage/files/) 
from Storage as if it were a normal configuration. However, when your branch configuration attempts to **write** data
(tables or files), the data is written to the branch’s isolated storage layer. This means that production data and branch data
are completely separated. There is no need to duplicate your entire project's data when creating a new branch.

### Branched Storage Architecture

Instead of creating prefixed buckets immediately upon branch creation, Keboola now uses *branched storage* —  
a dedicated storage namespace that behaves like an isolated copy of your production environment,  
but without duplicating data up front. Tables and files are only materialized when they are cloned or written to.  
The isolation is handled by automatically prefixing schema names, without injecting branch IDs into bucket names.

This approach provides:
- **Full isolation** – each branch has its own Storage environment that does not affect production.  
- **On-demand materialization** – tables and files appear in the branched storage only once they are accessed, cloned, or written to within the branch.  
- **Transparent behavior** – from the user’s perspective, reading and writing works exactly the same as in production.  
  When a job in a branch reads from a table that has not been modified, the data is transparently loaded from production.
- **Safety** – all write operations are performed within the branch’s own isolated context, ensuring that production data remains untouched.

<div class="alert alert-info" markdown="1">
Branched Storage is currently available **only for projects using Snowflake** as the backend.  
Projects running on **BigQuery** continue to use the previous branch model with prefixed buckets (e.g., `in.c-1234-bucket`) until Branched Storage support is added.
</div>

{: .image-popup}
![Screenshot - Branched Storage](branched_storage.png)

---

### Data Pipelines

When you create a data source connector and then transform the data it produces using a transformation, it behaves the following way in branches:

In production, you might have a data source connector that extracts website requests data to a bucket called `in.c-requests`. Then you create a transformation that takes data from `in.c-requests` and transforms it into aggregated visits stored in `out.c-visits`. Both buckets contain production data.

When you switch to a new branch in a **Snowflake project**, no data is copied immediately. The branched storage references production data until you start modifying or writing data.  

If you run a transformation that writes to a new table or modifies existing data, the table will be created or cloned inside the branched storage.  
Any subsequent reads or writes within that branch will operate only on this isolated copy. Your production data in `out.c-visits` remains untouched.

For **BigQuery projects**, the classic prefix-based model still applies — new tables written from a branch are prefixed with the branch ID (e.g., `out.c-1234-visits`).

<div class="alert alert-info" markdown="1">
In Branched Storage (Snowflake), data is materialized only when it is written to or cloned within a branch.  
Reading from unmodified tables uses production data transparently.
</div>

This allows you to test the entire pipeline with real data, in complete isolation from production, without duplicating all storage content at branch creation.

## Creating a Branch
If you have your configurations ready in production and want to create a branch to test some changes, click on your project’s name 
at the top of the screen. Then click on the green icon **New** displayed next to your project’s name.

{: .image-popup}
![Screenshot - Create Development Branch](/tutorial/branches/figures/08-create-dev-branch.png)

Name your new branch and click **Create Development Branch** to open it.

{: .image-popup}
![Screenshot - Name Development Branch](/tutorial/branches/figures/09-name-dev-branch.png)

The branch will appear right below the name of your production project.

{: .image-popup}
![Screenshot - Created Development Branch](/tutorial/branches/figures/10-dev-branch-created.png).

Now you can start modifying your configurations, run them, and analyze the results. 

If you want to learn more about working in a branch, follow our [tutorial](/tutorial/branches/).

## Closing a Branch
Before you merge your development branch back to production, check a detailed [diff of the configuration changes](/tutorial/branches/project-diff/). 

You can end your branch's lifecycle in two ways:

- **Deleting** -- if you do not wish to use the changes you've made and want to simply discard them. The data associated with the branch is discarded when the branch is deleted.
- [**Merging into production**](/tutorial/branches/merge-to-production/) -- all changes in the configurations are brought back to the respective production configurations. All the changes are applied at once (after you approve them) and produce new [versions](/components/#configuration-versions) of the respective configurations. The branch can be either deleted or kept for further reference after merging. 

***Important:** All of this happens within the same project, enabling collaboration with other project members on the modifications.*

## Component Considerations

Certain components are not allowed to run in development branches. There are following special cases where components' functionality is limited in the development branches.

### Working with External Resources

Some components, like writers, can write to a destination that is external to Keboola. Those components'
configs are first marked as *unsafe* in development branch.

You will not be able to run an unsafe config. You need to first observe the config and verify that it's either OK to
write to the destination, or change the destination accordingly.

### OAuth Authorized Components

Components using OAuth do not allow authorizing nor changing the OAuth in a development branch. The OAuth authorization tokens are shared with production so changing them might break the production pipeline.

*****

***Important:** Development branches are for development and testing only, so setting up status notifications on Flows is not supported.*

