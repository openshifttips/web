---
title: Extract Infrastructure ID (infraID)
tags:
  - Openshift 4
  - oc
emoji: 🔧
link: https://docs.openshift.com/container-platform
---

### Extract Infrastructure ID (infraID) using the oc command

```
oc get -o jsonpath='{.status.infrastructureName}{"\n"}' infrastructure cluster
```

### Extract Infrastructure ID (infraID) from $install_dir

```
jq -r '."*installconfig.ClusterID".InfraID' .openshift_install_state.json'
jq -r .infraID metadata.json
```
