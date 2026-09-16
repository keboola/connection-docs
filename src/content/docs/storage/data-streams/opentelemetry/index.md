---
title: OpenTelemetry (OTLP) Data Streams
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
4. Click **Create**. The app sets up a destination table per signal (logs, metrics, traces) with a default column mapping, so there is nothing to map by hand before you start sending data.

### Step 2: Configure Your Application

The source detail page displays the **OTLP endpoint URL** along with a copy button and a ready-to-paste environment variable snippet.

To connect any OpenTelemetry SDK or collector, set two environment variables:

```
export OTEL_EXPORTER_OTLP_ENDPOINT="<your-stream-endpoint>"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
```

Replace `<your-stream-endpoint>` with the endpoint URL shown on the source detail page. Once these variables are set, any official OpenTelemetry SDK will automatically pick them up and begin exporting telemetry data to your Keboola project.

:::caution[Don't append the signal path yourself]
The endpoint URL is a **base** URL. The SDK appends `/v1/logs`, `/v1/metrics`, or `/v1/traces` to it automatically, based on the signal it is exporting. Setting `OTEL_EXPORTER_OTLP_ENDPOINT` to a URL that already ends in `/v1/traces` breaks the export — most exporters either reject the value or silently strip the suffix. Use the per-signal `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` variables only if you need to override a single signal, and give those the full signal path.
:::

#### Keeping the Secret Out of Your Logs

The endpoint URL shown in the app embeds the source's 48-character secret as its last path segment. That is convenient — a single string configures any SDK — but URLs end up in access logs, CDN logs, and APM traces.

The API therefore returns the same endpoint in two forms in the source detail (`GET /v1/branches/{branchId}/sources/{sourceId}`):

| Field | Value | How to authenticate |
|---|---|---|
| `otlp.url` | `https://stream-in.keboola.com/otlp/<projectId>/<sourceId>/<secret>` | Secret in the URL — nothing else needed |
| `otlp.baseUrl` + `otlp.secret` | `https://stream-in.keboola.com/otlp/<projectId>/<sourceId>` | `Authorization: Bearer <secret>` header |

For anything beyond a quick test, prefer the header form:

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="<otlp.baseUrl>"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <otlp.secret>"
```

Both forms accept exactly the same traffic. Note that an HTTP source's secret cannot be used against the OTLP endpoints, or vice versa — secrets are scoped to the transport.

`OTEL_EXPORTER_OTLP_HEADERS` values are specified as W3C Baggage, and SDKs differ in how strictly they decode them. If your exporter sends a malformed `Authorization` header, percent-encode the space: `Authorization=Bearer%20<otlp.secret>`.

### Step 3: Verify Data Ingestion

Records become available in Storage once the stream's [import conditions](/storage/data-streams/reference/#conditions) are met (by default within about a minute). Check the **Table statistics** on the source detail page to confirm data is flowing.

## Destination Tables

An OTLP data stream writes one destination table per signal, each set up with a default column mapping when you create the stream in the app:

| Table | Content |
|---|---|
| **logs** | Log records emitted by your applications (events, errors, warnings). |
| **metrics** | Metric data points (counters, gauges, histograms, etc.). |
| **traces** | Distributed trace spans with timing and context. |

### Routing Signals to Tables

The three tables are three ordinary [sinks](/storage/data-streams/reference/) on one OTLP source. What sends each signal to the right table is the sink's `allowedSignals` filter — an array holding any of `logs`, `metrics`, and `traces`. A sink with `allowedSignals: ["logs"]` only ever receives log records; a sink with an empty `allowedSignals` (the default) accepts **all three** signals into one table. HTTP sources ignore the field entirely.

Because these are normal sinks, you can add a fourth sink with its own filter and mapping — for example, error logs projected into a narrow table for a dashboard — without touching the three defaults.

### Fields Available to Column Mappings

Each incoming log record, metric data point, or span is flattened into one JSON record, and your column mapping picks fields out of it with the `path` and `template` [column types](/storage/data-streams/reference/#columns). These are the fields each signal produces:

**Logs**

`timestamp`, `observed_timestamp`, `severity_number`, `severity_text`, `body`, `flags`, `trace_id`, `span_id`, `attributes`, `resource`, `scope`.

`trace_id` and `span_id` are omitted when the log record carries none, so give those columns a `defaultValue`.

**Traces** (one record per span)

`timestamp` (span start), `end_timestamp`, `trace_id`, `span_id`, `parent_span_id`, `trace_state`, `name`, `kind`, `flags`, `status_code`, `status_message`, `attributes`, `events`, `links`, `resource`, `scope`.

`status_code` is `Unset`, `Ok`, or `Error`. `parent_span_id` is omitted on root spans. Span events and links stay nested as arrays rather than becoming their own records. There is no duration field — derive it from `end_timestamp` and `timestamp`.

**Metrics** (one record per data point)

`metric_name`, `metric_description`, `metric_unit`, `metric_type`, `start_timestamp`, `timestamp`, `attributes`, `resource`, `scope`, plus the value fields for that metric type:

| `metric_type` | Value fields |
|---|---|
| `gauge` | `value` |
| `sum` | `value`, `is_monotonic`, `aggregation_temporality` |
| `histogram` | `count`, `sum`, `min`, `max`, `bucket_counts`, `explicit_bounds`, `aggregation_temporality` |
| `exponential_histogram` | `count`, `sum`, `min`, `max`, `scale`, `zero_count`, `aggregation_temporality` |
| `summary` | `count`, `sum`, `quantile_values` |

`sum`, `min`, and `max` are only present when the data point actually sets them.

### Attributes Stay Nested

Attributes are **not** flattened into dot-notation top-level fields. `attributes`, `resource`, and `scope` are nested objects whose keys keep their original dotted OTLP names — `service.name`, `host.name`, `k8s.pod.name`, `deployment.environment`, `http.status_code`, and so on. Because the dot is part of the key rather than a path separator, read them with a `template` column instead of a `path` column:

```json
{
  "type": "template",
  "name": "service",
  "template": {
    "language": "jsonnet",
    "content": "Body('resource')['service.name']"
  }
}
```

The same pattern works for `Body('attributes')['user.id']` and `Body('scope')['name']`. Fields that are genuinely top-level (`severity_text`, `trace_id`, `status_code`, `metric_name`, …) are simpler — a `path` column reaches them directly.

Every sink's mapping is editable independently of the others, so you can extend one signal's table without touching the rest. If you would rather not enumerate fields, a [`body` column](/storage/data-streams/reference/#columns) stores the entire flattened record as JSON, and you can keep it next to the columns you do want projected out. Use the [payload test endpoint](/storage/data-streams/reference/#test-a-payload), or the in-app **Payload test**, to check a mapping against a sample record before pointing a real SDK at the source.

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

Install the OpenTelemetry API and the zero-code auto-instrumentation package:

```bash
npm install @opentelemetry/api @opentelemetry/auto-instrumentations-node
```

Set the environment variables and load the instrumentation before your app:

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="<your-stream-endpoint>"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
export OTEL_SERVICE_NAME="my-node-service"
node --require @opentelemetry/auto-instrumentations-node/register my_app.js
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
WHERE logs."severity_text" = 'ERROR'
GROUP BY date
```

The examples on this page assume the column names produced by the default mappings and use Snowflake syntax; adjust both to your own mapping and [backend](/storage/tables/data-types/).

### Monitoring Deployment Impact

Track how deployments affect error rates by correlating deployment timestamps with trace data:

```sql
SELECT
    traces."deployment_environment",
    traces."service",
    DATE_TRUNC('hour', traces."timestamp") AS hour,
    COUNT(*) AS total_spans,
    COUNT(CASE WHEN traces."status_code" = 'Error' THEN 1 END) AS error_spans,
    ROUND(100.0 * COUNT(CASE WHEN traces."status_code" = 'Error' THEN 1 END) / COUNT(*), 2) AS error_rate
FROM traces
WHERE traces."timestamp" >= DATEADD('day', -7, CURRENT_TIMESTAMP())
GROUP BY 1, 2, 3
ORDER BY hour DESC
```

`status_code` carries the OTLP span status verbatim — `Unset`, `Ok`, or `Error` — so match it case-sensitively. The `deployment_environment` and `service` columns here come from the `deployment.environment` and `service.name` resource attributes; see [Attributes Stay Nested](#attributes-stay-nested) for how to map them.

### LLM Observability

If your application uses LLM APIs, instrument them with OpenTelemetry to track token usage, latency, and costs alongside product metrics.

The OpenTelemetry [GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) put this data in span **attributes** (`gen_ai.request.model`, `gen_ai.usage.total_tokens`, …), so add `template` columns for the ones you want to query:

```json
[
  {
    "type": "template",
    "name": "ai_model",
    "template": {
      "language": "jsonnet",
      "content": "Body('attributes')['gen_ai.request.model']"
    }
  },
  {
    "type": "template",
    "name": "ai_total_tokens",
    "template": {
      "language": "jsonnet",
      "content": "Body('attributes')['gen_ai.usage.total_tokens']"
    }
  }
]
```

Span duration is not a stored field either — compute it from the span's start and end timestamps:

```sql
SELECT
    traces."service",
    traces."ai_model" AS model,
    COUNT(*) AS total_calls,
    AVG(DATEDIFF('millisecond', traces."timestamp", traces."end_timestamp")) AS avg_latency_ms,
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
- **Table statistics** for each destination table (logs, metrics, traces), showing waiting vs. imported data.
- **Import conditions** — the same configurable thresholds (interval, data size, record count) as HTTP data streams. [Learn more](/storage/data-streams/reference/#conditions)

## Technical Reference

- [OpenTelemetry Protocol Specification](https://opentelemetry.io/docs/specs/otlp/)
- [OTLP/HTTP Transport](https://opentelemetry.io/docs/specs/otlp/#otlphttp)
- [OpenTelemetry SDK environment variables](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/)
- [Keboola Stream API Documentation](https://stream.keboola.com/v1/documentation/)
- [Data Streams Reference](/storage/data-streams/reference/)
