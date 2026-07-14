---
title: Data Streams Tutorial
slug: 'storage/data-streams/tutorial'
redirect_from:
    - /integrate/data-streams/tutorial/
    - /integrate/push-data/tutorial/
---

:::caution[Needs review]
`VERIFY(owner)`: This end-to-end example uses the Stream API directly. The source-creation payload below
uses an older `exports` shape; the current API models sources and `sinks` separately (see the
[Data Streams Reference](/storage/data-streams/reference/)). Confirm the payload against the live
[Stream API](https://stream.keboola.com/v1/documentation/) before relying on it.
:::

In this tutorial, we will set up a source for the [`issues`](https://docs.github.com/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#issues) event from GitHub Webhooks. This will allow you to monitor and analyze activity related to issues in any of your GitHub repositories.

You will need your project's master token, and a GitHub repository where you have the `Admin` role.

## Creating a Source

To start ingesting events, you must first create a source. Send the following payload to the `https://stream.keboola.com/v1/branches/{branchId}/sources` endpoint:
```json
{
  "name": "Github Issues",
  "exports": [
    {
      "name": "Events",
      "conditions": { "count": 1 },
      "mapping": {
        "tableId": "in.c-github.issues",
        "columns": [
          {
            "type": "id",
            "name": "id"
          },
          { "type": "datetime", "name": "datetime" },
          { "type": "ip", "name": "ip" },
          { "type": "body", "name": "body" },
          { "type": "headers", "name": "headers" },
          {
            "type": "path",
            "name": "id",
            "path": "issue.id",
            "defaultValue": "undefined", 
            "rawString": true
          },
          {
            "type": "template",
            "name": "template",
            "template": {
              "language": "jsonnet",
              "content": "'#' + Body('issue.id') + ': ' + Body('issue.body', 'n/a')"
            }
          }
        ]
      }
    }
  ]
}
```

You can do this using `curl`, or anything else that allows you to send an HTTP request:
```shell
$ curl --header 'Content-Type: application/json' \
       --header 'X-StorageApi-Token: <YOUR_TOKEN>' \
       --data '{ ...the payload above... }' \
       https://stream.keboola.com/v1/branches/{branchId}/sources
```

The response will contain the task that has been created:
```json
{
  "id": "2023-02-16T16:04:39.570Z_Pg7U4",
  "sourceId": "github-issues",
  "url": "https://stream.keboola.com/v1/branches/{branchId}/sources/github-issues/tasks/source.create/2023-02-16T16:04:39.570Z_Pg7U4",
  "type": "source.create",
  "createdAt": "2023-02-17T11:20:57.406Z",
  "isFinished": false,
  "result": ""
}
```

You can query the task's status by querying the `url` field and wait until the `isFinished` field is set to `true`:
```json
{
  "id": "2023-02-16T16:04:39.570Z_Pg7U4",
  "sourceId": "github-issues",
  "url": "https://stream.keboola.com/v1/branches/{branchId}/sources/github-issues/tasks/source.create/2023-02-16T16:04:39.570Z_Pg7U4",
  "type": "source.create",
  "createdAt": "2023-02-17T11:20:57.406Z",
  "finishedAt": "2023-02-17T11:20:57.753Z",
  "isFinished": true,
  "duration": 343,
  "result": "source created"
}
```

Upon success, query the source URL `https://stream.keboola.com/v1/branches/{branchId}/sources/github-issues`, and the response will contain the source you've just created:
```json
{
  "id": "github-issues",
  "url": "https://stream.keboola.com/stream/<YOUR_PROJECT_ID>/github-issues/<SECRET>",
  "name": "Github Issues",
  "exports": [
    {
      "id": "events",
      "name": "Events",
      "conditions": {
        "count": 1,
        "size": "5MB",
        "time": "5m"
      },
      "mapping": {
        "tableId": "in.c-github.issues",
        "columns": [
          {
            "type": "id",
            "name": "id"
          },
          { "type": "datetime", "name": "datetime" },
          { "type": "ip", "name": "ip" },
          { "type": "body", "name": "body" },
          { "type": "headers", "name": "headers" },
          {
            "type": "path",
            "name": "id",
            "path": "issue.id",
            "defaultValue": "undefined", 
            "rawString": true
          },
          {
            "type": "template",
            "name": "template",
            "template": {
              "language": "jsonnet",
              "content": "'#' + Body('issue.id') + ': ' + Body('issue.body', 'n/a')"
            }
          }
        ]
      }
    }
  ]
}
```

The most important part of the response is the `url` field. This is the endpoint to which you will point your GitHub webhook. Once you've created the source and obtained its `url` field, you are ready to configure the GitHub webhook.

Normally, the URL only returns a short response to reduce traffic. You can add `?verbose=true` to the URL to receive more information about what happened with the request. Note that this makes the response slower, so we recommend using this parameter for testing purposes only.

## Configuring the Github Webhook

Go to the `Settings` tab of your repository.

![Github repository tabs](/storage/data-streams/tutorial/gh-tabs.png)

Open the `Webhooks` page.

![Github settings pages](/storage/data-streams/tutorial/gh-settings-webhook.png)

Click `Add webhook`.

![Github add webhook](/storage/data-streams/tutorial/gh-settings-webhook-add.png)

Enter the source `url` into the `Payload URL` field, and set the `Content Type` to `application/json`.

For `Which events would you like to trigger this webhook?`, click `Let me select individual events`, then find `Issues` and tick it:

![Github webhook let me select individual events selected](/storage/data-streams/tutorial/gh-settings-webhook-individual-events.png)
![Github webhook issues checkbox selected](/storage/data-streams/tutorial/gh-settings-webhook-issues.png)

Click `Add webhook` at the bottom of the page.

Any events related to issues in your repository will now be buffered by the source, and uploaded to your table every minute.

To see your integration at work, head over to your repository and [open a few issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue).

## Results

The following token was generated.

![Keboola token settings screenshot showing the generated token](/storage/data-streams/tutorial/token.png)

This token only has the minimal set of permissions, which, in this case, is access to a single bucket and the ability to manipulate files. Currently, files are used as staging storage to prevent data loss. You can see these files in your project's Storage.

![Keboola storage file](/storage/data-streams/tutorial/github_webhook_export_file.png)

Since the table `in.c-github-issues` did not exist, it was created.

![Keboola storage table](/storage/data-streams/tutorial/github_webhook_export_table.png)

Finally, you can take a look at the destination table's data sample to find your data, ready for further processing.

![Keboola storage table sample data](/storage/data-streams/tutorial/github_webhook_export_table_data.png)

## Next Steps

- [Data Streams Reference](/storage/data-streams/reference/)
- [Stream API Reference](https://stream.keboola.com/v1/documentation/)
