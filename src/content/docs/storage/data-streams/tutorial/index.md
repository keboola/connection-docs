---
title: Data Streams Tutorial
slug: 'storage/data-streams/tutorial'
redirect_from:
    - /integrate/data-streams/tutorial/
    - /integrate/push-data/tutorial/
---

:::caution[Needs review]
`VERIFY(owner)`: request shapes below follow the current [Stream API OpenAPI spec](https://stream.keboola.com/v1/documentation/openapi3.json) (sources + sinks model). The JSON *response* examples are illustrative, not captured from a live run, and the literal `default` value for `{branchId}` should be confirmed before publishing.
:::

In this tutorial, we will set up a data stream for the [`issues`](https://docs.github.com/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#issues) event from GitHub Webhooks. This will allow you to monitor and analyze activity related to issues in any of your GitHub repositories.

## Prerequisites

- A [Storage API token](/management/project/tokens/) for your project (**Users & Settings → API Tokens**; the examples below assume a master token).
- A GitHub repository where you have the `Admin` role.
- Your stack's Stream API host. The examples use `stream.keboola.com` (AWS US); on other [stacks](/overview/#stacks) replace the host accordingly.
- `{branchId}` — your branch ID (`default` refers to the production branch).

## Creating a Source

A **source** is the endpoint that receives events; a **sink** maps received events into a Storage table. They are created separately.

**1. Create the source:**

```shell
curl --request POST "https://stream.keboola.com/v1/branches/default/sources" \
     --header "Content-Type: application/json" \
     --header "X-StorageApi-Token: YOUR_TOKEN" \
     --data '{"type": "http", "name": "GitHub Issues"}'
```

The request is asynchronous — the response contains a task. Poll it until it finishes:

```shell
curl --header "X-StorageApi-Token: YOUR_TOKEN" \
     "https://stream.keboola.com/v1/tasks/TASK_ID"
```

**2. Create a sink** on the source (the `sourceId` was generated from the name — `github-issues`). The sink maps event data to columns of a destination table:

```shell
curl --request POST "https://stream.keboola.com/v1/branches/default/sources/github-issues/sinks" \
     --header "Content-Type: application/json" \
     --header "X-StorageApi-Token: YOUR_TOKEN" \
     --data '{
  "type": "table",
  "name": "Events",
  "table": {
    "type": "keboola",
    "tableId": "in.c-github.issues",
    "mapping": {
      "columns": [
        { "type": "uuid", "name": "id" },
        { "type": "datetime", "name": "datetime" },
        { "type": "ip", "name": "ip" },
        { "type": "body", "name": "body" },
        { "type": "headers", "name": "headers" },
        {
          "type": "path",
          "name": "issue_id",
          "path": "issue.id",
          "defaultValue": "undefined",
          "rawString": true
        },
        {
          "type": "template",
          "name": "summary",
          "template": {
            "language": "jsonnet",
            "content": "'#' + Body('issue.id') + ': ' + Body('issue.body', 'n/a')"
          }
        }
      ]
    }
  }
}'
```

This is also asynchronous — poll the returned task the same way.

**3. Get the source's ingest URL.** Fetch the source detail:

```shell
curl --header "X-StorageApi-Token: YOUR_TOKEN" \
     "https://stream.keboola.com/v1/branches/default/sources/github-issues"
```

The response contains the source's **ingest URL** (`https://stream.keboola.com/stream/...` with a secret) — this is the endpoint you will point the GitHub webhook at.

By default, received events are imported into the table when the [import conditions](/storage/data-streams/reference/#conditions) are met (defaults: 1 minute / 50 MB / 50,000 records — adjustable via the [sink settings endpoints](/storage/data-streams/reference/#source-and-sink-settings)).

Normally, the ingest URL only returns a short response to reduce traffic. You can add `?verbose=true` to it to receive more information about what happened with the request. This makes the response slower, so use it for testing only.

## Configuring the Github Webhook

Go to the `Settings` tab of your repository.

![Github repository tabs](/storage/data-streams/tutorial/gh-tabs.png)

Open the `Webhooks` page.

![Github settings pages](/storage/data-streams/tutorial/gh-settings-webhook.png)

Click `Add webhook`.

![Github add webhook](/storage/data-streams/tutorial/gh-settings-webhook-add.png)

Enter the source's **ingest URL** into the `Payload URL` field, and set the `Content Type` to `application/json`.

For `Which events would you like to trigger this webhook?`, click `Let me select individual events`, then find `Issues` and tick it:

![Github webhook let me select individual events selected](/storage/data-streams/tutorial/gh-settings-webhook-individual-events.png)
![Github webhook issues checkbox selected](/storage/data-streams/tutorial/gh-settings-webhook-issues.png)

Click `Add webhook` at the bottom of the page.

Any events related to issues in your repository will now be buffered by the source and imported into your table when the import conditions are met (about a minute with the defaults).

To see your integration at work, head over to your repository and [open a few issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue).

## Results

Creating the sink **automatically generated a dedicated token** in your project — you did not create it yourself. It has the minimum scope (write access to the destination bucket plus file manipulation; files are used as staging storage to prevent data loss). Its description follows the format `[_internal] Stream Sink <source-id>/<sink-id>` — do not delete or refresh it manually (see [Tokens](/storage/data-streams/reference/#tokens)).

![Keboola token settings screenshot showing the generated token](/storage/data-streams/tutorial/token.png)

You can see the staging files in your project's Storage:

![Keboola storage file](/storage/data-streams/tutorial/github_webhook_export_file.png)

Since the table `in.c-github.issues` did not exist, it was created:

![Keboola storage table](/storage/data-streams/tutorial/github_webhook_export_table.png)

**Verify the data landed** — open the table's **Data Sample** in the UI, or fetch the table detail via the Storage API:

```shell
curl --header "X-StorageApi-Token: YOUR_TOKEN" \
     "https://connection.keboola.com/v2/storage/tables/in.c-github.issues"
```

A non-zero `rowsCount` in the response confirms the events were imported.

![Keboola storage table sample data](/storage/data-streams/tutorial/github_webhook_export_table_data.png)

## Next Steps

- [Data Streams Reference](/storage/data-streams/reference/)
- [Stream API Reference](https://stream.keboola.com/v1/documentation/)
