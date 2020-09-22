---
title: Apply sysctl tweaks to nodes
tags:
  - Openshift 4
  - Configuration
  - Admin Tasks
emoji: 🗂️
link: https://docs.openshift.com/container-platform/4.5/nodes/nodes/nodes-node-tuning-operator.html
---

## Apply sysctl tweaks to nodes

In order to modify sysctl parameters is recommended to create `machine configs`
to add those parameters in the `/etc/sysctl.d/` directory.

In this example, the `vm.max_map_count` parameter will be increased to `262144`
in the masters hosts:

```
cat << EOF | oc create -f -
apiVersion: machineconfiguration.openshift.io/v1
kind: MachineConfig
metadata:
  labels:
    machineconfiguration.openshift.io/role: master
  name: 99-sysctl-elastic
spec:
  config:
    ignition:
      version: 2.2.0
    storage:
      files:
      - contents:
          # vm.max_map_count=262144
          source: data:text/plain;charset=utf-8;base64,dm0ubWF4X21hcF9jb3VudD0yNjIxNDQ=
        filesystem: root
        mode: 0644
        path: /etc/sysctl.d/99-elasticsearch.conf
EOF
```