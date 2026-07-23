# kbagent command reference

Generated from kbagent v0.76.1 by `scripts/gen_command_reference.py`.
Derived from the CLI's own command tree -- do not edit by hand.

## Global options

Available on every command:

| Option | Required | Description |
|---|---|---|
| `--version` / `-V` |  | Show version and exit. |
| `--json` / `-j` |  | Output in JSON format (for machine consumption) |
| `--verbose` / `-v` |  | Enable verbose output |
| `--no-color` |  | Disable colored output |
| `--config-dir` `<str>` |  | Override config directory path. |
| `--deny-writes` |  | Session-only firewall: block write, destructive, AND admin operations (the wide net -- project add/remove/edit, org setup, storage writes and deletes, etc.). Merges with any persisted policy. |
| `--deny-destructive` |  | Session-only firewall: block ONLY data-destructive operations (storage delete-table/delete-bucket/delete-column, job terminate, branch delete, etc.). Admin ops like 'project remove' and 'org setup' are NOT blocked -- use --deny-writes for the wide net. |
| `--allow-env-manage-token` |  | Read KBC_MANAGE_API_TOKEN from the environment. Without this flag the env var is ignored (with a warning) and an interactive TTY prompt is required. Default-deny since 0.29.0; closes the AI-exfiltration risk where subprocesses inherit the manage token. |
| `--install-completion` |  | Install completion for the current shell. |
| `--show-completion` |  | Show completion for the current shell, to copy it or customize the installation. |

## `permissions`

Manage operation permissions (firewall rules)

### `kbagent permissions list`

List all operations with their risk category and current allowed/denied status.

| Option | Required | Description |
|---|---|---|
| `--category` / `-c` `<str>` |  | Filter by risk category: read, write, destructive, admin |

### `kbagent permissions show`

Show the current active permission policy.

### `kbagent permissions set`

Set the permission policy (firewall rules).

| Option | Required | Description |
|---|---|---|
| `--mode` / `-m` `<str>` | yes | Base mode: 'allow' (default-allow) or 'deny' (default-deny) |
| `--allow` / `-a` `<str>` |  | Allowed operation patterns (repeatable) |
| `--deny` / `-d` `<str>` |  | Denied operation patterns (repeatable) |

### `kbagent permissions reset`

Remove all permission restrictions.

### `kbagent permissions check`

Check if a specific operation is allowed.

| Option | Required | Description |
|---|---|---|
| `operation` (positional) | yes | |

## `project`

Manage connected Keboola projects

### `kbagent project add`

Add a new Keboola project connection.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Human-friendly name for this project |
| `--url` `<str>` |  | Keboola stack URL |
| `--token` `<str>` |  | Storage API token (also via KBC_TOKEN env var) |

### `kbagent project list`

List all connected Keboola projects.

### `kbagent project remove`

Remove a Keboola project connection.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Alias of the project to remove |

### `kbagent project edit`

Edit an existing Keboola project connection.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Alias of the project to edit |
| `--url` `<str>` |  | New Keboola stack URL |
| `--token` `<str>` |  | New Storage API token |
| `--new-alias` `<str>` |  | Rename the project alias. Updates the config.json projects key AND the default_project field if it matched. Renames the nested sync directory <cwd>/<old-alias>/ when present (with -2-suffix collision handling). Lineage cache (if any) is NOT auto-updated; rebuild with 'kbagent lineage build' after the rename. |
| `--dry-run` |  | Preview the edit without mutating state. Validates --new-alias, detects collision against existing projects, predicts the disk-rename method (git_mv vs shutil_move), and surfaces the lineage-cache warning if any -- all read-only. Errors (collision, invalid format) raise the same exit codes as the live path. No API call is made for --token in dry-run mode. |

### `kbagent project status`

Test connectivity to connected Keboola projects.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Check only this project (default: all) |

### `kbagent project refresh`

Refresh expired or invalid Storage API tokens.

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` |  | Refresh token for a specific project |
| `--all` |  | Refresh all projects with invalid tokens |
| `--dry-run` |  | Preview what would be refreshed without making changes |
| `--force` |  | Refresh even if token is valid |
| `--yes` / `-y` |  | Skip confirmation prompt |
| `--token-description` `<str>` |  | Description prefix for created Storage API tokens |
| `--token-expires-in` `<int range>` |  | Token lifetime in seconds. If not set, tokens never expire. |

### `kbagent project use`

Pin <alias> as the default project for subsequent commands.

| Option | Required | Description |
|---|---|---|
| `alias` (positional) | yes | |

### `kbagent project current`

Show the effective default project.

### `kbagent project description-get`

Get the Keboola dashboard project description.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias to query |

### `kbagent project description-set`

Set the Keboola dashboard project description (markdown).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias to update |
| `--text` `<str>` |  | Inline description string |
| `--file` `<path>` |  | Read description from a UTF-8 markdown file |
| `--stdin` |  | Read description from standard input |

### `kbagent project info`

Show detailed project metadata.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias to query |

### `kbagent project invite`

Invite a user (or many users via CSV) to one or more projects.

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` |  | Project alias to invite the user to (single-shot mode) |
| `--email` / `-e` `<str>` |  | Email address of the user to invite |
| `--role` / `-r` `<admin|guest|readOnly|share>` |  | Role to grant: admin | guest | readOnly | share |
| `--reason` `<str>` |  | Optional human-readable reason attached to the invitation |
| `--from-csv` `<path>` |  | CSV file with columns email, project (alias or numeric ID), role[, reason] |
| `--default-role` `<admin|guest|readOnly|share>` |  | Role to apply when a CSV row has no role column |
| `--workers` `<int range>` |  | Parallel workers for --from-csv (default 8) |
| `--dry-run` |  | Preview without sending invitations |

### `kbagent project member-list`

List active members of a project (and optionally pending invitations).

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias to list members for |
| `--include-pending` |  | Also list pending (unaccepted) invitations |

### `kbagent project invitation-list`

List pending project invitations.

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias to list pending invitations for |

### `kbagent project invitation-cancel`

Cancel a pending invitation.

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias |
| `--email` / `-e` `<str>` | yes | Invitee's email address (used to look up the invitation if --invitation-id is omitted) |
| `--invitation-id` `<int>` |  | Numeric invitation ID; bypass the email lookup |
| `--yes` / `-y` |  | Skip confirmation prompt |

### `kbagent project member-remove`

Remove an active member from a project (destructive).

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias |
| `--email` / `-e` `<str>` | yes | Email of the member to remove |
| `--yes` / `-y` |  | Skip confirmation prompt |

### `kbagent project member-set-role`

Change an existing member's role (PATCH).

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias |
| `--email` / `-e` `<str>` | yes | Email of the member to update |
| `--role` / `-r` `<admin|guest|readOnly|share>` | yes | New role: admin | guest | readOnly | share |

## `org`

Organization management

### `kbagent org setup`

Set up projects and register them in the kbagent config.

| Option | Required | Description |
|---|---|---|
| `--org-id` `<int>` |  | Organization ID (requires org-admin manage token) |
| `--project-ids` `<str>` |  | Comma-separated project IDs (works with Personal Access Token) |
| `--url` `<str>` | yes | Keboola stack URL (e.g. https://connection.keboola.com) |
| `--dry-run` |  | Preview what would happen without making changes |
| `--yes` / `-y` |  | Skip confirmation prompt |
| `--token-description` `<str>` |  | Description prefix for created Storage API tokens |
| `--token-expires-in` `<int range>` |  | Token lifetime in seconds (e.g. 3600 for 1 hour). If not set, tokens never expire. |
| `--refresh` |  | Refresh tokens for already-registered projects with invalid tokens |

## `feature`

Feature flag management (requires super-admin Manage API token)

### `kbagent feature list`

List all feature flags defined on the stack.

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias (used to resolve the stack URL) |

### `kbagent feature project-show`

Show feature flags assigned to a project.

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias |

### `kbagent feature project-add`

Enable a feature flag on a project.

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias |
| `--feature` / `-f` `<str>` | yes | Feature name to enable |
| `--dry-run` |  | Preview without making changes |
| `--yes` / `-y` |  | Skip confirmation prompt |

### `kbagent feature project-remove`

Disable a feature flag on a project (destructive).

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias |
| `--feature` / `-f` `<str>` | yes | Feature name to disable |
| `--dry-run` |  | Preview without making changes |
| `--yes` / `-y` |  | Skip confirmation prompt |

### `kbagent feature user-show`

Show feature flags assigned to a user.

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias (used to resolve the stack URL) |
| `--email` / `-e` `<str>` | yes | User email address |

### `kbagent feature user-add`

Enable a feature flag on a user.

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias (used to resolve the stack URL) |
| `--email` / `-e` `<str>` | yes | User email address |
| `--feature` / `-f` `<str>` | yes | Feature name to enable |
| `--dry-run` |  | Preview without making changes |
| `--yes` / `-y` |  | Skip confirmation prompt |

### `kbagent feature user-remove`

Disable a feature flag on a user (destructive).

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias (used to resolve the stack URL) |
| `--email` / `-e` `<str>` | yes | User email address |
| `--feature` / `-f` `<str>` | yes | Feature name to disable |
| `--dry-run` |  | Preview without making changes |
| `--yes` / `-y` |  | Skip confirmation prompt |

## `token`

Storage API token management (scoped mint / revoke / rotate)

### `kbagent token create`

Mint a scoped Storage API token (secret shown once).

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias |
| `--description` / `-d` `<str>` | yes | Human-readable token label |
| `--bucket-write` `<str>` |  | Bucket ID the token may WRITE (repeatable) |
| `--bucket-read` `<str>` |  | Bucket ID the token may READ (repeatable) |
| `--component-access` `<str>` |  | Component ID the token may run (repeatable) |
| `--can-read-all-file-uploads` |  | Allow reading files uploaded by OTHER tokens (default: only its own) |
| `--expires-in` `<int>` |  | Lifetime in seconds (omit = never expires) |

### `kbagent token delete`

Revoke a Storage API token immediately (destructive; only non-master tokens).

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias |
| `--token-id` `<str>` | yes | ID of the token to revoke |
| `--yes` / `-y` |  | Skip confirmation prompt |

### `kbagent token refresh`

Rotate a token: generate a new value and invalidate the old one (secret shown once).

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias |
| `--token-id` `<str>` | yes | ID of the token to rotate |
| `--yes` / `-y` |  | Skip confirmation prompt |

## `component`

Discover and inspect Keboola components

### `kbagent component list`

List available components from connected projects.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias to query (can be repeated for multiple projects) |
| `--type` `<str>` |  | Filter by component type: extractor, writer, transformation, application |
| `--query` / `-q` `<str>` |  | Search query to filter components by name or description |

### `kbagent component detail`

Show detailed information about a specific component.

| Option | Required | Description |
|---|---|---|
| `--component-id` `<str>` | yes | Component ID (e.g. keboola.ex-db-snowflake) |
| `--project` `<str>` |  | Project alias (uses first available if not set) |

### `kbagent component sync-action`

Run a synchronous component action such as testConnection.

| Option | Required | Description |
|---|---|---|
| `action_name` (positional) | yes | |
| `--component-id` `<str>` | yes | Component ID (e.g. keboola.ex-db-mysql) |
| `--config-id` `<str>` |  | Configuration ID whose stored configData to send (required unless --config-data) |
| `--row-id` `<str>` |  | Configuration row ID to shallow-merge over the root configuration |
| `--project` `<str>` | yes | Project alias |
| `--branch` `<int>` |  | Run in a specific dev branch ID (defaults to active branch) |
| `--config-data` `<str>` |  | Explicit configData JSON: inline, @file.json, or - for stdin (skips config fetch) |
| `--timeout` `<int>` |  | Request timeout in seconds for the action call (long actions e.g. getTables) |

## `config`

Browse and inspect configurations

### `kbagent config list`

List configurations from connected projects.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias to query (can be repeated for multiple projects) |
| `--component-type` `<str>` |  | Filter by component type: extractor, writer, transformation, application |
| `--component-id` `<str>` |  | Filter by specific component ID (e.g. keboola.ex-db-snowflake) |
| `--branch` `<int>` |  | List configs from a specific dev branch ID (defaults to active branch) |
| `--include-rows` |  | Include full configuration + rows body per config (noticeably larger payload). Without this flag the response is summary-level only (name/description/component/last_modified/folder). |

### `kbagent config detail`

Show detailed information about one or many configurations.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias to query. Repeat for multiple projects (only valid in bulk mode, i.e. when --config-id is omitted). |
| `--component-id` `<str>` | yes | Component ID |
| `--config-id` `<str>` |  | Configuration ID. When omitted, the command switches to BULK mode and returns every configuration under --component-id as a JSON array ({'configs': [...], 'errors': [...]}). |
| `--branch` `<int>` |  | Get detail from a specific dev branch ID (defaults to active branch) |
| `--with-state` |  | Attach the runtime state dict to each config under 'state'. Single-config mode: state is read from the same detail response (no extra HTTP call). Bulk mode: state is fetched inline via include=state (no N+1). WARNING: --with-state output may contain OAuth tokens, refresh tokens, and other credential-bearing runtime data. Do not pipe into logs, scratch files, or shared workspaces without redaction. |

### `kbagent config examples`

Show sample configuration JSON examples for a component.

| Option | Required | Description |
|---|---|---|
| `--component-id` `<str>` | yes | Component ID (e.g. keboola.ex-google-drive) |
| `--project` `<str>` |  | Project alias (uses first available if not set) |
| `--row` |  | Show row configuration examples only |

### `kbagent config search`

Search through configuration bodies for a string or pattern.

| Option | Required | Description |
|---|---|---|
| `--query` / `-q` `<str>` | yes | Search string or regex pattern |
| `--project` `<str>` |  | Project alias to search (can be repeated for multiple projects) |
| `--component-type` `<str>` |  | Filter by component type: extractor, writer, transformation, application |
| `--component-id` `<str>` |  | Filter by specific component ID (e.g. keboola.ex-db-snowflake) |
| `--ignore-case` / `-i` |  | Case-insensitive matching |
| `--regex` / `-r` |  | Interpret query as a regular expression |
| `--branch` `<int>` |  | Search configs in a specific dev branch ID (defaults to active branch) |

### `kbagent config update`

Update a configuration's metadata and/or content.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID (e.g. keboola.python-transformation-v2) |
| `--config-id` `<str>` | yes | Configuration ID to update |
| `--name` `<str>` |  | New configuration name |
| `--description` `<str>` |  | New configuration description |
| `--configuration` `<str>` |  | Configuration JSON: inline, @file.json, or - for stdin |
| `--configuration-file` `<path>` |  | Path to a JSON file with configuration content |
| `--set` `<str>` |  | Set a nested value: PATH VALUE (e.g. --set 'parameters.db.host=new-host') |
| `--merge` |  | Deep-merge into existing config instead of replacing |
| `--dry-run` |  | Show what would change without applying |
| `--branch` `<int>` |  | Update in a specific dev branch ID (defaults to active branch) |
| `--allow-plaintext-on-encrypt-failure` |  | Allow write even if secret encryption fails (DANGEROUS: secrets stored as plaintext) |

### `kbagent config set-default-bucket`

Set or clear ``storage.output.default_bucket`` on a configuration.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID (e.g. keboola.ex-db-snowflake) |
| `--config-id` `<str>` | yes | Configuration ID |
| `--bucket` `<str>` |  | Bucket ID to set as default output (e.g. in.c-preferred-name) |
| `--clear` |  | Remove the default_bucket key. Mutually exclusive with --bucket. |
| `--dry-run` |  | Show what would change without applying |
| `--branch` `<int>` |  | Apply in a specific dev branch ID (defaults to active branch) |

### `kbagent config rename`

Rename a configuration (update name via API + rename local sync directory).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID (e.g. keboola.python-transformation-v2) |
| `--config-id` `<str>` | yes | Configuration ID to rename |
| `--name` `<str>` | yes | New name for the configuration |
| `--branch` `<int>` |  | Rename in a specific dev branch ID (defaults to active branch) |
| `--directory` / `-d` `<path>` |  | Sync working directory (auto-detects .keboola/manifest.json in CWD if omitted) |

### `kbagent config delete`

Delete a configuration from a project.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID (e.g. keboola.python-transformation-v2) |
| `--config-id` `<str>` | yes | Configuration ID to delete |
| `--branch` `<int>` |  | Delete from a specific dev branch ID (defaults to active branch) |

### `kbagent config new`

Generate boilerplate configuration files for a Keboola component, optionally creating the config remotely in one shot.

| Option | Required | Description |
|---|---|---|
| `--component-id` `<str>` | yes | Component ID (e.g. keboola.ex-http) |
| `--name` `<str>` |  | Configuration name (default: auto-generated from component; required with --push) |
| `--project` `<str>` |  | Project alias (for AI Service auth; required with --push) |
| `--output-dir` `<str>` |  | Write scaffold files to disk instead of printing |
| `--push` |  | Also create the configuration remotely via the Storage API (one-shot; requires --project and --name) |
| `--no-files` |  | With --push: skip writing/printing scaffold; only POST to API (FIIA-style one-shot) |
| `--description` `<str>` |  | Configuration description (used with --push) |
| `--configuration` `<str>` |  | Override the configuration body to POST (used with --push): JSON inline, @file, or - for stdin |
| `--configuration-file` `<path>` |  | Override the configuration body from a JSON file (used with --push) |
| `--no-validate` |  | Skip schema validation against the component's AI Service spec (used with --push) |
| `--branch` `<int>` |  | Create in a specific dev branch (used with --push; defaults to active branch) |
| `--dry-run` |  | With --push: show planned POST + validation result without creating |
| `--allow-plaintext-on-encrypt-failure` |  | With --push: allow create even if secret encryption fails (DANGEROUS: secrets stored as plaintext) |

### `kbagent config metadata-list`

List all metadata entries on a configuration.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID |
| `--config-id` `<str>` | yes | Configuration ID |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch) |

