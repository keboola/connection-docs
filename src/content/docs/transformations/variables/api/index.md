---
title: Variables
slug: 'transformations/variables/api'
redirect_from:
    - /integrate/variables/
---


*Note: This is a preview feature and as such may change considerably in the future.*

**Variables** are placeholders used in [configurations](/storage/api/configurations/). Their value is 
resolved at [job runtime](/integrate/jobs/). 

**Important:** Make sure you're familiar with the [Configuration API](/storage/api/configurations/) and 
the [Job API](/integrate/jobs/) before reading on.

See [Tutorial](/transformations/variables/api/tutorial) for step-by-step example.

## Introduction
When using variables, the configuration is treated as a [Moustache template](https://mustache.github.io/mustache.5.html). 
You can enter variables anywhere in the JSON of the configuration body. The configuration body is the contents of 
the `configuration` node when you [retrieve a configuration](https://api.keboola.com/?service=storage#get-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-).
This means that you can't use variables in a name or in a configuration description. 

Variables are entered using the [Moustache syntax](https://mustache.github.io/mustache.5.html), 
i.e., `{{ variableName}}`. To work with variables, three things are needed:

- Main configuration -- the configuration in which variables are replaced (used); this can be a configuration of any component (e.g., a configuration of a transformation, extractor, writer, etc.).
- Variable configuration -- a configuration in which variables are defined; this is a configuration of a special `keboola.variables` component.
- Variable values -- actual values that will be placed in the main configuration.

To enable replacement of variables, the *main configuration* has to reference the *variable configuration*. 
If there is no *variable configuration* referenced, no replacement is made (the *main configuration* is completely
static). Variables can be used in any place of any configuration except legacy transformations (the component with 
the ID `transformation`; it can still be used in a specific transformation -- e.g., `keboola.python-transformation-v2` 
or `keboola.snowflake-transformation`, etc.), and an orchestrator (see [below](#orchestrator-integration)). 

## Variable Configuration
A *variable configuration* is a standard configuration tied to a special dedicated `keboola.variables` component. 
The variable configuration defines names of variables to be replaced in the main configuration. You can create 
the configuration using the 
[Create Configuration API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/components/-componentId-/configs). 
This is an example of the contents of such a configuration:

```json
{
    "variables": [
        {
            "name": "firstVariable",
            "type": "string"
        },
        {
            "name": "secondVariable",
            "type": "string"
        }
    ]
}
```

Note that `type` is always `string`.

## Main Configuration
When you create a variable configuration, you'll obtain an ID of the configuration - e.g., `807940806`. 
In the *main configuration*, you have to reference the *variable configuration* ID using the `variables_id` node. 
Then you can use the variables in the configuration body:

```json

{
    "storage": {
        "input": {
            "tables": [
                {
                    "source": "in.c-application-testing.{{firstVariable}}",
                    "destination": "{{firstVariable}}.csv"
                }
            ]
        },
        "output": {
            "tables": [
                {
                    "source": "new-table.csv",
                    "destination": "out.c-transformation-test.cars"
                }
            ]
        }
    },
    "parameters": {
        "script": [
            "print('{{firstVariable}}')"
        ]
    },
    "variables_id": "807940806"
}

```

## Variable Values 
You can either store the variable values as [configuration rows](/storage/api/configurations/#configuration-rows) of the 
*variable configuration* and provide the row ID of the stored values at run time, or you can provide the variable values directly at run 
time. There are three options how you can provide values to the variables:

- Reference values using `variables_values_id` property in the *main configuration* (default values).
- Reference values using `variablesValuesId` property in job parameters.
- Provide values using  `variableValuesData` property in job parameters.

The structure of variable values, regardless of whether it is stored in configuration or provided at runtime, is as follows:

```json
{
    "values": [
        {
            "name": "firstVariable",
            "value": "batman"
        }
    ]
}
```

## Variable Delimiter
The default variable delimiter is `{{` and `}}`. If the delimiter interferes with your code, it can
be changed as per the [Moustache docs](https://mustache.github.io/mustache.5.html). For example the 
following piece of code

```json
{
    "code": "SELECT \"COUNTRY\" || '{{ alias}}' || '{{=<< >>=}} {{ as-is}} <<={{}}=>>' 
    AS \"COUNTRY\", \"CARS\" || '{{ size}}' AS \"CARS\" FROM \"my-table\""
}
```

will be interpreted as (assuming the variables `alias=batman` and `size=big` are defined):

```json
{
    "code": "SELECT \"COUNTRY\" || 'batman' || '{{ as-is}}' 
    AS \"COUNTRY\", \"CARS\" || 'big' AS \"CARS\" FROM \"my-table\""
}
```

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
    }
    "variables_id": "807968875",
    "variables_values_id": "807952812"
}

```

The `variables_id` property contains the ID of the [variable configuration](/transformations/variables/api/#step-1--create-variables-configuration) - e.g., `807968875`. The
`variables_values_id` property is optional and contains the ID of the [row with default values](/transformations/variables/api/#step-2--create-default-values-for-variable) - e.g., `807952812`.
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
- Providing ID of values using the `variablesValuesId` property in job parameters
- Providing values using the `variableValuesData` property in job parameters

Following the rules for running a job, you always **have to** provide values for the defined variables. 
Note that it is important which variables are *defined* in the variable configuration, not which
variables you actually use in the main configuration. For example, the main configuration references a variable 
configuration with *firstVar* and *secondVar* variables, but you're using `{{ firstVar}}` and
`{{ thirdVar}}` in the configuration code. Then you have to provide values at least for *firstVar* 
and *secondVar* variables. If you provide values for all *firstVar*, *secondVar*, and *thirdVar*, all of them will 
be replaced. If you omit *thirdVar*, it will be replaced by an empty string. If you omit one of *firstVar*, 
*secondVar*, an error will be raised.

The second rule is that the three options of passing values are mutually exclusive. If you provide values using 
`variablesValuesId` or `variableValuesData`, it overrides the default values (if provided). You can't use 
`variablesValuesId` and `variableValuesData` together in a single call. If you do that, an error will be raised.
If no default values are set and none of the `variablesValuesId` or `variableValuesData` is provided, an error 
will be raised.

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

The `config` property contains the ID of the [main configuration](/transformations/variables/api/#step-3--create-main-configuration).
Before executing the API call, you have to create the source table. Unless you modified the mapping in the 
[example](/transformations/variables/api/#step-3--create-main-configuration), you have to create a bucket named
**variable-testing** in the **in** stage. Then create a table called **batman** with columns  **COUNTRY** 
and **CARS**. You can use this [sample CSV file](/transformations/variables/api/countries.csv).

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
    "variables_id": "807943784",
    "variables_values_id": "807952812",
    "image_parameters": {},
    "action": "run",
    "authorization": {}
}
```
</details>

#### Option 2 -- Run a job with stored values
Similarly to the [default values](/transformations/variables/api/#step-2--create-default-values-for-variable), 
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
columns  **COUNTRY** and **CARS**. You can use this [sample CSV file](/transformations/variables/api/countries.csv).

Run a job with parameters and provide the ID of the main configuration in the `config` property and 
the ID of the value row in `variableValuesId`:

```json
{
    "component": "keboola.python-transformation-v2",
    "config": "807968875,
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
    "config": "807968875",
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

## Orchestrator Integration
Variables in a configuration interact with an orchestrator in two ways:

- Variables can be entered in task configuration.
- Variables can be entered when running an orchestration.

Entering variable values in task configurations allows the orchestration to run configurations with variables. 
Variable values are entered in the `actionParameters` property. The parameters are identical to 
[running a job](/transformations/variables/api/#step-4--run-job).

When running an orchestration, you can also provide variable values for an entire orchestration. In that case, 
the provided values will override those set in individual orchestration tasks. The parameters are identical 
to [running a job](/transformations/variables/api/#step-4--run-job).

### Step 5 -- Create Orchestration
You have to use the 
[Create Configuration API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/components/-componentId-/configs)
to create a configuration of the `keboola.orchestrator` component. 
You can use the following data in the configuration:

```json
{
    "phases": [
        {
            "id": 2468,
            "name": "Extractors",
            "dependsOn": []
        }
    ],
    "tasks": [
        {
            "id": 13579,
            "name": "Example",
            "phase": 2468,
            "task": {
                "componentId": "keboola.python-transformation-v2",
                "configId": "807968875",
                "mode": "run",
                "variableValuesId": "807952812"
            },
            "continueOnFailure": false,
            "enabled": true
        }
    ]
}
```

The contents of the `task` property are identical to the body 
of the [run job API call](/transformations/variables/api/#step-4--run-job). Here, the value `807968875` refers to the ID 
of the main configuration, and `807952812` refers to the ID of the configuration row with variable values.
You can use the `variableValuesData` field in the same manner.
Creating the above configuration will return a response containing the configuration ID, e.g., `807969959`.
See an [example](https://documenter.getpostman.com/view/3086797/77h845D?version=latest#9f2f9da0-59eb-4f33-a206-e5add24725d1).

### Step 6 -- Run Orchestration
When running an orchestration which contains configurations referencing variables, you have to provide their
values. You can either rely on the stored values (either at the component configuration or in the orchestration task) 
or you can provide the values at runtime.

#### Option 1 -- Rely on stored values
Use the [Run Job API call](https://api.keboola.com/?service=job-queue#job-queue/tag/jobs/POST/jobs) 
to run an orchestration. In its simplest form, the request body needs to contain just the ID of the orchestration
(obtained in the previous step):

```json
{
    "component": "keboola.orchestrator",
    "config": "807969959",
    "mode": "run"
}
```

As long as the variable values can be found somewhere, this is sufficient. See [an example](https://documenter.getpostman.com/view/3086797/77h845D?version=latest#3ebdc3f5-a940-4f0d-860b-ec311f704a7e).

#### Option 2 -- Provide values
Use the [Run Job API call](https://api.keboola.com/?service=job-queue#job-queue/tag/jobs/POST/jobs) 
to run an orchestration. Additionally, you can use the `variableValuesId` or `variableValuesData` property 
to override variable values set to individual tasks. The calling convention is the same as shown in the 
[basic job run](/transformations/variables/api/#step-4--run-job). The same rules also apply, notably that you can't 
use `variableValuesId` and `variableValuesData` together. 
A sample request body:

```json
{
    "component": "keboola.orchestrator",
    "config": "807969959",
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

See [an example](https://documenter.getpostman.com/view/3086797/77h845D?version=latest#f4fcf7af-afbe-4c29-999e-0f4c50aa477b).

## Variables Evaluation Sequence
There is a number of places where variable values can be provided (either as a reference to an existing row with 
values or as an array of `values`):

- Parameters in the orchestration
- Parameters in `task` setting of the orchestration
- Parameters in the component job itself
- Default values stored in configuration (`variables_values_id` property)

The following diagram shows the parameters mentioned on this page and to what they refer to:

![Screenshot -- Properties references](/transformations/variables/api/variables.svg)

In a nutshell, `variableValuesId` always refers to the row of the variable configuration associated with the 
main configuration. The main configuration is referenced in the `config` parameter. From another point of view,
the `config` parameter represents the configuration (either a component or an orchestration) to be run.
Note that in stored configurations snake_case is used instead of camelCase.

The following rules describe the evaluation sequence:

- Values provided in job parameters (a component job or an orchestration job) override the stored values.
- Values provided in an orchestration job override the stored values in `task`.
- Values provided in `task` override values stored in the component configuration.
- `variableValuesData` and `variableValuesId` can't be used together, so neither of them takes precedence. A reference to stored values can't be mixed with providing the values inline. 
- If no values are provided anywhere, the default values are used. If no default values are present, an error is raised.

## Shared Code
Related to variables is the Shared Code feature. Shared code allows to share parts of configuration code. In a 
configuration it is also replaced using the [Moustache syntax](https://mustache.github.io/mustache.5.html). Shared code
is referenced using `shared_code_id` and `shared_code_row_ids` configuration nodes. Unlike variables, shared code can't 
be overridden at runtime (so there are no parameters to set when running a job or in orchestration).
Shared code can, however, contain its own variables which need to be merged to those of the main configuration.

### Creating Shared Code
Shared code pieces is stored as configuration rows of a dedicated component `keboola.shared-code`. Before creating a 
piece of a shared code, you first have to create a configuration. Notice that the UI uses certain configurations for
certain components so you might want to check the existing configurations of `keboola.shared-code` component before
crating a new configuration.

To create a configuration, use the [create configuration API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/components/-componentId-/configs). The configuration content is ignored, i.e all you need to provide is name:

```bash
curl --location --request POST 'https://connection.keboola.com/v2/storage/components/keboola.shared-code/configs' \
--header 'X-StorageAPI-Token: my-token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=python-code'
```

Let's assume that the created configuration ID is `618884794`.
Next step is to create the shared code piece itself. To do this create a configuration row of the above configuration
with the configuration row content containing a piece of share code, for example:

```json
{
    "code_content": [
        "from os import listdir\nfrom os.path import isfile, join\n\nmypath = '\''/data/in/files'\''\nonlyfiles = [f for f in listdir(mypath)]\nprint(onlyfiles)\nmypath = '\''/data/in/user'\''\nonlyfiles = [f for f in listdir(mypath)]\nprint(onlyfiles)"
    ]
}
```

It is advisable to set a reasonable `rowId` of the row, because it will be used later to reference the shared code:

```bash
curl --location --request POST 'https://connection.keboola.com/v2/storage/components/keboola.shared-code/configs/618884794/rows' \
--header 'X-StorageApi-Token: my-token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'configuration={
	"code_content": ["from os import listdir\nfrom os.path import isfile, join\n\nmypath = '\''/data/in/files'\''\nonlyfiles = [f for f in listdir(mypath)]\nprint(onlyfiles)\nmypath = '\''/data/in/user'\''\nonlyfiles = [f for f in listdir(mypath)]\nprint(onlyfiles)"]
}
' \
--data-urlencode 'rowId=dumpfiles'
```

The above example creates a piece of shared python code named `dumpfiles` which contains the 
following python code:

```python
from os import listdir
from os.path import isfile, join

mypath = '/data/in/files'
onlyfiles = [f for f in listdir(mypath)]
print(onlyfiles)
mypath = '/data/in/user'
onlyfiles = [f for f in listdir(mypath)]
print(onlyfiles)
```

### Using Shared Code
To use a piece of shared code, you have to reference it in a configuration using `shared_code_id` which is the ID of the shared code configuration and `shared_code_row_ids` which is an array of IDS of shared code pieces. With the above example you need to add the following nodes to the configuration:

```json
{
    "storage": {...},
    "parameters": {...},
    "shared_code_id": "618884794",
    "shared_code_row_ids": ["dumpfiles"]
}
```

With that all moustache references to `{{ dumpfiles}}` will be replaced by the shared code piece. All other
moustache references will be kept untouched and be treated like variables. E.g: the following configuration:

```json
{
    "storage": {},
    "parameters": {
        "blocks": [
            {
                "name": "Main block",
                "codes": [
                    {
                        "name": "Main code",
                        "script": ["{{ someOtherPlaceholder}}"]
                    },
                    {
                        "name": "Debug",
                        "script": ["{{ dumpfiles}}"]
                    }
                ]
            }
        ]
    },
    "variables_id": "618878103",
    "variables_values_id": "618878104",
    "shared_code_id": "618884794",
    "shared_code_row_ids": ["dumpfiles"]
}
```

Will be modified to:

```json
{
    "storage": {},
    "parameters": {
        "blocks": [
            {
                "name": "Main block",
                "codes": [
                    {
                        "name": "Main code",
                        "script": ["{{ someOtherPlaceholder}}"]
                    },
                    {
                        "name": "Debug",
                        "script": ["from os import listdir\nfrom os.path import isfile, join\n\nmypath = '\''/data/in/files'\''\nonlyfiles = [f for f in listdir(mypath)]\nprint(onlyfiles)\nmypath = '\''/data/in/user'\''\nonlyfiles = [f for f in listdir(mypath)]\nprint(onlyfiles)"]
                    }
                ]
            }
        ]
    },
    "variables_id": "618878103",
    "variables_values_id": "618878104",
    "shared_code_id": "618884794",
    "shared_code_row_ids": ["dumpfiles"]
}
```

The variables then need to contain `someOtherPlaceholder` variable in order to produce a fully functional configuration.
The same way if the shared code piece contains any variables, they have to be set when running the configuration.

**Important:** The replacement of the shared code piece occurs only within an array of the configuration JSON. In the above code, the shared code reference is `"script": ["{{ someOtherPlaceholder}}"]` which is the only valid form of a Shared Code reference. For example
`"script": ["some code {{ someOtherPlaceholder}} some other code"]` or `"script": "{{ someOtherPlaceholder}}"` are invalid Shared Code references which may not be replaced the way you intend.

**Important:** The replacement of the shared code piece merges the `code_content` array containing the shared code definition with the array containing the shared code reference. With a shared code reference in form `"script": ["a", "{{ someOtherPlaceholder}}", "b"]` and shared code definition in form `"code_content": ["c", "d"]` the resulting replacement would be `"script": ["a", "c", "d", "b"]`.
