---
title: Set up row-level and column-level security
slug: 'storage/row-level-security/set-up'
sidebar:
  label: Set Up
description: 'Turn on row-level and column-level security: use a governed workspace, write policies with the CLI, an AI assistant or the API, and govern a Data App.'
---

Setting up [row-level and column-level security](/storage/row-level-security/) takes three steps: send queries through a governed workspace, write a policy for each table, and check the result as the reader. A Data App needs two more steps. What a policy can contain is in the [policy reference](/storage/row-level-security/policy-reference/).

<!-- How-to-type page. Source: the "Set it up" and "Data Apps" sections of the row-level security page and the "Create a policy" sections of the policy reference, as they stood on main before the split. Structure checked 2026-11-19, facts not re-verified. -->

Row- and column-level security is in beta: see the note at the top of the [overview](/storage/row-level-security/) for the backends it is verified on.

## 1. Make sure queries go through a governed workspace

**Goal:** have a governed workspace that serves the queries of your readers.

- **MCP Server:** ask Keboola support to enable the `row-level-security` project feature. With it, the MCP Server creates its workspace as governed and sends `query_data` through Query Service. Workspaces that already exist are not changed or converted.
- **Your own workspace:** create one with the login type `governed`. With the [Keboola CLI](/cli/) (Snowflake or BigQuery), a governed workspace has no password or key, so there is nothing to save:

<!-- kbagent-check: skip-next -->
```bash
kbagent --json workspace create --project my-project --name governed-ws --governed
```

