---
title: Applications
permalink: /components/applications/
redirect_from:
    - /manipulation/applications/
---

* TOC
{:toc}

Applications are without any doubt more powerful than [Transformations](/transformations/). 
They further enrich your data and add value to it in new ways. 
At the same time, they are more difficult to create. 

As **predefined blocks with set functionality**, which can be customized or parametrized to some extent, 
they can perform really advanced tasks, such as sentiment analysis, association discovery, or 
histogram grouping. They can also enhance data by calling on 3rd party services to bring in additional data 
such as Weather or Exchange Rates. 

All applications are **implemented as [components](https://developers.keboola.com/extend/)** 
and as such can be completely created by 3rd party developers. 
You can even create your own application. 
Applications can be created either for a particular end-user, or they may be offered 
to all Keboola customers; in that case they have to be registered in Keboola [Developer Portal](https://components.keboola.com/).

Applications may

- vary in terms and conditions.
- be billed extra; some are for free.
- send your data to 3rd party services outside of Keboola.
- extract data from outside sources.
- be created by you, Keboola, or third parties. 
- have support provided by their author. 

The following screenshot shows some of many Keboola applications (created by both, Keboola and 3rd parties): 

{: .image-popup}
![Keboola and 3rd parties Applications in Keboola](/components/applications/applications.png)

If you want to learn more about Applications or are interested in creating one, go to 
our [Developer Documentation](https://developers.keboola.com/extend/).

If you want to see a short **demo on using a 3rd party app in Keboola** (analyzing text data), [click here](https://www.youtube.com/watch?v=dx03hlA7dTo). 
The video shows how to quickly extract text data from Twitter's API, process the data through Geneea's
natural language processing algorithm and visualise the results in Tableau.

## Applications vs. Transformations
Application and Transformations share many common properties. However, they differ in certain important aspects.

**Shared Properties:**

- Both Transformations and Applications can be used in your orchestrations in exactly the same way.
- The code of most R and Python Transformations can be used in Applications and vice versa, with none or
very few modifications.
- The Keboola programming interfaces for Applications and Transformations are highly similar.

**Differences:**

- The code in Transformations is visible to everyone in the Keboola project. The application code can be hidden.
- The Transformation code is tied to a specific project. To share the code across different projects,
use Application.
- Transformations are versioned as changes in the configuration in the Keboola project.
Applications are versioned externally.
- Applications can be created for you by 3rd parties, with some or even no access to your Keboola project.
- There are also some [technical differences](https://developers.keboola.com/extend/custom-science/#technical-differences) between the two.

When deciding between the two, consider your capabilities, available resources and the
complexity of the task you need to perform. For more details, go to our [Developer Documentation](https://developers.keboola.com/extend/).
