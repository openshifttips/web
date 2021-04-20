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

The kubelet configuration is provided by the systemd unit file in `/etc/systemd/system/kubelet.service` which is created by the `01-worker-kubelet` (for workers) or `01-master-kubelet` machineconfig. In current OpenShift versions, that unit sets the `-v` parameter as per `KUBELET_LOG_LEVEL` environment variable, so customizing the log level is as simple as setting that variable through a drop-in for the `kubelet` systemd service unit, like this:

* Connect to the node via `oc debug node`

```
oc debug node/<node>
...
chroot /host
```

* Create a systemd drop-in that sets `KUBELET_LOG_LEVEL` to the desired value (4 in our example)

```
cat <<EOF > /etc/systemd/system/kubelet.service.d/40-logging.conf 
[Service]
Environment="KUBELET_LOG_LEVEL=4"
EOF
```

* Reload systemd and restart the service:

```
systemctl daemon-reload
systemctl restart kubelet
```

Alternatively, this drop-in could be specified via machineconfig if the log levels of all the nodes need to be changed.

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

# Using netcat for file transfer from emergency shell
Sometimes things go so badly that we end up with node in emergency shell. With this we can copy off journal (or any other relevant file) outside of that shell so we can attach it to a bug report or examine it with other tools.
First off save the journal to a file:
```
journalctl > journal.log
```
On the receving end run:
```
nc -l -p 1234 > journal.log
```
And then on the emergency console:
```
nc -w 3 [destination] 1234 < journal.log
```
You'll end up with journal.log on the destination
