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

## What Is a BDM?
Well, first of all, let’s talk about what it isn’t. It’s not a database design, it’s not an ERD, it has nothing to do with database performance. 
While we use language that is eerily similar to that of Entity Relationship Diagram or Logical Data Model, BDM lives above them all, and is purely conceptual.

BDM of a company doesn’t change because the technology changed. BDM changes because the business changes. We’ve now been using this methodology for over 5 years,
and the BDM’s built way back then still stand, despite many technology and requirement overhauls along the way.

Business Data Model is a method of describing a business in the language of data, independent on the underlying technology. It defines and describes “objects”,
“properties” and “values” that are key to the business operation, providing language that simplifies any and all steps that follow – including decisions about
technical implementations and integrations.

## Why BDM, and What Happens Without It?
The reason behind BDM can be summarized by the old adage “slow down to speed up”. Many times we have seen what happens when an eager analyst just “looks 
at the data”, sees what’s in there and builds reporting logic on top of it. That’s how data and logic silos are created, and being left to its devices, 
this approach creates a maze of isolated solutions that becomes incredibly unwieldy as the complexity grows.

One can argue that BDM is nothing new – the terms of Logical Data Model or Conceptual Data Model have been used over the times, and consulting companies are
selling their services of building those. While the concept is similar, the technique differs, making it available for any business. 

By keeping the process simple, we remove the excuse why not to do it. The temptations presented by self-serve BI tools – the just start working with data approach 
– is showing its shortcomings just a little bit later. We see multiple definitions of the same objects, disagreements on meaning of fairly simple concepts and
words, business logic baked into code all over the place, and pieces of technology serving single “critical” processes that are nearly impossible to retire later.

## Principles of Building a BDM
### What You Need
First of all, you need the right people. BDM is way too important to be left just to the techies. Bring an executive responsible for the area you’re describing,
and ideally their boss, too. Having someone technically inclined from the company helps, mainly for buy-in during later stages. However, their presence is not
as essential at the end of the day.

Beyond that, it’s just a whiteboard, post-its (good to have 3 different colors), a few markers and you’re good to go.

While we always digitize the model once it’s at least initially laid out, and it is obviously possible to do this completely digital and remote 
(Google Drawings are a good start despite its simplicity as multiple people can be working on it at once), we always find it more effective and 
engaging in person. Often the first workshop happens on-site, and we follow up with one or two rounds that can be remote, 
using the digital drawing to collaborate on.

### Step 0 – Round Up
In complex organisations and processes, the BDM gets complicated. An e-commerce operation that wants to cover everything from marketing to logistics and
fulfillment in one go can easily end up with 90+ data objects. So, start with defining the area you are going to cover in the first round, and keep it contained.

Let’s say we start with the actual e-commerce part of the mentioned example – that includes the customer, product, order, perhaps invoice etc., 
but will not concern itself with campaigns, stores, delivery centers, inventory – those would be left for the next round, working off of the e-commerce base.

How to select the starting point? Either use what is central to the business (the orders are a good example for the e-commerce use cases), or with the area 
of immediate pain and low-hanging-fruit opportunity to deliver value (often marketing and attribution, or inventory control & turns).

It is inevitable that during the following phases the team will encroach on some of those “no-go” areas. Just call it out, put the stickie on the side, 
or mark it visibly as something that no more time is being spent on at this time.

### Step 1 – Storm
During this step we will create as many “objects” as we can think of. Keep in mind that whatever existing systems are in place or planned are completely 
irrelevant. Don’t limit yourself to “what we have data about today” etc. – work diligently to get your audience out of that mind set 
(sometimes difficult with a technical audience, but necessary nevertheless).  

Let’s stick to the e-commerce example. Everyone grabs a marker and a stack of post-its (use the SAME COLOR of post-its for everyone – may we suggest yellow?). 
Then we’ll just start talking about the business – it actually rolls quite simply. Someone says – there is “Order” and writes it down. Someone else says 
“Order has Lines”, on those are “Products”, they belong to “Brands” - and three stickies are used. Brainstorming rules apply, everything goes, 
there’s no editing or arguing, only adding. 

Use “Yes, and…” every time. The outcome of this stage is a LOT of stickies, go until no one can think of anything else – while of course staying 
within the boundaries laid out in Step 0. If you’re struggling to get going at this stage, following sample probing questions can help you get fired up:

