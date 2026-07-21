---
title: Data Streams
description: "Keboola's Data Streams feature allows users to receive streaming event data directly into Keboola Storage without needing additional steps, such as setting up…"
slug: 'storage/data-streams'
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
The Data Streams feature receives messages via HTTP and saves them into the database once predefined conditions (e.g., record count, total size, or time) are met. The service uses Keboola's [Stream API](https://stream.keboola.com/v1/documentation/) for efficient data management. [Learn more](https://developers.keboola.com/integrate/data-streams/overview/)

### Create a Data Stream
Follow these steps to create a data stream:

- Navigate to **Storage > Data Streams** and click **Create Data Stream**.
- **Choose a source type** — either **HTTP** (generic webhook) or **OpenTelemetry (OTLP)**.
- **Name the data stream**, e.g., "my-first-data-stream." The name of the table will be filled automatically based on the stream name, but you can change it if needed.
- Once the stream is created, you can **add a description** for better orientation within the project.

### Configure an HTTP Data Stream
#### Data stream URL
For every data stream, a unique "Data Stream URL" is generated. You can use it in your application to send events. This URL cannot be changed.

#### Table statistics
This dashboard shows the status of data waiting for import vs. imported data.

![Screenshot - Data Streams Table Statistics](/storage/data-streams/data-streams-pic1.png)

#### Table settings
In your table settings, you can:

- Change the name of the stream.
- Add a column or define your own structure using the PATH or JSONNET template. [Learn more](https://developers.keboola.com/integrate/data-streams/overview/#template-jsonnet)
- Edit column names (available only if you create a new table within the stream).
- Delete a column (available only if you create a new table within the stream).

:::caution
**Important:** Changing the table's name will create a new table, and the stream will import data into that table.
:::

:::note[No primary key support]
Data streams do **not** support primary keys --- every incoming event is **appended** to the
table and no deduplication happens on import.

If you need unique rows (e.g., one row per event ID), it is up to you to decide whether
deduplication is required and to handle it **downstream**: create a
[deduplication transformation](/storage/tables/#primary-key-deduplication) that reads the stream
table and writes the result to a new table where the
[output mapping](/transformations/mappings/#output-mapping) primary key performs the
deduplication on load. Schedule it to run regularly with a [conditional flow](/flows/).
[Kai](/kai/) can help you build both the transformation and the scheduled flow.
:::

#### Sample codes for integration
For easier use, we've prepared a few examples of how to send data to a stream using Python, Javascript, and Bash.

#### Import conditions
In this section, you can set a few conditions for importing data. If any of these three conditions are met, events are instantly uploaded to the destination table. You can set the import time frequency, the size of the imported data, or the number of imported records. [Learn more](https://developers.keboola.com/integrate/data-streams/overview/#conditions)

#### Payload test
Here, you can simulate your payload and test it instantly with a table preview to see how the data will be imported before deploying it into production.

### Configure an OpenTelemetry (OTLP) Data Stream

Choosing the **OpenTelemetry (OTLP)** source type turns Keboola into a drop-in [OTLP/HTTP](https://opentelemetry.io/docs/specs/otlp/#otlphttp) endpoint. Any official OpenTelemetry SDK or collector can export directly to Keboola, and the incoming telemetry data lands in Storage — queryable alongside your business data.

When you create an OTLP data stream, three destination tables (**logs**, **metrics**, **traces**) are automatically created with pre-configured column mappings.

For full setup instructions, SDK examples, use cases, and configuration details, see the dedicated **[OpenTelemetry (OTLP) Data Streams](/storage/data-streams/opentelemetry/)** page.

## Pricing
Data Streams pricing varies based on the number of streams and the volume of ingested data. Please contact our support team for more details.

## Technical Documentation
For further details and API integration steps, refer to our [comprehensive documentation](https://developers.keboola.com/integrate/push-data/).
