---
title: "Routers"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 28
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

# Moving routers to a specific (infra) node

Label the desired nodes with a particular label (infra) and add a taint to those nodes:

```
oc label node worker1  node-role.kubernetes.io/infra=
oc label node worker2  node-role.kubernetes.io/infra=
oc adm taint nodes -l node-role.kubernetes.io/infra infra=reserved:NoSchedule infra=reserved:NoExecute
```

Patch the `ingresscontroller` to use the nodes with specific `nodeselector` and a toleration for the previous `taint`:

```
oc patch ingresscontroller/default -n  openshift-ingress-operator  --type=merge -p '{"spec":{"nodePlacement": {"nodeSelector": {"matchLabels": {"node-role.kubernetes.io/infra": ""}},"tolerations": [{"effect":"NoSchedule","key": "infra","value": "reserved"},{"effect":"NoExecute","key": "infra","value": "reserved"}]}}}'
```
