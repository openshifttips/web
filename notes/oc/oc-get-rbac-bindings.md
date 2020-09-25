---
title: Use oc to get cluster role information
tags:
  - Openshift 4
  - oc
emoji: 🗂️
link: https://docs.openshift.com/container-platform
---

# Use `oc` to get local clusterroles

```
oc describe rolebinding.rbac -n default
```

# Describe role bindings

```
oc describe clusterrolebindings.rbac
```
