---
title: Notifications
permalink: /orchestrator/notifications/
---

* TOC
{:toc}

When an orchestration is automated, it runs without any user intervention. This means that if the orchestration fails, 
no one will know about it unless you set notifications:

{: .image-popup}
![Screenshot - Orchestration Notifications](/orchestrator/notifications/orchestration-main-1.png)

Then click **Edit Notifications** and set notifications for particular situations:

{: .image-popup}
![Screenshot - Notification Details](/orchestrator/notifications/notifications.png)

Fill in an email address and press enter to add it (repeat if you need more). It can be an email address of a user of the project 
or a group email address for multiple persons. Notifications can be set for the following situations:

- The entire orchestration finishes with an **error** status.
- Some tasks in the orchestration finish with an error, so the entire orchestration finishes with a **warning** status (this requires 
enabling [*Continue on error*](/orchestrator/running/) for the given tasks).
- The entire orchestration runs longer than usual --- e.g. when you set the threshold to 20% and an orchestration usually runs 
for 100 minutes, and it is still not finished after 120 minutes, a notification will be sent. The *usual* run length is computed as 
a running average of the last 20 executions of the orchestration.

When an orchestration is triggered manually, only the user who triggered it will receive any notifications. Therefore you
don't have to worry about spamming your colleagues with messages when running orchestrations manually.

**Important: Always set notifications for an error status in scheduled production orchestrations.**
