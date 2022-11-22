---
title: DataHub
permalink: /templates/datahub/
---

* TOC
{:toc}

The [DataHub](https://datahub.io/) template provides a one-click setup of an end-to-end flow for populating Keboola metadata 
into a DataHub data catalog. This includes extracting data from both the Telemetry and Metadata extractors 
before transforming the data in order to calculate table properties and lineage. You can choose whether or not to include schemas, 
properties, or tags from the DataHub destination component.

**The flow, in a nutshell:**

{: .image-popup}
![DataHub Flow](/templates/datahub/datahub-flow.png)

- First, the Metadata and Telemetry source components (extractors) will collect the data from your project or organization
    - The Telemetry extractor allows you to retrieve data pertaining to project or your entire organization. It helps you monitor the activities and usage of your Keboola Connection projects. It also helps Keboola calculate your project consumption.
    - The Metadata extractor downloads information from Keboola's APIs pertaining to various objects, users, etc. The metadata obtained by this source component can be used in addition with the default telemetry data pertaining to Keboola Connection projects to provide even more insights into the telemetry of your organization.

- In the transformations,  a single metadata table is created for transmitting information to DataHub. Lineage is also calculated by parsing component configurations. 

- In the final step, data will be pushed from storage to DataHub using the DataHub destination component. You will enter an API token and endpoint for your GMS (DataHub Metadata Service) server, as well as select the information you want to be included (e.g., properties, schemas, tags, etc.).

- Finally, you will run the entire flow (i.e., the sequence of all the prepared, above mentioned steps, in the correct order). The Metadata and Telemetry source components, all data manipulations and analyses, and the DataHub destination component, will be processed.

Template/Component Variations:

{: .image-popup}
![Variations](/templates/datahub/datahub-variations.png)
