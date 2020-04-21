---
title: "Cluster"
date: 2020-04-21T15:22:20+02:00
lastmod: 2020-04-21T15:22:20+02:00
publishdate: 2020-04-21T15:30:20+02:00
draft: false
weight: 13
---

# Move from 3 masters (control-plane) to 3 masters + workers cluster (control-plane + compute nodes)
OCP4 allows to deploy control-plane only clusters or control-plane + compute nodes clusters. If you only deploy control-plane, the masters are labeled as workers as well, otherwise, they are labeled only as 'masters.

If you want to add workers to a control-plane only cluster, you should do the following:

## Create computes

Once the computes are provisioned and ready as in:

```
oc get nodes
```

You need to label them as:
```
oc label nodes ocp4-worker-0.example.com node-role.kubernetes.io/infra="" 
oc label nodes ocp4-worker-1.example.com node-role.kubernetes.io/infra=""
oc get nodes
```
Note: you may want to remove the node-role.kubernetes.io="" label from the masters, up to you.

## Move the router to the compute nodes

```	
oc patch ingresscontroller default -n openshift-ingress-operator --type=merge --patch='{"spec":{"nodePlacement":{"nodeSelector": {"matchLabels":{"node-role.kubernetes.io/infra":""}}}}}'
oc patch --namespace=openshift-ingress-operator --patch='{"spec": {"replicas": 2}}' --type=merge ingresscontroller/default
oc get pods -n openshift-ingress -o wide
```

## Move the registry and the monitoring stack to the infra nodes

```
oc patch configs.imageregistry.operator.openshift.io/cluster -n openshift-image-registry --type=merge --patch '{"spec":{"nodeSelector":{"node-role.kubernetes.io/infra":""}}}'
oc get pods -n openshift-image-registry -o wide
```

By default, there is no ConfigMap in place to control placement of monitoring components. Create the ConfigMap in the openshift-monitoring project:

```
cat <<EOF | oc apply -n openshift-monitoring
apiVersion: v1
kind: ConfigMap
metadata:
		name: cluster-monitoring-config
		namespace: openshift-monitoring
data:
		config.yaml: |+
		alertmanagerMain:
				nodeSelector:
				node-role.kubernetes.io/infra: ""
		prometheusK8s:
				nodeSelector:
				node-role.kubernetes.io/infra: ""
		prometheusOperator:
				nodeSelector:
				node-role.kubernetes.io/infra: ""
		grafana:
				nodeSelector:
				node-role.kubernetes.io/infra: ""
		k8sPrometheusAdapter:
				nodeSelector:
				node-role.kubernetes.io/infra: ""
		kubeStateMetrics:
				nodeSelector:
				node-role.kubernetes.io/infra: ""
		telemeterClient:
				nodeSelector:
				node-role.kubernetes.io/infra: ""
EOF

oc get pods -n openshift-monitoring -o wide
```
