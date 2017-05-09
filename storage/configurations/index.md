---
title: Component Configurations
permalink: /storage/configurations/
---

* TOC
{:toc}

Each KBC component (extractor, writer, etc.) has configurations, which can be created through the UI.

All configurations are saved into Storage. When modified, their new version is created and the old one is kept in history.
Most components, with the exception of a few old ones, enable you to see the configuration versions 
in their configuration detail:

{: .image-popup}
![Screenshot -- Storage Configurations](/storage/configurations/configurations-intro.png)

When running the configuration, its **active** version (the one with the green tick-mark) will be used.

Click on any of the versions to get to the *version management page*.

{: .image-popup}
![Screenshot -- Storage Configurations](/storage/configurations/versions-intro.png)

There you can

- copy any version,
- compare any two successive versions, or just
- rollback to an older version.

All of the operations can be [accessed via API](http://docs.keboola.apiary.io/#reference/component-configurations/create-config).
For working with configurations, see the [developer guide](https://developers.keboola.com/integrate/storage/api/configurations/).

**Important**: Component configurations do not count towards your project quota.

## Copy Configuration
Copy any configuration version to a new configuration by clicking on the **Copy** button next to the selected configuration:

{: .image-popup}
![Screenshot -- Copy Start](/storage/configurations/copy-1.png)

Name the new configuration:

{: .image-popup}
![Screenshot -- Copy Name Configuration](/storage/configurations/copy-2.png)

Once it is created, you can navigate to it using the bread-crumbs navigation:

{: .image-popup}
![Screenshot -- Copy Name Configuration](/storage/configurations/copy-3.png)

The new configuration is completely independent on the old one. You may modify or delete either of them without affecting the other one.

## Compare Versions
Compare two consecutive versions and see the modifications as a [diff](https://en.wikipedia.org/wiki/Data_comparison) of
the raw [JSON](https://en.wikipedia.org/wiki/JSON) configuration. Each component automatically generates a description
of the change, so the following version represents a change in the *level/level* sheet in the Google Drive extractor configuration:

{: .image-popup}
![Screenshot -- Compare Start](/storage/configurations/compare-1.png)

Clicking the **Compare** versions button shows a detailed diff:

{: .image-popup}
![Screenshot -- Diff](/storage/configurations/compare-2.png)

Removed lines are highlighted in red, added lines are green. The diff above shows that only the name
of the output table was modified.

## Rollback Version
If you need to return to an older version of the configuration, you can also rollback to it (the other option is to
make its copy). Rolling back a configuration version actually means that a new configuration version is created
(and marked as active) with the contents of the selected version. Rollback is therefore quite a safe operation.

Click the **Rollback** button next to the version you want to return to:

{: .image-popup}
![Screenshot -- Rollback](/storage/configurations/rollback-1.png)

Confirm the operation:

{: .image-popup}
![Screenshot -- Rollback](/storage/configurations/rollback-2.png)

And a new configuration version is created:

{: .image-popup}
![Screenshot -- Rollback](/storage/configurations/rollback-3.png)

## Delete Configuration
To delete a configuration, click the **Bin** icon in the configuration list or the **Move to Trash** button in
the configuration detail. Both of these operations move the configuration to **Trash**.

{: .image-popup}
![Screenshot -- Delete](/storage/configurations/delete.png)

Each configuration moved to Trash acts as deleted: it is removed from orchestrations, cannot be run and is not 
displayed. However, it can be recovered. To find your Trash, go to the **Users & Settings** menu and select the 
**Trash tab**:

{: .image-popup}
![Screenshot -- Configuration Trash](/storage/configurations/configuration-trash.png)

There you can **restore** a configuration, or **permanently delete** it. Once deleted from Trash, no configuration 
can be recovered. If your Trash is filled with a large number of configurations and you want to quickly find the 
one you need to restore or permanently remove, use the filter and search options in the upper part of the page. 

When you restore a configuration, its new version is created. Therefore you can see the complete history in the 
configuration versions:

{: .image-popup}
![Screenshot -- Configuration History](/storage/configurations/configuration-restored.png)

For technical reasons, configurations of certain components cannot be restored when deleted (mainly Orchestrator 
and GoodData Writer). They will still be shown in Trash, but cannot be restored:

{: .image-popup}
![Screenshot -- Configuration Restore Disabled](/storage/configurations/configuration-trash-2.png)
