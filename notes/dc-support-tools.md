---
title: Support tools in restricted network
tags:
  - Disconnected
  - Troubleshooting
emoji: 🧰
---

To perform `oc adm debug node` in a restricted network, copy these support tools images from upstream to your mirror Docker repository:

- `registry.redhat.io/rhel7/support-tools`
- `quay.io/openshift/origin-must-gather`

Then, configure an `ImageContentSourcePolicy` to access these images from your mirror repository. Create a local file named `support-tools-policy.yaml` and replace `<local-registry>:<local-port>` with your mirror repository:

```yaml
apiVersion: operator.openshift.io/v1alpha1
kind: ImageContentSourcePolicy
metadata:
  name: support-tools-policy
spec:
  repositoryDigestMirrors:
    - mirrors:
        - <local-registry>:<local-port>/rhel7/support-tools
      source: registry.redhat.io/rhel7/support-tools
    - mirrors:
        - <local-registry>:<local-port>/openshift/origin-must-gather
      source: quay.io/openshift/origin-must-gather
```

Apply the policy to your cluster, and wait for the nodes to reboot: `oc apply -f support-tools-policy.yaml`
