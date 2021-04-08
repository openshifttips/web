---
title: "Troubleshooting"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 29
---

# Get the status of all the operators in your cluster

The following command is the easiest way to see the status of the cluster:

```
oc get clusteroperators
```

A little `addon` to the previous command very useful when you are upgrading your cluster:

```
watch -n5 oc get clusteroperators
```

# Get pods not running nor completed

A handy one liner to see the pods having issues (such as CrashLoopBackOff):

```
oc get pods -A -o wide | grep -v -E 'Completed|Running'
```

# Get cluster and operators status

Combining the previous two tips and adding some more data:

```
watch -n 30 "oc get nodes; oc get pods -A -o wide | grep -v -E 'Completed|Running'; oc get clusteroperators | grep -v 'True[[:space:]]\+False[[:space:]]\+False'; oc get clusterversion; oc get machines -A; oc get machineconfigpool"
```

# Get node logs

Display node journal:

```
oc adm node-logs <node>
```

Tail 10 lines from node journal:

```
oc adm node-logs --tail=10 <node>
```

Get kubelet journal logs only:

```
oc adm node-logs -u kubelet.service <node>
```

Grep `kernel` word on node journal:

```
oc adm node-logs --grep=kernel <node>
```

List `/var/log` contents:

```
oc adm node-logs --path=/ <node>
```

Get `/var/log/audit/audit.log` from node:

```
oc adm node-logs --path=audit/audit.log <node>
```

# Debug node issues

OCP 4.1 is based on RHCOS and it is encouraged to not ssh into the hosts.
Instead:

```
oc debug node/<node>
...
cat /host/etc/redhat-release
# If you want to use the node binaries you can:
# chroot /host
```

# Run debugging tools in the RHCOS hosts

```
oc debug node/<node>
chroot /host
podman run -it --name rhel-tools --privileged                       \
      --ipc=host --net=host --pid=host -e HOST=/host                \
      -e NAME=rhel-tools -e IMAGE=rhel7/rhel-tools                  \
      -v /run:/run -v /var/log:/var/log                             \
      -v /etc/localtime:/etc/localtime -v /:/host rhel7/rhel-tools
```

or you can specify the image used for the debug pod as:

```
oc debug node/<node> --image=rhel7/rhel-tools
```

This will allow you to run `tcpdump` and other tools. Use it with caution!!!

# Copy a file to a node

(Ab)using `oc debug`:

```
echo "test" >> ./myfile

oc debug node/<node> --image rhel7/rhel-tools -- \
  bash -c 'cat > host/tmp/myfile-remote' <(cat myfile )
```

Kudos to [Juanlu](https://github.com/juanluisvaladas)

# Modify kubelet log level

The kubelet configuration is provided by the systemd unit file in `/etc/systemd/system/kubelet.service` which is created by the `01-worker-kubelet` (for workers) or `01-master-kubelet` machineconfig. In order to modify it, the best
approach would be to modify the machineconfig with `oc edit machineconfig 01-worker-kubelet` and modify the `-v` parameter, but it will trigger a full reboot of the node. You can modify it manually for troubleshooting purposes as:

* Connect to the node via `oc debug node`

```
oc debug node/<node>
...
chroot /host
```

* Verify the content of the file:

```
systemctl cat kubelet
```

```
# /etc/systemd/system/kubelet.service
[Unit]
Description=Kubernetes Kubelet
Wants=rpc-statd.service crio.service
After=crio.service

[Service]
Type=notify
ExecStartPre=/bin/mkdir --parents /etc/kubernetes/manifests
ExecStartPre=/bin/rm -f /var/lib/kubelet/cpu_manager_state
EnvironmentFile=/etc/os-release
EnvironmentFile=-/etc/kubernetes/kubelet-workaround
EnvironmentFile=-/etc/kubernetes/kubelet-env

ExecStart=/usr/bin/hyperkube \
    kubelet \
      --config=/etc/kubernetes/kubelet.conf \
      --bootstrap-kubeconfig=/etc/kubernetes/kubeconfig \
      --rotate-certificates \
      --kubeconfig=/var/lib/kubelet/kubeconfig \
      --container-runtime=remote \
      --container-runtime-endpoint=/var/run/crio/crio.sock \
      --allow-privileged \
      --node-labels=node-role.kubernetes.io/master,node.openshift.io/os_id=${ID} \
      --minimum-container-ttl-duration=6m0s \
      --client-ca-file=/etc/kubernetes/ca.crt \
      --cloud-provider= \
      --volume-plugin-dir=/etc/kubernetes/kubelet-plugins/volume/exec \
      \
      --anonymous-auth=false \
      --v=3 \

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target

# /etc/systemd/system/kubelet.service.d/10-default-env.conf
```

* Modify the `/etc/systemd/system/kubelet.service` definition and restart the service:

```
sed -i -e 's/--v=3/--v=4/g' /etc/systemd/system/kubelet.service
systemctl daemon-reload
systemctl restart kubelet
```

# Get MCP rendered ignition

```
curl -k -H "Accept: application/vnd.coreos.ignition+json; version=3.1.0" https://<api_ip>:22623/config/<poolname>
```
for example:
```
curl -k -H "Accept: application/vnd.coreos.ignition+json; version=3.1.0" https://<api_ip>:22623/config/master
```
or
```
curl -k -H "Accept: application/vnd.coreos.ignition+json; version=3.1.0" https://<api_ip>:22623/config/worker
```
