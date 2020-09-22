---
title: Disable reboots with machine-config-operator
tags:
  - Openshift 4
  - Configuration
emoji: 📠
link: https://docs.openshift.com/container-platform
---

## Disable auto rebooting after a change with the machine-config-operator

Every change performed by the `machine-config-operator` triggers a reboot in the
hosts where the change needs to be performed.

In the event of having a few changes to apply (such as modify NTP, registries,
etc.) and specially for baremetal scenarios, the auto reboot feature can be
paused by setting the `spec.paused` field in the `machineconfigpool` to true:

```
oc patch --type=merge --patch='{"spec":{"paused":true}}' machineconfigpool/master
```

## Wait for a machine-config to be applied

The `machineconfigpool` condition will be `updated` so we can wait for it as:

```
oc wait mcp/master --for condition=updated
```