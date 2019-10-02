---
title: "Cluster version"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 14
---

# Switch clusterversion channel

```
oc patch \
   --patch='{"spec": {"channel": "prerelease-4.1"}}' \
   --type=merge \
   clusterversion/version
```
