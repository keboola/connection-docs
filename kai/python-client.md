---
title: Kai Python Client
permalink: /kai/python-client/
---

* TOC
{:toc}

The [Kai Python Client](https://github.com/keboola/kai-client) is an official Python library for interacting with the Kai API programmatically. It provides async support, SSE streaming, a command-line interface, and comprehensive type safety through Pydantic models.

## Features

- **Command-line interface** for quick interactions without writing code
- **Async/await support** using `httpx`
- **Server-Sent Events (SSE) streaming** for real-time chat responses
- **Type-safe models** with Pydantic v2
- **Comprehensive error handling** with custom exception classes
- **Session management** for chat conversations
- **Full API coverage** including chat, history, and voting endpoints

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

## Usage Examples

### Simple Chat (Non-Streaming)

```python
async with KaiClient(
    storage_api_token="your-master-token",
    storage_api_url="https://connection.keboola.com"
) as client:
    chat_id, response = await client.chat("What is 2 + 2?")
    print(response)
```

### Continuing a Conversation

```python
async with KaiClient(
    storage_api_token="your-master-token",
    storage_api_url="https://connection.keboola.com"
) as client:
    chat_id = client.new_chat_id()

    # First message
    async for event in client.send_message(chat_id, "Hello!"):
        if event.type == "text":
            print(event.text, end="")
    print()

    # Continue the conversation (reuse same chat_id)
    async for event in client.send_message(chat_id, "What did I just say?"):
        if event.type == "text":
            print(event.text, end="")
    print()
```

### Handling Tool Calls

```python
async with KaiClient(
    storage_api_token="your-master-token",
    storage_api_url="https://connection.keboola.com"
) as client:
    chat_id = client.new_chat_id()

    async for event in client.send_message(chat_id, "List my Keboola tables"):
        match event.type:
            case "text":
                print(event.text, end="")
            case "tool-call":
                if event.state == "input-available":
                    print(f"\n[Calling {event.tool_name} with {event.input}]")
                elif event.state == "output-available":
                    print(f"\n[{event.tool_name} returned: {event.output}]")
            case "finish":
                print(f"\n[Done: {event.finish_reason}]")
```

### Tool Approval for Write Operations

Some tools require explicit approval before execution. The server sends a `tool-approval-request` event with an `approval_id` that you use to approve or reject.

```python
from kai_client import KaiClient

async with KaiClient(
    storage_api_token="your-master-token",
    storage_api_url="https://connection.keboola.com"
) as client:
    chat_id = client.new_chat_id()
    pending_approval_id = None

    async for event in client.send_message(chat_id, "Create a new bucket"):
        if event.type == "tool-approval-request":
            pending_approval_id = event.approval_id

    # Approve the pending tool
    if pending_approval_id:
        async for event in client.approve_tool(
            chat_id=chat_id,
            approval_id=pending_approval_id,
        ):
            if event.type == "text":
                print(event.text, end="")
```

### Error Handling

```python
from kai_client import (
    KaiClient,
    KaiError,
    KaiAuthenticationError,
    KaiRateLimitError,
    KaiNotFoundError,
)

async with KaiClient(
    storage_api_token="your-master-token",
    storage_api_url="https://connection.keboola.com"
) as client:
    try:
        async for event in client.send_message("chat-id", "Hello"):
            print(event)
    except KaiAuthenticationError:
        print("Authentication failed")
    except KaiRateLimitError:
        print("Rate limited, try again later")
    except KaiNotFoundError:
        print("Chat not found")
    except KaiError as e:
        print(f"API error: {e.code} - {e.message}")
```

## Use Cases

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

### Integrating Kai into Data Apps

The Kai Python Client can be embedded into Keboola [Data Apps](/data-apps/) to provide AI-powered chat interfaces for your end users.

#### Streamlit Data Apps

The [kai-streamlit plugin](https://github.com/keboola/kai-client/tree/main/plugins/kai-streamlit) provides patterns and working code for building [Streamlit Data Apps](/data-apps/streamlit/) with an integrated Kai chat interface. It handles the async bridge between Streamlit's synchronous model and the KaiClient's async API, streaming responses into Streamlit containers, tool approval flows with interactive Approve/Deny buttons, and session state management across Streamlit reruns.

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

#### Python/JS Data Apps

Support for integrating Kai into [Python/JS Data Apps](/data-apps/python-js/) is coming soon. A dedicated plugin will be available to simplify embedding Kai chat into custom Python and JavaScript-based data applications.

## Resources

- [GitHub Repository](https://github.com/keboola/kai-client)
- [PyPI Package](https://pypi.org/project/kai-client/)
- [Kai Documentation](/kai/)
