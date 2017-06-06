---
title: IP Addresses
permalink: /extractors/ip-addresses/
---

A good security practice is to block connections from unrecognized sources on the network level using a firewall or AWS security groups. 
This applies especially to the production database whose connections should not be publicly available. 
For an extra layer of security, setting up an 
[SSH Tunnel](https://help.keboola.com/extractors/database/#connecting-to-database) is also recommended.

KBC uses the following IP addresses to access external systems (including your database). Please whitelist these IP addresses in your 
firewalls to allow KBC to successfully connect to your system. This applies to all KBC components
including all extractors and writers.

## connection.keboola.com
For projects in the default US region (AWS region `us-east-1`), the following IP addresses are used:

- `34.224.0.188`
- `34.200.169.177`
- `52.206.109.126`
- `34.203.87.137`

## connection.eu-central-1.keboola.com
For projects in the EU region (AWS region `eu-central-1`), the IP addresses are not available yet.

## IP Address Ranges in JSON

We're publishing our current IP address in JSON format. To view the current IP addresses, 
download the [kbc-public-ip.json](https://help.keboola.com/extractors/ip-addresses/kbc-public-ip.json) file. 
To determine whether there have been changes since the last time that you saved the file, check the publication 
time in the current file (`syncToken` attribute) and compare it to the publication time in the last file that you saved.

The JSON file contains an array of ranges (attribute `prefixes`), each of which has these attributes:

 - `ipPrefix` — subnet mask (CIDR) 
 - `vendor` — cloud service provider 
 - `region` — cloud service region
 - `service` — Keboola application service (`syrup` for Keboola Connection components)

### Sample JSON

{% highlight json %}
{
    "syncToken": "1496657320",
    "createDate": "2017-06-05-10-08-39",
    "prefixes": [
        {
            "ipPrefix": "34.224.0.188/32",
            "vendor": "aws",
            "region": "us-east-1",
            "service": "syrup"
        },
        {
            "ipPrefix": "34.200.169.177/32",
            "vendor": "aws",
            "region": "us-east-1",
            "service": "syrup"
        },
        ...
    ]
}
{% endhighlight %}
