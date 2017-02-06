---
title: Secure Connection to Database
permalink: /extractors/database/connecting-to-db
---
The connection to your internal database must be well secured. If you, or your system administrator, want to avoid exposing your database server to the internet,
we highly recommend setting up an SSH Tunnel for the connection.

{: .image-popup}
![Schema - SSH tunnel](/extractors/database/ssh-tunnel.jpg)

A [Secure Shell (SSH)](https://en.wikipedia.org/wiki/Secure_Shell) [tunnel](https://en.wikipedia.org/wiki/Tunneling_protocol) consists of an encrypted connection created
through the SSH protocol connection. You can set up this tunnel to connect to your database server located in your private network that you do not want
to be accessed directly from the internet. The SSH connection is encrypted and uses public - private key pair for user authorization.

Find detailed instructions for setting up an SSH tunnel in the [developer documentation](https://developers.keboola.com/integrate/database/).
While setting up an SSH tunnel requires some work, it is the most reliable and secure option for connecting to your database server.
