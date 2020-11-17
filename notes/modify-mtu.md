---
title: Modify MTU in a second interface in workers
tags:
  - Configuration
  - Admin Tasks
emoji: 🦙
link: https://docs.openshift.com/container-platform
---

# Modify MTU in a second interface in workers

Sometimes a storage network interface is attached to nodes in order to reach an external storage. In order to improve the performance, you could need to modify the MTU in those interfaces to 9000 (aka. jumbo frames)

You can do that adding a script for the NetworkManager service in the /etc/NetworkManager/dispatcher.d/ path. But if SELinux is enabled in your installation you could have errors when NetworkManager runs that script. To fix it, you should add a new one-shot systemd service to modify the context.

In this example the MTU of the ens4 interface will change to 9000 to enable jumbo frames:

This is the script (`/etc/NetworkManager/dispatcher.d/30-mtu`) for the NetworkManager.

```sh
#!/bin/sh
MTU=9000
INTERFACE=ens4

IFACE=$1
STATUS=$2
if [ "$IFACE" = "$INTERFACE" -a "$STATUS" = "up" ]; then
    ip link set "$IFACE" mtu $MTU
fi
```

We need to encode in base64 and paste the result in the machine-config

```sh
$ cat 30-mtu | base64 -w0
IyEvYmluL3NoCk1UVT05MDAwCklOVEVSRkFDRT1lbnM0CgpJRkFDRT0kMQpTVEFUVVM9JDIKaWYgWyAiJElGQUNFIiA9ICIkSU5URVJGQUNFIiAtYSAiJFNUQVRVUyIgPSAidXAiIF07IHRoZW4KICAgIGlwIGxpbmsgc2V0ICIkSUZBQ0UiIG10dSAkTVRVCmZpCg==
```

```yaml
cat << EOF | oc create -f -
kind: MachineConfig
apiVersion: machineconfiguration.openshift.io/v1
metadata:
  name: 99-worker-mtu
  creationTimestamp:
  labels:
    machineconfiguration.openshift.io/role: worker
spec:
  osImageURL: ''
  config:
    ignition:
      version: 2.2.0
    storage:
      files:
      - filesystem: root
        path: "/etc/NetworkManager/dispatcher.d/30-mtu"
        contents:
          source: data:text/plain;charset=utf-8;base64,IyEvYmluL3NoCk1UVT05MDAwCklOVEVSRkFDRT1lbnM0CgpJRkFDRT0kMQpTVEFUVVM9JDIKaWYgWyAiJElGQUNFIiA9ICIkSU5URVJGQUNFIiAtYSAiJFNUQVRVUyIgPSAidXAiIF07IHRoZW4KICAgIGlwIGxpbmsgc2V0ICIkSUZBQ0UiIG10dSAkTVRVCmZpCg==
          verification: {}
        mode: 0755
    systemd:
      units:
        - contents: |
            [Unit]
            Requires=systemd-udevd.target
            After=systemd-udevd.target
            Before=NetworkManager.service
            DefaultDependencies=no
            [Service]
            Type=oneshot
            ExecStart=/usr/sbin/restorecon /etc/NetworkManager/dispatcher.d/30-mtu
            [Install]
            WantedBy=multi-user.target
          name: one-shot-mtu.service
          enabled: true

EOF
```
