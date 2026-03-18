---
title: Security & Privacy
slug: 'kai/security-and-privacy'
---



Kai is designed with enterprise security in mind. This page explains how your data is protected.

## Your Data

**Never used for AI training** — Keboola does not use Kai inputs to train, retrain, or fine-tune models.

**Automatically deleted:**
- Inference prompts and responses: Removed from Google within 30 seconds
- Observability logs (LangSmith, EU region): Deleted after 14 days.
  We integrate LangSmith to continuously monitor, evaluate, and improve the assistant's quality, reliability, and user experience.
    - PII and raw data content are redacted before traces are sent to LangSmith. Redaction covers names, emails, IDs, and other customer-specific values detected in either inputs or model responses.
    - Tool responses containing data are never stored.
    - Only scrubbed metadata and anonymized response summaries are stored for quality analysis.
- Your workspace data: Never leaves your Keboola project

**Encrypted everywhere:**
- In transit: TLS 1.2+
- At rest: AES-256

**Regional processing** — Data is processed primarily in your chosen cloud region, with temporary routing to Google Vertex AI for real-time inference.

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
- **Verify outputs** — AI-generated code may contain errors. Always review before deployment.

## Compliance

Kai leverages Keboola's existing security certifications:
- SOC 2 Type II
- ISO 27001
- GDPR compliant
- Regional data residency

Default AI provider (Google Vertex AI) maintains SOC 2 Type II, ISO 27001, GDPR, and HIPAA certifications.

When using BYOLLM, compliance depends on your chosen provider and commercial agreement.

## Questions?

**Questions or concerns:** [support@keboola.com](mailto:support@keboola.com)

For full details, see the [Kai AI Assistant Terms](https://www.keboola.com/ai-assistant-terms).
