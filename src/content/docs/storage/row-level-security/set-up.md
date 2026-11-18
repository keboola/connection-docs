---
title: Set up row-level and column-level security
slug: 'storage/row-level-security/set-up'
description: 'Turn on row-level and column-level security: use a governed workspace, write policies with the CLI, an AI assistant or the API, and govern a Data App.'
---

This page shows how to set up [row-level and column-level security](/storage/row-level-security/) for a project and for a Data App.

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

## Create a policy with the Keboola CLI

Both groups have the same commands. `--rules` accepts JSON, `@file` or `-` for standard input. Add `--dry-run` to any command that writes to see the result without writing it.

| Command | What it does |
|---|---|
| `rls list`, `cls list` | List the policies of a project |
| `rls detail`, `cls detail` | Show the rules of one policy (`--policy-id`) |
| `rls schema`, `cls schema` | Print the live JSON Schema of the policy from the Metastore |
| `rls create`, `cls create` | Create the policy of one table (`--table-id`, `--rules`; `rls create` also takes `--default`) |
| `rls update`, `cls update` | Change only the options you pass |
| `rls delete`, `cls delete` | Delete a policy. In a governed workspace a table without any policy is unreadable: an administrator gets HTTP 403, an end user of a Data App an empty result. A policy that a workspace binding lists cannot be deleted (HTTP 409): to delete a policy a Data App uses, remove it from `rlsPolicies` or `clsPolicies`, redeploy the app and archive its older deployments first, because each deployment keeps its own binding |
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

---

**Next:** [Policy reference →](/storage/row-level-security/policy-reference/)
