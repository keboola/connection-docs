---
title: Workspace
permalink: /workspace/
redirect_from:
  - /transformations/sandbox/
  - /transformations/workspace/
---

* TOC
{:toc}

A workspace serves several purposes and can be used as

- an *interactive development environment* (IDE) to create transformations. 
- an *analytical workspace* where you can interactively perform experiments and modelling with live production data. 
- an ephemeral workspace created on each run of a transformation to provide the *staging* area in which the transformation operates.
Ephemeral transformation workspaces are not visible in the transformation UI, hence we won't mention them further.

## Working with Workspaces
Select from the top menu Workspaces:

{: .image-popup}
![Workspace Introduction](/workspace/workspace-intro.png)

Select a workspace type; not all workspace types are supported in all project workspaces. 
Workspace types match available transformation types. For scripting languages ([Python](https://www.python.org/) and 
[R](https://www.r-project.org/)), we provide [JupyterLab](https://jupyter.org/) with 
the matching [kernel](https://jupyter.readthedocs.io/en/latest/projects/kernels.html).
For SQL workspaces, you can either use Snowflake's [Snowsight](https://docs.snowflake.com/en/user-guide/ui-snowsight-homepage) 
or a database client of your liking (for example, [Dbeaver](https://dbeaver.io/)).

{: .image-popup}
![Workspace - Select Type](/workspace/workspace-create-1.png)

Name and optionally describe the workspace:

{: .image-popup}
![Workspace - Name workspace](/workspace/workspace-create-2.png)

Creating the workspace takes a few seconds, so it will take a while before it appears:

{: .image-popup}
![Workspace - Running](/workspace/workspace-create-3.png)

Once the workspace is ready, you'll see it in the workspace list:

{: .image-popup}
![Workspace - Running](/workspace/workspace-create-4.png)

In the workspace detail, you can

- get credentials & connect to the workspace,
- configure workspace [mappings](/transformations/mappings/),
- load & unload data specified in the mappings, and
- manage the workspace (resume & terminate & delete).

{: .image-popup}
![Workspace - Running](/workspace/workspace-detail-1.png)

### Connecting to Workspace
#### Python/R
To connect to a [JupyterLab](https://jupyterlab.readthedocs.io/en/stable/) workspace with the associated kernel 
(Python, R), use the URL and the password provided in the **Credentials** link. Use the **Connect** button 
to directly open the JupyterLab interface.

{: .image-popup}
![Workspace - Python/R](/workspace/workspace-connect-pythonr.png)

#### Snowflake

>***Important: Direct Access Availability***
>
>Direct access to Snowflake Workspaces is **only available for projects with dedicated Snowflake backends** (KBDB - Keboola-Brings-Database or BYODB - Bring-Your-Own-Database).
>
>**Multi-tenant and Pay-As-You-Go projects** using Keboola's shared Snowflake backend **do not have direct access** to Snowflake Workspaces.
>For these projects, use these alternatives:
>- **[SQL Editor](/workspace/sql-editor)** - for interactive SQL queries, transformations, and development
>- **[Data Gateway](/components/applications/data-gateway)** - for connecting BI tools and external applications

We provide two versions of [Snowflake](https://www.snowflake.com/) workspaces with different authentication options for projects with dedicated Snowflake backends.

**Person** type workspace uses `SSO` and `Key Pair` authentication methods. To connect using:

- `SSO` - use the **Connect** button in the **Connect** menu to login to Snowflake's [Snowsight](https://docs.snowflake.com/en/user-guide/ui-snowsight-homepage) web interface.
- `Key Pair` - use your favorite database client or other third-party tool and the Key Pair credentials provided in the **Connect** menu.

{: .image-popup}
![Workspace - Snowflake](/workspace/workspace-connect-snowflake-person.png)

**Legacy Service** type workspace uses `SSO` and `Password` authentication methods. To connect using:

- `SSO` - use the **Connect** button in the **Connect** menu to login to Snowflake's [Snowsight](https://docs.snowflake.com/en/user-guide/ui-snowsight-homepage) web interface.
- `Password` - use your favorite database client or other third-party tool and the Password credentials provided in the **Connect** menu.

{: .image-popup}
![Workspace - Snowflake](/workspace/workspace-connect-snowflake-legacy.png)

>***Important***
>
>**Legacy Service** type workspace is using single-factor password authentication which is being [deprecated by Snowflake](https://docs.snowflake.com/en/user-guide/security-mfa-rollout).
>As a result, we are deprecating this login type by the end of 2025.
>We recommend using `Person` type workspace instead, if you don't need to use password authentication.

##### Using Key Pair Authentication with Third-Party Tools
Below are links to documentation for popular database IDEs used by Keboola users that support Key Pair authentication.

- [DBeaver Community Edition](https://community.snowflake.com/s/article/Using-Private-Key-authentication-in-DBeaver)
- [DBeaver Commercial Editions](https://dbeaver.com/docs/dbeaver/Authentication-Snowflake/#private-key-authentication)
- [DataGrip](https://www.jetbrains.com/help/datagrip/create-snowflake-data-source-with-key-pair-authentication.html)
- [VSCode/Cursor Snowflake Extension](https://docs.snowflake.com/en/user-guide/vscode-ext#sign-in-to-snowflake-with-the-vs-code-extension)
- [VSCode/Cursore DBCode Extension](https://dbcode.io/docs/supported-databases/snowflake)

##### Private Key Security and Encryption
We generate the private key unencrypted and recommend using password management tools like [Keepass](https://keepass.info/) or [1Password](https://1password.com/) to store your private key for better security.
In case you need to store the private key locally and want to protect it from unauthorized access, you can follow the instructions below based on your OS to encrypt it using [OpenSSL](https://www.openssl.org/):

**macOS & Linux**

Open a terminal and run:

```
openssl pkcs8 -in private_key.pem -topk8 -v2 aes-256-cbc -out private_key_encrypted.pem
```

* `-in private_key.pem` → input file
* `-topk8` → outputs in PKCS #8 format
* `-v2 aes-256-cbc` → encryption algorithm
* `-out private_key_etncrypted.pem` → encrypted key file

👉 You’ll be prompted to set a password.

**Windows**

Make sure OpenSSL is installed (e.g., via [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) or [Windows binaries](https://slproweb.com/products/Win32OpenSSL.html)).

Open PowerShell or Command Prompt and run:

```
openssl pkcs8 -in private_key.pem -topk8 -v2 aes-256-cbc -out private_key_encrypted.pem
```

* `-in private_key.pem` → input file
* `-topk8` → outputs in PKCS #8 format
* `-v2 aes-256-cbc` → encryption algorithm
* `-out private_key_encrypted.pem` → encrypted key file

👉 You’ll be prompted to set a password.

##### Private Key Conversion to .p8 Format
Some third-party BI tools (such as Metabase) require private keys in `.p8` format instead of the default `.pem` format provided by Keboola. You can convert your private key using OpenSSL with the following command:

**macOS & Linux**

Open a terminal and run:

```
openssl pkcs8 -topk8 -inform PEM -outform DER -in private_key.pem -out private_key.p8 -nocrypt
```

* `-topk8` → outputs in PKCS #8 format
* `-inform PEM` → input format is PEM
* `-outform DER` → output format is DER
* `-in private_key.pem` → input file
* `-out private_key.p8` → output file
* `-nocrypt` → no encryption

**Windows**

Make sure OpenSSL is installed (e.g., via [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) or [Windows binaries](https://slproweb.com/products/Win32OpenSSL.html)).

Open PowerShell or Command Prompt and run:

```
openssl pkcs8 -topk8 -inform PEM -outform DER -in private_key.pem -out private_key.p8 -nocrypt
```

* `-topk8` → outputs in PKCS #8 format
* `-inform PEM` → input format is PEM
* `-outform DER` → output format is DER
* `-in private_key.pem` → input file
* `-out private_key.p8` → output file
* `-nocrypt` → no encryption

#### SQL Editor

>***Note for Multi-tenant and Pay-As-You-Go Projects***
>
>If your project uses Keboola's shared Snowflake backend (Multi-tenant or Pay-As-You-Go), the **SQL Editor is your primary tool** for SQL development, as direct Snowflake workspace access is not available.

💡 Tip: Use SQL Editor for Safe Testing

For interactive SQL exploration inside your workspace, use the SQL Editor.
It lets you safely test queries, preview data, and prepare the SQL code you later use in your transformations - without affecting your production pipelines.

Learn more: [SQL Editor](/workspace/sql-editor).

#### BigQuery
To connect to a [BigQuery](https://cloud.google.com/bigquery) workspace, you have to use your database client and the **Credentials File** provided in the **Connect** menu.

{: .image-popup}
![Workspace - BigQuery](/workspace/workspace-connect-bigquery.png)

### Workspace Lifecycle
When a workspace is created, it enters the **Active** state and can be used. 

- Database (Snowflake and BigQuery) workspaces are billed by the runtime of queries executed in them. As such, we leave them in active state until you delete them. 
- JupyterLab workspaces are billed by their running time. They can be terminated and resumed, in order to reduce running time while preserving your work. 

{: .image-popup}
![Workspace - States](/workspace/workspace-states.svg)

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

### Loading Data
To load arbitrary data into the workspace, configure a
[table input mapping](/transformations/mappings/#table-input-mapping) or
[file input mapping](/transformations/mappings/#file-input-mapping) (or both) and click the **Load Data** button.

{: .image-popup}
![Workspace - Load Data](/workspace/load-data.png)

When loading data, you have the option to **Clean workspace before loading**. When this option is enabled, Keboola removes all **tables** and **views** from the workspace schema before loading the new data. However, the following objects are **not** removed and will persist across loads:

- **Stored procedures**
- **User-defined functions (UDFs)**

This is by design --- Keboola does not create stored procedures or UDFs, so it does not manage or remove them during cleanup. If you have created stored procedures or UDFs in the workspace, you are responsible for managing their lifecycle. Keep this in mind to avoid potential naming conflicts or unexpected behavior from outdated routines.

When loading data into a workspace, you can specify entire buckets, which can be especially
useful when you are not sure what tables you'll need in your work. You can also take
advantage of [alias tables](/storage/tables/#aliases) and prepare buckets with the tables you'll need.

### Read-Only Input Mapping

*Note: You must be using [new transformations](/transformations/#new-transformations) to see this feature.*

The workspace also supports **read-only input mappings**, as described in the [mapping section](/transformations/mappings/#read-only-input-mapping).
For each **workspace** or **Snowflake writer** (data destination) configuration, users can choose whether to use a **read-only input mapping**.

Note that **there are security implications**. If you enable a **read-only input mapping** for a workspace, then it has access to all the data in the project. 
You may not want to share workspace credentials with other people unless it's acceptable for them to see all the data in the project. If limited access is required, do not enable **read-only input mappings** for the workspace.

With **read-only input mappings** disabled, only tables listed in the input mapping are accessible.

{: .image-popup}
![Workspace - Create new workspace with Read Only](/workspace/create-new-ws-with-ro.png)

So, if we enable this feature when we create a workspace, we can access individual tables in the workspace,
without needing to define any tables in the input mapping. However, a **read-only input mapping** cannot access alias tables, because technically it is just a reference to an existing schema.
This also applies to linked buckets. *Note that buckets and tables belong to another project, so you must access, for example, the database of another project depending on the backend.
For example, say your bucket `in.c-customers` is linked from bucket `in.c-crm-extractor` in project 123. You then need to reference the tables in the transformation like this: `"KEBOOLA_123"."in.c-crm-extractor"."my-table"`. When developing transformation code, it's easiest to create a workspace with **read-only input mappings** enabled and look directly in the database to find the correct database and schema names. 

{: .image-popup}
![Example - Empty Input Mapping](/workspace/example-of-empty-im.png)

{: .image-popup}
![Example - Table in workspace](/workspace/table-in-ws.png)

### Unloading Data
You can also unload data from the Python and R workspaces. To unload data, configure 
[Table Output Mapping](/transformations/mappings/#table-output-mapping)
or [File Output Mapping](/transformations/mappings/#file-output-mapping) (or both) and click **Unload Data** button.

{: .image-popup}
![Workspace - Unload Data](/workspace/unload-data.png)

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
![Workspace - Create Transformation](/workspace/create-transformation-1.png)

Enter the name of the new transformation:

{: .image-popup}
![Workspace - Create Transformation](/workspace/create-transformation-2.png)

You can also create workspaces from transformations.

## Analytical Workspaces
Apart from developing transformations, you can use workspaces to perform ad-hoc analysis 
of production data of your choice. A workspace provides you with a safe and isolated environment
where you can experiment. The input mapping isolation also means that you can work on live
production projects without data in the workspace constantly changing --- you update them
on demand by loading data into the workspace.

A comprehensive [video guide](https://www.youtube.com/watch?v=iQMnh9nqRiE) on this subject is available on our YouTube channel.
