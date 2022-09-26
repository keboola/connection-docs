---
title: IP Addresses
permalink: /components/ip-addresses/
redirect_from:
    - /extractors/ip-addresses/

---

A good security practice is to **block connections from unrecognized sources** on the network level
using a firewall or AWS security groups. This applies especially to the production database whose
connections should not be publicly available. For an extra layer of security, setting up an
[SSH Tunnel](/components/extractors/database/#connecting-to-database) is also recommended.

To access external systems (including your database), Keboola Connection uses the below 
IP addresses. Please **whitelist** these IP addresses in your firewalls to allow Keboola Connection 
to successfully connect to your system. This applies to all components including all extractors and writers.

**Important:** These IP addresses can change in the future! For your convenience, you can programmatically
fetch and process the [list of existing IP addresses in JSON format](/components/ip-addresses/kbc-public-ip.json).
Below are listed the available [Keboola Connection Stack endpoints](https://developers.keboola.com/overview/api/#regions-and-endpoints).

## connection.keboola.com
For projects in the default AWS US [region](/overview/#regions) (AWS region `us-east-1`), 
the following IP addresses are currently used:

{% comment %}
ALERT: when changing those, change also /components/ip-addresses/kbc-public-ip.json and /components/extractors/ip-addresses/kbc-public-ip.json
{% endcomment %}
- `34.224.0.188`
- `34.200.169.177`
- `52.206.109.126`
- `34.203.87.137`
- `149.72.196.5`
- `52.7.83.136`
- `52.20.72.254`

## connection.eu-central-1.keboola.com
For projects in the AWS EU [region](/overview/#regions) (AWS region `eu-central-1`), 
the following IP addresses are currently used:

{% comment %}
ALERT: when changing those, change also /components/ip-addresses/kbc-public-ip.json and /components/extractors/ip-addresses/kbc-public-ip.json
{% endcomment %}
- `35.157.170.229`
- `35.157.93.175`
- `149.72.196.5`
- `3.66.248.180`
- `3.64.150.30`


## connection.north-europe.azure.keboola.com
For projects in the Azure EU [region](/overview/#regions) (Azure region `north-europe`), 
the following IP addresses are currently used:

{% comment %}
ALERT: when changing those, change also /components/ip-addresses/kbc-public-ip.json and /components/extractors/ip-addresses/kbc-public-ip.json
{% endcomment %}
- `40.127.144.42`
- `20.82.252.94`
- `20.82.252.129`
- `20.82.252.124`

## IP Address Ranges in JSON
We are publishing our current IP addresses in JSON format. To view them,
download the [kbc-public-ip.json](/components/ip-addresses/kbc-public-ip.json) file.

To determine whether there have been changes since the last time you saved the file, check the publication
time in the current file (`syncToken` attribute) and compare it to the publication time in the last file you saved.

The JSON file contains an array of ranges (attribute `prefixes`), each of which has the following attributes:

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
