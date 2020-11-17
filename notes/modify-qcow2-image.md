---
title: Edit qcow2 image with virt-edit
tags:
  - Installation
emoji: 🧹
link: https://docs.openshift.com/
---

This is useful if you need to edit a `.qcow2` file. For example, editing startup configuration of a RHCOS image.

```bash
gunzip image.qcow2.gz
virt-edit -a disk.qcow2 -m /dev/sda1 /loader.1/entries/ostree-1-rhcos.conf
gzip disk.qcow2
```
