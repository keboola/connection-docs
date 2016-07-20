---
title: Component Configurations
permalink: /storage/configurations/
---

Each KBC component (extractor, writer, etc.) has configurations, which can be created through the UI. 

All configurations are saved into Storage. When a configuration is modified, its new version is created and the old version is kept in history. Old configuration versions cannot be accessed
through the UI yet, but they can be [accessed via API](http://docs.keboola.apiary.io/#reference/component-configurations/create-config). 
See the [developer guide](https://developers.keboola.com/integrate/storage/api/configurations/) for working with configurations.

The API also supports [copying](http://docs.keboola.apiary.io/#reference/component-configurations/copy-configs/create-config)
and [rollbacking](http://docs.keboola.apiary.io/#reference/component-configurations/rollback-configs-versions/create-config) configurations.

Component configurations do not count towards your project quota.
