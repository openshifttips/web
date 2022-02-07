---
title: "Operator-Lifecycle-Manager (OLM)"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 24
---

# Disable all default sources

```
oc patch operatorhub.config.openshift.io/cluster -p='{"spec":{"disableAllDefaultSources":true}}' --type=merge
```

# Use older version catalogs
This is sometimes useful when you want to install older content on a newer cluster (or the riskier opposite option).

I took a snapshot of the existing catalogsources
and modified them to point to 4.9
then disabled default sources
and applied my non default sources (under the same names) this is the procedure:

```
curl -s -L https://github.com/itaysk/kubectl-neat/releases/download/v2.0.3/kubectl-neat_linux_amd64.tar.gz | tar xvz -C ~/bin/
oc project openshift-marketplace
oc neat get catalogsource > sources.yml
sed -i 's/v4.10/v4.9/g' sources.yml
oc patch operatorhub.config.openshift.io/cluster -p='{"spec":{"disableAllDefaultSources":true}}' --type=merge
oc apply -f sources.yml
```

I'm using neat to ease getting cluster resources without all the "junk" around them (so included here the command to download that plugin).
