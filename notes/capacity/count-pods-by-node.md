---
title: Count pods by node
tags:
  - Openshift 4
  - Capacity
emoji: 🔢
---

Count running pods:

```bash
oc get pods -o wide --all-namespaces | grep Running | awk '{print $4, $8}' | grep -v "STATUS NODE" | sort | uniq -c | sort -rn
```

Count all pods by node:
```bash
oc get pods -o wide --all-namespaces | awk '{print $4, $8}' | grep -v "STATUS NODE" | sort | uniq -c | sort -rn
```
