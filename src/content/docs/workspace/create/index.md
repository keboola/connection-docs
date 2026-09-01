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

3. Enter a *Name* and a *Description*. Additionally, take note that you can grant access to the workspace, allowing other users to collaborate with you.
Click **Create Workspace**.

![Name the Workspace](/workspace/create/workspaces3.png)

4. A creation job will initiate, and your workspace will soon appear among the configurations.

![Creating Job](/workspace/create/workspaces4.png)

5. Click the workspace name to access the details.

![Access Details of the Job](/workspace/create/workspaces5.png)

   At the outset, you'll need to configure the **table input mapping**, much like we did when setting up a transformation. 
   Subsequently, click **Load Data** to clone the datasets from Storage to your workspace. The data will be cloned to your workspace 
   in a state as of the moment of loading. To refresh the data in a Workspace, you need to click **Load Data** again. 
   
   If you wish to have read access to all data in your Storage without physically cloning it into the workspace, 
   check the *Grant read-only access to all storage data* option when creating a workspace. However, this is a feature we do not cover here.

![Set Input Mapping](/workspace/create/workspaces6.png)

6. Click **Connect**. You'll see the credentials you can use to connect to the workspace using any of your preferred IDEs. Alternatively,
click the **Connect** button again to access the Web-based Snowflake SQL IDE (please note that this only applies if your project uses a Snowflake backend).

![Connect](/workspace/create/workspaces7.png)


After completing the development of your queries, you can then copy and paste them into a
[transformation](/transformations/) configuration — which is exactly what
[Transform Data](/getting-started/transform/) does by hand in the Getting Started arc.

## Going further

- [Workspaces](/workspace/) — lifecycle, loading and unloading data, read-only input mapping.
- [SQL Editor](/workspace/sql-editor/) — query Storage without creating a workspace at all.
- [Keboola JDBC Driver](/workspace/jdbc-driver/) — connect your own IDE to a workspace.
