---
title: RHCOS image troubleshooting
tags:
  - RHCOS
  - Upgrade
  - Troubleshooting
emoji: 🧰
link: https://access.redhat.com/solutions/5414371
---

During an upgrade, due to issues, the wrong RHCOS image may be booted to. When the user performs an `oc describe node`, the error shown is `unexpected on-disk state validating against rendered-worker`. While the following steps aren't intended to determine root cause of the issue, they may be used as a quick fix to recover and successfully upgrade.

To confirm the issue:

```sh
# oc logs machine-config-daemon-66scp -n openshift-machine-config-operator -c machine-config-daemon

I0730 16:08:15.091965    2499 daemon.go:1017] Validating against current config rendered-worker-f46b7f311463bdfea3c95e3e2f04ed03
E0730 16:08:15.092113    2499 daemon.go:1244] expected target osImageURL quay.io/openshift-release-dev/ocp-v4.0-art-dev@sha256:62eeb6da08efd1a7722cce7ab709366066464f97e74d14773818abb07ce3f7a7
E0730 16:08:15.092166    2499 writer.go:135] Marking Degraded due to: unexpected on-disk state validating against rendered-worker-f46b7f311463bdfea3c95e3e2f04ed03
I0730 16:09:15.106789    2499 daemon.go:771] Current config: rendered-worker-f46b7f311463bdfea3c95e3e2f04ed03
I0730 16:09:15.106812    2499 daemon.go:772] Desired config: rendered-worker-e860d220c04fcc116d948ba0cbf00936
```

Using the example above, to force a node to update to the desired rendered worker config `rendered-worker-e860d220c04fcc116d948ba0cbf00936`:

```sh
# oc debug node $NODE -- chroot /host touch /run/machine-config-daemon-force
# oc patch node $NODE -p '{"metadata": {"annotations": {"machineconfiguration.openshift.io/currentConfig": "rendered-worker-e860d220c04fcc116d948ba0cbf00936"}}}'
```

If the above does not work to roll forward, one can attempt to perform an ostree rollback (pivot and reboot) to a previous good known RHCOS image:

```sh
# oc debug node $NODE
sh-4.2# chroot /host
sh-4.4# rpm-ostree status
State: idle
Deployments:
* pivot://quay.io/openshift-release-dev/ocp-v4.0-art-dev@sha256:77e9ace116cec652637a79449dea00c6b4af5463ca2474463549cf145bc44438
              CustomOrigin: Managed by machine-config-operator
                   Version: 45.82.202007240629-0 (2020-07-24T06:33:19Z)

  pivot://quay.io/openshift-release-dev/ocp-v4.0-art-dev@sha256:62eeb6da08efd1a7722cce7ab709366066464f97e74d14773818abb07ce3f7a7
              CustomOrigin: Managed by machine-config-operator
                   Version: 45.82.202007171855-0 (2020-07-17T18:59:14Z)
sh-4.4# mkdir -p /run/pivot
sh-4.4# touch /run/pivot/reboot-needed
sh-4.4# rpm-ostree rollback --reboot
Moving '69dff9860a1ac76f6aac71476ccb62ffd85c0084e5f2e0aa2f3ac396c3cb4142.0' to be first deployment
Bootloader updated; bootconfig swap: yes; deployment count change: 0
sh-4.4# reboot
```
