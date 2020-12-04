---
title: Looker
permalink: /components/writers/bi-tools/looker/
---

* TOC
{:toc}

This writer pushes data to your Looker instance where it creates a new LookML project.
The column names are changed so that Looker can automatically understand data relations.
The writer currently uses Snowflake as its backend. 

## Configuration

To connect Keboola Connection to your Looker account, you need API credentials from Looker administration. 
The exact required steps are described in the [Looker documentation](https://docs.looker.com/reference/api-and-integration/api-auth#authentication_with_a_sdk). 
You need `Client ID` and `Client secret` to authenticate Keboola Connection with Looker. 

Create a [new **Looker writer** configuration](/components/#creating-component-configuration) in your project. 

Continue by setting up a Snowflake workspace to use with Looker. You can either supply your own or use 
a Keboola Connection generated workspace. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/01.png)

When your workspace is set up and tested, go back to the configuration. The next step is to set up your Looker credentials. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/03.png)

Fill in the client ID and the client secret you obtained from Looker. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/04.png)

Now the preparation phase is done and it's time to set up the data you want to make available to your Looker 
project. Add tables to the configuration as needed. For further information, refer 
to the [Snowflake writer documentation](/components/writers/database/snowflake/#table-configuration). 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/05.png)

Each table you add can have relations set up. For that the dependent table needs to have the primary key set up. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/06.png)

When you click "Set Foreign key", you can select to which table's primary key should the foreign key point to. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/07.png)

The column is renamed upon saving (this is required for Looker to understand the relation automatically) 
and the FK badge is shown next to it. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/08.png)

When you run the configuration, you'll see the connection name in the log. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/09.png)

In Looker, when creating a new LookML project, you select the connection name from the configuration log. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/10.png)

You're done. The LookML project with automatically created relations is prepared for you. 