### `kbagent config get-metadata`

Read a single metadata value by key.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID |
| `--config-id` `<str>` | yes | Configuration ID |
| `--key` `<str>` | yes | Metadata key to read |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch) |

### `kbagent config set-metadata`

Set a metadata key/value on a configuration (upsert).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID |
| `--config-id` `<str>` | yes | Configuration ID |
| `--key` `<str>` | yes | Metadata key to set |
| `--value` `<str>` | yes | Metadata value (string) |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch) |

### `kbagent config delete-metadata`

Delete a configuration metadata entry by its numeric ID.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID |
| `--config-id` `<str>` | yes | Configuration ID |
| `--metadata-id` `<int>` | yes | Numeric ID from metadata-list |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch) |
| `--yes` / `-y` |  | Skip confirmation |

### `kbagent config set-folder`

Set the folder (KBC.configuration.folderName) on a configuration.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID |
| `--config-id` `<str>` | yes | Configuration ID |
| `--name` `<str>` | yes | Folder name (empty string to clear) |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch) |

### `kbagent config variables-set`

Assign variables to a config (auto-creates backing keboola.variables on first call).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID of the config to attach variables to |
| `--config-id` `<str>` | yes | Configuration ID to attach variables to |
| `--var` `<str>` |  | Variable as KEY=VALUE (repeatable). Prefix key with # to mark as a secret (auto-encrypted). |
| `--replace` |  | Replace ALL variable values instead of merging (drops any keys not in --var). |
| `--variables-id` `<str>` |  | Attach parent to an existing keboola.variables config (skips auto-create). |
| `--values-id` `<str>` |  | Attach to a specific values row (defaults to the first row). |
| `--branch` `<int>` |  | Development branch ID (per-project) |
| `--dry-run` |  | Preview the change without writing to Keboola. |
| `--allow-plaintext-on-encrypt-failure` |  | Fall back to plaintext if encryption fails (NOT recommended). |

### `kbagent config variables-get`

Read the current variable values attached to a config.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID of the config whose variables to read |
| `--config-id` `<str>` | yes | Configuration ID whose variables to read |
| `--branch` `<int>` |  | Development branch ID (per-project) |

### `kbagent config variables-clear`

Unlink variables from a config (does NOT delete the underlying keboola.variables).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID of the config to unlink |
| `--config-id` `<str>` | yes | Configuration ID to unlink variables from |
| `--branch` `<int>` |  | Development branch ID (per-project) |
| `--yes` / `-y` |  | Skip confirmation prompt. |

### `kbagent config row-create`

Create a new configuration row.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID (e.g. keboola.python-transformation-v2) |
| `--config-id` `<str>` | yes | Configuration ID to add the row to |
| `--name` `<str>` | yes | Row name |
| `--description` `<str>` |  | Row description |
| `--configuration` `<str>` |  | Row configuration JSON: inline, @file.json, or - for stdin |
| `--is-disabled` |  | Create the row in disabled state (excluded from job runs) |
| `--branch` `<int>` |  | Create in a specific dev branch ID (defaults to active branch) |
| `--allow-plaintext-on-encrypt-failure` |  | Allow write even if secret encryption fails (DANGEROUS: secrets stored as plaintext) |

### `kbagent config row-update`

Update an existing configuration row.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID |
| `--config-id` `<str>` | yes | Configuration ID |
| `--row-id` `<str>` | yes | Row ID to update |
| `--name` `<str>` |  | New row name |
| `--description` `<str>` |  | New row description |
| `--configuration` `<str>` |  | Row configuration JSON: inline, @file.json, or - for stdin |
| `--set` `<str>` |  | Set a nested value: PATH=VALUE (e.g. --set 'parameters.table=orders') |
| `--merge` |  | Deep-merge into existing row config instead of replacing |
| `--dry-run` |  | Show what would change without applying |
| `--is-disabled` |  | Disable the row (mutually exclusive with --is-enabled) |
| `--is-enabled` |  | Enable the row (mutually exclusive with --is-disabled) |
| `--branch` `<int>` |  | Update in a specific dev branch ID (defaults to active branch) |
| `--allow-plaintext-on-encrypt-failure` |  | Allow write even if secret encryption fails (DANGEROUS: secrets stored as plaintext) |

### `kbagent config row-delete`

Delete a configuration row.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID |
| `--config-id` `<str>` | yes | Configuration ID |
| `--row-id` `<str>` | yes | Row ID to delete |
| `--branch` `<int>` |  | Delete from a specific dev branch ID (defaults to active branch) |
| `--yes` / `-y` |  | Skip confirmation prompt |

### `kbagent config oauth-url`

Requires master token.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID (e.g. keboola.ex-google-drive) |
| `--config-id` `<str>` | yes | Configuration ID to authorize |
| `--redirect-url` `<str>` |  | Optional URL to return to after the OAuth flow completes (sets returnUrl query param) |

## `data-app`

Keboola data-app lifecycle (create, deploy, manage)

### `kbagent data-app list`

List data apps across one or more registered projects.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias to query (repeatable). None = all projects. |
| `--branch` `<int>` |  | Storage branch ID for the config-name lookup (defaults to production). |

### `kbagent data-app detail`

Show merged Data Science + Storage detail for one data app.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |
| `--branch` `<int>` |  | Storage branch ID for the linked config (defaults to production). |

### `kbagent data-app create`

