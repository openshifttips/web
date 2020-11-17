---
title: "Configuration"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 16
tags:
  - Configuration
---

# Get CRI-O settings

```sh
oc get containerruntimeconfig
```

# OCP Master configuration

The master configuration is now stored in a `configMap`. During the installation
process, a few `configMaps` are created, so in order to get the latest:

```sh
oc get cm -n openshift-kube-apiserver | grep config
```

Observe the latest id and then:

```sh
oc get cm -n openshift-kube-apiserver config-ID
```

To get the output in a human-readable form, use:

```sh
oc get cm -n openshift-kube-apiserver config-ID \
  -o jsonpath='{.data.config\.yaml}' | jq
```

For the OpenShift api configuration:

```sh
oc get cm -n openshift-apiserver config -o jsonpath='{.data.config\.yaml}' | jq
```

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

# Get Settings used in install config

```sh
oc get cm -n kube-system cluster-config-v1 -o yaml
```
