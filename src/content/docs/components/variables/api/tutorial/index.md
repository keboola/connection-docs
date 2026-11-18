---
title: Variables Tutorial
slug: 'components/variables/api/tutorial'
description: Walk through parametrizing a component configuration with variables end to end, using the API.
redirect_from:
    - /integrate/variables/tutorial/
    - /transformations/variables/api/tutorial/
---


This tutorial will guide you through basic usage of [Variables](/components/variables/api/) in the component configuration.
The result will be the parametrized configuration of the [Generic Extractor](/components/extractors/generic-extractor/),
but this approach can be applied to any component. 

In the examples, we use the `curl` console tool to interact with our APIs.

## Define API endpoints

First, store the [API endpoints](/overview/api/) as environment variables, so we don't have to repeat ourselves.

We will need:
- [Storage API](/storage/api/) to store the variable definitions and the extractor configuration.
- [Jobs API](/extend/jobs/#run-a-job) to run the extractor job from the configuration.

The host names depend on your [stack](/overview/api/):

```shell
export STORAGE_API_HOST="https://connection.keboola.com"
export JOB_QUEUE_HOST="https://queue.keboola.com"
```

## Obtain Storage API Token

A [Storage API Token](/management/project/tokens/) is needed to interact with the [Keboola APIs](/overview/api/).

Obtain a Storage API token from the user interface of your project, see this [Guide](/management/project/tokens). The token must be allowed to manage component configurations — a read-only token fails at the create-configuration step.

Then store the token to the environment variable.
```shell
export TOKEN="..."
```

## Define variables

The next step is to define the variables in a [Variable Configuration](/components/variables/api/#variable-configuration).

Define name and type of the variables.
```shell
export VARIABLE_CONFIG_NAME="Extractor variables"
export VARIABLE_CONFIG='
{
    "variables": [
        {
            "name": "outputBucket",
            "type": "string"
        },
        {
            "name": "id",
            "type": "int"
        }
    ]
}
'
```

Use [Create Configuration API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/components/-componentId-/configs) to store *variable configuration*.
```shell
curl --include \
     --request POST \
     --header "Content-Type: application/x-www-form-urlencoded" \
     --header "X-StorageApi-Token: $TOKEN" \
     --data-urlencode "name=$VARIABLE_CONFIG_NAME" \
     --data-urlencode "configuration=$VARIABLE_CONFIG" \
"$STORAGE_API_HOST/v2/storage/components/keboola.variables/configs"
```

Example API call result.
```json
{
  "id":"1234",
  "name":"Extractor variables",
  "description":"..."
}
```

Save *variable configuration* `id` from the result to the environment variable.
```shell
export VARIABLE_CONFIG_ID="1234"
```

**The created *variable configuration* defines the names and types of variables.**

Default values live in **configuration rows of this same variable configuration**, referenced from the
main configuration by `variables_values_id` — see [Variable Values](/components/variables/api/#variable-values).

In this example, the values of the variables are entered directly to the [run API call](#run-extractor-configuration) (see below),
so configuration with the variable values is not used.

## Create extractor configuration

Define *extractor configuration* with variables `{{placeholders}}`.

```shell

export COMPONENT_ID="ex-generic-v2"
export EXTRACTOR_CONFIG_NAME="Extractor configuration"
export EXTRACTOR_CONFIG='
{
    "parameters": {
        "api": {
            "baseUrl": "https://jsonplaceholder.typicode.com/"
        },
        "config": {
            "debug": true,
            "outputBucket": "{{outputBucket}}",
            "jobs": [
                {
                    "endpoint": "posts/{{id}}/comments"
                }
            ]
        }
    },
    "variables_id": "'$VARIABLE_CONFIG_ID'"
}
'

```

Use [Create Configuration API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/components/-componentId-/configs) to store extractor configuration.
```shell
curl --include \
     --request POST \
     --header "Content-Type: application/x-www-form-urlencoded" \
     --header "X-StorageApi-Token: $TOKEN" \
     --data-urlencode "name=$EXTRACTOR_CONFIG_NAME" \
     --data-urlencode "configuration=$EXTRACTOR_CONFIG" \
"$STORAGE_API_HOST/v2/storage/components/$COMPONENT_ID/configs"
```

Example API call result.
```json
{
    "id":"4567",
    "name":"Extractor configuration",
    "description":"..."
}
```

Save *extractor configuration* `id` from the result to the environment variable.
```shell
export EXTRACTOR_CONFIG_ID="4567"
```

## Run extractor configuration

Define values of the variables. Both values are quoted — the API declares a variable value as a
string.
```shell
export VARIABLES_VALUES='
[
    {"name": "outputBucket", "value": "my-bucket"},
    {"name": "id", "value": "1"}
]
'
```

In this example the values of the variables are part of the run job request.

For other ways to define values see the [Variables documentation](/components/variables/api/#variable-values).

Use [Run Job API call](https://api.keboola.com/?service=job-queue#job-queue/tag/jobs/POST/jobs) to run *extractor configuration*.
The body is passed on standard input, so the multi-line `$VARIABLES_VALUES` survives intact — inlining
it as `'$VARIABLES_VALUES'` makes `bash` split it on whitespace and truncates the request.
```shell
curl --include \
     --request POST \
     --header "Content-Type: application/json" \
     --header "X-StorageApi-Token: $TOKEN" \
     --data-binary @- \
     "$JOB_QUEUE_HOST/jobs" <<EOF
{
    "component": "$COMPONENT_ID",
    "config": "$EXTRACTOR_CONFIG_ID",
    "mode": "run",
    "variableValuesData": {
        "values": $VARIABLES_VALUES
    }
}
EOF
```

## Check the job result

The run-job call returns a job object that includes its `id` and `status`. Poll the job by its ID to follow progress:

```shell
curl --header "X-StorageApi-Token: $TOKEN" \
     "$JOB_QUEUE_HOST/jobs/{jobId}"
```

The `status` progresses from `processing` to `success` when the job finishes (or `error` on failure, with details in the `result` field).

In the Keboola UI you can see the same job — in the picture below, the entered values of the variables were used.

![Screenshot -- Job](/components/variables/api/tutorial-1.png)

A note about the replaced variables is in the job logs.

![Screenshot -- Job Logs](/components/variables/api/tutorial-2.png)

See the [Variables documentation](/components/variables/api/#variable-values) for more information.

## Example Using Python Transformations
In this example, we will configure a Python transformation using variables.

### Step 1 -- Create Variable Configuration
Use the [Create Configuration API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/components/-componentId-/configs) 
for the `keboola.variables` component with the following content:

```json
{
    "variables": [
        {
            "name": "alias",
            "type": "string"
        },
        {
            "name": "size",
            "type": "string"
        }
    ]
}
```

See an [example](https://documenter.getpostman.com/view/3086797/77h845D?version=latest#16a5d721-b6a4-4daa-9196-8e90250ed16b).

### Step 2 -- Create Default Values for Variables
Note that this step is optional -- you can use variables without default values.
In the previous step, you obtained an ID of the variable configuration. Use the 
[Create Configuration Row API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-/rows).
Use the ID of the variable configuration and `keboola.variables` as a component. Use the following body:

```json
{
    "values": [
        {
            "name": "alias",
            "value": "batman"
        },
        {
            "name": "size",
            "value": "42"
        }
    ]
}
```

See an [example](https://documenter.getpostman.com/view/3086797/77h845D?version=latest#72de2851-1853-4fe3-bec3-856fcc9e2270)

### Step 3 -- Create Main Configuration
Now it is time to create the actual configuration which will contain a Python transformation.
Use the following configuration body. The `storage` section describes the standard [input](/extend/common-interface/config-file/#input-mapping--basic) 
and [output](/extend/common-interface/config-file/#output-mapping--basic) mapping.

```json

{
    "storage": {
        "input": {
            "tables": [
                {
                    "source": "in.c-variable-testing.{{alias}}",
                    "destination": "{{alias}}.csv"
                }
            ]
        },
        "output": {
            "tables": [
                {
                    "source": "new-table.csv",
                    "destination": "out.c-variable-testing.cars"
                }
            ]
        }
    },
    "parameters": {
        "blocks": [
            {
                "name": "First Block",
                "codes": [
                    {
                        "name": "First Code",
                        "script": [
                            "import csv\ncsvlt = '\\n'\ncsvdel = ','\ncsvquo = '\"'\nwith open('in/tables/{{alias}}.csv', mode='rt', encoding='utf-8') as in_file, open('out/tables/new-table.csv', mode='wt', encoding='utf-8') as out_file:\n    writer = csv.DictWriter(out_file, fieldnames=['COUNTRY', 'CARS'], lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)\n    writer.writeheader()\n\n    lazy_lines = (line.replace('\\0', '') for line in in_file)\n    reader = csv.DictReader(lazy_lines, lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)\n    for row in reader:\n        writer.writerow({'COUNTRY': row['COUNTRY'] + '{{ alias }}', 'CARS': row['CARS'] + '{{ size }}'})\nfrom pathlib import Path\nimport sys\ncontents = Path('/data/config.json').read_text()\nprint(contents, file=sys.stdout)"
                        ]
                    }
                ]
            }
        ]
    },
    "variables_id": "807968875",
    "variables_values_id": "807952812"
}

```

The `variables_id` property contains the ID of the [variable configuration](/components/variables/api/#step-1--create-variable-configuration) - e.g., `807968875`. The
`variables_values_id` property is optional and contains the ID of the [row with default values](/components/variables/api/#step-2--create-default-values-for-variables) - e.g., `807952812`.
The `parameters` section contains a script with the following Python code:

```python

import csv
csvlt = '\n'
csvdel = ','
csvquo = '"'
with open('in/tables/{{alias}}.csv', mode='rt', encoding='utf-8') as in_file, open('out/tables/new-table.csv', mode='wt', encoding='utf-8') as out_file:
    writer = csv.DictWriter(out_file, fieldnames=['COUNTRY', 'CARS'], lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)
    writer.writeheader()
    lazy_lines = (line.replace('\0', '') for line in in_file)
    reader = csv.DictReader(lazy_lines, lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)
    for row in reader:
        writer.writerow({'COUNTRY': row['COUNTRY'] + '{{ alias }}', 'CARS': row['CARS'] + '{{ size }}'})

from pathlib import Path
import sys
contents = Path('/data/config.json').read_text()
print(contents, file=sys.stdout)

```

The script reads a file given by the alias, modifies the two columns **COUNTRY** and **CARS**, and 
prints the contents of the configuration file to output.

See an [example](https://documenter.getpostman.com/view/3086797/77h845D?version=latest#732e4b66-4f2d-46ab-80ba-7a7d07ddb94b).

### Step 4 -- Run Job
There are three options for providing variable values when running a job:

- Relying on default variables
- Providing ID of values using the `variableValuesId` property in job parameters
- Providing values using the `variableValuesData` property in job parameters

#### Option 1 -- Rely on default variables
If you created the default values, you can now directly run the job. Use the [Create Job API call](https://api.keboola.com/?service=job-queue#job-queue/tag/jobs/POST/jobs)
with the following body:

```json
{
    "component": "keboola.python-transformation-v2",
    "config": "807943784",
    "mode": "run"
}
```

The `config` property contains the ID of the [main configuration](/components/variables/api/#step-3--create-main-configuration).
Before executing the API call, you have to create the source table. Unless you modified the mapping in the 
[example](/components/variables/api/#step-3--create-main-configuration), you have to create a bucket named
**variable-testing** in the **in** stage. Then create a table called **batman** with columns  **COUNTRY** 
and **CARS**. You can use this [sample CSV file](/components/variables/api/countries.csv).

After you create the input table, you can run the job. 
See an [example](https://documenter.getpostman.com/view/3086797/77h845D?version=latest#31486ac2-ea52-4f19-a039-2ee1b1ae5863). 
It will create a new table in Storage -- **out.c-variable-testing.cars**. The tables should contain the default 
values, e.g.:

|COUNTRY|CARS|
|---|---|
|Belgiumbatman|629378142|
|Finlandbatman|335823242|
|Italybatman|4139387742|
|Romaniabatman|654126042|

The events of the job will contain the contents of the [configuration file](/extend/common-interface/config-file/) 
where you can verify that the variables were replaced.

<details>
  <summary>Click to expand the configuration.</summary>
```json
{
    "storage": {
        "input": {
            "tables": [
                {
                    "source": "in.c-variable-testing.batman",
                    "destination": "batman.csv",
                    "columns": [],
                    "where_values": [],
                    "where_operator": "eq"
                }
            ],
            "files": []
        },
        "output": {
            "tables": [
                {
                    "source": "new-table.csv",
                    "destination": "out.c-variable-testing.cars",
                    "incremental": false,
                    "primary_key": [],
                    "columns": [],
                    "delete_where_values": [],
                    "delete_where_operator": "eq",
                    "delimiter": ",",
                    "enclosure": "\"",
                    "metadata": [],
                    "column_metadata": []
                }
            ],
            "files": []
        }
    },
    "parameters": {
        "blocks": [
            {
                "name": "First Block",
                "codes": [
                    {
                        "name": "First Code",
                        "script": [
                            "import csv\ncsvlt = '\\n'\ncsvdel = ','\ncsvquo = '\"'\nwith open('in/tables/{{alias}}.csv', mode='rt', encoding='utf-8') as in_file, open('out/tables/new-table.csv', mode='wt', encoding='utf-8') as out_file:\n    writer = csv.DictWriter(out_file, fieldnames=['COUNTRY', 'CARS'], lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)\n    writer.writeheader()\n\n    lazy_lines = (line.replace('\\0', '') for line in in_file)\n    reader = csv.DictReader(lazy_lines, lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)\n    for row in reader:\n        writer.writerow({'COUNTRY': row['COUNTRY'] + '{{ alias }}', 'CARS': row['CARS'] + '{{ size }}'})\nfrom pathlib import Path\nimport sys\ncontents = Path('/data/config.json').read_text()\nprint(contents, file=sys.stdout)"
                        ]
                    }
                ]
            }
        ]
    },
    "variables_id": "807968875",
    "variables_values_id": "807952812",
    "image_parameters": {},
    "action": "run",
    "authorization": {}
}
```
</details>

#### Option 2 -- Run a job with stored values
Similarly to the [default values](/components/variables/api/#step-2--create-default-values-for-variables), 
you can store another set of values. Let's add another configuration row to the *existing* variable configuration:

```json
{
    "values": [
        {
            "name": "alias",
            "value": "WATMAN"
        },
        {
            "name": "size",
            "value": "4200"
        }
    ]
}
```

See an [example](https://documenter.getpostman.com/view/3086797/77h845D?version=latest#fbe487b5-cd68-4318-8219-7c067ebef795). 
You will obtain an ID of the row. Then create a table called **watman** with 
columns  **COUNTRY** and **CARS**. You can use this [sample CSV file](/components/variables/api/countries.csv).

Run a job with parameters and provide the ID of the main configuration in the `config` property and 
the ID of the value row in `variableValuesId`:

```json
{
    "component": "keboola.python-transformation-v2",
    "config": "807943784",
    "mode": "run",
    "variableValuesId": "807957572"
}
```

See an [example](https://documenter.getpostman.com/view/3086797/77h845D?version=latest#f883eb13-3f20-4e03-bf1b-36e9c889f773). 
The output table now contains:

|COUNTRY|CARS|
|---|---|
|BelgiumWATMAN|62937814200|
|FinlandWATMAN|33582324200|
|ItalyWATMAN|413938774200|

#### Option 3 -- Run a job with inline values
The last option to provide the values for variables is to enter them directly when running a job. 
Variable values are entered in the `variableValuesData` property:

```json
{
    "component": "keboola.python-transformation-v2",
    "config": "807943784",
    "mode": "run",
    "variableValuesData": {
        "values": [
            {
                "name": "alias",
                "value": "batman"
            },
            {
                "name": "size",
                "value": "scatman"
            }
        ]
	}
}
```

See an [example](https://documenter.getpostman.com/view/3086797/77h845D?version=latest#2c38d6ca-2eda-4c7e-9888-071fad3d31d8).

The output table will contain:

|COUNTRY|CARS|
|---|---|
|Belgiumbatman|6293781scatman|
|Finlandbatman|3358232scatman|
|Italybatman|41393877scatman|
