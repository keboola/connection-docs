---
title: kbagent workflows
slug: 'cli/workflows'
description: 'Task-oriented kbagent workflows — development branches, GitOps config sync, Storage files, encryption, the permission firewall, and real end-to-end use cases like org onboarding and CI/CD tokens.'
---



Task-oriented recipes for [kbagent](/cli/). For the command list see [Commands](/cli/commands/); for the agent story see [For AI agents](/cli/for-agents/).

<!-- Source: keboola/cli docs/guide.md + docs/use-cases.md. Mirrored; TODO: repo→docs sync mechanism (Jordan). -->

## Development branches

kbagent makes [development branches](/components/branches/) first-class: create a branch, target it, and related operations follow it automatically instead of touching production.

```bash
kbagent branch create --project analytics --name "experiment"
# subsequent commands can target the branch; sync maps git branches to dev branches
kbagent sync branch-link --project analytics
```

<!-- VERIFY(owner): confirm `branch create` / `sync branch-link` flags and the auto-targeting behavior against v0.66.0. -->

## GitOps: sync configurations to disk

Pull a project's configurations to local YAML, version them in git, and push changes back:

```bash
kbagent sync pull --project prod      # write configs to the working tree
git add . && git commit -m "snapshot"
kbagent sync push --project prod      # apply local changes back to Keboola
```

Use this to back up a project, review config changes in pull requests, or promote changes between environments.

## Storage files

Work with [Storage](/storage/) files and tables from the terminal:

```bash
kbagent storage tables --project prod
kbagent storage files --project prod
```

## Encryption

Encrypt secret values with the Keboola Encryption API. Encryption is one-way — there is no decrypt — so it's safe for putting secrets into configs:

```bash
kbagent encrypt --project prod --value "my-secret"
```

## Permissions and sandboxing

kbagent has a **layered firewall** so you can run it — or hand it to an agent — without risking accidental writes:

- `--deny-writes` — the wide net: block every write, destructive, **and** admin operation (project add/remove/edit, org setup, all Storage mutations) for the session.
- `--deny-destructive` — block only data-destructive operations (delete table/bucket/config, terminate job, delete branch); admin ops like `project remove` are **not** blocked — use `--deny-writes` for those.
- `kbagent permissions …` — persist a policy instead of setting it per session.
- `kbagent init --from-global --read-only` — a read-only local workspace, ideal for agents.

```bash
# Let an agent explore safely — reads allowed, everything else blocked
kbagent --deny-writes config list
```

<!-- Firewall flags verified against v0.66.0 `kbagent --help`, 2026-07-13. -->

## End-to-end use cases

**Onboard a whole organization**

```bash
KBC_MANAGE_API_TOKEN=xxx kbagent --allow-env-manage-token \
  org setup --org-id 123 --url https://connection.keboola.com --yes
```

**Audit configs across every project** — find where a credential might be hard-coded:

```bash
kbagent config search --query "password" --ignore-case
```

**Monitor job health across the org:**

```bash
kbagent job list --status error --limit 5
```

**CI/CD with temporary tokens** — mint an auto-expiring token for an automated workflow:

```bash
kbagent org setup --token-expires-in 86400
```

<!-- VERIFY(owner): confirm `config search`, `job list --status`, and `--token-expires-in` flags; use cases adapted from repo docs/use-cases.md. -->
