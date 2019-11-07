---
title: Components
permalink: /components/
---

In the Keboola Connection platform, most of the data processing functions are implemented in **Components**. 
Components are divided into three main categories:

- [**Extractors**](/components/extractors/) -- bring data into a Keboola Connection project.
- [**Writers**](/components/writers/) -- send processed data into a target system.
- [**Applications**](/components/applications/) -- process complex data.

All components, regardless of their category, behave the same way. To use a component, you have to 
create a **configuration** first. A configuration is used to set the necessary parameters for each 
component (e.g., credentials and other specification of what to do). Then it can be run
--- a **Job** is created and does the actual work.

## Creating Component Configuration
To create a new component configuration, select *Components* from the top navigation and then select one of the
component categories (extractor, writer, or application):

{: .image-popup}
![Screenshot - Create Configuration](/components/configuration-1.png)

The following page shows a list of the currently existing configurations (extractors in this example)
in the project. To create a new configuration of a new component, 
use the **Directory** or the **Add New Extractor** button.

{: .image-popup}
![Screenshot - Extractors List](/components/configuration-2.png)

Use the search field to find the component you want to use and click the component tile to 
add a new component (Currency Rates extractor in this case):

{: .image-popup}
![Screenshot - Search Component](/components/configuration-3.png)

The following page describes in detail what the component does and allows you to create a new configuration 
using the **New Configuration** button.

{: .image-popup}
![Screenshot - Component Detail](/components/configuration-4.png)

In the dialog, enter a name for the configuration. If a component has a single configuration in your project, 
the name is not that important. However, for components with multiple configurations 
(e.g., configured with different credentials) 
the names should meaningfully distinguish one configuration from another.

{: .image-popup}
![Screenshot - Create Configuration](/components/configuration-5.png)

The next page shows a form for configuring the component, this varies heavily between different components.
Component configuration can range from trivial (as in the case of the 
[Currency extractor](/components/extractors/other/currency-rates/)) to very complex
ones (e.g., [Adwords extractor](/components/extractors/marketing-sales/google-adwords-reports/)). The configuration
complexity badge shown in the component list gives you a rough idea of what to expect.

{: .image-popup}
![Screenshot - Set Parameters](/components/configuration-6.png)

When you set the parameters and **Save** them, you can actually run the component using the **Run Component** button:

{: .image-popup}
![Screenshot - Run Configuration](/components/configuration-7.png)

When you run a component, a [Job](/management/jobs/) is created and subsequently executed. The right panel shows the last executed jobs
with an indication of their status:

- yellow -- running
- red -- failed
- green -- successful

You can click each job to view its [details](/management/jobs/), including the tables it reads from your project and 
the tables it produced in your project.

## Configuration Versions
Configuration parameters can be changed at any time. Every change to a configuration is recorded 
in the history of **versions**. You can also change the name and description of the configuration at any time. 
The configuration description supports rich text formatting using [Markdown](https://ghost.org/blog/markdown/).

{: .image-popup}
![Screenshot - Configuration Name and Description](/components/configuration-13.png)

The bottom right panel shows a list of the configuration versions. To see their full list, use the links. 
The version list is complete and allows you to compare adjacent versions or revert to any previous version.

{: .image-popup}
![Screenshot - Version List](/components/configuration-8.png)

When you compare two versions, a difference of the raw JSON configurations is shown. 

{: .image-popup}
![Screenshot - Version Differences](/components/configuration-9.png)

When you rollback a configuration, a new version is created. This means that you never lose any version of
a configuration and there is always an option to get back to it. Configuration versions are also created when 
the configurations are manipulated programmatically using [the API](https://developers.keboola.com/overview/api/).

{: .image-popup}
![Screenshot - Configuration Rollback](/components/configuration-10.png)

You can also use the version list to create a **Copy of the configuration**:

{: .image-popup}
![Screenshot - Configuration Copy](/components/configuration-11.png)

You can customize the name of the configuration copy:

{: .image-popup}
![Screenshot - Configuration Create Copy](/components/configuration-12.png)

The copy of the configuration is created as a new isolated configuration -- i.e., there is no link 
between the original configuration and the copy, and the changes to one have no effect on the other.