Create a Keboola data app end-to-end (POST + encrypt + PUT + deploy).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--name` `<str>` | yes | Display name shown in the Keboola UI |
| `--description` `<str>` |  | Long-form description (markdown). Mutually exclusive with --description-file. |
| `--description-file` `<path>` |  | Read description from a file. Mutually exclusive with --description. |
| `--slug` `<str>` | yes | URL slug (lowercase alphanumeric, hyphens; 2-64 chars) |
| `--git-repo` `<str>` |  | External git repository URL to deploy from. Required unless --use-managed-git-repo is set (mutually exclusive with it). |
| `--use-managed-git-repo` |  | Provision an empty Keboola-managed git repository for the app instead of cloning an external one. Mints code via `data-app git-credentials-create`, then push + deploy. Mutually exclusive with --git-repo and all --git-* auth flags. |
| `--git-branch` `<str>` |  | Git branch to clone |
| `--git-public` / `--no-git-public` |  | Mark the repository as public (no credentials needed). |
| `--git-username` `<str>` |  | GitHub username (required for private repos) |
| `--git-pat-env` `<str>` |  | Environment variable containing the plaintext PAT (recommended). |
| `--git-pat-file` `<path>` |  | File containing the plaintext PAT. |
| `--git-pat-encrypted` `<str>` |  | Pre-encrypted PAT (KBC::Project... ciphertext). Must be encrypted against THIS project's KMS -- ciphertext does not cross projects. |
| `--auth` `<str>` |  | Authentication mode: 'password' (simpleAuth) or 'public' (no auth gate). |
| `--size` `<str>` |  | Runtime size: tiny, small, medium, or large. |
| `--auto-suspend` `<int>` |  | Auto-suspend after N seconds idle (0 disables). |
| `--type` `<str>` |  | Runtime type. Default 'python-js' covers Python AND Node apps. |
| `--branch` `<int>` |  | Keboola dev branch ID (defaults to production). |
| `--no-deploy` |  | Skip the deploy step; create the shell + Storage config only. |
| `--wait` |  | Block until state == running (or error). Respects pitfall #1: stopped is not terminal. |
| `--timeout` `<float>` |  | Maximum seconds to wait for state == running (default 300). |
| `--keep-on-failure` |  | Keep the orphan deployment shell if PUT or initial deploy fails (forensics). |
| `--dry-run` |  | Print the three request bodies without making any API call. |

### `kbagent data-app deploy`

Deploy the latest Storage config (the §9 redeploy contract).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |
| `--config-version` `<str>` |  | Pin a specific Storage config version (defaults to latest). |
| `--wait` |  | Block until running or error. |
| `--timeout` `<float>` |  | Max seconds to wait. |
| `--branch` `<int>` |  | Storage branch for reading the latest version (defaults to production). |

### `kbagent data-app start`

Wake an auto-suspended data app at its currently-pinned configVersion.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |
| `--wait` |  | Block until running or error. |
| `--timeout` `<float>` |  | Max seconds to wait. |

### `kbagent data-app stop`

Stop a running data app (preserves the URL and Storage config).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |
| `--wait` |  | Block until stopped. |
| `--timeout` `<float>` |  | Max seconds to wait. |

### `kbagent data-app delete`

Delete the deployment AND the Storage config (cascade, irreversible).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |
| `--yes` / `-y` |  | Skip the confirmation prompt. |

### `kbagent data-app password`

Retrieve the simpleAuth password for a password-gated data app.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |

### `kbagent data-app logs`

Tail the container logs for a deployed data app.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |
| `--lines` `<int>` |  | Tail the last N lines (default 500 when neither --lines nor --since is set). Pass 0 to fetch the full current container buffer (no server-side cap). Mutually exclusive with --since. |
| `--since` `<str>` |  | Fetch lines since this ISO 8601 timestamp WITH timezone (e.g. '2026-05-21T13:00:00Z' or '2026-05-21T13:00:00+00:00'). Mutually exclusive with --lines. |

### `kbagent data-app runs`

List a data app's recent deployment attempts (runs), newest first.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |
| `--limit` `<int>` |  | Max runs to return (newest first). |

### `kbagent data-app validate-repo`

Pre-flight check that a git repo follows the Keboola data-app Golden Rule.

| Option | Required | Description |
|---|---|---|
| `--git-repo` `<str>` | yes | GitHub repo URL (https://github.com/owner/repo). |
| `--git-branch` `<str>` |  | Git ref to validate (default: main). |
| `--git-public` / `--no-git-public` |  | Public repo (no PAT). Use --no-git-public for private repos and pass --git-pat-env / --git-pat-file. |
| `--git-pat-env` `<str>` |  | Read GitHub PAT from this env var (recommended; no argv leak). |
| `--git-pat-file` `<file>` |  | Read GitHub PAT from this file. |
| `--type` `<str>` |  | Repo layout to validate against. Currently only 'python-js' is supported; other types tracked as follow-up. |
| `--strict` |  | Treat WARN findings as failures (exit 1). |

### `kbagent data-app git-repo`

Show the clone URLs of a data app's configured git repository.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |

### `kbagent data-app git-credentials`

List the credentials of a data app's MANAGED git repository.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |

### `kbagent data-app git-credentials-create`

Create a git credential (SSH key or HTTP token) for a MANAGED repo.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |
| `--type` `<str>` | yes | Credential type: ssh_key | http_token. |
| `--permissions` `<str>` | yes | Access level: readOnly | readWrite. |
| `--public-key` `<str>` |  | SSH public key inline (required for --type ssh_key; mutually exclusive with --public-key-file). |
| `--public-key-file` `<path>` |  | Read the SSH public key from this file (required for --type ssh_key). |
| `--name` `<str>` |  | Optional display label for the credential. |
| `--yes` / `-y` |  | Skip the confirmation prompt. |

### `kbagent data-app secrets-set`

Encrypt and write app-runtime secrets to the linked Storage config.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |
| `--secret` `<str>` |  | One or more '#KEY=VALUE' plaintext entries. Repeatable. Mutually exclusive with --secrets-file. |
| `--secrets-file` `<file>` |  | Path to a JSON file mapping '#KEY' -> 'plaintext value'. |
| `--branch` `<int>` |  | Storage branch ID for the linked config (defaults to production). |
| `--allow-plaintext-on-encrypt-failure` |  | Bootstrap/debug only: write the value as-is if the Encryption API did not return a project-scoped ciphertext. NEVER use in production. |
| `--dry-run` |  | Show the encryption request and Storage PUT body without making either call. |
| `--no-hint-next` |  | Suppress the 'now run kbagent data-app deploy' hint in the output. |

### `kbagent data-app secrets-list`

List the keys in parameters.dataApp.secrets, with derived runtime env-var names.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |
| `--branch` `<int>` |  | Storage branch ID for the linked config (defaults to production). |
| `--show-fingerprint` |  | Include a short ciphertext fingerprint per key. Default omits to keep --json safe to paste into tickets. |

### `kbagent data-app secrets-get`

Show ONE key from parameters.dataApp.secrets.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |
| `--key` `<str>` | yes | Env-var key (with optional '#' prefix for encrypted secrets). |
| `--branch` `<int>` |  | Storage branch ID for the linked config (defaults to production). |

### `kbagent data-app secrets-remove`

Remove one or more app-runtime secrets.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--app-id` `<str>` | yes | Data Science numeric app id |
| `--key` `<str>` | yes | Env-var key to remove (with optional '#' prefix). Repeatable. |
| `--branch` `<int>` |  | Storage branch ID for the linked config (defaults to production). |
| `--yes` / `-y` |  | Skip the confirmation prompt. |
| `--dry-run` |  | Preview the Storage PUT body without making the call. |

## `job`

Browse job history and run jobs

### `kbagent job list`

List jobs from connected projects.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias to query (can be repeated for multiple projects) |
| `--component-id` `<str>` |  | Filter by component ID (e.g. keboola.ex-db-snowflake) |
| `--config-id` `<str>` |  | Filter by configuration ID (requires --component-id) |
| `--status` `<str>` |  | Filter by job status: processing, terminated, cancelled, success, error |
| `--limit` `<int>` |  | Maximum number of jobs to return per project (1-500) |

### `kbagent job detail`

Show detailed information about a specific job.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--job-id` `<str>` | yes | Job ID |

### `kbagent job run`

Run a job for a component configuration.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Component ID (e.g. keboola.snowflake-transformation) |
| `--config-id` `<str>` | yes | Configuration ID |
| `--row-id` `<str>` |  | Config row ID(s) to run (repeat for multiple; omit to run entire config) |
| `--wait` |  | Wait for job to finish (poll until terminal state) |
| `--timeout` `<float>` |  | Max seconds to wait when --wait is set |
| `--branch` `<int>` |  | Dev branch ID (overrides active branch) |
| `--mode` `<run|debug>` |  | Queue API job mode. 'run' (default) executes the component normally and writes to mapped output tables. 'debug' executes the component but redirects its output to a Storage File tagged 'debug-<jobId>' instead of the destination buckets -- safe for dry-runs and for reproducing a failing run on production configuration without touching production data. |
| `--variable-values-id` `<str>` |  | Explicit keboola.variables values-row ID to bind. Use when the linked variables config has multiple rows and auto-resolution (first row) picks the wrong one. Mutually exclusive with --no-variables. |
| `--no-variables` |  | Skip variable-values resolution entirely. Use for components that do not support variables, or when intentionally running against empty bindings. Mutually exclusive with --variable-values-id. |
| `--poll-strategy` `<exponential|fixed>` |  | Polling cadence used with --wait. 'exponential' (default) starts at 2s and relaxes toward 15s as a job runs long (2s x 30 -> 5s x 48 -> 15s). 'fixed' keeps a constant 1s interval (useful for tests or very short jobs). |
| `--log-tail-lines` `<int>` |  | On FAILED/WARNING/TERMINATED jobs, fetch the last N job events (from Storage Events API) and surface them as 'logTail' in JSON output or a panel in human mode. Only used with --wait. 0 disables (recommended for automation pipelines); max 5000. |
| `--idempotency-key` `<str>` |  | Client-supplied de-duplication token (issue #427). On replay with the same key, a prior still-running or non-failed job is returned instead of creating a duplicate -- safe for resumed/retried build steps. A prior FAILED run is re-run. Dedup is client-side (the Queue API has no idempotency key) and scoped to this machine's config-dir; reusing a key for a different component/config errors. |
| `--force-rerun` |  | Ignore any stored --idempotency-key entry and always create a fresh job. |

### `kbagent job terminate`

Terminate one or more Queue API jobs (use to stop runaway or stuck jobs).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--job-id` `<str>` |  | Job ID to terminate. Can be repeated. Mutually exclusive with --status. |
| `--status` `<str>` |  | Bulk-terminate jobs matching status. Single killable: created, processing, waiting. Use 'any' to match all killable states at once (typical for runaway cleanup). Recommend scoping with --component-id / --config-id / --branch. |
| `--component-id` `<str>` |  | Filter bulk terminate by component ID |
| `--config-id` `<str>` |  | Filter bulk terminate by configuration ID (requires --component-id) |
| `--limit` `<int>` |  | Max jobs to consider when using --status (1-500) |
| `--branch` `<int>` |  | Dev branch ID (filters jobs client-side; defaults to active branch if set via 'branch use') |
| `--dry-run` |  | Show what would be terminated without executing |
| `--yes` / `-y` |  | Skip confirmation prompt |

## `storage`

Browse and manage storage buckets, tables, and files

### `kbagent storage buckets`

List storage buckets with sharing/linked bucket information.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias (can be repeated for multiple projects) |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage bucket-detail`

Show detailed bucket info including backend-native direct access paths.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--bucket-id` `<str>` | yes | Bucket ID (e.g. in.c-db) |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage tables`

List storage tables from one or more projects.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias (can be repeated for multiple projects). Omit to query all connected projects in parallel. |
| `--bucket-id` `<str>` |  | Filter tables by bucket ID (applied independently per project) |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage table-detail`

Show detailed table info including columns and types.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--table-id` `<str>` | yes | Table ID (e.g. 'in.c-my-bucket.my-table') |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage create-bucket`

Create a new storage bucket.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--stage` `<str>` | yes | Bucket stage: 'in' or 'out' |
| `--name` `<str>` | yes | Bucket name slug (e.g. 'my-bucket') |
| `--description` `<str>` |  | Optional bucket description |
| `--backend` `<str>` |  | Optional backend type (e.g. 'snowflake', 'bigquery') |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage create-table`

Create a new storage table with typed columns.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--bucket-id` `<str>` | yes | Target bucket ID (e.g. 'in.c-my-bucket') |
| `--name` `<str>` | yes | Table name |
| `--column` `<str>` |  | Column as 'name:TYPE' or 'name:TYPE(length)'. Repeatable. Base types: STRING, INTEGER, NUMERIC, FLOAT, BOOLEAN, DATE, TIMESTAMP. Native types are passed through to the Storage API (e.g. 'pk:VARCHAR(40)', 'amount:NUMERIC(18,2)', 'ts:TIMESTAMP_TZ', 'meta:VARIANT'). Required unless --source-table-id is given; the two are mutually exclusive. |
| `--primary-key` `<str>` |  | Primary key column name. Can be repeated. |
| `--not-null` `<str>` |  | Column name to mark NOT NULL. Can be repeated. Must match a --column name. |
| `--default` `<str>` |  | Column default as 'name=value'. Can be repeated. Boolean values must be lowercase ('true'/'false') per Keboola API validation. |
| `--source-table-id` `<str>` |  | Create the table by copying an existing table's data into the requested partition/clustering layout (BigQuery only). The column definition is derived from the source, so --column must not be used. Pair with 'swap-tables' to repartition a populated table in place. |
| `--source-branch-id` `<int>` |  | Branch ID the source table is resolved in (defaults to the request branch). |
| `--time-partitioning-type` `<str>` |  | BigQuery time partitioning type, e.g. DAY, HOUR, MONTH, YEAR. |
| `--time-partitioning-field` `<str>` |  | Column used for time partitioning (defaults to ingestion time if omitted). |
| `--time-partitioning-expiration-ms` `<str>` |  | Milliseconds to keep storage for a partition (BigQuery). |
| `--range-partitioning-field` `<str>` |  | Column used for integer-range partitioning (BigQuery). |
| `--range-partitioning-start` `<str>` |  | Start of the range partitioning, inclusive (required with other range flags). |
| `--range-partitioning-end` `<str>` |  | End of the range partitioning, exclusive (required with other range flags). |
| `--range-partitioning-interval` `<str>` |  | Width of each range interval (required with other range flags). |
| `--clustering-field` `<str>` |  | Column used for clustering (BigQuery). Repeatable. |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |
| `--if-not-exists` |  | Treat a duplicate-display-name failure as a successful no-op when the table already exists at the expected id. Safe for parallel workers (FIIA scaffold pattern). A different table with the same display name still surfaces the original error. |

### `kbagent storage upload-table`

Upload a CSV file into a storage table.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--table-id` `<str>` | yes | Target table ID (e.g. 'in.c-my-bucket.my-table') |
| `--file` `<str>` | yes | Path to the CSV file to upload |
| `--incremental` |  | Append rows instead of full load (default: full load) |
| `--delimiter` `<str>` |  | CSV column delimiter (default: ',') |
| `--enclosure` `<str>` |  | CSV value enclosure character (default: '"')' |
| `--auto-create` / `--no-auto-create` |  | Auto-create bucket and table if they don't exist (default: on). Columns are inferred as STRING from the CSV header row. |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage download-table`

