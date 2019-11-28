---
title: "Machine config"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 19
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

* Create the proper file with your custom tweaks and encode it as base64:

```
cat << EOF | base64
server clock.redhat.com iburst
driftfile /var/lib/chrony/drift
makestep 1.0 3
rtcsync
logdir /var/log/chrony
EOF
```

* Create the MachineConfig file with the base64 string from the previous command
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

* Apply it

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

Sometimes a storage network interface is attached to nodes in order to reach an external storage. Probably you could need to modify the MTU in those interfaces. 

You can do that adding an an script in dispatcher.d for NetworkManager service in the path `/etc/NetworkManager/dispatcher.d/`. But if SELinux is enabled in your installation you could have errors when the daemon execute that script. For that you should add a new one-shot systemd service for modify the context. 

In this example the MTU of the interface `ens4` will change to `9000` (jumbo)

```
cat << EOF | oc create -f -
kind: MachineConfig
apiVersion: machineconfiguration.openshift.io/v1
metadata:
  name: 99-worker-mtu-v2
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
          source: data:,%23%21%2Fbin%2Fsh%0AMTU%3D9000%0AINTERFACE%3Dens4%0A%0AIFACE%3D%241%0ASTATUS%3D%242%0Aif%20%5B%20%22%24IFACE%22%20%3D%20%22%24INTERFACE%22%20-a%20%22%24STATUS%22%20%3D%20%22up%22%20%5D%3B%20then%0A%20%20%20%20ip%20link%20set%20%22%24IFACE%22%20mtu%20%24MTU%0Afi%0A
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
