---
title: Stripe
slug: 'components/extractors/other/stripe'
description: 'Import almost all Stripe data, or only charges, through the Stripe API with an API token, using a configuration template with full load.'
redirect_from:
    - /extractors/other/stripe/
---



This data source connector uses the [Stripe API](https://stripe.com/docs/api) to import almost all data from [Stripe](https://stripe.com/).

<!-- How-to-type page. Source: keboola/connection-docs history; classified 2026-10-13. -->

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Stripe** connector.
You need to provide an [API token](https://stripe.com/docs/api#authentication).
You can get it in the [Stripe dashboard](https://dashboard.stripe.com/login?redirect=%2Faccount%2Fapikeys). 

To configure what data you want to extract, you can select one of the configuration templates:

- Only Charges -- FULL LOAD
- Almost ALL Data -- FULL LOAD

![Screenshot - Stripe Confguration](/components/extractors/other/stripe/stripe-1.png)

When done, **Save** the configuration. 

You can also [switch to the JSON editor](/components/extractors/generic-extractor/#template-mode).
