---
title: Download and extract `oc`, kubectl and `openshift-install` one liner
tags:
  - oc
  - kubectl
emoji: 🔧
link: https://docs.openshift.com/container-platform
---

# Download and extract `oc`, `kubectl` and `openshift-install` one liner

```sh
curl -sL https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-client-linux-${OCPVERSION}.tar.gz | sudo tar -C /usr/local/bin -xzf - oc kubectl
curl -sL https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-install-linux-${OCPVERSION}.tar.gz | sudo tar -C /usr/local/bin -xzf - openshift-install
```
