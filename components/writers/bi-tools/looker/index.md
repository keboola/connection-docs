---
title: Looker
permalink: /components/writers/bi-tools/looker/
---

* TOC
{:toc}

This writer pushes data to your Looker instance. It currently uses Snowflake as backend. In broad terms it works by creating a Connection in Looker which a new LookML project can be created. It changes the column names in a way that allows Looker to understand data relations automatically when the project is created. 

## Configuration

To connect Keboola to your Looker account you need API credentials. You can obtain them in Looker administration. Exact steps required are described in [Looker docs](https://docs.looker.com/reference/api-and-integration/api-auth#authentication_with_a_sdk). You will need `Client ID` and `Client secret` to authenticate Keboola with Looker. 

Create [new **Looker writer** configuration](/components/#creating-component-configuration) in your project. 

Continue by setting up a Snowflake workspace to use with Looker. You can either supply your own or use Keboola generated workspace. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/01.png)

When your workspace is set up and tested, go back to the configuration. Next step is to set up your Looker credentials. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/03.png)

Fill in the Client ID and Client secret you obtained from Looker. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/04.png)

Now the preparation phase is done and it's time to set up the data you want to make available to your Looker project. Add tables to the configuration as needed. For further information about tables and columns UI refer to [Snowflake writer documentation](/components/writers/database/snowflake/#table-configuration) 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/05.png)

Each table you add can have relations set up. For that the dependent table needs to have primary key set up. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/06.png)

When you click "Set Foreign key" you can select to which table's primary key should the foreign key point to. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/07.png)

When saved the column is renamed (this is required for Looker to understand the relation automatically) and FK badge is shown next to it. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/08.png)

When you run the configuration you'll see the connection name in the log. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/09.png)

In Looker when creating new LookML project, you select the connection name from  the configuration log. 

{: .image-popup}
![New configuration](/components/writers/bi-tools/looker/10.png)

You're done. New LookML project with automatically created relations is prepared for you. 
