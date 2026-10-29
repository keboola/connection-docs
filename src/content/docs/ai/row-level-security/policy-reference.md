---
title: Policy Reference
slug: 'ai/row-level-security/policy-reference'
description: Write row-level and column-level security policies — how rules select readers, the condition language, how policies combine, examples, and the Keboola CLI and API calls that create them.
---

<!-- VERIFY(maintainers): see the comment at the top of /ai/row-level-security/. Condition shapes and rule
semantics verified against the Metastore schemas `rls-policy` 1.2.0 and `cls-policy` 1.2.0 (go-monorepo
services/metastore/migrations/schema), the policy engine (services/query/policy-engine) and the kbagent
`rls`/`cls` command help. The curl envelope is the one the kbagent Metastore client and the Metastore
integration tests send. -->

This page describes the policies behind [row-level and column-level security](/ai/row-level-security/): what a policy contains, how a rule selects its readers, and how to create one.

## A policy

A policy protects **one table**, identified by its Storage table ID (for example `in.c-crm.orders`). There are two kinds, and a table can have both:

| Kind | Object type | Contains | Controls |
|---|---|---|---|
| Row-level | `rls-policy` | `rules`, optional `default` | Which rows a reader sees |
| Column-level | `cls-policy` | `rules` | Which columns a reader sees |

Each **rule** has a selector, which says whom the rule is for, and a payload:

- In an `rls-policy` the payload is a `condition`, a filter on the table's rows.
- In a `cls-policy` the payload is `visible_columns`, the list of columns the selected readers can read. Columns that are not listed are left out of the result.

A table has one policy of each kind per owning project. A policy applies to the project that owns it and to the projects it is shared with (see [Scope](#scope-and-permissions)).

## Who a rule selects

Each rule has exactly one selector: `subjects` or `groups`.

| Selector | Value | Matches |
|---|---|---|
| `subjects` | A list of `<idp>|<sub>` strings | A reader with exactly that subject: the issuer of the identity provider, a `|`, and the user's `sub` |
| `groups` | A list of group names | A reader whose identity provider delivered one of these groups |
| `["*"]` in either list | The only entry of its list | Every identified reader |

- **Administrators.** An administrator who queries with a Storage token or an MCP Server session has the subject `keboola|<administrator ID>`, for example `keboola|1234`. Administrators get no exemption, so they need a rule like any other reader.
- **Data App users.** A user who signs in to a Data App has the subject `<idp>|<sub>`, where `idp` is the issuer URL of the identity provider and `sub` is the user's `sub` claim, for example `https://login.example.com|user-1`. For GitHub sign-in the `sub` is the account login. An author cannot read a `sub` off an identity provider, so in practice **group rules and `["*"]` are the usual selectors for app users**.
- **Groups** are the strings the identity provider sends in its groups claim, exactly as delivered. Keboola does not manage group membership. A reader whose groups are unknown never matches a group rule.
- **Email is not a selector.** New policies cannot select a reader by email, because an identity provider can assert any email. Policies written earlier with `principal` or `principals` (schema 1.0.0 and 1.1.0) keep working and are read by their own rules. To change who they select, create a new policy with `subjects` or `groups`.
- `"*"` must be the only entry of its list. It never matches a reader with no identity, and it cannot widen a stricter policy on the same table.

To find the administrator ID that goes after `keboola|`, list the tokens of the project and read the `admin.id` of your own master token:

```bash
kbagent --json token list --project my-project
```

## Conditions

A condition is a filter on the rows of the table. It is built from the following shapes. There is no free-text SQL, which keeps the policy safe to author.

```json
{"column": "status", "op": "eq", "value": "active"}
```

Comparison operators are `eq`, `ne`, `gt`, `gte`, `lt` and `lte`, with a string, number or boolean `value`.

```json
{"column": "region", "op": "in", "values": ["EU", "US"]}
```

Membership operators are `in` and `not_in`.

```json
{"column": "deleted_at", "op": "is_null"}
```

`is_null` and `is_not_null` are the only way to match an empty value. A `null` value in a comparison is rejected.

```json
{"and": [
  {"column": "region", "op": "eq", "value": "EU"},
  {"column": "status", "op": "ne", "value": "draft"}
]}
```

`and` and `or` combine two or more conditions. There is no `not`.

```json
{"true": true}
```

`{"true": true}` applies no filter and `{"false": true}` matches no row. Use `{"true": true}` sparingly: it is how you give a reader every row.

Column names are matched exactly, including case.

### Values that come from the reader

Instead of a fixed value, a condition can use the reader's own identity:

- `{"$identity": "email"}` as a `value` is the reader's email. It exists only when the identity provider verified the email. A reader without one is refused by a rule that uses it.
- `{"$identity": "groups"}` as `values` is the reader's list of groups.

```json
{"column": "owner_email", "op": "eq", "value": {"$identity": "email"}}
```

## How rules and policies combine

- Within one `rls-policy`, every rule that selects the reader applies, and their conditions are combined with **OR**.
- If no rule selects the reader, the reader gets the policy's `default` condition. Without a `default` the read is **refused**. Use `{"false": true}` as the `default` to return no rows instead.
- Within one `cls-policy`, the reader sees the **union** of the `visible_columns` of the rules that select them. A column policy has no `default`: a reader that no rule selects is refused.
- Several policies on one table combine with **AND** (for columns, the intersection). A policy added later can only narrow access.
- A table with no policy, or only a column policy, is refused (see [deny by default](/ai/row-level-security/#deny-by-default)).

## Scope and permissions

| `scope` | Applies to |
|---|---|
| `targeted` (default) | The project that owns the policy, plus the projects listed in `targetProjectIds` |
| `organization` | **Every** project of the organization |

There is no project-only scope; a `targeted` policy with no targets covers its own project. Prefer `targeted`: an `organization` policy is loaded by every project of the organization, including projects on a different backend.

A project administrator (master Storage token) can create, change and delete a `targeted` policy of their own project. Sharing it with other projects (`targetProjectIds`) or creating an `organization` policy needs the organization administrator role.

The `dialect` field of a policy (`snowflake` or `bigquery`) is optional in the API. The CLI sets it to the backend of the project and refuses any other value.

## Examples

All names and values below are made up.

### Rows by region for a group, and own rows for sales representatives

The group `eu-analysts` sees the rows of the region `EU`. A representative in the group `sales-reps` sees the rows whose `owner_email` is their own email. Everyone else gets no rows.

```json
{
  "rules": [
    {
      "groups": ["eu-analysts"],
      "condition": {"column": "region", "op": "eq", "value": "EU"}
    },
    {
      "groups": ["sales-reps"],
      "condition": {"column": "owner_email", "op": "eq", "value": {"$identity": "email"}}
    }
  ],
  "default": {"false": true}
}
```

### An administrator who sees every row

Add a rule for the administrator with ID 1234. Rules combine with OR, so this reader sees all rows even when other rules are narrower.

```json
{
  "subjects": ["keboola|1234"],
  "condition": {"true": true}
}
```

### Columns for a group

Members of `analysts` see three columns and the administrator sees one more. Nobody else can read the table. The `salary` column is hidden from both.

```json
{
  "rules": [
    {
      "groups": ["analysts"],
      "visible_columns": ["id", "region", "amount"]
    },
    {
      "subjects": ["keboola|1234"],
      "visible_columns": ["id", "region", "amount", "owner_email"]
    }
  ]
}
```

### A table everyone may read

A reference table that every identified reader may read in full needs a row policy with the wildcard. Without it the table is refused.

```json
{
  "rules": [
    {"subjects": ["*"], "condition": {"true": true}}
  ]
}
```

## Create a policy with the Keboola CLI

:::caution[Upcoming]
The `rls` and `cls` commands are not in a released version of the Keboola CLI yet.
:::

Both groups have the same commands. `--rules` accepts JSON, `@file` or `-` for standard input. Add `--dry-run` to any command that writes to see the result without writing it.

| Command | What it does |
|---|---|
| `rls list`, `cls list` | List the policies of a project |
| `rls detail`, `cls detail` | Show the rules of one policy (`--policy-id`) |
| `rls schema`, `cls schema` | Print the live JSON Schema of the policy from the Metastore |
| `rls create`, `cls create` | Create the policy of one table (`--table-id`, `--rules`; `rls create` also takes `--default`) |
| `rls update`, `cls update` | Change only the options you pass |
| `rls delete`, `cls delete` | Delete a policy. In a governed workspace a table without a row policy is refused |
| `rls setup` | Guided setup in a terminal: pick tables, build a condition, preview, write |

Useful options of `create` and `update`: `--scope targeted|organization`, `--target-project` (repeatable) and `--dialect snowflake|bigquery`. Without a `--default`, a reader that no rule selects is refused.

<!-- kbagent-check: skip-next -->
```bash
kbagent rls create --project my-project --table-id in.c-crm.orders --rules @rls-rules.json --default '{"false": true}' --dry-run
```

<!-- kbagent-check: skip-next -->
```bash
kbagent cls create --project my-project --table-id in.c-crm.orders --rules @cls-rules.json --yes
```

The CLI refuses a rule that selects by `principal` or email before anything is written. It also checks the dialect against the project backend and reports every problem it finds.

## Create a policy with the API

Policies are objects of the Keboola Metastore. Its address is the address of your stack with `connection.` replaced by `metastore.`, for example `https://metastore.<stack>.keboola.com`. Authenticate with the project administrator's Storage token in the `X-StorageApi-Token` header.

The `name` of the object is the table ID, and a project can have one policy of each kind per table. The `rules` and `default` in `data` are the ones from the examples above.

```bash
curl -sS -X POST "https://metastore.<stack>.keboola.com/api/v1/repository/rls-policy" \
  -H "X-StorageApi-Token: $KBC_STORAGE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "in.c-crm.orders",
    "branch": "main",
    "scope": "targeted",
    "data": {
      "table": "in.c-crm.orders",
      "rules": [
        {
          "groups": ["eu-analysts"],
          "condition": {"column": "region", "op": "eq", "value": "EU"}
        }
      ],
      "default": {"false": true}
    }
  }'
```

For a column policy post to `/api/v1/repository/cls-policy` with `"visible_columns"` in each rule instead of a `condition`, and without `default`. To list the policies visible to the project:

```bash
curl -sS "https://metastore.<stack>.keboola.com/api/v1/repository/rls-policy" \
  -H "X-StorageApi-Token: $KBC_STORAGE_TOKEN"
```

A rule that selects by email is rejected by the schema validation (HTTP `422`), and a second policy of the same kind for the same table is rejected as a duplicate (HTTP `409`).

## See also

- [Row-level and column-level security](/ai/row-level-security/): what is protected, deny by default, limitations
- [Keboola CLI](/cli/)
- [MCP Server](/ai/mcp-server/)
