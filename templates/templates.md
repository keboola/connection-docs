---
title: Templates
permalink: /templates/
---

* TOC
{:toc}

Data templates are pre-defined sets of [component configurations](/components/). The individual configurations are connected 
by an [orchestration](/orchestrator/) and [metadata](/storage/tables/#metadata). Together they form a functional reusable block
that solves a specific problem. 

Keboola is a very open [platform](/overview), which may be overwhelming in many cases. 
The goal of data templates is to make the configuration of repeated (or repeatable) solutions easy. 
Although they are pre-defined sets of configurations, the created configurations have no special properties and 
can be modified like any other configuration you have [created manually](/components/#creating-component-configuration).

## Using Data Template
To use a data template, go to the **Templates** section. 

{: .image-popup}
![Screenshot - Data Templates Intro](/templates/1.png)

Search for a template that interests you, and click on it to see more details:

{: .image-popup}
![Screenshot - Data Templates Intro](/templates/2.png)

On the data template detail page you can see a detailed description and a list of all components that the template will use. 
Apply the template by clicking the **Use Template** button:

{: .image-popup}
![Screenshot - Data Templates Detail](/templates/3.png)

Name the template.

{: .image-popup}
![Screenshot - Data Templates Detail](/templates/4.png)

A list of configurations that will be created is shown. Some configurations require that you enter parameters for them – 
in this case the `Salesforce to Snowflake` configuration:

{: .image-popup}
![Screenshot - Configure Data Template](/templates/5.png)

Enter the required parameters and **Save** the configuration:

{: .image-popup}
![Screenshot - Configure Salesforce](/templates/7.png)

When all components are properly configured, you can click on **Save**; otherwise the save option won't be allowed:

{: .image-popup}
![Screenshot - Use Template when all is Configured](/templates/8.png)

When the creation is complete, you'll see the configured template. Clicking on it will show you the flow 
with all created configurations. Run the flow to see the data template in action.

{: .image-popup}
![Screenshot - Use Data Template](/templates/9.png)

## Creating Data Template
Creating your own data template is possible. You will need to install [Keboola CLI](https://developers.keboola.com/cli/). You can store template definitions locally
on your computer or in the GitHub repository. We currently support only public repositories. 

## Updating Data Template
Once your data template is configured, you can update it at any time. To edit an existing template, navigate to **Templates**, search for your template, 
and click on it. In the top menu, click **Edit Template Instance**.

{: .image-popup}
![Screenshot - Edit Template Instance](/templates/edit-template-instance.png)

Make any desired changes, and then click **Save**. This will update the specific template you've selected. Afterward, you will be redirected back 
to the Template overview. From there, you can run the template with the new configuration.

{: .image-popup}
![Screenshot - Save Configuration](/templates/save.png)
