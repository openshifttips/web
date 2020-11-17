---
title: Observe SDN configuration
tags:
  - Troubleshooting
  - SDN
emoji: 🌐
link: https://docs.openshift.com/container-platform/4.5/networking/openshift_sdn/about-openshift-sdn.html
---

# Observe the SDN configuration

```sh
oc get cm sdn-config -o yaml -n openshift-sdn
```

Or:

```sh
oc exec -n openshift-sdn $(oc get pods -n openshift-sdn -l app=sdn --no-headers=true -o custom-columns=:metadata.name|head -n1) cat /config/{kube-proxy-config,sdn-config}.yaml
```

# Making Master Unscheduleable/Scheduleable

To configure master as unscheduleable (when UPI installation without setting this prior to the install):

```sh
oc patch --type=merge --patch='{"spec":{"mastersSchedulable": false}}' schedulers.config.openshift.io cluster

scheduler.config.openshift.io/cluster patched
```