`my-project` is an example: in this command and the ones below, replace it with the alias your project has in kbagent (see [Connections and config](/cli/concepts/#connections-and-config)).

**Result:** Queries to a governed workspace read the Storage table by its bucket name, for example `SELECT * FROM "in.c-crm"."orders"` on Snowflake. Unqualified table names are refused.

## 2. Write the policies

**Goal:** give every table that readers should see a policy.

Write policies before you switch a project over: a governed workspace shows no data until a policy allows it. Policies are written by a project administrator (master Storage token). Sharing a policy with other projects or applying it to the whole organization needs the organization administrator role.

You can write policies in three ways. They all create the same `rls-policy` and `cls-policy` objects.

### Create a policy with the Keboola CLI

The `rls` and `cls` command groups create, list, update and delete policies. Both groups have the same commands. `--rules` takes the rules as JSON text; to use a file, pass its contents, for example `--rules "$(cat rls-rules.json)"`. Add `--dry-run` to any command that writes to see the result without writing it.

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
kbagent rls create --project my-project --table-id in.c-crm.orders \
  --rules "$(cat rls-rules.json)" --default '{"false": true}' --dry-run
```

<!-- kbagent-check: skip-next -->
```bash
kbagent cls create --project my-project --table-id in.c-crm.orders --rules "$(cat cls-rules.json)" --yes
```

The rule files are described in the [policy reference](/storage/row-level-security/policy-reference/).

Each file holds only the `rules` array, for example `[{"groups": ["eu-analysts"], "condition": {"column": "region", "op": "eq", "value": "EU"}}]`. In `cls-rules.json` each rule has `visible_columns` instead of `condition`. Pass a row policy's `default` with `--default`, not in the file. From a policy reference example, copy only the value of `rules`.
<!-- Checked 2026-11-20 with kbagent 1.4.1 in project 264 (rls create --dry-run): an array is accepted and compiled; an object with `rules` is refused ("--rules must be a JSON array"); `--rules @file` and `--rules -` are refused ("--rules takes JSON text"), so the commands pass the file's text. The rule schema fetched live from the metastore (kbagent rls schema) requires `table` and `rules`, each rule `condition` plus `groups` or `subjects`; `default` is a separate field. -->

The CLI refuses a rule that selects by `principal` or email before anything is written. It also checks the dialect against the project backend and reports every problem it finds.

### Create a policy with an AI assistant

The `kbagent` plugin of [AI Kit](/ai/ai-kit/) teaches an assistant these commands (the plugin is installed with `/plugin install kbagent@keboola-claude-kit`). You can describe the goal in plain words, for example:

> Protect the table `in.c-crm.orders` so that people in the group `eu-analysts` see only the rows with `region` equal to `EU`, and let the administrator with ID 1234 see all rows. Show me the dry run first.

Ask the assistant to run the dry run and show it to you before it writes. Commands that write are subject to the CLI's [permission settings](/cli/); an agent that runs them with `--json` is not asked for a confirmation, so the dry run is your check.

### Create a policy with the API

Policies are objects of the Keboola Metastore, so you can create them with `curl` and an administrator's Storage token. The Metastore address is the address of your stack with `connection.` replaced by `metastore.`, for example `https://metastore.<stack>.keboola.com`. Authenticate with the project administrator's Storage token in the `X-StorageApi-Token` header.

The `name` of the object is the table ID, and a project can have one policy of each kind per table. The `rules` and `default` in `data` are the ones from the [examples in the policy reference](/storage/row-level-security/policy-reference/#examples).

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

`"branch": "main"` is a fixed value: kbagent sends it with every policy it creates, and it is not a branch ID. `$KBC_STORAGE_TOKEN` is the master Storage token of a project administrator; target projects and `organization` scope also need the organization administrator role. A created policy returns HTTP `201` with `{"data": {"type": "rls-policy", "id": "<policy-id>", "attributes": {…}, "meta": {…}}}`. `data.id` is the ID a Data App lists in `rlsPolicies` or `clsPolicies`.

<!-- VERIFY(Nikita): can `"branch"` be omitted from the request? -->

**Result:** Whichever way you used, each protected table now has an `rls-policy`, a `cls-policy` or both. `rls list` and `cls list` show them.

## 3. Check it as the reader

**Goal:** confirm that a reader gets exactly what the policy allows.

Query a protected table the way the reader does and compare the result with what the policy should allow. Your own identity matters here: an administrator behind a Storage token is matched by the subject `keboola|<your administrator ID>` and is not exempt, so you need a rule for yourself to see anything. The [policy reference](/storage/row-level-security/policy-reference/#who-a-rule-selects) shows where to find your ID.

```bash
kbagent workspace query --project my-project --workspace-id <governed-workspace-id> \
  --sql 'SELECT * FROM "in.c-crm"."orders"'
```

`<governed-workspace-id>` is the ID `workspace create --governed` printed. The query runs through Query Service with your Storage token, so it shows what you read as `keboola|<your administrator ID>`.

**Result:** The query returns only the rows and columns the policy allows for that reader. If it is refused, or comes back empty when it should not, see [What users see](/storage/row-level-security/#what-users-see).

## Apply policies to a Data App

**Goal:** make a Data App return only the rows and columns its policies allow for the signed-in user.

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

```bash
kbagent config update --project my-project --component-id keboola.data-apps --config-id <config-id> --merge \
  --configuration '{"runtime":{"workspace":{"enabled":true,"rlsPolicies":["<rls-policy-id>"],"clsPolicies":["<cls-policy-id>"]}}}'
kbagent data-app deploy --project my-project --app-id <app-id> --wait
```

`--merge` replaces each list you pass; to remove a list, update the configuration without that key. The Data App settings in the UI have no editor for these lists, so set them with the CLI or the API.

<!-- Checked 2026-11-20 in the UI of project 264: no editor for `rlsPolicies` or `clsPolicies`. The Data App tabs are Overview, Advanced settings, Deployments, All Runs, Terminal logs and Versions; Advanced settings has only Environment variables, Table Input Mapping, File Input Mapping and Storage access / Writable Tables; the ⋯ menu has Duplicate, Automate, Debug mode and Delete app. Editing the raw configuration JSON in Debug mode was not tried. -->

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

`user_token` is the value of the `X-Kbc-App-User-Token` header of the incoming request. The proxy sets a fresh token on every request and it expires within minutes, so read it per request instead of caching it. `app_storage_token` is the app's `KBC_TOKEN` environment variable, which the platform injects.

The Python client is `keboola-query-service` 0.4.0 or later, the JavaScript client is `@keboola/api-client` 52.0.0 or later. Both send the user token in `X-Kbc-App-User-Token` and the app token in `X-StorageAPI-Token`, and both raise a `RowLevelSecurityError` when a query is refused.

**Result:** After a redeploy, the queries of the app run under the listed policies with the identity of the signed-in user.

A query that carries only the app's Storage token, without the user token, is refused (HTTP 403, `Row-level security does not allow this query`). So is a background job without a signed-in user.

---

**Next:** [Policy reference →](/storage/row-level-security/policy-reference/)
