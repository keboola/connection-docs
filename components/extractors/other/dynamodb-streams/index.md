---
title: DynamoDB Streams
permalink: /components/extractors/other/dynamodb-streams/
redirect_from:
    - /extractors/other/dynamodb-streams/
---

* TOC
{:toc}

This data source connector downloads data from DynamoDB Streams. It supports back-fill mode and incremental fetching.
To fetch data in increments, it uses a state file.

## Prerequisites

1. Access Key ID
2. Secret Access Key

You can find more information on how to obtain these keys in the [AWS documentation](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html).

## General Configuration
Fill in the following parameters:

- `accessKeyId` (required); Access Key ID for the account authorized to access Streams in row configuration
- `#secretAccessKey` (required); Secret Access Key ID for the account authorized to access Streams in row configuration
- `regionName` (required); AWS account Region Name
- `maxRuntime`(minutes)(optional); When the maximum runtime is reached, the component will not continue to fetch data on the next shard.


## Row Configuration
- **Table Name** (table) - [REQ] DynamoDB Table Name
- **Attributes** (attributes) - [OPT] Comma separated list of attributes

{: .image-popup}
![Screenshot - DynamoDB Streams Confguration](/components/extractors/other/dynamodb-streams/dynamodb-streams.png)

When done, **save** the configuration. 

