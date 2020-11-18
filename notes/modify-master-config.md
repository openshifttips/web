---
title: Modify Master configuration
tags:
  - Admin Tasks
  - Configuration
emoji: ⚙️
#link: https://access.redhat.com/solutions/4985441
---

## OCP Master configuration

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

For the OpenShift API configuration:

```sh
oc get cm -n openshift-apiserver config -o jsonpath='{.data.config\.yaml}' | jq
```
