---
title: Orchestrator (Automation)
permalink: /orchestrator/
---

*See our tutorial on [how to set up Orchestrator](/tutorial/automate/) for your project.*

Bringing systems for data loading, manipulation and writing together is what makes Keboola 
Connection (KBC) so powerful and easy to use. If you want to work with the latest data available, 
however, all the steps must be done over and over again. Our Orchestrator (or Scheduler) is the 
behind-the-scenes component which **allows your large and complex projects to be fully automated**. 
Use it to

- Specify **what tasks** should be executed in **what order** (orchestration), and
- Configure their **automatic execution** (scheduling) to run in specified intervals 
or at specified times of the day. 

Every change to your entry data will **automatically propagate up** to your visualisation project or projects. 

### Orchestration Phases
The order of certain tasks in the Orchestrator configuration is important; some of them must run 
sequentially while others can run in parallel. This is the reason for using **orchestration phases**.
Tasks in a single phase are executed in parallel, phases execute sequentially. With each task in its own 
phase, a configuration is very defensive as it executes all tasks sequentially. You can also group tasks 
into their own phases based on their component type and follow the common ETL scheme. 

### Notifications
Before setting up your orchestration to run automatically at a given time, we recommend running it 
manually to make sure everything works smoothly. Also, consider setting **Notifications** to be sent to 
selected email addresses (error notifications are particularly useful). When an orchestration is run 
manually, only the KBC user running it gets the notifications.

### Own Automation
If you are not happy with our scheduling, feel free to [create your own orchestration programmatically](https://developers.keboola.com/).

{%comment %}

best practices jak skladat veci k sobe, dos a don'ts
jak delat nested orchestrace, jak udelat ekvivalent transformacnich fazi (ale ten pojem uz vubec nezminovat)

{%endcomment %}

