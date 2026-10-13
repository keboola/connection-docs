---
title: Security & Privacy
slug: 'kai/security-and-privacy'
---



Kai is designed with enterprise security in mind. This page explains how your data is protected.

## Your Data

**Never used for AI training** — Keboola does not use Kai inputs to train, retrain, or fine-tune models. Keboola analyses de-identified usage data to improve Kai; it does not train models on your data.

**Automatically deleted:**
- Inference prompts and responses: Removed from Google within 30 seconds
- Code execution: E2B sandboxes are ephemeral and destroyed after each session; no customer data is retained
- Conversation logs: Kept by Keboola for up to 30 days, then de-identified
- Your workspace data: Never leaves your Keboola project

**Encrypted everywhere:**
- In transit: TLS 1.2+
- At rest: AES-256

**Regional processing** — Prompts and responses are processed in your project's cloud region (EU or US) via Google Vertex AI. On EU stacks all LLM inference stays in the EU. Sandboxed code execution via E2B runs in the US; sandboxes are ephemeral and retain no customer data.

## AI Provider

By default, Kai uses Google Vertex AI under Keboola's commercial agreement, which guarantees zero data retention for model training and automatic deletion after 30 seconds.

**Bring Your Own LLM (BYOLLM)** — Enterprise customers can optionally configure Kai to use their own AI provider credentials (Azure AI Foundry or Google Vertex AI). Additional providers will be available in the future. This gives you:
- Direct control over which AI provider processes your data
- Your own commercial agreements and compliance terms
- Usage billed directly to your AI provider account
- Additional control for regulated industries

Contact [support@keboola.com](mailto:support@keboola.com) to discuss BYOLLM options.

## Access & Control

**Opt-in only** — Organization Admins must explicitly enable Kai via Settings → Features.

**Can be disabled** — Organization Admins can turn off Kai for specific projects anytime.

**Action approval required** — Kai cannot modify your project without your explicit consent. You'll see exactly what will change before anything happens.

**Full audit trail** — All Kai actions are logged in your project's audit trail with organizational visibility.

**Project isolation** — Kai only sees your current project and cannot access other projects.

## Security Best Practices

- **Never paste credentials in chat** — Kai uses secure configuration forms. Tell Kai what you need, and it will prompt you securely.
- **Use development branches** — Test Kai-generated changes before merging to production.
- **Verify outputs** — Kai is an AI and can make mistakes. Check anything important before deployment.

## Compliance

Kai leverages Keboola's existing security certifications:
- SOC 2 Type II
- ISO 27001
- GDPR compliant
- Regional data residency

Default AI provider (Google Vertex AI) maintains SOC 2 Type II, ISO 27001, GDPR, and HIPAA certifications.

When using BYOLLM, compliance depends on your chosen provider and commercial agreement.

## Terms

Your use of Kai is governed by Keboola's standard terms — the [Master Software Subscription Agreement](https://www.keboola.com/software-subscription-agreement) or the [Free Plan Terms of Services](https://www.keboola.com/free-plan-terms-and-conditions) — and by the [Data Processing Agreement](https://www.keboola.com/dpa). The sub-processors engaged for Kai (Google LLC, E2B Inc.) are listed at [security.keboola.com/subprocessors](https://security.keboola.com/subprocessors).

## Questions?

**Questions or concerns:** [support@keboola.com](mailto:support@keboola.com)
