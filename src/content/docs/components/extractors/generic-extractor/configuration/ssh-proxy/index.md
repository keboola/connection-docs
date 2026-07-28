---
title: SSH Proxy Configuration
slug: 'components/extractors/generic-extractor/configuration/ssh-proxy'
redirect_from:
    - /extend/generic-extractor/configuration/ssh-proxy/
---


*To configure your first Generic Extractor, follow our [tutorial](/components/extractors/generic-extractor/tutorial/).*
*Use [Parameter Map](/components/extractors/generic-extractor/map/) to help you navigate among various
configuration options.*

An SSH proxy for Generic Extractor allows you tu securely access HTTP(s) endpoints inside your private network.
It creates an SSH tunnel, and all traffic from Generic Extractor is forwarded through the tunnel to the destination server.

A sample `config` configuration can look like this:

```json
{
    ...,
    "sshProxy": {
        "host": "proxy.example.com",
        "user": "proxy",
        "port": 22,
        "#privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
    }
}
```

## Usage
Before using an SSH proxy, set up an **SSH proxy server**
to act as a gateway to your private network where your destination server resides.

Complete the following steps to set up an SSH proxy for Generic Extractor:

### 1. Set Up SSH Proxy Server
Here is a very basic [Dockerfile](https://docs.docker.com/engine/reference/builder/) example.
All it does is run an sshd daemon and expose port 22. You can, of course, set this up in your system in
a similar way without using Docker.

```dockerfile
FROM ubuntu:14.04

RUN apt-get update

RUN apt-get install -y openssh-server
RUN mkdir /var/run/sshd

RUN echo 'root:root' |chpasswd

RUN sed -ri 's/^PermitRootLogin\s+.*/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -ri 's/UsePAM yes/#UsePAM yes/g' /etc/ssh/sshd_config

EXPOSE 22

CMD    ["/usr/sbin/sshd", "-D"]
```

This server should be in the same private network where your destination server resides. It should be accessible publicly from the internet via SSH.
The default port for SSH is 22, but you can choose a different port.

We highly recommend to allow access only from the [Keboola IP address ranges](/extractors/ip-addresses/).

See the following pages for more information about setting up SSH on your server:

- [OpenSSH configuration](https://help.ubuntu.com/community/SSH/OpenSSH/Configuring)
- [Dockerized SSH service](https://docs.docker.com/engine/examples/running_ssh_service/)

### 2. Generate SSH Key Pair
Generate an SSH key pair and copy the public key to your **SSH proxy server**.
Paste it to the **public.key** file, and then append it to the authorized_keys file.

```bash
mkdir ~/.ssh
cat public.key >> ~/.ssh/authorized_keys
```

### 3. Configure Generic Extractor SSH Proxy

```json
{
    ...,
    "sshProxy": {
        "host": "your-ssh-proxy-host",
        "user": "ssh-proxy-user",
        "port": 22,
        "#privateKey": "your-generated-private-key"
    }
}
```

See [example [EX131]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/131-ssh-tunnel).
and [example [EX133]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/133-ssh-tunnel-iterations-params).
