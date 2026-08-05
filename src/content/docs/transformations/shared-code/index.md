---
title: Shared Code
slug: 'transformations/shared-code'
description: Share pieces of transformation code between otherwise unrelated transformations, in the UI and through the API.
---



Shared code lets you share pieces of code between otherwise unrelated transformations. Write a
snippet once, link it into as many transformations as you like, and edit it in one place.

It is a sibling of [variables](/flows/variables/): both make transformation code more dynamic and
both are resolved before the transformation runs, but variables substitute *values* while shared
code substitutes *code*. Shared code can contain variables of its own — see
[Shared Code with Variables](#example-shared-code-with-variables).

## Creating Shared Code
Like variables, shared code is evaluated before the transformation runs. This means that it does not
interfere with your transformation code.

There are two ways how to create shared code --- from the **Shared Codes** page:

![Screenshot - Create Shared Code](/transformations/shared-code/shared-code.png)

Or from an existing transformation code:

![Screenshot - Create Shared Code from Transformation](/transformations/shared-code/shared-code-2.png)

You have to enter the name for the shared code when creating a new one. When you share an 
existing piece of transformation code, the code and code type are filled in automatically.

![Screenshot - Shared Code Detail](/transformations/shared-code/shared-code-detail.png)

### Using Shared Code
You can use shared code when editing a transformation:

![Screenshot - Shared Code Use](/transformations/shared-code/shared-code-use-1.png)

Select the shared code you want to use. There are two options how you can use it:

- **Use Inline** --- This will make a copy of the shared code in the transformation you're editing. There 
won't be any link between the transformation and the shared code.
- **Use as Shared Code** --- This will link the shared code with the transformation. When you modify the
shared code, it will affect all linked transformations.

![Screenshot - Shared Code Use](/transformations/shared-code/shared-code-use-2.png)

When the code is inserted as shared code, you can always unlink the transformation
from the shared code by selecting **Use as Inline Code** from the dots menu:

![Screenshot - Shared Code Use](/transformations/shared-code/shared-code-use-3.png)

![Screenshot - Shared Code Use](/transformations/shared-code/shared-code-use-4.png)

### Modifying Shared Code

When a shared code is linked to transformations, you can review its usage in the
Usage section on the shared code detail page:

![Screenshot - Shared Code List](/transformations/shared-code/shared-code-edit.png)

You'll see a list of transformations to which the shared code is linked. The transformations
in which the shared code was used inline are not listed, because there is no link.

When you attempt to edit a shared code, you'll see a warning that there's a potential
to break the transformations in which it is used.

![Screenshot - Shared Code Edit](/transformations/shared-code/shared-code-edit-2.png)

When you try to delete a shared code, you'll see a list of the transformations which use it.
When you delete a shared code that is used, the transformations using it will stop working.

![Screenshot - Shared Code Delete](/transformations/shared-code/shared-code-delete.png)

Transformations referencing a deleted shared code fail with a message similar to this:

    Shared code configuration cannot be read: Row 10433 not found

### Example Using Shared Code

Let's say that you have a lot of SQL transformations with a table in input mapping 
that requires some preparation.

For example:

```sql
CREATE OR REPLACE TABLE "result" AS
	SELECT *, "second" * 42 AS "larger_second" FROM "source";
```

Because of [Clone mapping](/transformations/mappings/#loading-type-snowflake-and-bigquery), you have 
to drop the `_timestamp` column from the source by executing this query:

```sql
ALTER TABLE "source" DROP COLUMN "_timestamp";
```

If you have many transformations that require the table to be prepared in the same way, 
you can create the following shared code:

![Screenshot - Create Shared Code](/transformations/shared-code/shared-code-drop-1.png)

*Note: When defining shared code for Snowflake, the shared code can contain only one query.*

**Important: The SQL query must end with a semicolon `;`**

Add the shared code to the transformation. Drag & Drop it before the main transformation code:

![Screenshot - Use Code](/transformations/shared-code/shared-code-drop-2.png)

The main code being:

```sql
CREATE OR REPLACE TABLE "result" AS
	SELECT "first", "second" * 42 AS "larger_second" FROM "source";
```

When you run the transformation, you can see in the events what code has been executed: 

![Screenshot - Use Code](/transformations/shared-code/shared-code-events.png)

### Example Shared Code with Variables
You can also define variables for shared code. 
For example, we can extend the 
[above example](/transformations/shared-code/#example-using-shared-code)
and parametrize the name of the table from which the `_timestamp` column is dropped.

Add the `source` variable and modify the shared code to:

```sql

ALTER TABLE "{{source}}" DROP COLUMN "_timestamp"; 

```

![Screenshot - Shared Code with Variables](/transformations/shared-code/shared-code-variables-1.png)

The transformation will detect that the value for the `source` variable is not defined:

![Screenshot - Shared Code in Transformation](/transformations/shared-code/shared-code-variables-2.png)

Set the `source` value to the [destination name](/transformations/mappings/#table-input-mapping) of the 
table in the *Table Input Mapping* (`source-table` in this case):

![Screenshot - Shared Code with set Variables](/transformations/shared-code/shared-code-variables-3.png)

When you run the transformation, you can verify the executed queries in the job events. There
you can see that the shared code query manipulated the `source-table`:

![Screenshot - Shared Code with set Variables](/transformations/shared-code/shared-code-variables-4.png)

## Shared Code via the API
Shared code allows to share parts of configuration code. In a 
configuration it is also replaced using the [Moustache syntax](https://mustache.github.io/mustache.5.html). Shared code
is referenced using `shared_code_id` and `shared_code_row_ids` configuration nodes. Unlike variables, shared code can't 
be overridden at runtime, so there are no parameters to set when running a job or a flow.
Shared code can, however, contain its own variables which need to be merged to those of the main configuration.

### Creating Shared Code with the API
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

### Referencing Shared Code in a Configuration
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
