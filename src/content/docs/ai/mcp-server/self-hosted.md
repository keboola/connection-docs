---
title: Run the MCP server yourself
slug: 'ai/mcp-server/self-hosted'
sidebar:
  label: Run It Yourself
description: 'Run the Keboola MCP Server locally with Docker or uv — set KBC_STORAGE_TOKEN and KBC_WORKSPACE_SCHEMA, add BigQuery credentials, and point Cursor or another client at your local instance.'
---

Most people never do this: [connecting a client](/ai/mcp-server/connect/) to Keboola's hosted server needs no server of your own, and clients like Cursor and Claude can also launch a local one for you. Run it yourself when you want **permissions narrower than your Keboola role** (your own Storage token and workspace schema), or when you're testing, developing, or wiring up a custom client. You can run it with Docker or with `uv`/`uvx`.

<!-- How-to-type page. Source: the pre-split ai/mcp-server single page (through #1061) + keboola/mcp-server README. Commands not re-run during the split — see VERIFY note. -->

<!-- VERIFY(owner: Jordan/Matyáš): Docker and uvx invocations were carried over from the previous page and not executed during this split. -->

## Before you start

Set these environment variables — they're what the local server authenticates with:

- `KBC_STORAGE_TOKEN` — your Keboola [Storage API token](/management/project/tokens/).
- `KBC_WORKSPACE_SCHEMA` — the [workspace](/tutorial/manipulate/workspace/) schema used for SQL queries (**Dataset Name** on BigQuery). Only needed with a custom Storage token; with a master token the server provisions the workspace itself.
- `KBC_STORAGE_API_URL` — your Keboola instance API URL, e.g. `https://connection.keboola.com` or `https://connection.YOUR_REGION.keboola.com`.
- `KBC_BRANCH_ID` *(optional)* — a [development branch](/components/branches/) to scope operations to. Defaults to production.

<!-- VERIFY(owner: Matyáš): the previous version of this page also told BigQuery users to set GOOGLE_APPLICATION_CREDENTIALS and mount a GCP service-account key into the container. Removed: the variable appears nowhere in keboola/mcp-server, there is no google-cloud/google-auth dependency in pyproject.toml, and BigQuery workspace queries have gone through the Query Service since AJDA-2801 (2026-05-29) using the Storage API workspace credentials. Restore if a BigQuery-backed project still needs it. -->
<!-- Same page, same source: the localhost example previously passed ?storage_token=…&workspace_schema=… in the URL. The server stopped reading config from the query string (KAB-1068) and the --accept-secrets-in-url flag has since been removed entirely, so credentials now go through env vars, CLI flags, or HTTP headers. -->


## Run it with Docker

**Goal:** a consistent, isolated instance without managing Python environments — the usual recommendation, especially for clients that can launch Docker containers themselves. You need [Docker](https://docs.docker.com/engine/install/) installed and running.

1. **Pull the image:**

   ```bash
   docker pull keboola/mcp-server:latest
   ```

2. **Run the container:**

   ```bash
   docker run -it --rm \
     -e KBC_STORAGE_TOKEN="YOUR_KEBOOLA_STORAGE_TOKEN" \
     -e KBC_WORKSPACE_SCHEMA="YOUR_WORKSPACE_SCHEMA" \
     keboola/mcp-server:latest \
     --api-url https://connection.YOUR_REGION.keboola.com
   ```

   The same command covers Snowflake and BigQuery projects — on BigQuery, `KBC_WORKSPACE_SCHEMA` is the workspace's **Dataset Name**. `--rm` removes the container when it stops. Inside Docker the server listens on `stdio` by default, which suits clients that invoke and manage Docker commands themselves.

**Result:** a running server your client can talk to. To have Cursor launch it for you:

```json
{
  "mcpServers": {
    "keboola": {
      "command": "docker",
      "args": [
        "run",
        "-it",
        "--rm",
        "-e", "KBC_STORAGE_TOKEN",
        "-e", "KBC_WORKSPACE_SCHEMA",
        "keboola/mcp-server:latest",
        "--api-url", "https://connection.YOUR_REGION.keboola.com"
      ],
      "env": {
        "KBC_STORAGE_TOKEN": "YOUR_KEBOOLA_STORAGE_TOKEN",
        "KBC_WORKSPACE_SCHEMA": "YOUR_WORKSPACE_SCHEMA"
      }
    }
  }
}
```

Cursor passes `KBC_STORAGE_TOKEN` and `KBC_WORKSPACE_SCHEMA` from its `env` block into `docker run` through the `-e` flags; `--api-url` goes straight to the `keboola/mcp-server` entrypoint.

## Run it with uv

**Goal:** run the server without Docker. You need Python 3.10+ and [`uv`](https://docs.astral.sh/uv/) installed, plus the environment variables above.

```bash
uvx keboola_mcp_server --api-url $KBC_STORAGE_API_URL
```

**Result:** the server starts and communicates over `stdio`. `--api-url` can be passed explicitly instead of relying on `KBC_STORAGE_API_URL`. To listen on a network host/port instead (Streamable HTTP on something like `localhost:8000`), pass the corresponding flags to `keboola_mcp_server`. For day-to-day use with Claude or Cursor you don't normally run this by hand — the client manages the server's lifecycle.

More about the package is in the [Keboola MCP Server repository](https://github.com/keboola/mcp-server).

## Point a client at your local instance

A manually started server listens on `stdio`, or on an HTTP port if you started it in Streamable HTTP mode:

- **`stdio` clients** — configure the client to launch the local `keboola_mcp_server` executable and talk over standard input/output.
- **Streamable HTTP clients** — connect to the host and port you started, e.g. `http://localhost:8000/mcp`. Credentials go in the server's environment variables or CLI flags (or in HTTP headers from the client) — the server no longer reads them from the URL query string.

**Example — Cursor against a local `uvx` instance:**

1. Open Cursor settings.
2. Go to the MCP section.
3. Add your Keboola project, providing `KBC_STORAGE_TOKEN`, `KBC_WORKSPACE_SCHEMA`, and the API URL.

Example `mcp_servers.json` snippet:

```json
{
  "mcpServers": {
    "keboola": {
      "command": "uvx",
      "args": [
        "keboola_mcp_server",
        "--api-url", "https://connection.YOUR_REGION.keboola.com"
      ],
      "env": {
        "KBC_STORAGE_TOKEN": "your_keboola_storage_token",
        "KBC_WORKSPACE_SCHEMA": "your_workspace_schema"
      }
    }
  }
}
```

You can load that template straight into Cursor: [![Install MCP Server using uvx](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=keboola&config=eyJjb21tYW5kIjoidXZ4IGtlYm9vbGFfbWNwX3NlcnZlciAtLWFwaS11cmwgaHR0cHM6Ly9jb25uZWN0aW9uLllPVVJfUkVHSU9OLmtlYm9vbGEuY29tIiwiZW52Ijp7IktCQ19TVE9SQUdFX1RPS0VOIjoieW91cl9rZWJvb2xhX3N0b3JhZ2VfdG9rZW4iLCJLQkNfV09SS1NQQUNFX1NDSEVNQSI6InlvdXJfd29ya3NwYWNlX3NjaGVtYSJ9fQ%3D%3D)

:::note
Tool-authorization headers (`X-Allowed-Tools` and friends) don't apply to `stdio`. Locally, the Storage token and workspace schema you pass in are what bound the server — see the [tools reference](/ai/mcp-server/tools/#restricting-tool-access).
:::

## Related

- [Connect an AI client](/ai/mcp-server/connect/) — the hosted server, no setup required.
- [kbagent CLI](/cli/) — a terminal tool for the same platform, with an organization-wide permission firewall; it can call MCP tools via `kbagent tool`.
