---
title: HiBob
permalink: /components/extractors/other/hibob/
---

* TOC
{:toc}

## Introduction

HiBob is an HR management platform that offers a wide range of features to support talent management. These features include onboarding administration, task management, payroll reporting, time tracking, and a manager dashboard for tracking employee performance.

The HiBob  data source connector enables you to retrieve data from the HiBob HR platform.

## Prerequisites

Before you begin, you will need to provide the following credentials:

- **Service User ID:** To obtain this, please follow the instructions in the [HiBob documentation](https://apidocs.hibob.com/docs/api-service-users).
- **Service User Token:** Generate the token by following the same documentation.

Once you have acquired these credentials, you can proceed with the configuration.

## Configuration Guide

1. [Create a new configuration](/components/#creating-component-configuration) for the HiBob connector.
2. In the authorization section, enter the Service User ID and Service User Token.
3. Select which endpoints you want to fetch.
4. You have the option to set the `Human readable` parameter, which makes the API return object names instead of IDs.
5. In the Destination settings, you can choose between `Full Load` and `Incremental Load`.
If full load is used, the destination table will be overwritten with every run. If incremental load is used, data will be upserted into the destination table.

## Output

When you successfully load data from HiBob, the HiBob data source connector will provide you with four tables:

- `employees`: Contains employee data.
- `employee_work_history`: Provides information about employee work history.
- `employment_history`: Includes details about employment history.
- `employee_lifecycle`: Offers insights into the employee lifecycle within your organization.
