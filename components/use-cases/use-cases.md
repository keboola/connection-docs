---
title: Use Cases
permalink: /components/use-cases/
---

* TOC
{:toc}

Data templates are pre-defined sets of [component configurations](/components/). The individual configurations are connected 
by an [orchestration](/orchestrator/) and [metadata](/storage/tables/#metadata). Together they form a functional reusable block
solving a specific problem. 

Keboola Connection is a very open [platform](/overview), which may be overwhelming in many cases. 
The ambition of data templates is to ease the configuration of repeated (or repeatable) solutions. A
lthough they are pre-defined sets of configurations, the created configurations have no special properties and 
can be modified like any other configuration you have [created manually](/components/#creating-component-configuration).

## Using Data Template
To use a data template, go to the **Use Cases** section. Search for a template that interests you, and click on it to see more details:

{: .image-popup}
![Screenshot - Data Templates Intro](/components/use-cases/1.png)
![Screenshot - Data Templates Intro](/components/use-cases/2.png)

On the data template detail page you can see a detailed description and a list of all components the template will use. 
Apply the template by clicking the **+ Use Template** button:

{: .image-popup}
![Screenshot - Data Templates Detail](/components/use-cases/3.png)
![Screenshot - Data Templates Detail](/components/use-cases/4.png)

A list of configurations that will be created is shown. Some configurations require that you enter parameters for them – 
in this case the `Salesforce to Snowflake` configuration:

{: .image-popup}
![Screenshot - Configure Data Template](/components/use-cases/5.png)
![Screenshot - Configure Data Template](/components/use-cases/6.png)

Enter the required parameters and **Save** the configuration**:

{: .image-popup}
![Screenshot - Configure Salesforce](/components/use-cases/7.png)
![Screenshot - Configure Salesforce](/components/use-cases/8.png)

When all components are properly configured, you can click on **+ Save**, otherwise the save option won't be allowed:

{: .image-popup}
![Screenshot - Use Data Template](/components/data-templates/templates-5.png)

When the creation is complete, you'll see the configured template. If you click on it, you will be in a flow 
with all created configurations. Run the flow to see the data template in action.

{: .image-popup}
![Screenshot - Use Data Template](/components/use-cases/9.png)

## Creating Data Template
Creating your own data template is possible. You will need to install Keboola CLI. You can store template definitions locally
on your computer or in the GitHub repository. We currently support only public repositories, but we are preparing an update 
that will allow you to use private repositories. 
