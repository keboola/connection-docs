---
title: GoodData Reports
permalink: /components/extractors/marketing-sales/gooddata-reports/
redirect_from:
    - /extractors/marketing-sales/gooddata-reports/
---

* TOC
{:toc}

The GoodData Reports data source connector uses the [GoodData API](https://help.gooddata.com/display/API/API+Reference#/reference/dashboards-and-reporting/export-a-large-report/export-a-raw-report) to import
reports from the [GoodData](https://www.gooddata.com/) business intelligence platform and stores the data in Keboola Storage.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **GoodData Reports** connector.
Type in your GoodData host: secure.gooddata.com, keboola.eu.gooddata.com, or a custom host. Find the host
by opening the report you wish to extract.

{: .image-popup}
![Screenshot - GoodData Host](/components/extractors/marketing-sales/gooddata-reports/gooddata-reports-1.png)

### Reports
To select which reports to download, set one or multiple Uniform Resource Identifiers (URI).

{: .image-popup}
![Screenshot - GoodData URI](/components/extractors/marketing-sales/gooddata-reports/gooddata-reports-2.png)

When you open a report in your browser, the URL in the address field will look similar to this:

    https://secure.gooddata.com/#s=/gdc/projects/wasxxxxxxxxxxxxxxxxxxxxxxxxxmox|analysisPage|head|/gdc/md/zggxxxxxxxxxxxxxxxxxxxxxxxxxmox/obj/71

The part in form `/gdc/md/zggxxxxxxxxxxxxxxxxxxxxxxxxxmox/obj/71` is the report URI.

### Credentials
Continue by providing your own GoodData **credentials**.

{: .image-popup}
![Screenshot - GoodData Credentials](/components/extractors/marketing-sales/gooddata-reports/gooddata-reports-3.png)

You can also choose an ID of the **GoodData Project** provisioned in one of the existing GoodData Writer configurations 
and use its credentials. The project ID (PID) of the provisioned project can be found in a GoodData data destination connector configuration.

{: .image-popup}
![Screenshot - GoodData Writer Config with Provisioned Project](/components/extractors/marketing-sales/gooddata-reports/gooddata-writer-1.png)

Copy the project ID from the data destination connector to the data source connector:

{: .image-popup}
![Screenshot - Provisioned GoodData Project Id](/components/extractors/marketing-sales/gooddata-reports/gooddata-reports-4.png)

When finished, remember to **Save** the configuration before you run the extraction. The data source connector will download the report contents as a
CSV file and store it as a table in Keboola Storage.
