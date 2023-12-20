---
title: Business Data Model Guide
permalink: /tutorial/onboarding/architecture-guide/bdm-guide/
---

* TOC
{:toc}

Welcome to the Business Data Model Guide!

This comprehensive guide is designed to provide you with a clear understanding of the Business Data Model (BDM) 
and guide you on how to effectively utilize it within your data management processes. Whether you're new to BDM or looking to enhance 
your existing practices, this guide aims to equip you with the knowledge and practical insights needed to leverage BDM to its full potential.

## What is a BDM?
Well, first of all, let’s talk about what it isn’t. It’s not a database design, it’s not an ERD, it has nothing to do with database performance. 
While we use language that is eerily similar to that of Entity Relationship Diagram or Logical Data Model, BDM lives above them all, and is purely conceptual.

BDM of a company doesn’t change because the technology changed. BDM changes because the business changes. We’ve now been using this methodology for over 5 years,
and the BDM’s built way back then still stand, despite many technology and requirement overhauls along the way.

Business Data Model is a method of describing a business in the language of data, independent on the underlying technology. It defines and describes “objects”,
“properties” and “values” that are key to the business operation, providing language that simplifies any and all steps that follow – including decisions about
technical implementations and integrations.

## Why BDM, and what happens without it?
The reason behind BDM can be summarized by the old adage “slow down to speed up”. Many times we have seen what happens when an eager analyst just “looks 
at the data”, sees what’s in there and builds reporting logic on top of it. That’s how data and logic silos are created, and being left to its devices, 
this approach creates a maze of isolated solutions that becomes incredibly unwieldy as the complexity grows.

One can argue that BDM is nothing new – the terms of Logical Data Model or Conceptual Data Model have been used over the times, and consulting companies are
selling their services of building those. While the concept is similar, the technique differs, making it available for any business. 

By keeping the process simple, we remove the excuse why not to do it. The temptations presented by self-serve BI tools – the just start working with data approach 
– is showing its shortcomings just a little bit later. We see multiple definitions of the same objects, disagreements on meaning of fairly simple concepts and
words, business logic baked into code all over the place, and pieces of technology serving single “critical” processes that are nearly impossible to retire later.

