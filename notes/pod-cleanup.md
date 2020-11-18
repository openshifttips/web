---
title: Cleanup completed pods
tags:
  - Admin Tasks
  - Cleanup
  - Capacity
emoji: 🧹
---

## Delete 'Completed' pods

During the installation process, a few temporary pods are created. Keeping those pods as `Completed` doesn't harm nor waste resources but if you want to delete them to have only `running` pods in your environment you can use the following command:

```sh
oc delete pod --field-selector=status.phase==Succeeded --all-namespaces
```
