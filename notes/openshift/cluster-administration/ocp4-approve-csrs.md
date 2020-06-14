---
title: Approve all CSRs
tags:
  - Openshift 4
  - Cluster Administration
  - CSRs
emoji: 🎓
link: https://google.com
---

Approve all pending CSRs on OCP4

```bash
oc get csr -ojson | jq -r '.items[] | select(.status == {} ) | .metadata.name' | xargs oc adm certificate approve
```