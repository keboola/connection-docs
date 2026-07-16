---
title: Job Queue
slug: 'extend/job-queue'
redirect_from:
    - /extend/docker-runner/
---


Job Queue is a core Keboola Service, which
provides an interface for running Keboola components. Every component in Keboola is
represented by a Docker image.
Running a component means creating and executing an [asynchronous job](/integrate/jobs/).

Developing functionality in [Docker](https://www.docker.com/) allows you to focus only on the application logic; all communication
with the [Storage API](https://api.keboola.com/?service=storage) will be handled by Job Queue. You can encapsulate any application into a Docker image
following a set of rules that will allow you to integrate the application into Keboola.

There is a [predefined interface](/extend/common-interface/) with Job Queue, consisting
mainly of a [folder structure](/extend/common-interface/folders/) and a [serialized configuration file](/extend/common-interface/config-file/).
All [components](/extend/component/), including our internal R and Python Transformations, are run using Job Queue.

## Workflow
The Job Queue functionality can be described in the following steps:

- Download and build the specified Docker image.
- Download all [tables](/extend/common-interface/folders/#dataintables-folder) and [files](/extend/common-interface/folders/#datainfiles-folder) specified in the input mapping from Storage.
- Create a [configuration file](/extend/common-interface/config-file/).
- Run [before processors](/extend/component/processors/) if there are any.
- Run the Docker image (create a Docker container).
- Run [after processors](/extend/component/processors/) if there are any.
- Upload all [tables](/extend/common-interface/folders/#dataouttables-folder) and
[files](/extend/common-interface/folders/#dataoutfiles-folder) in the output mapping to Storage.
- Delete the container and all temporary files.

When the component execution is finished, Job Queue automatically collects the exit code and the content of STDOUT and STDERR.
The following schema illustrates the workflow of running a dockerized component.

![Docker Workflow](/extend/job-queue/docker-runner.svg)

### Features
The component is responsible for these processes:

- Reading the configuration and source tables in CSV format and files (if specified)
- Writing the results to the predefined folders and files
- Proper handling of success/error results by setting an appropriate exit code

Job Queue is responsible for the following processes:

- **Authentication:** Job Queue makes sure the component is run by authorized users/tokens.
It is not possible to run a component anonymously. The component does not have an access to the Keboola token
itself, and it receives only limited information about the project and the end-user.
- **Starting and stopping** the component: Job Queue will boot a Docker container which contains the
component. This ensures the component runs in a precisely defined environment, which is guaranteed to
be the same for each component run. No component state is preserved (with the exception of the
[state file](/extend/common-interface/config-file/#state-file).
- **Reading and writing data** to Keboola Storage: Job Queue ensures a custom component
cannot access arbitrary data in the project. It will only receive the input mapping defined by the end user;
and only those outputs defined in the output mapping by the end user will be written to the project.
- **Component isolation**: Each component is run in its own Docker container, which is isolated from other
containers; the component cannot be affected by other running components. It may also be limited
to have no network access.

## API
The [Job Queue API](https://api.keboola.com/?service=job-queue) has API calls to

- run a [component](/extend/component/).
- [encrypt values](/overview/).
- [prepare the data folder](/extend/component/running/#preparing-the-data-folder).
- run [component actions](/extend/common-interface/actions/).
- run a [component](/extend/component/) with a [specified Docker image tag](https://api.keboola.com/?service=job-queue#post-/jobs), usable for [testing images](/extend/component/deployment/#test-live-configurations).

## Configuration
Components executed by Job Queue store their configurations in
[Storage API components configurations](https://api.keboola.com/?service=storage#tag--Component-Configurations).

When creating the configuration, use
[this JSON schema](https://github.com/keboola/docker-bundle/blob/master/Resources/schemas/configuration.json)
to validate the configuration before storing it. The configuration contains the following nodes,
all of them are optional:

- `parameters` --- an arbitrary object passed to the dockerized application itself
- `storage` --- configuration of [input and output mapping](/extend/common-interface/folders/); specific options correspond to the options of the
[unload data](https://keboola.docs.apiary.io/#reference/tables/unload-data-asynchronously) and
[load data](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/tables/-id-/import-async) API calls.
- `runtime` --- [runtime settings](/integrate/jobs/#job-runtime-configuration) (`tag`, `backend`, `parallelism`); most notably `runtime.tag`
pins the Docker image tag that jobs of this configuration run, which is the usual way of testing a development build of a component
- `processors` --- configuration of [Processors](/extend/component/processors/)
- `authorization` --- OAuth authorization [injected to the configuration](/extend/common-interface/oauth/); not stored in the component configuration
- `image_parameters` --- an arbitrary object passed from the [component](/extend/component/); not stored in the component configuration
- `action` --- an [action](/extend/common-interface/actions/) being executed; not stored in the component configuration
