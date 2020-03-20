---
title: "Registries"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 23
---

# Configure insecure registry

```
oc patch image.config.openshift.io/cluster -p \
'{"spec":{"allowedRegistriesForImport":[{"domainName":"my.own.registry.example.com:8888","insecure":true}],"registrySources":{"insecureRegistries":["my.own.registry.example.com:8888"]}}}' --type='merge'
```

# Configure custom/insecure registry to search path in OCP 4.x

At this moment, there seems to be no way to remove/modify or append any additional entries to unqualified-search-registries line in /etc/containers/registries.conf file as of now (OCP <=4.3).

A workaround to modify the file is using a machineconfig that do the job that should be done by `image.config.openshift.io/cluster` (full control of the /etc/containers/{policy.json,registries.conf} content).

Yo have to be aware that it could gets overwritten by editing `image.config.openshift.io/cluster` which will execute `99-master/worker-<uuid>-registries` and bring back the `unqualified-search-registries` again to the file, so you must avoit to use the `image.config.openshift.io/cluster` afeter you applied the machineconfig. 


```
apiVersion: machineconfiguration.openshift.io/v1
kind: MachineConfig
metadata:
  labels:
    machineconfiguration.openshift.io/role: <MachineConfigPool>
  name: 99-<MachineConfigPool>-container-runtime
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
          source: data:text/plain;charset=utf-8;base64,<base64_content>
          verification: {}
        filesystem: root
        mode: 420
        path: /etc/containers/registries.conf
      - contents:
          source: data:text/plain;charset=utf-8;base64,<base64_content>
          verification: {}
        filesystem: root
        mode: 420
        path: /etc/containers/policy.json
    systemd: {}
  fips: false
  kernelArguments: null
  osImageURL: ""
```

> NOTE: <MachineConfigPool> possible values are **worker** or **master**.
> <base64_content> is the content you want to put into the config files.

You must apply the MachineConfig (master, worker or both it depends of your needs)
```
oc create -f 99_<MachineConfigPool>_container_runtime.yaml
```
Then wait for clusteroperators to finish and nodes to be ready and then one can confirm the modification by executing the command below:
```
oc wait mcp/<MachineConfigPool> --for condition=updated --timeout=600s
```
