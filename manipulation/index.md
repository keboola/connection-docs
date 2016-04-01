---
title: Manipulation
permalink: /manipulation/
---

{%comment %}
z /overview/:

upravit a odkazovat na subpages:

### Transformations
*Transformations* are the first part of data manipulation. The transformation engine is tasked with modifying the data in Storage.
It picks data from Storage, manipulates it and then stores it back. Transformations can be created by writing a free-form script in
[SQL](https://en.wikipedia.org/wiki/SQL) (MysQL, Redshift), [R](https://www.r-project.org/about.html) and
[Python](https://www.python.org/about/).

### Recipes (Applications)
Recipes and *Applications* form the second part of data manipulation. Applications allow you to enrich the data in Storage.  Unlike the free-form Transformations, these are predefined blocks which can be used to do some pretty
advanced stuff like sentiment analysis, association discovery, or histogram grouping.
Applications can also augment data (for example, adding Weather or Exchange Rates). They actually call on *3rd party services* to bring in additional data. Applications can also be completely created by 3rd party developers - KBC is a very open environment.



## Applications
[Data Manipulations]() in KBC is usualy done with [Transformations](). If the data transformations are going to be reused in multiple projects, or if they are considerably complex they should be converted to [Applications](). Applications share many common properties with transformations. The main difference is that Applications do not allow direct modification of the transformation code (SQL, R), rather they do contain some predefined transformation code (logic) which can be modified to some extent by creating *Application Configuration*.


co vsechno muze byt manipulace, zminit specificky odkaz na custom science ?
{% endcomment %}