Export a storage table to a local CSV file.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--table-id` `<str>` | yes | Table ID to export (e.g. 'in.c-my-bucket.my-table') |
| `--output` `<str>` |  | Output path. Default mode: file path (e.g. table.csv). With --keep-slices: directory path (default ./{project}/{table_id}.csv/). |
| `--columns` `<str>` |  | Column names to export (repeat for multiple: --columns col1 --columns col2) |
| `--limit` `<int>` |  | Max number of rows to export |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |
| `--keep-slices` |  | Save each slice as its own file under --output (treated as a directory). Avoids the concat pass, matches the parquet download layout, and is the analytical-workflow-friendly option for DuckDB, polars, Spark. A _columns.csv sidecar holds the column order. |
| `--where-column` `<str>` |  | Export only rows where this column matches --where-value(s). |
| `--where-operator` `<str>` |  | Filter operator: 'eq' (default) or 'neq'. |
| `--where-value` `<str>` |  | Value(s) for --where-column (repeat for multiple: matched as OR). |
| `--changed-since` `<str>` |  | Only rows imported since this time (unix ts or strtotime, e.g. '-2 days'). |
| `--changed-until` `<str>` |  | Only rows imported up to this time (unix ts or strtotime). |

### `kbagent storage delete-table`

Delete one or more storage tables.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--table-id` `<str>` | yes | Table ID to delete (e.g. 'in.c-bucket.table'). Can be repeated. |
| `--force` |  | Force-delete tables that have aliases in other projects (cascade). |
| `--dry-run` |  | Show what would be deleted without executing |
| `--yes` / `-y` |  | Skip confirmation prompt |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage truncate-table`

Truncate (delete all rows from) one or more storage tables.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--table-id` `<str>` | yes | Table ID to truncate (e.g. 'in.c-bucket.table'). Can be repeated. |
| `--dry-run` |  | Show what would be truncated without executing |
| `--yes` / `-y` |  | Skip confirmation prompt |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage add-column`

Add a single column to an existing table (synchronous, typed).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--table-id` `<str>` | yes | Table ID to add the column to (e.g. 'in.c-bucket.table') |
| `--column` `<str>` | yes | Column spec: 'name', 'name:TYPE', or 'name:TYPE(length)' (e.g. 'status:VARCHAR(20)', 'amount:NUMBER(18,2)'). |
| `--not-null` |  | Make the new column NOT NULL (needs an empty table or a --default). |
| `--default` `<str>` |  | Default value for the new column. |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage delete-column`

Delete one or more columns from a storage table.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--table-id` `<str>` | yes | Table ID containing the column(s) (e.g. 'in.c-bucket.table') |
| `--column` `<str>` | yes | Column name to delete. Can be repeated. |
| `--force` |  | Force delete even if column is referenced by table aliases |
| `--dry-run` |  | Show what would be deleted without executing |
| `--yes` / `-y` |  | Skip confirmation prompt |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage swap-tables`

Swap two storage tables (any branch, including the default/production branch).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--table-id` `<str>` | yes | First table ID (e.g. 'in.c-bucket.table') |
| `--target-table-id` `<str>` | yes | Second table ID to swap with the first |
| `--branch` `<int>` |  | Branch ID. Required; defaults to the active branch set via 'kbagent branch use'. Any branch works, including the default/production branch -- a default-branch swap is how a typed rebuild is applied to production. |
| `--dry-run` |  | Show what would be swapped without executing |
| `--yes` / `-y` |  | Skip confirmation prompt |

### `kbagent storage clone-table`

Clone (pull) a production table into a development branch.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--table-id` `<str>` | yes | Table ID to pull into the branch (e.g. 'in.c-bucket.table') |
| `--branch` `<int>` |  | Target dev branch ID. Required; defaults to the active branch set via 'kbagent branch use'. The pull is one-way: default -> branch. |
| `--dry-run` |  | Show what would be pulled without executing |

### `kbagent storage delete-bucket`

Delete one or more storage buckets.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--bucket-id` `<str>` | yes | Bucket ID to delete (e.g. 'in.c-my-bucket'). Can be repeated. |
| `--force` |  | Force delete even if bucket contains tables (cascade) |
| `--dry-run` |  | Show what would be deleted without executing |
| `--yes` / `-y` |  | Skip confirmation prompt |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage describe-bucket`

Set the description on a storage bucket.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--bucket-id` `<str>` | yes | Bucket ID (e.g. 'in.c-my-bucket') |
| `--text` `<str>` |  | Description text (inline) |
| `--file` `<path>` |  | Path to a file containing the description |
| `--stdin` |  | Read description from standard input |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage describe-table`

Set the description on a storage table.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--table-id` `<str>` | yes | Table ID (e.g. 'in.c-my-bucket.my-table') |
| `--text` `<str>` |  | Description text (inline) |
| `--file` `<path>` |  | Path to a file containing the description |
| `--stdin` |  | Read description from standard input |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage describe-column`

Set descriptions on one or more columns of a storage table.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--table-id` `<str>` | yes | Table ID (e.g. 'in.c-my-bucket.my-table') |
| `--column` `<str>` | yes | Column description as 'NAME=DESCRIPTION' (can be repeated) |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage describe-batch`

Apply descriptions to buckets, tables, and columns from a YAML file.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--from-file` `<path>` | yes | Path to a YAML file with bucket/table/column descriptions |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage files`

List Storage Files with optional tag filtering.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--tag` `<str>` |  | Filter by tag (repeat for AND logic: --tag a --tag b) |
| `--limit` `<int>` |  | Max number of files to return |
| `--offset` `<int>` |  | Pagination offset |
| `--query` / `-q` `<str>` |  | Full-text search on file name |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage file-detail`

Show Storage File metadata (without downloading).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--file-id` `<int>` | yes | Storage file ID |

### `kbagent storage file-upload`

Upload a local file to Storage Files.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--file` `<str>` | yes | Path to the file to upload |
| `--name` `<str>` |  | Custom file name (default: local filename) |
| `--tag` `<str>` |  | Tag to assign (repeat for multiple: --tag a --tag b) |
| `--permanent` |  | Make file permanent (not auto-deleted after 15 days) |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage file-download`

Download a Storage File to local disk.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--file-id` `<int>` |  | Storage file ID to download |
| `--tag` `<str>` |  | Download latest file matching tags (repeat for AND: --tag a --tag b) |
| `--output` / `-o` `<str>` |  | Output file path (default: original filename) |

### `kbagent storage file-tag`

Add and/or remove tags on a Storage File.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--file-id` `<int>` | yes | Storage file ID |
| `--add` `<str>` |  | Tag to add (repeat for multiple: --add a --add b) |
| `--remove` `<str>` |  | Tag to remove (repeat for multiple: --remove a --remove b) |

### `kbagent storage file-delete`

Delete one or more Storage Files.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--file-id` `<int>` | yes | Storage file ID to delete (repeat for multiple) |
| `--dry-run` |  | Show what would be deleted without executing |
| `--yes` / `-y` |  | Skip confirmation prompt |

### `kbagent storage load-file`

Load a Storage File into a table.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--file-id` `<int>` | yes | Storage file ID to load into a table |
| `--table-id` `<str>` | yes | Target table ID (e.g. 'in.c-my-bucket.my-table') |
| `--incremental` |  | Append rows instead of full load |
| `--delimiter` `<str>` |  | CSV column delimiter |
| `--enclosure` `<str>` |  | CSV value enclosure character |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage unload-table`

Export a table to a Storage File.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--table-id` `<str>` | yes | Table ID to export (e.g. 'in.c-my-bucket.my-table') |
| `--columns` `<str>` |  | Column names to export (repeat for multiple) |
| `--limit` `<int>` |  | Max number of rows to export |
| `--tag` `<str>` |  | Tag to apply to the exported file (repeat for multiple) |
| `--download` |  | Also download the exported file locally |
| `--output` / `-o` `<str>` |  | Output file path (only with --download) |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |
| `--file-type` `<str>` |  | Output format: 'csv' (default) or 'parquet'. Parquet output is always sliced; with --download each slice is saved as its own file under --output (treated as a directory). |
| `--keep-slices` |  | CSV-only with --download: write each slice as its own file under --output (treated as a directory) instead of concatenating into a single CSV. Mirrors the parquet download layout. Ignored for parquet (always sliced) and for non-sliced exports. |

### `kbagent storage snapshots`

List snapshots of a table.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--table-id` `<str>` | yes | Table ID (e.g. 'in.c-my-bucket.my-table') |
| `--limit` `<int>` |  | Max snapshots to return |
| `--branch` `<int>` |  | Dev branch ID (production endpoint by default) |

### `kbagent storage snapshot-create`

Create a snapshot of a table (data + columns + primary key).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--table-id` `<str>` | yes | Table ID to snapshot (e.g. 'in.c-my-bucket.my-table') |
| `--description` `<str>` |  | Human-readable snapshot description |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |

### `kbagent storage snapshot-detail`

Show one snapshot's detail (source table, creation time, description).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--snapshot-id` `<str>` | yes | Snapshot ID |

### `kbagent storage snapshot-delete`

Delete one or more table snapshots (the source tables are untouched).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--snapshot-id` `<str>` | yes | Snapshot ID to delete (repeat for multiple) |
| `--dry-run` |  | Show what would be deleted without executing |
| `--yes` / `-y` |  | Skip confirmation prompt |

### `kbagent storage table-from-snapshot`

Create a NEW table from an existing snapshot (snapshot restore).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--snapshot-id` `<str>` | yes | Source snapshot ID |
| `--bucket-id` `<str>` | yes | Destination bucket ID (e.g. 'in.c-my-bucket') |
| `--name` `<str>` | yes | Name for the new table (required by the API) |
| `--branch` `<int>` |  | Dev branch ID (defaults to active branch if set via 'branch use') |
| `--dry-run` |  | Show what would be created without executing |

## `stream`

Data Streams (OTLP) source management

### `kbagent stream list`

