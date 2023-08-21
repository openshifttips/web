---
title: Get settings used in install-config
tags:
  - Admin Tasks
  - Configuration
emoji: ⚙️
#link: https://access.redhat.com/solutions/4985441
---

# Get Settings used in install config

```sh
oc get cm -n kube-system cluster-config-v1 -o yaml
```
