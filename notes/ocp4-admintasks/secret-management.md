---
title: Secret management tips
tags:
  - Openshift 4
  - Admin Tasks
  - Secrets
emoji: 🔒
link: https://docs.openshift.com/container-platform/latest/openshift_images/managing_images/using-image-pull-secrets.html
---

The following are useful commands to manage secrets in OpenShift.

## Global pull secret

To allow the cluster to reference images from a private registry, it must be added to the global pull secret.

Update the global pull secret:
```oc
oc set data secret/pull-secret -n openshift-config --from-file=.dockerconfigjson=<pull-secret-location>
```

View the global pull secret:
```oc
oc get secret/pull-secret -n openshift-config -o yaml | grep '.dockerconfigjson:' | awk '{print $2}' | base64 -d

```

## Allowing Pods to reference images from other secured registries

To use a secret for pulling images for Pods, you must add the secret to your service account. The name of the service account in this example should match the name of the service account the Pod uses. `default` is the default service account:
```oc
oc secrets link default <pull_secret_name> --for=pull
```
