---
title: Patch image pull policy
tags:
  - Images
emoji: 🎞️
link: https://docs.openshift.com/container-platform/4.5/openshift_images/managing_images/image-pull-policy.html
---

# Patch image pull policy

```sh
oc patch dc mydeployment -p '{"spec":{"template":{"spec":{"containers":[{"imagePullPolicy":"IfNotPresent","name":"mydeployment"}]}}}}'
```
