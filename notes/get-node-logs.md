---
title: View Node Logs
tags:
  - Troubleshooting
emoji: 🧰
---

An OpenShift node based on Red Hat Enterprise Linux CoreOS runs very few local services that would require direct access to a node to inspect their status. Most of the system services in Red Hat Enterprise Linux CoreOS run as containers. The main exceptions are the CRI-O container engine and the Kubelet, which are Systemd units. To view these logs, use the oc adm node-logs command as shown in the following examples:

```bash
$ oc adm node-logs -u crio my-node-name

$ oc adm node-logs -u kubelet my-node-name

#To display all journal logs of a node:
$ oc adm node-logs my-node-name
```
