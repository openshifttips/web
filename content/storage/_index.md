---
title: "Storage"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 26
---

# Get default StorageClass name

```
oc get sc -o jsonpath='{.items[?(@.metadata.annotations.storageclass\.kubernetes\.io/is-default-class=="true")].metadata.name}'
```

# Unbound and existing pvc from one pod to be used by another pod and retaining data

1.Scale pods to 0

```
oc scale --replicas=0 deployment/victoria
```

2. Edit deployment and delete references to existing pvc

```
oc edit deployment/victoria

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

```
oc edit pv/pv-victoria-data

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

```
oc get pv

NAME               CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
pv-victoria-data   10Gi       RWX            Retain           Available  
```


5. At this point PV is ready to be used by another pod
