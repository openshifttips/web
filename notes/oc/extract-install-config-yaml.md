---
title: Extract install-config.yaml
tags:
  - Openshift 4
  - oc
emoji: 🔧
link: https://docs.openshift.com/container-platform
---

### Extract the install-config.yaml in the event it is needed after installation is complete

```
oc get cm cluster-config-v1 -n kube-system -o yaml
```
