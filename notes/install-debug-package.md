---
title: Install package to RHCOS for debugging
tags:
  - Openshift 4
  - Troubleshooting
emoji: 🧰
---

For debugging purposes, install a package that is not installed in RHCOS nor toolbox by default.

```bash
# spin up a debug pod and change to root
oc debug node/<node-name>
chroot /host

# modify toolbox to use the support tools container image
vi ~/.toolboxrc
REGISTRY=registry.redhat.io
IMAGE=rhel7/support-tools:latest
<save file>

# now launch toolbox, and as an example, install conntrack-tools
toolbox
yum install conntrack-tools
```

You may want to consider cleaning up the `~/.toolboxrc` file afterwards, to revert back to the default toolbox image.
