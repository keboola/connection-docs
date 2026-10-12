---
title: mPOHODA
slug: 'components/writers/erp/mpohoda'
description: Create invoices, orders, offers, business partners and other records in the mPOHODA cloud accounting API from Keboola tables, with a results table per run.
search_keywords: [pohoda, stormware, mpohoda]
---


[mPOHODA](https://www.mpohoda.cz) is STORMWARE's cloud accounting service. The mPOHODA data destination connector creates records in it from Keboola tables through the REST API. One configuration row writes to one agenda: business partners, issued invoices, issued advance invoices, received invoices, issued orders, received orders, issued offers, issue slips, other liabilities or payment methods. The [mPOHODA data source connector](/components/extractors/erp/mpohoda/) reads the agendas the other way.

<!-- Reference-type page. Source: the component registry copy of `keboola.wr-mpohoda` (/v2/storage longDescription, configurationDescription and config schema), verified 2026-10-12. -->

:::caution[Public Beta]
This connector is in public beta. Send feedback using the feedback button in your project.
:::

Each record's outcome, whether success with the assigned document number or a validation error, is written to a `write_results` table. Validation errors (HTTP 422) are recorded per record; the run fails only if every record fails.

## Prerequisites

- The **mPOHODA Pro** edition. Other editions have no API.
- An API key, generated in mPOHODA under **Nastavení → Open API**. The key is bound to one company.

The official API documentation is at [api.mpohoda.cz/doc](https://api.mpohoda.cz/doc).

## Configuration

[Create a new configuration](/components/#creating-component-configuration) of the **mPOHODA** data destination connector.

### Connection

| Field | Description |
|---|---|
| API base URL | `https://api.mpohoda.cz/v1` for the Czech mPOHODA, `https://api.mpohoda.sk/v1` for the Slovak one. |
| API key | Your mPOHODA API key. The value is stored encrypted. |
| Request timeout (s) | Timeout of one API request. Default 60. |

Click **Test connection** to verify the key and the base URL, then save.

![Screenshot - mPOHODA connection settings](/components/writers/erp/mpohoda/mpohoda-1.png)

### Row configuration

Click **Add Row** and configure one row per agenda. Map the input table, or the header and line-items tables, in the row's input mapping first.

| Field | Description |
|---|---|
| Agenda | The resource to create records in. |
| Input mode | **Column mapping** (default) maps input columns to mPOHODA fields. **Raw JSON** posts one input column verbatim as the full request body. |

#### Column mapping mode

| Field | Description |
|---|---|
| Header table | Optional. Input table with one row per record, the document header for document agendas. Auto-detected when left empty. |
| Line items table | Optional. Input table with the line items of a document agenda, linked to the header by the key column. Auto-detected when left empty, and ignored for agendas without line items, such as business partners and payment methods. |
| Document key column | Column present in both the header and line-items tables that links items to their document. Required when the line items table is set explicitly. |
| Column mapping | Maps input columns to mPOHODA fields. Click **Load columns** to prefill it, and leave it empty if your columns already use the mPOHODA field names. For line items, include an `item_type` column with the value `price_list` or `text`; it selects the line variant. |

![Screenshot - mPOHODA row in column mapping mode](/components/writers/erp/mpohoda/mpohoda-2.png)

#### Raw JSON mode

| Field | Description |
|---|---|
| JSON body column | The input column holding the full mPOHODA request body, one JSON object per row. Default `body`. |

Use raw JSON for fields the column mapping does not expose.

## Output

The `write_results` table has one row per input record: the row, agenda, status, mPOHODA `id`, the assigned document number and a message.
