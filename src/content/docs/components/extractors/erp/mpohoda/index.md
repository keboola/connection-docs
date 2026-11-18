---
title: mPOHODA
slug: 'components/extractors/erp/mpohoda'
description: Extract invoices, orders, offers, business partners, price lists and reference lists from the mPOHODA cloud accounting API, with incremental loading.
search_keywords: [pohoda, stormware, mpohoda]
---


[mPOHODA](https://www.mpohoda.cz) is STORMWARE's cloud accounting service. The mPOHODA data source connector reads its REST API into Storage. One configuration row extracts one agenda: issued invoices, issued advance invoices, issued corrective tax documents, received invoices, issued and received orders, issued offers, issue slips, other liabilities, business partners, price-list items, selling prices, registration and serial numbers, activities, cash registers, bank accounts, establishments, centres, and reference lists such as banks, countries, currencies, VAT rates, payment methods and their types, regions, exchange rates, and city and post codes. The [mPOHODA data destination connector](/components/writers/erp/mpohoda/) writes records the other way.

<!-- Reference-type page. Source: the component registry copy of `keboola.ex-mpohoda` (/v2/storage longDescription, configurationDescription and config schema), verified 2026-10-12. -->

:::caution[Public Beta]
This connector is in public beta. Send feedback using the feedback button in your project.
:::

Each record is flattened into a typed table row. Nested arrays such as invoice line items become child tables linked to the parent by `parent_id` and `index`. The record GUID (`id`) is the primary key. Incremental loading uses the API's `ModifiedSince` filter: the connector stores a watermark after each run, and the next run fetches only the records changed since.

## Prerequisites

- The **mPOHODA Pro** edition. Other editions have no API.
- An API key, generated in mPOHODA under **Nastavení → Open API**. The key is bound to one company.

The official API documentation is at [api.mpohoda.cz/doc](https://api.mpohoda.cz/doc).

## Configuration

[Create a new configuration](/components/#creating-component-configuration) of the **mPOHODA** data source connector.

### Connection

| Field | Description |
|---|---|
| API base URL | `https://api.mpohoda.cz/v1` for the Czech mPOHODA, `https://api.mpohoda.sk/v1` for the Slovak one. |
| API key | Your mPOHODA API key. The value is stored encrypted. |
| Request timeout (s) | Timeout of one API request. Default 60. |

Click **Test connection** to verify the key and the base URL, then save.

![Screenshot - mPOHODA connection settings](/components/extractors/erp/mpohoda/mpohoda-1.png)

### Row configuration

Click **Add Row** and configure one row per agenda:

| Field | Description |
|---|---|
| Agenda | The list endpoint to read. |
| Load mode | **Incremental** (default) fetches only the records changed since the last run and upserts them by primary key. **Full** replaces the table. |
| Changed since (initial date) | Optional ISO date or date-time. Used only on the first incremental run, when no state is saved yet, so you can start from a date instead of loading the whole history. |
| Page size | Records per API page. The mPOHODA API caps this at 50. |
| Columns to keep | Optional. Output only these columns from the main table; the `id` primary key is always kept. Use the flattened snake_case names, for example `vat_percent`. |
| Output table name | Optional. Defaults to the agenda name in snake case, for example `issued_invoices`. |

![Screenshot - mPOHODA row configuration](/components/extractors/erp/mpohoda/mpohoda-2.png)

## Output

One table per row, named after the agenda unless you override it, with `id` as the primary key. Nested line items are written to a child table named `<table>__items`, linked to the parent row by `parent_id` and `index`.
