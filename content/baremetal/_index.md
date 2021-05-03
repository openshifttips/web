---
title: "Baremetal"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 11
---

# Unblock a stuck `oc delete bmh` command

Sometimes, when deleting a BMH object with `oc delete bmh -n openshift-machine-api <node name>`
the delete command is stuck forever.
This happens because ironic is trying to decommision and delete stuff from the node itself, and does not always succeed with that.

To unblock the delete command, simply remove the object finalizer:
`oc patch -n openshift-machine-api <node name> -p '{"metadata":{"finalizers":null}}' --type=merge`

# Reprovisioning a node

1. for conveniency `oc project openshift-machine-api`
1. locate the correct secret, it'll have the same name as the bmh with a '-bmc-secret' postfix.
1. save the secret - `oc get secret <bmh-name-bmc-secret> -o yaml > secret.yaml`
1. save the bmh - `oc get bmh <bmh-name> -o yaml > bmh.yaml`
1. only then delete the bmh - `oc delete bmh <bmh-name>`
1. edit the `secert.yaml` file so it includes only the date, type, metadata.name and meteadata.namespace fields
1. edit the bmh.yaml so it includes only the oc spec, metadata.name and meteadata.namespace fields
1. apply - `oc apply -f secert.yaml` and then `oc apply -f bmh.yaml`

The node should start reprovisioning and be ready after a while.

# Rename a node

Evacuate the node:
```
oc adm drain NODE --ignore-daemonsets
```

Delete the node
```
oc delete node NODE
```

Make the DNS / hostname change
if hostnames are not DNS names, you can use the following command on the node itself:
```
hostnamectl set-hostname NEW-NAME
```

Delete old certificates (which are valid only for the old name) on the node:
```
sudo rm /var/lib/kubelet/pki/*
```

Reboot the server
```
sudo reboot
```

Approve csr
either use the procedure [here]({{< relref "/certificates/#sign-all-the-pending-csr">}} "here"), or look for the pending bootstrapper csr:
```
$ oc get csr
NAME        AGE     REQUESTOR                                                                   CONDITION
csr-6f9w7   33m     system:serviceaccount:openshift-machine-config-operator:node-bootstrapper   Approved,Issued
csr-8b9nm   40m     system:node:master-1.nnchange.lab.upshift.rdu2.redhat.com                   Approved,Issued
csr-c6w6n   40m     system:serviceaccount:openshift-machine-config-operator:node-bootstrapper   Approved,Issued
csr-g5fpm   31m     system:node:worker-1.nnchange.lab.upshift.rdu2.redhat.com                   Approved,Issued
csr-hsmlj   33m     system:serviceaccount:openshift-machine-config-operator:node-bootstrapper   Approved,Issued
csr-j4pct   31m     system:node:worker-0.nnchange.lab.upshift.rdu2.redhat.com                   Approved,Issued
csr-jkkh7   39m     system:node:master-2.nnchange.lab.upshift.rdu2.redhat.com                   Approved,Issued
csr-jnc5l   39m     system:node:master-0.nnchange.lab.upshift.rdu2.redhat.com                   Approved,Issued
csr-nlpmv   2m27s   system:serviceaccount:openshift-machine-config-operator:node-bootstrapper   Pending
csr-pfmcl   40m     system:serviceaccount:openshift-machine-config-operator:node-bootstrapper   Approved,Issued
csr-r2d62   40m     system:serviceaccount:openshift-machine-config-operator:node-bootstrapper   Approved,Issued

$ oc adm certificate approve csr-XXX
```

Then accept the CSR for the node service account:
```
$ oc get csr
NAME        AGE     REQUESTOR                                                                   CONDITION
csr-6f9w7   35m     system:serviceaccount:openshift-machine-config-operator:node-bootstrapper   Approved,Issued
csr-7sw7b   14s     system:node:worker-a.nnchange.lab.upshift.rdu2.redhat.com                   Pending
csr-8b9nm   41m     system:node:master-1.nnchange.lab.upshift.rdu2.redhat.com                   Approved,Issued
csr-c6w6n   41m     system:serviceaccount:openshift-machine-config-operator:node-bootstrapper   Approved,Issued
csr-g5fpm   33m     system:node:worker-1.nnchange.lab.upshift.rdu2.redhat.com                   Approved,Issued
csr-hsmlj   34m     system:serviceaccount:openshift-machine-config-operator:node-bootstrapper   Approved,Issued
csr-j4pct   33m     system:node:worker-0.nnchange.lab.upshift.rdu2.redhat.com                   Approved,Issued
csr-jkkh7   41m     system:node:master-2.nnchange.lab.upshift.rdu2.redhat.com                   Approved,Issued
csr-jnc5l   41m     system:node:master-0.nnchange.lab.upshift.rdu2.redhat.com                   Approved,Issued
csr-nlpmv   3m51s   system:serviceaccount:openshift-machine-config-operator:node-bootstrapper   Approved,Issued
csr-pfmcl   41m     system:serviceaccount:openshift-machine-config-operator:node-bootstrapper   Approved,Issued
csr-r2d62   41m     system:serviceaccount:openshift-machine-config-operator:node-bootstrapper   Approved,Issued

$ oc adm certificate approve csr-XXX
```

And you should now be able to see the node with the new name:
```
oc get nodes
```
