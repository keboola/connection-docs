---
title: Artifacts Tutorial
slug: 'extend/common-interface/artifacts/tutorial'
description: "Produce and consume artifacts from a Python transformation step by step, using curl against the Storage API."
redirect_from:
    - /integrate/artifacts/tutorial/
---

<!-- Tutorial-type page. Moved from developers.keboola.com/integrate/artifacts/tutorial/ (PRDCT-582); calls consistent with the artifact filesystem paths and the Storage configurations API (2026-06-22 audit, PRDCT-368). -->

This tutorial will show you how to work with artifacts.
In the following example we will use Python Transformation component to produce and consume artifacts.
But these principles would work inside any component.

In the examples, we use the `curl` console tool to interact with our APIs.

:::note
The `artifacts` feature must be enabled in your project; contact [support@keboola.com](mailto:support@keboola.com) to enable it.
Artifacts configuration can be created or edited only through the [Storage API](https://api.keboola.com/?service=storage), not in the UI.
:::

## Examples

For each example we will need [Storage API Token](/management/project/tokens/) to make the API call.

1. Obtain a Storage API token from the user interface of your project, see this [Guide](/management/project/tokens).
2. Store the token and url to the environment variable.

    ```shell
    export STORAGE_API_HOST="https://connection.keboola.com"
    export TOKEN="..."
    ```

   Use the connection host of your [stack](/overview/#stacks).

### 1. Produce artifact

This is very simple example. We will just create a Python Transformation, which will write a file to the artifacts "upload" folder.
This file will be then uploaded as "artifact" to File Storage. 

1. In your Keboola project, create a new Python transformation, and paste this code into it:
    ```
    import os        
    with open("/data/artifacts/out/current/myartifact1", "w") as file:
      file.write("this is my artifact file content")
    ```

    ![Artifacts - transformation](/extend/common-interface/artifacts/artifacts-tutorial-1.png)

2. Run the transformation - it should upload the file to File Storage as "artifact"

    ![Artifacts - Job](/extend/common-interface/artifacts/artifacts-tutorial-2.png)

3. The file is now visible in File Storage with appropriate tags

   ![Artifacts - File Storage](/extend/common-interface/artifacts/artifacts-tutorial-3.png)

### 2. Produce & consume artifacts

To consume (download) artifacts for component to work with, we need to enable and configure artifacts download in the configuration of a component.

We will create another configuration of the Python transformation via API.

The artifacts part of the configuration will look like this.
It will enable download of artifacts of type `runs` with limit 5, which means this will download artifacts created by the last 5 runs of the same component configuration

   ```json
   {
     "artifacts":{
       "runs":{
         "enabled":true,
         "filter":{
           "limit":5
         }
       }
     }
   }
   ```

The script of the transformation will look like following. 
Files read from `/data/artifacts/in/runs/*/*` will be displayed at output - these are the artifact files downloaded.
The script will also generate a new artifact and write it to `/data/artifacts/out/current/myartifact1` as in previous example.

```python
import os
import glob

# Download
print(glob.glob("/data/artifacts/in/runs/*/*"))

# Upload
with open("/data/artifacts/out/current/myartifact1", "w") as file:
  file.write("value1")
```
1. Run this curl command to create the configuration:

    ```shell
    curl -X POST "$STORAGE_API_HOST/v2/storage/branch/default/components/keboola.python-transformation-v2/configs" \
    -H "X-StorageApi-Token: $TOKEN" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'configuration={"parameters":{"blocks":[{"name":"Block 1","codes":[{"name":"artifacts","script":["import os\nimport glob\n\n# Download\nprint(glob.glob(\"/data/artifacts/in/runs/*/*\")) \n\n# Upload\nwith open(\"/data/artifacts/out/current/myartifact1\", \"w\") as file:\n  file.write(\"value1\")"]}]}]},"artifacts":{"runs":{"enabled":true,"filter":{"limit":5}}}}' \
    --data-urlencode 'name=Artifacts upload & download' \
    --data-urlencode 'description=Test Artifacts upload & download'
    ```
1. Run the configuration (in the UI, or through the [Jobs API](/management/jobs/api/#run-a-job)) and open its job log. The first run prints `[]`: there are no previous runs to download from yet. Run it again and the log lists `/data/artifacts/in/runs/jobId-<first job id>/myartifact1`.

### 3. Consume artifacts from different component
Similar to previous example we will create a configuration of Python Transformation component. 
But this time we will download artifacts produced by the configuration from `Example 2`.

1. Export the id of the previously created configuration into an environment variable:
    ```shell
    export CONFIG_ID="..."
    ```
   
2. Run curl command
    ```shell
    curl -X POST "$STORAGE_API_HOST/v2/storage/branch/default/components/keboola.python-transformation-v2/configs" \
    -H "X-StorageApi-Token: $TOKEN" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'configuration={"parameters":{"blocks":[{"name":"Block 1","codes":[{"name":"artifacts","script":["import os\nimport glob\n\n# Download\nprint(glob.glob(\"/data/artifacts/in/custom/*/*\"))"]}]}]},"artifacts":{"custom":{"enabled":true,"filter":{"component_id":"keboola.python-transformation-v2","config_id":"'"$CONFIG_ID"'","branch_id":"default","limit":5}}}}' \
    --data-urlencode 'name=Artifacts upload & download' \
    --data-urlencode 'description=Test Artifacts upload & download'    
    ```
3. Run the consumer configuration and open its job log: it lists the producer's artifact under `/data/artifacts/in/custom/jobId-<producer job id>/`.
   
The whole configuration now looks like this (with the numeric ID you exported in place of `1234567`):

   ```json
    {
        "parameters": {
            "blocks": [
                {
                    "name": "Block 1",
                    "codes": [
                        {
                            "name": "artifacts",
                            "script": [
                                "import os\nimport glob\n\n# Download\nprint(glob.glob(\"/data/artifacts/in/custom/*/*\"))"
                            ]
                        }
                    ]
                }
            ]
        },
        "artifacts": {
            "custom": {
                "enabled": true,
                "filter": {
                    "component_id": "keboola.python-transformation-v2",
                    "config_id": "1234567",
                    "branch_id": "default",
                    "limit": 5
                }
            }
        }
    }
   ```

### 4. Shared artifacts
This example will show how to share artifacts within an orchestration
We will create two configurations of Python Transformation component.
One will produce a shared artifact and the other will consume it. 
Both configurations needs to be in the same orchestration.
The configuration producing artifact needs to be in a phase that precedes the consuming one.

1. Create "Producer" configuration
   The Python code will write a file into a shared folder:

   ```python
   import os
   path = "/data/artifacts/out/shared"
   with open(path + "/myartifact3", "w") as file:
     file.write("value1")
   ```
   
   Run curl command to create the configuration:

   ```shell
    curl -X POST "$STORAGE_API_HOST/v2/storage/branch/default/components/keboola.python-transformation-v2/configs" \
    -H "X-StorageApi-Token: $TOKEN" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'configuration={"parameters":{"blocks":[{"name":"Block 1","codes":[{"name":"Upload shared","script":["import os\npath = \"/data/artifacts/out/shared\"\nwith open(path+\"/myartifact3\", \"w\") as file:\n  file.write(\"value1\")"]}]}]},"artifacts":{"runs":{"enabled":true,"filter":{"limit":5}}}}' \
    --data-urlencode 'name=Artifacts shared Producer' \
    --data-urlencode 'description=Artifacts upload shared'    
    ```

2. Create "Consumer" configuration

   The artifacts configuration:
   ```json
   {
      "artifacts": {
         "shared": {
            "enabled": true
         }
      }
   }
   ```
   
   The Python script:

   ```python
   import os
   import glob
   print(glob.glob("/data/artifacts/in/shared/*/*")) 
   ```
   
   Run curl command to create the configuration:
   
   ```shell
    curl -X POST "$STORAGE_API_HOST/v2/storage/branch/default/components/keboola.python-transformation-v2/configs" \
    -H "X-StorageApi-Token: $TOKEN" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'configuration={"parameters":{"blocks":[{"name":"Block 1","codes":[{"name":"Download shared","script":["import os\nimport glob\n\nprint(glob.glob(\"/data/artifacts/in/shared/*/*\")) "]}]}]},"artifacts":{"shared":{"enabled":true}}}' \
    --data-urlencode 'name=Artifacts shared Consumer' \
    --data-urlencode 'description=Artifacts download shared'    
    ```

3. Now put each of the configurations into a [Legacy Flow](/flows/flows-legacy/) (orchestration): "Artifacts shared Producer" into phase 1 and "Artifacts shared Consumer" into phase 2.
   <!-- VERIFY(owner): do shared artifacts also work between tasks of a Conditional Flow (keboola.flow)? If yes, this example and its screenshot should use the Flows UI (2026-09-09 review). -->

   ![Artifacts orchestration](/extend/common-interface/artifacts/artifacts-tutorial-4.png)

4. Run it. The consumer's job log lists `/data/artifacts/in/shared/jobId-<producer job id>/myartifact3`.
