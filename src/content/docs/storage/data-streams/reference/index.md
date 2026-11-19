---
title: Data Streams reference
description: 'Technical reference for Data Streams: sources and sinks in the Stream API, column types, mapping templates, import conditions, payload test, tokens, and limits.'
slug: 'storage/data-streams/reference'
sidebar:
  label: Reference
redirect_from:
    - /integrate/data-streams/overview/
    - /integrate/push-data/overview/
---

Use this page when you define a stream through the Stream API or edit its column mapping. For the concept, start with [Data Streams](/storage/data-streams/); for the in-app setup, delivery guarantees and Kafka, see [Create and configure a data stream](/storage/data-streams/create/); for a worked example over the API, follow the [tutorial](/storage/data-streams/tutorial/).

<!-- Reference-type page. Source: this page as it stood before the 2026-11-19 section split; the Stream API OpenAPI specification linked below is the source of truth. Text moved, values not re-checked. -->

![Data Streams diagram](/storage/data-streams/reference/push_data.drawio.png)

A source represents an endpoint for receiving events.

Sources are managed using the Stream API. See the full [Stream API reference](https://stream.keboola.com/v1/documentation/) and its [OpenAPI specification](https://stream.keboola.com/v1/documentation/openapi3.json).

Events are received via HTTP. Each source can be associated with `sinks`, which represent `mappings` from event data to `columns` in a destination `table`. Data may be mapped using pre-defined mappings or a custom `template`. For how many sources, sinks, and columns you can have, see [Limits](#limits).

:::note[Admin token required for writes]
All write operations on the Stream API (creating, updating, deleting, enabling, and disabling
sources and sinks, and changing settings) require the **master token of a project user with the
admin role**. Custom Storage API tokens, and master tokens of guest or read-only users, are
rejected with `403 only admin token can do write operations on streams`. Reading and ingesting
data are not affected — ingest is authenticated by the secret embedded in the source's URL.
:::

## Columns

| Field | Type | Description |
|---|---|---|
| `name` | string | Name of the column. Names must be unique. |
| `type` | string | The type of the column. Available types and their descriptions are listed below. |

Data streams do not support primary keys; see [No primary keys](#no-primary-keys).

The available column types are:

| Type | Description |
|---|---|
| `uuid`| Unique event ID (UUID) |
| `datetime` | Time of the event |
| `ip` | IP of the event sender |
| `body` | The unaltered event body |
| `headers` | The unaltered request headers |
| `path` | A field from the JSON object |
| `template` | A custom mapping using a template language |

The same column types apply to both source types. For an **OTLP** source, the "event body" a mapping
sees is the single flattened record the service derives from each log record, metric data point, or
span — so `body` stores that record as JSON, and `path`/`template` address its fields. See
[Fields available to column mappings](/storage/data-streams/opentelemetry/reference/#fields-available-to-column-mappings)
for the field list per signal.

### Path

The `path` column type can be used to fetch a single field from a `JSON` object. Optionally, you can use `rawString` option to remove the quotes around a JSON string or the `defaultValue` option to define a value when the field doesn't exist.

```json
{
  "type": "path",
  "name": "id",
  "path": "issue.id",
  "defaultValue": "undefined", 
  "rawString": true
}
```

### Template (Jsonnet)

***Note:** It is recommended to use the faster `path` type instead of the `jsonnet` function `Body(string)` when possible.*

The `template` column type currently supports the `jsonnet` templating language. The following `jsonnet` globals are available:

|Name|Description|Usage example|Example value|
|:-|:-|:-|:-|
| `Ip()` | IP address of the client | `Ip()` | `127.0.0.1` |
| `Body()` | Get the entire request body as an object. | `Body()` | `{ "a": "b" }` |
| `Body(string)` | Get a field from the request body by path. Fails if the field does not exist; in that case, the record will not be saved. | `Body("deeply.nested.path")` | `1000` |
| `Body(string, any)` | Get a field from the request body by path, or a default value. | `Body("deeply.nested.path", 2000)` | `1000` |
| `BodyStr()` | Get the entire request body as a string. | `BodyStr()` | `"{\"a\":\"b\"}"` |
| `Header()` | Get all request headers. | `Header()` | `{ "Content-Type": "application/json" }` |
| `Header(string)` | Get the value of a single request header. Fails if the header does not exist; in that case, the record will not be saved. | `Header("Content-Type")` | `"application/json"` |
| `Header(string, string)` | Get the value of a single request header or a default value. | `Header("Content-Type", "application/json")` | `"application/json"` |
| `HeaderStr()` | Get the request headers as a string, each line containing one "header: value" pair. The lines are sorted alphabetically. | `HeaderStr()` | `Content-Type: application/json` |
| `Now()` | Get the current UTC datetime as a string formatted using the default format. | `Now()` | `"2023-01-14T08:04:05.123Z"` |
| `Now(string)` | Get the current UTC datetime as a string with the custom [`strftime`](https://man7.org/linux/man-pages/man3/strftime.3.html)-compatible format. | `Now("%Y-%m-%d")` | `2023-01-14` |

### Conditions

Incoming events are mapped to the schema defined in each sink, and each new row is appended to a CSV file on the local hard disk (local storage).

Data then moves in two steps, each with its own set of trigger conditions. Both sets are defined per sink and changed through the [settings endpoints](#source-and-sink-settings); within each set, **whichever condition is met first** triggers the step.

**Step 1 — local storage → staging storage.** Records are appended to a CSV file stored in your Keboola project. Keys are under `storage.level.staging.upload.trigger`:

| Condition | Key | Minimum | Maximum | Default |
|:-|:-|:-:|:-:|:-:|
| Interval | `interval` | 1 second | 30 minutes | 30 seconds |
| Size | `size` | 100 B | 50 MB | 5 MB |
| Record count | `count` | 1 | 10 million | 10 thousand |

**Step 2 — staging storage → destination table (target storage).** Keys are under `storage.level.target.import.trigger`:

| Condition | Key | Minimum | Maximum | Default |
|:-|:-|:-:|:-:|:-:|
| Interval | `interval` | 30 seconds | 24 hours | 1 minute |
| Size | `size` | 100 B | 500 MB | 50 MB |
| Record count | `count` | 1 | 10 million | 50 thousand |

The step-2 conditions are the ones the in-app **Import conditions** panel exposes, and they are what determines how soon a received event shows up in the table.

Changing these conditions will trigger an immediate import of waiting files, after which the stream will follow the updated conditions.

## Create Sources and Sinks

Sources can be created using the [`POST /v1/branches/{branchId}/sources`](https://stream.keboola.com/v1/documentation/#/configuration/CreateSource) endpoint.

If the `sourceId` or `sinkId` is omitted, it will be generated from the corresponding `name` field.

A source may be created without any sinks. The sinks can then be created separately using the [`POST /v1/branches/{branchId}/sources/{sourceId}/sinks`](https://stream.keboola.com/v1/documentation/#/configuration/CreateSink) endpoint.

***Warning**: Events sent to a source without any sinks will be permanently lost. This is because data is buffered per sink, not per source.*

The requests are asynchronous and create a task that must be completed before the source or sink is ready to use. The task status can be checked using the [`GET /v1/tasks/{taskId}`](https://stream.keboola.com/v1/documentation/#/configuration/GetTask) endpoint.

Sink tables are created if they do not exist. If they already exist, the schema defined by `sink.table.mapping.columns` must match the existing schema. If the table schema is manually altered and it no longer matches, the import from staging storage to the table will fail. The data is kept in the staging storage for up to 7 days during which you can recover any failures.

## Delete Sources and Sinks

Sources may be deleted using the [`DELETE /v1/branches/{branchId}/sources/{sourceId}`](https://stream.keboola.com/v1/documentation/#/configuration/DeleteSource) endpoint. Sinks may be deleted using the [`DELETE /v1/branches/{branchId}/sources/{sourceId}/sinks/{sinkId}`](https://stream.keboola.com/v1/documentation/#/configuration/DeleteSink) endpoint.

## Update Sources and Sinks

A source may be updated using the [`PATCH /v1/branches/{branchId}/sources/{sourceId}`](https://stream.keboola.com/v1/documentation/#/configuration/UpdateSource) endpoint. Sinks may be updated using the [`PATCH /v1/branches/{branchId}/sources/{sourceId}/sinks/{sinkId}`](https://stream.keboola.com/v1/documentation/#/configuration/UpdateSink) endpoint.

The `UpdateSource` endpoint updates the source's `name`, `description`, and `type`. Sinks are not touched by it — they may only be updated separately.

:::caution
Changing a source's `type` (between `http` and `otlp`) discards the previous transport's configuration and **generates a new secret**, so the source gets a **new ingest URL**. Any client still posting to the old URL stops being accepted.
:::

If a sink's `table.tableId` is updated, it is handled the same way as in the create operation. If the table exists, `table.mapping.columns` must match the existing table's schema. If the table does not exist, it is created.

## Source and Sink Settings

The import conditions mentioned above can be accessed using the [`GET /v1/branches/{branchId}/sources/{sourceId}/settings`](https://stream.keboola.com/v1/documentation/#/configuration/GetSourceSettings) endpoint and changed using the [`PATCH /v1/branches/{branchId}/sources/{sourceId}/settings`](https://stream.keboola.com/v1/documentation/#/configuration/UpdateSourceSettings) endpoint.

Same settings also exist for a sink. Use the [`GET /v1/branches/{branchId}/sources/{sourceId}/sinks/{sinkId}/settings`](https://stream.keboola.com/v1/documentation/#/configuration/GetSinkSettings) endpoint and the [`PATCH /v1/branches/{branchId}/sources/{sourceId}/sinks/{sinkId}/settings`](https://stream.keboola.com/v1/documentation/#/configuration/UpdateSinkSettings) endpoint in that case.

The same endpoints carry `storage.level.local.encoding.sync.wait`. To pick between at-most-once and at-least-once delivery with it, see [Choose a delivery guarantee](/storage/data-streams/create/#choose-a-delivery-guarantee).

## Test a Payload

The in-app **Payload test** is backed by the [`POST /v1/branches/{branchId}/sources/{sourceId}/test`](https://stream.keboola.com/v1/documentation/#/test/TestSource) endpoint. Post a sample payload and the API renders it through every sink's mapping, returning the destination `tableId` and the resulting column values for each sink — **without storing anything**. This is the fastest way to check a `path` or `jsonnet` template before pointing a real client at the source.

For an HTTP source, the request body is the raw payload a client would send, treated as a single record.

For an OTLP source, the body must be a single **already-flattened OTLP record** — not a protobuf batch and not the multi-record envelope an OTel SDK sends. The `?signal=` query parameter (`logs`, `metrics`, or `traces`; defaults to `logs`) selects which signal the request simulates, and sinks whose [`allowedSignals`](/storage/data-streams/opentelemetry/reference/#routing-signals-to-tables) filter rejects that signal are omitted from the result, exactly as they would be skipped during real ingestion.

## Tokens

A token is generated for each source sink. These tokens have the minimum possible scope: `write` permission for the bucket in which the destination table is
stored, plus read access to all file uploads (staging storage is implemented with files). You can view them under **Users & Settings → API Tokens** in your project, or directly at
`https://connection.keboola.com/admin/projects/<project-id>/tokens-settings` (replace the host with your
[stack's](/overview/#stacks) if you are not on AWS US). Their description follows the format 
`[_internal] Stream Sink <source-id>/<sink-id>`.

These tokens should not be deleted or refreshed manually. To refresh a token, you can disable and re-enable the sink.

## Limits

- A branch may hold up to 100 sources.
- Each source can be associated with up to 100 sinks.
- A sink mapping may hold up to 100 columns.

### No primary keys

Data streams do **not** support primary keys — every incoming event is **appended** to the
table and no deduplication happens on import.

If you need unique rows (e.g., one row per event ID), it is up to you to decide whether
deduplication is required and to handle it **downstream**: create a
[deduplication transformation](/storage/tables/#primary-key-deduplication) that reads the stream
table and writes the result to a new table where the
[output mapping](/transformations/mappings/#output-mapping) primary key performs the
deduplication on load. Schedule it to run regularly with a [conditional flow](/flows/).
[Kai](/kai/) can help you build both the transformation and the scheduled flow.

**Next:** [Files →](/storage/files/)
