---
title: Count pods by node
tags:
  - Capacity
emoji: 🔢
---

Count running pods:

```sh
oc get pods -o wide --all-namespaces | grep Running | awk '{print $4, $8}' | grep -v "STATUS NODE" | sort | uniq -c | sort -rn
```

Count all pods by node:

```sh
oc get pods -o wide --all-namespaces | awk '{print $4, $8}' | grep -v "STATUS NODE" | sort | uniq -c | sort -rn
```
