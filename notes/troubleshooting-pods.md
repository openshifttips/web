---
title: Troubleshooting Running and Terminated Pods
tags:
  - Troubleshooting
emoji: 🧰
---

All containers, even those that run for a short period to time, generate logs. These logs are retained even after the container terminates. The following examples shows how to view the logs from inside the pod.

```bash
$ oc logs pod-name

#If pod contains multiple containers then specify using -c
$ oc logs pod-name -c container-name
```

Using the example below you can generate a new pod based on your deployment with an interactive shell running as root instead of the default entry point. This will allow you to verify environmental variables, access to network services, and permissions inside of the pod.

```bash
$ oc debug deployment/deployment-name --as-root
```
