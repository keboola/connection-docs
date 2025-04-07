---
title: Notifications
permalink: /management/notifications/
---

* TOC
{:toc}

# Keboola Notifications Guide

Notifications in Keboola can be set up at various levels — from individual jobs and flows within a project to organization-wide credit usage. This guide outlines all available notification types, when to use them, and how to configure them. Notifications help you stay informed about the status of orchestrations, flows, jobs, and credit consumption — either via **email** or **webhooks**.

---

## Overview of Notification Types

### 1. Orchestration Notifications
- Notify users about [Orchestration](/orchestrator/notifications/) results: success, warning, or failure.  
- Can be configured for specific scenarios such as manual triggers or errors.  

#### How to Configure
- When an orchestration is automated, it runs without any user intervention. This means that if the orchestration fails, no one will know about it unless you set notifications:

{: .image-popup}
![Screenshot - Orchestration Notifications](/management/notifications/orchestration-main-1.png)

Then click **Edit Notifications** and set notifications for particular situations:

{: .image-popup}
![Screenshot - Notification Details](/management/notifications/orch-notifications.png)

You can:
- Enter **email addresses** (individual or group).
- Enter a **webhook URL** to trigger an external system.

Notifications can be sent when:
- The orchestration finishes with an **error**.
- Some tasks fail and the orchestration finishes with a **warning** (requires [*Continue on Error*](/orchestrator/running/)).
- The orchestration takes significantly longer than usual. --- e.g., when you set the threshold to 20% and an orchestration usually runs 
for 100 minutes but it is still not finished after 120 minutes, a notification will be sent. The *usual* run length is computed as a running average of the last 20 executions of the orchestration.

**Note:** When triggered manually, only the user who started the orchestration receives the notification.

***Important:** Notifications are not supported in development branches. Always set error status notifications for scheduled production orchestrations.*
  
### 2. Flow Notifications
- Alert users about the success, warning, or failure of Flows. Flow notifications are only for the flow as a whole (not per-component).  
- Notifications can be sent to individuals or group email addresses.  

#### How to Configure
From the **Notifications** tab in a Flow:
- Select one or more project users.
- Enter other email addresses or webhook URLs.

{: .image-popup}
![Set Up Notifications](/management/notifications/flow-notifications.png)

Notifications can be sent when:
- The flow completes successfully.
- The flow completes with warnings.
- The flow fails with an error.
- The job runs longer than expected.

Once everything is configured, the flow will automatically run at the scheduled time. Alternatively, you can run the entire flow manually by clicking **Run Flow**.

### 3. Job Notifications
- Receive updates about success or failure of individual component jobs. Job Notifications might be especially helpful if you need a notification on status of a specific component within a more complex flow.

#### How to Configure
Open a component configuration and go to the **Notifications** tab:
- Enter email addresses or webhook URLs.
- Works similarly to Flow notifications.

Use this to monitor specific transformations, data loads, or other components individually.

### 4. Credit Consumption Notifications
- Send alerts when credit usage crosses a threshold.
- **Email notifications only**, configured at the **organization level**.
- **Only email notifications are supported** — webhook delivery is **not available** for this type.
- More info: [Telemetry Email Notifications](/management/telemetry/#email-notifications).

## Webhook Notifications
Keboola supports webhook notifications alongside email. This allows real-time alerting in monitoring, logging, or incident tools like **DataDog**, **Opsgenie**, or your internal systems.

### How It Works

- **Webhook Setup:** Add a webhook URL in the Notifications tab of any Flow, Job, or Orchestration.
- **Payload Format:** JSON via HTTP `POST` request with `application/json` content-type.
- **Simple Integration:** No custom headers or payload transformations at this stage.
- **Timeout & Retry:** 5-second timeout, **no retries** — ensure your endpoint is reliable.

### Supported For
- Orchestration notifications  
- Flow notifications  
- Job notifications 

{: .image-popup}
![Webhook Setup UI](/management/notifications/webhook-notification.png)

#### Example Payload

```json
{
  "job": {
    "id": "113939672",
    "url": "https://connection.north-europe.azure.keboola.com/admin/projects/20570/queue/113939672",
    "tasks": [],
    "endTime": "2025-04-02T11:14:33+00:00",
    "component": {
      "id": "keboola.orchestrator",
      "name": "Orchestrator"
    },
    "startTime": "2025-04-02T11:13:39+00:00",
    "configuration": {
      "id": "113939398",
      "name": "Example flow"
    }
  },
  "branch": {
    "id": "277810"
  },
  "project": {
    "id": "20570",
    "name": "Example project"
  },
  "eventType": "job-succeeded"
}
```
## Best Practices

1. Use **group email addresses** for notifications to ensure team-wide awareness of critical issues.  
2. Always configure error notifications for **production orchestrations/flows** to avoid missing failures.  
3. Schedule flows during **off-peak hours** to minimize resource contention and optimize performance.
4. Set up **webhook endpoints** to track jobs in external systems. 

