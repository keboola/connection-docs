---
title: Time Doctor 2
permalink: /components/extractors/other/time-doctor-2/
redirect_from:
    - /extractors/other/time-doctor-2/
---

* TOC
{:toc}

This extractor uses the [Time Doctor 2 API](https://api2.timedoctor.com/) to import data from Time Doctor 2.
## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Time Doctor 2** extractor.
You need to provide an email adress and password of a user with apropriate access rights.

To configure what data you want to extract, you can use following parameters:

## Authorization

- `email` - [REQ] Email of the user the API will be authenticated with
- `#password` - [REQ] Password of the user the API will be authenticated with
- `company_id` - [OPT] If not specified, component will fetch data for the first company
that companies endpoint will return.

## Time range settings

- `From` - [OPT] Enter timestamp in `%Y-%m-%dT%H:%M:%S` format or a relative date of valid [dateparser](https://dateparser.readthedocs.io/en/latest/) format. Defaults to now if empty.
- `To` - [OPT] Enter timestamp in `%Y-%m-%dT%H:%M:%S` format or a relative date of valid [dateparser](https://dateparser.readthedocs.io/en/latest/) format. Defaults to now if empty.

## Endpoints

 - `users` - [OPT] ***this endpoint is required for processing worklog, edit-time and timeuse endpoints***
 - `worklog` - [OPT] fetched data from [worklog](https://api2.timedoctor.com/#/Activity/getActivityWorklog) endpoint
 - `edit-time` - [OPT] fetches data from [edit-time](https://api2.timedoctor.com/#/Activity/getActivityEditTime) endpoint
 - `timeuse` - [OPT] fetches data from [timeuse](https://api2.timedoctor.com/#/Activity/getActivityTimeuse) endpoint
 - `projects` - [OPT] fetches data from [projects](https://api2.timedoctor.com/#/Projects/projects) endpoint
 - `tasks` - [OPT] fetches data from [tasks](https://api2.timedoctor.com/#/Tasks/tasks) endpoint

## Additional settings

 - `users` - [OPT] If set to false, component will truncate data in existing Keboola tables.


{: .image-popup}
![Screenshot - Time Doctor 2 Confguration](/components/extractors/other/time-doctor-2/time-doctor-2.png)

When done, **Save** the configuration. 