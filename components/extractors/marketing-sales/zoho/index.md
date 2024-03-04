---
title: Zoho
permalink: /components/extractors/marketing-sales/zoho/
---

* TOC
{:toc}

This data source uses the [Zoho Bulk Read APIs](https://www.zoho.com/crm/developer/docs/api/v2/bulk-read/overview.html) to extract data from Zoho CRM modules.

## Supported Endpoints
The supported endpoints are:

- `crm/bulk/v2/read`
- `crm/bulk/v2/read/{job_id}`
- `crm/bulk/v2/read/{job_id}/result`

If you need additional endpoints, please submit your request to [ideas.keboola.com](https://ideas.keboola.com/).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Zoho** data source connector.

Click **Authorize Account** to [authorize the configuration](/components/#authorization) with access to the Ad Account you want to extract. Then, select 
a [data center](https://help.zoho.com/portal/en/kb/commerce/user-guide/getting-started-with-zoho-commerce/articles/data-centers) of your Zoho instance during the authorization process.

Once done, you must enter the **account's user email address (`user_email`)** you used to generate the Self Client.

### Creating a New Report
To create a new report to download, click **Add Row**. 
Each report you download will be a [configuration row](https://help.keboola.com/components/#configuration-rows).

After that, set up the **Module records download configuration (`module_records_download_config`)**. This step is required.  
Then, set up the job configuration:
  - **Module name (`module_name`)** – The API name of the Zoho CRM module you want to extract records from *[required]*. 
  - **Field names (`field_names`)** – API names of the module record fields you want to extract. Leave it empty if you want to download all available fields *[optional]*. 

### Sync Options
Next, select one of the **Sync Options (`sync_options`)**. This step is required. There are three modes available: 
- Full Sync
- Incremental Sync
- Advanced Sync that allows you to set up custom filtering

The **Filtering criteria (`filtering_criteria`)** enable you to filter the downloaded records using their fields' values. There is a single filtering criterion and a filtering criteria group. 
This can be left empty as this step is optional.

- *Single filtering criterion:*
    - **Field name (`field_name`)** – The API name of the field you want to filter by *[required]*. 
    - **Operator (`operator`)** – The operator you want to use to filter the field *[required]*. 
    - **Value (`value`)** – The value you want to use to filter the field. Datetimes must always contain time zone information *[required]*. 
- *Filtering criteria group:*
    - **Group (`group`)** – List of simple filtering criteria (see above) *[required]*. 
    - **Group operator (`group_operator`)** – The operator you want to use to combine the filtering criteria; `and` / `or` *[required]*.

### Destination
Finally, fill in the **Destination settings** to determine what happens in Keboola Storage *[required]*.

- **Output table name (`output_table_name`)** – The name of the table that should be created or updated in Keboola Storage. The default is `module_name` *[optional]*.
- **Load mode (`load_mode`)** –  If full load is used, the destination table will be overwritten every run. If incremental load is used, data will be upserted into the destination table *[required]*.

Once everything is configured, click **Save** and run the configuration.

## Output
All output tables contain the `Id` column containing the record's unique ID. It is always used as the output table's primary key in Keboola Storage. 
Other fields depend on the module from which you extract the records and the field names specified in the configuration.
