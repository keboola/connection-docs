---
title: kbagent how-to guides
slug: 'cli/workflows'
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

Link a git branch to the Keboola dev branch so they move together:

```bash
kbagent sync branch-link --project analytics
```

**Result:** your edits live on the branch; production is untouched until you merge. `kbagent branch reset --project analytics` returns to main, and any command can override the target with `--branch <id>`.

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

## Audit configurations across projects

**Goal:** find where a credential might be hard-coded, everywhere at once.

```bash
kbagent config search --query "password" -i
```

**Result:** matches across every connected project in one list. `-i` ignores case; add `-r` to match `--query` as a regular expression.

## Monitor job health

**Goal:** spot failures across the org.

```bash
kbagent job list --status error --limit 5
kbagent job detail --project prod --job-id 90878516
```

**Result:** recent failures with the detail to triage them; `job terminate` stops a runaway job.

## Mint temporary tokens for CI/CD

**Goal:** give an automated pipeline a short-lived, scoped token.

```bash
kbagent token create --project prod --description "nightly-ci" --expires-in 86400
```

**Result:** a scoped Storage token (shown once) that auto-expires. `token refresh` rotates one; `token delete` revokes immediately. <!-- PENDING(owner): token create/refresh flag names (--description, --expires-in) not verified against the dev docs; confirm with `kbagent token --help`. -->

## Encrypt secrets

**Goal:** put a secret into a config safely. Encryption is one-way — there's no decrypt — so encrypted values are safe to store.

```bash
kbagent encrypt values --project prod --component-id keboola.ex-db-mysql --input @secrets.json
```

`--input` takes inline JSON, `@file`, or `-` for stdin. **Result:** the `#`-prefixed values encrypted for that component (scope `ComponentSecure`), ready to paste into a configuration.

:::note
`kbagent config update` already auto-encrypts any `#`-prefixed value before writing it (since v0.54.0), so for most edits you don't need this step. Use `encrypt values` when you want the ciphertext on its own — for example to hand to an MCP tool call or paste elsewhere.
:::
<!-- PENDING(owner): confirm the `config update` auto-encrypt version and that `encrypt values` remains the recommended standalone path. -->

## Run kbagent safely (unattended or via an agent)

**Goal:** allow reads and proposals but block anything destructive.

```bash
kbagent --deny-writes config list         # reads only, this session
kbagent init --from-global --read-only    # a read-only local workspace
```

See [Use with AI agents](/cli/for-agents/) for the full sandboxing story.

---

**Next:** [Use kbagent with AI agents →](/cli/for-agents/)
