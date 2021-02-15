---
title: Code Patterns
permalink: /transformations/code-patterns/
---

* TOC
{:toc}

Code Pattern is a special type of [component](/components/) that

- generates code based on [parameters](#parameters-form), and
- can be used in the user interface of [New Transformations](/transformations/#new-transformations).

## List of Code Patterns

All components published with **Code Pattern** can be found in the Keboola Connection 
[Developer Portal](https://components.keboola.com/components). To find out which transformation types a component can be used for, read its description.

{: .image-popup}
![Screenshot -- Transformations page](/transformations/code-patterns/overview-0-dev-portal.png)

## New Transformation with Code Pattern

This section describes how to create a new transformation with a code pattern.

First, click **Transformations** on the project menu.

Then click **New Transformation** to create a new transformation.

{: .image-popup}
![Screenshot -- Transformations page](/transformations/code-patterns/overview-1-intro.png)

In the modal, click the selected **type of the transformation**.

{: .image-popup}
![Screenshot -- Add new transformation modal](/transformations/code-patterns/overview-2-modal.png)

Fill in the **name** and, optionally, a **description**. 

Then select a code pattern from the **Use predefined code pattern** select box.

If a code pattern is missing in the list, please check whether it supports the selected transformation type 
and it is published.

Click the **Create Transformation** button.

{: .image-popup}
![Screenshot -- Select box for code pattern](/transformations/code-patterns/overview-3-new.png)

A new transformation has been created and you can see its configuration.

You can now fill in the [Parameters Form](#parameters-form) and click the **Generate Code** button.

Follow the instructions at the top of the configuration page.

## Configuration

{: .image-popup}
![Screenshot -- Code pattern user interface](/transformations/code-patterns/overview-4-ui.png)

The user interface of the configuration consists of the following:
1. Instructions on how to set up the code pattern correctly
2. [Table Input Mapping](https://help.keboola.com/transformations/mappings/#table-input-mapping)
3. [Table Output Mapping](https://help.keboola.com/transformations/mappings/#table-output-mapping)
4. [Parameters Form](#parameters-form) of the code pattern
5. **Generate Code** button
6. Read-only [generated code](#generated-code)

### Input and Output Mapping

Table [Input](https://help.keboola.com/transformations/mappings/#table-input-mapping) 
and [Output](https://help.keboola.com/transformations/mappings/#table-output-mapping) Mapping can be created either
- **manually** as in ordinary transformations, or
- **automatically**, generated together with the code if the component supports it.

Follow the instructions at the top of the configuration page.

Below you can see an example mapping. It was generated by the `Snapshot - SCD` code pattern.

{: .image-popup}
![Screenshot -- Input / Output mapping](/transformations/code-patterns/overview-7-mapping.png)

### Parameters Form

The parameters determine the content of the generated code.
The form is generated dynamically based on the component specification in the Keboola Connection 
[Developer Portal](https://components.keboola.com/components). Remember to save your changes.

{: .image-popup}
![Screenshot -- Parameters](/transformations/code-patterns/overview-5-parameters.png)

### Generated Code

Generated code is read only, it cannot be adjusted manually. 
It is (re)generated by clicking the **Regenerate Code** button. 
This calls the [Generate Action](https://developers.keboola.com/extend/component/code-patterns/interface#generate-action) 
on the code pattern component with the actual parameters. The result is then saved and displayed.

{: .image-popup}
![Screenshot -- Generated Code](/transformations/code-patterns/overview-6-code.png)

After the code has been generated, you can [run the job](https://help.keboola.com/management/jobs/#running-jobs) the standard way.
