---
title: "Networking"
date: 2019-06-18T16:42:20+02:00
lastmod: 2021-01-28T17:10:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 22
---

# IPv4 IPv6 DualStack

At the time of writting this document the priority IP protocol inside and OpenShift cluster is IPv4, that means that by default the first IP that are getting the nodes, pods and services is IPv4. 

**Installation**

The `install-config.yaml` file needs to include both network configurations, IPv4 and IPv6, an example:


```
networking:
  networkType: OVNKubernetes
  machineNetwork:
  - cidr: 192.168.111.0/24
  - cidr: fd2e:6f44:5dd8:c956::/120
  clusterNetwork:
  - cidr: 10.128.0.0/14
    hostPrefix: 23
  - cidr: fd01::/48
    hostPrefix: 64
  serviceNetwork:
  - 172.30.0.0/16
  - fd02::/112
...
platform:
  baremetal:
    provisioningBridge: ostestpr
    provisioningNetworkCIDR: fd00:1101::0/64
    provisioningNetworkInterface: enp1s0
    externalBridge: ostestbm
    bootstrapOSImage: http://192.168.111.1/images/rhcos-47.83.202101161239-0-qemu.x86_64.qcow2.gz?sha256=3a14ff77b4b7a5c89d145226759c71e852bd54eb8eea50866e760c801c7b623a
    clusterOSImage: http://192.168.111.1/images/rhcos-47.83.202101161239-0-openstack.x86_64.qcow2.gz?sha256=ccc2c776ce3d4bbb7585fdf497286c3694633f609bf7aeee42c5f8c274560bd2
    apiVIP: 192.168.111.5
    ingressVIP: 192.168.111.4
```

Pay special attention to the order of the networks, first IPv4, second IPv6, at the moment that is important and mandatory.

The `IPv6DualStackNoUpgrade` _FeatureGate_ also needs to be enabled by adding the following to the list of manifests:

```
apiVersion: config.openshift.io/v1
kind: FeatureGate
metadata:
  name: cluster
spec:
  featureSet: IPv6DualStackNoUpgrade

```

**Setting up IPv4, IPv6 or DualStack in a service**

After the cluster is up and running you can test the IPv6 configuration with a Service. By default the Services are created IPv4 only, if you want to create a Service with IPv6 you have to modify the `spec.ipFamilyPolicy` setting.

The default setting is to expose only as a `SingleStack` cluster IP for the Service, using the first configured service cluster IP range (IPv4 by default):

```
apiVersion: v1
kind: Service
metadata:
  labels:
    app: hello-openshift
    app.kubernetes.io/component: hello-openshift
    app.kubernetes.io/instance: hello-openshift
  name: hello-openshift-v6
  namespace: hello-openshift
spec:
  ipFamilies:
  - IPv6
  ipFamilyPolicy: SingleStack
  ports:
  - name: 8080-tcp
    port: 8080
    protocol: TCP
    targetPort: 8080
  - name: 8888-tcp
    port: 8888
    protocol: TCP
    targetPort: 8888
  selector:
    deployment: hello-openshift
  sessionAffinity: None
  type: ClusterIP
```
In order to use DualStack, the `spec.ipFamilyPolicy` setting needs to be configured whether to `PreferDualStack` or `RequireDualStack` as:
```
apiVersion: v1
kind: Service
metadata:
  labels:
    app: hello-openshift
    app.kubernetes.io/component: hello-openshift
    app.kubernetes.io/instance: hello-openshift
  name: hello-openshift-dual
  namespace: hello-openshift
spec:
  ipFamilies:
  - IPv6
  - IPv4
  ipFamilyPolicy: PreferDualStack
  ports:
  - name: 8080-tcp
    port: 8080
    protocol: TCP
    targetPort: 8080
  - name: 8888-tcp
    port: 8888
    protocol: TCP
    targetPort: 8888
  selector:
    deployment: hello-openshift
  sessionAffinity: None
  type: ClusterIP
```

For more information about IPv4/IPv6 dual stack you can check the [upstream documentation](https://kubernetes.io/docs/concepts/services-networking/dual-stack/)
