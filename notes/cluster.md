---
title: "Cluster"
date: 2020-04-21T15:22:20+02:00
lastmod: 2020-04-21T15:22:20+02:00
publishdate: 2020-04-21T15:30:20+02:00
draft: false
weight: 14
tags:
  - Cluster 

---

# Move from a three-node cluster to a regular 3 control-plane + workers


# Move from 3 masters (control-plane) to 3 masters + workers cluster (control-plane + compute nodes)

OCP4 allows to deploy control-plane only clusters or control-plane + compute nodes clusters. If you only deploy control-plane, the masters are labeled as workers as well, otherwise, they are labeled only as masters.

OCP4 can be deployed as a three-node cluster or 3 control-plane + compute nodes clusters.
If you deploy a three-node cluster, the masters are labeled as workers as well, otherwise, they are labeled only as masters.

If you want to add workers to a a three-node cluster, you should do the following:

## Create computes

First step is to add the desired compute nodes and scaling up the required
`MachineSet` replicas as explained in the official documentation:

```sh
oc get nodes

NAME                                         STATUS   ROLES           AGE     VERSION
kni1-worker-0.example.com   Ready    worker          3m31s   v1.20.0+bafe72f
kni1-worker-1.example.com   Ready    worker          2m31s   v1.20.0+bafe72f
kni1-worker-2.example.com   Ready    worker          3m24s   v1.20.0+bafe72f
kni1-vmaster-0              Ready    master,worker   20h     v1.20.0+bafe72f
kni1-vmaster-1              Ready    master,worker   20h     v1.20.0+bafe72f
kni1-vmaster-2              Ready    master,worker   20h     v1.20.0+bafe72f
```

You need to label them as:

```sh
oc label nodes ocp4-worker-0.example.com node-role.kubernetes.io/worker=""
oc label nodes ocp4-worker-1.example.com node-role.kubernetes.io/worker=""
oc get nodes
```

Note: you may want to remove the node-role.kubernetes.io/worker="" label from the masters, up to you.

## Move the router to the compute nodes

```sh
oc patch ingresscontroller default -n openshift-ingress-operator --type=merge --patch='{"spec":{"nodePlacement":{"nodeSelector": {"matchLabels":{"node-role.kubernetes.io/worker":""}}}}}'
oc patch --namespace=openshift-ingress-operator --patch='{"spec": {"replicas": 2}}' --type=merge ingresscontroller/default
oc get pods -n openshift-ingress -o wide
```

## Move the registry and the monitoring stack to the compute nodes

```sh
oc patch configs.imageregistry.operator.openshift.io/cluster -n openshift-image-registry --type=merge --patch '{"spec":{"nodeSelector":{"node-role.kubernetes.io/worker":""}}}'
oc get pods -n openshift-image-registry -o wide
```

By default, there is no ConfigMap in place to control placement of monitoring components. Create the ConfigMap in the openshift-monitoring project:

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

## Setting the control-plane nodes as NoSchedulable

This point is optional as you may want to keep your control-plane nodes schedulable (for example if you are running >=OCPv4), otherwise, you may want to add a `NoSchedule` taint as:

```sh
for master in $(oc get nodes --selector="node-role.kubernetes.io/master" -o name); do oc adm taint ${master} node-role.kubernetes.io/master:NoSchedule; done
```

To learn more about taints you can check the [Kubernetes taint documentation](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration).

If what you prefer is to patch the scheduler to don't schedule any workload in the control-plane nodes you may execute:

```sh
oc patch schedulers.config.openshift.io/cluster --type merge --patch '{"spec":{"mastersSchedulable": false}}'
```

This will remove the worker label from the masters. The OCP components will be eventually moved to the workers as instructed by their node selectors but that process will only happen when the pods are rescheduled. This operation can be performed by deleting the pods and letting OpenShift reconciliation to reschedule them.

## Routers

Rollout the latest deployment to force rescheduling the router pods without losing availability:

```
oc rollout -n openshift-ingress restart deployment/router-default
```

Or delete the router pods to force the reconciliation:

```
oc delete pod -n openshift-ingress -l ingresscontroller.operator.openshift.io/deployment-ingresscontroller=default
```

## Image-registry

Rollout the latest deployment to force rescheduling the image-registry pod:

```
oc rollout -n openshift-image-registry restart deploy/image-registry
```

Or delete the image-registry pod to force the reconciliation:

```
oc delete pod -n openshift-image-registry -l docker-registry=default
```

## Monitoring stack

Rollout the latest deployments and statefulsets to force rescheduling the monitoring stack pods:

```
oc rollout -n openshift-monitoring restart statefulset/alertmanager-main
oc rollout -n openshift-monitoring restart statefulset/prometheus-k8s
oc rollout -n openshift-monitoring restart deployment/grafana
oc rollout -n openshift-monitoring restart deployment/kube-state-metrics
oc rollout -n openshift-monitoring restart deployment/openshift-state-metrics
oc rollout -n openshift-monitoring restart deployment/prometheus-adapter
oc rollout -n openshift-monitoring restart deployment/telemeter-client
oc rollout -n openshift-monitoring restart deployment/thanos-querier
```

Or delete the pods to force the reconciliation:

```
oc delete pod -n openshift-monitoring -l app=alertmanager
oc delete pod -n openshift-monitoring -l app=prometheus
oc delete pod -n openshift-monitoring -l app=grafana
oc delete pod -n openshift-monitoring -l app.kubernetes.io/name=kube-state-metrics
oc delete pod -n openshift-monitoring -l k8s-app=openshift-state-metrics
oc delete pod -n openshift-monitoring -l name=prometheus-adapter
oc delete pod -n openshift-monitoring -l k8s-app=telemeter-client
oc delete pod -n openshift-monitoring -l app.kubernetes.io/component=query-layer
```

# List all container images running in a cluster

https://kubernetes.io/docs/tasks/access-application-cluster/list-all-running-container-images/

```sh
oc get pods -A -o go-template --template='{{range .items}}{{range .spec.containers}}{{printf "%s\n" .image -}} {{end}}{{end}}' | sort -u | uniq
```

# List all container images stored in a cluster

```sh
for node in $(oc get nodes -o name);do oc debug ${node} -- chroot /host sh -c 'crictl images -o json' 2>/dev/null | jq -r .images[].repoTags[]; done | sort -u
```
