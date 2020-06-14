---
title: Display etcd member table
tags:
  - Openshift 4
  - Cluster Administration
  - etcd
emoji: 🧹
link: https://docs.openshift.com/
---

This command is useful if you need to display the members of an etcd cluster in a table view.

> Tested on OCP 4.3. Run commands from a master node.

```bash
id=$(sudo crictl ps --name etcd-member | awk 'FNR==2{ print $1}') && sudo crictl exec -it $id /bin/sh

export ETCDCTL_API=3 ETCDCTL_CACERT=/etc/ssl/etcd/ca.crt ETCDCTL_CERT=$(find /etc/ssl/ -name *peer*crt) ETCDCTL_KEY=$(find /etc/ssl/ -name *peer*key)

etcdctl member list -w table
```

TODO: Include example output of these commands