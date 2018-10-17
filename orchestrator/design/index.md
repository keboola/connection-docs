---
title: Design
permalink: /orchestrator/design/
---

Setting [tasks](/orchestrator/tasks/) for an orchestration or creating [nested orchestrations](/orchestrator/tasks/nesting/)
is fairly easy. These are the tools to organize repetitive work happening in your project. The difficult task is
*how to use those tools* to organize your project.

The design decision depends on many factors - what is the purpose of the project, how big the data are, how often they update, how often they can be updated, how complicated are dependencies between operations. The approaches described below are some typical ways how projects can be organized. There are no limitations in the platform limiting how you do stuff. We highly recommend that you consult the design decisions with your
[Maintainer](todo) or [Partner](/#keboolas-partners-program) as they may be able to provide valuable experience.

## Pipelines
The approach we showed in the [introduction](/orchestrator/tasks/) can be described as data pipelines. This approach can be characterized as
being result driven. Once again let's assume, we have the following configurations in a project:

- Adform extractor with the `Campaigns` configuration,
- Snowflake extractor with the `Email recipient index` configuration,
- Transformations with configurations `Campaign Performance` and `Campaign Recipient` and
- Mailchimp writer with the `New recipients` configuration.

Let the dependencies between the configuration be the following:

{: .image-popup}
![Configuration Dependencies](/orchestrator/design/dependencies-1.png)

This should actually be read from the very end. Our ultimate goal is to update some recipient list using the Mailchimp writer.
To get to that goal we need to prepare the list in some required format using using the `Campaign Recipient` transformation.
This requires some `Email recipient index` and evaluated campaign performance. Because computing the campaign performance is
non-trivial, it is separated into `Campaign Performance` transformation. That transformation requires the source `Campaigns` from
Adform extractor.

This means that the each orchestration corresponds to a single data **destination**. The schedule of the orchestration is determined
by the desired frequency of the destination updates. This is a pretty straightforward approach
which should be easy to grasp by project newcomers. It is suitable when there is a limited number of data destinations and
these destinations require (mostly) divisional set of operations. Taking the above example --- if we add to that project
a facebook extractor and some transformations determining the sentiment of the comments and rating products by that sentiment --- that
would be an entirely independent data pipeline.

On the other hand, if the pipelines share some configuration, that may
cause unnecessary queuing of jobs (multiple jobs of the same configuration are serialized). In case of extractors, this may also
cause unnecessary extractions when data didn't change. Because a second pipeline is not aware that the source data was already extracted.
This can pose a problem especially if the extractions take very long to run. Consider what would happen if the following were the
actual project schema:

{: .image-popup}
![Complex Configuration Dependencies](/orchestrator/design/dependencies-2.png)

Pros:

- straightforward approach
- easy to understand with clear dependencies
- easy to maintain
- good when the project consists of independent pipelines
- no need to care about source and destination tables too much
- good for quick iterations, prototyping and ad-hoc data processing
- data is fetched as needed --- it is always current
- easy modifications when evolving the project

Cons:

- the more the pipelines overlap, the less efficient it becomes (credit-vise)
- difficult reusability of existing configurations
- may become a mess if more and more overlapping pipelines are added

## Good Old ETL
Another approach is to build the project orchestrations around the concept of [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load).
This means: first *extract* from every used data source, then cleanup the data and convert them into destination shape using
*transform*ations and lastly --- *load* the data into destination systems using writers.

The design can then proceed in the following path. Configure the data sources and determine what is the wanted/possible update frequency.
Create one (giant) orchestration which has all extractors in the extractor phase, all transformations in the transformation phase and
all writers in the writers phase. The transformation phase may need to be split up to multiple phases if there are some dependent
transformations, or you can use nested orchestrations to handle these. The schedule of the orchestration is determined by the
lowest data-source update frequency.

Considering once again, the more complex project schema:

{: .image-popup}
![Complex Configuration Dependencies](/orchestrator/design/dependencies-2.png)

There are a couple of DB extractors from some information systems. Let's imagine that the `Subsidiary IS Additional` configuration exports
some large data from a MySQL server which has really poor performance. To not to affect other systems, the extraction is allowed to run only
once a day at 2am. By putting everything into one (giant) orchestration, we're effectively limited to run this orchestration once a day at 2am.
When all the extractions are finished, the transformations will run, and when they are finished, the processed data will be sent to their
destinations. All this is finished before the work shift starts, so that everyone is greeted with fresh data in the morning. In many situations
this is a perfect solution, but it can be improved.

There is `Subsidiary Verification` transformation which checks for consistency errors between two otherwise disconnected information
systems (Main IS and Subsidiary IS). Let's say that this produces some tables in the Subsidiary IS with errors which someone has
to correct manually. If this table is loaded once a day, the inconsistencies are fixed in the next day load. So you would be stuck with
incorrect data for a whole day.

{: .image-popup}
![Complex Configuration Dependencies + Pipeline](/orchestrator/design/dependencies-3.png)

The above can be solved by turning the highlighted sequence of configurations into a [data pipeline](#pipelines) (see above).
This means, creating a second orchestration, with the highlighted operations, this orchestration can be run e.g. every hour
so that the consistency errors are reported reasonably quickly. This is probably ok, as long as this is the only such case.
When there are more hidden pipelines like this and more orchestrations overlapping each other, the Good Old ETL scheme
starts to become a mess.

Pros:

- straightforward approach if you have a good picture of all project requirements
- 'centralized' approach, single update schedule point
- all data are current to the same moment in history
- no redundant extractions or loads (credit-vise efficient)

Cons:

- requires some thinking and organization before setting up
- everything must run in sync with the central schedule
- harder modifications as they may have side-effects

## Mirroring
A third approach is *Mirroring* and it is in a way a mix of the previous two.
It can be described as *"Bring the most current data in KBC, then do whatever you like"*. That means
that you setup a separate orchestration for every single data data source and schedule them
to run as fast possible. Then you can assume that the data you have in KBC are always current, and you
can build [pipelines](#pipelines) on top of that. The core difference is that the pipelines no longer contain the
extraction phase.

Taking the above example, you may find out that:
- `Email recipient index` takes about 3 seconds, so it can run at any schedule.
- `Campaigns` takes about 2-3 minutes, so it should probably run with a 5 minute schedule.
- `Page Comments` takes almost 30 minutes to finish, so a 30 minutes schedule is the fastest it can run.
- `Subsidiary IS Additional` can only run once a day at 2am, otherwise it overloads the server.
- `Subsidiary IS Main` can run every hour, same reason.
- `Internal IS Main` may run only every 2 hours because the IT department said so.
- `IS Auxiliary Tables` takes about 20 seconds, so it can run run at any schedule.

This way we'll end up with 7 orchestrations for extractors and 4 more orchestrations for the
remaining pipelines:

{: .image-popup}
![Mirroring Orchestrations](/orchestrator/design/dependencies-4.png)

Note: the orchestrations `O8` to `O11` of course contain the entire colored pipeline, not just the writer.
Now you can run the `Consistency Errors` configuration and it's pipeline at any schedule, without affecting the rest of
the project or causing unnecessary loads. Obviously, it's no good running it faster than hourly, because we can't
get the source data faster. With this setup, you may now realize that it's tempting to run `Reporting Main` pipeline
faster than on daily schedule.

If the nature of the data permits it (and your transformations can cope with it), it may be perfectly ok to see
everything updated every 2 hours (as that is the fastest, the core `Internal IS Main` can go). Part of the data originating from
`Subsidiary IS Additional` extraction will update only daily (perhaps as a table `Daily Subsidiary Summary`), everything else
will be 'fresh'.

When talking about the extraction speed, it ultimately boils down to the amount of data needed to be transferred.
This is the reason why in our example, the extraction from the MySQL server was split into `Subsidiary IS Main`
and `Subsidiary IS Additional`, and why the Oracle extraction was split into `Internal IS Main` and
`IS Auxiliary Tables`.

Pros:

- easy evolution of the project
- pipelines may be added as needed without interfering with existing ones
- existing data pipelines can be easily modified
- creating new pipelines is easier as the data is already present in the project
- all data is always (reasonably) current

Cons:

- more complicated setup
- possibly wasting credits when extraction run more often than they're used
- needs some research about the extraction times
- needs organization of Storage to clearly mark read-to-use data

## Conclusions
KBC platform has very few constraints on the execution of tasks. That means there is no one true way of
doing things. Here we have outlined three possible logical approaches. Whether they are suitable for you
or not is best determine by consulting with your [Maintainer](todo) or [Partner](/#keboolas-partners-program).
You may of course also combine them or do things your own way.
