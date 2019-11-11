---
title: Design
permalink: /orchestrator/design/
---

Setting [tasks](/orchestrator/tasks/) for an orchestration, or creating [nested orchestrations](/orchestrator/tasks/nesting/)
is fairly easy and allows you to manage repetitive work in your project. The difficult part is *how to use these tools* 
to organize your project.

The design decision depends on many factors -- what the purpose of the project is, how big the data is, how often it updates, 
and how complicated dependencies between operations are. The approaches described below are some of the typical
ways how projects can be organized. There are no restrictions in the platform limiting how you do stuff. We highly recommend that you 
consult the design decisions with your [Maintainer](/management/organization/) as they may 
be able to provide valuable experience.

## Pipelines
The approach we showed in the [introduction](/orchestrator/tasks/) can be described as data pipelines and characterized as
result driven. Once again let's assume we have the following configurations in a project:

- Google Analytics extractor with the `Campaigns` configuration,
- Snowflake extractor with the `Email recipient index` configuration,
- Transformations with the configurations `Campaign Performance` and `Campaign Recipient`, and
- Mailchimp writer with the `New recipients` configuration.

Let the dependencies between the configurations be the following:

{: .image-popup}
![Configuration Dependencies](/orchestrator/design/dependencies-1.png)

This should actually be read from the very end. Our ultimate goal is to update a recipient list using the Mailchimp writer.
To get to that goal we need to prepare the list in a required format using the `Campaign Recipient` transformation.
This requires `Email recipient index` and evaluated campaign performance. Because computing the campaign performance is
non-trivial, it is separated into the `Campaign Performance` transformation. That transformation requires the source `Campaigns` from
the Google Analytics extractor.

This means that each orchestration corresponds to a single data **destination**. The schedule of the orchestration is determined
by the desired frequency of the destination updates. This is a pretty straightforward approach,
which should be easy to grasp by project newcomers. It is suitable when there is a limited number of data destinations and
the destinations require a (mostly) divisional set of operations. Taking the above example --- if we add to that project
a Facebook extractor and some transformations determining the sentiment of the comments and rating products by that sentiment --- that
would be an entirely independent data pipeline.

On the other hand, if the pipelines share a configuration, that may cause unnecessary queuing of jobs (multiple jobs of the same 
configuration are serialized). In case of extractors, this may also cause unnecessary extractions when data didn't change because 
a second pipeline is not aware that the source data was already extracted.
This can pose a problem especially if the extractions take very long to run. Consider what would happen if the following were the
actual project schema:

{: .image-popup}
![Complex Configuration Dependencies](/orchestrator/design/dependencies-2.png)

Pros:

- Straightforward approach
- Easy to understand with clear dependencies
- Easy to maintain
- Good when the project consists of independent pipelines
- No need to care about source and destination tables too much
- Good for quick iterations, prototyping and ad-hoc data processing
- Data is fetched as needed --- it is always current.
- Easy modifications when evolving the project

Cons:

- The more the pipelines overlap, the less efficient it becomes (credit-wise).
- Difficult reusability of existing configurations
- May become a mess if more and more overlapping pipelines are added.

## Good Old ETL
Another approach is to build the project orchestrations around the concept of [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load).
This means: first *extract* from every used data source, then clean up the data and convert it into destination shape using
*transform*ations and lastly --- *load* the data into destination systems using writers.

The design can then proceed in the following path. Configure the data sources and determine what is the wanted/possible update frequency.
Create one (giant) orchestration which has all extractors in the extractor phase, all transformations in the transformation phase and
all writers in the writers phase. The transformation phase may need to be split up to multiple phases if there are some dependent
transformations, or you can use [nested orchestrations](/orchestrator/tasks/nesting/) to handle these. The schedule of the 
orchestration is determined by the lowest data-source update frequency.

Considering once again the more complex project schema:

{: .image-popup}
![Complex Configuration Dependencies](/orchestrator/design/dependencies-2.png)

There are a couple of DB extractors from some information systems. Let's imagine that the `Subsidiary IS Additional` configuration exports
large data from a MySQL server which has really poor performance. To avoid affecting other systems, the extraction is allowed to run only
once a day at 2am. By putting everything into one (giant) orchestration, we're effectively limited to run this orchestration once a day at 2am.
When all the extractions are finished, the transformations will run, and when they are finished, the processed data will be sent to their
destinations. All this is finished before the work shift starts, so that everyone is greeted with fresh data in the morning. In many situations
this is a perfect solution, but it can be improved.

