---
title: Code Pattern Quick Start
slug: 'extend/component/code-patterns/tutorial'
---


Code patterns are a special type of [component](/extend/component/). 
Their behavior is specified in their  [interface](/extend/component/code-patterns/interface).

The instructions below refer to the general [component quick start](/extend/component/tutorial/), 
highlighting the steps specific to code patterns.

## Creating Component
First, follow the common steps for [creating a component](/extend/component/tutorial/):

- [Before you start](/extend/component/tutorial/#before-you-start) 
- [Create a component](/extend/component/tutorial/#creating-component)
- [Create a deployment account](/extend/component/tutorial/#creating-deployment-account)

Select `Code Pattern` as the type.

![Screenshot -- Add component](/extend/component/code-patterns/tutorial-1-add-component.png)

Modify the settings described in [Interface - Developer Portal](/extend/component/code-patterns/interface#developer-portal).

## Implementation
Go on following the [component quick start](/extend/component/tutorial/):

- [Initialize a component](/extend/component/tutorial/#initializing-component) 
- [Build a component](/extend/component/tutorial/#building-component)

Learn how the whole [code generation process](/extend/component/code-patterns/interface#code-generation-process) works.

**Implement the Generate action** as specified in [Interface - Generate Action](/extend/component/code-patterns/interface#generate-action):

- First, load the [configuration](/extend/component/code-patterns/interface#configuration).
- Validate the configuration, `action = generate` is expected.
- Do not implement other actions (not even `run`).
- In case of an error, use the correct [return value](/extend/common-interface/environment/#return-values).
- Generate code based on the configuration.
- Write the result in the standard [output format](/extend/component/code-patterns/interface#output-format) to `stdout`.
- Exit with the `exit code = 0` if successful.

## Running Component
Unlike other components, the code pattern component [**cannot be run**](/extend/component/tutorial/#running-component),
and will be **invisible in the user interface until it is [published](#publishing-component)**.

However, there are two other ways to try it as a component, as described below.

### Run via API
The first option is to call the [generate action](/extend/component/code-patterns/interface#generate-action) via the API:

- You can test that the component returns the desired results based on the specified inputs.
- Use the [Run Component Action](https://api.keboola.com/?service=sync-actions#post-/actions) API call.
- An [API token](/management/project/tokens/) is needed.

### Modify Transformation via API
The second option is to modify the transformation to use an unpublished code pattern.

#### Create empty transformation
First, click **Transformations** on the project menu. Then click **New Transformation** to create a new transformation.

![Screenshot -- Transformations page](/extend/component/code-patterns/tutorial-2-project.png)

In the modal, click on the selected **type of the transformation**.

![Screenshot -- Add new transformation modal](/extend/component/code-patterns/tutorial-3-modal.png)

Fill in the **name** and, optionally, the **description**. Do not select any code pattern.

![Screenshot -- Net transformation](/extend/component/code-patterns/tutorial-4-new-transformation.png)

You have created an empty transformation.

#### Set code pattern to transformation

**Make note of the component and configuration ID from the URL.** You will need them in the API calls.

```
/admin/projects/{PROJECT_ID}/transformations-v2/{COMPONENT_ID}/{CONFIGURATION_ID}
```

**Set the code pattern to the transformation via [Storage API](/overview/api/).**

Load the configuration in the JSON format via the [Configuration Detail](https://api.keboola.com/?service=storage#get-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-) API call.

```
curl \ 
  --include \
  --header "X-StorageApi-Token: {API_TOKEN}" \
'{STORAGE API}/v2/storage/components/{COMPONENT_ID}/configs/{CONFIGURATION_ID}'
```

This is an example response, some keys are omitted.

```json
{
  "id": "1234",
  "name": "API test",
  "configuration": {}
}
```

It is necessary to set the **ID of the code pattern component** to the configuration.

```json
{
  "configuration": {
    "runtime": {
      "codePattern": {
        "componentId": "keboola.example-pattern"
      }
    }
  }
}
```

Update the configuration via the [Update Configuration](https://api.keboola.com/?service=storage#put-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-) API call. 
JSON must be url-encoded.

```
curl 
 --include \
 --request PUT \
 --header "X-StorageApi-Token: {API_TOKEN}" \
 --header "Content-Type: application/x-www-form-urlencoded" \
 --data-binary "configuration=%7B%22runtime%22%3A%7B%22codePattern%22%3A%7B%22componentId%22%3A%22keboola.example-pattern%22%7D%7D%7D" \
'{STORAGE API}/v2/storage/components/{COMPONENT_ID}/configs/{CONFIGURATION_ID}'
```

This is an example response, some keys are omitted.

``` json
{
  "id": "1234",
  "name": "API test",
  "configuration": {
    "runtime": {
      "codePattern": {
        "componentId": "keboola.example-pattern"
        }
      }
   }
}
```

The transformation now uses the code pattern, and you can **test it in the [user interface](/transformations/code-patterns/#configuration)**.

## Publishing Component
Make sure the component is set up according to [Interface - Developer Portal](/extend/component/code-patterns/interface#developer-portal).
Then follow the tutorial [Publish Component](/extend/publish/).

## Next Steps
- [Interface](/extend/component/code-patterns/interface) describes how the code patterns work internally.
- [Code Patterns Help](/transformations/code-patterns/) shows the code patterns from the user's point of view.
