---
title: Generic Writer
slug: 'extend/generic-writer'
---


Generic Writer is a [Keboola component](/overview/) that allows you to send any type of HTTP requests with or without data to arbitrary HTTP endpoints. 

It is a counterpart to the [Generic Extractor](/components/extractors/generic-extractor/) that allows you to extract data from virtually any API.

The core concepts and configuration of the writer are also quite similar to the Generic Extractor, so it should be easy to 
configure for anyone familiar with the extractor.

## Generic Writer Requirements
The requirements are the same as for the [Generic Extractor](/components/extractors/generic-extractor/#generic-extractor-requirements).
No programming skills or additional tools are required. You just need to do two easy things before you start:

- Learn how to [write JSON](/components/extractors/generic-extractor/tutorial/json/).
- Have the documentation of your chosen API at hand.

## Functionality Notes

The writer writes data to a specified endpoint in a specified format. It supports a single table and a single endpoint per configuration.

The content can be sent in two ways:

1. Send all content at once – either BINARY or JSON in chunks
2. Iterate through each row – where the data is sent in iterations specified in the input data. By default 1 row = 1 iteration. 
This allows to change the endpoint dynamically based on the input using placeholders: `www.example.com/api/user/{{id}}`.
Or sending data with different user parameters that are present in the input table.

## Use Cases

There are variety of use-cases for the generic writer. You may create, update or even delete objects via RESTful API or just trigger 
simple webhooks by sending GET requests to specified endpoints or send notifications to slack. The setup is quite straightforward and it 
allows you to leverage secure [encripted parameters](overview/encryption/) and dynamic functions. 

**The typical use cases are:**

- Webhook triggers
- Notifications, e.g., Slack
- Writing JSON data (UPDATES, etc.)
- Sending CSV files as binary data (may be gzipped)
- Calling arbitrary endpoints with parameters defined on the input
    - E.g., `DELETE api.com/[[user_id]]` where `user_id` is a column in the input table

For real configuration examples, see the [configuration examples section](/extend/generic-writer/configuration-examples)
 or the collection of [functional examples](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/).
