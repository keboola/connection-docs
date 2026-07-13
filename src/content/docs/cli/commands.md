---
title: kbagent commands
slug: 'cli/commands'
description: 'Reference for the kbagent command groups — project, config, job, storage, flow, sync, search, branch, workspace, agent, and more — with what each does and how to get the full list.'
---



kbagent groups its commands by area. Run `kbagent --help` for the live list, `kbagent <group> --help` for a group's subcommands, and `kbagent context` for the full machine-readable reference (built for AI agents — see [For AI agents](/cli/for-agents/)).

Every command accepts global flags: `--json` / `-j` (machine-readable output), `--verbose` / `-v`, `--no-color`, and the safety firewalls `--deny-writes` / `--deny-destructive` (see [Workflows → Permissions](/cli/workflows/#permissions-and-sandboxing)).

<!-- Command groups verified against kbagent v0.66.0 `kbagent --help`, 2026-07-13. -->

## Setup & info

| Command | What it does |
|---------|--------------|
| `init` | Initialize a local `.kbagent/` workspace in the current directory. |
| `doctor` | Health checks on configuration and project connectivity. |
| `version` / `update` / `changelog` | Show version, update kbagent + the MCP server, view recent changes. |
| `context` | Print usage instructions and the full command reference for AI agents. |
| `repl` | Interactive REPL. |
| `serve` | Launch the kbagent HTTP API server (and optional Web UI). |
| `permissions` | Manage the operation firewall (persisted policy). |

## Browse & inspect

| Command | What it does |
|---------|--------------|
| `search` | Find tables, buckets, configs, and flows by name or content — across projects. |
| `component` | Discover and inspect Keboola components. |
| `config` | Browse and inspect configurations (`list`, `detail`, `search`, `update`, row CRUD, variables). |
| `data-app` | Data app lifecycle (create, deploy, manage). |
| `job` | Browse job history and run jobs (`list`, `detail`, `run`, `terminate`). |
| `storage` | Buckets, tables, and files — browse and manage. |
| `stream` | Data Streams (OTLP) source management. |
| `sharing` | Cross-project bucket sharing and linking. |
| `lineage` | Column-level data lineage across projects. |
| `kai` | *(Beta)* Ask [Kai](/kai/) questions about your project from the terminal. |

## Project management

| Command | What it does |
|---------|--------------|
| `project` | Manage connected projects — `add`, `list`, `remove`, `edit`, `status`, `use`, `info`, `invite`, `member-list`, `member-set-role`, and more. |
| `org` | Organization management (bulk onboarding with `org setup`). |
| `feature` | Feature-flag management (requires a super-admin Manage API token). |
| `token` | Storage API token management — scoped mint / revoke / rotate. |

## Flows

| Command | What it does |
|---------|--------------|
| `flow` | Manage [conditional flows](/flows/) (`keboola.flow`). |
| `schedule` | Discover and audit cron schedules across projects. |

## Development

| Command | What it does |
|---------|--------------|
| `branch` | Manage [development branches](/components/branches/). |
| `workspace` | Workspace lifecycle for SQL debugging. |
| `tool` | Call Keboola [MCP](/ai/mcp-server/) tools directly. |
| `sync` | Sync project configurations with the local filesystem (GitOps). |
| `encrypt` | Encrypt secret values via the Keboola Encryption API (one-way). |
| `semantic-layer` | Manage semantic-layer models — datasets, metrics, relationships, glossary. |
| `agent` | Scheduled agent tasks (cron / manual / chained). |
| `dev-portal` | Keboola Developer Portal — multi-identity, production-safe writes. |

## Example invocations

```bash
# Run a job and wait for it
kbagent job run --project prod \
  --component-id keboola.ex-db-snowflake --config-id 456 --wait

# Create a workspace from a transformation to debug its SQL
kbagent workspace from-transformation --project prod \
  --component-id keboola.snowflake-transformation --config-id 789
```

<!-- VERIFY(owner): confirm the exact flags on `job run`, `workspace from-transformation`, and `config` row CRUD against v0.66.0 `--help`; these are write/create ops and were not run. Examples adapted from repo README. -->

`search` finds configs, tables, buckets, and flows across every connected project. It uses Keboola's Global Search by default; where that feature isn't enabled, add `--search-type config-based` to scan configurations directly:

```console
$ kbagent search "shopify" --search-type config-based
Search results for "shopify" (config-based) — 19 result(s) across 1 project(s)
┏━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━┓
┃ Project   ┃ Type          ┃ ID                    ┃ Name                 ┃ Component ID       ┃
┡━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━┩
│ docs-demo │ configuration │ 01kmdr1ea699sd24yxx2h │ Shopify Product &    │ kds-team.wr-shopify│
│ docs-demo │ configuration │ 01kkce6n00mn5dmxdzw8c │ Shopify Store Monitor│ keboola.data-apps  │
│ docs-demo │ configuration │ 01kktvz3epf2hfcw1zr5p │ Top Selling Products │ keboola.data-apps  │
└───────────┴───────────────┴───────────────────────┴──────────────────────┴────────────────────┘
```
<!-- Real output captured 2026-07-13 against demo project 264; trimmed to 3 of 19 rows for width. -->

Add `--json` to any command for structured output an agent can parse:

```console
$ kbagent --json project list
{ "status": "ok", "data": [ { "alias": "docs-demo", "project_name": "L0 - Shopify",
  "project_id": 264, "stack_url": "https://connection.europe-west3.gcp.keboola.com",
  "is_default": true, "active_branch_id": null, "org_id": 56 } ] }
```

## The full reference

The exhaustive, always-current reference lives in the CLI itself:

```bash
kbagent <group> --help    # subcommands + flags for a group
kbagent context           # full reference (machine-readable, for agents)
```
