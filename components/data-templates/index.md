---
title: Data Templates
permalink: /components/data-templates/
redirect_from:
    - /component/scaffolds/

---

* TOC
{:toc}

Data templates are pre-defined sets of [component configurations](/components/). The individual configurations are connected 
by an [orchestration](/orchestrator/) and [metadata](/storage/tables/#metadata). Together they form a functional
reusable block solving a specific problem. 

Keboola Connection is a very open [platform](/overview), which may be overwhelming in many cases. The ambition of 
data templates is to ease the configuration of repeated (or repeatable) solutions. Although they are pre-defined sets of configurations,
the created configurations have no special properties and can be modified like any other configuration
you have [created manually](/components/#creating-component-configuration).

## Using Data Template
To use a data template, go the **Components -- Data Templates** section. Search for a template that interests you, and click it to see more details:

{: .image-popup}
![Screenshot - Data Templates Intro](/components/data-templates/templates-1.png)

On the data template detail page you can see a detailed description and a list of all components the template will use. Apply the 
template by clicking the **Use This** button:

{: .image-popup}
![Screenshot - Data Templates Detail](/components/data-templates/templates-2.png)

A list of configurations that will be created is shown. Some configurations require that you enter parameters for them --
in this case the `Salesforce MRR` configuration:

{: .image-popup}
![Screenshot - Configure Data Template](/components/data-templates/templates-3.png)

Enter the required parameters and **Save** them:

{: .image-popup}
![Screenshot - Configure Salesforce](/components/data-templates/templates-4.png)

When a component is properly configured, a green check mark badge is shown next to it. When all components are properly configured,
you can **Use Data Template**:

{: .image-popup}
![Screenshot - Use Data Template](/components/data-templates/templates-5.png)

When the creation is complete, you'll see the configured template. From here, you can go to each of the created configurations,
including the orchestration. Run the orchestration to see the data template in action.

{: .image-popup}
![Screenshot - Use Data Template](/components/data-templates/templates-6.png)

## Creating Data Template
Creating your own data template is not yet generally available. If you are interested, please contact our [support](/management/support/) desk.
