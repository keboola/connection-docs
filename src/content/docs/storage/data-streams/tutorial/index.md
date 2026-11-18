---
title: Data Streams Tutorial
slug: 'storage/data-streams/tutorial'
redirect_from:
    - /integrate/data-streams/tutorial/
    - /integrate/push-data/tutorial/
---

:::note
The request shapes below follow the current [Stream API OpenAPI spec](https://stream.keboola.com/v1/documentation/openapi3.json) (sources + sinks model). The JSON response snippets are illustrative — copy the actual values (e.g. the ingest URL) from your own API responses.
:::

In this tutorial, we will set up a data stream for the [`issues`](https://docs.github.com/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#issues) event from GitHub Webhooks. This will allow you to monitor and analyze activity related to issues in any of your GitHub repositories.

## Prerequisites

- The **master token** of a project user with the **admin** role (**Users & Settings → API Tokens → your
  own token**). Write operations on streams are restricted to admin tokens — a custom
  [Storage API token](/management/project/tokens/), or the master token of a user with the guest or
  read-only role, is rejected with `403 only admin token can do write operations on streams`.
- A GitHub repository where you have the `Admin` role.
- Your stack's Stream API host. The examples use `stream.keboola.com` (AWS US); on other [stacks](/overview/#stacks) replace the host accordingly.
- A branch ID. The examples use `default`, which refers to the production branch.

The destination bucket and table are created for you, so there is nothing to set up in Storage beforehand.

## Creating a Source and a Sink

A **source** is the endpoint that receives events; a **sink** maps received events into a Storage table. They are created separately, and **a source without a sink discards everything it receives** — so create both before pointing GitHub at it.

**1. Create the source.** Set `sourceId` explicitly so you know the ID for the next steps:

```shell
curl --request POST "https://stream.keboola.com/v1/branches/default/sources" \
     --header "Content-Type: application/json" \
     --header "X-StorageApi-Token: YOUR_TOKEN" \
     --data '{"type": "http", "sourceId": "github-issues", "name": "GitHub Issues"}'
```

:::note
`sourceId` is optional — if you omit it, one is derived from `name`, but the derivation splits on capital letters, so `"GitHub Issues"` becomes `git-hub-issues`, not `github-issues`. Setting it explicitly avoids the guesswork. If you do omit it, read the real value from `outputs.sourceId` in the finished task rather than assuming.
:::

The request is asynchronous and returns a task. Poll it until it finishes:

```shell
curl --header "X-StorageApi-Token: YOUR_TOKEN" \
     "https://stream.keboola.com/v1/tasks/TASK_ID"
```

Take `TASK_ID` from the `taskId` field of the create response — or just use its `url` field, which is the ready-made polling URL. A task ID is a multi-segment path built from the task type, the branch and source IDs, and a timestamp with a random suffix, so it legitimately contains `/` and `:` characters; pass it through as-is.

The task is done when `isFinished` is `true`. Then check `status`, which is `success` or `error` (on failure the reason is in `error`):

```json
{
  "taskId": "api.create.source/1234/github-issues/2026-01-14T08:04:05.123Z_Ab3xY",
  "type": "api.create.source",
  "url": "https://stream.keboola.com/v1/tasks/api.create.source/1234/github-issues/2026-01-14T08:04:05.123Z_Ab3xY",
  "status": "success",
  "isFinished": true,
  "createdAt": "2026-01-14T08:04:05.123Z",
  "outputs": {
    "sourceId": "github-issues",
    "url": "https://stream.keboola.com/v1/branches/1234/sources/github-issues"
  }
}
```

Here `1234` is your project's default branch ID, resolved from the `default` you passed in the URL. On success, `outputs.url` is the ready-made source-detail URL used in step 3.

**2. Create a sink** on the source. The sink maps event data to columns of a destination table. The JSON is passed on standard input so that the quotes inside the Jsonnet template survive:

```shell
curl --request POST "https://stream.keboola.com/v1/branches/default/sources/github-issues/sinks" \
     --header "Content-Type: application/json" \
     --header "X-StorageApi-Token: YOUR_TOKEN" \
     --data @- <<'JSON'
{
  "type": "table",
  "sinkId": "events",
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
            "content": "'#' + Body('issue.id', 'n/a') + ': ' + Body('issue.body', 'n/a')"
          }
        }
      ]
    }
  }
}
JSON
```

:::caution
Do not inline this JSON into `--data '…'`. The Jsonnet template contains single quotes, which would terminate the shell's quoted string and silently truncate the request.
:::

Both `Body()` calls above pass a default value. That matters because GitHub sends a `ping` event as soon as you add the webhook, and that payload has no `issue` field — a single-argument `Body('issue.id')` fails on it and the record is dropped.

This request is also asynchronous — poll the returned task the same way.

**3. Get the source's ingest URL.** Fetch the source detail:

```shell
curl --header "X-StorageApi-Token: YOUR_TOKEN" \
     "https://stream.keboola.com/v1/branches/default/sources/github-issues"
```

The response contains the source's **ingest URL** in the `http.url` field — a value of the form
`https://stream-in.keboola.com/stream/<projectId>/<sourceId>/<secret>`. Note that events are ingested on a separate
data-plane host (`stream-in.<stack>`), not on the Stream API host you have been calling so far. Copy the value from the
response rather than assembling it by hand; the secret is what authenticates the requests. This is the endpoint you will
point the GitHub webhook at.

By default, received events are imported into the table when the [import conditions](/storage/data-streams/reference/#conditions) are met (defaults: 1 minute / 50 MB / 50,000 records — adjustable via the [sink settings endpoints](/storage/data-streams/reference/#source-and-sink-settings)).

Normally, the ingest URL only returns a short response to reduce traffic. You can add `?verbose=true` to it to receive more information about what happened with the request. This makes the response slower, so use it for testing only.

## Configuring the Github Webhook

Go to the `Settings` tab of your repository.

![Github repository tabs](/storage/data-streams/tutorial/gh-tabs.png)

Open the `Webhooks` page.

![Github settings pages](/storage/data-streams/tutorial/gh-settings-webhook.png)

Click `Add webhook`.

![Github add webhook](/storage/data-streams/tutorial/gh-settings-webhook-add.png)

Enter the source's **ingest URL** into the `Payload URL` field, and set the `Content type` to `application/json`. Leave
`Secret` empty — the secret embedded in the ingest URL is what authenticates the request, and GitHub's signature header
is not verified.

For `Which events would you like to trigger this webhook?`, click `Let me select individual events`, then find `Issues` and tick it:

![Github webhook let me select individual events selected](/storage/data-streams/tutorial/gh-settings-webhook-individual-events.png)
![Github webhook issues checkbox selected](/storage/data-streams/tutorial/gh-settings-webhook-issues.png)

Click `Add webhook` at the bottom of the page.

Any events related to issues in your repository will now be buffered by the source and imported into your table when the import conditions are met (about a minute with the defaults).

To see your integration at work, head over to your repository and [open a few issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue).

## Results

Creating the sink **automatically generated a dedicated token** in your project — you did not create it yourself. It has the minimum scope: write access to the destination bucket, plus read access to all file uploads (files are used as staging storage to prevent data loss). Its description follows the format `[_internal] Stream Sink <source-id>/<sink-id>`, so with the IDs used above it reads `[_internal] Stream Sink github-issues/events` — do not delete or refresh it manually (see [Tokens](/storage/data-streams/reference/#tokens)).

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

A non-zero `rowsCount` in the response confirms the events were imported. Give it a minute — with the default import
conditions `rowsCount` legitimately stays at `0` until the first import runs. (Replace `connection.keboola.com` with your
own [stack's](/overview/#stacks) host if you are not on AWS US.)

![Keboola storage table sample data](/storage/data-streams/tutorial/github_webhook_export_table_data.png)

## Cleaning Up

To undo everything from this tutorial:

1. Delete the webhook in GitHub (**Settings → Webhooks → Delete**).
2. Delete the source, which deletes its sinks and the generated token with it:

```shell
curl --request DELETE "https://stream.keboola.com/v1/branches/default/sources/github-issues" \
     --header "X-StorageApi-Token: YOUR_TOKEN"
```

3. Optionally drop the `in.c-github` bucket in Storage if you no longer need the collected data.

## Next Steps

- [Data Streams Reference](/storage/data-streams/reference/)
- [Stream API Reference](https://stream.keboola.com/v1/documentation/)
