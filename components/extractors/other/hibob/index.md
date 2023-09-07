---
title: HiBoB
permalink: /components/extractors/other/HiBoB/
---

* TOC
{:toc}

## Introduction

HiBob is an HR management platform that provides a wide range of features supporting talent management including onboarding administration, task management, payroll reporting, time tracking, and manager dashboard for tracking employee performance.

HiBob Extractor allows you to extract data from the HiBob HR platform.
To use this extractor, you will need a Service User and Service User Token.

## Prerequisites

You'll need to obtain the following credentials:

- **Service User ID:** This can be obtained by following the instructions in the [HiBoB Documentation](https://apidocs.hibob.com/docs/api-service-users).
- **Service User Token:** You'll also need a Service User Token, which you can generate following the same documentation.

Once you have the credentials, you can proceed with the configuration.

## Configuration Guide

1. [Create a new configuration](/components/#creating-component-configuration) of the HiBob data source.
2. In the authorization section, enter the Service User ID and Service User Token.
3. Select which endpoints you want to fetch.
4. You have an option to set the `Human readable` parameter which makes the API return object's names instead of IDs.
5. In Destination settings, you have an option to chose `Full Load` or `Incremental Load`.
If Full load is used, the destination table will be overwritten every run. If incremental load is used, data will be upserted into the destination table.

## Output

When you successfully extract data from HiBob, the HiBob Extractor component will provide you with four tables:

- `employees`: Contains employee data.
- `employee_work_history`: Provides information about employee work history.
- `employment_history`: Includes details about employment history.
- `employee_lifecycle`: Offers insights into the employee lifecycle within your organization.
