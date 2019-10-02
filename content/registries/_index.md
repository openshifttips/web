---
title: "Registries"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 22
---

# Configure insecure registry

```
oc patch image.config.openshift.io/cluster -p \
'{"spec":{"allowedRegistriesForImport":[{"domainName":"my.own.registry.example.com:8888","insecure":true}],"registrySources":{"insecureRegistries":["my.own.registry.example.com:8888"]}}}'
```
