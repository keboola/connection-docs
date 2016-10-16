---
title: Data Manipulation
permalink: /manipulation/
---

There are two ways how data in KBC can be manipulated: via *Transformations* (simpler) and *Applications* 
(not as simple but more powerful). Both pick data from Storage, manipulate it and then store it back.

- **Transformations** --- can be created by writing a free-form manipulation scripts in either SQL 
(for MySQL, Redshift or Snowflake backend), [R](https://www.r-project.org/about.html), 
or [Python](https://www.python.org/about/). 
KBC provides each user with Sandbox --- a safe environment for your experiments.

- **Applications** --- Unlike the free-form Transformations, Applications are predefined blocks 
which can be used to do some pretty advanced stuff like sentiment analysis, association discovery, 
or histogram grouping. Applications can also augment data (for example, add Weather or Exchange Rates) 
by calling on 3rd party services to bring in additional data. Their functionality can be customized 
or parametrized to some extent. All applications are implemented as extensions and as such can be 
completely created by 3rd party developers. 

## Applications vs. Transformations
Application and Transformations share many common properties. However, they differ in certain important aspects.

**Shared Properties:**

- Both Transformations and Applications can be used in your orchestrations in exactly the same way. 
- The code of most R and Python Transformations can be used in Applications and vice versa with none or 
very few modifications. 
- The KBC programming interfaces for Applications and Transformations are highly similar.

**Differences:**

- The code in Transformations is visible to everyone in the KBC project. The application code can be hidden.
- The Transformation code is tied to a specific project. To share the code across different projects, 
use Application.
- Transformations are versioned as changes in the configuration in the KBC project. 
Applications are versioned externally.
- Applications can be created for you by 3rd parties, with some or even no access to your KBC project.
- There are also some [technical differences](https://developers.keboola.com/extend/custom-science/#technical-differences) between the two.


When deciding between the two, consider your capabilities, available resources and the
complexity of the task you need to perform. For more details, go to our [Developer Documentation](https://developers.keboola.com/extend/).
