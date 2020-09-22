---
title: Patch image pull policy
tags:
  - Openshift 4
  - Images
emoji: 🎞️
link: https://docs.openshift.com/container-platform/4.5/openshift_images/managing_images/image-pull-policy.html
---

# Patch image pull policy

```
oc patch dc mydeployment -p '{"spec":{"template":{"spec":{"containers":[{"imagePullPolicy":"IfNotPresent","name":"mydeployment"}]}}}}'
```