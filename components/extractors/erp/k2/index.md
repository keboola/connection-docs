---
title: K2
permalink: /components/extractors/erp/k2/
---

* TOC
{:toc}

K2 is an ERP information system for managing production, inventory, financials, and more.
This component fetches defined data objects from the K2 API.

## Authorization Configuration

[Create a new configuration](/components/#creating-component-configuration) of the **K2** data source connector.
Once you have a new configuration of the K2 component, start by authorizing the component. To authorize the component
open the K2 authorization configuration settings.

{: .image-popup}
![Screenshot - Authorization](/components/extractors/erp/k2/open_auth.png)

In the Authorization settings, fill in the following items:

* Username for K2
* Password for K2
* Service name; specification of the concrete API service, which you want to use
* Use SSH; if checked SSH setting opens up, and SSH tunnels will be used for connections
* Source Url; the root address of API. For example http://mujserver.cz

{: .image-popup}
![Screenshot - Authorization](/components/extractors/erp/k2/auth_config.png)

Once all these settings are set click save and you can create a
new [Configuration row](https://help.keboola.com/components/#configuration-rows)
by clicking the **Add row** button.

## SSH Tunnel Configuration

If you need to use an SSH Tunnel for connection, check the Use SSH check box and fill in the SSH settings.

{: .image-popup}
![Screenshot - Authorization](/components/extractors/erp/k2/ssh_config.png)

In the SSH settings, fill in the following items:

* Username; The SSH User for connecting to your SSH server
* Private Key; The base64-encoded private key for the key pair associated with your SSH server
* Tunnel Host; the host name or host IP associated with your SSH server (Note: Don't use the load balancer as host)
* Remote Address; the address that is used to query the K2 API e.g. k2api.myfirm.cz
* Remote Port; The port of the K2 API e.g. 8080

Once all are filled in click **save**.

## Row configuration

In the row configuration fill in the name of the **Data object** (classname) that you want to fetch. You can optionally fill
in the **Fields** that you wish to fetch, if left empty all the fields are fetched. The fields should be separated
by a comma. After this, you can fill in **Conditions** on what data to fetch. These conditions, and how to construct them are explained
in the [K2 documentation](https://help.k2.cz/k2gaia/02/en/10023272.htm#o57577).

{: .image-popup}
![Screenshot - Authorization](/components/extractors/erp/k2/config_row.png)

You can configure each row of the component to fetch data in either Full load mode or Incremental load mode in the **Load type** parameter. 
If set to Incremental load, the result tables will be updated based on the primary keys and new records will be fetched. 
Full load overwrites the destination table each time.

When setting Incremental load you need to fill in 3 extra parameters. The **Incremental field** is the K2 Object 
that should be used for incremental fetching, which is most commonly "TimeStamp". The **Date from** field should be filled in 
with the date from which you wish to fetch data from using the incremental field; either exact date in YYYY-MM-DD format, 
relative date e.g. 3 days ago, or "last run" to fetch data since last run. The **Date to** field should be filled in 
with the date to which you wish to fetch data from using the incremental field, it can be filled in with the exact and
relative dates just like **Date from**, but in most cases will be filled in with "now" which means that the component 
will fetch the data up to the current time of the component run

{: .image-popup}
![Screenshot - Authorization](/components/extractors/erp/k2/incremental_fetching.png)