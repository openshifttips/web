---
title: Api Resources
tags:
  - API
  - oc
emoji: ⌨️
---

# API resources

```sh
oc api-resources
```

## API resources per API group

```sh
oc api-resources --api-group config.openshift.io -o name
oc api-resources --api-group machineconfiguration.openshift.io -o name
```

# Explain resources

```sh
oc explain pods.spec.containers
```

## Explain resources per api group

```sh
oc explain --api-version=config.openshift.io/v1 scheduler
oc explain --api-version=config.openshift.io/v1 scheduler.spec
oc explain --api-version=config.openshift.io/v1 scheduler.spec.policy
oc explain --api-version=machineconfiguration.openshift.io/v1 containerruntimeconfigs
```
