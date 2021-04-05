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
