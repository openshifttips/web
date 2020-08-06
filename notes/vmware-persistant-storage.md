---
title: VMware UPI Dynamic Storage Folder
tags:
  - Openshift 4
  - VMWare
emoji: 💾
link: https://access.redhat.com/solutions/4563591
---

With a VMware UPI installation you have to create a specific folder matching the cluster name specified in `install-config.yaml` under the `metadata.name` key, plus a unique identifier. More details are in the KCS linked above.

```
4m56s       Warning   ProvisioningFailed   persistentvolumeclaim/testing    Failed to provision volume with StorageClass "test": folder '/ktzdc/vm/ocp4-nztvm' not found
```

Given the following `install-config.yaml` you would need create a `VM and Template Folder` in the path specified `/ktzdc/vm/ocp4-nztvm`. Ensure to select `VM and Template Folder` **not** a 'Storage Folder'.

```
apiVersion: v1
baseDomain: ktz.lan
compute:
- hyperthreading: Enabled
  name: worker
  replicas: 0
controlPlane:
  hyperthreading: Enabled
  name: master
  replicas: 3
metadata:
  name: ocp4
platform:
  vsphere:
    vcenter: 192.168.1.240
    username: adminstrator@vsphere.lan
    password: supersecretpassword
    datacenter: ktzdc
    defaultDatastore: nvme
fips: false 
pullSecret: 'YOUR_PULL_SECRET'
sshKey: 'YOUR_SSH_PUBKEY'
```
