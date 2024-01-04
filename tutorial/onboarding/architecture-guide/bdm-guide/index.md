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

It is inevitable that during the following phases the team will encroach on some of those “no-go” areas. Just call it out, put the post-it on the side, 
or mark it visibly as something that no more time is being spent on at this time.

### Step 1 – Storm
During this step we will create as many “objects” as we can think of. Keep in mind that whatever existing systems are in place or planned are completely 
irrelevant. Don’t limit yourself to “what we have data about today” etc. – work diligently to get your audience out of that mind set 
(sometimes difficult with a technical audience, but necessary nevertheless).  

Let’s stick to the e-commerce example. Everyone grabs a marker and a stack of post-its (use the SAME COLOR of post-its for everyone – may we suggest yellow?). 
Then we’ll just start talking about the business – it actually rolls quite simply. Someone says – there is “Order” and writes it down. Someone else says 
“Order has Lines”, on those are “Products”, they belong to “Brands” - and three post-its are used. Brainstorming rules apply, everything goes, 
there’s no editing or arguing, only adding. 

Use “Yes, and…” every time. The outcome of this stage is a LOT of post-its, go until no one can think of anything else – while of course staying 
within the boundaries laid out in Step 0. If you’re struggling to get going at this stage, following sample probing questions can help you get fired up:

{: .image-popup}
![Brain Storming](/tutorial/onboarding/architecture-guide/bdm-guide/desk.png)

- What do you sell?
- What “words” pop up in your mind about your business? [Own internal business lingo]
- How do you categorize them?
- Is there a business catalog?
- Who are the key stakeholders?
- What type of customers exist in the business?

