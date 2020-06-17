---
title: Cleanup completed pods
tags:
  - Openshift 4
  - Admin Tasks
  - Cleanup
emoji: 🧹
link: https://docs.openshift.com/
---

Cleanup and remove old pods which are in `completed` state.

```bash
oc get pods --all-namespaces | awk '{if ($4 == "Completed") system ("oc delete pod " $2 " -n " $1 )}'
```