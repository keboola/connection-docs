---
title: Code Pattern Interface
slug: 'extend/component/code-patterns/interface'
---


This page describes how code patterns work internally as part of Keboola.

## Common Interface
Code pattern is a special type of [component](/extend/component/), therefore the common interface applies to it. 
To integrate your own components into Keboola, use the following links:

- [Component common interface](/extend/common-interface/) 
- [Environment](/extend/common-interface/environment/)
- [Implementation notes](/extend/component/implementation/)

It's important to know that 

- the component code is wrapped in a Docker image.
- each component gets a [configuration file](#configuration).
- the correct exit code must be used; read about [return values](/extend/common-interface/environment/#return-values) and
    [how to handle user and application errors](/extend/common-interface/actions/#handling-user-and-application-errors).
- the [Storage API token](/management/project/tokens/) can be forwarded to the `KBC_TOKEN` environment variable.
    - For example, if you need to know the details about the table in the input mapping.
    - It must be enabled and approved by us.
    - Read more in [Environment](/extend/common-interface/environment/).

## Code Generation Process
This section shows how the code generation process works from start to end:

- First, there must be a [published](/extend/publish/) code pattern component, for example, `keboola.example-pattern`.
- The component must have [supported transformations](#supported-components) configured.
    - For instance, it supports `keboola.snowflake-transformation`.
- [Create a transformation with the code pattern](/transformations/code-patterns/#new-transformation-with-code-pattern) in the user interface.
- Click the **Generate Code** button.
- User interface calls the [generate action](#generate-action) on the `keboola.example-pattern` component.
- The action finishes with the correct exit code:
    - If **successful**: `exit code = 0`
        - The component `stdout` contains JSON in the [output format](#output-format). 
        - The code blocks in the [parameters](#output-format) are stored to the transformation.
    - If **failed**: `exit code = 1 or 2`
        - The error is processed according to the [exit code](/extend/common-interface/environment/#return-values).
        - The previous version of the generated code remains in the transformation.
- The generated code is displayed read-only in the user interface.

## Generate Action
There are two types of component actions: 

- [Asynchronous, background](/integrate/jobs/) **run** actions
- [Synchronous actions](/extend/common-interface/actions/) with limited execution time

Code patterns do not implement the **run** action. They only implement the **generate** [synchronous action](/extend/common-interface/actions/).

The expected behavior of the **generate** action:

- The action is started by the [Run Component Action](https://api.keboola.com/?service=sync-actions#post-/actions) API call.
- The `CMD` process defined in the `Dockerfile` is started in the container.
- The component generates a transformation code based on the [configuration](#configuration).
- The result is written in the [output format](#output-format) to `stdout`.
- The process will end successfully with `exit code = 0` (or with another [return value](/extend/common-interface/environment/#return-values) if an error occurs).
- API returns the result of the action.
- The user interface modifies the transformation's configuration and saves it. 

### Configuration
The [configuration file](/extend/common-interface/config-file/) `config.json` in the `KBC_DATADIR` contains:

- **`action`** key set to the `generate` value as a name of the [action](/extend/common-interface/actions/) to execute
- **`storage`** key – contains the current input and output mapping from the transformation.
    - Go to [Configuration File - Tables](/extend/common-interface/config-file/#tables) for a schema description and examples.
    - Go to [Overview - Input and Output Mapping](/transformations/code-patterns/#input-and-output-mapping) for an exemplary user interface.
- **`parameters`** key – modifies the generated code.
    - **`_componentId`** key contains the ID of the target transformation component.
        - For example, `keboola.snowflake-transformation`
        - Based on this, it is possible to customize the generated code, e.g., for various SQL dialects.
    - The other keys come from the [parameters form](/transformations/code-patterns/#parameters-form), filled in by the user.
        - The schema of the form is defined in the [configuration schema](#configuration-schema).
        - The values should be [validated](/extend/common-interface/config-file/#validation) in the component's code.
    
**Note**: [Learn more](/extend/common-interface/environment/) about the `KBC_DATADIR` environment variable.

An example configuration (examples of the `storage` key can be found [here](/extend/common-interface/config-file/#tables)):

```json
{ 
  "action": "generate",
  "storage": {
    "input": {
      "tables": ["..."]
     },
     "output": {
       "tables": ["..."]
     }
  },
  "parameters": {
    "_componentId": "keboola.snowflake-transformation",
    "form_parameter_1": "value 1",
    "form_parameter_2": "value 2"
  }
}
```

### Output Format
The component must write the generated code to `stdout` in the following JSON format:

- **`storage`** key contains the new transformation's input and output mapping.
    - It is optional. If absent, the mapping remains unchanged.
    - It is copied into the transformation's configuration `storage` key.
    - A schema and examples can be found in [Configuration File - Tables](/extend/common-interface/config-file/#tables).
- **`parameters`** key with the generated code
    - It is copied into the transformation's configuration `parameters` key.
    - [Schema](/transformations/#writing-scripts) `blocks` -> `codes` -> `script` must be used. See below.
    - Each statement must be a separate item in the `script` array.

An example configuration (examples of the `storage` key can be found [here](/extend/common-interface/config-file/#tables)):

```json
{
  "storage": {
    "input": {
      "tables": ["..."]
     },
     "output": {
       "tables": ["..."]
     }
  },
  "parameters": {
    "blocks": [
      {
        "name": "Generated block",
        "codes": [
          {
            "name": "Generated code",
            "script": [
              "CREATE TABLE table1;",
              "SELECT foo1, foo2 FROM table2 INTO bar;"
            ]
          }
        ]
      }
    ]   
  }
}
```

## Developer Portal
Each newly created component must be registered in the [Keboola Developer Portal](https://components.keboola.com/).

Start with creating a simple [“Hello, World!”](/extend/component/tutorial/) component. To create 
a code pattern component, you must take the following **additional steps**:

First, create a component with the `Code Pattern` type.

![Screenshot -- Add component](/extend/component/code-patterns/interface-1-add-component.png)

Open the component edit page, and modify the settings described in the following sections.

![Screenshot -- Edit component page](/extend/component/code-patterns/interface-5-edit-component.png)

### Configuration Schema
- [Parameters form](/transformations/code-patterns/#parameters-form) in the user interface
is generated from the [configuration schema](/extend/component/ui-options/configuration-schema/).
- Click the **Preview** button to see the preview of the form. 

![Screenshot -- Configuration schema](/extend/component/code-patterns/interface-2-schema.png)

### Supported Components
Each code pattern can generate a code for one or more transformation component types.
They are specified in the [configuration schema](/extend/component/ui-options/configuration-schema/) in
the root-level `supported_components` key, as an array of component IDs. 

![Screenshot -- List of the supported components](/extend/component/code-patterns/interface-3-supported-list.png)

When creating one of the listed transformation components, the [published](/extend/publish/) code pattern will be 
available in the select box.

![Screenshot -- Create a new transformation](/extend/component/code-patterns/interface-4-new-transformation.png)

The code pattern's [configuration](/extend/component/code-patterns/interface#configuration) contains 
the `parameters._componentId` key, so it is possible to distinguish for which transformation component the code is generated.

## Next Steps
- [Tutorial](/extend/component/code-patterns/tutorial) helps you to implement your first code pattern.
- [Code Patterns Help](/transformations/code-patterns/) shows the code patterns from the user's point of view.