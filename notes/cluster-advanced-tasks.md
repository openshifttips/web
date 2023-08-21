---
title: Add workers to a `ControlPlane` only cluster
tags:
  - Admin Tasks
emoji: 🎓
link: https://docs.openshift.com/container-platform
---

## Change cluster type

OpenShift 4 allows to deploy control-plane only clusters or control-plane + compute nodes clusters. If you only deploy control-plane, the masters are labeled as workers as well, otherwise, they are labeled only as masters.

If you want to add workers to a control-plane only cluster, you should do the following:

### Create computes

Once the computes are provisioned and ready as in:

```sh
oc get nodes
```

You need to label them as:

```sh
oc label nodes ocp4-worker-0.example.com node-role.kubernetes.io/worker=""
oc label nodes ocp4-worker-1.example.com node-role.kubernetes.io/worker=""
oc get nodes
```

Note: you may want to remove the `node-role.kubernetes.io/worker=""` label from the masters, up to you.

### Move the router to the compute nodes

```sh
oc patch ingresscontroller default -n openshift-ingress-operator --type=merge --patch='{"spec":{"nodePlacement":{"nodeSelector": {"matchLabels":{"node-role.kubernetes.io/worker":""}}}}}'
oc patch --namespace=openshift-ingress-operator --patch='{"spec": {"replicas": 2}}' --type=merge ingresscontroller/default
oc get pods -n openshift-ingress -o wide
```

### Move the registry and the monitoring stack to the compute nodes

```sh
oc patch configs.imageregistry.operator.openshift.io/cluster -n openshift-image-registry --type=merge --patch '{"spec":{"nodeSelector":{"node-role.kubernetes.io/worker":""}}}'
oc get pods -n openshift-image-registry -o wide
```

By default, there is no ConfigMap in place to control placement of monitoring components. Create the ConfigMap in the `openshift-monitoring` project:

```yaml
cat <<EOF | oc apply -n openshift-monitoring -f -
apiVersion: v1
kind: ConfigMap
metadata:
		name: cluster-monitoring-config
		namespace: openshift-monitoring
data:
		config.yaml: |+
		alertmanagerMain:
				nodeSelector:
				node-role.kubernetes.io/worker: ""
		prometheusK8s:
				nodeSelector:
				node-role.kubernetes.io/worker: ""
		prometheusOperator:
				nodeSelector:
				node-role.kubernetes.io/worker: ""
		grafana:
				nodeSelector:
				node-role.kubernetes.io/worker: ""
		k8sPrometheusAdapter:
				nodeSelector:
				node-role.kubernetes.io/worker: ""
		kubeStateMetrics:
				nodeSelector:
				node-role.kubernetes.io/worker: ""
		telemeterClient:
				nodeSelector:
				node-role.kubernetes.io/worker: ""
EOF

oc get pods -n openshift-monitoring -o wide
```

### Setting the control-plane nodes as `NoSchedulable`

This point is optional as you may want to keep your control-plane nodes `schedulable` (for example if you are running >=OCPv4), otherwise, you may want to add a `NoSchedule` taint as:

```sh
for master in $(oc get nodes --selector="node-role.kubernetes.io/master" -o name); do oc adm taint ${master} node-role.kubernetes.io/master:NoSchedule; done
```

To learn more about taints you can check the [Kubernetes taint documentation](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration).

If what you prefer is to patch the scheduler to don't schedule any workload in the control-plane nodes you may execute:

```sh
oc patch schedulers.config.openshift.io/cluster --type merge --patch '{"spec":{"mastersSchedulable": false}}'
```
