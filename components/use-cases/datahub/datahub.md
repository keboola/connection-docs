---
title: DataHub
permalink: /components/use-cases/datahub/
---

* TOC
{:toc}

The DataHub use case template provides a one-click setup of an end-to-end flow for populating Keboola metadata 
into a DataHub data catalog. This includes extracting data from both the Telemetry and Metadata extractors 
before transforming the data to calculate table properties and lineage. You can choose whether or not to include schemas, 
properties, or tags from the DataHub writer.

**The flow, in a nutshell:**

pic

- First, the Metadata and Telemetry extractors will collect the data from your project or organization
    - The Telemetry Data extractor allows you to retrieve data about your project or about your whole organization. It helps you monitor activities and usage of your Keboola Connection projects. It also helps Keboola calculate your project consumption.
    - The metadata extractor downloads information from Keboola's APIs about various objects, users, etc. The metadata obtained by this extractor can be used in addition with the default telemetry data about Keboola projects to bring even more insights into the telemetry of your organization.

- In the transformations,  a singular metadata table is created for emitting information to DataHub. Lineage is also calculated by parsing component configs. 

- In the final step, data will be pushed from storage to Datahub using the Datahub writer. You will enter an API token and endpoint for your GMS server, as well as select what information you want to be included (aka properties, schemas, tags, etc)

- Finally, you will run the entire flow (i.e., the sequence of all the prepared, above mentioned steps, in the correct order). The metadata/telemetry source components, all data manipulations and analyses, and the DataHub writer, will be processed.

Template/Component Variations:

pic
