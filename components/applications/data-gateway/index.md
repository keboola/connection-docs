---
title: Data Gateway
permalink: /components/applications/data-gateway/
redirect_from:
    - /applications/data-gateway/
---

* TOC
{:toc}

This application allows you to share data in read-only mode with third-party BI and visualization tools.

Data Gateway utilizes Snowflake's reader account technology, which creates a separate read-only account allowing users to directly access Snowflake tables without granting permissions to the original Snowflake database.

As the application uses Snowflake database backend, there are a couple of prerequisites to be met:

- The project must be using Snowflake database backend to support reader account creation.
- The tool accessing the data must support Snowflake as a data source.
- The tool accessing the data must support [Key-pair authentication](https://docs.snowflake.com/en/user-guide/key-pair-auth).

## Configuration

[Create a new configuration](/components/#creating-component-configuration) of the **Data Gateway** application.

The first step is to set up a reader account workspace that will be used for sharing the data by clicking the **Set Up Credentials** button.

{: .image-popup}
![Screenshot - Set Up Credentials](/components/applications/data-gateway/data-gateway-1.png)

A new key-pair is immediately generated and displayed. It is important to download the private key and keep it in a safe place as it is shown only once.

After downloading the private key, click the **Create Read-Only Workspace** button to create the reader account workspace with the generated public key.

{: .image-popup}
![Screenshot - Create Read-Only Workspace](/components/applications/data-gateway/data-gateway-2.png)

You are then presented with the credentials for the reader account workspace. You can access the credentials (excluding the private key) later on from the right side menu by clicking the **Database Credentials** menu item.

{: .image-popup}
![Screenshot - Set Up Reader Account](/components/applications/data-gateway/data-gateway-3.png)

To add data to be shared by the Data Gateway, click the **Add Table** button.

{: .image-popup}
![Screenshot - Add Table](/components/applications/data-gateway/data-gateway-4.png)

Select the table you want to add and click the **Create** button.

{: .image-popup}
![Screenshot - Add Table](/components/applications/data-gateway/data-gateway-5.png)

You'll be redirected to the table detail page. Here you can configure how the table will be shared by the Data Gateway.

- **Database table name** - the name of the table in the Snowflake database.
- **Load type** - the component supports four load types:
  - **Full Load (Clone)** - clones the entire table to the read-only workspace (including the data types).
  - **Full Load (Copy)** - replaces all existing table rows in the read-only workspace (allows changing the data types).
  - **Incremental Load** - inserts new rows into the table in the read-only workspace. If a primary key is defined on the table, the data are [upserted](https://en.wikipedia.org/wiki/Merge_(SQL)). If no primary key is defined, the data are inserted.
    - **Manual** - the data that has been added or updated in selected time period will be fetched.
    - **Automatic** - the data that has been added or updated since the last run of the component will be fetched.
- **Columns** - modifications are **not** available for **Full Load (Clone)** load type.
    - **Column Name** - the name of the column in the Snowflake database.
    - **Data Type** - the data type of the column in the Snowflake database. If [typed table](/storage/tables/data-types/) is selected, you can use only the data type defined in Storage, or set the data type to **IGNORE** to exclude the column from loading.
    - **Nullable** - whether the column is nullable.
    - **Default value** - the default value of the column.

Changes to columns need to be confirmed by clicking the **Save** button.

{: .image-popup}
![Screenshot - Add Table](/components/applications/data-gateway/data-gateway-6.png)

You can add additional tables to the Data Gateway by clicking the **Add Table** button from the main configuration page.

{: .image-popup}
![Screenshot - Add Table](/components/applications/data-gateway/data-gateway-7.png)

Alternatively, you can add all tables from existing [Snowflake Writer](/components/writers/database/snowflake/) configuration by selecting **Import Snowflake Writer Tables** tab, selecting the existing configuration from a dropdown and clicking the **Create** button.

This is especially helpful when you are migrating from Snowflake Writer to Data Gateway, as all the tables, columns and settings will be pre-filled.

{: .image-popup}
![Screenshot - Add All Tables](/components/applications/data-gateway/data-gateway-8.png)

## Load Data

To load the selected tables and columns to the read-only workspace, click the **Run Component** button on the main configuration page.

{: .image-popup}
![Screenshot - Add Table](/components/applications/data-gateway/data-gateway-9.png)

You can load data only for a selected table if you click the **Run Component** button on the table detail page.

## Clean Up Workspace

If you need to clean the workspace and remove previously loaded tables, you can do so by clicking the **Clean up workspace** menu item on the right side.

{: .image-popup}
![Screenshot - Add Table](/components/applications/data-gateway/data-gateway-10.png)

## Copy Configuration

You can copy the configuration to create a new configuration with the same settings by clicking the **Copy configuration** button on the main configuration page.

The new configuration will be created with the same settings as the original configuration and will be using the **same read-only workspace**. That means that the new configuration will we loading data into the same workspace as the original configuration. And resetting the Key Pair Authentication will affect all configurations using the same reader account workspace (all will be sharing the same credentials).

Using multiple configurations with the same reader account workspace can be useful if you want to load different data into the same workspace in different frequencies.