---
title: Kai Technical Details
permalink: /ai/kai-assistant/technical/
---

* TOC
{:toc}

This page provides technical information about Kai's architecture, security, deployment, and integration details for developers, administrators, and technical decision-makers.

## Architecture Overview

### Core Infrastructure

**Backend Application**
- **Framework**: Next.js application
- **Hosting**: Keboola's own infrastructure (originally Vercel, now self-hosted)
- **Database**: MySQL for conversation history, user data, and messages
- **Language Model**: Claude Sonnet 4.5 via Google Vertex AI (not direct Anthropic API)

**Authentication & Access**
- **Authentication**: NextAuth with OAuth integration
- **Authorization**: Seamless integration with Keboola project permissions
- **Context Awareness**: Understands user's current project location and state

### Model Context Protocol (MCP) Integration

Kai leverages Keboola's MCP Server to access project data and execute operations:

- **Tool Definitions**: Approximately 25,000 tokens of tool definitions in system prompt
- **Transport Protocols**: Supports both SSE and Streamable-HTTP transports
- **Capabilities**: Full read-write access to Keboola components, storage, and configurations

### API Endpoints

**Primary Endpoints**
- **Chat API**: `/api/chat` - Streaming responses for conversations
- **Vote API**: `/api/vote` - User feedback collection (thumbs up/down)
- **Documentation**: Available at `https://kai-assistant.keboola.com/api/docs/ui`

## Security & Privacy

### Data Protection

**PII and Sensitive Data Handling**
- **Anonymizing Span Processor**: Automatically redacts personally identifiable information
- **Secret Redaction**: Keboola secrets (passwords, API tokens) are stripped from logs
- **CSV Data Sanitization**: Data previews are sanitized before logging
- **No Training Data Usage**: Your data is never used to train public AI models

**Regional Data Processing**
- **US Stacks**: Processed via GCP US-East4
- **EU Stacks**: Processed via GCP Europe-West3
- **Azure EU**: Support in active development
- **Data Residency**: Complies with GDPR and regional requirements

### Authentication & Authorization

**User Authentication**
- **OAuth Integration**: Seamless sign-on with existing Keboola credentials
- **Session Management**: Secure session handling via NextAuth
- **Project Scoping**: Access automatically scoped to user's permitted projects

**Action Authorization**
- **Tool Approval Process**: All modification actions require explicit user consent
- **Granular Permissions**: Respects existing Keboola project permissions
- **Audit Trail**: Complete logging of all agent actions

### Privacy Policy

- **Dedicated Privacy Policy**: Specific coverage for AI Assistant beta service
- **Supplemental Documentation**: Additional privacy details maintained in Confluence
- **Penetration Testing**: Security assessments in progress

## Observability & Monitoring

### LangSmith Integration

**Tracing and Analytics**
- **OpenTelemetry**: Complete trace collection via OpenTelemetry integration
- **LangSmith**: Traces flow into LangSmith for analysis and debugging
- **Telemetry Data**: Integrated with general platform telemetry tables

**Privacy Protection in Monitoring**
- **Anonymizing Processor**: PII redaction before traces are sent
- **Selective Logging**: Job IDs preserved for telemetry while protecting sensitive data
- **User Attribution**: Proper user/project attribution for organizational visibility

### Additional Monitoring

**Current Systems**
- **DataDog Integration**: Being explored for enhanced monitoring
- **User Feedback**: Thumbs up/down collection for continuous improvement
- **Performance Metrics**: Token usage and response time tracking

**Audit and Compliance**
- **Complete Audit Trail**: All agent actions logged for organization administrators
- **Organizational Visibility**: Full transparency for governance and oversight
- **Compliance Reporting**: Support for regulatory and internal audit requirements

## Deployment & Infrastructure

### Current Deployment Status

**Production Stacks**
- **GCP US-East4**: Fully deployed and operational
- **GCP Europe-West3**: Fully deployed and operational
- **Azure/AWS Modules**: Deployment in progress

**Feature Flag Control**
- **Flag Name**: `agent-chat`
- **Scope**: Organization-level enablement
- **Access**: Private Beta with approval required

### Scalability & Performance

**Performance Considerations**
- **Context Window**: Approximately 25,000 tokens for MCP tool definitions
- **Startup Time**: Optimization ongoing for faster response times
- **Token Usage**: Active cost optimization through prompt caching and reduction strategies

**Rate Limiting**
- **Beta Limits**: 100 messages per user per day
- **Cost Management**: Rate limiting helps manage costs during beta phase
- **Future Scaling**: Monitoring usage patterns for production scaling

## Integration Ecosystem

### Keboola Platform Integration

