---
title: Getting started with kbagent
slug: 'cli/getting-started'
description: 'Install the kbagent CLI, connect a Keboola project (single, multi-project, or a whole organization), verify with kbagent doctor, and run your first commands.'
---



Install [kbagent](/cli/), connect it to a project, and run your first commands. This takes a couple of minutes.

## Install

The recommended install is the prebuilt wheel via the install script:

```bash
curl -LsSf https://raw.githubusercontent.com/keboola/cli/main/install.sh | sh
```

Or install from source with [uv](https://docs.astral.sh/uv/) (auto-updates, version-pinnable):

```bash
uv tool install "git+https://github.com/keboola/cli"
```

Check the version:

```console
$ kbagent --version
kbagent v0.66.0
```
<!-- Verified locally 2026-07-13: kbagent v0.66.0 via `uv tool install`. -->

## Connect a project

How you authenticate depends on how much you want to manage.

**A single project** — use a [Storage API token](/management/project/tokens/):

```bash
kbagent project add --project prod \
  --url https://connection.keboola.com --token YOUR_TOKEN
```

**A whole organization** — use a Manage API token (org admin). kbagent registers every project and mints per-project tokens:

```bash
KBC_MANAGE_API_TOKEN=xxx kbagent --allow-env-manage-token \
  org setup --org-id 123 --url https://connection.keboola.com --yes
```

<!-- TODO(human-review, Jordan): confirm the exact single-project token type (Storage vs Master) and the org-setup token/flag details; `--allow-env-manage-token` is required to read KBC_MANAGE_API_TOKEN from the environment (default-deny since 0.28.0). -->

:::caution
kbagent never sends your token anywhere except your Keboola stack, but treat the config directory as sensitive — it stores project credentials. Don't paste tokens into shared terminals or commit them.
:::

## Verify with `doctor`

`kbagent doctor` runs health checks on your configuration and connectivity. Once a project is connected it confirms the link and flags anything still worth doing:

```console
$ kbagent doctor
  PASS  Config file: config.json exists with correct permissions.
  PASS  Config parseable: valid JSON with 1 project(s).
  PASS  Project 'docs-demo': Connected to https://connection.europe-west3.gcp.keboola.com
        (project: L0 - Shopify, id: 264) in 163ms
  PASS  CLI version: kbagent v0.66.0
  PASS  Conversation ID: X-Conversation-ID: docs-capture
  WARN  Claude Code plugin: not installed. Run /plugin marketplace add keboola/cli
```
<!-- Real output captured 2026-07-13 against demo project 264; trimmed for width. -->

## Run your first commands

Once a project is connected, explore it. Add `--json` / `-j` for machine-readable output (what an agent uses):

```console
$ kbagent job list --limit 5
                                        Jobs
┏━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┓
┃ Project   ┃   Job ID ┃ Status  ┃ Component           ┃ Created            ┃ Duration ┃
┡━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━┩
│ docs-demo │ 90878516 │ success │ keboola.flow        │ 2026-07-13T07:16:… │   1m 14s │
│           │ 90878596 │ success │ keboola.snowflake-… │ 2026-07-13T07:16:… │      36s │
│           │ 90878900 │ success │ keboola.data-apps   │ 2026-07-13T07:17:… │      20s │
└───────────┴──────────┴─────────┴─────────────────────┴────────────────────┴──────────┘
```

Other everyday reads:

```bash
kbagent project list          # connected projects
kbagent config list           # configurations in the default project
kbagent search "shopify" --search-type config-based   # find configs by name/content
```

:::note
`kbagent search` uses Keboola's Global Search by default. If a project doesn't have that feature enabled, kbagent tells you and you can fall back to `--search-type config-based` to scan configurations directly.
:::
<!-- Real output captured 2026-07-13 against project 264 (job list, project list, config-based search all verified). Global-search-not-enabled behavior observed on 264. -->

## Set a conversation ID (for agents)

When an AI agent drives kbagent, set a conversation ID so platform observability can correlate the session — every request then carries an `X-Conversation-ID` header:

```bash
export KBAGENT_CONVERSATION_ID="<unique-id>"
```

## Next steps

- [Commands](/cli/commands/) — the full command groups.
- [Workflows](/cli/workflows/) — dev branches, GitOps sync, and real use cases.
- [For AI agents](/cli/for-agents/) — the Claude Code plugin and sandboxing.
