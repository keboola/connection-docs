---
title: Data Streams
permalink: /storage/data-streams/
---

* TOC
{:toc}

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

{: .image-popup}
![Screenshot - Data Streams Table Statistics](/storage/data-streams/data-streams-pic1.png)

#### Table settings
In your table settings, you can:

- Change the name of the stream.
- Add a column or define your own structure using the PATH or JSONNET template. [Learn more](https://developers.keboola.com/integrate/data-streams/overview/#template-jsonnet)
- Edit column names (available only if you create a new table within the stream).
- Edit primary keys (available only if you create a new table within the stream).
- Delete a column (available only if you create a new table within the stream).

<div class="clearfix"></div>
<div class="alert alert-warning" role="alert">
    <i class="fas fa-exclamation-circle"></i>
    <strong>Important:</strong> Changing the table's name will create a new table, and the stream will import data into that table.
</div>

#### Sample codes for integration
For easier use, we've prepared a few examples of how to send data to a stream using Python, Javascript, and Bash.

#### Import conditions
In this section, you can set a few conditions for importing data. If any of these three conditions are met, events are instantly uploaded to the destination table. You can set the import time frequency, the size of the imported data, or the number of imported records. [Learn more](https://developers.keboola.com/integrate/data-streams/overview/#conditions)

#### Payload test
Here, you can simulate your payload and test it instantly with a table preview to see how the data will be imported before deploying it into production.

### Configure an OpenTelemetry (OTLP) Data Stream

[OpenTelemetry](https://opentelemetry.io/) is an open-source observability framework that captures three types of signals from your web apps, APIs, and services:

- **Logs** — application events and errors (e.g., failed requests, warnings, debug messages).
- **Metrics** — performance measurements over time (e.g., request latency, CPU usage, error rates).
- **Traces** — end-to-end request flows across services (e.g., an API call that touches multiple microservices).

Choosing the **OpenTelemetry (OTLP)** source type turns Keboola into a drop-in [OTLP/HTTP](https://opentelemetry.io/docs/specs/otlp/#otlphttp) endpoint. Any official OpenTelemetry SDK or collector can export directly to Keboola, and the incoming telemetry data lands in Storage — queryable alongside your business data.

#### Why Send Telemetry to Keboola?

Your web apps, APIs, and services already generate telemetry data. Typically, this data lives in a dedicated monitoring tool (e.g., Datadog, New Relic, Grafana) while your business data lives in Keboola. When you need to understand how application performance affects business outcomes, you have to export data, build custom pipelines, or switch between tools.

With OTLP source support in Data Streams, your telemetry and business data live side by side in Keboola Storage. This lets you:

- **Correlate application errors with revenue impact** — join error logs with transaction records to see how outages affect orders.
- **Connect API latency to conversion rates** — analyze whether slow response times cause drop-offs in user workflows.
- **Track deployment activity alongside business KPIs** — measure whether a new release improved or degraded key metrics.
- **Monitor LLM agent or pipeline performance** — trace AI agent activity and cost alongside product usage data.

##### Example: Joining Error Logs with Business Data

Once your telemetry data is in Keboola Storage, you can query it alongside any other table. For example, to find how API errors affected revenue:

```sql
SELECT
    DATE(logs."timestamp") AS date,
    COUNT(DISTINCT transactions."order_id") AS lost_orders,
    SUM(transactions."amount") AS lost_revenue
FROM logs
JOIN transactions ON logs."trace_id" = transactions."trace_id"
WHERE logs."severity" = 'ERROR'
GROUP BY date
```

#### Destination Tables
When you create an OTLP data stream, **three destination tables** are automatically created and pre-mapped:

| Table | Content |
|---|---|
| **logs** | Log records emitted by your applications (events, errors, warnings). |
| **metrics** | Metric data points (counters, gauges, histograms, etc.). |
| **traces** | Distributed trace spans with timing and context. |

Each table's column mapping is pre-configured so the fields you query most often — such as `service`, `severity`, `trace_id`, `host_name`, `k8s_pod_name`, and `deployment_environment` — are stored as **top-level columns** rather than buried inside a JSON blob. Each signal's column mappings are independently editable per sink. An opt-in option is available if you also want to keep the raw OTLP payload.

#### Endpoint and Environment Variables
The source detail page displays the **OTLP endpoint URL** along with a copy button and a ready-to-paste environment variable snippet.

To connect any OpenTelemetry SDK (Python, Node.js, Go, Java, .NET, Rust, etc.) or collector, set two environment variables:

```
export OTEL_EXPORTER_OTLP_ENDPOINT="<your-stream-endpoint>"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
```

Replace `<your-stream-endpoint>` with the endpoint URL shown on the source detail page. Once these variables are set, any official OpenTelemetry SDK will automatically pick them up and begin exporting telemetry data to your Keboola project. Records are typically available in Storage within approximately 15 seconds of ingestion.

#### OTLP Source Detail Page
The OTLP source detail page provides:

- **Endpoint URL** with a one-click copy button.
- **Environment variable snippet** ready to paste into your application or deployment configuration.
- **Table statistics** for each of the three destination tables (logs, metrics, traces), showing waiting vs. imported data.
- **Import conditions** — the same configurable thresholds (time interval, data size, record count) as HTTP data streams.

## Pricing
Data Streams pricing varies based on the number of streams and the volume of ingested data. Please contact our support team for more details.

## Technical Documentation
For further details and API integration steps, refer to our [comprehensive documentation](https://developers.keboola.com/integrate/push-data/).
