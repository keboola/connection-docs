---
title: MCP tools and access control
slug: 'ai/mcp-server/tools'
sidebar:
  label: Tools Reference
description: 'What an AI assistant can do through the Keboola MCP Server — the tool catalogue by category — and how to restrict it with the X-Allowed-Tools, X-Disallowed-Tools, and X-Read-Only-Mode headers, including the read-only tool set.'
---

What your AI client can call through the [Keboola MCP Server](/ai/mcp-server/), and how to narrow that down. You don't need to remember tool names — the client picks them; the names below matter when you're **restricting** access. To set a client up in the first place, see [Connect an AI client](/ai/mcp-server/connect/).

<!-- Reference-type page. Source: the pre-split ai/mcp-server single page (through #1061, which added the semantic-layer tools); the authoritative list is TOOLS.md in keboola/mcp-server. Hand-maintained here, so it drifts by design — re-check against the repo when the server ships new tools. -->

## Tool categories

| Category | What the assistant can do |
|---|---|
| **Components & Transformations** | Create, edit, and launch them with natural language. |
| **Storage** | Browse, edit, and document buckets, tables, and columns. |
| **SQL** | Run and manage SQL queries. |
| **Semantic layer** | Explore the project's semantic models and validate queries against them. |
| **Jobs** | Start, monitor, and debug execution flows. |
| **Flows** | Create and manage flows (including conditional flows) that orchestrate components. |
| **Data Apps** | Create, deploy, and manage Streamlit and Python/JS data apps. |
| **Search & Discovery** | Find components, configurations, and objects across the project. |
| **Project & OAuth** | Read project info and set up OAuth authorizations for components. |
| **Documentation** | Search the official Keboola docs from inside the AI chat. |

For the exact tool names and their annotations, see [`TOOLS.md`](https://github.com/keboola/mcp-server/blob/main/TOOLS.md) in the server repository.

:::note[Not every tool shows up every time]
The server offers a client only the tools that make sense for the connection: semantic-layer tools appear when the project has semantic models, data-app tools outside a development branch, and a read-only token collapses the set to the read-only tools below. So a shorter tool list in your client isn't necessarily a misconfiguration.
:::

## Restricting tool access

On the remote server you can limit which tools an AI client is offered. This is useful for:

- **AI agent restrictions** — capping what an agent (Devin, Cursor, your own) may do in the project.
- **Compliance and security** — enforcing data-governance policy by blocking write operations.
- **Customer-specific access** — tailored access profiles per use case.

Over the Streamable HTTP transport, the client controls this with HTTP headers.

:::note
Tool authorization headers only apply to HTTP-based transports. They are not available with the `stdio` transport used for [local execution](/ai/mcp-server/self-hosted/).
:::

### Authorization headers

| Header | Description | Example value |
|--------|-------------|---------------|
| `X-Allowed-Tools` | Comma-separated list of tool names to allow. Only these tools will be available. | `get_configs,get_buckets,query_data` |
| `X-Disallowed-Tools` | Comma-separated list of tool names to exclude. These tools will be removed from the available set. | `create_config,run_job` |
| `X-Read-Only-Mode` | When set to `true`, `1`, or `yes`, restricts access to read-only tools only. | `true` |

The headers are set by the client (your AI agent integration or custom MCP client) when it calls the server — check your client's documentation for how to add custom HTTP headers.

### Filter behavior

When several headers are present, filters apply in this order:

1. **Allowed-tools filter** — if `X-Allowed-Tools` is specified, only those tools are initially available.
2. **Read-only intersection** — if `X-Read-Only-Mode` is enabled, the available tools are intersected with the read-only set.
3. **Disallowed exclusion** — tools listed in `X-Disallowed-Tools` are removed from the final set.

Empty headers are treated as no restriction/exclusion (backward-compatible behavior).

### Read-only tools

These tools are classified as read-only — they don't modify data. The live set may grow over time; [`TOOLS.md`](https://github.com/keboola/mcp-server/blob/main/TOOLS.md) carries the current annotations.

| Category | Tools |
|----------|-------|
| Components | `get_configs`, `get_components`, `get_config_examples`, `run_sync_action` |
| Flows | `get_flows`, `get_flow_examples`, `get_flow_schema` |
| Storage | `get_buckets`, `get_tables` |
| SQL | `query_data` |
| Semantic | `get_semantic_context`, `get_semantic_schema`, `search_semantic_context`, `validate_semantic_query` |
| Data Apps | `get_data_apps` |
| Jobs | `get_jobs` |
| Search | `search`, `find_component_id` |
| Project | `get_project_info` |
| Documentation | `docs_query` |

### Examples

**AI agent restrictions** — let an agent query and explore data, but not create or modify configurations:

```
X-Read-Only-Mode: true
```

**Compliance and security** — a customer-specific profile allowing only specific tools and explicitly blocking others:

```
X-Allowed-Tools: get_buckets,get_tables,query_data,search
X-Disallowed-Tools: run_job
```

**Combined restrictions** — all three headers together, for fine-grained control:

```
X-Allowed-Tools: get_configs,get_buckets,get_tables,query_data,create_config
X-Read-Only-Mode: true
X-Disallowed-Tools: query_data
```

This leaves only `get_configs`, `get_buckets`, and `get_tables` available — the intersection of allowed and read-only, minus the disallowed.

:::tip
Restricting tools caps *what* an agent can do. To cap *where* it can do it, scope the connection to a [development branch](/ai/mcp-server/#keeping-an-agent-off-production) with `X-Branch-Id`, or run the server with a narrower [Storage token](/ai/mcp-server/self-hosted/).
:::

**Next:** [Run the server yourself →](/ai/mcp-server/self-hosted/)
