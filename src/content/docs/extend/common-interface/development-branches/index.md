---
title: Development branches
slug: 'extend/common-interface/development-branches'
---


Development branches are a feature for managing change in Keboola projects. Refer to our [user documentation](/components/branches/) 
to learn more about how development branches function. 

:::caution[Public Beta]
This feature is currently in public beta. Please provide feedback using the feedback button in your project.
:::

## Running a Component in a Branch

A component that uses the [Common Interface](/extend/common-interface/) can be run in a branch without any changes to the code. Notable exceptions include 
components that modify external resources (e.g., database writers) and those that use [forwarded Storage tokens](/extend/common-interface/environment/#environment-variables) to interact with the Storage API. 

### Is a Component Executed in a Branch Context?

When the [Job Queue](/extend/job-queue/) executes a job in a branch, it sets the [`KBC_BRANCHID` environment variable](/extend/common-interface/environment/#environment-variables) to the current branch ID, which is unique accross the stack. 

Typically, the fact that a component is executed in a branch is not very important to the component itself. It behaves the same way, and the Keboola job runner does all the heavy lifting.

The exception is when a component directly interacts with the Storage API using a forwarded Storage token; it must then consider the branch ID. These components are subject to a separate review by Keboola to verify correct implementation.  

### Input and Output Mapping in a Development Branch

#### Write

When writing data to Storage, the bucket name in the [input mapping](/extend/component/tutorial/input-mapping/) is automatically prefixed with the branch's internal ID to ensure that data in the production bucket is not overwritten.

#### Read

A component first checks for a development version of the production bucket when reading data from Storage. If such a bucket exists, it is used; otherwise, the data is read from the production bucket. This prevents the need to duplicate data extraction jobs in development branches.

### Configuration State in a Development Branch

Configuration [states](/integrate/storage/api/configurations/#state) are stored separately for each development branch and are not merged back to the main branch upon merging of the branch itself.

### Components Interacting with External Resources

Extra precautions are necessary for components that interact with external resources to prevent unintended impacts on production data.

For example, in a production environment, a Snowflake writer might write to the PROD_SCHEMA schema in a Snowflake database. Running this writer in a development 
branch without appropriate safeguards could result in writing data intended for development to the production schema. Therefore, operational restrictions apply to 
certain jobs in development branches based on the component’s features:

* **dev-branch-configuration-unsafe**: These components can be run in a development branch if `{configuration:{runtime: {safe: true}}}` is set in their configuration. This can be adjusted via the API or through the *Safe for run in branch* toggle in the configuration detail in the UI. The job runner will verify the safety status before execution. This feature is automatically set for applications and writers. It's not set for extractors. 
* **dev-branch-job-blocked**: These components are not permitted to run in development branches under any circumstances.
* **dev-mapping-allowed**: These components are allowed to use development buckets in their default branch input mappings, which is typically restricted. 

For details on a component’s features, you can consult the [Developer Portal API](https://api.keboola.com/?service=developer-portal#get-/apps/-app-) or the [Component List in Storage API](https://api.keboola.com/?service=storage#get-/v2/storage). 

To request changes to your component's features, please use the support button in your project to contact our support team. 
