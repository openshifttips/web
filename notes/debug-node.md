---
title: Debug node
tags:
  - Troubleshooting
emoji: 🧰
---

For RHCOS systems, it is not recommended to use SSH to directly access the nodes. Instead, `oc debug node` should be run. Here are some examples:

```bash
# check how long the node has been running since last reboot
oc debug node/<node-name> -- chroot /host; uptime

# check if NetworkManager service is running
oc debug node/<node-name> -- chroot /host; systemctl status NetworkManager

# delete unused images in RHCOS node's podman
oc debug node/<node-name> -- chroot /host; podman rmi --all
```
