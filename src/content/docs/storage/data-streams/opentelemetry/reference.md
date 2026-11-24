---
title: OpenTelemetry (OTLP) streams reference
slug: 'storage/data-streams/opentelemetry/reference'
sidebar:
  label: OpenTelemetry reference
description: 'Destination tables of an OTLP data stream, signal routing, the fields each signal offers to column mappings, nested attributes, and SQL query examples.'
---

This page describes the data an OTLP data stream produces once it is running. To create a stream and connect an SDK, see [Send OpenTelemetry (OTLP) data to Keboola](/storage/data-streams/opentelemetry/); for column types and the Stream API, see the [Data Streams reference](/storage/data-streams/reference/).

<!-- Reference-type page. Source: the OpenTelemetry page as it stood before the 2026-11-19 section split. Text moved, fields and queries not re-checked against the product. -->

## Destination tables

An OTLP data stream writes one destination table per signal, each set up with a default column mapping when you create the stream in the app:

| Table | Content |
|---|---|
| **logs** | Log records emitted by your applications (events, errors, warnings). |
| **metrics** | Metric data points (counters, gauges, histograms, etc.). |
| **traces** | Distributed trace spans with timing and context. |

### Routing signals to tables

The three tables are three ordinary [sinks](/storage/data-streams/reference/) on one OTLP source. What sends each signal to the right table is the sink's `allowedSignals` filter — an array holding any of `logs`, `metrics`, and `traces`. A sink with `allowedSignals: ["logs"]` only ever receives log records; a sink with an empty `allowedSignals` (the default) accepts **all three** signals into one table. HTTP sources ignore the field entirely.

Because these are normal sinks, you can add a fourth sink with its own filter and mapping — for example, error logs projected into a narrow table for a dashboard — without touching the three defaults.

### Fields available to column mappings

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

### Attributes stay nested

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

## Query examples

The examples on this page assume the column names produced by the default mappings and use Snowflake syntax; adjust both to your own mapping and [backend](/storage/tables/data-types/).

### Joining error logs with business data

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

### Monitoring deployment impact

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

`status_code` carries the OTLP span status verbatim — `Unset`, `Ok`, or `Error` — so match it case-sensitively. The `deployment_environment` and `service` columns here come from the `deployment.environment` and `service.name` resource attributes; see [Attributes stay nested](#attributes-stay-nested) for how to map them.

### LLM observability

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

## Specifications and API

- [OpenTelemetry Protocol Specification](https://opentelemetry.io/docs/specs/otlp/)
- [OTLP/HTTP Transport](https://opentelemetry.io/docs/specs/otlp/#otlphttp)
- [OpenTelemetry SDK environment variables](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/)
- [Keboola Stream API Documentation](https://stream.keboola.com/v1/documentation/)

**Next:** [Data Streams reference →](/storage/data-streams/reference/)
