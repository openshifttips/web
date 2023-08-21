---
title: "Machine config"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 20
---

# NTP configuration

RHCOS uses chronyd to synchronize the system time. The default configuration
uses the `*.rhel.pool.ntp.org` servers:

```
$ grep -v -E '^#|^$' /etc/chrony.conf
server 0.rhel.pool.ntp.org iburst
server 1.rhel.pool.ntp.org iburst
server 2.rhel.pool.ntp.org iburst
server 3.rhel.pool.ntp.org iburst
driftfile /var/lib/chrony/drift
makestep 1.0 3
rtcsync
logdir /var/log/chrony
```

As the hosts configuration shouldn't be managed manually, in order to configure
chronyd to use custom servers or a custom setting, it is required to use the
`machine-config-operator` to modify the files used by the masters and workers
by the following procedure:

- Create the proper file with your custom tweaks and encode it as base64:

```
cat << EOF | base64
server clock.redhat.com iburst
driftfile /var/lib/chrony/drift
makestep 1.0 3
rtcsync
logdir /var/log/chrony
EOF
```

- Create the MachineConfig file with the base64 string from the previous command
  as:

```
cat << EOF > ./masters-chrony-configuration.yaml
apiVersion: machineconfiguration.openshift.io/v1
kind: MachineConfig
metadata:
  labels:
    machineconfiguration.openshift.io/role: master
  name: masters-chrony-configuration
spec:
  config:
    ignition:
    config: {}
      security:
        tls: {}
      timeouts: {}
      version: 2.2.0
    networkd: {}
    passwd: {}
    storage:
      files:
      - contents:
          source: data:text/plain;charset=utf-8;base64,c2VydmVyIGNsb2NrLnJlZGhhdC5jb20gaWJ1cnN0CmRyaWZ0ZmlsZSAvdmFyL2xpYi9jaHJvbnkvZHJpZnQKbWFrZXN0ZXAgMS4wIDMKcnRjc3luYwpsb2dkaXIgL3Zhci9sb2cvY2hyb255Cg==
          verification: {}
        filesystem: root
        mode: 420
        path: /etc/chrony.conf
  osImageURL: ""
EOF
```

Substitute the base64 string with your own.

- Apply it

```
oc apply -f ./masters-chrony-configuration.yaml
```

# Disable auto rebooting after a change with the machine-config-operator

Every change performed by the `machine-config-operator` triggers a reboot in the
hosts where the change needs to be performed.

In the event of having a few changes to apply (such as modify NTP, registries,
etc.) and specially for baremetal scenarios, the auto reboot feature can be
paused by setting the `spec.paused` field in the `machineconfigpool` to true:

```
oc patch --type=merge --patch='{"spec":{"paused":true}}' machineconfigpool/master
```

# Wait for a machine-config to be applied

The `machineconfigpool` condition will be `updated` so we can wait for it as:

```
oc wait mcp/master --for condition=updated
```

# Apply sysctl tweaks to nodes

In order to modify sysctl parameters is recommended to create `machine configs`
to add those parameters in the `/etc/sysctl.d/` directory.

In this example, the `vm.max_map_count` parameter will be increased to `262144`
in the masters hosts:

```
cat << EOF | oc create -f -
apiVersion: machineconfiguration.openshift.io/v1
kind: MachineConfig
metadata:
  labels:
    machineconfiguration.openshift.io/role: master
  name: 99-sysctl-elastic
spec:
  config:
    ignition:
      version: 2.2.0
    storage:
      files:
      - contents:
          # vm.max_map_count=262144
          source: data:text/plain;charset=utf-8;base64,dm0ubWF4X21hcF9jb3VudD0yNjIxNDQ=
        filesystem: root
        mode: 0644
        path: /etc/sysctl.d/99-elasticsearch.conf
EOF
```

# Modify MTU in a second interface in workers

Sometimes a storage network interface is attached to nodes in order to reach an external storage. In order to improve the performance, you could need to modify the MTU in those interfaces to 9000 (aka. jumboframes)

You can do that adding a script for the NetworkManager service in the /etc/NetworkManager/dispatcher.d/ path. But if SELinux is enabled in your installation you could have errors when NetworkManager runs that script. To fix it, you should add a new one-shot systemd service to modify the context.

In this example the MTU of the ens4 interface will change to 9000 to enable jumboframes:

This is the script (`/etc/NetworkManager/dispatcher.d/30-mtu`) for the NetworkManager.

```
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

```
$ cat 30-mtu | base64 -w0
IyEvYmluL3NoCk1UVT05MDAwCklOVEVSRkFDRT1lbnM0CgpJRkFDRT0kMQpTVEFUVVM9JDIKaWYgWyAiJElGQUNFIiA9ICIkSU5URVJGQUNFIiAtYSAiJFNUQVRVUyIgPSAidXAiIF07IHRoZW4KICAgIGlwIGxpbmsgc2V0ICIkSUZBQ0UiIG10dSAkTVRVCmZpCg==
```

```
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
