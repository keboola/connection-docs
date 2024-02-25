---
title: Transformations
permalink: /transformations/
redirect_from:
    - /manipulation/transformations/
---

* TOC
{:toc}

*To create your first transformation, and to see how transformations are an integral part of the Keboola workflow, 
go to our [Getting Started tutorial](/tutorial/manipulate/).*

**Transformations** allow you to manipulate data in your project. They are the tasks you want to perform
(Marketing data preaggregation, Tableau denormalizer, Integrity checker or Join marketing channels
and sales, etc.). 

In Keboola all transformations operate on a copy of the data from Storage
in a safe and isolated environment. This improves safety, repeatability and traceability of all data operations.
The process of isolating data is called [**mapping**](/transformations/mappings/).
The mapping process copies input data from permanent project Storage into a 
[**staging**](/transformations/mappings/#table-input-mapping) area which represents an ephemeral storage for 
the purpose of running the transformation **script**. The transformation script is executed by a transformation
[**backend**](/transformations/#backends). To ease the [development](/transformations/#developing-transformations) 
of the transformation script, all transformations are **automatically versioned**, and you can use a **workspace**
which provides a copy of the environment and can be run interactively.

## Overview
The schema below shows a high-level overview of transformations:

{: .image-popup}
![Transformations schema](/transformations/transformations-schema.svg)

A transformation is represented by a **Transformation Script** (SQL, Julia, OpenRefine, Python, R) which you
can use to manipulate your data. To ensure safety of the data in Storage, a transformation
operates in a completely separate **staging storage** created for each transformation. When a
transformation [job](/management/jobs/) runs, it takes the required data from the project [Storage](/storage/tables/) 
and copies them to a temporary staging storage. This process is called [**input mapping**](/transformations/mappings/). 
The transformation job then runs the transformation script operating on the staging storage.
When the transformation is finished, the **output mapping** process moves the transformation results back to
the designated tables in Storage. The **input** and **output** mappings ensure complete safety of
the transformation processes -- the transformation always operates in an isolated workspace.

## Mapping
[**Input and output mapping**](/transformations/mappings/) --- separates the source data from your transformation. 
Mapping creates a secure staging area with data copied from the [Storage tables](/storage/tables/) specified in the 
input mappings. Database table names and CSV file names in transformations are completely unrelated to names of tables 
in Storage. This means, for example, that you can rename tables in storage and it won't break any of your transformations.

{: .image-popup}
![Simple input and output mapping](/transformations/mappings.png)

There are a number of staging options that influence the transformation script code, too. 
Typically, you will create an SQL transformation that works with data in a Snowflake database, or a Python script 
that works with CSV files on a "local" disk (local from the perspective of the script). But it is possible to have 
a Python script that works with data in a Synapse database or with data on an Azure Blob Storage (ABS).
The transformations are very flexible, though all the combinations might not be available in all projects at all times.

## Backends
The  **Transformation Script** is a code that defines what happens with the data while taking the
tables from input mapping, modifying them and producing the tables referenced in output mapping.

A backend is the engine running the transformation script. It is either a database server
([Amazon Redshift](https://aws.amazon.com/redshift/),
[Snowflake](https://www.snowflake.com/),
[Exasol](https://www.exasol.com/),
[Teradata](https://www.teradata.com/),
[Microsoft Synapse](https://azure.microsoft.com/en-us/services/synapse-analytics/) on Azure Stack), 
or a language interpreter 
([Julia](https://julialang.org/), 
[OpenRefine](https://openrefine.org/),
[Python](https://www.python.org/about/),
[R](https://www.r-project.org/about.html), 
[Spark](https://spark.apache.org/)).

How to decide **which backend is appropriate for each task**? A rule of thumb is that SQL performs better
for joining tables, filtering data, grouping and simple aggregations. Script languages are more suitable
for processing one line at a time, raw data processing or custom analytical tasks. You're free to use 
the tools that suit you best.

Each transformation within can use a different backend to perform the task
with the most suitable tool and programming language. As some tasks are difficult to solve in SQL,
feel free to step in with Python and finish the work with SQL again.

The following are the currently available backends:

- **SQL** --- [Snowflake](/transformations/snowflake-plain/) is offered as the default backend, but 
you can apply for your own [Redshift](/transformations/redshift/) cluster. You can also use 
[Microsoft Synapse](/transformations/synapse-plain/) if it is enabled for your project.
- **Script** --- [Julia](/transformations/julia/), [OpenRefine](/transformations/openrefine/), 
[Python](/transformations/python-plain/) or [R](/transformations/r/).
Choose according to your taste and available libraries.

*Note:* Switching between SQL backends requires updating the code into the corresponding SQL dialect.

## Developing Transformations
Transformation scripts are stored in [configurations](/components/#creating-component-configuration) and as such 
they share the common properties and functions. Particularly important is that all changes are automatically
[versioned](/components/#configuration-versions) and you can always [rollback](/components/#rollback-version) 
a configuration or [copy](/components/#copy-configuration) a version to a new transformation.

You can easily develop transformations using the [Workspace](/transformations/workspace/). It allows you to run 
and play with your arbitrary transformation scripts on the copies of your tables
without affecting data in your Storage, or your transformations. You can convert a workspace to a transformation 
and vice-versa.

For Redshift and Synapse, you'll get a separate database
to which the data from input mapping can be loaded. You'll obtain database credentials which you can
use with a database client of your choice. For Snowflake you can do the same. In addition, we provide access
to the [Snowflake web interface](https://docs.snowflake.com/en/user-guide/ui-using.html). Therefore you can
develop transformations without the necessity to download and install a database client.

For Julia, Python and R transformations, you can also use a workspace represented 
by an isolated [JupyterLab](https://jupyterlab.readthedocs.io/en/latest/) instance.

## Transformation Versions & Features
The current and most-used transformations are now marked as legacy, they receive important updates 
(e.g., Python, R, Julia updates) but won't receive any new features. *Legacy Transformations* will be available 
together with *New Transformations* for a long period of time to ensure smooth migration (which will start 
once all features from Legacy Transformations are available in New Transformations and there is a migration path).
New transformations are not available in all projects at the moment, therefore it's perfectly okay to use the Legacy 
Transformations for day-to-day work.

Some features of legacy transformations are not yet available in new transformations and some features will 
never be available in new transformations. The following table shows the feature status as of **October 2020**.
New transformations are generally available on Azure-based [stacks](/overview/#stacks).

<table>
<tr>
    <th colspan='2'>Feature</th><th>Legacy Transformations</th><th>New Transformations</th>
</tr>
<tr>
    <th rowspan='12'>Backend</th>
    <th><a href='/transformations/julia/'>Julia Transformations</a></th> 
    <td>✓</td>
    <td>Planned</td>
</tr>
<tr>
    <th><a href='/transformations/openrefine/'>OpenRefine Transformations</a></th> 
    <td>✓</td>
    <td>Not available</td>
</tr>
<tr>
    <th><a href='/transformations/python-plain/'>Python Transformations</a></th> 
    <td>✓</td>
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/r/'>R Transformations</a></th> 
    <td>✓</td>
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/redshift-plain/'>Redshift Transformations</a></th> 
    <td>✓</td>
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/snowflake-plain/'>Snowflake Transformations</a></th> 
    <td>✓</td>
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/snowflake-plain/'>Snowflake Transformations Query timeout</a></th> 
    <td>900s (configurable per project via Support)</td>
    <td>7200s (configurable per transformation)</td>
</tr>
<tr>
    <th><a href='/transformations/snowflake-plain/#dynamic-backends'>Snowflake Transformations Dynamic Backend</a></th> 
    <td>Not available</td>
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/synapse-plain/'>Synapse Transformations</a></th> 
    <td>Not available</td>
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/exasol/'>Exasol Transformations</a></th> 
    <td>Not available</td>
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/teradata/'>Teradata Transformations</a></th> 
    <td>Not available</td>
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/oracle/'>Oracle Transformations</a></th> 
    <td>Not available</td>
    <td>✓</td>
</tr>
<tr>
    <th rowspan='9'>Development tools</th>
    <th>Naming</th> 
    <td><a href='/transformations/sandbox/'>Sandbox</a></td>
    <td><a href='/transformations/workspace/'>Workspace</a></td>
</tr>
<tr>
    <th>Max number</th> 
    <td>One per user and type</td>
    <td>Unconstrained</td>
</tr>
<tr>
    <th>Lifecycle</th> 
    <td>Terminates after 5 days; can be extended manually</td>
    <td>Sleeps after 1 hour of inactivity; can be resumed (if auto sleep feature is supported and enabled)</td>
</tr>
<tr>
    <th>Resume</th> 
    <td>Not available</td>
    <td>✓</td>
</tr>
<tr>
    <th>Load data</th> 
    <td>Only when starting</td>
    <td>✓</td>
</tr>
<tr>
    <th>Unload data</th> 
    <td>Not available</td>
    <td>✓</td>
</tr>
<tr>
    <th>IDE</th> 
    <td>Jupyer Notebook or RStudio</td>
    <td>JupyterLab</td>
</tr>
<tr>
    <th>MLflow support</th> 
    <td>Not available</td>
    <td>Preview</td>
</tr>
<tr>
    <th>Spark support</th> 
    <td>Not available</td>
    <td>Preview</td>
</tr>
<tr>
    <th rowspan='9'>Other features</th>
    <th>Transformations buckets</th> 
    <td>✓</td>
    <td>Not available</td>
</tr>
<tr>
    <th>Versioning</th> 
    <td>Limited</td>
    <td>✓</td>
</tr>
<tr>
    <th>Copying</th> 
    <td>Limited</td>
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/#phases'>Phases</a></th> 
    <td>✓</td>
    <td>Not available</td>
</tr>
<tr>
    <th><a href='/transformations/#dependencies'>Dependencies</a></th> 
    <td>✓</td>
    <td>Not available</td>
</tr>
<tr>
    <th><a href='https://developers.keboola.com/integrate/storage/api/configurations/'>API Interface</a></th> 
    <td>Non-standard</td>
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/variables/#shared-code'>Shared code</a></th> 
    <td>Not available</td>
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/variables/#variables'>Variables</a></th> 
    <td>Not available</td>
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/code-patterns'>Code patterns</a></th> 
    <td>Not available</td>
    <td>✓</td>
</tr>
</table>

#### Which Version Am I Using?
In the transformation overview, if you are seeing workspaces and shared code, you're using *new transformations*:

{: .image-popup}
![New Transformations Overview](/transformations/new-transformations-1.png)

In the transformation detail, if you're seeing variables and shared code, you're using *new transformations*:

{: .image-popup}
![New Transformations Detail](/transformations/new-transformations-2.png)

In the transformation detail, if you're seeing buckets and sandboxes, you're using *legacy transformations*:

{: .image-popup}
![Legacy Transformations Overview](/transformations/legacy-transformations-1.png)

In the transformation detail, if you're seeing dependent transformations, phases and sandbox you're using 
*legacy transformations*:

{: .image-popup}
![Legacy Transformations Overview](/transformations/legacy-transformations-2.png)

### New Transformations
New transformations behave like any other [component](/components/). This means that they use the 
standard [API](https://developers.keboola.com/integrate/storage/api/configurations/) to manipulate
and run configurations and that it is possible to create your own 
[transformation components](https://developers.keboola.com/extend/component/).

New transformations support [sharing pieces of code](/transformations/variables/#shared-code), 
encouraging users to create reusable blocks of code. They also support 
[Variables](/transformations/variables/#variables) that can be used to parametrize transformations.

Apart from that, new transformations come with [Workspaces](/transformations/workspace/) (previously named Sandboxes)
which have many new features -- such as loading and unloading data with a running workspace, 
resuming the workspace, Spark and MLflow support.

#### Writing Scripts
The transformation script can be organized into pieces that we call **code**, and these can be
further organized into **blocks**. This allows you to somehow structure lengthy scripts.
The structure provides **no executional isolation** --- all code pieces execute sequentially
in the same context in a top-down left-to-right direction. You can assign custom names to 
individual blocks and code pieces. You can reorder both the code elements and blocks by dragging them:

{: .image-popup}
![Code](/transformations/code.png)

The above setup therefore executes: Company, Contact, Employee, Opportunity & Auxiliary, Activities, 
Opportunity & Contact as if it were a single script (SQL in this case). Splitting the code into
scripts is in no way required, you can put your whole script in a single block and code. 

#### Autocompletion

{: .image-popup}
![Autocompletion](/transformations/autocompletion.png)

To improve code editing we support autocompletion in the editor.

Currently, it supports autocompletion of:

- Language specific reserved words
- `SELECT`, `UPDATE`, etc. in SQL transformations
- `import`, `while`, etc. in Python transformations
- Tables you added to input mapping or output mapping
- When working with Python or R transformations, a relative path will be suggested (e.g., `in/tables/cars.csv`).
- Variables you defined in your transformation (also with values)

To trigger autocompletion, use `Ctrl+Space` or `Option+Space` as you would in your favourite IDE/editor.

When triggered

- after typing `"`, it will suggest available tables.
- after typing `{% raw %}{{{% endraw %}`, it will suggest available variables.
- in other cases, it will suggest everything (see the screenshot above).

### Legacy Transformations
Legacy transformations are the current version of transformations available in most projects
in the US and EU stacks. Each transformation bucket can contain any number of individual transformations.
It should represent a logical set of operations you want to perform together.

Though marked as legacy, they are perfectly okay to be used for daily work, since they still receive updates, 
just no new features. Legacy transformations are grouped into folders called **transformation buckets**.

If you want to maintain the best forward compatibility, we recommend not to make complicated structures of phases 
and dependencies.

#### Phases
Phases in older projects allow multiple transformation steps to be run within a single workspace.
Multiple steps with the same input mapping (sharing data) might save a bit of processing time, but ultimately,
everything is less clear and isolated. To save time, run multiple orchestration tasks in parallel instead.

#### Dependencies
Dependencies allow you to chain transformation steps in older projects. A given transformation is executed after all 
required steps have been executed.

## Read-only Input mapping

With Read-only input-mapping feature you can access all buckets (your own or linked) in transformations. Your transformation user
has read only access on buckets (and their tables) so you can access such data. So there is no need to specify standard input mapping 
for your transformations. Name of backend object (database, schema...) depends on the backend you use, and it contains bucket ID (not bucket name). 
