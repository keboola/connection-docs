---
title: Writers
permalink: /components/writers/
redirect_from:
    - /writers/

---

Writers are [Keboola Connection components](/overview/) that take transformed and processed **output data from Keboola Connection**
and deliver it **into its final destination:** the systems and applications where the data gets used/**consumed**.

## Types of Writers
We integrate your data into most of the top market systems.
Choose the right consumption point for each project and use case. Like with Extractors,
there are **no limitations** to how and where you can send your data.

Writers can be grouped by their primary purpose:

- **Business Intelligence**: [Tableau](/components/writers/bi-tools/tableau/), [GoodData](/components/writers/bi-tools/gooddata/), [Looker](/components/writers/bi-tools/looker/), and more
- **Databases**: [MySQL](/components/writers/database/mysql/), [Oracle](/components/writers/database/oracle/), [PostgreSQL](/components/writers/database/postgresql/), [Amazon Redshift](/components/writers/database/redshift/), [Snowflake](/components/writers/database/snowflake/), [Synapse](/components/writers/database/synapse/), and more
- **Generic Storage**: [AWS S3](/components/writers/storage/aws-s3/), [Dropbox](/components/writers/storage/dropbox/), [Google Drive](/components/writers/storage/google-drive/),
[Google Sheets](/components/writers/storage/google-sheets/), [Keboola Connection Storage](/components/writers/storage/storage-api/), and more
- [Other](/components/writers/other/) writers such as Azure Event Hub

For a definitive list of usable writers, see your project **Writers** section.

## Working with Writers
Each writer can have multiple configurations. Each configuration usually represents a single destination (database account, BI project, etc.).
Even though writers are generally designed for [**automated and repeated**](/orchestrator/) data collection,
they can be triggered manually at any time.

We provide tutorials on [writing into GoodData](/tutorial/write/gooddata/) and [writing into Tableau](/tutorial/write/).

You can also watch the following videos:

- [Tableau Integration Demo](https://www.youtube.com/watch?v=FS1nndJ0vyQ)
- [GoodData Writer Demo](https://www.youtube.com/watch?v=h46t0_nOtyI)
