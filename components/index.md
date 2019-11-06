---
title: Components
permalink: /components/
---

In the Keboola Connection platform, most of the data processing functions are implemented in **Components**. 
* TOC
{:toc}

In Keboola Connection platform most of the data processing functions are implemented in **Components**. 
Components are divided into three main categories:

- [**Extractors**](/components/extractors/) -- bring data into a Keboola Connection project.
- [**Writers**](/components/writers/) -- send processed data into a target system.
- [**Applications**](/components/applications/) -- process complex data.

All components, regardless of their category, behave the same way. To use a component, you have to 
create a **configuration** first. A configuration is used to set the necessary parameters for each 
component (e.g., credentials and other specification of what to do). Then it can be run
--- a **Job** is created and does the actual work.

## Creating Component Configuration
To create a new component configuration, select *Components* from the top navigation and then select one of the
component categories (extractor, writer, or application):

{: .image-popup}
![Screenshot - Create Configuration](/components/configuration-1.png)

The following page shows a list of the currently existing configurations (extractors in this example)
in the project. To create a new configuration of a new component, 
use the **Directory** or the **Add New Extractor** button.

{: .image-popup}
![Screenshot - Extractors List](/components/configuration-2.png)

Use the search field to find the component you want to use and click the component tile to 
add a new component (Currency Rates extractor in this case):

{: .image-popup}
![Screenshot - Search Component](/components/configuration-3.png)

The following page describes in detail what the component does and allows you to create a new configuration 
using the **New Configuration** button.

{: .image-popup}
![Screenshot - Component Detail](/components/configuration-4.png)

In the dialog, enter a name for the configuration. If a component has a single configuration in your project, 
the name is not that important. However, for components with multiple configurations 
(e.g., configured with different credentials) 
the names should meaningfully distinguish one configuration from another.

{: .image-popup}
![Screenshot - Create Configuration](/components/configuration-5.png)

The next page shows a form for configuring the component, this varies heavily between different components.
Component configuration can range from trivial (as in the case of the 
[Currency extractor](/components/extractors/other/currency-rates/)) to very complex
ones (e.g., [Adwords extractor](/components/extractors/marketing-sales/google-adwords-reports/)). The configuration
complexity badge shown in the component list gives you a rough idea of what to expect.

{: .image-popup}
![Screenshot - Set Parameters](/components/configuration-6.png)

When you set the parameters and **Save** them, you can actually run the component using the **Run Component** button:

{: .image-popup}
![Screenshot - Run Configuration](/components/configuration-7.png)

When you run a component, a [Job](/management/jobs/) is created and subsequently executed. The right panel shows the last executed jobs
with an indication of their status:

- yellow -- running
- red -- failed
- green -- successful

You can click each job to view its [details](/management/jobs/), including the tables it reads from your project and 
the tables it produced in your project.

