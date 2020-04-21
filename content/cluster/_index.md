---
title: "Cluster"
date: 2020-04-21T15:22:20+02:00
lastmod: 2020-04-21T15:22:20+02:00
publishdate: 2020-04-21T15:30:20+02:00
draft: false
weight: 13
---

# Move from control-plane cluster to a control-plane and compute nodes cluster

## Create computes

```		
oc label nodes ocp4-worker-0.example.com node-role.kubernetes.io/infra="" 
oc label nodes ocp4-worker-1.example.com node-role.kubernetes.io/infra=""
oc get nodes
```

## Move the router to the compute nodes

```	
oc patch ingresscontroller default -n openshift-ingress-operator --type=merge --patch='{"spec":{"nodePlacement":{"nodeSelector": {"matchLabels":{"node-role.kubernetes.io/infra":""}}}}}'
oc patch --namespace=openshift-ingress-operator --patch='{"spec": {"replicas": 2}}' --type=merge ingresscontroller/default
oc get pods -n openshift-ingress -o wide
```

## Move the registry and the monitoring to the infra nodes

```
oc patch configs.imageregistry.operator.openshift.io/cluster -n openshift-image-registry --type=merge --patch '{"spec":{"nodeSelector":{"node-role.kubernetes.io/infra":""}}}'
oc get pods -n openshift-image-registry -o wide
```

By default, there is no ConfigMap in place to control placement of monitoring components. Create the ConfigMap in the openshift-monitoring project:

```
cat <<EOF > $HOME/monitoring-cm.yaml
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

oc create -f $HOME/monitoring-cm.yaml -n openshift-monitoring
oc get pods -n openshift-monitoring -o wide
```
