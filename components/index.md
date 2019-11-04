---
title: Components
permalink: /components/
---

In Keboola Connection platform most of the data processing functions are implemented in **Components**. 
Components are divided into three main categories:

- [**Extractors**](/components/extractors/) -- used to bring data into a Keboola Connection project
- [**Writers**](/components/writers/) -- used to send processed data into a target system
- [**Applications**](/components/applications/) -- used for complex data processing.

All components, regardless of their category, behave the same way. To use the component, you have to 
create a **Configuration** first. A configuration is used to set the necessary parameters for each 
component (e.g. credentials and other specification of what to do). A configuration can then be run
-- which creates a **Job** and does the actual work.