List Data Streams sources in a project.

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias |
| `--branch` `<str>` |  | Branch ref (default: the project's default branch) |

### `kbagent stream create-source`

Create an OTLP (or HTTP) source and return its endpoint.

| Option | Required | Description |
|---|---|---|
| `--project` / `-p` `<str>` | yes | Project alias |
| `--name` / `-n` `<str>` | yes | Human-readable source name |
| `--type` `<otlp|http>` |  | Source type (otlp | http) |
| `--branch` `<str>` |  | Branch ref (default branch if unset) |
| `--if-not-exists` |  | Return the existing source instead of failing if it exists |
| `--no-sinks` |  | Skip auto-creating the logs/metrics/traces sinks for an OTLP source |
| `--reveal` |  | Print the full endpoint incl. secret |

### `kbagent stream detail`

Show a source's endpoints, protocol, and destination tables.

| Option | Required | Description |
|---|---|---|
| `source_id` (positional) |  | |
| `--project` / `-p` `<str>` | yes | Project alias |
| `--name` / `-n` `<str>` |  | Look up the source by name |
| `--branch` `<str>` |  | Branch ref (default branch if unset) |
| `--reveal` |  | Print the full endpoint incl. secret |

### `kbagent stream delete`

Delete a Data Streams source (destructive).

| Option | Required | Description |
|---|---|---|
| `source_id` (positional) | yes | |
| `--project` / `-p` `<str>` | yes | Project alias |
| `--branch` `<str>` |  | Branch ref (default branch if unset) |
| `--force` |  | Alias for --yes (skip confirmation) |
| `--dry-run` |  | Preview without deleting |
| `--yes` / `-y` |  | Skip confirmation prompt |

## `sharing`

Cross-project bucket sharing and linking.

### `kbagent sharing list`

List shared buckets available for linking.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias (repeatable). Omit to query all projects. |

### `kbagent sharing share`

Enable sharing on a bucket.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias that owns the bucket to share. |
| `--bucket-id` `<str>` | yes | Bucket ID to share (e.g. out.c-data). |
| `--type` `<str>` | yes | Sharing type: 'organization' (all org members), 'organization-project' (all project members in org), 'selected-projects' (specific projects, use --target-project-ids), 'selected-users' (specific users, use --target-users). |
| `--target-project-ids` `<str>` |  | Comma-separated project IDs (required for --type selected-projects). |
| `--target-users` `<str>` |  | Comma-separated email addresses (required for --type selected-users). |

### `kbagent sharing unshare`

Disable sharing on a bucket.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias that owns the shared bucket. |
| `--bucket-id` `<str>` | yes | Bucket ID to stop sharing (e.g. out.c-data). |

### `kbagent sharing link`

Link a shared bucket into a project.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Target project alias where the linked bucket will be created. |
| `--source-project-id` `<int>` | yes | ID of the project that owns the shared bucket. |
| `--bucket-id` `<str>` | yes | Source bucket ID to link (e.g. out.c-data). |
| `--name` `<str>` |  | Display name for the linked bucket. Auto-generated if omitted. |

### `kbagent sharing unlink`

Remove a linked bucket from a project.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias containing the linked bucket. |
| `--bucket-id` `<str>` | yes | Linked bucket ID to remove (e.g. in.c-shared-data). |

### `kbagent sharing edges`

Show cross-project data flow edges via bucket sharing.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias to query (can be repeated for multiple projects). |

## `lineage`

Column-level data lineage across projects.

### `kbagent lineage build`

Build column-level lineage graph from sync'd data.

| Option | Required | Description |
|---|---|---|
| `--directory` / `-d` `<path>` |  | Root directory with sync'd projects (default: current directory). |
| `--output` / `-o` `<path>` | yes | Output JSON file for the lineage graph (required). |
| `--ai` |  | Generate AI task file for SQL/Python analysis (2-step: AI processes, then re-build). |
| `--refresh` |  | Sync pull all projects first, then rebuild. |

### `kbagent lineage info`

Show what's in a cached lineage graph.

| Option | Required | Description |
|---|---|---|
| `--load` / `-l` `<path>` | yes | Lineage JSON cache file (from `lineage build`). |

### `kbagent lineage show`

Query upstream/downstream dependencies from a cached lineage graph.

| Option | Required | Description |
|---|---|---|
| `--load` / `-l` `<path>` | yes | Lineage JSON cache file (from `lineage build`). |
| `--upstream` `<str>` |  | Show upstream dependencies. Use 'project:table_id' or just 'table_id'. |
| `--downstream` `<str>` |  | Show downstream dependents. Use 'project:table_id' or just 'table_id'. |
| `--column` / `-c` `<str>` |  | Trace a specific column (use with --upstream/--downstream). |
| `--columns` |  | Show column-level mapping detail on edges. |
| `--project` / `-p` `<str>` |  | Project alias filter for queries. |
| `--depth` `<int>` |  | Max traversal depth (default: 10). |
| `--format` / `-f` `<str>` |  | Output format: text, mermaid, html, or er (entity-relationship). |

### `kbagent lineage server`

Start a local web server with interactive lineage browser.

| Option | Required | Description |
|---|---|---|
| `--load` / `-l` `<path>` | yes | Lineage JSON cache file (from `lineage build`). |
| `--port` `<int>` |  | Port to serve on. |
| `--host` `<str>` |  | Host to bind to. |

## `kai`

(BETA) Keboola AI Assistant (Kai) — ask questions about your project.

### `kbagent kai ping`

Check Kai server health and MCP connection status.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias (uses default if omitted). |

### `kbagent kai ask`

Ask Kai a one-shot question and get the full response.

| Option | Required | Description |
|---|---|---|
| `--message` / `-m` `<str>` | yes | Question to ask Kai about your project. |
| `--project` `<str>` |  | Project alias (uses default if omitted). |

### `kbagent kai chat`

Send a message to Kai in a chat session.

| Option | Required | Description |
|---|---|---|
| `--message` / `-m` `<str>` | yes | Message to send to Kai. |
| `--chat-id` `<str>` |  | Continue an existing chat session. |
| `--project` `<str>` |  | Project alias (uses default if omitted). |

### `kbagent kai preflight`

Check whether the configured token can use Kai (master token + AI Agent Chat).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias (uses default if omitted). |

### `kbagent kai chat-detail`

Fetch the full message history of a single Kai chat.

| Option | Required | Description |
|---|---|---|
| `--chat-id` `<str>` | yes | Kai chat ID (UUID, from `kai history` or `kai chat`). |
| `--project` `<str>` |  | Project alias (uses default if omitted). |

### `kbagent kai history`

List recent Kai chat sessions.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias (uses default if omitted). |
| `--limit` / `-n` `<int>` |  | Maximum number of chats to return. |

## `docs`

Ask the Keboola documentation natural-language questions

### `kbagent docs query`

Ask the Keboola documentation a natural language question.

| Option | Required | Description |
|---|---|---|
| `question` (positional) | yes | |
| `--project` `<str>` |  | Project alias (uses first available if not set) |

## `transformation`

SQL transformations - create, inspect, and edit blocks/codes

### `kbagent transformation create`

Create a SQL transformation from a SQL script.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias |
| `--name` `<str>` | yes | Transformation name |
| `--sql` `<str>` |  | SQL text (semicolon-separated statements). Mutually exclusive with --sql-file. |
| `--sql-file` `<path>` |  | Read SQL from a file. Mutually exclusive with --sql. |
| `--created-table` `<str>` |  | Table name created by the SQL (repeatable). Each is mapped to out.c-<derived-bucket>.<table> in the output mapping. |
| `--component-id` `<str>` |  | SQL transformation component ID (keboola.snowflake-transformation or keboola.google-bigquery-transformation). Default: derived from the project's default backend. |
| `--description` `<str>` |  | Configuration description |
| `--branch` `<int>` |  | Create in a specific dev branch ID (defaults to active branch) |
| `--dry-run` |  | Print the would-be configuration payload without creating |

### `kbagent transformation show`

Show a SQL transformation's block/code tree with positional IDs.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias |
| `--config-id` `<str>` | yes | Configuration ID |
| `--component-id` `<str>` |  | Component ID. When omitted, the known SQL transformation components are tried until the configuration is found. |
| `--branch` `<int>` |  | Read from a specific dev branch ID (defaults to active branch) |

### `kbagent transformation edit`

Edit a SQL transformation's blocks/codes with positional operations.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias |
| `--config-id` `<str>` | yes | Configuration ID |
| `--component-id` `<str>` |  | Component ID. When omitted, the known SQL transformation components are tried until the configuration is found. |
| `--branch` `<int>` |  | Edit in a specific dev branch ID (defaults to active branch) |
| `--change-description` `<str>` | yes | Human-readable summary of this change (stored in config version history) |
| `--op` `<str>` |  | Operation as inline JSON (repeatable, applied in order). Ops: add_block, remove_block, rename_block, add_code, remove_code, rename_code, set_code, add_script, str_replace. Example: '{"op": "set_code", "block_id": "b0", "code_id": "b0.c0", "script": "SELECT 1;"}'. IDs come from `transformation show`. Mutually exclusive with --op-file. |
| `--op-file` `<path>` |  | Read operations from a JSON file containing an array of op objects. |
| `--storage` `<str>` |  | FULL REPLACEMENT of configuration.storage (inline JSON, @file, or - for stdin). Include every input/output mapping you want to keep -- the existing storage block is overwritten wholesale. |
| `--dry-run` |  | Apply ops locally and print the resulting tree without writing |

## `flow`

Manage conditional flows (keboola.flow)

### `kbagent flow list`

List conditional flows (keboola.flow) across projects.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias (repeatable for multiple projects; omit for all) |
| `--branch` `<int>` |  | Dev branch ID (per-project; requires single --project) |
| `--with-schedules` |  | Enrich each flow row with the cron schedules that target it (one extra API call per project, NOT per flow). |

### `kbagent flow detail`

Show detailed conditional-flow information including phases and tasks.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--flow-id` `<str>` | yes | Flow configuration ID |
| `--branch` `<int>` |  | Dev branch ID |

### `kbagent flow schema`

Print the conditional-flow YAML template, or --full for the JSON Schema.

| Option | Required | Description |
|---|---|---|
| `--full` |  | Dump the conditional-flow JSON Schema: live from the stack with --project, bundled snapshot without it. |
| `--project` `<str>` |  | Project alias -- with --full, fetch the live schema from this stack. |

### `kbagent flow examples`

Show bundled example flow configurations (offline, no project needed).

| Option | Required | Description |
|---|---|---|
| `--component-id` `<str>` |  | Flow component id: keboola.flow (conditional, default) or keboola.orchestrator (legacy, informational only). |

### `kbagent flow validate`

Validate a conditional-flow definition (schema + semantic checks).

| Option | Required | Description |
|---|---|---|
| `--file` `<str>` | yes | YAML/JSON flow definition to validate (@file, -, or inline). |
| `--project` `<str>` |  | Project alias -- fetch the live JSON Schema from the stack for full structural + semantic validation. Without it, only semantic checks run. |

### `kbagent flow new`

Create a new conditional-flow (keboola.flow) configuration.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--name` `<str>` | yes | Flow name |
| `--description` `<str>` |  | Optional description |
| `--file` `<str>` |  | YAML/JSON flow definition (@file, -, or inline). Run 'kbagent flow schema' to see the expected format. |
| `--branch` `<int>` |  | Dev branch ID |

### `kbagent flow update`

Update a flow's name, description, or phases/tasks.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--flow-id` `<str>` | yes | Flow configuration ID |
| `--name` `<str>` |  | New flow name |
| `--description` `<str>` |  | New description |
| `--file` `<str>` |  | YAML/JSON flow definition to replace phases + tasks (@file, -, or inline) |
| `--branch` `<int>` |  | Dev branch ID |

### `kbagent flow delete`

Delete a conditional-flow (keboola.flow) configuration.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--flow-id` `<str>` | yes | Flow configuration ID |
| `--branch` `<int>` |  | Dev branch ID |
| `--dry-run` |  | Show what would be deleted without executing |
| `--yes` / `-y` |  | Skip confirmation prompt |

### `kbagent flow schedule`

Bind a cron schedule to a flow (upsert: creates or updates).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--flow-id` `<str>` | yes | Flow configuration ID |
| `--cron` `<str>` | yes | Cron expression (e.g. '0 6 * * *') |
| `--timezone` `<str>` |  | IANA timezone (default: UTC) |
| `--enabled` / `--disabled` |  | Enable the schedule |
| `--name` `<str>` |  | Name for the scheduler config (auto-generated if omitted) |
| `--branch` `<int>` |  | Dev branch ID |

### `kbagent flow schedule-remove`

Remove all schedules bound to a flow (deletes keboola.scheduler configs).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--flow-id` `<str>` | yes | Flow configuration ID |
| `--branch` `<int>` |  | Dev branch ID |
| `--dry-run` |  | List the scheduler configs that would be removed without executing |
| `--yes` / `-y` |  | Skip confirmation prompt |

## `schedule`

Discover and audit cron schedules across projects (keboola.scheduler)

### `kbagent schedule list`

List cron schedules (keboola.scheduler configs) across projects.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias (repeatable; omit for all registered projects) |
| `--enabled-only` |  | Only show schedules whose state is 'enabled' |
| `--branch` `<int>` |  | Dev branch ID (requires single --project) |

### `kbagent schedule detail`

Show full detail for a single cron schedule.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--schedule-id` `<str>` | yes | keboola.scheduler configuration ID |
| `--branch` `<int>` |  | Dev branch ID |

### `kbagent schedule find`

Audit schedules by cron window or job-freshness.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias (repeatable; omit for all projects) |
| `--cron-window` `<str>` |  | Only include schedules firing entirely inside an hour window, e.g. '02:00-04:00'. Hour-field approximation -- see gotchas.md. |
| `--not-run-since` `<int>` |  | Only include schedules whose parent config has not produced a job in the last N days (or never ran). Pass 0 to force the last_run_at lookup for every row without applying a staleness filter. NOTE: Queue API is not branch-aware -- combining with --branch still compares against production jobs. |
| `--branch` `<int>` |  | Dev branch ID (requires single --project) |

## `branch`

Manage development branches

### `kbagent branch list`

List development branches from connected projects.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias to query (can be repeated for multiple projects) |

### `kbagent branch create`

Create a new development branch and auto-activate it.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias to create the branch in |
| `--name` `<str>` | yes | Name for the new development branch |
| `--description` `<str>` |  | Optional description for the branch |

### `kbagent branch use`

Set an existing development branch as active.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias to set the active branch for |
| `--branch` `<int>` | yes | Branch ID to activate |

### `kbagent branch reset`

Reset the active branch back to main/production.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias to reset the active branch for |

### `kbagent branch delete`

Delete a development branch.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias to delete the branch from |
| `--branch` `<int>` | yes | Branch ID to delete |

### `kbagent branch merge`

Get the KBC UI merge URL for a development branch.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--branch` `<int>` |  | Branch ID to merge (uses active branch if not set) |

### `kbagent branch metadata-list`

List all metadata entries on a branch.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias to query |
| `--branch` `<str>` |  | Branch ID or "default" for the main branch |

### `kbagent branch metadata-get`

Read a single metadata value by key.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias to query |
| `--key` `<str>` | yes | Metadata key to read |
| `--branch` `<str>` |  | Branch ID or "default" for the main branch |

### `kbagent branch metadata-set`

Set a metadata key/value on a branch.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--key` `<str>` | yes | Metadata key to set |
| `--text` `<str>` |  | Inline string value |
| `--file` `<path>` |  | Read value from a UTF-8 text file |
| `--stdin` |  | Read value from standard input |
| `--branch` `<str>` |  | Branch ID or "default" for the main branch |

### `kbagent branch metadata-delete`

Delete a branch metadata entry by its numeric ID.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--metadata-id` `<int>` | yes | Numeric ID of the metadata entry (from metadata-list) |
| `--yes` / `-y` |  | Skip confirmation prompt |
| `--branch` `<str>` |  | Branch ID or "default" for the main branch |

## `workspace`

Workspace lifecycle for SQL debugging

### `kbagent workspace create`

Create a new workspace.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias to create the workspace in |
| `--name` `<str>` |  | Name for the workspace (shown in Keboola UI) |
| `--backend` `<str>` |  | Workspace backend (auto-detected from project if omitted) |
| `--read-only` / `--no-read-only` |  | Whether the workspace has read-only storage access |
| `--ui` |  | Create via Queue job (slower ~15s, visible in Keboola UI) |

### `kbagent workspace list`

List workspaces from connected projects.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias to query (can be repeated for multiple projects) |
| `--orphaned` |  | Show only orphaned workspaces (keboola.sandboxes config missing) |
| `--branch` `<int>` |  | Dev branch ID. Read-only command -- ignores the alias's active branch by default (mirrors `storage buckets`); pass --branch to opt in. Requires exactly one --project. |
| `--qs-compatible` |  | Show only workspaces whose loginType is known to work with the Query Service AND that are read-only -- the canonical shape for a data-app. |

### `kbagent workspace detail`

Show workspace details (password NOT included).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--workspace-id` `<int>` | yes | Workspace ID |
| `--branch` `<int>` |  | Dev branch ID. Read-only command -- ignores the alias's active branch by default (mirrors `storage bucket-detail`); pass --branch to opt in. |

### `kbagent workspace delete`

Delete a workspace.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--workspace-id` `<int>` | yes | Workspace ID to delete |

### `kbagent workspace password`

Reset workspace password and show the new one.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--workspace-id` `<int>` | yes | Workspace ID |

### `kbagent workspace load`

Load tables into a workspace.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--workspace-id` `<int>` | yes | Workspace ID |
| `--tables` `<str>` | yes | Table ID to load (can be repeated, e.g. in.c-bucket.table-name) |
| `--preserve` |  | Keep existing tables in the workspace (default: clear before loading) |

### `kbagent workspace query`

Execute SQL query in a workspace via Query Service.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--workspace-id` `<int>` | yes | Workspace ID |
| `--sql` `<str>` |  | SQL statement to execute |
| `--file` `<path>` |  | Path to a .sql file to execute |
| `--transactional` |  | Wrap query in a transaction |
| `--full` |  | Fetch the complete result set via CSV export (slower). Default fetches a fast inline page capped by --limit. |
| `--limit` `<int range>` |  | Max rows to fetch via the fast inline path (ignored with --full). |

### `kbagent workspace gc`

Garbage-collect orphaned workspaces.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias to query (can be repeated). None = all projects. |
| `--dry-run` |  | List orphaned workspaces without deleting them |
| `--yes` / `-y` |  | Skip confirmation prompt |

### `kbagent workspace from-transformation`

Create a workspace from a transformation config.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Transformation component ID (e.g. keboola.snowflake-transformation) |
| `--config-id` `<str>` | yes | Configuration ID |
| `--row-id` `<str>` |  | Optional row ID for row-based transformations |
| `--backend` `<str>` |  | Workspace backend (auto-detected from project if omitted) |

## `tool`

MCP tools - interact with Keboola via MCP server

### `kbagent tool list`

List available MCP tools from the keboola-mcp-server.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias to query tools from (uses first available if not set) |
| `--branch` `<int>` |  | Development branch ID (requires --project or active branch) |

### `kbagent tool call`

Call an MCP tool on keboola-mcp-server.

| Option | Required | Description |
|---|---|---|
| `tool_name` (positional) | yes | |
| `--project` `<str>` |  | Project alias (required for write tools, optional for read tools) |
| `--input` `<str>` |  | Tool input as JSON string, @file.json, or - for stdin |
| `--branch` `<int>` |  | Development branch ID (forces single-project mode) |

## `sync`

Sync project configurations with local filesystem

### `kbagent sync init`

Initialize a sync working directory for a Keboola project.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias to initialize sync for |
| `--directory` / `-d` `<path>` |  | Target directory for the project files |
| `--git-branching` |  | Enable git-branching mode (maps git branches to Keboola branches) |
| `--adopt-existing` |  | Adopt an existing .keboola/manifest.json (e.g. written by kbc) instead of failing. Validates the manifest's project_id against the alias and normalises the file. Idempotent. |

### `kbagent sync pull`

Download configurations from a Keboola project to local files.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias to pull configurations from |
| `--all-projects` |  | Pull all configured projects in parallel |
| `--directory` / `-d` `<path>` |  | Project root directory (must contain .keboola/) |
| `--force` |  | Force re-pull. Locally-modified configs whose remote is unchanged are PRESERVED (kept as pending changes for `sync push`); a true merge conflict (local AND remote both changed since the last pull) aborts the pull so you can resolve it. |
| `--theirs` |  | Discard local changes and make the tree match remote (the supported reconcile path for a drifted tree). Overwrites locally-modified configs, restores deleted/missing files, and resolves merge conflicts by taking the remote version instead of aborting. |
| `--dry-run` |  | Show what would be pulled without writing any files |
| `--job-limit` `<int>` |  | Max recent jobs to pull per configuration (default 5) |
| `--no-storage` |  | Skip downloading storage bucket/table metadata |
| `--no-jobs` |  | Skip downloading per-config job history |
| `--with-samples` |  | Download table data samples (CSV previews) |
| `--sample-limit` `<int>` |  | Max rows per table sample (default 100) |
| `--max-samples` `<int>` |  | Max number of tables to sample (default 50) |
| `--branch` `<int>` |  | Dev branch ID. Overrides the manifest / 'branch use' active branch for this single invocation. Requires exactly one --project. |

### `kbagent sync status`

Show which local configurations have been modified, added, or deleted.

| Option | Required | Description |
|---|---|---|
| `--directory` / `-d` `<path>` |  | Project root directory (must contain .keboola/) |

### `kbagent sync diff`

Show detailed diff between local and remote configurations.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias to diff against |
| `--all-projects` |  | Diff all configured projects in parallel |
| `--directory` / `-d` `<path>` |  | Project root directory (must contain .keboola/) |
| `--branch` `<int>` |  | Dev branch ID. Overrides the manifest / 'branch use' active branch for this single invocation. Requires exactly one --project. |

### `kbagent sync push`

Push local configuration changes to a Keboola project.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` |  | Project alias to push changes to |
| `--all-projects` |  | Push all configured projects in parallel |
| `--directory` / `-d` `<path>` |  | Project root directory (must contain .keboola/) |
| `--dry-run` |  | Show what would be pushed without actually pushing |
| `--force` |  | Allow deletion of remote configs that were removed locally |
| `--allow-plaintext-on-encrypt-failure` |  | Allow push even if secret encryption fails (DANGEROUS: secrets stored as plaintext) |
| `--branch` `<int>` |  | Dev branch ID. Overrides the manifest / 'branch use' active branch for this single invocation. Requires exactly one --project. When no '<branch_name>/' subtree exists on disk, the default tree (main/) is promoted to this branch. |
| `--no-name-drift-warnings` |  | Suppress the cosmetic name_drift_warnings array in the result envelope (the underlying detection still runs). |

### `kbagent sync clone`

Clone a reference project into a fresh target, parameterised by overrides.

| Option | Required | Description |
|---|---|---|
| `--source` `<path>` | yes | Reference synced project directory (must contain .keboola/manifest.json) |
| `--target` `<str>` | yes | Target project alias to clone INTO (a fresh/empty project on first clone) |
| `--target-dir` `<path>` | yes | Directory to materialise the clone into (must not exist on first clone) |
| `--bucket-map` `<path>` |  | JSON/YAML file mapping {old_bucket_id: new_bucket_id} for input/output rewrites |
| `--variable-values` `<path>` |  | JSON/YAML file mapping {variable_name: value} to override keboola.variables rows |
| `--instance-rename` `<path>` |  | JSON/YAML file mapping {old_path_prefix: new_path_prefix} to rename config dirs |
| `--dry-run` |  | Apply overrides and show the would-be diff without pushing |
| `--branch` `<int>` |  | Target dev branch id (defaults to the target project's production branch) |

### `kbagent sync branch-link`

Link the current git branch to a Keboola development branch.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--directory` / `-d` `<path>` |  | Project root directory |
| `--branch-id` `<int>` |  | Link to existing Keboola branch by ID |
| `--branch-name` `<str>` |  | Create/find branch with this name |

### `kbagent sync branch-unlink`

Remove the branch mapping for the current git branch.

| Option | Required | Description |
|---|---|---|
| `--directory` / `-d` `<path>` |  | Project root directory |

### `kbagent sync branch-status`

Show the branch mapping status for the current git branch.

| Option | Required | Description |
|---|---|---|
| `--directory` / `-d` `<path>` |  | Project root directory |

## `encrypt`

Encrypt secret values via Keboola Encryption API (one-way, no decrypt)

### `kbagent encrypt values`

Encrypt #-prefixed secret values for a Keboola component.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Keboola component ID (e.g. keboola.python-transformation-v2) |
| `--input` `<str>` | yes | JSON to encrypt: inline JSON, @file.json, or - for stdin |
| `--output-file` `<path>` |  | Write result to file (0600 permissions) instead of stdout |

## `semantic-layer`

Manage Keboola semantic layer (metastore) models -- datasets, metrics, relationships, constraints, and glossary terms.

### `kbagent semantic-layer token`

Encrypt the project's storage token for transformation `user_properties`.

| Option | Required | Description |
|---|---|---|
| `--encrypt` |  | Encrypt the project token for `user_properties` (required) |
| `--project` `<str>` | yes | Project alias |
| `--component-id` `<str>` | yes | Keboola component id the encrypted token will be used in |

### `kbagent semantic-layer build`

Build a semantic-layer model from a list of storage tables (non-interactive).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Target project alias |
| `--model` `<str>` |  | Update this existing model (name or UUID). If omitted, a new model is created. |
| `--tables` `<str>` |  | Comma-separated tableIds to base the model on (required). |
| `--name` `<str>` |  | Model name when creating (default: kbagent_build_model). |
| `--dry-run` |  | Print the generated JSON + validation, no POST. |
| `--keep-on-failure` |  | Keep partially-pushed model + children on failure (forensics). Default: rollback in reverse PUSH_ORDER + delete the model if we created it. |
| `--output` `<path>` |  | Also write the generated JSON to this file. |
| `--types-workspace` `<int>` |  | Workspace ID used to read real column types from the warehouse INFORMATION_SCHEMA for tables whose Storage metadata carries none (alias / linked-bucket tables). Without it such tables reach the heuristic untyped and every field becomes a dimension. |
| `--auto-types-workspace` |  | Auto-pick a read-only workspace per backend for column-type resolution (instead of passing --types-workspace explicitly). |

### `kbagent semantic-layer promote`

Promote a model from one project to another (NEW + overwrite CHANGED; never deletes).

| Option | Required | Description |
|---|---|---|
| `--from-project` `<str>` | yes | Source project alias |
| `--to-project` `<str>` | yes | Target project alias |
| `--from-model` `<str>` |  | Source model name or UUID (defaults to sole) |
| `--to-model` `<str>` |  | Target model name or UUID (defaults to sole) |
| `--types` `<str>` |  | Comma-separated subset (datasets,metrics,relationships,glossary,constraints) |
| `--dry-run` |  | Classify NEW/IDENTICAL/CHANGED without writing |
| `--yes` / `-y` |  | Skip the cross-project confirmation prompt |

### `kbagent semantic-layer import`

Replay a snapshot into a project.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Target project alias |
| `--file` `<path>` | yes | Snapshot JSON file (output of `semantic-layer export`) |
| `--model` `<str>` |  | Target model name or UUID (defaults to the sole model) |
| `--types` `<str>` |  | Comma-separated subset to import: datasets,metrics,relationships,glossary,constraints |
| `--dry-run` |  | Plan the import without calling any write API |
| `--overwrite` |  | DELETE+POST conflicting items (default: skip) |
| `--yes` / `-y` |  | Skip confirmation (alias for default SKIP behavior) |

### `kbagent semantic-layer show`

Show the entities in a semantic-layer model.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID. Optional when the project has a single model. |
| `--type` `<str>` |  | Filter to one entity type: dataset | metric | relationship | constraint | glossary. |

### `kbagent semantic-layer schema`

Fetch the server-side JSON Schema of semantic object types.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--type` `<str>` |  | Comma-separated semantic type(s): model | dataset | metric | relationship | constraint | glossary. |
| `--all` |  | Fetch the schema of every known semantic type. |

### `kbagent semantic-layer export`

Snapshot a semantic-layer model to a self-describing JSON file.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID (optional if project has one model). |
| `--output` `<path>` |  | Output JSON path. Defaults to ./sl_export_{model_name}_{YYYYMMDD_HHMMSS}.json. |

### `kbagent semantic-layer diff`

Diff two semantic-layer snapshots (project↔project, project↔file, file↔file).

| Option | Required | Description |
|---|---|---|
| `--project-a` `<str>` |  | Left side: project alias |
| `--project-b` `<str>` |  | Right side: project alias |
| `--model-a` `<str>` |  | Left side: model name/UUID (when --project-a is set) |
| `--model-b` `<str>` |  | Right side: model name/UUID (when --project-b is set) |
| `--file-a` `<path>` |  | Left side: snapshot JSON path (mutually exclusive with --project-a) |
| `--file-b` `<path>` |  | Right side: snapshot JSON path (mutually exclusive with --project-b) |

### `kbagent semantic-layer validate`

Validate a semantic-layer model.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID (optional if project has one model). |
| `--deep` |  | Fetch every dataset's storage schema in parallel and add phantom-field, metric-phantom, and agg-on-STRING checks. |

### `kbagent semantic-layer search-context`

Search semantic-layer entities across a project by name pattern.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--pattern` `<str>` |  | Glob pattern matched against entity name (case-sensitive fnmatch). Repeatable; matches the union. Default: '*'. |
| `--type` `<str>` |  | Restrict to one type: model | dataset | metric | relationship | constraint | glossary | all. Default: all (every child type). |
| `--limit` `<int>` |  | Maximum number of results to return. Default: no cap. |

### `kbagent semantic-layer get-context`

Fetch a single semantic-layer entity by id, irrespective of its type.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--context-id` `<str>` | yes | UUID of the entity to fetch (model, dataset, metric, ...). |

### `kbagent semantic-layer model list`

List all semantic-layer models in a project.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |

### `kbagent semantic-layer model create`

Create a new semantic-layer model.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--name` `<str>` | yes | Model name (unique within project) |
| `--description` `<str>` |  | Optional description |
| `--sql-dialect` `<str>` |  | SQL dialect (default: Snowflake) |

### `kbagent semantic-layer model delete`

Delete a semantic-layer model and cascade-delete its children.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` | yes | Model name or UUID |
| `--yes` / `-y` |  | Skip the confirmation prompt |

### `kbagent semantic-layer add metric`

Add a metric to a semantic-layer model.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--name` `<str>` | yes | Metric name |
| `--sql` `<str>` | yes | SQL expression for the metric |
| `--dataset` `<str>` | yes | Dataset tableId this metric belongs to |
| `--description` `<str>` |  | Optional description |
| `--yes` / `-y` |  | Skip the dataset-mismatch warning |

### `kbagent semantic-layer add dataset`

Add a dataset (FQN derived from tableId).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--name` `<str>` | yes | Dataset name |
| `--table-id` `<str>` | yes | Storage tableId, e.g. out.c-bucket.table |
| `--description` `<str>` |  |  |
| `--grain` `<str>` |  | Grain description |
| `--primary-key` `<str>` |  | Repeat for multi-col PK |
| `--deep-fields` |  | Fetch storage schema and synthesise fields[] with role heuristics. |

### `kbagent semantic-layer add relationship`

Add a relationship between two datasets.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--name` `<str>` | yes | Relationship name |
| `--from` `<str>` | yes | Source dataset tableId |
| `--to` `<str>` | yes | Target dataset tableId |
| `--on` `<str>` | yes | Join condition |
| `--type` `<str>` |  | Join type: 'left' or 'inner'. |

### `kbagent semantic-layer add constraint`

Add a constraint.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--name` `<str>` | yes | Constraint name (regex ^[a-z][a-z0-9_]*$). For the 4-band health convention end with _critical / _warning / _healthy / _review. |
| `--constraint-type` `<str>` | yes | One of: inequality|equality|range|composition|exclusion|temporal|conditional. |
| `--rule` `<str>` | yes | Rule expression STRING (e.g. "value >= 0"). NOT an object. |
| `--metrics` `<str>` | yes | Comma-separated list of metric names this constraint applies to. |
| `--severity` `<str>` |  | One of: error|warning|info (the 3-level API enum). |

### `kbagent semantic-layer add glossary`

Add a glossary term.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--term` `<str>` | yes | Glossary term |
| `--definition` `<str>` |  | Optional definition |

### `kbagent semantic-layer edit metric`

Edit a metric.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--name` `<str>` | yes | Current metric name |
| `--new-name` `<str>` |  | Rename to this name (triggers constraint cascade) |
| `--new-sql` `<str>` |  | Replace SQL |
| `--new-dataset` `<str>` |  | Replace dataset tableId |
| `--new-description` `<str>` |  | Replace description |
| `--yes` / `-y` |  | Skip the rename-cascade prompt |

### `kbagent semantic-layer edit dataset`

Edit a dataset (no cascade — metric.dataset uses tableId, not name).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--name` `<str>` | yes | Current dataset name |
| `--new-name` `<str>` |  | Rename to this name |
| `--new-description` `<str>` |  | Replace description |
| `--new-grain` `<str>` |  | Replace grain |

### `kbagent semantic-layer edit constraint`

Edit a constraint (DELETE+POST, with local validators).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--name` `<str>` | yes | Current constraint name |
| `--new-name` `<str>` |  | Rename to this name (regex '^[a-z][a-z0-9_]*$') |
| `--new-rule` `<str>` |  | Replace rule (STRING) |
| `--new-constraint-type` `<str>` |  | Replace constraintType (closed enum) |
| `--new-severity` `<str>` |  | Replace severity (error|warning|info) |
| `--new-metrics` `<str>` |  | Comma-separated list of metric names |

### `kbagent semantic-layer edit relationship`

Edit a relationship (DELETE+POST).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--name` `<str>` | yes | Current relationship name |
| `--new-name` `<str>` |  | Rename to this name |
| `--new-from` `<str>` |  | Replace source dataset tableId |
| `--new-to` `<str>` |  | Replace target dataset tableId |
| `--new-on` `<str>` |  | Replace join condition |
| `--new-type` `<str>` |  | Replace join type (left | inner) |

### `kbagent semantic-layer edit glossary`

Edit a glossary term.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--term` `<str>` | yes | Current glossary term |
| `--new-term` `<str>` |  | Rename the term (DESTRUCTIVE cascade: downstream consumers joining on the term string will break -- pass --yes to confirm). |
| `--new-definition` `<str>` |  | Replace the definition |
| `--yes` / `-y` |  | Skip the rename-cascade prompt (required for --new-term) |

### `kbagent semantic-layer remove metric`

Remove a metric.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--name` `<str>` | yes | Metric name |
| `--yes` / `-y` |  | Skip the confirm prompt |

### `kbagent semantic-layer remove dataset`

Remove a dataset.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--name` `<str>` | yes | Dataset name |
| `--yes` / `-y` |  | Skip the confirm prompt |

### `kbagent semantic-layer remove constraint`

Remove a constraint.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--name` `<str>` | yes | Constraint name |
| `--yes` / `-y` |  | Skip the confirm prompt |

### `kbagent semantic-layer remove relationship`

Remove a relationship.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--name` `<str>` | yes | Relationship name |
| `--yes` / `-y` |  | Skip the confirm prompt |

### `kbagent semantic-layer remove glossary`

Remove a glossary term.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--term` `<str>` | yes | Glossary term |
| `--yes` / `-y` |  | Skip the confirm prompt |

### `kbagent semantic-layer reference-data list`

List reference-data records (dimension summaries; use ``get`` for members).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Filter to one model (name or UUID) |

### `kbagent semantic-layer reference-data get`

Fetch one record (all members) by ``--id`` or by ``--dimension``.

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--id` `<str>` |  | Record UUID |
| `--dimension` `<str>` |  | Dimension name (project-unique; instead of --id) |

### `kbagent semantic-layer reference-data set`

Create or replace a reference-data record (keyed by dimension).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--model` `<str>` |  | Model name or UUID |
| `--dimension` `<str>` | yes | Dimension name, e.g. 'chart_of_accounts' |
| `--members-file` `<str>` | yes | Path to a JSON array of member objects ('-' reads stdin). |
| `--dataset-id` `<str>` |  | Optional tableId of the descriptive dataset (e.g. DIM_COA) |
| `--description` `<str>` |  | Optional description |

### `kbagent semantic-layer reference-data delete`

Delete a reference-data record by UUID (server-side soft-delete).

| Option | Required | Description |
|---|---|---|
| `--project` `<str>` | yes | Project alias |
| `--id` `<str>` | yes | Record UUID |
| `--yes` / `-y` |  | Skip the confirm prompt |

## `http`

Raw HTTP client against the running `kbagent serve` (uses KBAGENT_SERVE_URL + KBAGENT_SERVE_TOKEN env vars).

### `kbagent http get`

GET an endpoint on the running kbagent serve.

| Option | Required | Description |
|---|---|---|
| `path` (positional) | yes | |
| `--timeout` `<float>` |  | Request timeout (seconds) |

### `kbagent http post`

POST to an endpoint on the running kbagent serve.

| Option | Required | Description |
|---|---|---|
| `path` (positional) | yes | |
| `--body` / `-d` `<str>` |  | JSON body: inline JSON, @file.json, or - for stdin |
| `--timeout` `<float>` |  | Request timeout (seconds) |

### `kbagent http patch`

PATCH an endpoint on the running kbagent serve.

| Option | Required | Description |
|---|---|---|
| `path` (positional) | yes | |
| `--body` / `-d` `<str>` |  | JSON body: inline JSON, @file.json, or - for stdin |
| `--timeout` `<float>` |  | Request timeout (seconds) |

### `kbagent http delete`

DELETE an endpoint on the running kbagent serve.

| Option | Required | Description |
|---|---|---|
| `path` (positional) | yes | |
| `--timeout` `<float>` |  | Request timeout (seconds) |

## `agent`

Scheduled agent tasks (cron / manual / chained)

### `kbagent agent list`

List all registered agent tasks.

### `kbagent agent show`

Show one task's full configuration.

| Option | Required | Description |
|---|---|---|
| `task_id` (positional) |  | |
| `--id` / `--task-id` `<str>` |  | Task ID (alias for the positional argument). |

### `kbagent agent create`

Register a new scheduled task.

| Option | Required | Description |
|---|---|---|
| `--name` `<str>` | yes | Human-readable task name |
| `--description` `<str>` |  | Free-form description |
| `--cron` `<str>` |  | Cron expression (UTC) |
| `--manual` |  | Skip cron firing -- only run when triggered manually or as downstream. |
| `--enabled` / `--disabled` |  | Initial enabled state. |
| `--type` `<str>` |  | Action type when not using --from-file: ai_agent|cli_command|mcp_tool |
| `--from-file` `<str>` |  | Full action JSON ({"type": "...", "params": {...}}). PATH, @path, or - for stdin. |
| `--cli` `<str>` |  | ai_agent: claude|codex|gemini |
| `--prompt` `<str>` |  | ai_agent: prompt body |
| `--extra-arg` `<str>` |  | ai_agent: extra CLI arg (repeatable). Forwarded to claude/codex/gemini. |
| `--argv` `<str>` |  | cli_command: argv element (repeatable). 'kbagent' prefix is auto-added. |
| `--tool` `<str>` |  | mcp_tool: tool name (e.g. get_jobs) |
| `--mcp-project` `<str>` |  | mcp_tool: project alias to dispatch into. |
| `--mcp-branch` `<int>` |  | mcp_tool: branch ID (optional). |
| `--input` `<str>` |  | mcp_tool: JSON input. Inline, @path, or -. |
| `--timeout` `<int>` |  | Action timeout in seconds. |
| `--trigger-task-id` `<str>` |  | Chain: ID of downstream task to fire after this one. |
| `--trigger-on` `<str>` |  | Chain filter: success|error|always. |

### `kbagent agent update`

Patch one or more fields on a task.

| Option | Required | Description |
|---|---|---|
| `task_id` (positional) |  | |
| `--id` / `--task-id` `<str>` |  | Task ID (alias for the positional argument). |
| `--name` `<str>` |  |  |
| `--description` `<str>` |  |  |
| `--cron` `<str>` |  |  |
| `--enabled` / `--disabled` |  | Toggle scheduler firing. |
| `--manual` / `--auto` |  | --manual disables cron loop; --auto re-enables it (and recomputes next_run_at). |
| `--clear-trigger` |  | Remove any chained downstream trigger. |
| `--trigger-task-id` `<str>` |  | Set/replace the downstream chain target. |
| `--trigger-on` `<str>` |  | Chain filter when --trigger-task-id is set. |

### `kbagent agent delete`

Remove a task.

| Option | Required | Description |
|---|---|---|
| `task_id` (positional) |  | |
| `--id` / `--task-id` `<str>` |  | Task ID (alias for the positional argument). |
| `--yes` / `-y` |  | Skip confirmation prompt. |

### `kbagent agent run`

Trigger a task immediately (does not wait for the next cron firing).

| Option | Required | Description |
|---|---|---|
| `task_id` (positional) |  | |
| `--id` / `--task-id` `<str>` |  | Task ID (alias for the positional argument). |
| `--stream` |  | Stream events live (each event on its own line / NDJSON in --json mode). |
| `--runtime-prompt` `<str>` |  | ai_agent: ad-hoc text appended to the persisted prompt for this run only. |
| `--runtime-input` `<str>` |  | JSON input merged into the action params for this run only. Inline, @path, or -. |

### `kbagent agent runs`

Show the run history of a task (most recent first).

| Option | Required | Description |
|---|---|---|
| `task_id` (positional) |  | |
| `--id` / `--task-id` `<str>` |  | Task ID (alias for the positional argument). |
| `--limit` `<int>` |  | Max rows to return. |

### `kbagent agent run-detail`

Show a single AgentRun record (status, summary, output, error).

| Option | Required | Description |
|---|---|---|
| `task_id` (positional) |  | |
| `run_id` (positional) |  | |
| `--id` / `--task-id` `<str>` |  | Task ID (alias for the positional argument). |
| `--run-id` `<str>` |  | Run ID (alias for the positional argument). |

### `kbagent agent run-events`

Replay the persisted event timeline of an ai_agent run (line-by-line).

| Option | Required | Description |
|---|---|---|
| `task_id` (positional) |  | |
| `run_id` (positional) |  | |
| `--id` / `--task-id` `<str>` |  | Task ID (alias for the positional argument). |
| `--run-id` `<str>` |  | Run ID (alias for the positional argument). |

### `kbagent agent test`

Execute an action ad-hoc (no persistence, no scheduling).

| Option | Required | Description |
|---|---|---|
| `--name` `<str>` |  | Name shown in event init payload. |
| `--stream` |  | Stream events live instead of returning the final run record. |
| `--type` `<str>` |  | ai_agent|cli_command|mcp_tool |
| `--from-file` `<str>` |  | Action JSON (or @path / -). |
| `--cli` `<str>` |  |  |
| `--prompt` `<str>` |  |  |
| `--extra-arg` `<str>` |  |  |
| `--argv` `<str>` |  |  |
| `--tool` `<str>` |  |  |
| `--mcp-project` `<str>` |  |  |
| `--mcp-branch` `<int>` |  |  |
| `--input` `<str>` |  |  |
| `--timeout` `<int>` |  |  |

### `kbagent agent cron-preview`

Show the next N firings of a cron expression.

| Option | Required | Description |
|---|---|---|
| `--cron` `<str>` | yes | Cron expression to evaluate. |
| `--count` `<int>` |  | How many firings to return (1-20). |

### `kbagent agent prompt-improve`

Polish a plain-English goal into an unattended-agent-ready prompt.

| Option | Required | Description |
|---|---|---|
| `--goal` `<str>` | yes | Plain-English goal to polish. |
| `--draft` `<str>` |  | Optional half-baked prompt to refine. |
| `--cli` `<str>` |  | AI CLI to invoke: claude|codex|gemini. |
| `--project` `<str>` |  | Pinned project alias hint. |
| `--extra-arg` `<str>` |  | Extra args for the AI CLI. |
| `--stream` / `--no-stream` |  | Stream events as they arrive (default: on). |

## `dev-portal`

Keboola Developer Portal — multi-identity, production-safe writes.

### `kbagent dev-portal list`

List Developer Portal apps for a vendor.

| Option | Required | Description |
|---|---|---|
| `--vendor` `<str>` | yes |  |
| `--identity` `<str>` |  |  |

### `kbagent dev-portal get`

Show the full Developer Portal entry for one app.

| Option | Required | Description |
|---|---|---|
| `--app` `<str>` | yes | VENDOR.APP_ID, e.g. keboola.ex-foo |
| `--identity` `<str>` |  |  |

### `kbagent dev-portal create`

Create (register) a new app in the Developer Portal.

| Option | Required | Description |
|---|---|---|
| `--vendor` `<str>` | yes |  |
| `--data` `<str>` | yes | Path to JSON payload, or '-' for stdin |
| `--identity` `<str>` |  |  |
| `--dry-run` |  |  |

### `kbagent dev-portal patch`

Patch one or more properties of an existing Developer Portal app.

| Option | Required | Description |
|---|---|---|
| `--app` `<str>` | yes |  |
| `--data` `<str>` |  |  |
| `--property` `<str>` |  |  |
| `--value` `<str>` |  |  |
| `--value-file` `<str>` |  |  |
| `--identity` `<str>` |  |  |
| `--dry-run` |  | Preview the diff without writing. NOTE: still logs in and GETs the current app to compute the diff, so it needs portal connectivity; on a personal (MFA) identity it will prompt for an MFA code. Use a service.{vendor}.{id} identity for a fully non-interactive preview. |

### `kbagent dev-portal upload-icon`

Upload a 128x128 PNG icon for a Developer Portal app.

| Option | Required | Description |
|---|---|---|
| `--app` `<str>` | yes |  |
| `--file` `<str>` | yes |  |
| `--identity` `<str>` |  |  |
| `--dry-run` |  |  |

### `kbagent dev-portal publish`

Publish an app in the Developer Portal (requests Keboola review).

| Option | Required | Description |
|---|---|---|
| `--app` `<str>` | yes |  |
| `--identity` `<str>` |  |  |
| `--dry-run` |  | Preview without writing. NOTE: still logs in and GETs the app to run the publish pre-flight check, so it needs portal connectivity; a personal (MFA) identity will prompt for an MFA code. Use a service.{vendor}.{id} identity for a non-interactive preview. |

### `kbagent dev-portal deprecate`

Deprecate an app in the Developer Portal (hides it, blocks new configs).

| Option | Required | Description |
|---|---|---|
| `--app` `<str>` | yes |  |
| `--identity` `<str>` |  |  |
| `--dry-run` |  |  |

### `kbagent dev-portal identity add`

Add a Developer Portal identity (verifies creds before persisting).

| Option | Required | Description |
|---|---|---|
| `--alias` `<str>` | yes |  |
| `--username` `<str>` | yes |  |
| `--password` `<str>` |  |  |
| `--password-stdin` |  | Read password from stdin. On a TTY this is a hidden prompt (Enter to confirm); on a pipe it reads until EOF (e.g. `echo $PASS | … --password-stdin`). |
| `--role-hint` `<vendor|admin>` |  | Identity role: 'vendor' (default) or 'admin'. Routes write commands to different apps-api endpoints -- admin uses PATCH /admin/apps/{app} which accepts complexity/categories/forwardToken/processTimeout/etc. that the vendor endpoint forbids. |
| `--vendor` `<str>` |  |  |
| `--portal-url` `<str>` |  |  |

### `kbagent dev-portal identity list`

List configured Developer Portal identities.

### `kbagent dev-portal identity remove`

Remove a Developer Portal identity.

| Option | Required | Description |
|---|---|---|
| `--alias` `<str>` | yes |  |

### `kbagent dev-portal identity edit`

Edit fields on a Developer Portal identity (or rename it).

| Option | Required | Description |
|---|---|---|
| `--alias` `<str>` | yes |  |
| `--username` `<str>` |  |  |
| `--password` `<str>` |  |  |
| `--password-stdin` |  |  |
| `--role-hint` `<vendor|admin>` |  |  |
| `--vendor` `<str>` |  |  |
| `--new-alias` `<str>` |  |  |

### `kbagent dev-portal identity use`

Set the default Developer Portal identity.

| Option | Required | Description |
|---|---|---|
| `alias` (positional) | yes | |

### `kbagent dev-portal identity current`

Show the alias of the default Developer Portal identity.

### `kbagent dev-portal identity verify`

Probe a Developer Portal identity by logging in.

| Option | Required | Description |
|---|---|---|
| `--identity` `<str>` |  |  |

## Top-level commands

### `kbagent init`

Initialize a local .kbagent/ workspace in the current directory.

| Option | Required | Description |
|---|---|---|
| `--from-global` |  | Copy projects from the global config into the new local workspace. |
| `--project` `<str>` |  | Copy only the named project(s) from the global config (repeatable). Implies --from-global. Without it, all global projects are copied. |
| `--read-only` |  | Set read-only permission policy (blocks all write CLI commands and MCP tools). |

### `kbagent doctor`

Run health checks on CLI configuration and project connectivity.

| Option | Required | Description |
|---|---|---|
| `--fix` |  | Auto-fix issues: install MCP server binary for faster startup. |

### `kbagent version`

Show kbagent version and check for dependency updates.

| Option | Required | Description |
|---|---|---|
| `--beta` |  | Report the latest pre-release (beta / rc) instead of the latest stable. |

### `kbagent update`

Update kbagent + keboola-mcp-server to the latest versions.

| Option | Required | Description |
|---|---|---|
| `--beta` |  | Opt into pre-release versions (beta / rc). Without this flag (the default) and without KBAGENT_INCLUDE_PRERELEASE=1 in env, the GitHub /releases/latest endpoint -- which filters out prereleases server-side -- is used, so a beta release will never silently install. With --beta, the resolver opts into PEP 440 prereleases (``uv --prerelease=allow`` / ``pip --pre``). |

### `kbagent changelog`

Show recent changelog (what changed in each version).

| Option | Required | Description |
|---|---|---|
| `--limit` / `-n` `<int range>` |  | Number of versions to show. |
| `--full` / `-v` |  | Show complete notes for each version (default: one-line summary). |

### `kbagent context`

Show usage instructions for AI agents interacting with Keboola.

### `kbagent repl`

Start interactive REPL mode for kbagent.

### `kbagent serve`

Launch the kbagent HTTP API server.

| Option | Required | Description |
|---|---|---|
| `--host` `<str>` |  | Bind host. Default 127.0.0.1 (localhost-only). |
| `--port` `<int>` |  | Bind port. Default 8001 to leave 8000 for the Node BFF. |
| `--reload` |  | Auto-reload on code changes (uvicorn --reload). |
| `--log-level` `<str>` |  | uvicorn log level: critical, error, warning, info, debug, trace. |
| `--cors-origin` `<str>` |  | Add a CORS origin (repeatable). Default: localhost:5173 / 8000. |
| `--config-dir` `<str>` |  | Override config directory path (matches kbagent --config-dir). |
| `--ui` |  | Mount the built React SPA at / so a single uvicorn process serves both the API and the UI. ``GET /`` sets an HttpOnly `kbagent_session` cookie (SameSite=Strict, Path=/) so the browser boots already authenticated -- no Node BFF, no paste step, no token in the JS heap or URL. Run `make web-build` once to produce the dist/ folder. |
| `--ui-dist` `<str>` |  | Override the path to the built React dist/ directory. Defaults to <repo>/web/frontend/dist relative to the package, or $KBAGENT_UI_DIST. Implies --ui. |

### `kbagent search`

Search for items (tables, buckets, configs, flows, …) by name or content.

| Option | Required | Description |
|---|---|---|
| `query` (positional) | yes | |
| `--project` / `-p` `<str>` |  | Project alias to search (repeatable; defaults to all projects). |
| `--type` / `-t` `<str>` |  | Item type to restrict results. Repeatable. Valid values: table, bucket, config, flow, data-app, transformation. |
| `--search-type` `<str>` |  | Search mode. ``textual`` (default) searches item names via the Storage API. ``config-based`` scans full configuration JSON bodies. |
| `--limit` / `-l` `<int range>` |  | Maximum number of results per project (textual search only, 1-100). |
| `--regex` / `-r` |  | Run the query as a regular expression (opt-in). Case-insensitive whole-term match against entity names only (not column names): 'report' will NOT match 'monthly_report' -- use '.*report.*'. Textual search only. |