### Configuration Versions
Configuration parameters can be changed at any time. Every change to a configuration is recorded 
in the history of **versions**. You can also change the name and description of the configuration at any time. 
The configuration description supports rich text formatting using [Markdown](https://ghost.org/blog/markdown/).

{: .image-popup}
![Screenshot - Configuration Name and Description](/components/configuration-13.png)

The bottom right panel shows a list of the configuration versions. To see their full list, use the links. 
The version list is complete and allows you to compare adjacent versions or revert to any previous version.

{: .image-popup}
![Screenshot - Version List](/components/configuration-8.png)

When you compare two versions, a difference of the raw JSON configurations is shown. 

{: .image-popup}
![Screenshot - Version Differences](/components/configuration-9.png)

When you rollback a configuration, a new version is created. This means that you never lose any version of
a configuration and there is always an option to get back to it. Configuration versions are also created when 
the configurations are manipulated programmatically using [the API](https://developers.keboola.com/overview/api/).

{: .image-popup}
![Screenshot - Configuration Rollback](/components/configuration-10.png)

You can also use the version list to create a **Copy of the configuration**:

{: .image-popup}
![Screenshot - Configuration Copy](/components/configuration-11.png)

You can customize the name of the configuration copy:

{: .image-popup}
![Screenshot - Configuration Create Copy](/components/configuration-12.png)

The copy of the configuration is created as a new isolated configuration -- i.e., there is no link 
between the original configuration and the copy, and the changes to one have no effect on the other.
The copy of the configuration is created as a new isolated configuration -- i.e. there is no link 
between the original configuration and the copy and changes to one have no effect on the other.

### Configuration Rows
Some components support the concept of multiple configurations sharing some parameters in common. A typical
example are database extractors, where multiple tables are extracted and they all share the same database credentials.
In such components, the configuration itself contains only the credentials and tables are stored in **configuration rows**.
The *configuration* acts as an envelope for the *configuration rows*.

The following example shows a configuration of [AWS S3 extractor](/components/extractors/storage/aws-s3/)
with three configuration rows:

{: .image-popup}
![Screenshot - Configuration Rows](/components/configuration-14.png)

Each row can individually be modified or deleted. You can also disable a row which means that if the entire 
configuration is ran, the row will be skipped. You can also run a single row explicitly. Jobs which run only
a single row have the label **partial**. Therefore, you can for
example create a configuration which on a scheduled run extracts all the enable tables and also contains some tables, which 
share the same credentials but are updated manually (or in a different orchestration).

You can add as many rows as you like, the list of configuration rows is fully searchable. You can also change the order of the
rows. The order is maintained during processing, so you can use this to for example extract the large tables first. The
order of rows has no effect on your project, because a Job is finished only after each row has been processed.

### Configuration Rows Versions
Changes to configuration rows are part of the [configuration versioning](#configuration-versions). The following image shows that
the versions in th configuration page list changes to the configuration rows -- both that a table was added and that it was modified.

{: .image-popup}
![Screenshot - Configuration Rows All Versions](/components/configuration-15.png)

That means that each configuration version contains a complete set of its rows. This is important when copying or rolling back a 
version -- you can do these operations safely without worrying about rows.

When you edit a configuration row, there is a also a list of **row versions**. Row versions show changes only to the single
row. You can rollback a row to a previous version without interacting with the other rows.

{: .image-popup}
![Screenshot - Rows Versions](/components/configuration-16.png)

Note that you cannot copy a configuration row to a new configuration. You always have to copy the entire
configuration.

## Authorization
Many services support authorization using the [OAuth protocol](https://en.wikipedia.org/wiki/OAuth). For you (as the end user)
it means that the service does not require entering credentials (username, password, token, etc.). Instead you are 
redirected to the service itself where you authorize the Keboola Connection component. Then you are redirected back to 
Keboola Connection and you can set other parameters and run the configuration. 

The OAuth authorization process begins with the **Authorize** button (in this example the
[Google calendar extractor](/components/extractors/communication/google-calendar/) is shown):

{: .image-popup}
![Screenshot - Authorization](/components/authorization-1.png)

In the next step, you can choose authorization method:

- **Instant**: Use this method if you have direct access to the account; the authorization will be done immediately.
- **External**: If you need to authorize access to the service from someone who does not have an account in Keboola Connection, you can generate an external link, which will guide them through this process.

OAuth authorization is a very secure authorization method in which you don't have to hand over the 
credentials to your account. The consumer -- Keboola Connection component -- obtains only the minimal required 
access.  The authorization is only valid for the configuration in which it was created and for its **copies**.

### Instant Authorization
Instant authorization requires that you are can actually login to the service you want to use.
With instant authorization, you have to enter a name describing the account, you're going to use:

{: .image-popup}
![Screenshot - Instant Authorization](/components/authorization-1.png)

Next, you are taken to the actual authorization screen. This is provided by the service itself and varies a lot. 
In the example below, the authorization for Google calendar is shown.

{: .image-popup}
![Screenshot - Service Authorization](/components/authorization-3.png)

### External Authorization
External account can be used in cases where you do not have direct access to the service and the 
service *account owner* can't share the credentials with you. For example 
they can belong to a different company or department, or sharing the credentials would leak some permissions.
In such cases you can ask the account owner to authorize the component configuration for you.

The first step is to generate the authorization link:

{: .image-popup}
![Screenshot - Generate link](/components/authorization-4.png)

Then you can copy the link and send it to the account owner. The link is valid for 48 hours, if it expires you have to 
regenerate it and resend it to the account owner.

{: .image-popup}
![Screenshot - Copy link](/components/authorization-5.png)

When the *account owner* clicks the link they're taken to a special page. There they can confirm what
are they authorizing and who requested the action, then they can click on the **Authorize Account** to proceed:

{: .image-popup}
![Screenshot - External Authorization page](/components/authorization-6.png)

In the next step, the account owner has to enter the account name:

{: .image-popup}
![Screenshot - External Authorization](/components/authorization-7.png)

Then they are taken to the actual authorization screen. This is provided by the service itself and varies a lot. 
In the example below, the authorization for Google calendar is shown.

{: .image-popup}
![Screenshot - Service Authorization](/components/authorization-3.png)

### Resetting authorization
You can reset an existing authorization using the **Reset** button.

{: .image-popup}
![Screenshot - Reset Authorization](/components/authorization-8.png)

This invalidates the authorization obtained from the service and allows you to reauthorize the configuration.
Note that if you reset the authorization of a configuration which was copied, all the copies will lose the authorization.
The authorization can also be revoked from within the service, in that case the configuration will stop working
and you have to reset and reauthorize the configuration.

## Advanced Mode
For more features, switch the configuration of each table to the **Power User Mode** by clicking the *JSON editor* link.
Through editing the full JSON configuration you can set up the component (all options are
described in the component repository) and also the processors (to learn more about processors, 
see the [Developers Docs](https://developers.keboola.com/extend/docker-runner/processors/)).

{: .image-popup}
![Screenshot - Advanced](/components/configuration-17.png)

Changing the JSON configuration may render the visual form unable to represent the configuration, and switching back may
be disabled. Reverting such changes will re-enable the visual form. But whenever possible, the JSON will translate back
to the visual form and vice versa.
