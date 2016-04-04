---
title: Data Manipulation
permalink: /manipulation/
---

Data Manipulation in KBC is split between two tools - **Transformations** and **Applications**. Transformations are freeform
manipulation scripts written in either SQL (for either MySQL, Redshift or Snowflake backend), 
[R](https://www.r-project.org/about.html) or [Python](https://www.python.org/about/). **Applications** on the other hand
represent predefined blocks with set functionality which can be customized or parameterized to some extend.

Choosing between Transformations and Applications chould be based on your capabilities, available resources and on the 
complexity of the task you need to perform. Both transformations and applications can be used in your orchestrations in 
exactly the same way. Also if you need to create very complex transformations, or you need a 3rd to develop 
transformations/applications for you, you should have a look at 
[Custom Science](http://developers.keboola.com/extend/custom-science/)   
