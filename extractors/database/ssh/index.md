---
title: SSH Tunneling
permalink: /extractors/database/ssh/
---

* TOC
{:toc}

A Secure Shell (SSH) tunnel consists of encrypted tunnel created through SSH protocol connection. 
You may set up this tunnel to connect to your database server, which is located in a private network and you don't want it to be accessed directly from the internet. 
The SSH connection is encrypted and uses public - private key pair for user authorization.

{: .image-popup}
![ssh tunnel](/extractors/database/ssh/ssh-tunnel.jpg)

### Usage
To use SSH tunnel with one of our database extractors, you have to setup a *SSH proxy server*.
This server serves acts as a gateway to your private network, where your database server lies.
The extractor will then connect to this *SSH proxy server* and through it to the database server.

Follow these steps, to setup a SSH tunnel to your database server:  

#### 1. Setup SSH proxy server
Here is a very basic example [Dockerfile](https://docs.docker.com/engine/reference/builder/). 
All it does is run an sshd daemon and exposes port 22.

~~~
FROM ubuntu:14.04

RUN apt-get update

RUN apt-get install -y openssh-server
RUN mkdir /var/run/sshd

RUN echo 'root:root' |chpasswd

RUN sed -ri 's/^PermitRootLogin\s+.*/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -ri 's/UsePAM yes/#UsePAM yes/g' /etc/ssh/sshd_config        

EXPOSE 22

CMD    ["/usr/sbin/sshd", "-D"]   
~~~

This server should lie in your private network, where your database server lies, and should be accessible publicly from the internet via SSH.
The default port for SSH is 22, but you can choose different port.
  
More information about setting up SSH on your server:
[OpenSSH configuration](https://help.ubuntu.com/community/SSH/OpenSSH/Configuring).
[Dockerized SSH service](https://docs.docker.com/engine/examples/running_ssh_service/)
  

#### 2. Generate SSH key pair
In [Keboola Connection](https://connection.keboola.com) setup or edit you database extractor.
Go to **Database Credentials** and check **Enable SSH Tunnel**.
Generate SSH key pair and copy the public key to your *SSH proxy server*.
Paste it to file *public.key*.
Append it to the authorized_keys file.
  
~~~ bash
mkdir ~/.ssh
cat public.key >> ~/.ssh/authorized_keys
~~~  
  

#### 3. Setup DB extractor  

- **Host Name** - address of the DB server in private network
- **Port** - port number of the DB server
- **Username** - DB username
- **Password** - DB password
- **Database** - Database name

- **Enable SSH Tunnel** - Check to enable
- **SSH host** - this is the public address of your *SSH proxy server*
- **SSH user** - this is user on your *SSH proxy server* with the generated public key
- **SSH port** - SSH port, defualt is 22

Run **Test Credentials** and see if everything is working.

Various DB extractors could have different fields, but the principle remains.  
  

### Local Tunnel
It is also possible to use your database server as *SSH proxy server* and setup your database to only accept connections from localhost.
In this case, set the *Host Name* to 127.0.0.1. DO NOT use the word `localhost`! Our extractors have problem with that ;) 
