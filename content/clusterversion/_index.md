---
title: "Cluster version"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 14
---

# Switch clusterversion channel

```bash
oc patch \
   --patch='{"spec": {"channel": "prerelease-4.1"}}' \
   --type=merge \
   clusterversion/version
```

# Unmanage operators

(via https://github.com/openshift/cluster-version-operator/blob/master/docs/dev/clusterversion.md#setting-objects-unmanaged)

For testing purposes the CVO can unmanage some operators, so you can alter
objects without the CVO stomping on your changes by overriding the specific
operator spec in the clusterversion object.

To get a list of current overrides:

```bash
oc get -o json clusterversion version | jq .spec.overrides
```

To add an entry to that list, you can use a JSON Patch to add a [ComponentOverride](https://godoc.org/github.com/openshift/api/config/v1#ComponentOverride). For example, to set the network operator's deployment unmanaged:

## Get the operator deployment information

* [Extract the OpenShift payloads](oc/#extract-the-openshift-payloads-aka-files-assets-etc).

* Observe the operator definition (api group, kind, name, namespace):

```bash
head -n5 /tmp/mystuff/0000_07_cluster-network-operator_03_daemonset.yaml
```

In this case:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: network-operator
  namespace: openshift-network-operator
```

**Note:** In this case, even if the file uses `daemonset`, it is in a `deployment` instead.

## Create the patch yaml file

* If there are currently no other overrides configured:

```bash
cat <<EOF >version-patch.yaml
- op: add
  path: /spec/overrides
  value:
  - kind: Deployment
    group: apps
    name: cluster-network-operator
    namespace: openshift-network-operator
    unmanaged: true
EOF
```

* To add to list of already existing overrides:

```bash
cat <<EOF >version-patch.yaml
- op: add
  path: /spec/overrides/-
  value:
  - kind: Deployment
    group: apps
    name: cluster-network-operator
    namespace: openshift-network-operator
    unmanaged: true
EOF
```

Observe the `path` differences if there are overrides already.

## Patch the clusterversion object

```bash
oc patch clusterversion version --type json -p "$(cat version-patch.yaml)"
```

You can verify the update with:

```bash
oc get -o json clusterversion version | jq .spec.overrides
```

Output:

```json
[
  {
    "group": "apps",
    "kind": "Deployment",
    "name": "cluster-network-operator",
    "namespace": "openshift-network-operator",
    "unmanaged": true
  }
]
```

After updating the ClusterVersion, you can make your desired edits to the unmanaged object.


# Disabling the cluster-version operator
(via https://github.com/openshift/cluster-version-operator/blob/master/docs/dev/clusterversion.md#disabling-the-cluster-version-operator)

When you just want to turn off the cluster-version operator instead of fiddling with per-object overrides, you can:

```bash
oc scale --replicas 0 -n openshift-cluster-version deployments/cluster-version-operator
```
