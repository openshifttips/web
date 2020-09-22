---
title: Cleanup completed pods
tags:
  - Openshift 4
  - Admin Tasks
  - Cleanup
  - Capacity
emoji: 🧹
link: https://docs.openshift.com/
---

## Delete 'Completed' pods

During the installation process, a few temporary pods are created. Keeping those pds as 'Completed' doesn't harm nor waste resources but if you want to delete them to have only 'running' pods in your environment you can use the following command:

```
oc delete pod --field-selector=status.phase==Succeeded --all-namespaces
```