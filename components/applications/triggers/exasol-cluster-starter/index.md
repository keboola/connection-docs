---
title: Exasol Cluster Starter
permalink: /components/applications/triggers/exasol-cluster-starter/
redirect_from:
    - /triggers/exasol-cluster-starter/
---

* TOC
{:toc}
  
The Exasol Cluster starter is used for starting and stopping [Exasol Cloud](https://cloud.exasol.com) clusters.

## Create New Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Exasol Cluster Starter** Application.
Then fill in your Personal Access token, your Account ID, the host of the cluster that you wish to start/stop, and select the 
action you wish to perform on the cluster; either **Start** or **Stop**. Then save the configuration and run it.

{: .image-popup}
![Exasol CLuster Starter - Configuration](/components/applications/triggers/exasol-cluster-starter/exas_config.png)

## Getting a Personal Access Token

You can get a Personal Access Token for authorization by going to the cluster you wish to start, clicking the three dots
on the right of the cluster name, clicking **Connect via tools** and going to the 3rd step. 
There you can generate a Personal Access Token and also view the host of the cluster.

## Functionality notes

If the cluster you wish to start is not the main cluster of the database, the application will first start the main cluster and after 
that the cluster that you entered. This is necessary as the main cluster must be started before you start any other clusters.

If any errors occur while starting a cluster please contact Exasol support.
