---
title: IP Addresses
permalink: /extractors/ip-addresses/
---

A good security practice is to block connections from unrecognized sources on the network level using firewall or AWS security groups. This applies especially to production database whose connections should not be publicly available. 
For an extra layer of security, setting up a 
[SSH Tunnel](https://help.keboola.com/extractors/database/#connecting-to-database) is also recommended.

KBC uses the following IP addresses to access external systems (including your database). Please whitelist these IP addresses in you firewalls to allow KBC to successfully connect to your system. This applies to all KBC components
including all extractors and writers.

## connection.keboola.com
For projects in the default US region (AWS region `us-east-1`), the following IP addresses are used:

- `34.224.0.188`
- `34.200.169.177`
- `52.206.109.126`
- `34.203.87.137`

## connection.eu-central-1.keboola.com
For projects in the EU region (AWS region `eu-central-1`), the IP addresses are not available yet.
