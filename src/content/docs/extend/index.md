---
title: Extending Keboola
slug: 'extend'
---

As an open system consisting of many built-in, interoperating components,
such as Storage or Extractors, [Keboola](/overview/) can be easily extended.
We encourage you to [**build your own components**](/extend/component/tutorial), whether for
your own use or to be offered to other Keboola users and customers.

There are two main options for extending Keboola: (a) creating your own **component** and (b) using **Generic 
Extractor** to build an extractor for a RESTful API.

## Advantages of Extending Keboola

Depending on your role, extending Keboola offers various advantages:

- If you already are a **Keboola customer**: 
    - Create your own component to convert your business problem into cloud. We will take care of the technical arrangements around running it.
    - Create extractors or writers for communicating with your legacy systems, even if they are completely non-standard.
    - Create components to experiment with new business solutions. No need to ask your IT to allocate resources to you. [Fail fast](https://en.wikipedia.org/wiki/Fail-fast#Business).
    - Easily access data from many different sources.
- If you are an **external company**:
    - Create connectors (Extractors/Writers) so that Keboola users can easily connect to your service and broaden your customer base.
    - Create applications containing or using your algorithms and easily "deploy" them to Keboola customers. They won't be exposed to end-users, neither will be the end-user data exposed to you.
	- Easily deliver the data back to your customers.
- If you are a **data scientist**:
    - Create applications for delivering your work to your customer. We will take care of the technical arrangements. No need to rent servers and feed data to them.
    - Make your application or algorithm available to all existing Keboola subscribers and implementation partners.
    - Focus only on areas of your product where you are adding value.
    - Let Keboola be in charge of the billing.

## Component
A [component](/extend/component/) can be used as:

- **Extractor**, allowing customers to get data from new sources. It only processes input tables from external sources (usually API).
- **Application**, further enriching the data or adding value in new ways. It processes input tables stored as CSV files or database tables and generates result tables as CSV files or database tables.
- **Transformation**, allowing customers to modify their data. It is a constrained form of an application.
- **Writer**, pushing data into new systems and consumption methods. It does not generate any data in Keboola projects.
- **Processor**, adjusting the inputs or outputs of other components. It has to be run together with one of the above components.

All components are run using [Job Queue](/extend/job-queue/), a service that takes
care of their authentication, starting, stopping, isolation, reading data from and writing it to Keboola Storage. They must adhere to the
[common interface](/extend/common-interface/). Creating components requires an elementary knowledge of [Docker](https://www.docker.com/why-docker).
They can be implemented in virtually any programming language and be fully customized and tailored to anyone's needs.
They also support OAuth authorization. To get started with building a component, see our [**tutorial**](/extend/component/tutorial/).

## Generic Extractor
[Generic Extractor](/components/extractors/generic-extractor/) is a Keboola component acting like a
customizable [HTTP REST client](/components/extractors/generic-extractor/tutorial/rest/). It can be configured to extract data 
from virtually any API and offers a vast amount of configuration options. With Generic Extractor, you can build an 
entirely new extractor for Keboola in less than an hour. 

Components based on Generic Extractor are built using [JSON configuration](/components/extractors/generic-extractor/tutorial/) and a
[published template](/components/extractors/generic-extractor/publish/). They have a predefined UI, require no knowledge of Docker or
other tools, and they use a Keboola owned [repository](https://github.com/keboola/kbc-ui-templates/). To get 
started with Generic Extractor, see our [**tutorial**](/components/extractors/generic-extractor/tutorial/).
