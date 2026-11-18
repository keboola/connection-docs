---
title: Workspace
description: 'What workspaces are for, connecting to one, loading and unloading data, their lifecycle, and using them to develop transformations or for analysis.'
slug: 'workspace'
redirect_from:
  - /transformations/sandbox/
  - /transformations/workspace/
---



A workspace serves several purposes and can be used as

- an *interactive development environment* (IDE) to create transformations. 
- an *analytical workspace* where you can interactively perform experiments and modelling with live production data. 
- an ephemeral workspace created on each run of a transformation to provide the *staging* area in which the transformation operates.
Ephemeral transformation workspaces are not visible in the transformation UI, hence we won't mention them further.

## Working with Workspaces
Select a workspace type; not all workspace types are supported in all project workspaces. 
Workspace types match available transformation types. For scripting languages ([Python](https://www.python.org/) and 
[R](https://www.r-project.org/)), we provide [JupyterLab](https://jupyter.org/) with 
the matching [kernel](https://jupyter.readthedocs.io/en/latest/projects/kernels.html).
For SQL workspaces, you can either use Snowflake's [Snowsight](https://docs.snowflake.com/en/user-guide/ui-snowsight-homepage) 
or a database client of your liking (for example, [Dbeaver](https://dbeaver.io/)).

#### Snowflake

>***Important: Direct Access Availability***
>
>Direct access to Snowflake Workspaces is **only available for projects with dedicated Snowflake backends** (KBDB - Keboola-Brings-Database or BYODB - Bring-Your-Own-Database).
>
>**Multi-tenant and Pay-As-You-Go projects** using Keboola's shared Snowflake backend **do not have direct access** to Snowflake Workspaces.
>For these projects, use these alternatives:
>- **[SQL Editor](/workspace/sql-editor)** - for interactive SQL queries, transformations, and development
>- **[Data Gateway](/components/applications/data-gateway)** - for connecting BI tools and external applications

#### BigQuery
To connect to a BigQuery workspace, see [Connect to a workspace](/workspace/connect/).

### Workspace Lifecycle
When a workspace is created, it enters the **Active** state and can be used. 

- Database (Snowflake and BigQuery) workspaces are billed by the runtime of queries executed in them. They stay active until you delete them, unless nobody uses them for six months; such workspaces are first warned, then deactivated and later deleted automatically, see [Workspace Retention](/workspace/retention/).
- JupyterLab workspaces are billed by their running time. They can be terminated and resumed, in order to reduce running time while preserving your work. 

![Workspace - States](/workspace/workspace-states.svg)

The diagram does not show the **Deactivated** state that retention introduces for Snowflake and BigQuery
workspaces; see [Workspace Retention](/workspace/retention/).

Workspace termination can be done manually or it is done automatically after 1 hour period of inactivity (if auto sleep feature is supported and enabled). 
Inactivity is measured from the last save of any notebook in JupyterLab. When a workspace is terminated, it is switched off
and consumes no credits. A terminated workspace can be resumed. Resuming a workspace means that we restore the
last saved version of all notebooks in the home directory (`/data`). We also load the current data from Input Mapping.

On a restored workspace, you'll get

- all notebook files with their results,
- the current version of input mapping sources (beware that these might have changed in the mean time)
- new password
- Git configuration (if it was initialized before the termination)

Terminating and restoring a workspace means that you'll loose

- the contents of memory,
- state of the notebook executions (the results are preserved however), and
- modifications to any data or temporary files on the local workspace drive.

*Note: When you terminate and restore the workspace, its password changes.*

When a workspace is terminated and you return to the JupyterLab interface (e.g., when you put your computer to sleep), 
you'll see the following error:

    Server Connection Error
    A connection to the Jupyter server could not be established. JupyterLab will continue trying to reconnect. Check your network connection or Jupyter server configuration.

If you see this error, please go to the list of workspaces in Keboola, resume the workspace
and reconnect from there.

### Read-Only Input Mapping

*Note: You must be using [new transformations](/transformations/) to see this feature.*

The workspace also supports **read-only input mappings**, as described in the [mapping section](/transformations/mappings/#read-only-input-mapping).
For each **workspace** or **Snowflake writer** (data destination) configuration, users can choose whether to use a **read-only input mapping**.

Note that **there are security implications**. If you enable a **read-only input mapping** for a workspace, then it has access to all the data in the project. 
You may not want to share workspace credentials with other people unless it's acceptable for them to see all the data in the project. If limited access is required, do not enable **read-only input mappings** for the workspace.

With **read-only input mappings** disabled, only tables listed in the input mapping are accessible.

![Workspace - Create new workspace with Read Only](/workspace/create-new-ws-with-ro.png)

So, if we enable this feature when we create a workspace, we can access individual tables in the workspace,
without needing to define any tables in the input mapping. Alias tables are materialized as database VIEWs and are fully accessible via read-only input mappings — including filtered aliases.
This also applies to linked buckets. *Note that buckets and tables belong to another project, so you must access, for example, the database of another project depending on the backend.
For example, say your bucket `in.c-customers` is linked from bucket `in.c-crm-extractor` in project 123. You then need to reference the tables in the transformation like this: `"KEBOOLA_123"."in.c-crm-extractor"."my-table"`. When developing transformation code, it's easiest to create a workspace with **read-only input mappings** enabled and look directly in the database to find the correct database and schema names. 

![Example - Empty Input Mapping](/workspace/example-of-empty-im.png)

![Example - Table in workspace](/workspace/table-in-ws.png)

### Data Persistency (beta)
When this feature is enabled in a project, your data in workspaces can be kept. This way you can, when you return, start where you left off without losing data or time by importing the data again or executing scripts to get to the right stage.

Once this feature is activated, we will automatically back up all the data in newly created workspaces up to the limits defined by your selected workspace size. More specifically:
- Small (50 GB), medium (100 GB), and large (150 GB)
- Everything in the /data folder will be kept.
- Auto-save (backup) of notebooks is disabled.
- Input-mapping is performed automatically only once, when the workspace is created, not when a workspace resumes.

Nothing changes for workspaces created before the feature was activated. Your data will be lost upon leaving the workspace. 
Workspaces created following the feature's deactivation will not keep their data when you leave.
However, if a workspace is created while the feature is activated, it will keep its data even after the feature is deactivated. Your data will be kept until the workspace is deleted.

Provisioning of persistent storage takes some time, usually 2–3 minutes after the feature is activated. To prevent workspaces that are begun in the meantime from becoming broken, we block their initiation until the storage is ready to be used.

Pricing:
Curently for FREE in public beta. When it is generally available, additional charges will apply. 

## Analytical Workspaces
Apart from developing transformations, you can use workspaces to perform ad-hoc analysis 
of production data of your choice. A workspace provides you with a safe and isolated environment
where you can experiment. The input mapping isolation also means that you can work on live
production projects without data in the workspace constantly changing — you update them
on demand by loading data into the workspace.

A comprehensive [video guide](https://www.youtube.com/watch?v=iQMnh9nqRiE) on this subject is available on our YouTube channel.
