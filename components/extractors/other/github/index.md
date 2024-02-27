---
title: GitHub
permalink: /components/extractors/other/github/
redirect_from:
    - /extractors/other/github/
---

* TOC
{:toc}

The GitHub extractor uses the [GitHub API](https://developer.github.com/v3/) to import data from [GitHub](https://github.com/)
to Keboola.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **GitHub** extractor.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization), and
select the template you wish to use. There are two configuration templates available:

- `Smart Mode` -- always gets missing data only, loads data [incrementally](/storage/tables/#incremental-loading).
- `Full Mode` -- always gets everything.

{: .image-popup}
![Screenshot - GitHub configuration](/components/extractors/other/github/github-1.png)

You can download:

- Your Organizations
- Organization Members
- Organization Teams
- Organization Repositories
- Repository Issues
- Repository Commits

After you select the template, remember to **save** the configuration.
You can also [switch to the JSON editor](/components/extractors/other/generic/#template-mode).
