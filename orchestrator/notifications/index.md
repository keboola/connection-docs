---
title: Configuration
permalink: /orchestrator/notifications/
---

* TOC
{:toc}

When an orchestration is automated, it runs without any user intervention. This means that if the orchestration fails, no one will know about it
unless you set notifications:

{: .image-popup}
![Screenshot - Orchestration Notifications](/orchestrator/notifications/orchestration-main-1.png)

Then click **Edit Notifications** and set notifications for particular situations:

{: .image-popup}
![Screenshot - Notification Details](/orchestrator/notifications/notifications.png)

Fill in an email address and press enter to add it. You can set any email address (can be user of the project or an group email for
multiple persons). Notifications can be set for situations when:

- the entire orchestration finishes with an **error** status,
- some tasks in the orchestration finish with error, so the entire orchestration orchestration finishes with a **warning** status (this requires enabled
[*Continue on error*](/orchestrator/running/) for the given tasks),
- the entire orchestration runs longer than usual --- e.g. when you set the threshold to 20% and an orchestration usually runs for 100 minutes, and it is still not finished after 120 minutes, a notification will be sent. The *usual* run length is computed as running average of the last 20 executions of the orchestration.

When an orchestration is triggered manually, only the user who triggered orchestration will receive any notifications. Therefore you
don't have to worry about spamming your colleagues with messages when running orchestrations manually.

**Important: Always set notifications for error status in scheduled production orchestrations.**
