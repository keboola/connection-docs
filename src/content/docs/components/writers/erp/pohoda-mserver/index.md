---
title: POHODA mServer
slug: 'components/writers/erp/pohoda-mserver'
description: Write address book entries, invoices, orders, stock and other agendas into STORMWARE POHODA through its mServer XML API, with line items and the document numbers POHODA assigns.
---


[STORMWARE POHODA](https://www.stormware.cz/pohoda/) is a widely used Czech accounting system. The POHODA mServer data destination connector imports Keboola tables into POHODA agendas through the mServer HTTP/XML API. One configuration row imports one agenda: address book, invoices, orders, offers, enquiries, stock, cost centres, internal documents or cash vouchers.

<!-- Reference-type page. Source: the component registry copy of `keboola.wr-pohoda-mserver` (/v2/storage longDescription, configurationDescription and config schema), verified 2026-10-12. -->

:::caution[Public Beta]
This connector is in public beta. Send feedback using the feedback button in your project.
:::

Input table columns map to POHODA fields by name, or through an explicit column mapping. Document agendas take their line items from a second input table linked by a key column. POHODA assigns the document numbers itself; each record's outcome, including the assigned number, is written to a results table.

## Prerequisites

- A running POHODA mServer that Keboola can reach over plain HTTP. The default mServer port is 444, and mServer does not use HTTPS by default.
- The IČ (company ID) of the accounting unit to write to.
- A POHODA user account, not a Windows or domain account, and its password if it has one.

:::note
POHODA mServer and the POHODA desktop application cannot open the same company data file at the same time. Keep mServer running, and the desktop application closed on that server, before you schedule imports.
:::

## Configuration

[Create a new configuration](/components/#creating-component-configuration) of the **POHODA mServer** data destination connector.

### Connection

These settings are shared by all rows:

| Field | Required | Description |
|---|---|---|
| mServer URL | Yes | Base URL of the mServer, for example `http://192.168.1.10:444`. |
| IČ (Company ID) | Yes | IČ of the POHODA accounting unit. It must match the unit registered in your POHODA installation. |
| POHODA username | Yes | POHODA user account name. |
| Password | No | Leave empty if the account has no password. The value is stored encrypted. |

Click **Test connection** to confirm that the mServer is reachable and accepts the credentials, then save.

### Row configuration

Click **Add Row** and configure one row per agenda. Map the input table, or the header and line-items tables, in the row's input mapping first.

| Field | Description |
|---|---|
| Agenda | The POHODA entity to write to: address book, centre, stock, invoice, order, offer, enquiry, internal document or cash voucher. |
| Invoice, order, offer or enquiry type | Shown for the Invoices, Orders, Offers and Enquiries agendas only. Selects the document direction and sub-type, for example *Issued invoice*. |
| Header table | Input table with one row per record, the document header for document agendas. Auto-detected from the input mapping when left empty. |
| Line items table | Input table with the line items of a document agenda, linked to the header table by the key column. Auto-detected when left empty. Document agendas only. |
| Document key column | Column present in both the header and line-items tables that groups the items of one document, for example `document_id`. Required when the line items table is set explicitly. |
| Column mapping | Maps input columns to POHODA fields. Leave empty if your columns already use the POHODA field names. |

Columns are matched to POHODA fields by name, per agenda. Unknown columns are ignored and empty values are skipped.

## Output

The connector writes a `write_results` table with one row per imported record: its outcome and the document number POHODA assigned.
