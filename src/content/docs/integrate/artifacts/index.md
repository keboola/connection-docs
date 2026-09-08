---
title: Artifacts
slug: 'integrate/artifacts'
---


*Note: This is a preview feature and as such may change considerably in the future. The project must have an `artifacts` feature enabled.*

**Artifacts** are additional files that can be produced or consumed by a [component](/extend/component). 

See [Tutorial](/integrate/artifacts/tutorial) for step-by-step example.

## Introduction
In some cases it's useful if a component not only extracts, transforms or uploads data, but also generate some other output, metadata or other runtime-discovered data.
These could be for example:
- AI models
- performance graphs of such models
- status updates from long-running tasks
- documentation
- data quality checks from in-progress tasks

These additional information can be stored in artifacts and processed by another component or 3rd party tool.

## Storage
Artifacts are stored in Keboola File Storage.

## Types of artifacts
There are three types of artifacts for now `runs`, `custom` and `shared`. 
The type specifies which components will have access to the artifact or which artifacts to download for the component to process.
Types are used in a configuration of a consumer component to specify which artifacts to download. 

- **runs** - artifacts from previous runs of the same configuration

- **custom** - artifacts from previous runs of a different configuration. The configuration which produced the artifacts will be defined in the consumer configuration (configurationId, componentId, branchId)

- **shared** - artifacts shared within an orchestration

`runs` and `custom` types are the same from the producer point of view. To produce a `shared` artifact, it has to be written into a `shared` folder. Read more in [File structure](#file-structure) section.

## File structure
Artifact is a unique set of files associated with a successful job, component and configuration.
A component can either produce or consume artifacts or both.

### Produce
To produce an artifact, store one or more files in the following `output` directories. Subdirectories are also supported.
- `/data/artifacts/out/current` to create an artifact of type `runs` / `custom`. 
- `/data/artifacts/out/shared` to create an artifact of type `shared`, which can be accessed by any component within the same orchestration.

After the component job is finished all files and directories inside `current` and `shared` folders will be compressed into an archive and uploaded to File Storage with corresponding tags as a `artifact`.

### Consume
To consume created artifacts you have to specify, in the configuration of a component, which artifacts (type) to download.
 - `runs` to download artifacts produced by the same configuration and component. These will be stored in `/data/artifacts/in/runs/jobs/job-%job_id%` directory.
 - `custom` to download artifacts produced by another configuration or component. These will be stored in `/data/artifacts/in/custom/jobs/job-%job_id%` directory.
 - `shared` to download artifacts created within the same orchestration by any artifact producing component that has already finished. These will be stored in `/data/artifacts/in/shared/jobs/job-%job_id%` directory.

## Configuration
Each type of artifact has a separate node in configuration. All the types can be used simultaneously.
Each type node has an attribute "enabled", which enables or disables download of the corresponding artifact type.

### Runs
 - **enabled** [true|false] - enable or disable download of this artifact type
 - **filter** 
   - **date_since** - only artifacts from jobs younger than this will be downloaded
   - **limit** - maximum number of the latest jobs from which to download artifacts 

### Custom
- **enabled** [true|false] - enable or disable download of this artifact type
- **filter**
    - **branch_id**, **component_id**, **config_id**  - specify the configuration to download artifacts from
    - **date_since** - only artifacts from jobs younger than this will be downloaded
    - **limit** - maximum number of the latest jobs from which to download artifacts

### Shared
- **enabled** [true|false] - enable or disable download of this artifact type

Full configuration example with all artifact types:

```json
{
  "parameters": {},
  "artifacts": {
    "runs": {
      "enabled": true,
      "filter": {
        "date_since": "-7 days",
        "limit": 5
      }
    },
    "custom": {
      "enabled": true,
      "filter": {
        "component_id": "keboola.python-transformation",
        "config_id": "12345",
        "branch_id": "default",
        "date_since": "-7 days",
        "limit": 5
      }
    },
    "orchestration": {
      "enabled": true
    }
  }
}
```

## Artifacts life-cycle in a job
Job runner checks if the project has enabled `artifacts` feature.
Job runner checks the configuration of the component.
If artifacts are enabled, it downloads artifacts to corresponding folders as configured (i.e. `runs`, `custom`, `shared`) and unzips them.

Component process start and the component can:

- access and process the downloaded artifacts in shared or custom directory

- write  artifacts to `current` or `shared` directory

Component finishes and job runner does:

- gzip the content of runs/current

- tag the gzipped file with jobId, componentId, configId, runId, branchId and other tags if needed

- upload the file to File Storage 

## File size limit
All the artifacts produced by a job shouldn’t be bigger than 1 GB.
