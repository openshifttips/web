---
title: "Baremetal"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 23
---

# Unblock a stuck `oc delete bmh` command

Sometimes, when deleting a BMH object with `oc delete bmh -n openshift-machine-api <node name>`
the delete command is stuck forever.
This happens because ironic is trying to decommision and delete stuff from the node itself, and does not always succeed with that.

To unblock the delete command, simply remove the object finalizer:
`oc patch -n openshift-machine-api <node name> -p '{"metadata":{"finalizers":null}}' --type=merge`

# Reprovisioning a node

1. for convinency `oc project openshift-machine-api`
1. locate the correct secret, it'll have the same name as the bmh with a '-bmc-secret' postfix.
1. save the secret - `oc get secret <bmh-name-bmc-secret> -o yaml > secret.yaml`
1. save the bmh - `oc get bmh <bmh-name> -o yaml > bmh.yaml`
1. only then delete the bmh - `oc delete bmh <bmh-name>`
1. edit the `secert.yaml` file so it includes only the date, type, metadata.name and meteadata.namespace fields
1. edit the bmh.yaml so it includes only the oc spec, metadata.name and meteadata.namespace fields
1. apply - `oc apply -f secert.yaml` and then `oc apply -f bmh.yaml`

The node should start reprovisioning and be ready after a while.
