---
title: Data Streams
permalink: /storage/data-streams/
---

* TOC
{:toc}

Keboola’s Data Streams feature allows users to receive streaming event data directly into Keboola Storage without needing additional steps, such as setting up a data source, using middleware, or developing a custom component. It simplifies the process and enables ad-hoc messaging from your system to Keboola Storage.

## Key Benefits
The most important benefits of the Data Streams feature include:

- **Real-Time Data Ingestion:** Stream events in near-real time for immediate access to data and actionable insights.
- **Scalable Infrastructure:** Efficiently handle millions of events per day, ensuring seamless scalability.
- **Simplified Integration:** Connect your systems directly to Keboola without middleware, reducing setup time and costs.
- **Increased Efficiency:** Automate processes, eliminating manual data entry and updates.
- **Real-Time Updates:** Trigger actions instantly based on real-time event data.

## How It Works
The Data Streams feature receives messages through HTTP and saves them into the database once predefined conditions (record count, total size, or time) are met. The service uses Keboola's Buffer API for smooth data management. [Learn more](https://developers.keboola.com/integrate/data-streams/overview/)

### Create a Data Stream
1. Navigate to **Storage > Data Streams** and click **Create Data Stream**.
2. Name the data stream, e.g., “my-first-data-stream.” The name of the table will be filled automatically based on the stream name, but you can change it if needed.
3. Once the stream is created, you can add a description for better orientation within the project.

### Configure the Stream
#### Data Stream URL
For every data stream, a unique “Data Stream URL” is generated. You can use it in your application to send events. This URL cannot be changed.

#### Table Statistics
This dashboard shows the status of data waiting for import vs. imported data.

#### Table Settings
In your table settings, you can:

- Change the name of the stream.
- Add a column or define your own structure using the PATH or JSONNET template. [Learn more](https://developers.keboola.com/integrate/data-streams/overview/#template-jsonnet)
- Edit column names (available only if you create a new table within the stream).
- Edit primary keys (available only if you create a new table within the stream).
- Delete a column (available only if you create a new table within the stream).

<div class="clearfix"></div>
<div class="alert alert-warning" role="alert">
    <i class="fas fa-exclamation-circle"></i>
    <strong>Important:</strong> Changing the table’s name will create a new table, and the stream will import data into that table.
</div>

#### Sample codes for integration
For easier use, we’ve prepared a few examples of how to send data to a stream using Python, Javascript, and Bash.

#### Import conditions
In this section, you can set a few conditions for importing data. If any of these three conditions are met, events are instantly uploaded to the destination table. You can set the import time frequency, the size of the imported data, or the number of imported records. [Learn more](https://developers.keboola.com/integrate/data-streams/overview/#conditions)

#### Payload test
Here, you can simulate your payload and test it instantly with a table preview to see how the data will be imported before deploying it into production.

## Pricing
Data Streams pricing details vary based on the number of streams and the volume of data ingested.

- $25 per stream, per month
- $0.15 per 1GB of streamed data 

## Technical Documentation
For further details and API integration steps, refer to our [comprehensive documentation](https://developers.keboola.com/integrate/push-data/).

