---
title: kbagent how-to guides
slug: 'cli/workflows'
sidebar:
  label: How-to Guides
description: 'Task recipes for the kbagent CLI — onboard an organization, work in development branches, sync configs with GitOps, audit configs, monitor jobs, mint CI/CD tokens, and encrypt secrets.'
---



Practical recipes for [kbagent](/cli/). Each is self-contained: a goal, the steps, and what you get. For the ideas behind them see [How kbagent works](/cli/concepts/); for every command and flag see the [reference](/cli/commands/).

<!-- How-to-type page. Source: keboola/cli docs/guide.md + docs/use-cases.md. Flags flagged where not run live. -->

## Onboard a whole organization

**Goal:** connect every project in an org in one step.

```bash
KBC_MANAGE_API_TOKEN=xxx kbagent --allow-env-manage-token \
  org setup --org-id 123 --url https://connection.keboola.com --yes
```

kbagent registers each project and mints a per-project Storage token. **Result:** `kbagent project list` shows them all, and read commands can now fan out across the whole org.

## Work in a development branch

**Goal:** change configurations without touching production.

```bash
kbagent branch create --project analytics --name "experiment"   # creates and activates
kbagent config update --project analytics --config-id 456 ...    # targets the branch
kbagent branch merge --project analytics                         # get the KBC merge URL
```

Link a git branch to the Keboola dev branch so they move together. This needs a sync workspace in git-branching mode (run once, inside a git repository):

```bash
kbagent sync init --project analytics --git-branching   # once per repo
kbagent sync branch-link --project analytics
```

With no `--branch-id`/`--branch-name`, `branch-link` maps your **current git branch** to a Keboola branch of the same name, creating it if it doesn't exist — check out a git branch and you're on the matching dev branch.

**Result:** your edits live on the branch; production is untouched until you merge. After `branch merge`, kbagent resets the active branch back to main.

## Version your configs with GitOps

**Goal:** track configuration in git and review changes in PRs.

```bash
kbagent sync init --project prod    # set up a working directory
kbagent sync pull --project prod    # write configs to local files
git add . && git commit -m "snapshot"
kbagent sync status                 # what changed locally
kbagent sync diff                   # detailed diff vs remote
kbagent sync push --project prod    # apply local changes back
```

**Result:** a git-versioned copy of the project you can diff, review, and promote between environments.

## Fix a config everywhere at once

**Goal:** every project that still points at the old warehouse host gets found, fixed in a dev branch, and reviewed — without opening the UI.

```bash
kbagent config search --query "old-warehouse.example.com"      # offenders, across ALL projects
kbagent branch create --project analytics --name "warehouse-migration"
kbagent sync pull --project analytics    # configs as local files
# edit the files (or let your coding agent do it)
kbagent sync diff --project analytics    # review exactly what changes
kbagent sync push --project analytics    # apply to the dev branch
kbagent branch merge --project analytics # merge URL for the final click
```

**Result:** the change happened across the org, was reviewable as a diff, and production stayed safe behind the branch — the workflow the UI can't do.

## Audit configurations across projects

**Goal:** find where a credential might be hard-coded, everywhere at once.

```bash
kbagent config search --query "password" --ignore-case
```

**Result:** matches across every connected project in one list.

## Monitor job health

**Goal:** spot failures across the org.

```bash
kbagent job list --status error --limit 5
kbagent job detail --project prod --job-id 90878516
```

**Result:** recent failures with the detail to triage them; `job terminate` stops a runaway job.

## Schedule an AI agent

**Goal:** recurring work done by an AI agent on a schedule — no human in the loop.

```bash
kbagent agent create --name "Weekend triage" --type ai_agent \
  --cli claude --cron "0 6 * * 1" \
  --prompt "Review the weekend's failed jobs and post a triage summary"
kbagent agent run <task-id>      # run it once right now (create prints the ID)
kbagent agent list               # what's scheduled
kbagent agent runs <task-id>     # past runs (drill in with run-detail / run-events)
```

**Result:** every Monday at 6:00 an agent reviews the weekend's failures and writes up the triage — a standing task nobody has to remember. `agent cron-preview` shows the upcoming firing times. Scheduled firing lives in the server: keep `kbagent serve` running (task management and ad-hoc `agent run` work without it).

## Debug transformation SQL from the terminal

**Goal:** test a query against real project data without touching production.

```bash
kbagent workspace from-transformation --project prod \
  --component-id keboola.snowflake-transformation --config-id 123
# → prints the new workspace's ID; loaded with the transformation's inputs
kbagent workspace query --project prod --workspace-id <id> \
  --sql "SELECT count(*) FROM orders"
```

**Result:** the query runs in an isolated SQL workspace with the same data your transformation sees; iterate freely, production never notices. `workspace gc` cleans up idle workspaces.

## Mint temporary tokens for CI/CD

**Goal:** give an automated pipeline a short-lived, scoped token.

```bash
kbagent token create --project prod --description "nightly-ci" --expires-in 86400
```

**Result:** a scoped Storage token (shown once) that auto-expires. `--expires-in` is in seconds — omit it for a token that never expires. `token refresh --token-id <id>` rotates one; `token delete` revokes immediately.

## Encrypt secrets

**Goal:** put a secret into a config safely. Encryption is one-way — there's no decrypt — so encrypted values are safe to store.

```bash
kbagent encrypt values --project prod \
  --component-id keboola.ex-db-snowflake --input '{"#password": "secret"}'
```

**Result:** `#`-prefixed values encrypted for the target component, ready to paste into a configuration. `--input` also accepts `@file` or `-` for stdin.

## Run kbagent safely (unattended or via an agent)

**Goal:** allow reads and proposals but block anything destructive.

```bash
kbagent --deny-writes config list         # reads only, this session
kbagent init --from-global --read-only    # a read-only local workspace
```

See [Use with AI agents](/cli/for-agents/) for the full sandboxing story.

---

**Next:** [Use kbagent with AI agents →](/cli/for-agents/)
