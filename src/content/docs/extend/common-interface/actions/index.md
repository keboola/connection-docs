---
title: Actions
slug: 'extend/common-interface/actions'
---


Actions provide a way to execute very quick tasks in a single Component, using a single code base.
The default component's action (`run`) executes as a background, asynchronous job. It is queued, has plenty of
execution time, and there are cases when you might not want to wait for it. Apart from the default `run`, there
can be synchronous actions with limited execution time and you must wait for them. When we refer to
**actions**, we mean *synchronous actions*. Using actions is fully optional.

## Use Case
For example, in our database extractor, the main task (`run` action) is the data extraction itself. But we also want to be
able to test the database credentials and list tables available in the database.
These tasks would be very helpful in the UI. It is not possible to do these things directly in the browser. Setting up a
separate component would bring an overhead of maintaining both the extractor's Docker image and the new component.

## Solution
For each Component, you can specify other actions (apart from the default `run`). These
actions will be executed using the same Docker image, but [Job Queue](/extend/job-queue/) will wait for its execution and use
the returned value as the API response. So, these additional actions are executed *synchronously* and have a very
limited execution time (maximum 30 seconds). These actions also cannot access Storage.

The [configuration file](/extend/common-interface/config-file/#configuration-file-structure)
contains the `action` property with the name of the currently executed action. Just grab the value and act accordingly.
All actions must be explicitly specified in the component configuration in [Developer Portal](https://components.keboola.com/).

## Running Actions
Actions are available through the [API](https://api.keboola.com/?service=sync-actions#post-/actions).
They do not load the configuration from Storage, so you need to fully specify the whole configuration in the request body.
If any of your parameters are encrypted, they will be decrypted before they are passed to your component.

Do not specify the `action` attribute in the request body, it is already in the URI. Use any of `parameters` and `runtime` inside the `configData` root element as you would when creating an asynchronous job. Using `storage` configuration in actions makes no sense, because actions cannot read or write to Storage. For instance:

```json

{
    "configData": {
        "parameters": {
            "key": "val"
        }
    }
}

```

### Return Values

As the component output is passed back through the API, all output from an action **MUST** be JSON (except for errors).

If your component outputs an invalid JSON on its STDOUT, an application error will be raised.

## Handling User and Application errors

Actions use the same [exit codes](/extend/common-interface/environment/#return-values) as the default `run` action.

If an user or application error is detected, STDERR/STDOUT is handled as the message string and is returned to the user. The message is wrapped into a standardized structure.

For example

```python
print('user error message')
sys.exit(1)
```

yields this message on the API (HTTP status code 400)

```json
{
  "status": "error",
  "error": "User error",
  "code": 400,
  "message": "user error message",
  "exceptionId": "docker-7ed4c3b599776e8a2a84a7f185f5f7f2",
  "runId": 0
}
```

and

```python
print('application error message')
sys.exit(2)
```

yields this message on the API (HTTP status code 500)

```json
{
  "status": "error",
  "error": "Application error",
  "code": 500,
  "message": "Contact support@keboola.com and attach this exception id.",
  "exceptionId": "docker-2a51922e0753cf78297ad6d384200206",
  "runId": 0
}
```

## Limits

**Sync actions may not read from or write data to the Storage.**
Otherwise actions share the same limits as the default `run` action, only the execution time is limited to 30 seconds.
This time does not include pulling the Docker image.
