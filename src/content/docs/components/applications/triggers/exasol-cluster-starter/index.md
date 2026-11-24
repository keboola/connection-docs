---
title: Exasol Cluster Starter
lastUpdated: 2026-11-19
description: 'Start or stop an Exasol Cloud cluster from Keboola: get a personal access token and the cluster host, then create the configuration.'
slug: 'components/applications/triggers/exasol-cluster-starter'
---



The Exasol Cluster starter is used for starting and stopping [Exasol Cloud](https://cloud.exasol.com) clusters.

<!-- How-to-type page. Type declared in the 2026-11-19 section rework; the content is unchanged and was not re-checked against the component. -->

## Getting a Personal Access Token

**Goal:** create the Personal Access Token that the application uses for authorization.

You can get a Personal Access Token for authorization by going to top right side of cloud.exasol.com and clicking the icon with your initials.

![Exasol CLuster Starter - Getting a token pt1](/components/applications/triggers/exasol-cluster-starter/go_to_icon.png)

Then click **Personal access tokens**. 

![Exasol CLuster Starter - Getting a token pt2](/components/applications/triggers/exasol-cluster-starter/go_to_pat.png)

Once on the Personal access token site, click **Create token**.

![Exasol CLuster Starter - Getting a token pt3](/components/applications/triggers/exasol-cluster-starter/pat_screen.png)

Fill in the Token name with a descriptive name, select the **use & operate scope for Database**, click **Generate**. 

![Exasol CLuster Starter - Getting a token pt4](/components/applications/triggers/exasol-cluster-starter/filled_in_token_settings.png)

Now just save the token to a secure location or just to the component configuration.

![Exasol CLuster Starter - Getting a token pt4](/components/applications/triggers/exasol-cluster-starter/token_generated.png)

**Result:** you have a token with the **use & operate scope for Database** to enter in the configuration.

## Getting the cluster host

**Goal:** find the host of the cluster to start or stop.

You can get the host of the cluster you wish to start by clicking the three dots
on the right of the cluster name, clicking **Connect via tools** and going to the 3rd step. 
There you can see the host of the cluster.

**Result:** you have the host to enter in the configuration.

## Create New Configuration

**Goal:** start or stop an Exasol Cloud cluster from Keboola.

[Create a new configuration](/components/configurations/#create-a-configuration) of the **Exasol Cluster Starter** Application.
Then fill in your Personal Access token, your Account ID, the host of the cluster that you wish to start/stop, and select the 
action you wish to perform on the cluster; either **Start** or **Stop**. Then save the configuration and run it.

![Exasol CLuster Starter - Configuration](/components/applications/triggers/exasol-cluster-starter/exas_config.png)

**Result:** when the configuration runs, the cluster starts or stops, as you selected.

### Functionality notes

If the cluster you wish to start is not the main cluster of the database, the application will first start the main cluster and after 
that the cluster that you entered. This is necessary as the main cluster must be started before you start any other clusters.

If any errors occur while starting a cluster please contact Exasol support.
