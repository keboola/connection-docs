---
title: Transformations
permalink: /transformations/
redirect_from:
    - /manipulation/transformations/
---

* TOC
{:toc}

*Go to our [Getting Started tutorial](/tutorial/manipulate/) to create your first transformation and learn how transformations 
are an integral part of the Keboola workflow.*

**Transformations** allow you to manipulate data in your project. They are the tasks you want to perform
(marketing data preaggregation, Tableau denormalizer, integrity checker, joining marketing channels
and sales, etc.). 

In Keboola, all transformations operate on a copy of the data from Storage
in a safe and isolated environment. This improves the safety, repeatability, and traceability of all data operations.
The process of isolating data is called [**mapping**](/transformations/mappings/).
The mapping process copies input data from permanent project Storage into a 
[**staging**](/transformations/mappings/#table-input-mapping) area, representing ephemeral Storage to run the transformation **script**.
A transformation [**backend**](/transformations/#backends) executes the transformation script. To ease the [development](/transformations/#developing-transformations) 
of the transformation script, all transformations are **automatically versioned**, and you can use a **workspace**
that provides a copy of the environment and can be run interactively.

## Overview
The schema below shows a high-level overview of transformations:

{: .image-popup}
![Transformations schema](/transformations/transformations-schema.svg)

A transformation is represented by a **transformation script** (SQL, Julia, Python, R), which you
can use to manipulate your data. To ensure the safety of the data in Storage, a transformation
operates in a separate **staging Storage** created for each transformation. 

When a transformation [job](/management/jobs/) runs, it takes the required data from the project [Storage](/storage/tables/) 
and copies them to a temporary staging Storage. This process is called [**input mapping**](/transformations/mappings/). 
The transformation job then runs the transformation script operating on the staging storage.

When the transformation is finished, the **output mapping** process moves the transformation results back to
the designated tables in Storage. The **input** and **output** mappings ensure complete safety of
the transformation processes -- the transformation always operates in an isolated workspace.

## Mapping
[**Input and output mapping**](/transformations/mappings/) --- separates the source data from your transformation. 
Mapping creates a secure staging area with data copied from the [Storage tables](/storage/tables/) specified in the 
input mappings. Database table names and CSV file names in transformations are completely unrelated to names of tables 
in Storage. This means, for example, that you can rename tables in Storage without breaking any of your transformations.

{: .image-popup}
![Simple input and output mapping](/transformations/mappings.png)

There are a number of staging options that influence the transformation script code, too. 
Typically, you will create an SQL transformation that works with data in a Snowflake database or a Python script 
that works with CSV files on a "local" disk (local from the script's perspective). However, it is possible to have 
a Python script that works with data in a Synapse database or with data on Azure Blob Storage (ABS).
The transformations are very flexible, though all the combinations might not be available in all projects at all times.

## Backends
The  **Transformation Script** is code that defines what happens with the data when the
tables from the input mapping are taken, modified, and produced into the tables referenced in the output mapping.

A backend is the engine running the transformation script. It is a database server
([Amazon Redshift](https://aws.amazon.com/redshift/),
[Snowflake](https://www.snowflake.com/),
[Exasol](https://www.exasol.com/),
[Teradata](https://www.teradata.com/),
[Microsoft Synapse](https://azure.microsoft.com/en-us/services/synapse-analytics/) on Azure Stack), 
[BigQuery](https://cloud.google.com/bigquery), 
or a language interpreter 
([Julia](https://julialang.org/), 
[Python](https://www.python.org/about/),
[R](https://www.r-project.org/about.html).

How do you decide **which backend is appropriate for each task**? A rule of thumb is that SQL performs better
for joining tables, filtering data, grouping, and simple aggregations. Script languages are more suitable
for processing one line at a time, raw data processing, or custom analytical tasks. You're free to use 
the tools that suit you best.

Each transformation within can use a different backend to perform the task
with the most suitable tool and programming language. As some tasks are difficult to solve in SQL,
feel free to step in with Python and finish the work with SQL again.

The following are the currently available backends:

- **SQL** --- [Snowflake](/transformations/snowflake-plain/) is offered as the default backend, but 
you can apply for your own [Redshift](/transformations/redshift/) cluster. You can also use 
[Microsoft Synapse](/transformations/synapse-plain/), or [Google BigQuery](/transformations/bigquery/) if it is enabled for your project.
- **Script** --- [Julia](/transformations/julia/),
[Python](/transformations/python-plain/), or [R](/transformations/r-plain/).
Choose according to your taste and available libraries.

***Note:** Switching between SQL backends requires updating the code into the corresponding SQL dialect.*

## Developing Transformations
Transformation scripts are stored in [configurations](/components/#creating-component-configuration), and as such, 
they share common properties and functions. Particularly important is that all changes are automatically
[versioned](/components/#configuration-versions), and you can always [roll back](/components/#rollback-version) 
a configuration or [copy](/components/#copy-configuration) a version to a new transformation.

You can easily develop transformations using the [workspace](/transformations/workspace/). It allows you to run 
and play with your arbitrary transformation scripts on copies of your tables
without affecting data in your Storage or your transformations. You can convert a workspace to a transformation 
and vice versa.

For Redshift and Synapse, you'll get a separate database
to which the data from input mapping can be loaded. You'll obtain database credentials, which you can
use with a database client of your choice. You can do the same for Snowflake. In addition, we provide access
to the [Snowflake web interface](https://docs.snowflake.com/en/user-guide/ui-using.html). Therefore, you can
develop transformations without downloading and installing a database client.

You can also use a workspace represented by an isolated [JupyterLab](https://jupyterlab.readthedocs.io/en/latest/) instance for Julia, 
Python, and R transformations.

## Transformations Features

<table>
<tr>
    <th colspan='2'>Feature</th>
    <th>Availability/Limitations</th>
</tr>
<tr>
    <th rowspan='8'>Backend</th>
    <th>Julia Transformations</th> 
    <td>Planned</td>
</tr>
<tr>
    <th><a href='/transformations/python-plain/'>Python Transformations</a></th> 
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/r-plain/'>R Transformations</a></th> 
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/snowflake-plain/'>Snowflake Transformations</a></th> 
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/bigquery/'>Google BigQuery</a></th> 
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/snowflake-plain/'>Snowflake Transformations Query timeout</a></th> 
    <td>7200s (configurable per transformation)</td>
</tr>
    <tr>
    <th><a href='/transformations/snowflake-plain/#dynamic-backends'>Snowflake Transformations Dynamic Backend</a></th> 
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/oracle/'>Oracle Transformations</a></th> 
    <td>✓</td>
</tr>
<tr>
    <th rowspan='7'>Development tools</th>
    <th>Naming</th> 
    <td><a href='/transformations/workspace/'>Workspace</a></td>
</tr>
<tr>
    <th>Max number</th> 
    <td>Unconstrained</td>
</tr>
<tr>
    <th>Lifecycle</th> 
    <td>Sleeps after 1 hour of inactivity; can be resumed (if the auto-sleep feature is supported and enabled)</td>
</tr>
<tr>
    <th>Resume</th> 
    <td>✓</td>
</tr>
<tr>
    <th>Load data</th> 
    <td>✓</td>
</tr>
<tr>
    <th>Unload data</th> 
    <td>✓</td>
</tr>
<tr>
    <th>IDE</th> 
    <td>JupyterLab</td>
</tr>

<tr>
    <th rowspan='9'>Other features</th>
    <td>✓</td>
    <td>Not available</td>
</tr>
<tr>
    <th>Versioning</th> 
    <td>✓</td>
</tr>
<tr>
    <th>Copying</th> 
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/#phases'>Phases</a></th> 
    <td>Not available</td>
</tr>
<tr>
    <th><a href='/transformations/#dependencies'>Dependencies</a></th> 
    <td>Not available</td>
</tr>
<tr>
    <th><a href='https://developers.keboola.com/integrate/storage/api/configurations/'>API Interface</a></th> 
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/variables/#shared-code'>Shared code</a></th> 
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/variables/#variables'>Variables</a></th> 
    <td>✓</td>
</tr>
<tr>
    <th><a href='/transformations/code-patterns'>Code patterns</a></th> 
    <td>✓</td>
</tr>
</table>

### Transformations

Transformations behave like any other [component](/components/). This means that they use the 
standard [API](https://developers.keboola.com/integrate/storage/api/configurations/) to manipulate
and run configurations and that creating your own 
[transformation components](https://developers.keboola.com/extend/component/) is possible.

Transformations support [sharing pieces of code](/transformations/variables/#shared-code), 
encouraging users to create reusable blocks of code. They also support 
[variables](/transformations/variables/#variables) that can be used to parametrize transformations.

Apart from that, transformations come with [workspaces](/transformations/workspace/) (previously named Sandboxes),
which have many new features, such as loading and unloading data with a running workspace or resuming the workspace.

#### Writing Scripts

The transformation script can be organized into pieces that we call **code**, and these can be
further organized into **blocks**. This allows you to somehow structure lengthy scripts.
The structure provides **no executional isolation** --- all code pieces execute sequentially
in the same context in a top-down left-to-right direction. You can assign custom names to 
individual blocks and code pieces. You can reorder both the code elements and blocks by dragging them:

{: .image-popup}
![Code](/transformations/code.png)

The above setup, therefore, executes Company, Contact, Employee, Opportunity & Auxiliary, Activities, 
Opportunity & Contact as if it were a single script (SQL in this case). Splitting the code into
scripts is in no way required. You can put your whole script in a single block and code. 

#### Autocompletion

{: .image-popup}
![Autocompletion](/transformations/autocompletion.png)

To improve code editing, we support autocompletion in the editor.

Currently, it supports autocompletion of:

- Language-specific reserved words
- `SELECT`, `UPDATE`, etc., in SQL transformations
- `import`, `while`, etc., in Python transformations
- Tables you added to input mapping or output mapping
- When working with Python or R transformations, a relative path will be suggested (e.g., `in/tables/cars.csv`).
- Variables you defined in your transformation (also with values)

To trigger autocompletion, use `Ctrl+Space` or `Option+Space` as you would in your favorite IDE/editor.

When triggered

- after typing `"`, it will suggest available tables.
- after typing `{% raw %}{{{% endraw %}`, it will suggest available variables.
- in other cases, it will suggest everything (see the screenshot above).

## Read-Only Input Mapping

With the [read-only input mapping](/transformations/mappings/#read-only-input-mapping) feature, you can access all buckets (your own or linked) in transformations. Your transformation user
has read-only access to buckets (and their tables), so you can access such data. So, there is no need to specify standard input mapping 
for your transformations. The name of the backend object (database, schema, etc.) depends on the backend you use, and it contains the bucket ID (not the bucket name). 
