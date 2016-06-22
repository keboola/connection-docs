---
title: Component configurations
permalink: /storage/configurations/
---

Each KBC component (extractor, writer, ...) has configurations, which can be created through the UI. When
any configuration is saved, it is saved into Storage. When a configuration is modifed actually a new version of that
configuration is created and the old version is kept in history. Old configuration version cannot be accessed
through the UI yet, but they can be [accessed via API](http://docs.keboola.apiary.io/#reference/component-configurations/create-config). See the
developer guide for [working with configurations](https://developers.keboola.com/integrate/storage/api/configurations/).
The API also supports working [copying](http://docs.keboola.apiary.io/#reference/component-configurations/copy-configs/create-config)
and [rollbacking](http://docs.keboola.apiary.io/#reference/component-configurations/rollback-configs-versions/create-config) configurations.
Component configurations do not count towards your project quota.
