---
title: "Labels & Annotations"
date: 2023-04-20T16:42:20+02:00
lastmod: 2023-04-20T16:42:20+02:00
publishdate: 2023-04-20T16:42:20+02:00
draft: false
weight: 9
---

# Add label to a Node

```
oc label node NODE_NAME node-role.kubernetes.io/storage=
```
Above command is used to mark a node as a storage node using the label "node-role.kubernetes.io/storage="

# Add node selector at namespace level

In order to run the pods of a namespace on a specific node, we add can a node selector at namespace level

For example, If a node has a label "node-role.kubernetes.io/worker="

```
oc annotate namespace NAMESPACE 'openshift.io/node-selector=node-role.kubernetes.io/worker='
```

# Add taints on a node

To control the scheduling of pods on a node, we can add taints to a node.

There are different types of default Taints available. For example, the effect "NoSchedule" prevents the scheduling of pods on a node which has this taint

```
oc adm taint nodes NODE_NAME KEY=VALUE:NoSchedule
```

```
oc adm taint nodes NODE_NAME node-role.kubernetes.io/storage:NoSchedule
```
Above command prevents the scheduling of pods on the nodes using the key name "node-role.kubernetes.io/storage" and the Operator "Exists" (as we have not defined any value here). To allow pods to run on the tainted node, one must add tolerations in the pod.

```
    tolerations:
        - key: node-role.kubernetes.io/storage
          operator: Exists
          effect: NoSchedule

```

# Add tolerations at namespace level

```
oc annotate namespace NAMESPACE 'scheduler.alpha.kubernetes.io/defaultTolerations=[{"operator": "Exists", "effect": "NoSchedule", "key": "node-role.kubernetes.io/storage"}]'
```

In the above command, we added the toleration for the taint "NoSchedule" having key "node-role.kubernetes.io/storage" and the operator "Exists"