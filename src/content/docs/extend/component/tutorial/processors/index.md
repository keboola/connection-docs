---
title: Processors
slug: 'extend/component/tutorial/processors'
---


[Processors](/extend/component/processors/) are an optional part of a component configuration.
While they are **not at all necessary** in the development of new components for Keboola, we think that you
should know about them; they can save you a lot of time in some cases.
To get a list of currently available processors, see the
[official component list](https://components.keboola.com/components).

## Configuration
To be able to configure the processors in the Keboola UI, go to the
[Developer Portal](https://components.keboola.com/) and add the UI
flag `genericDockerUI-processors` to your component. You'll then see
a new UI element in the component configuration in Keboola:

![Screenshot -- Processors Empty](/extend/component/tutorial/processors-1.png)

Taking the [example component](/extend/component/tutorial/), you might want to use the
**Add Row Number Column** processor in your component to add a sequential number to every
row of the table imported into Keboola. From the
[processor documentation](https://github.com/keboola/processor-add-row-number-column/blob/master/README.md#usage)
you can see that the processor is configured as:

```json
{
    "definition": {
        "component": "keboola.processor-add-row-number-column"
    }
}
```

You want the processor to execute on the output of your component; it means that the
above should be inserted into the `after` (after your component runs) section:

```json
{
    "before": [],
    "after": [
        {
            "definition": {
                "component": "keboola.processor-add-row-number-column"
            }
        }
    ]
}
```

## Chaining Processors
If you run the above configuration, you'll receive an error:

    Table odd.csv does not have a manifest file.

This is expected because the [Add Row Number Column processor documentation](https://github.com/keboola/processor-add-row-number-column/blob/master/README.md#prerequisites)
clearly states that the processed CSV files must have
[manifests](/extend/common-interface/manifest-files/) and not headers. Since the example component is very simple and does
not generate manifests (or header-less CSV files), you have to add other processors to do that
for you:

```json
{
    "before": [],
    "after": [
        {
            "definition": {
                "component": "keboola.processor-create-manifest"
            },
            "parameters": {
                "columns_from": "header"
            }
        },
        {
            "definition": {
                "component": "keboola.processor-skip-lines"
            },
            "parameters": {
                "lines": 1
            }
        },
        {
            "definition": {
                "component": "keboola.processor-add-row-number-column"
            }
        }
    ]
}
```

The `after` configuration is an array of three processors. The first one creates
[manifest files](/extend/common-interface/manifest-files/) for whatever data files were produced by your component. The manifest
files will contain a header read from the data files. The second processor removes the header
from the data files. The third processor adds the row number column.

## Summary
Configuring processors is not part of the component development. However, processors
allow the end user to customize the input to the component and the output from it. That means
that they can be used to implement specific customer requests while keeping the component
code general.

Choosing whether to implement a specific feature as a processor or as part of your
component may be difficult. A processor might be a good solution if the feature is 

- simple (one operation, contains no internal logic),
- optional (not all end users are interested in it), or
- universal (it is always applied to all input/output or none).

Keep in mind, however, that the processors must be configured by the end user. You can read more about
[processors](/extend/component/processors/) or continue with the next part of the tutorial; 
it will show you some [debugging tips](/extend/component/tutorial/debugging/).
