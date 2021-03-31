---
title: "Cluster"
date: 2020-04-21T15:22:20+02:00
lastmod: 2020-04-21T15:22:20+02:00
publishdate: 2020-04-21T15:30:20+02:00
draft: false
weight: 13
---

# Move from a three-node cluster to a regular 3 control-plane + workers

OCP4 can be deployed as a three-node cluster or 3 control-plane + compute nodes clusters.
If you deploy a three-node cluster, the masters are labeled as workers as well, otherwise, they are labeled only as masters.

If you want to add workers to a a three-node cluster, you should do the following:

## Create computes

First step is to add the desired compute nodes and scaling up the required
`MachineSet` replicas as explained in the official documentation:

```
oc get nodes

NAME                                         STATUS   ROLES           AGE     VERSION
kni1-worker-0.example.com   Ready    worker          3m31s   v1.20.0+bafe72f
kni1-worker-1.example.com   Ready    worker          2m31s   v1.20.0+bafe72f
kni1-worker-2.example.com   Ready    worker          3m24s   v1.20.0+bafe72f
kni1-vmaster-0              Ready    master,worker   20h     v1.20.0+bafe72f
kni1-vmaster-1              Ready    master,worker   20h     v1.20.0+bafe72f
kni1-vmaster-2              Ready    master,worker   20h     v1.20.0+bafe72f
```

## Set control-plane nodes as NoSchedulable

```
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

```
oc get pods -A -o go-template --template='{{range .items}}{{range .spec.containers}}{{printf "%s\n" .image -}} {{end}}{{end}}' | sort -u | uniq
```

# List all container images stored in a cluster

```
for node in $(oc get nodes -o name);do oc debug ${node} -- chroot /host sh -c 'crictl images -o json' 2>/dev/null | jq -r .images[].repoTags[]; done | sort -u
```