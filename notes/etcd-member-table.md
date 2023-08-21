---
title: Display etcd member table
tags:
  - Admin Tasks
  - etcd
#emoji: 🧹
link: https://access.redhat.com/solutions/4985441
---

This command is useful if you need to display the members of an etcd cluster in a table view.

> OCP 4.1 - 4.3. Run commands from a master node.

```bash
id=$(sudo crictl ps --name etcd-member | awk 'FNR==2{ print $1}') && sudo crictl exec -it $id /bin/sh

export ETCDCTL_API=3 ETCDCTL_CACERT=/etc/ssl/etcd/ca.crt ETCDCTL_CERT=$(find /etc/ssl/ -name *peer*crt) ETCDCTL_KEY=$(find /etc/ssl/ -name *peer*key)

etcdctl member list -w table
```

> OCP 4.4 and up. Run commands from a master node.

```bash
id=$(sudo crictl ps --name etcdctl | awk 'FNR==2{ print $1}') && sudo crictl exec -it $id /bin/bash

etcdctl member list -w table
```

> Sample output

```
+------------------+---------+---------+----------------------------+----------------------------+------------+
|        ID        | STATUS  |  NAME   |         PEER ADDRS         |        CLIENT ADDRS        | IS LEARNER |
+------------------+---------+---------+----------------------------+----------------------------+------------+
| 224aaea80137388e | started | master2 | https://192.168.50.62:2380 | https://192.168.50.62:2379 |      false |
| 8bc09a2def061da1 | started | master1 | https://192.168.50.61:2380 | https://192.168.50.61:2379 |      false |
| 96f34f31d2b058a7 | started | master3 | https://192.168.50.63:2380 | https://192.168.50.63:2379 |      false |
+------------------+---------+---------+----------------------------+----------------------------+------------+
```
