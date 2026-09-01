---
title: Getting Started with Kai
slug: 'kai/getting-started'
---



## Access

Kai is now in **Public Beta** and available to all users in supported stacks.

### Enabling Kai

Every user can see the Kai button in their project (on supported stacks). To enable Kai:

- **Organization Admins** can enable the feature directly from the chat screen when first clicking the Kai button.
- **Other users** need to ask their Organization Admin to enable the feature, or [contact Keboola Support](mailto:support@keboola.com) for assistance.
- Kai can also be enabled via **Settings → Features** in your project.

## Opening Kai

Click the **Kai Agent** button in your project's top bar, or use keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| **A** | Open the chat window (shows recent conversation) |
| **Shift + A** | Open a new chat |

![Kai open in a project](/kai/kai-open.png)

## Example Prompts

**Get oriented in an unfamiliar project:**
- "What is the purpose of this project? Summarize what it does end to end."
- "What data is being ingested, from which sources, and how often?"
- "What output tables does this project produce, and what feeds each one?"
- "Trace the lineage from the raw source tables to the final output tables."

**Understand a specific part of it:**
- "Explain what this transformation does and why the joins are shaped this way."
- "Which configurations write to the `orders` table, and which read from it?"
- "Is anything here unused? Tables nothing reads, configurations nothing runs."

**Debug a failure:**
- "Analyze the latest failed job and tell me what went wrong."
- "This flow started failing last week. What changed in its configuration?"
- "Why did this job take 40 minutes when it usually takes 5?"

**Maintain and improve:**
- "Help me optimize the core pipeline to reduce costs."
- "Which jobs in this project run longest, and what would you change first?"
- "This transformation full-loads every run. Can it be incremental?"

**Build something new:**
- "Set up a Google Sheets extractor for this spreadsheet and load it into a new bucket."
- "Create a SQL transformation that calculates monthly revenue per customer from `orders`."
- "Build an integration with the Acme API that pulls orders. Its API documentation is
  attached. Handle authentication and pagination."

