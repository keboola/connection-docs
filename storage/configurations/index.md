---
title: Component Configurations
permalink: /storage/configurations/
---

Each KBC component (extractor, writer, etc.) has configurations, which can be created through the UI.

All configurations are saved into Storage. When a configuration is modified, its new version is created and the old version
is kept in history. You can see configuration version in (nearly) all details of component configurations:

{: .image-popup}
![Screenshot -- Storage Configurations](/storage/configurations/configurations-intro.png)

The version with green tick-mark is the **active** version. When you run the configuration, the active version will be used.
Clicking on any of the versions will take you to version management page.

{: .image-popup}
![Screenshot -- Storage Configurations](/storage/configurations/versions-intro.png)

In the version management page you can:
- copy any version
- compare any two successive versions
- rollback to an older version

All of the operations can be [accessed via API](http://docs.keboola.apiary.io/#reference/component-configurations/create-config).
See the [developer guide](https://developers.keboola.com/integrate/storage/api/configurations/) for working with configurations.

Component configurations do not count towards your project quota.

## Copy Configuration
You can copy any configuration version to a new configuration by clicking on the copy button next to the selected configuration:

{: .image-popup}
![Screenshot -- Copy Start](/storage/configurations/copy-1.png)

Provide a new name of the configuration:

{: .image-popup}
![Screenshot -- Copy Name Configuration](/storage/configurations/copy-2.png)

Once the configuration is created, you can navigate to it using the bread-crumbs navigation:

{: .image-popup}
![Screenshot -- Copy Name Configuration](/storage/configurations/copy-3.png)

The new configuration is completely independent on the old one. You may modify or delete either of them without affecting the other one.

## Compare Versions
You can compare two consecutive versions and see the modifications as [diff](https://en.wikipedia.org/wiki/Data_comparison) of
the raw [JSON](https://en.wikipedia.org/wiki/JSON) configuration. Each component tries to automatically generate description
for the change, so the following version change the *level / level* sheet in the Google drive configuration:

{: .image-popup}
![Screenshot -- Compare Start](/storage/configurations/compare-1.png)

When you click the **Compare** versions button you will see detailed diff:

{: .image-popup}
![Screenshot -- Diff](/storage/configurations/compare-2.png)

In the diff the red lines are removed lines, Green lines are added lines. The diff therefore shows that the only the name
of output table was modified.

## Rollback version
If you need to return to an older version of the configuration, you can also rollback to it (the other option is to
make a copy of it). Rolling back a configuration version actually means that a new configuration version is created
(and marked as active) with the contents of the selected version. Rollback is therefore a quite safe operation.

Click the **Rollback** button next the version you want to return to:

{: .image-popup}
![Screenshot -- Rollback](/storage/configurations/rollback-1.png)

Confirm the operation:

{: .image-popup}
![Screenshot -- Rollback](/storage/configurations/rollback-2.png)

A new configuration version is created:

{: .image-popup}
![Screenshot -- Rollback](/storage/configurations/rollback-3.png)

