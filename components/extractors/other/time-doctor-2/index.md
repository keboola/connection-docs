---
title: Time Doctor 2
permalink: /components/extractors/other/time-doctor-2/
redirect_from:
    - /extractors/other/time-doctor-2/
---

* TOC
{:toc}

This data source connector uses the [Time Doctor 2 API](https://api2.timedoctor.com/) to import data from Time Doctor 2.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Time Doctor 2** connector.
You need to provide an email address and the password of a user with appropriate access rights.

To configure what data you want to extract, you can use the following parameters:

### Authorization

- `email` – [REQ] Email address of the user the API will be authenticated with
- `#password` – [REQ] Password of the user the API will be authenticated with
- `company_id` – [OPT] If not specified, the component will fetch data for the first company
that the companies endpoint will return.

### Time Range Settings

- `From` - [OPT] Enter the timestamp in `%Y-%m-%dT%H:%M:%S` format or a relative date of valid [dateparser](https://dateparser.readthedocs.io/en/latest/) format. Defaults to now if empty.
- `To` - [OPT] Enter the timestamp in `%Y-%m-%dT%H:%M:%S` format or a relative date of valid [dateparser](https://dateparser.readthedocs.io/en/latest/) format. Defaults to now if empty.

### Endpoints

 - `users` – [OPT] ***this endpoint is required for the processing worklog, edit-time and timeuse endpoints***
 - `worklog`–– [OPT] fetches data from the [worklog](https://api2.timedoctor.com/#/Activity/getActivityWorklog) endpoint
 - `edit-–ime` – [OPT] fetches data from the [edit-time](https://api2.timedoctor.com/#/Activity/getActivityEditTime) endpoint
 - `timeuse` – [OPT] fetches data from the [timeuse](https://api2.timedoctor.com/#/Activity/getActivityTimeuse) endpoint
 - `projects` – [OPT] fetches data from the [projects](https://api2.timedoctor.com/#/Projects/projects) endpoint
 - `tasks` – [OPT] fetches data from the [tasks](https://api2.timedoctor.com/#/Tasks/tasks) endpoint

### Additional Settings

 - `users` - [OPT] If set to false, the component will truncate data in the existing Keboola tables.

{: .image-popup}
![Screenshot - Time Doctor 2 Configuration](/components/extractors/other/time-doctor-2/time-doctor-2.png)

When done, **save** the configuration. 
