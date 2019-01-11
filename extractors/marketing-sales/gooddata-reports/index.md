---
title: GoodData Reports
permalink: /extractors/marketing-sales/gooddata-reports/
---

* TOC
{:toc}

The GoddData Reports extractor uses the [GoodData API](https://help.gooddata.com/display/doc/API+Reference#/reference/dashboards-and-reporting/export-a-large-report/export-a-raw-report) to import
reports from the [GoodData](https://www.gooddata.com/) business intelligence platform and stores the data in Keboola Connection Storage.

## Create New Configuration
Find GoodData Reports in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/extractors/marketing-sales/gooddata-reports/01-new-configuration.png)


## Configuration
First, type in your GoodData host: secure.gooddata.com, keboola.eu.gooddata.com, or a custom host. Find the host
by opening the report you wish to extract.

{: .image-popup}
![Screenshot - GoodData Host](/extractors/marketing-sales/gooddata-reports/02-host.png)

### Reports
To select which reports to download, set one or multiple Uniform Resource Identifiers (URI).

{: .image-popup}
![Screenshot - GoodData URI](/extractors/marketing-sales/gooddata-reports/03-uri.png)

When you open a report in your browser, the URL in the address field will look similar to:

    https://secure.gooddata.com/#s=/gdc/projects/zggxxxxxxxxxxxxxxxxxxxxxxxxxmox|analysisPage|head|/gdc/md/zggxxxxxxxxxxxxxxxxxxxxxxxxxmox/obj/71

The part in form `/gdc/md/zggxxxxxxxxxxxxxxxxxxxxxxxxxmox/obj/71` is the report URI.

### Credentials
Continue by providing your own GoodData **credentials**.

{: .image-popup}
![Screenshot - GoodData Credentials](/extractors/marketing-sales/gooddata-reports/04-credentials.png)

You can also choose an existing GoodData **writer** and use its credentials. The ID of an existing GoodData writer is
in its configuration URL -- e.g. `https://connection.keboola.com/admin/projects/123/writers/gooddata-writer/WRITER_ID`.

{: .image-popup}
![Screenshot - GoodData Writer Credentials](/extractors/marketing-sales/gooddata-reports/05-writer-credentials.png)

When finished, remember to **save** the configuration before you run the extraction. The extractor will download the report contents as a
CSV file and store it as a table in KBC Storage.
