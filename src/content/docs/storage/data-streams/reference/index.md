---
title: Data Streams Reference
slug: 'storage/data-streams/reference'
redirect_from:
    - /integrate/data-streams/overview/
    - /integrate/push-data/overview/
---

This is the technical reference for the [Data Streams](/storage/data-streams/) feature—the underlying Stream API,
column types, mapping templates, import conditions, and delivery guarantees. For the concept and the in-app setup,
start with the [Data Streams](/storage/data-streams/) page.

![Data Streams diagram](/storage/data-streams/reference/push_data.drawio.png)

A source represents an endpoint for receiving events.

Sources are managed using the Stream API. The full API reference is available at https://stream.keboola.com/v1/documentation/, and the OpenAPI specification is available at https://stream.keboola.com/v1/documentation/openapi3.json.

Events are received via HTTP. Each source can be associated with up to 100 `sinks`, which represent `mappings` from event data to `columns` in a destination `table`. Data may be mapped using pre-defined mappings or a custom `template`.

## Columns

| Field | Type | Description |
|---|---|---|
| `name` | string | Name of the column. Names must be unique. |
| `type` | string | The type of the column. Available types and their descriptions are listed below. |

***Note:** Data streams do not support primary keys. Every incoming event is appended to the
destination table and no deduplication happens on import. If you need unique rows (e.g., one row
per event ID), handle deduplication downstream: create a deduplication transformation that reads
the stream table and writes the result to a new table whose output mapping primary key performs
the deduplication on load, and schedule it to run regularly with a conditional flow.*

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
| `Header(string, string)` | Get the value of a single request header or a default value. | `Header("Content-Type")` | `"application/json"` |
| `HeaderStr()` | Get the request headers as a string, each line containing one "header: value" pair. The lines are sorted alphabetically. | `HeaderStr()` | `Content-Type: application/json` |
| `Now()` | Get the current UTC datetime as a string formatted using the default format. | `Now()` | `"2023-01-14T08:04:05.123Z"` |
| `Now(string)` | Get the current UTC datetime as a string with the custom [`strftime`](https://man7.org/linux/man-pages/man3/strftime.3.html)-compatible format. | `Now("%Y-%m-%d")` | `2023-01-14` |

### Conditions

Incoming events are mapped to the schema defined in each sink, and each new row is appended to a CSV file on the local hard disk (local storage).

When the local storage accumulates enough records or a short time passes, the records from local storage are appended to a CSV file stored in your Keboola project (staging storage).

Once certain conditions are met, the data from the file is imported into the destination table (target storage). These `conditions` are defined by the sink:

| Condition | Minimum | Maximum | Default |
|:-|:-:|:-:|:-:|
| `time` | 30 seconds |  24 hours | 1 minute |
| `size` | 100 B | 500 MB | 50 MB |
| `count` | 1 | 10 million | 50 thousand |

Changing these conditions will trigger an immediate import of waiting files, after which the stream will follow the updated conditions.

## Create Sources and Sinks

Sources can be created using the [`POST /v1/branches/{branchId}/sources`](https://stream.keboola.com/v1/documentation/#/configuration/CreateSource) endpoint.

If a source or sink `id` is omitted, it will be generated from the corresponding `name` field.

A source may be created without any sinks. The sinks can then be created separately using the [`POST /v1/branches/{branchId}/sources/{sourceId}/sinks`](https://stream.keboola.com/v1/documentation/#/configuration/CreateSink) endpoint.

***Warning**: Events sent to a source without any sinks will be permanently lost. This is because data is buffered per sink, not per source.*

The requests are asynchronous and create a task that must be completed before the source or sink is ready to use. The task status can be checked using the [`GET /v1/tasks/{taskId}`](https://stream.keboola.com/v1/documentation/#/configuration/GetTask) endpoint.

Sink tables are created if they do not exist. If they already exist, the schema defined by `sink.columns` must match the existing schema. If the table schema is manually altered and it no longer matches, the import from staging storage to the table will fail. The data is kept in the staging storage for up to 7 days during which you can recover any failures.

## Delete Sources and Sinks

Sources may be deleted using the [`DELETE /v1/branches/{branchId}/sources/{sourceId}`](https://stream.keboola.com/v1/documentation/#/configuration/DeleteSource) endpoint. Sinks may be deleted using the [`DELETE /v1/branches/{branchId}/sources/{sourceId}/sinks/{sinkId}`](https://stream.keboola.com/v1/documentation/#/configuration/DeleteSink) endpoint.

## Update Sources and Sinks

A source may be updated using the [`PATCH /v1/branches/{branchId}/sources/{sourceId}`](https://stream.keboola.com/v1/documentation/#/configuration/UpdateSource) endpoint. Sinks maybe updated using the [`PATCH /v1/branches/{branchId}/sources/{sourceId}/sinks/{sinkId}`](https://stream.keboola.com/v1/documentation/#/configuration/UpdateSink) endpoint.

The `UpdateSource` endpoint may only update the source's name. Sinks may only be updated separately.

If a sink's `mapping.tableId` is updated, it is handled the same way as in the create operation. If the table exists, `mapping.columns` must match the existing table's schema. If the table does not exist, it is created.

## Source and Sink Settings

The import conditions mentioned above can be accessed using the [`GET /v1/branches/{branchId}/sources/{sourceId}/settings`](https://stream.keboola.com/v1/documentation/#/configuration/GetSourceSettings) endpoint and changed using the [`PATCH /v1/branches/{branchId}/sources/{sourceId}/settings`](https://stream.keboola.com/v1/documentation/#/configuration/PatchSourceSettings) endpoint.

Same settings also exist for a sink. Use the [`GET /v1/branches/{branchId}/sources/{sourceId}/sinks/{sinkId}/settings`](https://stream.keboola.com/v1/documentation/#/configuration/GetSinkSettings) endpoint and the [`PATCH /v1/branches/{branchId}/sources/{sourceId}/sinks/{sinkId}/settings`](https://stream.keboola.com/v1/documentation/#/configuration/PatchSinkSettings) endpoint in that case.

## Delivery Guarantees

Depending on your use case, you may require different delivery guarantees for your stream. Follow the guidelines below to ensure the desired outcome.

### At Most Once

To ensure that no record is delivered twice, make sure the client doesn't retry when sending the records. In this case, it's beneficial to use the setting endpoints to set `"storage.level.local.encoding.sync.wait"` to `false` to increase throughput.

### At Least Once

To ensure that every record is delivered at least once, the client needs to implement retries when sending the records. Also, use the setting endpoints to confirm that `"storage.level.local.encoding.sync.wait"` is set to `true` (default behavior). Note that this setting guarantees that the record is written to the local disk.

## Tokens

A token is generated for each source sink. These tokens have the minimum possible scope with `write` permission for the bucket in which the destination table is 
stored. You can view these tokens at `https://connection.keboola.com/admin/projects/<project-id>/tokens-settings`. Their description follows the format 
`[_internal] Stream Sink <source-id>/<sink-id>`.

These tokens should not be deleted or refreshed manually. To refresh a token, you can disable and re-enable the sink.

## Kafka Integration
To connect Keboola with [Apache Kafka®](https://kafka.apache.org/) and ingest data from Kafka topics via data streams, use the Kafka Connect HTTP Sink Connector
to establish a communication channel between Kafka and Keboola.

The Kafka Connect HTTP Sink Connector acts as a bridge, seamlessly integrating Kafka with Keboola's Data Stream HTTP API. Here's a breakdown of the process:

- Data Consumption: The connector continuously reads data records from one or more Kafka topics.
- Batching: Events can be efficiently grouped based on a predefined maximum size (batch.max.size).
- API Interaction: Data is sent as a POST request in JSON format to Keboola's Data Stream API URL.

**Key Points to Remember:**

- This integration relies on the Kafka Connect HTTP Sink Connector, which requires configuration on the Kafka side.
- Data records from Kafka topics are transformed into strings before being sent to Keboola.
- The target Keboola API URL corresponds to the data stream created in Keboola.
- Only POST HTTP methods are supported for data ingestion.

## Next Steps

- [Data Streams Tutorial](/storage/data-streams/tutorial/)
- [Stream API Reference](https://stream.keboola.com/v1/documentation/)
