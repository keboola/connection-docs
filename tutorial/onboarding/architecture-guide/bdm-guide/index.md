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

### Step 2 – Edit & Define
Bring on the whiteboard. Hopefully it’s clean by this point. Start putting things on. First, the location doesn’t matter, but with practice you will recognize
patterns (and you’ll put “customer-like” objects to the left, “transaction-like” objects to the right, which will save time later. Every time when putting 
a new stickie on the board, go through these three steps:

#### Group
Does this stickie belong to some that is already there? (examples - “customer” versus “person” or “account”). Are they really all different things (then keep them separate) or different names for the same thing (then put them on top of each other).

#### Classify & demote
Is this an object (going to the left) or “transaction” (going to the right). The signs of transaction are usually presence of a date and/or time, 
and possibly a numerical value. Transaction is not an object, it is an interaction between a few (“order” is an object – it exists on its own. 

“Order receipt” is a transaction, an event, something that happened to/with the “order” object (we received it). Some objects will lose that status in this step. 
For example, if you have an “eye color” stickie because it came out of the Storming stage - is it really an object, or is it a property of one? Or “Price”, 
is that an object or a value?

This is when the two other colors of the post-its become handy. Use one for “properties” and one for “key values”. When demoting an object to a property or value, 
just rewrite the name on a stickie of the appropriate color, discard the original, and place the new one on the board near the object it is related to – property 
on the left, value on the right of it.

#### Rename & clarify
Except for very simple use cases and very small teams, inevitably there will be different names/post-its for the same object, and disagreements 
on what a particular object actually is. Our favourite example is a “customer”, which most often suffers from both problems.

We may have post-its saying “customer”, or “contact”, or “person”, or “subscriber”, or “e-mail”. They may or may not be the same thing. 
Can a “person” have more “e-mails”? Is “customer” only a “type” or a “status” of a person?. The nuances depend on the particular business and its habits 
and terminology, but chances are all this can (and should) be reduced into one or two objects and perhaps a property.

The second issue is a definition. Who is a customer? Someone who is in our system? Someone who placed an order? Someone who paid us? Someone who took a delivery?
Often, every department has its own understanding of some terms. This is the time to clarify and define. 

One of the major benefits of having completed a BDM exercise is that it helps to unify the language within a business and amongst the stakeholders.
When we say “customer”, we mean “X”. Time to take notes to start building our dictionary. 

**IMPORTANT:** It is imperative to confirm everything with the whole group at this stage. Do not make assumptions based on experiences or 
point of views – it is very easy to “steamroll” the participants and insert one’s own opinions rather than learning what the customer truly thinks.

At the end of this step, we have clear groups and well defined objects on the board. Well, the reality is – very often we find out during this step 
(and any of the following one) that we forgot an object. Can we add it? Absolutely. Go ahead. More is better.
