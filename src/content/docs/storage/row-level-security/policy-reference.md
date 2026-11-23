---
title: Policy Reference
slug: 'storage/row-level-security/policy-reference'
description: 'The format of row-level and column-level security policies: rule selectors, the condition language, how rules and policies combine, scope, and examples.'
---

This page describes the policies behind [row-level and column-level security](/storage/row-level-security/): what a policy contains and how a rule selects its readers. To create one with the Keboola CLI or the API, follow [Set up row-level and column-level security](/storage/row-level-security/set-up/#2-write-the-policies).

<!-- Reference-type page. Source: the policy reference as it stood on main before its "Create a policy" sections moved to the set-up page. Structure checked 2026-11-19, facts not re-verified. -->

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

- `{"$identity": "email"}` as a `value` is the reader's email, lowercased. It exists only when the identity provider verified the email. The column value is compared as stored: store the emails in the column in lowercase and without spaces, or the rows do not match. A rule that uses it cannot be applied to a reader without one: an end user of a Data App gets an empty result for the table, and an administrator is refused (HTTP 403).
- `{"$identity": "groups"}` as `values` is the reader's list of groups.

```json
{"column": "owner_email", "op": "eq", "value": {"$identity": "email"}}
```

## How rules and policies combine

- Within one `rls-policy`, every rule that selects the reader applies, and their conditions are combined with **OR**.
- If no rule selects the reader, the reader gets the policy's `default` condition. Without a `default` an administrator is **refused** and an end user of a Data App gets an empty result. Use `{"false": true}` as the `default` to return no rows for every reader instead of a refusal.
- Within one `cls-policy`, the reader sees the **union** of the `visible_columns` of the rules that select them. A column policy has no `default`: a reader that no rule selects is refused.
- Several policies on one table combine with **AND** (for columns, the intersection). A policy added later can only narrow access for a workspace that has no policy binding (a list of the policies that apply to one workspace or app). A Data App applies only the policies listed in its configuration, and a workspace that is bound to policies only those. A binding can leave a policy out, an organization-scoped one too. The table is then read under fewer policies, so access can be wider than the full set of policies of the project allows. Whoever edits the list of an app or the binding of a workspace decides which policies apply.
- A table needs a policy. A table with no policy is refused for an administrator and empty for a Data App user. A column policy alone opens the table for the readers it names, with all rows and only the columns it allows, and refuses everyone else (see [deny by default](/storage/row-level-security/#deny-by-default)). When the table has a row policy as well, the rows come from the row policy and the columns from the column policy.

## Scope and permissions

| `scope` | Applies to |
|---|---|
| `targeted` (default) | The project that owns the policy, plus the projects listed in `targetProjectIds` |
| `organization` | **Every** project of the organization |

There is no project-only scope; a `targeted` policy with no targets covers its own project. Prefer `targeted`: an `organization` policy is loaded by every project of the organization, including projects on a different backend.

A project administrator (master Storage token) can create, change and delete a `targeted` policy of their own project. Sharing it with other projects (`targetProjectIds`) or creating an `organization` policy needs the organization administrator role.

The `dialect` field of a policy (`snowflake` or `bigquery`) is optional in the API, and Query Service does not read it: it compiles every condition for the backend of the workspace, so one policy works on both backends. The CLI leaves `dialect` out of a new policy unless you pass `--dialect`, and it refuses a `--dialect` that differs from the backend of the project.

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

A reference table that every identified reader may read in full needs a policy that selects every reader: a row policy with the wildcard, or a column policy with the wildcard that lists the columns. Without a policy the table is refused.

```json
{
  "rules": [
    {"subjects": ["*"], "condition": {"true": true}}
  ]
}
```

## See also

- [Row-level and column-level security](/storage/row-level-security/): what is protected, deny by default, limitations
- [Set up row-level and column-level security](/storage/row-level-security/set-up/): the Keboola CLI commands and API calls that create a policy
- [Keboola CLI](/cli/)
- [MCP Server](/ai/mcp-server/)

---

**Next:** [Storage API →](/storage/api/)
