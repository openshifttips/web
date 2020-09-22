---
title: Quotas and Limits Demo
tags:
  - Openshift 4
  - Capacity
  - Quota
emoji: 🔢
link: https://github.com/kevchu3/quotas-and-limits-demo
---

Full text and examples at the link above.

# Quotas and Limits Demo

### Setup

This demo was prepared for an audience using OpenShift 3.11.  In this demo, we will show quotas and limits applied to projects and we will spin up some sample applications to provide workloads.  To set up our application, we will import the rhel7 image into the openshift namespace.

If necessary, set up your [registry authentication] first, to allow pulling images from registry.redhat.io.

```
oc project openshift
oc create secret generic my-pull-secret --from-file=.dockerconfigjson=/root/.docker/config.json --type=kubernetes.io/dockerconfigjson
oc import-image rhel7 --from=registry.redhat.io/rhel7/rhel --confirm
```

...