Building an integration for an API that has no ready-made connector is one of the stronger
things to hand Kai. For security reasons Kai cannot open links, so give it the API
documentation as a file:
attach it with [Upload files](#below-the-message-box), or add it as a
[context file](/kai/settings/#context-files) if you will be working with that API
repeatedly. A URL on its own is not enough unless the API is well known.

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

## Plan Mode

For anything bigger than a single change — setting up a pipeline, restructuring a set of
transformations — start in plan mode. Kai explores your project read-only, then shows you what it
intends to do and waits. Nothing changes until you approve.

Turn it on with the **Plan mode** button below the message box, or type `/plan` in your message.
They do the same thing; the button just inserts the command for you. `/plan` works anywhere in a
sentence, so "help me /plan a revenue model" is a valid plan-mode prompt.

When Kai finishes exploring, it presents the plan as a card with three choices:

- **Approve** — Kai leaves plan mode and starts working. Shortcut: **Cmd/Ctrl + Enter**.
- **Request changes** — say what is wrong and Kai revises the plan, staying in plan mode.
- **Dismiss** — close the plan and do nothing.

Prefer **Request changes** over dismissing. Kai keeps everything it learned while exploring, so
revising a plan costs far less than starting over.

The message box is hidden while a plan card is waiting, so resolve the card before you carry on
chatting. Resolving it also switches plan mode back off for you, unless you requested changes — in
that case it stays on, because Kai is still planning.

## When Kai Asks You a Question

When Kai needs a decision from you — which tables to model, which of two approaches to take — it
asks with clickable options instead of a paragraph of prose. Pick one and Kai carries on.

- Some questions take **more than one answer**; select as many as apply.
- Every question has a free-text **Other** field, so you are never limited to the options offered.
- Questions can arrive as a short series, one step at a time.
- You can skip a question and let Kai decide.

## Chat Controls

The chat panel has controls in two places: along the top of the panel, and below the
message box.

### Panel header

| Button | Control | What it does |
|--------|---------|--------------|
| ![New chat](/kai/kai-new-chat.png) | **New chat** | Start a fresh conversation. Kai keeps no context from the previous one. |
| ![Report a bug](/kai/kai-report-bug.png) | **Report a bug** | Open a dialog that sends a support ticket for the current conversation, already filled in with the details Keboola support needs, such as the conversation ID. You can also copy those details instead of sending the ticket. |
| ![Settings](/kai/kai-settings-gear.png) | **Settings** | Open your [Tool Permissions and System Instructions](/kai/settings/). These are personal to you and apply to this project only. Project-wide settings live in **Settings → Kai Agent**. |
| ![Expand](/kai/kai-expand-chat.png) | **Expand** | Widen the panel. The expanded view also lists your chat history, so you can reopen a previous conversation. Useful when Kai returns a long table or diagram. |
| ![Close](/kai/kai-close-chat.png) | **Close** | Close the panel. Your conversation is kept. |

### Below the message box

| Button | Control | What it does |
|--------|---------|--------------|
| ![Upload file](/kai/kai-upload-file.png) | **Upload files** | Attach a file or image to your message — a screenshot of an error, a sample CSV, a spec, or documentation Kai has no other way to read. See [Attaching files](#attaching-files). |
| ![Plan mode](/kai/kai-plan-mode.png) | **Plan mode** | Kai explores your project read-only, drafts a plan, and waits for your approval before changing anything. See [Plan Mode](#plan-mode). |
| ![Follow mode](/kai/kai-follow-mode.png) | **Follow mode** | Your browser navigates along as Kai works, so you can watch what it reads and modifies. Toggle it on or off at any time. |

### Attaching files

Use **Upload files**, or drag and drop or paste straight into the chat. You can attach several
files at once. What happens next depends on the file type.

**CSV, TSV, and `.gz` files become Storage tables.** Kai opens the table-creation dialog and loads
the file into the `in.c-uploads-from-Kai` bucket, creating that bucket the first time. Kai then
works with the table, so the data is queryable like anything else in your project and outlives the
conversation.

**Every other file is attached to the conversation.** It is uploaded to your project's
[File Storage](/storage/files/) and restored each time you return to that chat, so you can refer
back to something you attached much earlier in the same conversation. Images and PDFs are read
directly by Kai, so a screenshot of a failing job or a PDF spec works as well as plain text.

Since Kai cannot open links, a file is how you hand it anything that lives on the web. For
documentation you will reuse across conversations, add a
[context file](/kai/settings/#context-files) instead of attaching it every time.

Two limits are worth knowing:

- **10 MB per file.** Anything larger is skipped.
- Attachments are stored as non-permanent files, so they are **deleted after 15 days**, like any
  other non-permanent file in Storage. Reopen an older chat and Kai no longer has them.

## Slash Commands

Type `/` in the message box to open a searchable menu. It lists the three built-in commands below
plus any [skill files](/kai/settings/#skill-files) uploaded to your project, each with a
description, so you can find what is available without memorizing names.

| Command | What it does |
|---------|--------------|
| `/plan` | Turn on [plan mode](#plan-mode) for this message. The same as the Plan mode button. |
| `/compact` | Summarize the conversation so far and continue from that summary. See below. |
| `/feedback` | Report a bug or send feedback. By default Kai copies the debug details Keboola support needs — conversation ID, project, stack — to your clipboard. Ask it to "open a ticket" and it opens the support form with those details filled in instead, the same form as the **Report a bug** button in the panel header. |

### Compacting a long conversation

Kai works from a limited amount of conversation at a time. When a chat gets long, `/compact`
replaces the earlier turns with a summary so there is room to keep going. Kai also compacts on its
own when a conversation grows too long, without you asking.

**Your messages stay on screen, and that is intended.** Compaction adds a *Conversation compacted.*
line to the transcript and removes nothing above it — the transcript stays a full record of what
happened. What changes is what Kai is working from: past that line, Kai reads a summary of the
earlier conversation rather than the messages themselves. So a detail you can still scroll up and
read is not necessarily a detail Kai still has.

Anything you type after the command steers the summary, which is worth doing when you know what
matters:

```
/compact keep the column mapping we worked out for the orders table
```

Compaction cannot be undone, so name what you need before you run it. For when to compact rather
than start a new chat, see [Manage Context](/kai/best-practices/#manage-context) in Best Practices.

## Contextual Awareness

Kai is aware of what you're currently viewing in the Keboola UI. Every message you send
includes your current page location, so Kai understands your context without needing
explicit references.

- **Automatic context capture** — When you send a message, Kai receives your current URL path (e.g., which configuration, job, or table you're viewing)
- **Context-aware responses** — Kai uses this information to provide relevant suggestions and can reference "this configuration" or "the current job" naturally

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
