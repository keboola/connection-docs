---
title: Installation
permalink: /cli/installation/
---

* TOC
{:toc}

Precompiled binaries for all platforms can be downloaded from [cli-dist.keboola.com](https://cli-dist.keboola.com/?prefix=zip/).
Otherwise, they can be installed from a platform-specific repository or built from the source.

## macOS

Installation on macOS is managed by Homebrew. If you don't have Homebrew available on your system,
[install it](https://docs.brew.sh/Installation.html) before continuing.

You can install the Keboola CLI on macOS by updating your brew repository information and running the install command:

```bash
brew install keboola/keboola-cli/keboola-cli
kbc --version
```

## Debian / Ubuntu

```bash
sudo wget -P /etc/apt/trusted.gpg.d https://cli-dist.keboola.com/deb/keboola.gpg
echo "deb https://cli-dist.keboola.com/deb /" | sudo tee /etc/apt/sources.list.d/keboola.list
sudo apt-get update
sudo apt-get install keboola-cli
kbc --version
```

## Fedora

```bash
sudo rpm --import https://cli-dist.keboola.com/rpm/keboola.gpg
echo "[keboola]
name=keboola
baseurl=https://cli-dist.keboola.com/rpm
enabled=1
gpgcheck=1
gpgkey=https://cli-dist.keboola.com/rpm/keboola.gpg
" | sudo tee /etc/yum.repos.d/keboola.repo
sudo dnf install keboola-cli
kbc --version
```

## Alpine

```bash
echo "https://cli-dist.keboola.com/apk" | sudo tee -a /etc/apk/repositories
sudo wget -P /etc/apk/keys/ https://cli-dist.keboola.com/apk/keboola.rsa.pub
sudo apk update
sudo apk add keboola-cli
kbc --version
```

## Installing from Source

1. Install the [Go environment](https://golang.org/doc/install) (if you haven't already).
2. Clone the Git source (or if you don't yet have a version of Git installed,
   [download and extract it](https://github.com/keboola/keboola-as-code/archive/refs/heads/main.zip)):

        git clone https://github.com/keboola/keboola-as-code

3. Run the installation script:

        make build-local

4. The installation script will show you the location of the built binary (e.g. `target/kbc_darwin_amd64/kbc`). 

## Next Steps

- [Getting Started](/cli/getting-started/)
- [Commands](/cli/commands/)
