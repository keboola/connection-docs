---
title: Change management
permalink: /change-management/
---

* TOC
{:toc}

Keboola Connection already allows change management by the means of [configuration versioning](/components/#configuration-versions). That allows you to rollback any changes to any configuration. This however 
works only on one configuration at a time. That does not help you when you need to test multiple dependent changes 
to the data pipeline. This is now solved by **development branches functionality**.

## Private Beta Warning
Development/Production Mode is currently in private beta. Some features may not work as expected. Please bear with us while we polish all necessities. Any feedback is welcome at [https://ideas.keboola.com](https://ideas.keboola.com).

## What are development branches?

Development branches in Keboola Connection are like branches in version control systems. They allow you to 
make changes to configurations without affecting your production data pipelines. Also, when component running in development branch writes data to [storage](/storage)
a separate bucket is used. Your production data are not overwritten or changed in any way. You can propagate the changes from your development branch to production when you complete and test them. 

### Components

When you create a development branch, you have all your component configuration available in that branch. When you update a configuration, new version is created in the branch, but the production version of the configuration remains the same. 

### Storage

#### Write

When a component in development branch writes data to storage, the bucket name stored in [input mapping](/transformations/mappings/#table-input-mapping) is dynamically changed by prefixing the branches internal ID. That means that your production bucket will not be overwritten. 

#### Read

When a component in development branch reads data from storage, it first checks if there is a development version of the production bucket. If there is one, it uses it. If development bucket does not exist, it reads the data from production bucket. That way you don't need to re-run all your data extraction jobs in a development branch. 

### Operations outside Keboola Connection

Some components, like writers, can write to a destination that is outside of Keboola Connection. Those components' configs are first marked as *unsafe* in development branch. 

You will not be able to run an unsafe config. You need to first observe the config and verify that it's either OK to write to the destination, or change the destination accordingly.
