---
title: "Upgrades"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 27
---

# Upgrade cluster to latest

```
oc adm upgrade --to-latest
```

# Force the update to a specific version/hash

* Get the hash of the image version

```
CHANNEL='prerelease-4.1'
curl -sH 'Accept: application/json' "https://api.openshift.com/api/upgrades_info/v1/graph?channel=${CHANNEL}" | jq .
```

* Apply the update

```
oc adm upgrade --force=true --to-image=quay.io/openshift-release-dev/ocp-release@sha256:7e1e73c66702daa39223b3e6dd2cf5e15c057ef30c988256f55fae27448c3b01.
```
