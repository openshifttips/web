---
title: "Registries"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 27
---

# Configure insecure registry

```
oc patch image.config.openshift.io/cluster -p \
'{"spec":{"allowedRegistriesForImport":[{"domainName":"my.own.registry.example.com:8888","insecure":true}],"registrySources":{"insecureRegistries":["my.own.registry.example.com:8888"]}}}' --type='merge'
```

# Configure custom/insecure registry to search path in OCP 4.x

In OpenShift 4, the registries configuration is managed by the [Image Registry Operator](https://docs.openshift.com/container-platform/4.3/registry/configuring-registry-operator.html). In order to modify registries parameter, it is only required to modify the `image.config.openshift.io/cluster` object, that manages  the `/etc/containers/{policy.json,registries.conf}` files content under the hood.

In OpenShift versions prior to 4.4 a missing feature of the operator is the ability to remove, modify or append any additional entry to the `unqualified-search-registries` line in the `/etc/containers/registries.conf` file to allow search in insecure registries.

Meanwhile, the current workaround is to modify the `/etc/containers/{policy.json,registries.conf}` files using a machineconfig object instead.

You need to be aware that these files will be overwritten if the `image.config.openshift.io/cluster` object is modified, as they are intended to be managed by the operator. If the object is modifed, the operator will modify the `99-master/worker-<uuid>-registries` `machineconfig` object and will bring back the previous `unqualified-search-registries` content to the file, so you must avoid to use the `image.config.openshift.io/cluster` after you applied the `machineconfig`.

The following snippet shows the content of the `machineconfig` object that modifies the `unqualified-search-registries` parameter:

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

> NOTE: `MachineConfigPool` possible values are **worker** or **master**.
> `base64_content` is the full content of the config files (including the unqualified-search-registries parameter).
> In order to get the entire content of the file, you can connect to any of the hosts and extract the content (you can use `oc debug node/<mynode>` as cluster-admin user)

Once the previous file is properly created with the proper file content and the roles to be applied (master, worker, etc.), the `MachineConfig` needs to be applied to the cluster as:

```
oc create -f 99_<MachineConfigPool>_container_runtime.yaml
```

The modification will trigger a reboot on the hosts, so in order to wait for the nodes to be ready, you can use the command below:

```
oc wait mcp/<MachineConfigPool> --for condition=updated --timeout=600s
```
