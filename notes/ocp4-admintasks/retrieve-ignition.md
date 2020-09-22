---
title: Retrieve ignition
tags:
  - Openshift 4
  - Admin Tasks
  - Secrets
emoji: 🚀
---

Retrieve the ignition files used for the purposes of adding new nodes to the cluster.

```oc
# retrieve master ignition
oc extract -n openshift-machine-api secret/master-user-data --keys=userData --to=-

# retrieve worker ignition
oc extract -n openshift-machine-api secret/worker-user-data --keys=userData --to=-
```
