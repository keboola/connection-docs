---
title: Semantic Layer
slug: 'ai/semantic-layer'
description: Describe your data in business terms — datasets, metrics, relationships, glossary terms, and business rules — so AI assistants understand what your data means.
---

:::caution[Beta]
The semantic layer is in beta. It runs on Keboola's multi-tenant stacks and is not offered on
single-tenant stacks. The **Semantic Layer** section in the UI is enabled per project separately
from the semantic layer itself, so your project can already hold a semantic model — one built by
Kai, for example — before the section appears. If your project has no **Semantic Layer** section,
contact our [support team](mailto:support@keboola.com).
:::

<!-- VERIFY(Jordan): plan-level availability wording. Verified: metastore is deployed on all five
multi-tenant stacks and absent on single-tenant; PAYG projects were switched on 2026-07-29. The
multi-tenant rollout was still in progress at the last project update, so this page describes
availability by stack rather than by plan. The UI-vs-capability split is per the 2026-08-19
#kbc-news-feed announcement, verified verbatim: the `semantic-layer` project feature gates only
the sidebar UI, while Kai/MCP create and use models unconditionally wherever the metastore
service is available — see davidesner's comment on PR #1103. -->

Keboola's semantic layer lets you describe your project's data in business terms — datasets, metrics, relationships, glossary terms, and business rules. AI assistants connected to your project through the [MCP Server](/ai/mcp-server/) use these definitions to understand what your data *means*, not just how it is stored.

Instead of every AI conversation having to rediscover which table holds revenue, how orders join to customers, or which business rules a query must respect, you define these facts once. Every AI assistant working with your project then grounds its answers — and the SQL it generates — in the same shared definitions.

## Why use a semantic layer?

- **Consistent answers** – A metric such as "net revenue" is defined once, as a SQL expression, and every AI-generated query uses the same definition.
- **Business vocabulary** – Glossary terms teach the AI your company's language, so questions asked in business terms resolve to the right data.
- **Guardrails for AI-generated SQL** – Constraints capture business rules (for example, "profit must never exceed revenue"), and queries can be validated against them before they are executed.
- **Less schema exploration** – The AI spends less time inspecting raw tables and columns because the relevant context is already curated.

## Core concepts

A **semantic model** is a collection of semantic objects stored centrally in Keboola. Six semantic object types make up a model:

| Object type | What it describes |
|---|---|
| `semantic-model` | The top-level container for a set of semantic definitions. It also records the SQL dialect used by the model's SQL expressions. |
| `semantic-dataset` | Maps a Keboola table (by table ID) to a business entity, including its fields and primary key. |
| `semantic-metric` | A named business calculation defined as a SQL expression over a dataset — for example, revenue, order count, or margin. |
| `semantic-relationship` | How two datasets join: the from/to datasets, the join type, and the join condition. |
| `semantic-glossary` | A business term and its definition — your company vocabulary. |
| `semantic-constraint` | A business rule with a severity (`error`, `warning`, or `info`) that queries can be checked against. |

A project can contain multiple semantic models. Each object is a JSON document validated against a published JSON schema.

There is also a seventh type, `semantic-reference-data` — a per-dimension member store holding the
full member list for a dimension, such as a chart of accounts. It is not part of a model's build,
export, or diff, and is managed with `kbagent semantic-layer reference-data`.

## Building a semantic model

Start here: a project with no semantic model has nothing for an AI assistant to ground on, and the
semantic MCP tools stay hidden until at least one model exists. There are three ways to build one.

### In the Keboola UI

Your project's **Semantic Layer** section lists the project's semantic models:

