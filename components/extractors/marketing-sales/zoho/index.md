---
title: Zoho
permalink: /components/extractors/marketing-sales/zoho/
---

* TOC
{:toc}

This extractor uses the [Zoho Bulk Read APIs](https://www.zoho.com/crm/developer/docs/api/v2/bulk-read/overview.html) to extract data from Zoho CRM modules.

## Supported endpoints

- `crm/bulk/v2/read`
- `crm/bulk/v2/read/{job_id}`
- `crm/bulk/v2/read/{job_id}/result`

If you need more endpoints, please submit your request to
[ideas.keboola.com](https://ideas.keboola.com/)

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Zoho** extractor.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization) with access to the Ad Account you want to extract. You will have to select a [Datacenter](https://help.zoho.com/portal/en/kb/commerce/user-guide/getting-started-with-zoho-commerce/articles/data-centers) of your Zoho instance during the Authorization process.


- **Account's user email (`user_email`)** - *[Required]*  
  User email you used to generate the Self Client.

Once the component is authorized and Account's user email is entered, click **Add Row** in order to create a new report to download. Each report you will download will be a [configuration row](https://help.keboola.com/components/#configuration-rows).

- **Module records download configuration (`module_records_download_config`)** - *[Required]*  
  Job configuration:
  - **Module name (`module_name`)** - *[Required]*  
    The API name of the Zoho CRM module you want to extract records from.
  - **Field names (`field_names`)** - *[Optional]*  
    API names of the module records' fields you want to extract. Can be left empty or omitted to download all available fields.

- **Sync Options (`sync_options`)** - *[Required]*  
  There are three modes available: Full Sync, Incremental Sync, and Advanced, where you can set up custom filtering.
  - **Filtering criteria (`filtering_criteria`)** - *[Optional]*  
    Filtering criteria enable you to filter the downloaded records using their fields' values. There is either a single filtering criterion or a filtering criteria group. Can be left empty or omitted to not apply any filtering.
    - *Case of single filtering criterion:*
      - **Field name (`field_name`)** - *[Required]*  
        The API name of the field you want to filter by.
      - **Operator (`operator`)** - *[Required]*  
        The operator you want to use to filter the field.
      - **Value (`value`)** - *[Required]*  
        The value you want to use to filter the field. Datetimes must always contain time zone information.
    - *Case of filtering criteria group:*
      - **Group (`group`)** - *[Required]*  
        List of simple filtering criteria (see above).
      - **Group operator (`group_operator`)** - *[Required]*  
        The operator you want to use to combine the filtering criteria - either `and` or `or`.

- **Destination settings** - *[Required]*  
  Is used to set Keboola Storage behavior.
  - **Output table name (`output_table_name`)** - *[Optional]*  
    The name of the table that should be created or updated in Keboola Connection storage. Defaults to Module name.
  - **Load mode (`load_mode`)** - *[Required]*  
    If Full load is used, the destination table will be overwritten every run. If incremental load is used, data will be upserted into the destination table.



Once all the settings are configured, click **Save** and run the configuration.

