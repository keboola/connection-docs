---
title: Data Streams
description: 'Receive streaming event data straight into Keboola Storage, with no data source connector, middleware or extra pipeline steps to set up.'
slug: 'storage/data-streams'
redirect_from:
    - /integrate/data-streams/
    - /integrate/push-data/
---



Keboola's Data Streams feature allows users to receive streaming event data directly into Keboola Storage without needing additional steps, such as setting up a data source, using middleware, or developing a custom component. It simplifies the process and enables ad hoc messaging from your system to Keboola Storage.

## Key Benefits
The most important benefits of the Data Streams feature include:

- **Real-Time Data Ingestion:** Stream events in near-real time for immediate access to data and actionable insights.
- **Scalable Infrastructure:** Efficiently handle millions of events per day, ensuring seamless scalability.
- **Simplified Integration:** Connect your systems directly to Keboola without middleware, reducing setup time and costs.
- **Increased Efficiency:** Automate processes, eliminating manual data entry and updates.
- **Real-Time Updates:** Trigger actions instantly based on real-time event data.

## Source Types

When creating a data stream, you choose a **source type** that determines how data is ingested. Two source types are available:

| Source Type | Description |
|---|---|
| **HTTP** | A generic webhook endpoint that accepts any JSON payload via HTTP POST. |
| **OpenTelemetry (OTLP)** | An OTLP/HTTP endpoint that accepts logs, metrics, and traces from any OpenTelemetry-compatible SDK or collector. |

## How It Works
The Data Streams feature receives messages via HTTP and saves them into the database once predefined conditions (e.g., record count, total size, or time) are met. The service uses Keboola's [Stream API](https://stream.keboola.com/v1/documentation/) for efficient data management. [Learn more](/storage/data-streams/reference/)

### Configure an OpenTelemetry (OTLP) Data Stream

Choosing the **OpenTelemetry (OTLP)** source type turns Keboola into a drop-in [OTLP/HTTP](https://opentelemetry.io/docs/specs/otlp/#otlphttp) endpoint. Any official OpenTelemetry SDK or collector can export directly to Keboola, and the incoming telemetry data lands in Storage — queryable alongside your business data.

When you create an OTLP data stream, the app sets up a destination table per signal (**logs**, **metrics**, **traces**) with a default column mapping, so there is nothing to map by hand before you start sending data.

For full setup instructions, SDK examples, use cases, and configuration details, see the dedicated **[OpenTelemetry (OTLP) Data Streams](/storage/data-streams/opentelemetry/)** page.

[OpenTelemetry](https://opentelemetry.io/) is an open-source observability framework that captures three types of signals from your web apps, APIs, and services:

- **Logs** — application events and errors (e.g., failed requests, warnings, debug messages).
- **Metrics** — performance measurements over time (e.g., request latency, CPU usage, error rates).
- **Traces** — end-to-end request flows across services (e.g., an API call that touches multiple microservices).

Choosing the **OpenTelemetry (OTLP)** source type when [creating a data stream](/storage/data-streams/) turns Keboola into a drop-in [OTLP/HTTP](https://opentelemetry.io/docs/specs/otlp/#otlphttp) endpoint. Any official OpenTelemetry SDK or collector can export directly to Keboola, and the incoming telemetry data lands in Storage — queryable alongside your business data.

## Why Send Telemetry to Keboola?

Your web apps, APIs, and services already generate telemetry data. Typically, this data lives in a dedicated monitoring tool (e.g., Datadog, New Relic, Grafana) while your business data lives in Keboola. When you need to understand how application performance affects business outcomes, you have to export data, build custom pipelines, or switch between tools.

With OTLP source support in Data Streams, your telemetry and business data live side by side in Keboola Storage. This lets you:

- **Correlate application errors with revenue impact** — join error logs with transaction records to see how outages affect orders.
- **Connect API latency to conversion rates** — analyze whether slow response times cause drop-offs in user workflows.
- **Track deployment activity alongside business KPIs** — measure whether a new release improved or degraded key metrics.
- **Monitor LLM agent or pipeline performance** — trace AI agent activity and cost alongside product usage data.

## Pricing
Data Streams pricing varies based on the number of streams and the volume of ingested data. Please contact our support team for more details.

## Technical Documentation
For the Stream API, column types, mapping templates, import conditions, and delivery guarantees, see the
[Data Streams Reference](/storage/data-streams/reference/). For an end-to-end example (ingesting GitHub
webhook events), follow the [Data Streams Tutorial](/storage/data-streams/tutorial/).

**Next:** [Data Streams Tutorial →](/storage/data-streams/tutorial/)
