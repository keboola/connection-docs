---
title: How do I use variables and shared code?
slug: 'transformations/variables/how-to'
description: Parametrize a Keboola transformation with variables (with defaults and runtime/flow overrides) and create, reuse, and manage shared code across transformations.
keywords:
  - use transformation variables
  - define variable default value
  - override variable in flow
  - create shared code
  - reuse shared code Keboola
type: how-to
---

This page shows how to parametrize a transformation with **variables** and how to reuse snippets with **shared code**. For what they are and the inline-vs-linked trade-off, see the [explanation](/transformations/variables/explanation/).

## Use a variable

1. In your transformation code, reference the variable with Mustache syntax. For example, turn the multiplier `42` into `{{ multiplier }}`:

   ```sql
   CREATE OR REPLACE TABLE "result" AS
       SELECT "first", "second" * {{ multiplier }} AS "larger_second" FROM "source";
   ```

2. In the **Variables** section, define `multiplier` and give it a **default value**. Every referenced variable must be defined, and every defined variable must have a value.
3. **Run** the transformation. You can provide a runtime override of the default value when you run it.

If a variable is referenced but not defined, or has no value, you get an error such as `Missing values for placeholders: "multiplier"` or `No value provided for variable "multiplier".`

## Override a variable in a flow

When you automate transformations with [flows](/flows/), each flow task can either use the defaults or override them. Add the override to the task's configuration JSON:

```json
"variableValuesData": {
    "values": [
        {
            "name": "multiplier",
            "value": "1000"
        }
    ]
}
```

## Create shared code

Create shared code in either of two ways:

- From the **Shared Codes** page — choose to create new shared code and enter a name.
- From an existing transformation's code — share a selected snippet; its code and code type are filled in automatically. You still enter a name.

:::caution
For Snowflake, a single shared code can contain **only one query**, and the SQL query must end with a semicolon (`;`).
:::

## Use shared code in a transformation

1. While editing a transformation, insert shared code and select the snippet you want.
2. Choose how to use it (see the [explanation](/transformations/variables/explanation/#shared-code)):
   - **Use Inline** — copies the snippet, no link.
   - **Use as Shared Code** — links it; later edits to the shared code apply everywhere it is linked.
3. To break a link later, choose **Use as Inline Code** from the snippet's dots menu.

## Shared code with a variable (worked example)

Suppose many SQL transformations need the same input prep. Because of [clone mapping](/transformations/mappings/#loading-type-snowflake-and-bigquery), you must drop the `_timestamp` column from the source:

```sql
ALTER TABLE "source" DROP COLUMN "_timestamp";
```

Make this reusable and parametrize the table name with a `source` variable:

```sql
ALTER TABLE "{{source}}" DROP COLUMN "_timestamp";
```

Create the shared code, add it to the transformation (drag it **before** the main code), then set the `source` variable to the [input mapping destination name](/transformations/mappings/#table-input-mapping) of the table (for example `source-table`). When you run the transformation, the job events show the shared-code query manipulating that table.

## Manage shared code safely

- **Review usage** — the **Usage** section on a shared code's detail page lists the transformations it is linked to. Inline copies are not listed (there is no link).
- **Editing** a linked shared code shows a warning that it may break the transformations using it.
- **Deleting** a used shared code lists the affected transformations; they stop working. A transformation referencing deleted shared code fails with a message like `Shared code configuration cannot be read: Row 10433 not found`.

## Related

- [What are variables and shared code?](/transformations/variables/explanation/) — concepts and the inline-vs-linked trade-off.
- [Input and output mapping](/transformations/mappings/) · [Flows](/flows/).
