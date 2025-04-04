---
title: Notifications
permalink: /management/notifications/
---

* TOC
{:toc}

# Keboola Notifications Guide

This page serves as on overview of the options to setup up and manage notifications at various sections of the Keboola platform. Notifications help ensure users stay informed about the status of orchestrations, flows, jobs, and credit consumption. Below is a summary of notification types with links to detailed configuration guides.

---

## Overview of Notification Types

### 1. Orchestration Notifications
- Notify users about orchestration results: success, warning, or failure.  
- Can be configured for specific scenarios such as manual triggers or errors.  
- See [Orchestration Notifications](/orchestrator/notifications/) for details.
  
### 2. Flow Notifications
- Alert users about the success, warning, or failure of Flows.  
- Notifications can be sent to individuals or group email addresses.  
- Learn more in the [Flow Notifications section](/flows/#set-up-notifications).

### 3. Job Notifications
- You can set notifications for individual component jobs to get updates on job success or failure.  
- Open any component configuration and go to the **Notifications** tab to set this up.

### 4. Credit Consumption Notifications
- Send alerts when credit usage exceeds predefined thresholds.  
- Configured at the organization level.  
- More info: [Telemetry Email Notifications](/management/telemetry/#email-notifications).


## Best Practices

1. Use group email addresses for notifications to ensure team-wide awareness of critical issues.  
2. Always configure error notifications for production orchestrations/flows to avoid missing failures.  
3. Schedule flows during off-peak hours to minimize resource contention and optimize performance.  

