---
title: Use oc to get cluster role information
tags:
  - oc
emoji: 🗂️
link: https://docs.openshift.com/container-platform
---

# Use `oc` to get local `clusterroles`

```sh
oc describe rolebinding.rbac -n default
```

# Describe role bindings

```sh
oc describe clusterrolebindings.rbac
```
