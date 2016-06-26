---
title: Gmail
permalink: /extractors/gmail/
---

* TOC
{:toc}

The Gmail extractor allows you to fetch data from your Gmail account.

### Create New Configuration

Find Gmail in the Extractors section, create a new configuration and name it.

{: .image-popup}
![Gmail - add configuration](/extractors/gmail/01-add-configuration.png)

Then click **Authorize Account** to be redirected to Google, and authorize the extractor to access your Google account. 
**Inbox is accessed as read only.**

{: .image-popup}
![Gmail - authorize account](/extractors/gmail/02-authorize-account.png)

### Configure Queries

Click **Edit configuration** and fill the form to fit your needs.

{: .image-popup}
![Gmail - configure queries](/extractors/gmail/03-configure-queries.png)

- **Query** -- Query to filter your messages. To speed up the extraction, be as specific as possible. 
For more detailed information about querying, follow Google's [Advanced search](https://support.google.com/mail/answer/7190?hl=en) help site.
- **Headers** (optional) -- Headers you want to download. If no headers are specified, all headers will be downloaded.


Save the configuration and **run** the extractor. For information on the extraction process, go to the **Jobs** section.

## Produced Tables

The extractor produces several tables that can be joined together.

### Queries

Queries and their messages; it is good to know from which query a message came from.

{: .table-bordered }
| query | messageId |
| --- | --- |
| `from:some.address@example.com` | `9876cbd54bd215a6` |
| `from:another.address@example.com` | `1234abcd2ffdc1d6` |


### Messages

A base table of messages:

{: .table-bordered }
| id | threadId |
| --- | --- |
| `9876cbd54bd215a6` | `1234abcd2ffdc1d6` |
| `1234abcd2ffdc1d6` | `1234abcd2ffdc1d6` |

*Tip: You can group your messages to conversations with `GROUP BY threadId`*.

### Headers

All downloaded headers:

{: .table-bordered }
| messageId | name | value |
| --- | --- | --- |
| `1234abcd2ffdc1d6` | `From` | `News <some.address@example.com>` |
| `1234abcd2ffdc1d6` | `Subject` | `Trending News` |

### Parts

All downloaded message parts:

{: .table-bordered }
| messageId | partId | mimeType | bodySize | bodyData |
| --- | --- | --- | --- | --- |
| `1234abcd2ffdc1d6` | `0` | `text/plain` | `26` | `Lorem ipsum dolor sit amet` |
| `1234abcd2ffdc1d6` | `1` | `text/html` | `33` | `<p>Lorem ipsum dolor sit amet</p>` |

*Note: Only parts with `text/plain` and `text/html` mime types are downloaded.*
