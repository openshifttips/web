---
title: "API"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 10
---

# API resources

```
oc api-resources
```

## API resources per API group

```
oc api-resources --api-group config.openshift.io -o name
oc api-resources --api-group machineconfiguration.openshift.io -o name
```

# Explain resources

```
oc explain pods.spec.containers
```

## Explain resources per api group

```
oc explain --api-version=config.openshift.io/v1 scheduler
oc explain --api-version=config.openshift.io/v1 scheduler.spec
oc explain --api-version=config.openshift.io/v1 scheduler.spec.policy
oc explain --api-version=machineconfiguration.openshift.io/v1 containerruntimeconfigs
```
