---
title: "Storage"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 30
tags:
  - Storage
---

# Get default StorageClass name

```sh
oc get sc -o jsonpath='{.items[?(@.metadata.annotations.storageclass\.kubernetes\.io/is-default-class=="true")].metadata.name}'
```

# Unbound an existing pvc from one pod to be used by another pod and retaining data

1. Scale pods to 0

```sh
oc scale --replicas=0 deployment/victoria
```

2. Edit deployment and delete volumes that make a reference to pvc

```yaml
oc edit deployment/victoria

apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    deployment.kubernetes.io/revision: "7"
    kubectl.kubernetes.io/last-applied-configuration: |
...
    spec:
      containers:
      - args:
        - -selfScrapeInterval=10s
        - -dedup.minScrapeInterval=60s
        image: victoriametrics/victoria-metrics
        imagePullPolicy: Always
        name: victoria
        ports:
        - containerPort: 8428
          protocol: TCP
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
        volumeMounts:
        - mountPath: /victoria-metrics-data
          name: victoria-data
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
      volumes:
      - name: victoria-data
        persistentVolumeClaim:
          claimName: pvc-victoria-data2
```

3. Remove claimRef to pvc on pv and make sure persistentVolumeReclaimPolicy: Retain

```yaml
oc edit pv/pv-victoria-data

apiVersion: v1
kind: PersistentVolume
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
...
spec:
  accessModes:
  - ReadWriteMany
  capacity:
    storage: 10Gi
  claimRef:
    apiVersion: v1
    kind: PersistentVolumeClaim
    name: pvc-victoria-data2
    namespace: victoria
    resourceVersion: "33452972"
    uid: 9d4fb2ac-b09d-4110-b337-1d93a34279f7
  nfs:
    path: /export/data
    server: helper.ocp4.info.net
  persistentVolumeReclaimPolicy: Retain
  volumeMode: Filesystem
status:
  phase: Bound
```

4. Make sure PV is available

```sh
oc get pv

NAME               CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
pv-victoria-data   10Gi       RWX            Retain           Available
```

At this point PV is ready to be used by another pod
