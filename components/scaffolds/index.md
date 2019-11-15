---
title: Scaffolds
permalink: /components/scaffolds/
---

* TOC
{:toc}

Scaffolds are pre-defined sets of [component configurations](/components/). The individual configurations are connected 
together by an [Orchestration](/orchestrator/) and [Metadata](/storage/tables/#metadata). Together they form a functional
reusable block solving a specific problem. 

Keboola Connection is a very open [platform](/overview) which may be overwhelming in many cases. The ambition of 
scaffolds is to ease the configuration of repeated (or repeatable) solutions. Although they are pre-defined sets of configurations,
the created configurations have no special properties and can be modified like any other configuration
you have [created manually](/components/#creating-component-configuration).

## Using a Scaffold
To use a scaffold, go the **Components -- Scaffolds** section. Search for a scaffold that interests you, and click the scaffold to see more details:

{: .image-popup}
![Screenshot - Scaffolds Intro](/components/scaffolds/scaffolds-1.png)

On the scaffold detail page you can see detailed description and list of the components that the scaffold will use. Apply the 
scaffold by clicking the **Use this** button:

{: .image-popup}
![Screenshot - Scaffolds Detail](/components/scaffolds/scaffolds-2.png)

A list of configurations that will be created is shown. Some configurations require that you enter parameters for them --
in this case the `Salesforce MRR` configuration:

{: .image-popup}
![Screenshot - Configure Scaffold](/components/scaffolds/scaffolds-3.png)

Enter the required parameters and **Save** them:

{: .image-popup}
![Screenshot - Configure Salesforce](/components/scaffolds/scaffolds-4.png)

When a component is properly configured, a green check mark badge is shown next to it. When all components are properly configured,
you can **Use scaffold**:

{: .image-popup}
![Screenshot - Use Scaffold](/components/scaffolds/scaffolds-5.png)

When the creation is complete, you'll see the configured scaffold. From here, you can go to each of the created configurations or
including the orchestration. Run the orchestration, to see the scaffold in action.

{: .image-popup}
![Screenshot - Use Scaffold](/components/scaffolds/scaffolds-6.png)

## Creating a Scaffold
Creating your own scaffolds is not yet generally available. If you are interested, please contact us through [support](/management/support/).
