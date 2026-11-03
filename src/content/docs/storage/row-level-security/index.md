---
title: Row-Level and Column-Level Security
slug: 'storage/row-level-security'
description: Restrict which rows and columns of a Storage table each reader can see when they query through the MCP Server, Data Apps or the Keboola CLI — policies you write once and Keboola enforces on every query.
---

:::caution[Beta]
Row- and column-level security (RLS/CLS) is in beta. It works on Snowflake. On BigQuery, governed workspaces can
be created in production, but it has not been verified end to end on a production stack yet.
:::

Row-level security (RLS) limits **which rows** of a table a reader can see. Column-level security (CLS) limits **which columns**. You describe both in *policies* stored with your project. Keboola applies them to every query that runs through a *governed workspace*, so an AI assistant, a Data App user or a script can only read the part of a table the policy allows.

For example, one policy lets the `eu-analysts` group see only the rows where `region` is `EU`, and another hides the `salary` column from everyone except a named administrator.

## What is protected

Policies are enforced by Query Service on queries sent to a **governed workspace**: a workspace created with the login type `governed`. Nobody but Query Service receives the warehouse credentials of such a workspace, so there is no way to connect to it directly and skip the policies.

| Reader | Policies apply |
|---|---|
| [MCP Server](/ai/mcp-server/) session of a project administrator (`query_data`), when the project has the `row-level-security` feature | Yes |
| A script, the [Keboola CLI](/cli/) or another client that queries a governed workspace through Query Service | Yes |
| End users of a [Data App](/data-apps/) signed in through single sign-on (OIDC) | Yes, when the app lists policies in its configuration and passes the user's token to Query Service (see [Data Apps](#data-apps)) |
| Transformations, component runs, the SQL editor, ordinary workspaces, table exports | **No** |

:::caution[What this is, and what it is not]
Anyone who holds a project Storage token can still read the same tables through an ordinary workspace, an export or a transformation. For people who have such a token, for example a project administrator using the MCP Server, policies are a **guardrail on that tool**, not a security boundary. They are a hard boundary for readers who have no other way to the data, in practice the end users of a Data App.

Data that is copied out of a governed table is not governed: transformation outputs, restored snapshots and exports need policies of their own.
:::

## How it works

1. You write **policies**, one per protected table. A policy is a list of *rules*; each rule selects readers and says which rows or columns they get. See the [policy reference](/storage/row-level-security/policy-reference/).
2. A **governed workspace** serves the queries. The MCP Server creates its own governed workspace when the project has the `row-level-security` feature. You can also create one yourself.
3. For every query, Query Service identifies the reader, looks up the policies of the tables the query uses and rewrites the query so it can only return the allowed rows and columns.

### Deny by default

In a governed workspace nothing is readable until a policy allows it. What the reader gets instead depends on who they are:

| Situation | Administrator (Storage token, MCP Server, CLI) | End user of a Data App |
|---|---|---|
| A table with **no policy** | Refused. This also applies to project and organization administrators. | An empty result (no rows), not an error |
| A table with a policy, and **no rule selects the reader** and the policy has no `default` | Refused | An empty result |
| A table whose **column policy does not list the reader** (also when the table has a row policy) | Refused | Refused |
| A reader Query Service **cannot identify** | Refused | Refused |

- A column policy alone opens a table for the readers it names: they read all rows and only the columns the policy allows. A reader it does not name is refused. When the table has a row policy too, the rows come from the row policy and the columns from the column policy.
- Integration tokens, Data App tokens without a user token, and Kai are not identified readers. A password-protected Data App, or an app that does not forward the user's token, is refused too (HTTP 403), it does not read an empty table.

A refused query fails with one generic message, `Row-level security does not allow this query`, whatever the reason. It does not tell the reader whether a policy exists. Because an end user gets an empty result instead of a refusal for a missing policy or an unmatched rule, an empty result can also mean "no access".

A different failure is the HTTP 503 `Row-level security could not be applied to this workspace`. Query Service could not apply the policies at all, for example because it could not read them or the policy engine did not answer, so it ran nothing. It is not a decision about the reader and it can be retried.

## Set it up

### 1. Make sure queries go through a governed workspace

