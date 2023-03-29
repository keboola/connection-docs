---
title: Workspace
permalink: /transformations/workspace/
---

* TOC
{:toc}

A workspace serves several purposes and can be used as

- an *interactive development environment* (IDE) to create transformations. 
- an *analytical workspace* where you can interactively perform experiments and modelling with live production data. 
- an ephemeral workspace created on each run of a transformation to provide the *staging* area in which the transformation operates.
Ephemeral transformation workspaces are not visible in the transformation UI, hence we won't mention them further.

**In [legacy transformations](/transformations/#legacy-transformations), workspaces are 
called [sandboxes](/transformations/sandbox/) and behave considerably differently.**

## Working with Workspaces
You can create a Workspace on the Transformations page:

{: .image-popup}
![Workspace Introduction](/transformations/workspace/workspace-intro.png)

Select a workspace type - not all workspace types are supported in all project workspaces. 
Workspace types match available transformation types. For scripting languages ([Python](https://www.python.org/), 
[R](https://www.r-project.org/), and [Julia](https://julialang.org/)), we provide [JupyterLab](https://jupyter.org/) with 
the matching [kernel](https://jupyter.readthedocs.io/en/latest/projects/kernels.html).
For SQL workspaces, you can either use [Snowflake workspace](https://docs.snowflake.com/en/user-guide/ui-using.html) 
or a database client of your liking (for example, [Dbeaver](https://dbeaver.io/)).

{: .image-popup}
![Workspace - Select Type](/transformations/workspace/workspace-create-1.png)

Name and optionally describe the workspace:

{: .image-popup}
![Workspace - Name workspace](/transformations/workspace/workspace-create-2.png)

Creating the workspace takes a few seconds, so it will take a while before it appears:

{: .image-popup}
![Workspace - Running](/transformations/workspace/workspace-create-3.png)

Once the workspace is ready, you'll see it in the workspace list:

{: .image-popup}
![Workspace - Running](/transformations/workspace/workspace-create-4.png)

In the workspace detail, you can

- get credentials & connect to the workspace,
- configure workspace [mappings](/transformations/mappings/),
- load & unload data specified in the mappings, and
- manage the workspace (resume & terminate & delete).

{: .image-popup}
![Workspace - Running](/transformations/workspace/workspace-detail-1.png)

### Connecting to Workspace
To connect to a [JupyterLab](https://jupyterlab.readthedocs.io/en/stable/) workspace with the associated kernel 
(Python, R, Julia), use the URL and the password provided in the **Credentials** link. Use the **Connect** button 
to directly open the JupyterLab interface:

To connect to a [Snowflake](https://www.snowflake.com/) workspace,

- use the Snowflake [Web Interface](https://docs.snowflake.com/en/user-guide/ui-using.html): 
use the **Connect** link and username + password provided in the **Credentials** link.
- use your favorite database client (we like [DBeaver](https://dbeaver.io/)) and the credentials provided in 
the **Credentials** link.

To connect to a [Synapse](https://azure.microsoft.com/en-us/services/synapse-analytics/) 
and [Redshift](https://aws.amazon.com/redshift/) workspaces, you have to use your database client 
(we like [DBeaver](https://dbeaver.io)) and use the database options provided in the **Credentials** view. 
If the database client does not have Synapse Driver, look for *Azure SQL Server*.

### Workspace Lifecycle
When a workspace is created, it enters the **Active** state and can be used. 

- Database (Snowflake, Redshift, and Synapse) workspaces are billed by the runtime of queries executed in them. As such, we leave them in active state until you delete them. 
- JupyterLab workspaces are billed by their running time. They can be terminated and resumed, in order to reduce running time while preserving your work. 

{: .image-popup}
![Workspace - States](/transformations/workspace/workspace-states.svg)

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

If you see this error, please go to the list of workspaces in Keboola Connection, resume the workspace
and reconnect from there.

### Loading Data
To load arbitrary data into the workspace, configure 
[Table Input Mapping](/transformations/mappings/#table-input-mapping) or
[File Input Mapping](/transformations/mappings/#file-input-mapping) (or both) and click the **Load Data** button.

{: .image-popup}
![Workspace - Load Data](/transformations/workspace/load-data.png)

When loading data into a workspace, you can specify entire buckets, which can be especially
useful when you are not sure what tables you'll need in your work. You can also take
advantage of [alias tables](/storage/tables/#aliases) and prepare buckets with the tables you'll need.

### Read-Only Storage
When input and output mapping are not fitting well your use case, read-only storage offers a straightforward access to data, drastically reducing the execution time. 
Use it in the following scenarios:
- Slow transformations where a clone is not used (input mapping)
- Complex orchestrations to just get data from a data source to the workspace where it is accessed via other apps (output mapping)
- Complex cases where users must choose tables in both input and output mapping
- Cases where updating data in Storage via output mapping causes multiple data movement operations

When an SQL transformation starts, SQL code is being executed immediately. All tables from Storage are RO accessible from within the transformation. 
Transformations are able to use some sort of persistent workspace & write directly to defined tables in Storage.

*Note: You must be using [New Transformations](/transformations/#new-transformations) in order to see this feature.* 

For each workspace or Snowflake writer (data destination) configuration, users can choose whether the read-only Storage will be used or not. 
For each transformation, the read-only access is enabled by default and users can directly work with the data without manually defining input mapping.

When read-only access is enabled, the workspace will get automatically access to all data in Storage.

**User workspace**

{: .image-popup}
![Read-Only Storage](/transformations/workspace/read-only-storage1.png)

**Snowflake data destination**

{: .image-popup}
![Read-Only Storage](/transformations/workspace/read-only-storage2.png)


### Unloading Data
You can also unload data from the workspace. To unload data, configure 
[Table Output Mapping](/transformations/mappings/#table-output-mapping)
or [File Output Mapping](/transformations/mappings/#file-output-mapping) (or both) and click **Unload Data** button.

{: .image-popup}
![Workspace - Unload Data](/transformations/workspace/unload-data.png)

Unloading data is useful, for example, when your ad-hoc analysis leads to
valuable results, or when you trained a new model which you'd like to use in transformations.

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

## Developing Transformations
Workspaces are highly useful for developing transformations. When you configure [mappings](/transformations/mappings/) 
and develop a script in JupyterLab, you can use the **Create Transformation** button to 
deploy the notebook into a transformation. Please note that only input/output mapping without the actual script is copied when creating transformation from a workspace

{: .image-popup}
![Workspace - Create Transformation](/transformations/workspace/create-transformation-1.png)

Enter the name of the new transformation:

{: .image-popup}
![Workspace - Create Transformation](/transformations/workspace/create-transformation-2.png)

You can also create workspaces from transformations.

## Analytical Workspaces
Apart from developing transformations, you can use workspaces to perform ad-hoc analysis 
of production data of your choice. A workspace provides you with a safe and isolated environment
where you can experiment. The input mapping isolation also means that you can work on live
production projects without data in the workspace constantly changing --- you update them
on demand by loading data into the workspace.

In a private beta preview, the interactive workspaces can also be extended with 
[MLflow](https://mlflow.org/) and [Spark](http://spark.apache.org/) integrations.
