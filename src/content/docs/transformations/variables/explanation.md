---
title: What are transformation variables and shared code?
slug: 'transformations/variables/explanation'
description: Understand how variables parametrize a transformation and how shared code reuses snippets across transformations in Keboola, and when to use each.
keywords:
  - transformation variables
  - shared code
  - parametrize transformation
  - reusable transformation code
  - mustache variables Keboola
type: explanation
---

**Variables** and **shared code** make transformation code more dynamic and reusable. This page explains what they are and when to use them; to set them up, see the [how-to](/transformations/variables/how-to/).

## Variables

Variables let you **parametrize** a transformation — useful when several transformations differ only in a few values (for example, the same logic for the Meals department and the Drinks department).

Transformation variables are **unrelated to the code's own variables** (they are not SQL or Python variables). They are evaluated **before** the transformation runs and apply to the **entire configuration** — all code blocks, shared code, and mapping. They are referenced with [Mustache syntax](https://scalate.github.io/scalate/documentation/mustache.html#Variables), `{{ name }}`. Every referenced variable must be defined, and every defined variable must have a value (a default, optionally overridden at runtime or per [flow](/flows/) task).

## Shared code

**Shared code** lets you reuse a snippet across otherwise unrelated transformations. Like variables, it is evaluated before the transformation runs, so it does not interfere with your code at runtime. Shared code can itself use variables.

When you add shared code to a transformation you choose how it is linked:

- **Use Inline** — copies the snippet into the transformation. There is no link; later changes to the shared code do not affect this copy.
- **Use as Shared Code** — links the snippet. Editing the shared code affects **all** linked transformations — which is the point, but also the risk: editing or deleting shared code can break every transformation that links it.

This trade-off is the main thing to understand: inline favors isolation, linked favors central maintenance.

To set either up, see the [how-to](/transformations/variables/how-to/).