![The Semantic Layer section in the Keboola UI, listing the project's semantic models](/ai/semantic-layer/semantic-layer-models.png)

A model opens as one tab per object type — datasets, metrics, constraints, relationships, and
glossary terms:

![A semantic model opened in the UI, with one tab per semantic object type](/ai/semantic-layer/semantic-layer-model.png)

Objects open read-only, showing exactly the definition an AI assistant reads — a metric, for
example, shows its SQL expression and description — and are edited explicitly via **Edit**. A
**Metadata** tab tracks the object's revision, schema version, and branch:

![A metric opened read-only in the UI, with its SQL expression, description, and an Edit button](/ai/semantic-layer/semantic-layer-metric.png)

<!-- Live-verified 2026-09-03 against the demo project (europe-west3 /projects/264, project
feature `semantic-layer` on): sidebar item, model list, per-type tabs, read-only object view with
Edit, Metadata tab (revision / schema version / branch). Screenshots captured the same session via
Playwright (shoot.mjs conventions: 1600x950, news popup suppressed). The earlier draft's "AI
guidance" sentence (AI-3616) was cut — no such field ships in the object view today. Revision
history and the lineage graph (AI-3617/3618) remain deliberately left out. -->

### With the CLI

The [Keboola CLI](/cli/commands/) carries a `semantic-layer` command group covering the whole
lifecycle without an AI in the loop — `build` a model from a list of storage tables, `show`,
`export`, `diff`, `validate`, `promote` a model between projects, and add or edit individual
metrics, datasets, relationships, constraints, and glossary terms:

```bash
kbagent semantic-layer --help
```

### With AI Kit plugins

Two [AI Kit](/ai/ai-kit/) plugins cover the two most common starting points from an AI coding
assistant such as Claude Code: building a model from scratch, and migrating one you already have.

#### Semantic Layer Toolkit (`sl-toolkit`)

The Semantic Layer Toolkit lets you build, inspect, validate, and edit semantic models from your assistant.

**Commands:**

- `/sl-build` – A greenfield wizard that builds a new semantic model from your Keboola project: schema discovery → SQL analysis → generation → validation → push.
- `/sl-show` – Lists all datasets, metrics, relationships, constraints, and glossary terms in a model.
- `/sl-validate` – Checks a model for consistency issues such as references to non-existent fields or dangling relationships.

**Conversational editing:**

Adding, editing, and removing semantic objects doesn't need commands — just describe the change:

> "Add a metric for net profit margin on the KPI dashboard table."
> "Rename the Revenue metric to Total Revenue."

:::note
`/sl-build` and `/sl-validate --deep` read your project's schemas through the `kbagent` binary from
the [Keboola CLI](/cli/getting-started/). Without it on your `PATH` they still run, but `/sl-build`
asks you to describe your tables instead of reading them, and the deep checks are skipped.
`/sl-show`, plain `/sl-validate`, and conversational edits don't use it at all.
:::

[View the Semantic Layer Toolkit on GitHub](https://github.com/keboola/ai-kit/tree/main/plugins/sl-toolkit)

#### Power BI migration (`powerbi-to-sl`)

If you already maintain a semantic model in Microsoft Power BI, the `powerbi-to-sl` plugin translates it into Keboola semantic layer objects: Power BI tables become semantic datasets, measures become semantic metrics (DAX expressions are preserved verbatim for review), and relationships become semantic relationships. The recommended input is a TMDL export produced by Microsoft's Power BI Modeling MCP server in read-only mode.

The plugin flags anything that needs human attention — such as complex DAX or unmapped data types — in a warnings report. Pushing the result to your project is not automatic — hand it to `sl-toolkit`, or push it yourself.

[View the Power BI migration plugin on GitHub](https://github.com/keboola/ai-kit/tree/main/plugins/powerbi-to-sl)

#### Installing the plugins

Both plugins are installed from the [AI Kit](/ai/ai-kit/) marketplace:

```bash
/plugin marketplace add keboola/ai-kit
/plugin install sl-toolkit
/plugin install powerbi-to-sl
```

## Using the semantic layer via MCP

Once your project contains at least one semantic model, four additional tools appear in the
[Keboola MCP Server](/ai/mcp-server/). All of them are read-only.

:::note
The tools are hidden while a project has no semantic model — the server checks per request and
keeps them hidden if it cannot reach the semantic layer. If your assistant reports that the
semantic tools are unavailable, build a model first.
:::

| Tool | What it does |
|---|---|
| `search_semantic_context` | Searches semantic models and objects using regex patterns matched against names, descriptions, and attributes. Used to discover which semantic objects are relevant to a question. |
| `get_semantic_context` | Loads semantic objects by type — all objects of a type in compact form, or specific objects by ID with full attributes. |
| `get_semantic_schema` | Returns the published schema information for a semantic object type. It currently reports the available schema versions rather than the schema document itself; `kbagent semantic-layer schema` resolves the default version and returns the full JSON Schema. |
| `validate_semantic_query` | Performs a best-effort semantic validation of a SQL query against one or more semantic models: it detects which datasets, metrics, and relationships the query uses and surfaces constraint violations — without executing the query. |

You don't call these tools yourself. Ask questions in plain language ("What was our net revenue last quarter, by region?") and your AI assistant uses them to ground its answer:

1. **Discover** – `search_semantic_context` finds the semantic objects related to your question, such as the "net revenue" metric and the datasets it is built on.
2. **Load** – `get_semantic_context` retrieves the full definitions of the relevant objects.
3. **Validate** – Before running any SQL, `validate_semantic_query` checks the query against the model and reports business-rule violations.
4. **Query** – The assistant executes the validated SQL with the standard `query_data` tool.

:::note
Semantic query validation is heuristic — it matches the SQL text against semantic metadata rather than fully parsing the query. Treat it as a best-effort check, not a formal proof of correctness.
:::

Because these four tools are read-only, they remain available when the MCP connection is restricted with the `X-Read-Only-Mode` header (see [Restricting Tool Access](/ai/mcp-server/#restricting-tool-access)).

## Example prompts

Once your project has a populated semantic model and your AI assistant is connected via MCP, try:

- "What semantic models are defined in this project?"
- "What was our total revenue last month? Use the semantic layer definitions."
- "Which business rules apply to queries on the orders dataset?"
- "Validate this SQL against the sales semantic model before running it."

## Support and feedback

If you run into issues or have feedback during the beta, contact our [support team](mailto:support@keboola.com) — beta feedback directly shapes where the semantic layer goes next.
