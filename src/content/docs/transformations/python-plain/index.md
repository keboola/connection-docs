---
title: Python Transformation
slug: 'transformations/python-plain'
description: Process data with Python in Keboola where SQL is awkward. Start here, then jump to the how-to or the reference.
keywords:
  - Python transformation
  - Python transformations
  - Python transformation Keboola
type: explanation
redirect_from:
    - /transformations/python/
---

[Python](https://www.python.org/about/) transformations complement SQL transformations where computations or other operations are too difficult — though common operations like joining, sorting, or grouping are still easier and faster in [SQL transformations](/transformations/#backends). Keboola maps your input tables in as CSV files, runs your script, and writes CSV outputs back to [Storage](/storage/tables/).

:::caution[Never put credentials in transformation code]
Python transformation code is stored as **plaintext** and is not encrypted. Store secrets in the [Custom Python](/components/applications/custom-python/) application instead — see the [how-to](/transformations/python-plain/how-to/) for details.
:::

This page is split by what you need:

- **[How do I run a Python transformation?](/transformations/python-plain/how-to/)** — create, run, and develop/debug one end to end.
- **[Python transformation reference](/transformations/python-plain/reference/)** — runtime limits, file locations, packages, and CSV reading/writing.

New to transformations? Start with [Transformations](/transformations/) and the [Getting Started tutorial](/tutorial/manipulate/).
