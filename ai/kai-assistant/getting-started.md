---
title: Getting Started with Kai
permalink: /ai/kai-assistant/getting-started/
---

* TOC
{:toc}

## Access

Kai is in **Private Beta**. Contact [Keboola Support](mailto:support@keboola.com) to request access for your organization.

## Opening Kai

Click the **KAI - AI ASSISTANT** button in your project's top navigation bar.

{: .image-popup}
![Kai Chat Panel](/ai/kai-assistant/kai-welcome.png)

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

## Action Approval

When Kai wants to modify your project, you'll see a tool approval prompt. Review what Kai wants to do before approving. All actions are logged in your project's audit trail.

## Tips for New Users

- **Start with read-only operations** — explore data and configurations first
- **Be specific** — reference exact table names and component IDs
- **Use dev branches** — create a branch in the UI, then work with Kai in that branch
- **Ask for explanations** — `"Explain this SQL query step by step"`

## Rate Limits

During Private Beta: **100 messages per user per day**, free of charge.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Kai seems slow | Complex operations take time. Look for "Thinking..." indicator. |
| Kai doesn't understand | Be more specific with names and IDs. Break complex requests into steps. |
| Actions fail | Check permissions. Verify components exist. Try "retry the last action". |
| Context confused | Start a fresh chat. Keep conversations focused on one task. |

## Next Steps

- [Use Cases & Examples](/ai/kai-assistant/use-cases/)
- [Best Practices](/ai/kai-assistant/best-practices/)
