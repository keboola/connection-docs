---
title: Using a Workspace
permalink: /tutorial/manipulate/workspace/
---

An integral aspect of creating a transformation is the development of the script itself. 
In Keboola, you can use SQL, Python, or R by default. To simplify the process of writing these scripts, 
we offer **workspaces** (see the full documentation of [workspaces](/transformations/workspace/)). 
Workspaces provide a secure development and analytical environment 
where you can interact with the data and develop your scripts with confidence.

1. Navigate to **Workspaces** and click the **Create Workspace** button.

   {: .image-popup}
   ![Create Workspace](/tutorial/manipulate/workspaces1.png)

2. Select Snowflake SQL Workspace (or other SQL workspace depending on your project’s backend)

   {: .image-popup}
   ![Select a Workspace](/tutorial/manipulate/workspaces2.png)

3. Enter a *Name* and a *Description*. Additionally, take note that you can grant access to the workspace, allowing other users to collaborate with you.
Click **Create Workspace**.

   {: .image-popup}
   ![Name the Workspace](/tutorial/manipulate/workspaces3.png)

4. A creation job will initiate, and your workspace will soon appear among the configurations.

   {: .image-popup}
   ![Creating Job](/tutorial/manipulate/workspaces4.png)

5. Click the workspace name to access the details.

   {: .image-popup}
   ![Access Details of the Job](/tutorial/manipulate/workspaces5.png)

   At the outset, you'll need to configure the **table input mapping**, much like we did when setting up a transformation. 
   Subsequently, click **Load Data** to clone the datasets from Storage to your workspace. The data will be cloned to your workspace 
   in a state as of the moment of loading. To refresh the data in a Workspace, you need to click **Load Data** again. 
   
   If you wish to have read access to all data in your Storage without physically cloning it into the workspace, 
   check the *Grant read-only access to all storage data* option when creating a workspace. However, this is a feature we won't delve into in this tutorial.

   {: .image-popup}
   ![Set Input Mapping](/tutorial/manipulate/workspaces6.png)

6. Click **Connect**. You'll see the credentials you can use to connect to the workspace using any of your preferred IDEs. Alternatively,
click the **Connect** button again to access the Web-based Snowflake SQL IDE (please note that this only applies if your project uses a Snowflake backend).

   {: .image-popup}
   ![Connect](/tutorial/manipulate/workspaces7.png)


After completing the development of your queries, you can then copy and paste them into a transformation configuration, 
as we did in the [previous tutorial step])/tutorial/manipulate/).

## What’s Next
Proceed to [Writing Data](/tutorial/write/) for the next step in the tutorial.

## If You Need Help
Feel free to reach out to our [support team](support@keboola.com) if there’s anything we can help with.
