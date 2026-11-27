---
title: Kai Python Client
lastUpdated: 2026-11-26
description: 'Install and use the Kai Python Client, an async library and command-line tool for the Kai API, and integrate Kai into apps or use it with Claude Code.'
slug: 'kai/python-client'
---



The [Kai Python Client](https://github.com/keboola/kai-client) is an official Python library for interacting with the Kai API programmatically. It provides async support, SSE streaming, a command-line interface, and comprehensive type safety through Pydantic models.

## Features

- **Command-line interface** for quick interactions without writing code
- **Real-time streaming** — see responses as they arrive
- **Conversation management** — maintain context across multiple messages
- **Tool approval flows** — review and approve Kai actions programmatically
- **Full API coverage** — chat, history, and feedback

## Installation

### Using uv (recommended)

```bash
uv add kai-client
```

### Using pip

```bash
pip install kai-client
```

## Prerequisites

The Kai Python Client requires a [Master Token](/management/project/tokens/#master-tokens) to authenticate with the Keboola API. Standard tokens with limited permissions will not work. You can create a Master Token in your project's **Settings → API Tokens**.

## Quick Start

```python
import asyncio
from kai_client import KaiClient

async def main():
    # Auto-discover the Kai API URL from your Keboola stack
    client = await KaiClient.from_storage_api(
        storage_api_token="your-master-token",
        storage_api_url="https://connection.keboola.com"  # Your stack URL
    )

    async with client:
        # Start a new chat
        chat_id = client.new_chat_id()

        # Send a message and stream the response
        async for event in client.send_message(chat_id, "What tables do I have?"):
            if event.type == "text":
                print(event.text, end="", flush=True)
            elif event.type == "tool-call":
                print(f"\n[Calling tool: {event.tool_name}]")
            elif event.type == "finish":
                print(f"\n[Finished: {event.finish_reason}]")

asyncio.run(main())
```

## Command-Line Interface

The package includes a `kai` CLI for quick interactions without writing code.

### Setup

Set your credentials as environment variables:

```bash
export STORAGE_API_TOKEN="your-master-token"
export STORAGE_API_URL="https://connection.keboola.com"
```

### Commands

```bash
kai ping                          # Check server health
kai info                          # Show server version and info
kai chat                          # Start an interactive chat session
kai chat -m "List my tables"      # Send a single message
kai chat --auto-approve -m "..."  # Auto-approve tool calls
kai history                       # View recent chat history
kai get-chat <chat-id>            # Get full chat details
kai delete-chat <chat-id>         # Delete a chat
```

In interactive mode, type your messages and press Enter. Type `exit`, `quit`, or press Ctrl+C to end.

**Tool approval:** When Kai calls a write tool (e.g., `update_descriptions`, `run_job`, `create_config`), the CLI pauses and asks you to approve or deny. Use `--auto-approve` to skip this prompt.

For more usage examples (non-streaming chat, conversations, tool calls, tool approval, error handling), see the [client README](https://github.com/keboola/kai-client#readme).

## Use Cases

### Integrating Kai into Apps

The Kai Python Client can be embedded into Keboola [Apps](/data-apps/) to provide AI-powered chat interfaces for your end users.

**Important:** Use the app's own Kai token, not the app's built-in `KBC_TOKEN`, which Kai refuses. Turn on **Kai in the app** and the platform puts a read-only Kai token in `KAI_STORAGE_API_TOKEN` at each deploy; send the app's `WORKSPACE_ID` as the `x-workspace-id` header with it. A personal token in a [secret](/data-apps/reference/#secrets) gives every visitor of the app that member's access, writes included, so keep it for local development.

Every visitor of an app is the same Kai user. Let visitors decline Kai's actions, never approve them.

#### Python/JS Apps

For a Python/JS app with a React frontend and a Node backend, use the ready-made chat instead of the client: see [Add a Kai chat to your app](/data-apps/kai-chat/). For a Python backend, the app-building skill's [Kai integration reference](https://github.com/keboola/ai-kit/blob/main/plugins/dataapp-developer/skills/dataapp-development/references/kai-integration.md) describes the HTTP API.

#### Streamlit Apps

The [kai-streamlit plugin](https://github.com/keboola/kai-client/tree/main/plugins/kai-streamlit) provides patterns and working code for building [Streamlit Apps](/data-apps/streamlit/) with an integrated Kai chat interface. It handles the async bridge between Streamlit's synchronous model and the KaiClient's async API, streaming responses into Streamlit containers, tool approval flows, and session state management across Streamlit reruns. In an app, decline tool approvals and Kai's questions rather than showing Approve buttons to visitors.

To get started, install the dependencies:

```bash
pip install kai-client streamlit
```

Then use the `run_async` bridge pattern to call KaiClient from Streamlit:

```python
import asyncio
from kai_client import KaiClient

def run_async(coro):
    """Run an async coroutine from sync Streamlit code."""
    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()
```

See the [plugin repository](https://github.com/keboola/kai-client/tree/main/plugins/kai-streamlit) for a complete working example with streaming, tool approval, and suggested action buttons.

### Kai via CLI with Claude Code

The [kai-cli plugin](https://github.com/keboola/kai-client/tree/main/plugins/kai-cli) lets AI coding assistants like [Claude Code](https://claude.com/claude-code) interact with your Keboola project through the Kai CLI. Install the plugin to give Claude the ability to query data, manage configurations, run jobs, and troubleshoot issues — all through natural language in your terminal.

#### Installation

Download the plugin to your Claude Code plugins directory:

```bash
mkdir -p ~/.claude/plugins

curl -L https://github.com/keboola/kai-client/archive/refs/heads/main.tar.gz | \
  tar -xz --strip-components=2 -C ~/.claude/plugins kai-client-main/plugins/kai-cli
```

Or clone and link for development:

```bash
git clone https://github.com/keboola/kai-client.git
ln -s "$(pwd)/kai-client/plugins/kai-cli" ~/.claude/plugins/kai-cli
```

Once installed, ask Claude to "use kai" or "help me with kai cli" to activate the skill. Claude can then run `kai chat`, `kai history`, `kai ping`, and other CLI commands on your behalf.

## Resources

- [GitHub Repository](https://github.com/keboola/kai-client)
- [PyPI Package](https://pypi.org/project/kai-client/)
- [Kai Documentation](/kai/)
