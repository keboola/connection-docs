---
title: 'Create a Workspace'
slug: 'workspace/create'
description: 'Create a workspace — an isolated environment with a copy of your production data — to develop and test transformation code safely.'
redirect_from:
  - /tutorial/manipulate/workspace/
  - /getting-started/transform/workspace/
---

An integral aspect of creating a transformation is the development of the script itself.
In Keboola, you can use SQL, Python, or R by default. To simplify the process of writing these
scripts, we offer **workspaces** — a secure development and analytical environment where you can
interact with the data and develop your scripts with confidence. This page walks through creating
one; [Workspaces](/workspace/) covers what they are and how they behave in full.

1. Navigate to **Workspaces** and click the **Create Workspace** button.

![Create Workspace](/workspace/create/workspaces1.png)

2. Select Snowflake SQL Workspace (or other SQL workspace depending on your project’s backend)

![Select a Workspace](/workspace/create/workspaces2.png)

3. Enter a *Name* and an optional *Description*. **Share with all project users** decides whether
colleagues can open the workspace too — leave it off for a personal playground. Click
**Create Workspace**.

![Name the Workspace](/workspace/create/workspaces3.png)

4. A creation job runs, and the workspace appears in the list with an **Active** badge.

![Creating Job](/workspace/create/workspaces4.png)

5. Click the workspace name to open its detail.

![Access Details of the Job](/workspace/create/workspaces5.png)

   The banner at the top says **Read-Only Access to all project data is granted for this
   workspace** — you can query every table in Storage straight away, with nothing to load first.
   That is why **Load data** and **Unload data** in the right-hand menu are greyed out: they exist
   for the other way of working, where you clone selected tables into the workspace and refresh
   them yourself. **Workspace Parameters** records what you got — the backend, the backend size,
   and the authentication type.

![Workspace detail](/workspace/create/workspaces6.png)

6. Click **Open SQL Editor** to query the data right in the browser. The editor lists every bucket
   under **Storage Explorer**, and the result appears below the code block.

![The SQL editor](/workspace/create/workspaces7.png)

   To use your own tools instead, follow **Set up SQL client connection** in the top banner — it
   hands you a JDBC URL for DBeaver, DataGrip or VS Code through the open-source
   [Keboola JDBC driver](/workspace/jdbc-driver/).


After completing the development of your queries, you can then copy and paste them into a
[transformation](/transformations/) configuration — which is exactly what
[Transform Data](/getting-started/transform/) does by hand in the Getting Started arc.

## Going further

- [Workspaces](/workspace/) — lifecycle, loading and unloading data, read-only input mapping.
- [SQL Editor](/workspace/sql-editor/) — query Storage without creating a workspace at all.
- [Keboola JDBC Driver](/workspace/jdbc-driver/) — connect your own IDE to a workspace.
