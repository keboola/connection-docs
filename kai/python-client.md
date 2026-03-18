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

## Resources

- [GitHub Repository](https://github.com/keboola/kai-client)
- [PyPI Package](https://pypi.org/project/kai-client/)
- [Kai Documentation](/kai/)
