---
title: Easily change oc version
tags:
  - Openshift 4
  - oc
  - Admin Tasks
  - Installation
  - Tools
emoji: 🔧
link: https://github.com/cptmorgan-rh/install-oc-tools
---

Easily switch the version of `oc` you are using with this tool. Full docs at the link above.

```
$ ./install-oc-tools.sh --latest 4.4.5

Options:
    --latest:  Installs the latest specified version. If no version is specified then it
               downloads the latest stable version of the oc tools.
      Example: install-oc-tools --latest 4.4
    --update:  Same as --latest
    --fast:    Installs the latest fast version. If no version is specified then it downloads
               the latest fast version.
      Example: install-oc-tools --fast 4.4
    --stable:  Installs the latest stable version. If no version is specified then it
               downloads the latest stable version of the oc tools.
      Example: install-oc-tools --stable 4.4
  --candidate: Installs the candidate version. If no version is specified then it
               downloads the latest candidate version of the oc tools.
      Example: install-oc-tools --candidate 4.4
    --version: Installs the specific version.  If no version is specified then it
               downloads the latest stable version of the oc tools.
      Example: install-oc-tools --version 4.4.6
    --info:    Displays Errata URL, Kubernetes Version, and versions it can be upgraded from.
      Example: install-oc-tools --info 4.4.6
    --nightly: Installs the latest nightly version. If you do not specify a version it will grab
               the latest version.
      Example: install-oc-tools --nightly 4.4
    --cleanup: This deleted all backed up version of oc, kubectl, and openshift-install
      Example: install-oc-tools --cleanup
  --uninstall: This will delete all copies of oc, kubectl, and openshift-install including backups
      Example: install-oc-tools --uninstall
    --help:    Shows this help message
```

The tool also installs the `kubectl` and `openshift-install` commands.

## Background

Many OpenShift Developers and Administrators do not use Red Hat Enterprise Linux as their desktop. Instead many use Fedora, MacOS, Arch, Manjaro, Ubuntu, etc. This puts them in a tough situation when it comes to getting the OpenShift 4 CLI tools. You can manually go to mirror.openshift.com and download the tarballs, extract them, and copy them over. You can also download the latest client from the OpenShift console. Also, what do you do if you have multiple clusters running different version? A QA cluster on Candidate version and a Production version on the previous release?

Now there is a simple solution. install-oc-tools is a small script that will download or restore the latest, stable, fast, nightly, or specified version of the oc command line tools, kubectl, and openshift-install and copy them to /usr/local/bin. install-oc-tools detects your OS and Architecture to make sure it downloads the correct clients.

Additionally, if a previous version of the OpenShift command line tools are already installed it will make a backup of the file. This is extremely helpful if you are running multiple clusters and need to quickly switch between versions. install-oc-tools will allow you to quickly revert without the need to download the files again.

## Installation

Copy install-oc-tools (available from the linked Github repo above) to location inside of your `$PATH`.