---
title: "Monitoring"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 21
---

# Limit prometheus storage usage

If not configured properly, prometheus can take up all the storage on the nodes, leading to a blocked cluster. This is very common in environments where nodes are running on low storage VMs.

To limit the usage apply the following configuration:
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: cluster-monitoring-config
  namespace: openshift-monitoring
data:
  config.yaml: |
    prometheusK8s:
      retention: 24h
```
