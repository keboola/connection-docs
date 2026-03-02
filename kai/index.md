---
title: Kai - AI Assistant
permalink: /kai/
---

* TOC
{:toc}

Kai is Keboola's embedded AI assistant—a context-aware data engineering co-pilot that understands your project's transformations, flows, table schemas, and jobs.

## What Kai Can Do

**Analytics & Exploration** — Query databases, explore schemas, calculate metrics, and analyze trends.

**Integration Setup** — Configure extractors, destinations, and custom components. Manage authentication and packages.

**Coding** — Write and optimize SQL/Python transformations. Convert between languages.

**Troubleshooting** — Debug job failures, resolve configuration errors, and investigate data quality issues.

**Documentation** — Generate project documentation, update table descriptions, and create onboarding materials.

**Data Modeling** — Build analytical frameworks, dimensional models, and complex data structures.

## Why Use Kai?

**Context-aware** — Unlike generic AI tools, Kai reads your actual job logs, configurations, and data structures to provide specific solutions.

**No setup required** — Built into Keboola, already authenticated, understands your current location.

**Data engineering focus** — Deep knowledge of Keboola components, transformations, and best practices.

## Kai vs. MCP Server

| Feature | Kai | [MCP Server](/ai/mcp-server/) |
|---------|-----|------------------------------|
| **Best for** | Browser workflows, team collaboration | IDE integration, local development |
| **Setup** | None | Requires external tool configuration |
| **Audit trail** | Full organizational visibility | Local only |

## Getting Started

Kai is now in **Public Beta** and available to all users. Look for the **KAI** button in your project's navigation bar.

- **Organization Admins** can enable Kai directly from the chat screen
- **Other users** can request access from their Organization Admin or [contact Keboola Support](mailto:support@keboola.com)
- You can also enable Kai via **Settings → Features**

[Get Started with Kai →](/kai/getting-started/)

## Learn More

- [Use Cases & Examples](/kai/use-cases/)
- [Best Practices](/kai/best-practices/)

## Security & Governance

Kai is designed with enterprise security in mind:

- **No model training on your data** — Keboola does not use Kai inputs to train, retrain, or fine-tune models.
- **Encryption** — Data is encrypted in transit (TLS 1.2+) and at rest (AES-256).
- **Prompt data deletion** — Inference prompts and responses are removed from Google within 30 seconds and from LangSmith within 14 days.
- **Regional processing** — Data is processed primarily in your chosen cloud region, with temporary routing to Vertex AI for real-time inference.
- **Full audit trail** — All Kai actions are logged in your project's audit trail with full organizational visibility.
- **Action approval** — Kai requires explicit user approval before modifying your project. Review every tool approval before confirming.
- **Secure credential handling** — Kai uses secure configuration forms for credentials and secrets—never type passwords or API keys directly in chat.
- **Project isolation** — Kai only sees your current project and cannot access data from other projects.

AI-generated outputs are provided on an as-is basis and may be inaccurate or incomplete. Always verify outputs before acting on them.

For full details, see the [Kai AI Assistant Terms](https://www.keboola.com/ai-assistant-terms).

## Support

Use the thumbs up/down buttons in the chat to provide feedback, or contact [Keboola Support](mailto:support@keboola.com) for access requests and technical issues.
