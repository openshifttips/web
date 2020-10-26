---
title: Kubelet logging verbosity
tags:
  - Openshift 4
  - Configuration
emoji: 🗂️
link: https://access.redhat.com/solutions/4619431
---

## Kubelet logging verbosity

Refer to the Knowledgebase article for further details on configuring kubelet logging verbosity.

The default kubelet logging level is 4 (debug), which may not be your preference.  Refer to the following chart for a description of kubelet log verbosity:

| Verbosity | Description |
| --- | --- |
| --v=0 | Generally useful so it is ALWAYS visible to an operator. |
| --v=1 | A reasonable default log level if you don't want verbosity. |
| --v=2 | Useful steady state information about the service and important log messages that may correlate to significant changes in the system. This is the recommended default log level. |
| --v=3 | Extended information about changes. |
| --v=4 | Debug level verbosity. |
| --v=6 | Display requested resources. |
| --v=7 | Display HTTP request headers. |
| --v=8 | Display HTTP request contents. |

In this example, I have followed the article to create MachineConfigs to apply the logging level to `/etc/kubernetes/kubelet-env` which will persist across reboots.

```
apiVersion: machineconfiguration.openshift.io/v1
kind: MachineConfig
metadata:
  labels:
    machineconfiguration.openshift.io/role: master
  name: 02-kubelet-env-config-master
spec:
  config:
    ignition:
      config: {}
      security:
        tls: {}
      timeouts: {}
      version: 2.2.0
    networkd: {}
    passwd: {}
    storage:
      files:
      - contents:
          source: data:text/plain;charset=utf-8;base64,S1VCRUxFVF9MT0dfTEVWRUw9MQo=
          verification: {}
        filesystem: root
        mode: 420
        path: /etc/kubernetes/kubelet-env
  osImageURL: ""
```

```
apiVersion: machineconfiguration.openshift.io/v1
kind: MachineConfig
metadata:
  labels:
    machineconfiguration.openshift.io/role: worker
  name: 02-kubelet-env-config-worker
spec:
  config:
    ignition:
      config: {}
      security:
        tls: {}
      timeouts: {}
      version: 2.2.0
    networkd: {}
    passwd: {}
    storage:
      files:
      - contents:
          source: data:text/plain;charset=utf-8;base64,S1VCRUxFVF9MT0dfTEVWRUw9MQo=
          verification: {}
        filesystem: root
        mode: 420
        path: /etc/kubernetes/kubelet-env
  osImageURL: ""
```

Apply the MachineConfigs with:

```
oc apply -f ./02-kubelet-env-config-master.yaml
oc apply -f ./02-kubelet-env-config-worker.yaml
```
