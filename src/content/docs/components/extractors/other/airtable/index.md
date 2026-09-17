---
title: Airtable
slug: 'components/extractors/other/airtable'
---



Airtable is an easy-to-use yet powerful database service that allows you to quickly create, organize, and collaborate on any project.

This data source connector allows you to fetch data from any Airtable base tables.

## Prerequisites

Create an Airtable PAT token:

- You can create a PAT token in the [Airtable developer hub](https://airtable.com/account). Create read-only access for the following scopes: `data.records:read` and `schema.bases:read`.
- For more information about PAT tokens, see [the documentation](https://support.airtable.com/docs/creating-and-using-api-keys-and-access-tokens).

![Screenshot - Authorization](/components/extractors/other/airtable/pat.png)

## Configuration Guide

1. [Create a new configuration](/components/#creating-component-configuration) of the Airtable data source.
2. In the authorization section, enter the obtained PAT token. See the [Prerequisites](#prerequisites) section.
3. Create a new configuration row.
4. Select a **Base ID**. To reload available bases, click the **Reload Available Base IDs** button.
5. Select the **Table** you wish to sync. To reload available tables for the selected base, click the **Reload Available Tables** button.
6. Optionally, enable **Use View** to extract data from a specific Airtable view instead of the entire table. When checked, select the desired **View Name** from the dropdown.
7. Optionally, select a subset of **Fields** you wish to sync. If left empty, all fields are downloaded. Note: when using a view, even hidden fields will be retrieved.
8. Configure the **Sync Options**:
    - **Sync Mode** -- choose `Full Sync` (downloads all data every run) or `Incremental Sync` (downloads data created or updated in the specified time range using `CREATED_TIME()` or `LAST_MODIFIED_TIME()` fields; see [Airtable formula field reference](https://support.airtable.com/docs/formula-field-reference)).
    - **Date From** (incremental only) -- date from which data is downloaded. Either a date in `YYYY-MM-DD` format or a dateparser string (e.g., `5 days ago`, `1 month ago`, `yesterday`). You can also use `last run` to fetch data from the last component run. Default: `last run`.
    - **Date To** (incremental only) -- date to which data is downloaded. Either a date in `YYYY-MM-DD` format or a dateparser string (e.g., `5 days ago`, `now`). Default: `now`.
9. Configure the **Destination** section:
    1. Optionally, set the resulting **Storage Table Name**. If left empty, the name of the source table will be automatically used.
    2. Select **Load Type**. If full load is used, the destination table will be overwritten with every run. If incremental load is used, data will be upserted into the destination table.

![Screenshot - Row](/components/extractors/other/airtable/config_row.png)

## Output

The output of every configuration row is always a single table in Keboola storage. If you specify a storage table name in the Destination configuration section, this name will be used; otherwise, a default name is generated based on the source table. 

The output for each configuration row will consist of the main table being extracted, and, in some cases, of child tables created from certain fields of the main table.

The various field types will be parsed in the following manner:

- If the field is a list of objects, it will be omitted from the main table, and instead a row for each such object will be created in a child table named `{table_name}__{field_name}`.
- If the field is a list of simple values, it will be represented as a JSON string in the output table, e.g., `["a", "b"]`.
- If the field is an object, it will be flattened into its table as columns named `{table_field_name}_{object_key}`.


