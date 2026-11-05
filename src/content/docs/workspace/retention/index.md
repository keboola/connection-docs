---
title: Workspace Retention
slug: 'workspace/retention'
description: Unused Snowflake and BigQuery workspaces are warned, deactivated and deleted automatically. How it works, which e-mails you get and how to keep or recover a workspace.
---

From 9 November 2026, Keboola cleans up unused Snowflake and BigQuery workspaces automatically. A workspace
nobody has used for six months is first warned, then deactivated, and finally deleted. You get an e-mail
at each step, and using a workspace keeps it. See also the
[changelog announcement](https://www.keboola.com/changelog/unused-workspaces-will-be-cleaned-up-automatically).

## Which Workspaces Are Affected

Retention applies to Snowflake and BigQuery workspaces that have their own database login:

- [SQL workspaces](/workspace/) (sandboxes) created in the Workspaces section,
- workspaces created by components, for example the workspace a database writer writes into,
- workspaces created directly through the [Storage API](https://keboola.docs.apiary.io/#reference/workspaces).

The following workspaces are **not** affected:

- Python and R workspaces (JupyterLab),
- workspaces created by a transformation run (they are temporary and are removed separately, without an e-mail),
- workspaces of [data apps](/data-apps/) and of the [MCP server](/ai/mcp-server/),
- read-only workspaces of the [Data Gateway](/components/applications/data-gateway/) (Snowflake reader account),
- workspaces on any other backend.

## What Counts as Use

Any of the following resets the six-month period:

- a login with the workspace credentials: the [SQL Editor](/workspace/sql-editor/), a SQL client,
  a BI tool, or a component such as a writer;
- a job that loads data into the workspace or reads data from it (load, unload, table import or export,
  output mapping).

Opening the workspace detail in Keboola without connecting to it does **not** count.

Activity is checked every three hours, so a login is usually reflected within about three hours. Because of
that delay, use the workspace at least a day before the deactivation date rather than on the day itself.

## Timeline

| Step | When | What happens | E-mail |
|---|---|---|---|
| **Warning** | 6 months without use | Nothing changes yet; the workspace works normally. | Lists the workspace and its deactivation date. |
| **Deactivation** | 30 days after the warning | Nobody can log in to the workspace. The data stays. | Lists the workspace and its deletion date. |
| **Deletion** | 3 months after deactivation | The workspace, its data and its database user are deleted. This cannot be undone. | Confirms the deletion. |

All dates in the e-mails are in UTC. Using the workspace any time before the deactivation date cancels
the warning and the workspace stays active.

The first warnings are sent organization by organization over the rollout period. Workspaces that have
already been unused for a long time are included from the start, so the first deactivations follow 30 days
after an organization's warning and the first deletions three months after that. The rollout dates are in
the [changelog announcement](https://www.keboola.com/changelog/unused-workspaces-will-be-cleaned-up-automatically).

## E-mails

You receive **one summary e-mail per organization and step**, listing all your affected workspaces grouped
by project, not one e-mail per workspace. The subjects are:

- `Your unused workspace "<name>" will be deactivated` or `<N> unused workspaces in organization "<organization>" will be deactivated`
- `Your unused workspace "<name>" has been deactivated` or `<N> unused workspaces in organization "<organization>" have been deactivated`
- `Your unused workspace "<name>" has been deleted` or `<N> unused workspaces in organization "<organization>" have been deleted`

The e-mail goes to the user who created the workspace. If that user is no longer a member of the project,
or the workspace was created with a Storage API token, the e-mail goes to all administrators of the
project's organization. Each such workspace is marked in the e-mail with the reason you received it.

## What You See in Keboola

**All workspaces overview.** Go to **Project Settings > All workspaces**. The page lists every workspace of
the project in all branches, including workspaces created by components and through the API, with the
**Last used** date and the retention **State**:

- **Unused** — not used for six months; the next retention run sends the warning.
- **Warned** — the warning was sent; the column shows the deactivation date.
- **Deactivated** — nobody can log in; the column shows the deletion date.

Switch to **Will be removed** to see only the workspaces in one of these states. The links in the retention
e-mails open this view.

**Workspace list and detail.** In the Workspaces section, a warned workspace keeps its **Active** status with
an orange warning icon. Its detail shows the deactivation date (UTC) and the hint to connect to it to keep it.

A deactivated workspace has a grey **Deactivated** badge. Connect, Open SQL Editor, credentials, and Load and
Unload data are disabled. The detail shows the deletion date and a **contact support** link that opens a
support ticket for the reactivation. Delete still works.

## Keeping a Workspace

Use the workspace before the deactivation date in the e-mail: connect to it with the SQL Editor or a SQL
client, or run a job that loads data into it or reads data from it (see [What Counts as Use](#what-counts-as-use)).
Nothing else is needed; the warning is cancelled automatically.

If you no longer need the workspace, you can delete it yourself at any time.

## Getting a Deactivated Workspace Back

A deactivated workspace can be reactivated only by Keboola support. Project administrators cannot do it.
[Contact support](/management/support/) before the deletion date and include the workspace ID. You find it in
the workspace detail and in **Project Settings > All workspaces**. After reactivation, you can connect right
away and the six-month period starts again from that day.

A deleted workspace cannot be restored.

While a workspace is deactivated, loading data, unloading data, showing credentials and resetting the
password fail with this message:

```
Workspace "<workspaceId>" was deactivated because it had not been used for a long time. Contact Keboola support to have it reactivated, or delete it.
```

## What Is Deleted

Deletion removes the workspace schema or dataset, all data in it and its database user. Tables in Storage are
not affected.

Configurations of other components are kept — a workspace created by a writer or a transformation is deleted,
but the writer or transformation configuration itself stays, including its code. The one exception is the SQL
workspace (sandbox) configuration: it is only a wrapper around the sandbox, so once its last workspace is
deleted, the configuration is moved to trash as well.

## Exceptions

A whole project can be excluded from retention, for example when its workspaces are used by an external
process Keboola cannot see. Contact [support](/management/support/) to request it. Single workspaces cannot be
excluded.

## FAQ

**Our writer runs every day. Is its workspace affected?**
No. Every run logs in to the workspace, so it stays active.

**A workspace disappeared and nobody got an e-mail.**
Workspaces left over by transformation runs are deleted without an e-mail. The deletion is recorded in the
project events.

**I am an organization administrator. Why did I get the e-mail?**
The user who created the workspace is no longer a member of the project, or the workspace was created with a
Storage API token. The e-mail says this next to each such workspace.
