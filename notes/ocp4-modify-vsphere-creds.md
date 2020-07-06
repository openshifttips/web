---
title: Modify vSphere Credentials
tags:
  - Openshift 4
  - VMWare
emoji: 💾
link: https://access.redhat.com/solutions/4618011
---

How to modify vsphere credentials in Openshift 4 after the cluster has been created. A full explanation is available in the solution linked above, this article also covers changing the default datastore.

> You will need `cluster-admin` to edit these credentials

* `oc project kube-system`
* Execute `oc edit vsphere-creds`

These credentials are base64 encoded. Here's a quick reminder of how to encode and decode base64.

```
$ echo -n "test" | base64 -w0
dGVzdA==

$ base64 -d <<< dGVzdA==
test
```
