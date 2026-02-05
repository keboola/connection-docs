# Security & Privacy

When you use KAI to work with your data in Keboola, security and privacy are built in from the ground up. Here's exactly how your data is protected.

## Your Data Is Not Used for Training

**This is the most important thing to know:** Your conversations with KAI, the data you analyze, and the configurations you create are **never used to train AI models**.

KAI operates under strict commercial terms:
- **No training on customer data** - Your data stays yours
- **No sharing** - We don't use it to improve models, build profiles, or share with third parties  
- **Legally binding** - This protection is enforced by commercial API agreements with our AI providers

This applies whether you're using KAI in US or EU regions.

## Regional Data Processing

Your data is processed in your region and stays there:

**US Stacks:**
- Processed via Claude (Anthropic) on GCP US-East4
- Data remains in US throughout processing

**EU Stacks:**
- Processed via ChatGPT (OpenAI) on GCP Europe-West3
- Data remains in EU throughout processing
- GDPR compliant by design

**Azure EU:** Support in active development for customers with Azure requirements.

All regional deployments comply with local data residency and privacy regulations.

## Automatic Data Protection

KAI includes built-in safeguards to protect sensitive information:

**Anonymizing Span Processor:**
- Automatically detects and redacts personally identifiable information (PII)
- Runs before any data reaches logs or monitoring systems
- Protects customer names, emails, phone numbers, and other identifiers

**Secret Redaction:**
- Keboola secrets (passwords, API tokens, credentials) are automatically stripped from all logs
- Secrets never appear in KAI conversations or telemetry
- Zero-trust approach to credential handling

**CSV Data Sanitization:**
- Data previews are sanitized before being included in any logs
- Only metadata (table names, column names) are logged, not actual data values
- Full data remains only in your Keboola workspace

## Data Retention & Storage

**Conversation data:**
- **US (Claude):** Automatically deleted after 7 days
- **EU (ChatGPT):** Automatically deleted after 30 days
- **User control:** Delete your conversations anytime from KAI's interface
- **Workspace data:** Never leaves your Keboola project

**Audit logs:**
- Standard Keboola retention policies apply (90 days by default, configurable)
- Full audit trail for compliance requirements

**What's stored during retention period:**
- Your prompts to KAI
- KAI's responses (sanitized)
- Conversation metadata (timestamps, user IDs)
- Security monitoring signals

**What's NOT stored:**
- Raw table data (stays in your workspace)
- Database credentials (managed by Keboola's secure vault)
- PII from conversations (automatically redacted)

## How KAI Accesses Your Data

KAI is **opt-in based** - it must be explicitly enabled for your project. 

**Read Operations** (no approval needed):
- View table schemas and metadata
- Query your workspace (with result limits)
- Read component configurations
- Access documentation

**Write Operations** (require your approval):
- Creating or modifying configurations
- Running jobs or transformations
- Changing project settings
- Deleting or archiving resources

## Authentication & Authorization

**User Authentication:**
- OAuth integration with your existing Keboola credentials
- No separate login or password needed
- Secure session management via NextAuth
- Multi-factor authentication supported (via Keboola)

**Project Scoping:**
- KAI access is automatically scoped to your permitted projects
- Can't see or access projects you don't have permission for
- Respects all existing Keboola role-based access controls

**Tool Approval Process:**
- All modification actions require explicit user consent
- Real-time approval prompts before any changes
- Cancel anytime before changes are applied

## Compliance & Certifications

**AI Providers:**
- **Anthropic (US - Claude):** SOC 2 Type II, HIPAA compliant, GDPR compliant
- **OpenAI (EU - ChatGPT):** SOC 2 Type II, ISO 27001, GDPR compliant

**Keboola:**
- SOC 2 Type II certified
- ISO 27001 certified  
- GDPR compliant
- Regional data residency options
- **Penetration testing:** Regular security assessments conducted (reports available to Enterprise customers)

## Security Features

**Data Protection:**
- End-to-end encryption in transit (TLS 1.3)
- Encryption at rest for stored conversations
- No data crosses regional boundaries
- Isolated per Keboola project

**Monitoring & Logging:**
- Security event logging
- Anomaly detection
- Rate limiting per user

**Abuse Prevention:**
- Automated content policy enforcement
- Usage pattern monitoring
- Security alerting for suspicious activity

## Privacy Policy

KAI operates under:
- **Keboola Privacy Policy** - Covers overall platform data handling
- **KAI-specific addendum** - Additional privacy details for AI Assistant features
- **Supplemental documentation** - Technical details maintained in [Confluence](link)

You can review these policies at any time in [Help Center → Privacy & Security](link).

## What Happens to Flagged Content?

If KAI's automated systems detect potential misuse (e.g., attempts to generate harmful content or circumvent security):
- The interaction may be temporarily retained for security review
- Analyzed to improve abuse detection systems only
- Never used for training general AI models
- Reviewed by security team with strict confidentiality

This happens rarely and only for security purposes.

## Your Privacy Controls

**Individual controls:**
- **Enable/disable KAI** - Opt in or out anytime
- **Delete conversations** - Remove individual conversations

**Admin controls:**
- Enable/disable KAI for specific projects
- View usage across the organization
- Set rate limits (Enterprise)
- Configure retention policies (Enterprise)

## For Regulated Industries

If you work in healthcare, finance, government, or other regulated sectors:

**Available protections:**
- Regional data processing (US/EU)
- Automatic PII redaction
- Complete audit logging
- SOC 2 and ISO 27001 compliance
- GDPR and HIPAA framework support

**Enterprise options:**
- Custom data processing agreements
- Extended audit log retention
- Dedicated security reviews
- Penetration test reports

Contact your Keboola account team to discuss specific compliance requirements.

## Transparency & Trust

**What we do:**
- Protect your data with enterprise-grade security
- Process it only in your designated region
- Automatically redact sensitive information
- Give you full control and visibility
- Follow strict legal and compliance frameworks

**What we DON'T do:**
- Train AI models on your data
- Share it across regions or with third parties
- Store credentials or secrets in logs
- Process without your explicit consent (opt-in)
- Retain data longer than necessary

## Questions or Concerns?

**Security issues:**  
security@keboola.com (PGP key available)

**Privacy questions:**  
[Privacy Policy](link) | [Help Center](link)

**Compliance requirements:**  
Contact your account manager

**Report a vulnerability:**  
security@keboola.com with "[SECURITY]" in subject
