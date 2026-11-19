---
title: Create and configure a data stream
slug: 'storage/data-streams/create'
sidebar:
  label: Create a stream
description: 'Create a data stream in the app, set its table, import conditions and payload test, choose a delivery guarantee, and send events from Apache Kafka.'
---

Work through these tasks in order for a new HTTP stream, or jump to the one you need. For what Data Streams are, see the [overview](/storage/data-streams/); for column types, templates and the Stream API, see the [reference](/storage/data-streams/reference/).

<!-- How-to-type page. Source: the Data Streams overview and the Data Streams reference as they stood before the 2026-11-19 section split. Text moved, steps not re-run in the app. -->

## Create a data stream

**Goal:** a data stream that your systems can send events to.

1. Navigate to **Storage > Data Streams** and click **Create Data Stream**.
2. **Choose a source type** — either **HTTP** (generic webhook) or **OpenTelemetry (OTLP)**.
3. **Name the data stream**, e.g., "my-first-data-stream." The name of the table will be filled automatically based on the stream name, but you can change it if needed.
4. Once the stream is created, you can **add a description** for better orientation within the project.

**Result:** The stream is created. Configure an HTTP stream as described below. For an OTLP stream, continue with [Send OpenTelemetry (OTLP) data to Keboola](/storage/data-streams/opentelemetry/).

## Configure an HTTP data stream

**Goal:** the stream writes the columns you want and imports on your conditions, and your application knows where to send events.

An HTTP data stream has the following settings.

### Data stream URL
For every data stream, a unique "Data Stream URL" is generated. You can use it in your application to send events. This URL cannot be changed.

### Table statistics
This dashboard shows the status of data waiting for import vs. imported data.

![Screenshot - Data Streams Table Statistics](/storage/data-streams/data-streams-pic1.png)

### Table settings
In your table settings, you can:

- Change the name of the stream.
  <!-- VERIFY(Nikita): this item says "the name of the stream", but it sits under Table settings and the caution below speaks of the table's name. Check which name this setting changes. -->
- Add a column or define your own structure using the PATH or JSONNET template. [Learn more](/storage/data-streams/reference/#template-jsonnet)
- Edit column names (available only if you create a new table within the stream).
- Delete a column (available only if you create a new table within the stream).

:::caution
**Important:** Changing the table's name will create a new table, and the stream will import data into that table.
:::

Data streams do not support primary keys: every incoming event is appended to the table. To get unique rows, deduplicate downstream as described in [No primary keys](/storage/data-streams/reference/#no-primary-keys).

### Sample codes for integration
For easier use, we've prepared a few examples of how to send data to a stream using Python, Javascript, and Bash.

### Import conditions
In this section, you can set a few conditions for importing data. Whichever condition is met first triggers an import into the destination table — you can set the interval, the size of the imported data, or the number of imported records. [Learn more](/storage/data-streams/reference/#conditions)

### Payload test
Here, you can simulate your payload and test it instantly with a table preview to see how the data will be imported before deploying it into production. The same check is available over the API through the [payload test endpoint](/storage/data-streams/reference/#test-a-payload).

**Result:** Events sent to the Data Stream URL are imported into the destination table when the first import condition is met. **Table statistics** shows the data waiting for import and the data already imported.

## Choose a delivery guarantee

**Goal:** the stream delivers each record at most once or at least once, whichever your use case needs.

Depending on your use case, you may require different delivery guarantees for your stream. Follow the guidelines below to ensure the desired outcome. Both rely on the [settings endpoints](/storage/data-streams/reference/#source-and-sink-settings).

### At most once

1. To ensure that no record is delivered twice, make sure the client doesn't retry when sending the records.
2. In this case, it's beneficial to use the settings endpoints to set `"storage.level.local.encoding.sync.wait"` to `false` to increase throughput.

### At least once

1. To ensure that every record is delivered at least once, implement retries in the client when sending the records.
2. Use the settings endpoints to confirm that `"storage.level.local.encoding.sync.wait"` is set to `true` (default behavior). Note that this setting guarantees that the record is written to the local disk.

**Result:** The client and the stream's settings match the guarantee you chose.

## Send events from Apache Kafka

**Goal:** a data stream ingests the records from your Kafka topics.

To connect Keboola with [Apache Kafka®](https://kafka.apache.org/) and ingest data from Kafka topics via data streams, use the Kafka Connect HTTP Sink Connector to establish a communication channel between Kafka and Keboola. The connector acts as a bridge between Kafka and Keboola's Data Stream HTTP API.

1. [Create an HTTP data stream](#create-a-data-stream) and copy its [Data Stream URL](#data-stream-url). The target Keboola API URL corresponds to the data stream created in Keboola.
2. Configure the Kafka Connect HTTP Sink Connector. This integration relies on the connector, which requires configuration on the Kafka side:
   - Send the data to the Data Stream URL as a POST request. Only POST HTTP methods are supported for data ingestion.
   - To batch, set a maximum size (`batch.max.size`). Events can be efficiently grouped based on a predefined maximum size.

<!-- VERIFY(Nikita): this section names no connector property besides batch.max.size. Confirm the property names for the target URL and the HTTP method, and how a batch larger than 1 is stored: the reference says an HTTP source treats one request body as a single record. -->

**Result:** The connector continuously reads data records from one or more Kafka topics and sends the data as a POST request in JSON format to Keboola's Data Stream API URL. Data records from Kafka topics are transformed into strings before being sent to Keboola.

**Next:** [Send OpenTelemetry (OTLP) data to Keboola →](/storage/data-streams/opentelemetry/)
