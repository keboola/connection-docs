---
title: Pipedrive
permalink: /components/extractors/marketing-sales/pipedrive/
redirect_from:
    - /extractors/marketing-sales/pipedrive/
---

* TOC
{:toc}

This data source connector uses the [Pipedrive API](https://developers.pipedrive.com/docs/api/v1/) to import data 
from [Pipedrive](https://www.pipedrive.com/en-gb).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Pipedrive** connector.

To configure this connector, you need to provide an **API token**. You can get it by clicking the *Get API Token* link. 
Then enter your **company domain** (if your Pipedrive is at https://keboola.pipedrive.com, your company domain is **keboola**).

{: .image-popup}
![Screenshot - Pipedrive configuration](/components/extractors/marketing-sales/pipedrive/pipedrive-1.png)

To configure what data you want to extract, select one of the configuration templates. 
There are two templates available:

- **Basic** -- downloads organizations, persons, users, pipelines, activities, stages, etc.
- **Extended** -- downloads also deals and additional fields to the above.

When done, **save** the configuration. You can also [switch to the JSON editor](/components/extractors/other/generic/#template-mode).

**Important:** Data is always imported incrementally.
