---
title: OpenTelemetry (OTLP) Data Streams
description: OpenTelemetry is an open-source observability framework that captures three types of signals from your web apps, APIs, and services.
slug: 'storage/data-streams/opentelemetry'
---



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

## Getting Started

### Step 1: Create an OTLP Data Stream

1. Navigate to **Storage > Data Streams** and click **Create Data Stream**.
2. Select **OpenTelemetry (OTLP)** as the source type.
3. Name the data stream (e.g., "production-telemetry"). The destination table names are filled automatically.
4. Click **Create**. Three destination tables (logs, metrics, traces) are created for you.

### Step 2: Configure Your Application

The source detail page displays the **OTLP endpoint URL** along with a copy button and a ready-to-paste environment variable snippet.

To connect any OpenTelemetry SDK or collector, set two environment variables:

```
export OTEL_EXPORTER_OTLP_ENDPOINT="<your-stream-endpoint>"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
```

Replace `<your-stream-endpoint>` with the endpoint URL shown on the source detail page. Once these variables are set, any official OpenTelemetry SDK will automatically pick them up and begin exporting telemetry data to your Keboola project.

### Step 3: Verify Data Ingestion

Records are typically available in Storage within approximately 15 seconds of ingestion. Check the **Table statistics** on the source detail page to confirm data is flowing.

## Destination Tables

When you create an OTLP data stream, **three destination tables** are automatically created and pre-mapped:

| Table | Content |
|---|---|
| **logs** | Log records emitted by your applications (events, errors, warnings). |
| **metrics** | Metric data points (counters, gauges, histograms, etc.). |
| **traces** | Distributed trace spans with timing and context. |

### Column Mapping

Each table's column mapping is pre-configured so the fields you query most often — such as `service`, `severity`, `trace_id`, `host_name`, `k8s_pod_name`, and `deployment_environment` — are stored as **top-level columns** rather than buried inside a JSON blob.

Key details:

- Each signal's column mappings are **independently editable per sink**.
- An opt-in option is available if you also want to keep the **raw OTLP payload**.
- Column names follow a flattened dot-notation derived from the OTLP protobuf schema, making SQL queries straightforward.

## SDK and Collector Setup

The OTLP/HTTP endpoint is compatible with any OpenTelemetry SDK or collector. Below are quick-start snippets for popular languages and the OpenTelemetry Collector.

### Python

Install the OpenTelemetry SDK and OTLP exporter:

```bash
pip install opentelemetry-api opentelemetry-sdk opentelemetry-exporter-otlp-proto-http
```

Then set the environment variables before running your application:

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="<your-stream-endpoint>"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
export OTEL_SERVICE_NAME="my-python-service"
python my_app.py
```

### Node.js

Install the OpenTelemetry SDK and OTLP exporter:

```bash
npm install @opentelemetry/sdk-node @opentelemetry/exporter-trace-otlp-proto @opentelemetry/exporter-metrics-otlp-proto
```

Set the environment variables:

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="<your-stream-endpoint>"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
export OTEL_SERVICE_NAME="my-node-service"
node --require @opentelemetry/sdk-node/register my_app.js
```

### Go

```bash
go get go.opentelemetry.io/otel \
       go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp \
       go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetrichttp
```

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="<your-stream-endpoint>"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
export OTEL_SERVICE_NAME="my-go-service"
```

### OpenTelemetry Collector

If you already run an [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/), add Keboola as an OTLP/HTTP exporter in your collector configuration:

```yaml
exporters:
  otlphttp/keboola:
    endpoint: "<your-stream-endpoint>"
    compression: gzip

service:
  pipelines:
    traces:
      exporters: [otlphttp/keboola]
    metrics:
      exporters: [otlphttp/keboola]
    logs:
      exporters: [otlphttp/keboola]
```

This approach lets you fan out telemetry to both your existing monitoring backend and Keboola simultaneously.

## Use Cases

### Joining Error Logs with Business Data

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

### Monitoring Deployment Impact

Track how deployments affect error rates by correlating deployment timestamps with trace data:

```sql
SELECT
    traces."deployment_environment",
    traces."service",
    DATE_TRUNC('hour', traces."timestamp") AS hour,
    COUNT(*) AS total_spans,
    COUNT(CASE WHEN traces."status_code" = 'ERROR' THEN 1 END) AS error_spans,
    ROUND(100.0 * COUNT(CASE WHEN traces."status_code" = 'ERROR' THEN 1 END) / COUNT(*), 2) AS error_rate
FROM traces
WHERE traces."timestamp" >= DATEADD('day', -7, CURRENT_TIMESTAMP())
GROUP BY 1, 2, 3
ORDER BY hour DESC
```

### LLM Observability

If your application uses LLM APIs, instrument them with OpenTelemetry to track token usage, latency, and costs alongside product metrics:

```sql
SELECT
    traces."service",
    traces."ai_model" AS model,
    COUNT(*) AS total_calls,
    AVG(traces."duration_ms") AS avg_latency_ms,
    SUM(traces."ai_total_tokens") AS total_tokens
FROM traces
WHERE traces."ai_model" IS NOT NULL
  AND traces."timestamp" >= DATEADD('day', -30, CURRENT_TIMESTAMP())
GROUP BY 1, 2
ORDER BY total_tokens DESC
```

## OTLP Source Detail Page

The OTLP source detail page provides:

- **Endpoint URL** with a one-click copy button.
- **Environment variable snippet** ready to paste into your application or deployment configuration.
- **Table statistics** for each of the three destination tables (logs, metrics, traces), showing waiting vs. imported data.
- **Import conditions** — the same configurable thresholds (time interval, data size, record count) as HTTP data streams. [Learn more](https://developers.keboola.com/integrate/data-streams/overview/#conditions)

## Technical Reference

- [OpenTelemetry Protocol Specification](https://opentelemetry.io/docs/specs/otlp/)
- [OTLP/HTTP Transport](https://opentelemetry.io/docs/specs/otlp/#otlphttp)
- [Keboola Stream API Documentation](https://stream.keboola.com/v1/documentation/)
- [Data Streams Developer Documentation](https://developers.keboola.com/integrate/data-streams/overview/)
