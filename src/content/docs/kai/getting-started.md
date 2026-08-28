---
title: Getting Started with Kai
slug: 'kai/getting-started'
---



## Access

Kai is now in **Public Beta** and available to all users in supported stacks.

### Enabling Kai

Every user can see the Kai button in their project (on supported stacks). To enable Kai:

- **Organization Admins** — Can enable the feature directly from the chat screen when first clicking the Kai button
- **Other users** — Need to ask their Organization Admin to enable the feature, or [contact Keboola Support](mailto:support@keboola.com) for assistance
- **Settings** — Kai can also be enabled via **Settings → Features** in your project

## Opening Kai

Click the **Kai Agent** button in your project's top bar, or use keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| **A** | Open the chat window (shows recent conversation) |
| **Ctrl + Shift + A** | Open a new chat |

![Kai open in a project](/kai/kai-open.png)

## Example Prompts

**Explore your project:**
- "What tables do we have in this project?"
- "Show me the latest job runs and their status"
- "What extractors are configured?"

**Analyze data:**
- "Show me the schema for the orders table"
- "How many rows are in the customers table?"

**Debug issues:**
- "Analyze the latest failed job and tell me what went wrong"

**Build things:**
- "Help me create a Google Sheets extractor"
- "Create a SQL transformation that calculates monthly totals from my sales data"

For prompts that get better answers, see
[Effective Prompting](/kai/best-practices/#effective-prompting) in Best Practices.

## Action Approval

Before Kai changes anything, it requests your approval: creating a configuration,
modifying a transformation, or running a job. Read-only operations do not require
approval.

Each request shows the exact parameters Kai will use.

![Kai asking for approval before running a job](/kai/kai-action-approval.png)

You have three options:

- **Approve** — run this action once.
- **Decline** — do not run it.
- **Always allow** — run it, and stop asking for that tool in future.

All actions are logged in your project's audit trail.

For more granular control, see [Tool Permissions](/kai/settings/#tool-permissions) in
Kai Settings.

## Chat Controls

The chat panel has controls in two places: along the top of the panel, and below the
message box.

### Panel header

| Button | Control | What it does |
|--------|---------|--------------|
| ![New chat](/kai/kai-new-chat.png) | **New chat** | Start a fresh conversation. Kai keeps no context from the previous one. |
| ![Report a bug](/kai/kai-report-bug.png) | **Report a bug** | Collect debug details for the current conversation, including the chat ID, trace link, project and stack. Include them when you report a problem so Keboola support can investigate. |
| ![Settings](/kai/kai-settings-gear.png) | **Settings** | Open your [Tool Permissions and System Instructions](/kai/settings/). These are personal to you and apply to this project only. Project-wide settings live in **Settings → Kai Agent**. |
| ![Expand](/kai/kai-expand-chat.png) | **Expand** | Widen the panel. The expanded view also lists your chat history, so you can reopen a previous conversation. Useful when Kai returns a long table or diagram. |
| ![Close](/kai/kai-close-chat.png) | **Close** | Close the panel. Your conversation is kept. |

### Below the message box

| Button | Control | What it does |
|--------|---------|--------------|
| ![Upload file](/kai/kai-upload-file.png) | **Upload files** | Attach a file or image to your message. Useful for a screenshot of an error, a sample CSV, or a spec you want Kai to work from. |
| ![Plan mode](/kai/kai-plan-mode.png) | **Plan mode** | Kai explores your project read-only, drafts a plan of what it intends to do, and waits for your approval before changing anything. Use it for larger requests, such as setting up a pipeline or restructuring a set of transformations. You can also start it by typing `/plan`. |
| ![Follow mode](/kai/kai-follow-mode.png) | **Follow mode** | Your browser navigates along as Kai works, so you can watch what it reads and modifies. Toggle it on or off at any time. |

## Contextual Awareness

Kai is aware of what you're currently viewing in the Keboola UI. Every message you send
includes your current page location, so Kai understands your context without needing
explicit references.

- **Automatic context capture** — When you send a message, Kai receives your current URL path (e.g., which configuration, job, or table you're viewing)
- **Context-aware responses** — Kai uses this information to provide relevant suggestions and can reference "this configuration" or "the current job" naturally
- **Dynamic updates** — Kai checks for the latest context during conversations, so you can navigate to different pages and Kai will adapt

This means you can say "analyze this job" while viewing a job, and Kai knows exactly
which job you mean. Turn on [Follow mode](#below-the-message-box) to watch it move through your project as
it works.

## Tips for New Users

- **Start with read-only operations** — explore data and configurations first
- **Be specific** — reference exact table names and component IDs
- **Use dev branches** — create a branch in the UI, then work with Kai in that branch
- **Ask for explanations** — `"Explain this SQL query step by step"`
- **Don't type secrets in chat** — Kai uses secure forms for credentials. When setting up extractors or connections, tell Kai what you need and it will prompt you through secure configuration interfaces

## Rate Limits

**Kai is free during the public beta period.**

Each user receives **150 turns (messages) per month per project** on contracted plans. The limit resets at the beginning of each calendar month.

- **Pay-As-You-Go (PAYG) plans** have a lower limit of **50 messages per user per month**
- Your current usage is displayed in the chat interface
- Need more? [Contact Keboola Support](mailto:support@keboola.com) to discuss custom limits for your project

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Kai seems slow | Complex operations take time. Look for "Thinking..." indicator. |
| Kai doesn't understand | Be more specific with names and IDs. Break complex requests into steps. |
| Actions fail | Check permissions. Verify components exist. Try "retry the last action". |
| Context confused | Start a fresh chat. Keep conversations focused on one task. |

## Next Steps

- [Kai Settings](/kai/settings/) — Configure Tool Permissions and System Instructions
- [Use Cases & Examples](/kai/use-cases/)
- [Best Practices](/kai/best-practices/)
