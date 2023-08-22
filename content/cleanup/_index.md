---
title: "Clean up"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 13
---

# Delete 'Completed' pods

During the installation process, a few temporary pods are created. Keeping those
pods as 'Completed' doesn't harm nor waste resources but if you want to delete
them to have only 'running' pods in your environment you can use the following
command:

```
oc delete pod --field-selector=status.phase==Succeeded --all-namespaces
```

# Change the image GC thresholds

Kubernetes triggers the image garbage collector by default when the 85% (image-gc-high-threshold) of the disk has been used and the image garbage collector will try to free up to the 80% (image-gc-low-threshold). To modify those parameters a kubelet config can be created and applied to a certain labeled nodes, for example:

```
oc label machineconfigpool worker custom-kubelet=enabled

cat <<EOF | oc apply -f -
apiVersion: machineconfiguration.openshift.io/v1
kind: KubeletConfig
metadata:
  name: custom-config
spec:
  machineConfigPoolSelector:
    matchLabels:
      custom-kubelet: enabled
  kubeletConfig:
    ImageGCHighThresholdPercent: 70
    ImageGCLowThresholdPercent: 60
EOF
```

WARNING: modifying the kubelet config will trigger an inmediate reboot of the affected nodes.

# Run a full /var/lib/containers/storage clean-up using podman

When running out of space under /var/lib/containers/storage you can run a full system prune using podman:

```
sudo podman system prune -a

WARNING! This will remove:
        - all stopped containers
        - all stopped pods
        - all dangling images
        - all build cache
Are you sure you want to continue? [y/N]
```

You can also skip the interactivity confirmation using the -f parameter:

```
sudo podman system prune -a -f

Deleted Pods
Deleted Containers
Deleted Images
...
```
