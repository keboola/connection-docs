---
title: Row-Level and Column-Level Security
slug: 'storage/row-level-security'
description: 'How row-level and column-level security works in Keboola: what policies protect, who they apply to, deny by default, what readers see, and the limitations.'
---

:::caution[Beta]
Row- and column-level security (RLS/CLS) is in beta. It works on Snowflake. On BigQuery, governed workspaces can
be created in production, but it has not been verified end to end on a production stack yet.
:::

Row-level security (RLS) limits **which rows** of a table a reader can see. Column-level security (CLS) limits **which columns**. You describe both in *policies* stored with your project. Keboola applies them to every query that runs through a *governed workspace*, so an AI assistant, a Data App user or a script can only read the part of a table the policy allows.

<!-- Explanation-type page. Source: the row-level security page as it stood on main before the split into this page and a how-to page. Structure checked 2026-11-19, facts not re-verified. -->

For example, one policy lets the `eu-analysts` group see only the rows where `region` is `EU`, and another hides the `salary` column from everyone except a named administrator.

To turn the feature on, follow [Set up row-level and column-level security](/storage/row-level-security/set-up/). The format of a policy is in the [policy reference](/storage/row-level-security/policy-reference/).

## What is protected

Policies are enforced by Query Service on queries sent to a **governed workspace**: a workspace created with the login type `governed`. Nobody but Query Service receives the warehouse credentials of such a workspace, so there is no way to connect to it directly and skip the policies.

| Reader | Policies apply |
|---|---|
| [MCP Server](/ai/mcp-server/) session of a project administrator (`query_data`), when the project has the `row-level-security` feature | Yes |
| A script, the [Keboola CLI](/cli/) or another client that queries a governed workspace through Query Service | Yes |
| End users of a [Data App](/data-apps/) signed in through single sign-on (OIDC) | Yes, when the app lists policies in its configuration and passes the user's token to Query Service (see [Apply policies to a Data App](/storage/row-level-security/set-up/#apply-policies-to-a-data-app)) |
| Transformations, component runs, the SQL editor, ordinary workspaces, table exports | **No** |

:::caution[What this is, and what it is not]
Anyone who holds a project Storage token can still read the same tables through an ordinary workspace, an export or a transformation. For people who have such a token, for example a project administrator using the MCP Server, policies are a **guardrail on that tool**, not a security boundary. They are a hard boundary for readers who have no other way to the data, in practice the end users of a Data App.

Data that is copied out of a governed table is not governed: transformation outputs, restored snapshots and exports need policies of their own.
:::

## How it works

- You write **policies**, one per protected table. A policy is a list of *rules*; each rule selects readers and says which rows or columns they get. See the [policy reference](/storage/row-level-security/policy-reference/).
- A **governed workspace** serves the queries. The MCP Server creates its own governed workspace when the project has the `row-level-security` feature. You can also create one yourself: see [Make sure queries go through a governed workspace](/storage/row-level-security/set-up/#1-make-sure-queries-go-through-a-governed-workspace).
- For every query, Query Service identifies the reader, looks up the policies of the tables the query uses and rewrites the query so it can only return the allowed rows and columns.

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

## What users see

- **`query_data` in the MCP Server** returns only the allowed rows and columns. A refused query returns an error with the message `Row-level security does not allow this query` and an exception ID.
- **The query you sent** is what the status and history of a query show, not the rewritten SQL that Query Service runs, so a reader never sees the conditions of a policy.
- **The metadata tools of the MCP Server** (`get_tables`, `get_buckets`, `search`) list only the tables the reader can read, and only the columns a column policy allows. A table the reader cannot read is reported as not found. A readable table is shown without `rows_count` and `data_size_bytes`, because they count rows that a row policy hides. Table names inside the configurations that `get_configs` and `search` return, and shared buckets of other projects, are not filtered.
- **Debugging a refusal:** the message is deliberately the same for a missing policy, a rule that does not match and an unsupported statement (an end user of a Data App gets an empty result for the first two, not a message). The precise reason is recorded in the Query Service log. When you contact [support](mailto:support@keboola.com), include the exception ID from the error. Use `rls list` to check that the table has a policy, and check that a rule selects the reader.

## Data Apps

For the end users of a [Data App](/data-apps/) who sign in through single sign-on (OIDC), policies are a hard boundary. The app lists its policies in its configuration and passes each user's token to Query Service. To configure both, see [Apply policies to a Data App](/storage/row-level-security/set-up/#apply-policies-to-a-data-app).

## Limitations

- Governed workspaces answer a single `SELECT` (with `WITH`, `UNION`, `EXCEPT`, `INTERSECT`). Everything else is refused, including `SHOW`, `DESCRIBE`, `EXPLAIN`, `INFORMATION_SCHEMA`, `CREATE`, `INSERT`, user-defined functions and queries on query history.
- A statement is refused with the generic 403 when it uses a construct that could reach data outside the policies: `IDENTIFIER()` or `TABLE()` to name an object from a string, AI and ML functions (`AI_*`, `AI.*`, `PREDICT`, `VECTOR_SEARCH`), `TO_FILE`, `READ_CSV` or `READ_PARQUET`, `SECRET`, session-context functions such as `CURRENT_USER()`, `CURRENT_ROLE()` or `CURRENT_STATEMENT()`, `<sequence>.NEXTVAL`, a session variable (`$x`, `@@x`), a control character, or an unquoted name with `$$` or a non-ASCII character in it. `CURRENT_DATE`, `CURRENT_TIME` and `CURRENT_TIMESTAMP` stay allowed. A statement longer than 32 KiB, or with more than 200 CTEs or 300 table references, is refused too.
- Tables must be written with their bucket schema, for example `"in.c-crm"."orders"`. A governed workspace cannot query tables stored in the workspace itself.
- On Snowflake, a table of a linked bucket (a bucket shared from another project) cannot be read in a governed workspace: Query Service refuses it for every reader, because the table lives in the database of the source project. Until linked buckets are supported, load the data into a table of your own project and write the policy for that table.
- Alias tables have not been verified with policies yet. Do not rely on a policy for them.
- Projects with a protected default branch (SOX) are not supported.
- Row-level security of a Data App works on Snowflake projects only. A governed app can only read: it runs `SELECT` statements and nothing else, so an app that writes to its Storage Access tables fails on its inserts, updates and deletes.
- On BigQuery, create the governed workspace with the MCP Server, the API, or the `--governed` flag of `kbagent workspace create` (Keboola CLI 1.2.0 or later).
<!-- Checked 2026-11-20: keboola/cli supports --governed on Snowflake and BigQuery since 1.2.0 (changelog #892, #922; GOVERNED_WORKSPACE_BACKENDS in constants.py). -->
- Column policies are an allowlist of visible columns. Masking a column's values is not supported.
- The project feature `row-level-security` is checked by the MCP Server and by the Data App settings page of the Keboola UI only. A workspace you create with the login type `governed` is enforced regardless of the feature.

## This section

- [Set up row-level and column-level security](/storage/row-level-security/set-up/): create a governed workspace, write policies with the Keboola CLI, an AI assistant or the API, check them as the reader, and govern a Data App.
- [Policy reference](/storage/row-level-security/policy-reference/): what a policy contains, how a rule selects its readers, the condition language, how policies combine, and examples.

## Related

- [MCP Server](/ai/mcp-server/)
- [Keboola CLI](/cli/)
- [AI Kit](/ai/ai-kit/)
- [Data Apps authentication](/data-apps/authentication/)

---

**Next:** [Set up row-level and column-level security →](/storage/row-level-security/set-up/)