- **MCP Server:** ask Keboola support to enable the `row-level-security` project feature. With it, the MCP Server creates its workspace as governed and sends `query_data` through Query Service. Workspaces that already exist are not changed or converted.
- **Your own workspace:** create one with the login type `governed`. With the [Keboola CLI](/cli/), a governed workspace has no password or key, so there is nothing to save:

<!-- kbagent-check: skip-next -->
```bash
kbagent --json workspace create --project my-project --name governed-ws --governed
```

Queries to a governed workspace read the Storage table by its bucket name, for example `SELECT * FROM "in.c-crm"."orders"` on Snowflake. Unqualified table names are refused.

### 2. Write the policies

Write policies before you switch a project over: a governed workspace shows no data until a policy allows it. Policies are written by a project administrator (master Storage token). Sharing a policy with other projects or applying it to the whole organization needs the organization administrator role.

You can write policies in three ways. They all create the same `rls-policy` and `cls-policy` objects.

**With the Keboola CLI.** The `rls` and `cls` command groups create, list, update and delete policies. Add `--dry-run` to preview the result without writing anything.

<!-- kbagent-check: skip-next -->
```bash
kbagent rls create --project my-project --table-id in.c-crm.orders \
  --rules @rls-rules.json --default '{"false": true}' --dry-run
```

The rule files are described in the [policy reference](/storage/row-level-security/policy-reference/), together with the column-level commands (`cls create` and friends) and the other commands (`list`, `detail`, `update`, `delete`, `schema` and the guided `rls setup`).

**With an AI assistant.** The `kbagent` plugin of [AI Kit](/ai/ai-kit/) teaches an assistant these commands (the plugin is installed with `/plugin install kbagent@keboola-claude-kit`). You can describe the goal in plain words, for example:

> Protect the table `in.c-crm.orders` so that people in the group `eu-analysts` see only the rows with `region` equal to `EU`, and let the administrator with ID 1234 see all rows. Show me the dry run first.

Ask the assistant to run the dry run and show it to you before it writes. Commands that write are subject to the CLI's [permission settings](/cli/); an agent that runs them with `--json` is not asked for a confirmation, so the dry run is your check.

**With the API.** Policies are objects in the Keboola Metastore, so you can create them with `curl` and an administrator's Storage token. The [policy reference](/storage/row-level-security/policy-reference/#create-a-policy-with-the-api) has the requests.

### 3. Check it as the reader

