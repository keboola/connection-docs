---
title: Semantic Layer
slug: 'ai/semantic-layer'
description: Describe your data in business terms — datasets, metrics, relationships, glossary terms, and business rules — so AI assistants understand what your data means.
---

:::caution[Private Beta]
The semantic layer is currently in **private beta**. To have it enabled for your project, contact our [support team](mailto:support@keboola.com).
:::

Keboola's semantic layer lets you describe your project's data in business terms — datasets, metrics, relationships, glossary terms, and business rules. AI assistants connected to your project through the [MCP Server](/ai/mcp-server/) use these definitions to understand what your data *means*, not just how it is stored.

Instead of every AI conversation having to rediscover which table holds revenue, how orders join to customers, or which business rules a query must respect, you define these facts once. Every AI assistant working with your project then grounds its answers — and the SQL it generates — in the same shared definitions.

## Why Use a Semantic Layer?

- **Consistent answers** – A metric such as "net revenue" is defined once, as a SQL expression, and every AI-generated query uses the same definition.
- **Business vocabulary** – Glossary terms teach the AI your company's language, so questions asked in business terms resolve to the right data.
- **Guardrails for AI-generated SQL** – Constraints capture business rules (for example, "profit must never exceed revenue"), and queries can be validated against them before they are executed.
- **Less schema exploration** – The AI spends less time inspecting raw tables and columns because the relevant context is already curated.

## Core Concepts

A **semantic model** is a collection of semantic objects stored centrally in Keboola. There are six semantic object types:

| Object type | What it describes |
|---|---|
| `semantic-model` | The top-level container for a set of semantic definitions. It also records the SQL dialect used by the model's SQL expressions. |
| `semantic-dataset` | Maps a Keboola table (by table ID) to a business entity, including its fields and primary key. |
| `semantic-metric` | A named business calculation defined as a SQL expression over a dataset — for example, revenue, order count, or margin. |
| `semantic-relationship` | How two datasets join: the from/to datasets, the join type, and the join condition. |
| `semantic-glossary` | A business term and its definition — your company vocabulary. |
| `semantic-constraint` | A business rule with a severity (`error`, `warning`, or `info`) that queries can be checked against. |

A project can contain multiple semantic models. Each object is a JSON document validated against a published JSON schema, which you (or your AI assistant) can retrieve with the `get_semantic_schema` tool described below.

## Using the Semantic Layer via MCP

Once the semantic layer is enabled for your project, four additional tools automatically appear in the [Keboola MCP Server](/ai/mcp-server/). All of them are read-only.

| Tool | What it does |
|---|---|
| `search_semantic_context` | Searches semantic models and objects using regex patterns matched against names, descriptions, and attributes. Used to discover which semantic objects are relevant to a question. |
| `get_semantic_context` | Loads semantic objects by type — all objects of a type in compact form, or specific objects by ID with full attributes. |
| `get_semantic_schema` | Returns the JSON schema for any semantic object type. |
| `validate_semantic_query` | Performs a best-effort semantic validation of a SQL query against one or more semantic models: it detects which datasets, metrics, and relationships the query uses and surfaces constraint violations — without executing the query. |

You don't call these tools yourself. Ask questions in plain language ("What was our net revenue last quarter, by region?") and your AI assistant uses them to ground its answer:

1. **Discover** – `search_semantic_context` finds the semantic objects related to your question, such as the "net revenue" metric and the datasets it is built on.
2. **Load** – `get_semantic_context` retrieves the full definitions of the relevant objects.
3. **Validate** – Before running any SQL, `validate_semantic_query` checks the query against the model and reports business-rule violations.
4. **Query** – The assistant executes the validated SQL with the standard `query_data` tool.

:::note
Semantic query validation is heuristic — it matches the SQL text against semantic metadata rather than fully parsing the query. Treat it as a best-effort check, not a formal proof of correctness.
:::

Because the semantic tools are read-only, they remain available when the MCP connection is restricted with the `X-Read-Only-Mode` header (see [Restricting Tool Access](/ai/mcp-server/#restricting-tool-access)).

## Building and Maintaining a Semantic Model

Semantic models are created and edited with AI assistance. Two [AI Kit](/ai/ai-kit/) plugins cover the two most common starting points: building a model from scratch and migrating an existing one.

### Semantic Layer Toolkit (`sl-toolkit`)

The Semantic Layer Toolkit lets you build, inspect, validate, and edit semantic models from an AI coding assistant such as Claude Code.

**Commands:**

- `/sl-build` – A greenfield wizard that builds a new semantic model from your Keboola project: schema discovery → SQL analysis → generation → validation → push.
- `/sl-show` – Lists all datasets, metrics, relationships, constraints, and glossary terms in a model.
- `/sl-validate` – Checks a model for consistency issues such as references to non-existent fields or dangling relationships.

**Conversational editing:**

Adding, editing, and removing semantic objects doesn't need commands — just describe the change:

> "Add a metric for net profit margin on the KPI dashboard table."
> "Rename the Revenue metric to Total Revenue."

[View the Semantic Layer Toolkit on GitHub](https://github.com/keboola/ai-kit/tree/main/plugins/sl-toolkit)

### Power BI Migration (`powerbi-to-sl`)

If you already maintain a semantic model in Microsoft Power BI, the `powerbi-to-sl` plugin translates it into Keboola semantic layer objects: Power BI tables become semantic datasets, measures become semantic metrics (DAX expressions are preserved verbatim for review), and relationships become semantic relationships. The recommended input is a TMDL export produced by Microsoft's Power BI Modeling MCP server in read-only mode.

The plugin produces schema-validated JSON payloads and flags anything that needs human attention — such as complex DAX or unmapped data types — in a warnings report. Pushing the result to your project is then handled by `sl-toolkit`.

[View the Power BI migration plugin on GitHub](https://github.com/keboola/ai-kit/tree/main/plugins/powerbi-to-sl)

### Installation

Both plugins are installed from the [AI Kit](/ai/ai-kit/) marketplace:

```bash
/plugin marketplace add keboola/ai-kit
/plugin install sl-toolkit
/plugin install powerbi-to-sl
```

## Example Prompts

Once your project has a populated semantic model and your AI assistant is connected via MCP, try:

- "What semantic models are defined in this project?"
- "What was our total revenue last month? Use the semantic layer definitions."
- "Which business rules apply to queries on the orders dataset?"
- "Validate this SQL against the sales semantic model before running it."

## Support and Feedback

If you run into issues or have feedback during the private beta, contact our [support team](mailto:support@keboola.com) — beta feedback directly shapes where the semantic layer goes next.
