---
title: Pipedrive
permalink: /components/extractors/marketing-sales/pipedrive/
redirect_from:
    - /extractors/marketing-sales/pipedrive/
---

* TOC
{:toc}

This extractor uses the [Pipedrive API](https://developers.pipedrive.com/docs/api/v1/) to import data 
from [Pipedrive](https://www.pipedrive.com/en-gb).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Pipedrive** extractor.

To configure this extractor, you need to provide an **API token**. You can get it by clicking the *Get API Token* link. 
Then enter your **company domain** (if your Pipedrive is at https://keboola.pipedrive.com, than your company domain is **keboola**).

{: .image-popup}
![Screenshot - Pipedrive configuration](/components/extractors/marketing-sales/pipedrive/pipedrive-1.png)

To configure what data you want to extract, select one of the configuration templates. 
Available templates are:

- **Basic** -- downloads organizations, persons, users, pipelines, activities, stages, etc.
- **Extended** -- downloads also deals and additional fields to the above.

When done, **Save** the configuration. You can also [switch to the JSON editor](/components/extractors/other/generic/#template-mode).

**Important:** Data are always imported incrementally.
