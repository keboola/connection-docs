---
title: Processors
slug: 'extend/component/processors'
redirect_from:
    - /integrate/docker-runner/processors/
    - /extend/docker-runner/processors/
---


Processors are additional components which may be used **before or after** running an arbitrary component
(extractor, writer, etc.). 

When [Job Queue](/extend/job-queue/) runs a Docker image (a container is created), a processor
may be used to **pre-process the inputs** (files or tables) supplied to that container, or it may be used to **post-process
the container outputs**. For example, if an extractor extracts CSV data in a non-UTF8 encoding, you can use the
[`iconv` processor](https://github.com/keboola/processor-iconv/blob/master/README.md) as a post-processor to
convert the CSV to UTF-8 as expected by [Storage](/storage/). See the
[tutorial](/extend/component/tutorial/configuration/) for a quick example of using processors.

Processors are technically supported in any configuration of any component. However, as an **advanced feature**, they have little to no 
[support in the UI](/extend/component/ui-options/#genericdockerui-processors). To manually configure processors, 
you have to use the [Component Configuration API](https://api.keboola.com/?service=storage#tag--Component-Configurations).
See the respective part of our [documentation](/integrate/storage/api/configurations/) for
examples of working with the [Component Configuration API](/integrate/storage/api/configurations/).
If you want to implement your own processor, see our [implementation notes](/extend/component/implementation/#implementing-processors).

If the component does not contain the [respective configuration field](/extend/component/ui-options/#genericdockerui-processors) or
an [advanced configuration mode](/extractors/other/aws-s3/#advanced), processors are
completely **invisible in the UI**. In such case, modifying the configuration through the UI may delete the processor configuration
(though you can always [rollback](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-/versions/-versionId-/rollback)).
Therefore be sure to add an **appropriate warning** to the configuration description.

## Configuration
By running the
[Get Configuration Detail](https://api.keboola.com/?service=storage#get-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-)
request for a specific component ID and configuration ID, you obtain the actual configuration contents.
You can see [an example request](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb)
for getting a configuration with ID `365111648` for the component called Email Attachments extractor (ID `keboola.ex-email-attachments`):

```json
{
    "id": "365111648",
    "name": "Processor test",
    "description": "",
    "created": "2018-03-10T08:13:08+0100",
    "creatorToken": {
        "id": 27865,
        "description": "ondrej.popelka@keboola.com"
    },
    "version": 3,
    "changeDescription": "Update name",
    "isDeleted": false,
    "configuration": {
        "parameters": {
            "email": "572-365111648-5aa3858e91ed1@import.keboola.com",
            "delimiter": ",",
            "enclosure": "\"",
            "primaryKey": [],
            "incremental": false
        }
    },
    "rowsSortOrder": [],
    "rows": [],
    "state": {
        "lastDownloadedFileTimestamp": "1520666119"
    },
    "currentVersion": {
        "created": "2018-03-10T08:16:54+0100",
        "creatorToken": {
            "id": 27865,
            "description": "ondrej.popelka@keboola.com"
        },
        "changeDescription": "Update name"
    }
}
```

From this, the actual configuration is the **contents** of the `configuration` node. Therefore:

```json
{
    "parameters": {
        "email": "572-365111648-5aa3858e91ed1@import.keboola.com",
        "delimiter": ",",
        "enclosure": "\"",
        "primaryKey": [],
        "incremental": false
    }
}
```

## Adding Processor
Processors are configured in the `processors` section in the `before` array or the `after` array (rarely both).
For example, you might want to configure the [`processor-skip-lines`](https://github.com/keboola/processor-skip-lines):

```json
{
    "parameters": {
        "email": "572-365111648-5aa3858e91ed1@import.keboola.com",
        "delimiter": ",",
        "enclosure": "\"",
        "primaryKey": [],
        "incremental": false
    },
    "processors": {
        "after": [
            {
                "definition": {
                    "component": "keboola.processor-skip-lines"
                },
                "parameters": {
                    "lines": 1,
                    "direction_from": "top"
                }
            }
        ]
    }
}
```

The configuration parameters of a processor are always described in [its documentation](https://github.com/keboola/processor-skip-lines).
The above configuration defines that a `keboola.processor-skip-lines` (which removes a certain number of lines from the file)
will run **after** this particular configuration of the Email Attachment extractor is finished,
but **before** its results are loaded into Storage. When the processor is finished, its outputs are loaded
into Storage as if they were the outputs of the extractor itself.

### Specifying Processor Version

You can specify a particular version of the processor by adding an optional `tag` parameter in the `definition`. This parameter allows you to select a specific version:

```json
{
    "definition": {
        "component": "keboola.processor-skip-lines",
        "tag": "1.0.0"
    }
}
```

If the tag parameter is omitted, the processor will automatically use the latest released version.

To save the configuration, use the [Update Configuration API call](https://api.keboola.com/?service=storage#put-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-).
When updating the configuration, you must provide `componentId`, `configurationId`, and the actual contents of
the configuration in the `configuration` form field. Make sure to supply only the **contents** of the `configuration`
node and to properly escape the form data.

See our [configuration documentation](/integrate/storage/api/configurations/#modifying-a-configuration) for
a more thorough description and the *Add processor to Email Attachments Extractor Configuration* example
in our [collection](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb).
Remember, the processors can be [chained](/extend/component/tutorial/processors/#chaining-processors) to
achieve more advanced processing.

### Available Processors
You can obtain a list of available processors using the
[Developer Portal UI](https://components.keboola.com/components) or the [List Components Public API](https://api.keboola.com/?service=developer-portal#get-/apps)
of the Developer Portal. The important parts are `id`, which is required for configuration,
and `documentationUrl`, which describes additional parameters of the processor.

### Configuring Parameters
A processor may allow (or require) parameters. These are entered in the `parameters` section.
The below configuration sets values for two parameters --- `lines` and `direction_from`:

```json
{
    "processors": {
        "after": [
            {
                "definition": {
                    "component": "keboola.processor-skip-lines"
                },
                "parameters": {
                    "lines": 1,
                    "direction_from": "top"
                }
            }
        ]
    }
}
```

The names and allowed values of the parameters are fully up to the processor interpretation and validation
and are described in the respective processor documentation.

### Using Processors with Configuration Rows
If the configuration uses [Configuration Rows](/integrate/storage/api/configurations/#configuration-rows),
you have to use the [Update Configuration Row](https://api.keboola.com/?service=storage#put-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-/rows/-rowId-)
API call to set the processors.

Provide `componentId`, `configurationId`, `rowId` and the contents of the configuration in
the same manner as when [adding a processor to configuration](#adding-a-processor).

See an example *Add processor to S3 Extractor configuration Row* in
[our collection](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb).
It shows how to set a processor for the configuration row with ID `364481153` in configuration `364479526` of
the AWS S3 extractor (component ID `keboola.ex-aws-s3`). The configuration is the following:

```json
{
    "parameters": {
        "bucket": "travis-php-db-import-tests-s3filesbucket-vm9zhtm5jd7s",
        "key": "tw_accounts.csv",
        "saveAs": "first-table",
        "includeSubfolders": false,
        "newFilesOnly": true
    },
    "processors": {
        "after": [
            {
                "definition": {
                    "component": "keboola.processor-skip-lines"
                },
                "parameters": {
                    "lines": 1
                }
            }
        ]
    }
}
```

## Chaining Processors
Remember, processors can be [chained](/extend/component/tutorial/processors/#chaining-processors) and therefore
should be as simple as possible. For example, a processor reading tables in CSV should assume that these are
available in the [standard format](/storage/tables/csv-files/#output-csv-format) and that the
table manifests are available.

### Extractor Example
For example, assume that you have a component which extracts the following data:

    Dump from ACME Anvil CRM
    SLA: 24h
    Day|AnvilsDelivered
    2050-12-10|100|5|4|4
    2050-12-11|56|1|2
    2050-12-12|131|9|7|3

First apply the [processor-skip-lines](https://github.com/keboola/processor-skip-lines) to obtain something
resembling a CSV file:

    Day|AnvilsDelivered
    2050-12-10|100|5|4|4
    2050-12-11|56|1|2
    2050-12-12|131|9|7|3

Then apply the [processor-create-manifest](https://github.com/keboola/processor-create-manifest) to
set the delimiter and enclosure in the file manifest.

After that, use the [processor-format-csv](https://github.com/keboola/processor-format-csv) to convert the file
from the format specified in the manifest to the standard format:

    "Day","AnvilsDelivered"
    "2050-12-10","100","5","4","4"
    "2050-12-11","56","1","2"
    "2050-12-12","131","9","7","3"

Finally, you can use the [processor-headers](https://github.com/keboola/processor-headers) to make the data orthogonal:

    "Day","AnvilsDelivered","col1","col2","col3"
    "2050-12-10","100","5","4","4"
    "2050-12-11","56","1","2",""
    "2050-12-12","131","9","7","3"

### Writer Example
A chain similar to the above can be used for a writer too. Assume that you need to send the following data to
the very special ACME Anvil CRM:

    Import: CRM
    ImportFormat: AnvilPSV
    Date: 2018-10-01
    Type: MANF-DLVR-PLAN

    Day|AnvilManufacturingPlan|AnvilDeliveryPlan
    2050-12-10|100|533
    2050-12-11|100|695
    2050-12-12|100|923

The data exported from Storage will be in the following format:

    "Day","AnvilManufacturingPlan","AnvilDeliveryPlan"
    "2050-12-10","100","533"
    "2050-12-11","100","695"
    "2050-12-12","100","923"

Then apply the [processor-format-csv](https://github.com/keboola/processor-format-csv) to convert the file
from the standard format to the format required by the Anvil CRM writer:

    Day|AnvilManufacturingPlan|AnvilDeliveryPlan
    2050-12-10|100|533
    2050-12-11|100|695
    2050-12-12|100|923

Create a custom processor to put the header in:

    Import: CRM
    ImportFormat: AnvilPSV
    Date: 2018-10-01
    Type: MANF-DLVR-PLAN

    Day|AnvilManufacturingPlan|AnvilDeliveryPlan
    2050-12-10|100|533
    2050-12-11|100|695
    2050-12-12|100|923

Finally, the Anvil CRM writer can send the result to the CRM system. Or you can have the header function be part of the
writer itself. That decision should be made depending on whether the header must always be present (part of the writer) or is optional (processor).
