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
- See [Orchestration Notifications](/orchestrator/notifications/)

- When an orchestration is automated, it runs without any user intervention. This means that if the orchestration fails, 
no one will know about it unless you set notifications:

{: .image-popup}
![Screenshot - Orchestration Notifications](/management/notifications/orchestration-main-1.png)

Then click **Edit Notifications** and set notifications for particular situations:

{: .image-popup}
![Screenshot - Notification Details](/management/notifications/orch-notifications.png)

Fill in an email address and press enter to add it (repeat if you need more). It can be an email address of a user of the project 
or a group email address for multiple persons. Notifications can be set for the following situations:

- The entire orchestration finishes with an **error** status.
- Some tasks in the orchestration finish with an error, so the entire orchestration finishes with a **warning** status (this requires 
enabling [*Continue on error*](/orchestrator/running/) for the given tasks).
- The entire orchestration runs longer than usual --- e.g., when you set the threshold to 20% and an orchestration usually runs 
for 100 minutes but it is still not finished after 120 minutes, a notification will be sent. The *usual* run length is computed as 
a running average of the last 20 executions of the orchestration.

When an orchestration is triggered manually, only the user who triggered it will receive any notifications. You
don't have to worry about spamming your colleagues with messages when running orchestrations manually.

***Important:** Notifications are not supported in development branches. Always set error status notifications for scheduled production orchestrations.*
  
### 2. Flow Notifications
- Alert users about the success, warning, or failure of Flows.  
- Notifications can be sent to individuals or group email addresses.  
- Learn more in the [Flow Notifications section](/flows/#set-up-notifications).

Once your pipeline or workflow is complete, you may not need to manage it actively every day. Stay on top of your flow's performance by setting up notifications for errors or long run times. From the drop-down 
list of the project users in the **Notifications** tab, you can select (a) project user(s) who will receive the notification, or you can enter another email address. However, consider using a group email to keep 
the whole team informed and responsive to any issues.

You can set up an email notification to the following situations: 

- The flow finishes successfully.
- The flow finishes with warnings.  
- The flow fails with an error message.
- The job process takes longer than usual. 

{: .image-popup}
![Set Up Notifications](/management/flow-notifications.png)

Once everything is configured, the flow will automatically run at the scheduled time. Alternatively, you can run the entire flow manually by clicking **Run Flow**.

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