**Core Component Access**
- **Storage**: Direct access via Storage API for data queries and metadata
- **Components**: Create, modify, and manage extractors, writers, and applications
- **Flows**: Build and manage conditional flows and orchestrations
- **Transformations**: Full support for SQL, Python, R, and other transformation types
- **Data Apps**: Create and deploy Streamlit applications with live data connections

**MCP Server Connectivity**
- **Shared Technology**: Leverages same toolset as external MCP server
- **Enhanced Integration**: Deep platform integration provides additional capabilities
- **Tool Availability**: Access to full suite of Keboola management tools

### External Tool Comparison

**Advantages Over Standalone MCP Server**
- **No Installation**: Embedded directly with authentication in place
- **Deep Context**: Understanding of current project location and state
- **Secure Secrets**: Safe credential management through chat interface
- **Audit Trail**: Complete organizational visibility
- **Team Collaboration**: Knowledge democratization with governance

## Development & Maintenance

### Current Development Focus

**Infrastructure Improvements**
- **Multi-Model Support**: Planning integration with GPT-4 and GPT-5
- **Performance Optimization**: Reducing startup times and token usage
- **Enhanced UI/UX**: Better chat history management and action confirmation flows

**Feature Development**
- **Conditional Flows Integration**: Enhanced flow creation and management
- **Job Polling**: Improved handling of long-running operations
- **Web Search**: Integration of external information capabilities
- **Secrets Handling**: Enhanced security for credential management

### Technical Challenges

**Current Challenges**
- **Token Management**: Large MCP tool definitions impact cost and performance
- **Context Management**: Long conversations can exceed context limits
- **Multi-Tool Approval**: Handling multiple tool calls in single messages
- **Error Communication**: Improving clarity when operations fail

**Ongoing Solutions**
- **Prompt Caching**: Reducing repeated context loading
- **SDK Upgrades**: Moving to Vercel AI SDK v6 for better tool handling
- **APM Integration**: Enhanced monitoring and debugging capabilities

## Cost Management

### Current Costs and Optimization

**Beta Period Costs**
- **Current Spend**: Exceeding $1,000/month in GCP for Claude Sonnet usage
- **Optimization Results**: Achieved ~40% reduction in input token consumption
- **Future Targets**: Additional cost reductions through caching and optimization

**Cost Control Measures**
- **Rate Limiting**: 100 messages/user/day during beta
- **Token Optimization**: Tabular formatting and response structure improvements
- **Prompt Caching**: Implementation of caching strategies

### Future Pricing Model

**Beta Approach**
- **Free Access**: No charge during Private Beta period
- **Usage Monitoring**: Collecting data for future pricing model development
- **Cost Transparency**: Active monitoring and optimization of underlying costs

## API Documentation

### Swagger Documentation

Complete API documentation is available at:
`https://kai-assistant.keboola.com/api/docs/ui`

### Integration Points

**Chat Interface**
- **Streaming Responses**: Real-time conversation handling
- **Tool Approval**: Interactive confirmation of actions
- **Context Management**: Conversation history and state management

**Feedback System**
- **User Ratings**: Thumbs up/down feedback collection
- **Quality Improvement**: Feedback integration for system enhancement

## Support & Troubleshooting

### Technical Support Channels

**Internal Support**
- **Keboola Support**: For access requests and technical issues
- **Development Team**: Active daily development and issue resolution
- **Community**: Slack channel `#feature-kai-in-platform-assistant`

### Common Technical Issues

**Performance Issues**
- **Slow Responses**: Complex operations may require extended processing time
- **Context Limits**: Long conversations may hit context window limits
- **Tool Failures**: Occasional API timeouts or temporary platform issues

**Resolution Strategies**
- **Fresh Conversations**: Start new chats for unrelated topics
- **Specific References**: Use component IDs and exact names for clarity
- **Retry Mechanisms**: Ask Kai to retry failed actions

### Monitoring and Diagnostics

**Available Diagnostics**
- **LangSmith Traces**: Complete conversation and tool execution traces
- **Audit Logs**: All modification actions logged with timestamps
- **Performance Metrics**: Response times and token usage tracking

## Future Roadmap

### Planned Enhancements

**Technical Improvements**
- **Multi-Model Support**: Integration with additional AI models
- **Enhanced Performance**: Continued optimization of response times and costs
- **Improved UI**: Better user experience for complex workflows
- **Advanced Monitoring**: Enhanced observability and debugging capabilities

**Feature Expansion**
- **Public Beta**: Broader availability planned for Q1 2026
- **Enhanced Integration**: Deeper platform integration and capabilities
- **Advanced Analytics**: More sophisticated data analysis capabilities

### Long-Term Vision

The technical roadmap aims to position Kai as a comprehensive mediator of the Keboola platform, enabling users to accomplish complex data engineering tasks through natural conversation while maintaining enterprise-grade security, governance, and auditability.