There is a `Subsidiary Verification` transformation which checks for consistency errors between two otherwise disconnected information
systems (Main IS and Subsidiary IS). Let's say that this produces some tables in the Subsidiary IS with errors which have
to be corrected manually. If this table is loaded once a day, the inconsistencies are fixed in the next day load. So you would be stuck with
incorrect data for a whole day.

{: .image-popup}
![Complex Configuration Dependencies + Pipeline](/orchestrator/design/dependencies-3.png)

The above can be solved by turning the highlighted sequence of configurations into a [data pipeline](#pipelines) (see above).
This means creating a second orchestration with the highlighted operations. This orchestration can be run (e.g., every hour)
so that the consistency errors are reported reasonably quickly. This is probably okay as long as this is the only such case.
When there are more hidden pipelines like this one and more orchestrations overlapping each other, the Good Old ETL scheme
slowly turns into a mess.

Pros:

- Straightforward approach if you have a good picture of all project requirements
- 'Centralized' approach, single update schedule point
- All data is current to the same moment in history.
- No redundant extractions or loads (credit-wise efficient)

Cons:

- Requires some thinking and organization before setting up.
- Everything must run in sync with the central schedule.
- Harder modifications as they may have side effects

## Mirroring
A third approach is *Mirroring* and it is in a way a mix of the previous two.
It can be described as *"Bring the most current data in KBC, then do whatever you like"*. That means
you set up a separate orchestration for every single data source and schedule them
to run as fast possible. Then you can assume that the data you have in KBC is always current, and you
can build [pipelines](#pipelines) on top of that. The core difference is that the pipelines no longer contain the
extraction phase.

Taking the above example, you may find out that

- `Email recipient index` takes about 3 seconds, so it can run at any schedule.
- `Campaigns` takes about 2-3 minutes, so it should probably run with a 5 minute schedule.
- `Page Comments` takes almost 30 minutes to finish, so a 30 minute schedule is the fastest it can run.
- `Subsidiary IS Additional` can only run once a day at 2am, otherwise it overloads the server.
- `Subsidiary IS Main` can run every hour for the same reason.
- `Internal IS Main` may run only every 2 hours because the IT department said so.
- `IS Auxiliary Tables` takes about 20 seconds, so it can run at any schedule.

This way we will end up with 7 orchestrations for extractors and 4 more orchestrations for the
remaining pipelines:

{: .image-popup}
![Mirroring Orchestrations](/orchestrator/design/dependencies-4.png)

*Note: The orchestrations `O8` to `O11` of course contain the entire colored pipeline, not just the writer.
Now you can run the `Consistency Errors` configuration and its pipeline at any schedule, without affecting the rest of
the project or causing unnecessary loads. Obviously, it's no good running it faster than hourly, because we can't
get the source data faster. With this setup, you may now realize that it's tempting to run the `Reporting Main` pipeline
faster than on a daily schedule.*

If the nature of the data permits it (and your transformations can cope with it), it may be perfectly okay to see
everything updated every two hours (as that is the fastest the core `Internal IS Main` can go). Part of the data originating from
the `Subsidiary IS Additional` extraction will update only daily (perhaps as a table `Daily Subsidiary Summary`), everything else
will be 'fresh'.

When talking about the extraction speed, it ultimately boils down to the amount of data needed to be transferred.
This is the reason why, in our example, the extraction from the MySQL server was split into `Subsidiary IS Main`
and `Subsidiary IS Additional`, and why the Oracle extraction was split into `Internal IS Main` and
`IS Auxiliary Tables`.

Pros:

- Easy evolution of the project
- Pipelines may be added as needed without interfering with the existing ones.
- Existing data pipelines can be easily modified.
- Creating new pipelines is easier as the data is already present in the project.
- All data is always (reasonably) current.

Cons:

- More complicated setup
- Possibly wasting credits when extractions run more often than they're used
- Needs some research about the extraction times.
- Needs organization of Storage to clearly mark read-to-use data.

## Conclusions
The KBC platform has very few constraints on the execution of tasks. That means there is no one true way of
doing things. Here we have outlined three possible logical approaches. Whether they are suitable for you
or not is best determined by consulting your Maintainer or Partner.
You may of course combine the approaches as well, or do things your own way.
