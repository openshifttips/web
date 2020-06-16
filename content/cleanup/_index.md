---
title: "Clean up"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 12
---

# Delete 'Completed' pods

During the installation process, a few temporary pods are created. Keeping those
pods as 'Completed' doesn't harm nor waste resources but if you want to delete
them to have only 'running' pods in your environment you can use the following
command:

```
oc delete pod --field-selector=status.phase==Succeeded --all-namespaces
```
