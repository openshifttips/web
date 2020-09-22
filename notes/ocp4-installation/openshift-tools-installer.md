---
title: Easily manage Openshift tool versions
tags:
  - Openshift 4
  - Admin Tasks
  - Installation
  - Tools
emoji: 🎓
link: https://github.com/cptmorgan-rh/install-oc-tools
---

Many OpenShift Developers and Administrators do not use Red Hat Enterprise Linux as their desktop. Instead many use Fedora, MacOS, Arch, Manjaro, Ubuntu, etc. This puts them in a tough situation when it comes to getting the OpenShift 4 CLI tools. You can manually go to mirror.openshift.com and download the tarballs, extract them, and copy them over. You can also download the latest client from the OpenShift console. Also, what do you do if you have multiple clusters running different version? A QA cluster on Candidate version and a Production version on the previous release?

Now there is a simple solution. install-oc-tools is a small script that will download or restore the latest, stable, fast, nightly, or specified version of the oc command line tools, kubectl, and openshift-install and copy them to /usr/local/bin. install-oc-tools detects your OS and Architecture to make sure it downloads the correct clients.

Additionally, if a previous version of the OpenShift command line tools are already installed it will make a backup of the file. This is extremely helpful if you are running multiple clusters and need to quickly switch between versions. install-oc-tools will allow you to quickly revert without the need to download the files again.

# Installation

Copy install-oc-tools (available from the linked Github repo above) to location inside of your `$PATH`.