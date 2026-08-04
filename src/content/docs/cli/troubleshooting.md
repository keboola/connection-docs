---
title: Troubleshooting kbagent
slug: 'cli/troubleshooting'
sidebar:
  label: Troubleshooting
description: 'The most common kbagent CLI failures and their fixes — install and PATH issues, token and permission errors, firewall denials, sync conflicts, and connectivity problems.'
---



The failures you're most likely to hit with [kbagent](/cli/), each with its cause and fix. With `--json`, failures carry a stable machine-readable `code` — it's shown here where one applies, and the [full catalogue](https://github.com/keboola/cli/blob/main/docs/error-codes.md) lives in the CLI repo.

`kbagent doctor` is the universal first step: it checks your config, connections, and version, and often names the problem outright. `kbagent doctor --fix` repairs what it safely can.

<!-- Reference-type page. Error codes + semantics verified against keboola/cli docs/error-codes.md (CI-gated catalogue) and the section's earlier source-level review (v0.66.1–v0.76.1). -->

## `kbagent: command not found` after install

**Cause:** the install location isn't on your shell's `PATH` yet (the install script and `uv tool install` both place the binary in a per-user directory).

**Fix:** restart the terminal (or re-source your shell profile). If it persists after a `uv` install, run `uv tool update-shell` and open a new terminal. As a no-install fallback, `uvx` works immediately:

```bash
uvx --from 'git+https://github.com/keboola/cli' kbagent --version
```

## Invalid or expired token — `INVALID_TOKEN`

**Cause:** the Storage API token registered for the project was revoked, expired, or mistyped.

**Fix:** create a fresh token in the Keboola UI and re-register the project:

```bash
kbagent project add --project prod \
  --url https://connection.keboola.com --token NEW_TOKEN
```

For projects onboarded via `org setup`, `kbagent project refresh` re-mints the project token instead.

## Token lacks permission — `ACCESS_DENIED` / `MISSING_MASTER_TOKEN`

**Cause:** the operation needs more than your token has. A plain Storage token is enough for browsing, but `token create` requires the `canManageTokens` permission, and creating branches or workspaces needs an admin (master) token.

**Fix:** re-register the project with an admin token for those operations — or keep the limited token on purpose and do the privileged step in the UI.

## Operation blocked by kbagent itself — `PERMISSION_DENIED`

**Cause:** not the API — kbagent's own [permission firewall](/cli/concepts/#the-permission-firewall). A session flag (`--deny-writes`, `--deny-destructive`) or a persisted policy is blocking the operation class.

**Fix:** see what's active, then loosen deliberately:

```bash
kbagent permissions show
kbagent permissions reset   # remove all restrictions
```

If you're inside a read-only local workspace (`init --from-global --read-only`), switch to a directory using your global config instead.

## `KBC_MANAGE_API_TOKEN` is ignored with a warning

**Cause:** by design. kbagent won't read the Manage API token from the environment unless you explicitly allow it — this closes the exfiltration risk of subprocesses inheriting the token.

**Fix:** pass the opt-in flag:

```bash
KBC_MANAGE_API_TOKEN=xxx kbagent --allow-env-manage-token \
  org setup --org-id 123 --url https://connection.keboola.com --yes
```

## `search` says Global Search isn't enabled

**Cause:** the project doesn't have Keboola's Global Search feature.

**Fix:** scan configurations directly instead:

```bash
kbagent search "shopify" --search-type config-based
```

## `NOT_INITIALIZED` — `.keboola/manifest.json` not found

**Cause:** you ran a [GitOps sync](/cli/concepts/#gitops-sync) command in a directory that was never initialized.

**Fix:** initialize first, then pull:

```bash
kbagent sync init --project prod
kbagent sync pull
```

## `SYNC_CONFLICT` — local and remote both changed

**Cause:** since your last `sync pull`, the configuration changed both locally and in Keboola; kbagent refuses to overwrite silently.

**Fix:** the `--json` error lists the conflicting configs under `details.conflicts`. Review them (`kbagent sync diff`), keep the side you want — commit or discard local edits — then pull or push again.

## Web UI or scheduled agents don't respond

**Cause:** both the browser dashboard and cron-scheduled agent tasks run through the local server, and it isn't running.

**Fix:**

```bash
kbagent serve
```

Keep it running (or supervise it) wherever scheduled agents are meant to fire — see [Web UI](/cli/web-ui/) and the [scheduled-agent recipe](/cli/workflows/#schedule-an-ai-agent).

## Timeouts, connection errors, or odd behavior after an update

**Cause:** `TIMEOUT` / `CONNECTION_ERROR` usually mean the stack URL is wrong for that project (each project lives on one [stack](/overview/#stacks)) or the network path is blocked. Odd behavior right after a release can be a stale install.

**Fix:** confirm connectivity and version:

```bash
kbagent project status
kbagent update
kbagent changelog
```

## Still stuck?

- `kbagent doctor --fix` — automated checks and safe repairs.
- `kbagent context` — the full command reference for your installed version.
- The [error-code catalogue](https://github.com/keboola/cli/blob/main/docs/error-codes.md) — every `--json` `code` with its meaning.
- [Command reference](/cli/commands/) — flags and groups overview.
