---
title: "Pull Secrets"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 22
---

# Update pull secret without reinstalling

The pull secret required to be able to pull images from the Red Hat registries
is stored in the `pull-secret` secret hosted in the `openshift-config`
namespace.

It is just a matter of modifying that secret with the updated one (in base64):

```
oc edit secret -n openshift-config pull-secret
```

NOTE: That secret is translated by the machine-config operator into the
`/var/lib/kubelet/config.json` file so in order to update it is required for the
hosts to be rebooted (which is done automatically by the mc operator)

# Opt out telemetry

```
oc -n openshift-config create secret generic pull-secret --from-file=.dockerconfigjson=<(oc extract secret/pull-secret -n openshift-config --to=- | jq -M 'del(.auths["cloud.openshift.com"])') --dry-run=client -o yaml | oc -n openshift-config apply --filename=-
```

NOTE: This will trigger a reboot in all the nodes.
