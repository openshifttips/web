---
title: "Routers"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 27
---

# Scale routers

```
oc patch \
   --namespace=openshift-ingress-operator \
   --patch='{"spec": {"replicas": 1}}' \
   --type=merge \
   ingresscontroller/default
```
