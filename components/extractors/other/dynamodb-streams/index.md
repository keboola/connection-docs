---
title: DynamoDB Streams
permalink: /components/extractors/other/dynamodb-streams/
redirect_from:
    - /extractors/other/dynamodb-streams/
---

* TOC
{:toc}

This extractor Fetches data from DynamoDBStreams. It supports back-fill mode and also incremental fetching.
Uses statefile to fetch data in increments.

## Prerequisites

1. Access Key ID
2. Secret Access Key

You can find more info on how to get these in [AWS documentation](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html).

## General Configuration
 - **Access Key ID** (accessKeyId) - [REQ] Access Key ID for account authorized to access Streams in row configuration. 
 - **Secret Access Key** (#secretAccessKey) - [REQ] Secret access Key ID for account authorized to access Streams in row configuration.
 - **Region Name** (regionName) - [REQ] AWS account Region Name
 - **Maximum Runtime (minutes)** (maxRuntime) - [OPT] When maximum runtime is reached the component will not continue to fetch data from the next shard.


## Row Configuration
 - **Table Name** (table) - [REQ] DynamoDB Table Name
 - **Attributes** (attributes) - [OPT] Comma separated list of attributes


{: .image-popup}
![Screenshot - DynamoDB Streams Confguration](/components/extractors/other/dynamodb-streams/dynamodb-streams.png)

When done, **Save** the configuration. 

