---
title: ECB Currency Rates
permalink: /components/extractors/other/currency-rates/
redirect_from:
    - /extractors/other/currency-rates/
---

* TOC
{:toc}

This extractor uses the [Fixer API](https://fixer.io/documentation) to download currency exchange rates as published by 
the European Central Bank (ECB).

The exchange rates are available from a base currency to 42 destination currencies for all **working days** from 4th January 1999. 

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **ECB Currency Rates** extractor.

From the dropdown list, select the source currency you wish to use. It is the only thing you need to do to configure this extractor. 

{: .image-popup}
![Screenshot - Currency Rates Source Currency](/components/extractors/other/currency-rates/currency-rates-1.png)

There are three major currencies available to choose from: 

- Euro (EUR) 
- British Pound (GBP)
- U.S. Dollar (USD)

After you select the source currency, **save** the configuration and **run** it.
The name of the output table will be automatically generated (in.c-keboola-ex-currency-XXX.rates).

## Output Table
The output table contains the following columns:

- **id** -- primary key of the table
- **date** -- date for which the rate is valid in YYYY-MM-DD format
- **fromCurrency** ('USD', 'EUR', or 'GBP', depending on what you selected)
- **toCurrency** -- code of the destination currency (available destination currencies: AED, AUD, BGN, BRL, CAD, CHF, CNY, CYP, CZK, DKK,
 EEK, GBP, HKD, HRK, HUF, IDR, ILS, INR, ISK, JPY, KRW, LTL, LVL, MTL, MXN, MYR, NOK,
 NZD, PHP, PLN, ROL, RON, RUB, SEK, SGD, SIT, SKK, THB, TRL, TRY, UAH, USD and ZAR)
- **rate** -- exchange rate
- **source** -- always 'ECB'

{: .image-popup}
![Screenshot - Currency Rates Output Table](/components/extractors/other/currency-rates/currency-rates-2.png)

***Note:** The reference rates are usually updated around 16:00 CET on every working day, except on TARGET closing days. 
They are based on a regular daily concertation procedure between central banks across Europe, which normally takes place at 14:15 CET.*

