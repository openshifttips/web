---
title: "Routers"
tags:
  - Routers
---

# Scale routers

```sh
oc patch \
   --namespace=openshift-ingress-operator \
   --patch='{"spec": {"replicas": 1}}' \
   --type=merge \
   ingresscontroller/default
```
