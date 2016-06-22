---
title: Gmail
permalink: /extractors/gmail/
---

* TOC
{:toc}

The Gmail extractor allows you to fetch data from Gmail account.

## Create New Configuration

Find Gmail in the Extractors section. Create a new configuration and name it.

{: .image-popup}
![Gmail - add configuration](/extractors/gmail/01-add-configuration.png)

Then authorize the extractor to access your Google account. Clicking on the button authorization process
will start and redirect you to Google and ask for permissions. **Inbox is accessed with readonly access.**

{: .image-popup}
![Gmail - authorize account](/extractors/gmail/02-authorize-account.png)

## Configure Queries

Click *Edit configuration* and start filling the form until it fits your needs.

{: .image-popup}
![Gmail - configure queries](/extractors/gmail/03-configure-queries.png)

- **Query** -- Query to filter your messages. To speed up extraction, try to be as much specific
as possible. For more detailed information about querying follow Google's
[Advanced search](https://support.google.com/mail/answer/7190?hl=en) help site.
- **Headers** (optional) -- Headers you want to download. If no headers specified, all headers
will be downloaded.


## Run Extractor

After configuring, run the extractor by hitting the *Run Extraction* button. In the Job detail
section, extractor will inform you about extraction process.

### Produced tables

Extractor will produces several tables which can be joined together.

#### Queries

Table of queries and its messages, because it's good to know from which query message came from.

{: .table-bordered }
| query | messageId |
| --- | --- |
| `from:some.address@example.com` | `9876cbd54bd215a6` |
| `from:another.address@example.com` | `1234abcd2ffdc1d6` |


#### Messages

Base table of messages.

{: .table-bordered }
| id | threadId |
| --- | --- |
| `9876cbd54bd215a6` | `1234abcd2ffdc1d6` |
| `1234abcd2ffdc1d6` | `1234abcd2ffdc1d6` |

*Tip: You can group your messages to conversations with `GROUP BY threadId`*.

#### Headers

Contains all downloaded headers.

{: .table-bordered }
| messageId | name | value |
| --- | --- | --- |
| `1234abcd2ffdc1d6` | `From` | `News <some.address@example.com>` |
| `1234abcd2ffdc1d6` | `Subject` | `Trending News` |

#### Parts

And all downloaded message parts.

{: .table-bordered }
| messageId | partId | mimeType | bodySize | bodyData |
| --- | --- | --- | --- | --- |
| `1234abcd2ffdc1d6` | `0` | `text/plain` | `26` | `Lorem ipsum dolor sit amet` |
| `1234abcd2ffdc1d6` | `1` | `text/html` | `33` | `<p>Lorem ipsum dolor sit amet</p>` |

*Note: Only parts with `text/plain` and `text/html` mime types are downloaded.*
