---
title: "Troubleshooting"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 26
---

# Get pods not running nor completed

A handy one liner to see the pods having issues (such as CrashLoopBackOff):

```
oc get pods --all-namespaces | grep -v -E 'Completed|Running'
```

# Debug node issues

OCP 4.1 is based on RHCOS and it is encouraged to not ssh into the hosts.
Instead:

```
oc debug node/<node>
...
cat /host/etc/redhat-release
# If you want to use the node binaries you can:
# chroot /host
```

# Run debugging tools in the RHCOS hosts

```
oc debug node/<node>
chroot /host
podman run -it --name rhel-tools --privileged                       \
      --ipc=host --net=host --pid=host -e HOST=/host                \
      -e NAME=rhel-tools -e IMAGE=rhel7/rhel-tools                  \
      -v /run:/run -v /var/log:/var/log                             \
      -v /etc/localtime:/etc/localtime -v /:/host rhel7/rhel-tools
```

or you can specify the image used for the debug pod as:

```
oc debug node/<node> --image=rhel7/rhel-tools
```

This will allow you to run `tcpdump` and other tools. Use it with caution!!!

# Sign all the pending `csr`

```
oc get csr -o name | xargs oc adm certificate approve
```
