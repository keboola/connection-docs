---
title: GoodData Reports
permalink: /extractors/marketing-sales/gooddata-reports/
---

* TOC
{:toc}

The GoddData Reports extractor uses the [GoodData API](https://help.gooddata.com/display/doc/API+Reference) to import 
reports from the [GoodData](https://www.gooddata.com/) business intelligence platform and stores the data in Keboola Connection Storage.

## Create New Configuration
Find GoodData Reports in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/extractors/marketing-sales/gooddata-reports/01-new-configuration.png)


## Configuration
First, type in your GoodData host: secure.gooddata.com, keboola.eu.gooddata.com, or a custom host. 

{: .image-popup}
![Screenshot - GoodData Host](/extractors/marketing-sales/gooddata-reports/02-host.png)

### Reports
To select which reports to download, set one or multiple Uniform Resource Identifiers (URI).

{: .image-popup}
![Screenshot - GoodData URI](/extractors/marketing-sales/gooddata-reports/03-uri.png)

### Credentials
Continue by providing your own GoodData **credentials**. 

{: .image-popup}
![Screenshot - GoodData Credentials](/extractors/marketing-sales/gooddata-reports/04-credentials.png)

You can also choose an existing GoodData **writer** and use its credentials. The ID of an existing GoodData writer is
in its configuration URL -- e.g. `https://connection.keboola.com/admin/projects/123/writers/gooddata-writer/WRITER_ID`.

{: .image-popup}
![Screenshot - GoodData Writer Credentials](/extractors/marketing-sales/gooddata-reports/05-writer-credentials.png)

When finished, remember to **save** the configuration before you run the extraction.