---
title: Integration
slug: 'integrate'
---

You can look at Keboola as a system of independent and loosely coupled microservices (components). 

Each microservice has its own code base, and a publicly accessible API and configuration.
We do not cheat or have any advantage over other developers; our UI and other components use only these public APIs.

As a result, it is very easy to, for example, write custom scripts to bootstrap a project, or do something that our UI does not offer.
Let's have a look into this!

One of the very important components is [Storage](/storage/api/), which not only stores all data in a 
project, but also provides additional functions such as managing other components and their configurations. 
When you are integrating your systems with Keboola, **chances are that you want to start with [Storage](/storage/api/)**.

<!-- 
 
 - gdwriter

  - Storage
    - API
    - Curl
    - Commandline
  - Transformation
    - API
    - IO Mapping
    - Sandbox
  - Extractors
    - ...
  - Writers
-->