### Step 2 – Edit & Define
Bring on the whiteboard. Hopefully, it’s clean by this point. Start putting things on. First, the location doesn’t matter, but with practice you will recognize
patterns (and you’ll put “customer-like” objects to the left, “transaction-like” objects to the right, which will save time later. Every time when putting 
a new post-it on the board, go through these three steps:

#### Group
Does this post-it belong to some that is already there? (examples - “customer” versus “person” or “account”). Are they really all different things (then keep them separate) or different names for the same thing (then put them on top of each other).

#### Classify & demote
Is this an object (going to the left) or “transaction” (going to the right). The signs of transaction are usually presence of a date and/or time, 
and possibly a numerical value. Transaction is not an object, it is an interaction between a few (“order” is an object – it exists on its own. 

“Order receipt” is a transaction, an event, something that happened to/with the “order” object (we received it). Some objects will lose that status in this step. 
For example, if you have an “eye color” post-it because it came out of the Storming stage - is it really an object, or is it a property of one? Or “Price”, 
is that an object or a value?

This is when the two other colors of the post-its become handy. Use one for “properties” and one for “key values”. When demoting an object to a property or value, 
just rewrite the name on a post-it of the appropriate color, discard the original, and place the new one on the board near the object it is related to – property 
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

**Important:** It is imperative to confirm everything with the whole group at this stage. Do not make assumptions based on experiences or 
point of views – it is very easy to “steamroll” the participants and insert one’s own opinions rather than learning what the customer truly thinks.

At the end of this step, we have clear groups and well defined objects on the board. Well, the reality is – very often we find out during this step 
(and any of the following one) that we forgot an object. Can we add it? Absolutely. Go ahead. More is better.

### Step 3 – Organize
{: .image-popup}
![Organize](/tutorial/onboarding/architecture-guide/bdm-guide/post-its-step3.png)

OK, so at this point we have more or less logically arranged groups of post-its on the whiteboard. The goal of this step is to get from more or less logically
arranged to true model – something highly arranged. Which really means just moving the groups around a bit and drawing arrows between them.
Take a higher-altitude view, ignore the properties and values for a moment. How do the major objects relate to each other?

#### Parent – child
Most of the relationships will be those of Parent – Child, or in data relations speak, one-to-many A.K.A. 1:M. Different words, same thing. 
A customer has (or can have) multiple orders, but each order belongs just to one customer. Each shipment belongs to a particular order, but one order can be
shipped in multiple packages. An order has multiple products on it. But each product… Wait a minute.

#### Attribution
You see what I did there? Obviously, order and product have M:N, or many-to-many, relationship. The same product will (we hope) be on multiple orders. 
How are the two linked then? There needs to be a table that ATTRIBUTES one to another. Yeah, I’m being obvious here, in this case it’s clearly the Order Line –
which, besides other information (such as amount, price etc.) represents the link between Order and Product, being a child of both.

However, attribution is not always that “easy”. Sometimes we know that objects relate to each other, but there isn’t a transaction or another object handy 
that would conveniently connect the two. In those cases, we’re free to make one up. Call it “attribution” for now, it may have no other properties apart from 
the fact of facilitation of a M:N relationship between two objects. An example may be a “product” and a “category”, or any kind of tagging (many objects 
can have the same tag / one object can have many tags).

#### Transitivity
Transitivity ensues when there are multiple paths from a child (or object on the right of the board) to a parent (or object somewhere more to the left 
of the board). Those are generally undesirable, signs of situations where an object actually represents multiple different entities. Drill in, find out why 
they’re popping up. The only situation when we (reluctantly) let them pass is when there is NO scenario in hell where these multiple paths could lead to different
“parents”. That usually means that we have either self-reference, or hidden M:N problem.

#### Missing links
Sometimes we get stuck with a relationship that is 1:M, all good, but there’s just something missing. That is usually exactly what is happening - we’re missing 
an object. Either we forgot about it, or it was never defined in the first place; it is not uncommon for us to name such object and just see the “aha” moment in 
the faces of the customers, even though we’re the outsiders and they (think they) know their business inside out. The customer may say: “but we don’t have data 
for that!” – don’t let that derail you. If it exists, we can infer its existence, and sooner or later, a change will happen to the business that will provide the 
data, because it just makes sense.

### Step 4 – Test
{: .image-popup}
![Test](/tutorial/onboarding/architecture-guide/bdm-guide/post-its-step4.png)

Testing the BDM (congrats, you have the version 0.1 on the board by now) is purely language and mental exercise. Throw business questions at it, 
and answer them using the language on the board, while pointing to the objects you are using. What are the sales by product category? That’s a total of Price 
times Quantity on Order Lines that refer to Products that are Attributed to that Category. If you’re missing an object, something is wrong. If you’re not 
following an arrow (against the direction is permissible) at any given point, something is wrong. Question it and drill in.

### Step 5 – Iterate
OK, so we’re reasonably happy with it. Now the question - what is missing? Depending on the complexity, time of day, quality of coffee served etc., you may either 
get an enthusiastic response, or just an exhausted “looks good to me” answer. If the former, go at it, if the later, let people sleep on it and reconvene roughly 
a week later.

## Examples & Templates
### Using Templates
What follows is a section of templates or patterns that have tendency to repeat themselves. After all, there are only so many ways how to describe invoice, or 
recurring revenue business. Avoid the temptation of just using them as they are, without going through the process. What makes a business unique is the way they 
uniquely think about their business, and forcing standard or template just means we’re reducing them to a clone, denying them (and ourselves) the chance of 
discovering something truly exciting. So use those sparingly, as an inspiration, as a secret weapon that helps speed up the process here and there. 

Knowing the examples doesn’t make you an expert - ability to create your own, during a conversation with the customer, does. The process and the customer’s 
involvement in it has a value of its own, EVEN IF YOU END UP WITH 1:1 IMAGE OF AN TEMPLATE. Because it’s not about creating the BDM, it’s about making the 
customer understand and buy into it.

### Survey Data
Most survey systems and their API suffer from the age of excel. The data coming out is not very useful in terms of structure and requires heavy transformation, 
even though the BDM is rather simple. It’s questions and answers, right? As such, it creates a great example of usefulness of BDM - we would design ourselves in 
the corner very quickly trying to work with the data as is.

{: .image-popup}
![Survey Data](/tutorial/onboarding/architecture-guide/bdm-guide/bdm-survey.png)

### Subscription (Recurring Revenue) Business
Regardless of what is the service or widget, there is benefit in looking at the majority of businesses through the lens of “recurring revenue”. 
This basic template works in most subscription contexts (think Software as a Service, magazine subscription, gym membership and everything in between).

{: .image-popup}
![BDM Subscription](/tutorial/onboarding/architecture-guide/bdm-guide/bdm-subscription.png)

### Customer Relationship Management
That title looked better than “CRM”, but that’s what it means. Various CRM systems are notorious in how they take simple concepts and make the data very
complicated. Again, that means trap and future headache if you try to take the data as-is, without a bit of thought given to it beforehand (looking at you, 
Tableau SFDC connector!)

{: .image-popup}
![CRM](/tutorial/onboarding/architecture-guide/bdm-guide/crm-bdm.png)

### e-Commerce – Marketing Side
An e-Commerce operation is almost by definition a data-heavy affair. As mentioned in the text of this guide, we can carve out the orders, or the marketing, 
or the logistics side - each of them is a project of its own. This one is looking at the marketing side.

{: .image-popup}
![eCommerce](/tutorial/onboarding/architecture-guide/bdm-guide/bdm-ecommerce-marketing.png)
