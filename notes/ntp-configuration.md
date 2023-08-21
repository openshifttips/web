---
title: NTP configuration
tags:
  - Configuration
emoji: 🗂️
link: https://docs.openshift.com/container-platform
---

## NTP configuration

RHCOS uses chronyd to synchronize the system time. The default configuration
uses the `*.rhel.pool.ntp.org` servers:

```sh
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

```sh
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

```yaml
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