Query a protected table the way the reader does and compare the result with what the policy should allow. Your own identity matters here: an administrator behind a Storage token is matched by the subject `keboola|<your administrator ID>` and is not exempt, so you need a rule for yourself to see anything. The [policy reference](/storage/row-level-security/policy-reference/#who-a-rule-selects) shows where to find your ID.

## What users see

- **`query_data` in the MCP Server** returns only the allowed rows and columns. A refused query returns an error with the message `Row-level security does not allow this query` and an exception ID.
- **The query you sent** is what the status and history of a query show, not the rewritten SQL that Query Service runs, so a reader never sees the conditions of a policy.
- **The metadata tools of the MCP Server** (`get_tables`, `get_buckets`, `search`) list only the tables the reader can read, and only the columns a column policy allows. A table the reader cannot read is reported as not found. A readable table is shown without `rows_count` and `data_size_bytes`, because they count rows that a row policy hides. Table names inside the configurations that `get_configs` and `search` return, and shared buckets of other projects, are not filtered.
- **Debugging a refusal:** the message is deliberately the same for a missing policy, a rule that does not match and an unsupported statement (an end user of a Data App gets an empty result for the first two, not a message). The precise reason is recorded in the Query Service log. When you contact [support](mailto:support@keboola.com), include the exception ID from the error. Use `rls list` to check that the table has a policy, and check that a rule selects the reader.

## Data Apps

A Data App protected by single sign-on (OIDC) is the case where policies are a hard boundary. The proxy that sits in front of the app signs a token with the user's identity and groups and sends it with each request in the `X-Kbc-App-User-Token` header. The app has to pass that header to Query Service with every query, together with the app's own Storage token. See [Data Apps authentication](/data-apps/authentication/) for how users sign in.

**1. List the policies of the app.** Set `runtime.workspace.rlsPolicies` in the app configuration to the IDs of the row policies that apply to the app, and `runtime.workspace.clsPolicies` to the IDs of the column policies (the `id` of each `rls-policy` and `cls-policy`; `rls list`, `cls list` or the Metastore API return them). The two lists are independent: you can set one or both. The workspace must be enabled:

```json
{
  "runtime": {
    "workspace": {
      "enabled": true,
      "rlsPolicies": ["<rls-policy-id>"],
      "clsPolicies": ["<cls-policy-id>"]
    }
  }
}
```

- Each list has 1 to 100 policy IDs. An empty list `[]` is refused: remove the key instead. Put a policy in the list of its own kind; the lists are not interchangeable.
- Only the listed policies apply to the app. A changed list takes effect after you redeploy the app.
- The app must use single sign-on. The platform rejects the configuration (HTTP 400 when you update or deploy the app) if it has a public path or a provider other than single sign-on, so a password-protected app cannot be governed.
- **An app with neither `rlsPolicies` nor `clsPolicies` is not governed and reads every row and column.** This is the most likely misconfiguration: check that the option is set before you rely on a policy. An app is governed when either list is set.

**2. Forward the user's token.** The Query Service clients do it for you:

```python
from keboola_query_service import AppUserToken, StorageToken

auth = AppUserToken(user_token, storage_token=StorageToken(app_storage_token))
```

```javascript
const auth = { type: 'app-user-token', token: userToken, storageToken: appStorageToken };
// pass it to createQueryServiceClient({ baseUrl, auth }) from '@keboola/api-client/queryService'
```

The Python client is `keboola-query-service` 0.4.0 or later, the JavaScript client is `@keboola/api-client` 52.0.0 or later. Both send the user token in `X-Kbc-App-User-Token` and the app token in `X-StorageAPI-Token`, and both raise a `RowLevelSecurityError` when a query is refused.

A query that carries only the app's Storage token, without the user token, is refused (HTTP 403, `Row-level security does not allow this query`). So is a background job without a signed-in user.

## Limitations

- Governed workspaces answer a single `SELECT` (with `WITH`, `UNION`, `EXCEPT`, `INTERSECT`). Everything else is refused, including `SHOW`, `DESCRIBE`, `EXPLAIN`, `INFORMATION_SCHEMA`, `CREATE`, `INSERT`, user-defined functions and queries on query history.
- A statement is refused with the generic 403 when it uses a construct that could reach data outside the policies: `IDENTIFIER()` or `TABLE()` to name an object from a string, AI and ML functions (`AI_*`, `AI.*`, `PREDICT`, `VECTOR_SEARCH`), `TO_FILE`, `READ_CSV` or `READ_PARQUET`, `SECRET`, session-context functions such as `CURRENT_USER()`, `CURRENT_ROLE()` or `CURRENT_STATEMENT()`, `<sequence>.NEXTVAL`, a session variable (`$x`, `@@x`), a control character, or an unquoted name with `$$` or a non-ASCII character in it. `CURRENT_DATE`, `CURRENT_TIME` and `CURRENT_TIMESTAMP` stay allowed. A statement longer than 32 KiB, or with more than 200 CTEs or 300 table references, is refused too.
- Tables must be written with their bucket schema, for example `"in.c-crm"."orders"`. A governed workspace cannot query tables stored in the workspace itself.
- On Snowflake, a table of a linked bucket (a bucket shared from another project) cannot be read in a governed workspace: Query Service refuses it for every reader, because the table lives in the database of the source project. Until linked buckets are supported, load the data into a table of your own project and write the policy for that table.
- Alias tables have not been verified with policies yet. Do not rely on a policy for them.
- Projects with a protected default branch (SOX) are not supported.
- Row-level security of a Data App works on Snowflake projects only. A governed app can only read: it runs `SELECT` statements and nothing else, so an app that writes to its Storage Access tables fails on its inserts, updates and deletes.
- On BigQuery, create the governed workspace with the MCP Server or the API. The `--governed` flag of `kbagent workspace create` does not support BigQuery yet.
- Column policies are an allowlist of visible columns. Masking a column's values is not supported.
- The project feature `row-level-security` is checked by the MCP Server and by the Data App settings page of the Keboola UI only. A workspace you create with the login type `governed` is enforced regardless of the feature.

## Related

- [Policy reference](/storage/row-level-security/policy-reference/): rule syntax, examples and the API
- [MCP Server](/ai/mcp-server/)
- [Keboola CLI](/cli/)
- [AI Kit](/ai/ai-kit/)
- [Data Apps authentication](/data-apps/authentication/)
