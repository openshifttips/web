---
title: List all images in a cluster
tags:
  - Openshift 4
  - Capacity
  - Images
emoji: 🎓
link: https://docs.openshift.com/container-platform
---

## List all container images running in a cluster

https://kubernetes.io/docs/tasks/access-application-cluster/list-all-running-container-images/

```
oc get pods -A -o go-template --template='{{range .items}}{{range .spec.containers}}{{printf "%s\n" .image -}} {{end}}{{end}}' | sort -u | uniq
```

## List all container images stored in a cluster

```
for node in $(oc get nodes -o name);do oc debug ${node} -- chroot /host sh -c 'crictl images -o json' 2>/dev/null | jq -r .images[].repoTags[]; done | sort -u
```