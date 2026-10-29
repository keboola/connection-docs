---
title: Row-Level and Column-Level Security
slug: 'ai/row-level-security'
description: Restrict which rows and columns of a Storage table each reader can see when they query through the MCP Server, Data Apps or the Keboola CLI — policies you write once and Keboola enforces on every query.
---

<!-- VERIFY(maintainers): availability wording. Verified against the Query Service RFC (go-monorepo
docs/rfc/query-service-rls-cls), the policy engine README, keboola-mcp-server workspace.py and the kbagent
`rls`/`cls` command help (keboola/cli PRs #778 and #923, not merged at the time of writing). The `kbagent-check`
markers on this page and on the policy reference exist only because command-reference.md is synced from CLI
releases and does not contain `rls`/`cls` yet. Remove them once it does. -->

:::caution[Beta]
Row- and column-level security (RLS/CLS) is in beta. It works on Snowflake. Support for BigQuery is not in
production yet. A few parts described below are marked **Upcoming**; they are not released at the time of writing.
:::

Row-level security (RLS) limits **which rows** of a table a reader can see. Column-level security (CLS) limits **which columns**. You describe both in *policies* stored with your project. Keboola applies them to every query that runs through a *governed workspace*, so an AI assistant, a Data App user or a script can only read the part of a table the policy allows.

For example, one policy lets the `eu-analysts` group see only the rows where `region` is `EU`, and another hides the `salary` column from everyone except a named administrator.

## What is protected

Policies are enforced by Query Service on queries sent to a **governed workspace**: a workspace created with the login type `governed`. Nobody but Query Service receives the warehouse credentials of such a workspace, so there is no way to connect to it directly and skip the policies.

| Reader | Policies apply |
|---|---|
| [MCP Server](/ai/mcp-server/) session of a project administrator (`query_data`), when the project has the `row-level-security` feature | Yes |
| A script, the [Keboola CLI](/cli/) or another client that queries a governed workspace through Query Service | Yes |
| End users of a [Data App](/data-apps/) signed in through single sign-on (OIDC) | Yes, once the app passes the user's token to Query Service (see [Data Apps](#data-apps)) |
| Transformations, component runs, the SQL editor, ordinary workspaces, table exports | **No** |

:::caution[What this is, and what it is not]
Anyone who holds a project Storage token can still read the same tables through an ordinary workspace, an export or a transformation. For people who have such a token, for example a project administrator using the MCP Server, policies are a **guardrail on that tool**, not a security boundary. They are a hard boundary for readers who have no other way to the data, in practice the end users of a Data App.

Data that is copied out of a governed table is not governed: transformation outputs, restored snapshots and exports need policies of their own.
:::

## How it works

1. You write **policies**, one per protected table. A policy is a list of *rules*; each rule selects readers and says which rows or columns they get. See the [policy reference](/ai/row-level-security/policy-reference/).
2. A **governed workspace** serves the queries. The MCP Server creates its own governed workspace when the project has the `row-level-security` feature. You can also create one yourself.
3. For every query, Query Service identifies the reader, looks up the policies of the tables the query uses and rewrites the query so it can only return the allowed rows and columns.

### Deny by default

In a governed workspace nothing is readable until a policy allows it:

- A table with **no policy** is refused. This also applies to project administrators and organization administrators.
- A table with a policy is refused for a reader that none of its rules selects, unless the policy has a `default` rule.
- A column policy never grants rows by itself. A table needs a row policy; a column policy then narrows its columns.
- A reader whom Query Service cannot identify reads nothing. Integration tokens, Data App tokens and Kai are not identified readers.

A refused query fails with one generic message, `Row-level security does not allow this query`, whatever the reason. It does not tell the reader whether a policy exists. **Upcoming:** for an end user of a Data App, a table without a policy or a table no rule selects them for will return an empty result instead of an error; administrators keep the error.

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

:::caution[Upcoming]
The `rls` and `cls` commands are not in a released version of the Keboola CLI yet.
:::

<!-- kbagent-check: skip-next -->
```bash
kbagent rls create --project my-project --table-id in.c-crm.orders \
  --rules @rls-rules.json --default '{"false": true}' --dry-run
```

<!-- kbagent-check: skip-next -->
```bash
kbagent cls create --project my-project --table-id in.c-crm.orders \
  --rules @cls-rules.json --dry-run
```

The rule files are described in the [policy reference](/ai/row-level-security/policy-reference/), together with the other commands (`list`, `detail`, `update`, `delete`, `schema` and the guided `rls setup`).

**With an AI assistant.** The `kbagent` plugin of [AI Kit](/ai/ai-kit/) teaches an assistant these commands (the plugin is installed with `/plugin install kbagent@keboola-claude-kit`). Once the CLI release that contains them is out, you can describe the goal in plain words, for example:

> Protect the table `in.c-crm.orders` so that people in the group `eu-analysts` see only the rows with `region` equal to `EU`, and let the administrator with ID 1234 see all rows. Show me the dry run first.

Ask the assistant to run the dry run and show it to you before it writes. Commands that write are subject to the CLI's [permission settings](/cli/); an agent that runs them with `--json` is not asked for a confirmation, so the dry run is your check.

**With the API.** Policies are objects in the Keboola Metastore, so you can create them with `curl` and an administrator's Storage token. The [policy reference](/ai/row-level-security/policy-reference/#create-a-policy-with-the-api) has the requests.

### 3. Check it as the reader

Query a protected table the way the reader does and compare the result with what the policy should allow. Your own identity matters here: an administrator behind a Storage token is matched by the subject `keboola|<your administrator ID>` and is not exempt, so you need a rule for yourself to see anything. The [policy reference](/ai/row-level-security/policy-reference/#who-a-rule-selects) shows where to find your ID.

## What users see

- **`query_data` in the MCP Server** returns only the allowed rows and columns. A refused query returns an error with the message `Row-level security does not allow this query` and an exception ID.
- **Upcoming:** the metadata tools of the MCP Server (`get_tables`, `get_buckets`, `search`) will list only the tables the reader can read, and only the columns a column policy allows. Until that release they still list every table and column of the project. Names and descriptions are visible, the data is not.
- **Debugging a refusal:** the message is deliberately the same for a missing policy, a rule that does not match and an unsupported statement. The precise reason is recorded in the Query Service log. When you contact [support](mailto:support@keboola.com), include the exception ID from the error. Use `rls list` to check that the table has a policy, and check that a rule selects the reader.

## Data Apps

A Data App protected by single sign-on (OIDC) is the case where policies are a hard boundary. The proxy that sits in front of the app signs a token with the user's identity and groups and sends it with each request in the `X-Kbc-App-User-Token` header; the app has to pass that header to Query Service with every query. A Data App that uses a shared password, or a background job without a signed-in user, has no identity and reads nothing from a governed table.

:::caution[Upcoming]
Forwarding the header from the Python and JavaScript Query Service clients, and enabling policies for an app in its configuration, are in progress. See [Data Apps authentication](/data-apps/authentication/) for how users sign in.
:::

## Limitations

- Governed workspaces answer a single `SELECT` (with `WITH`, `UNION`, `EXCEPT`, `INTERSECT`). Everything else is refused, including `SHOW`, `DESCRIBE`, `EXPLAIN`, `INFORMATION_SCHEMA`, `CREATE`, `INSERT`, user-defined functions and queries on query history.
- Tables must be written with their bucket schema, for example `"in.c-crm"."orders"`. A governed workspace cannot query tables stored in the workspace itself.
- Linked buckets and alias tables have not been verified with policies yet. Do not rely on a policy for them.
- Projects with a protected default branch (SOX) are not supported.
- On BigQuery, governed workspaces are not available in production yet.
- Column policies are an allowlist of visible columns. Masking a column's values is not supported.
- The project feature `row-level-security` is checked by the MCP Server only. A workspace you create with the login type `governed` is enforced regardless of the feature.

## Related

- [Policy reference](/ai/row-level-security/policy-reference/): rule syntax, examples and the API
- [MCP Server](/ai/mcp-server/)
- [Keboola CLI](/cli/)
- [AI Kit](/ai/ai-kit/)
- [Data Apps authentication](/data-apps/authentication/)
