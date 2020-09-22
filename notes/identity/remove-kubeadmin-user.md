---
title: Remove kubeadmin user
tags:
  - Openshift 4
  - Configuration
  - Admin Tasks
emoji: 🗂️
link: https://docs.openshift.com/container-platform
---

# Remove kubeadmin user

Note: If you do this, ensure that you have another method of Authentication configured and be aware that if that auth backend goes down you will not be able to login to your cluster any longer.

```
oc delete secret kubeadmin -n kube-system
```