---
title: "Identity Providers"
date: 2019-06-12T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 18
---

# Add HTPasswd authentication (OpenShift 4 only)

## Create htpasswd file (with admin username)

```
htpasswd -c htpasswd admin
```

## Create secret in openshift-config project

```
oc create secret generic htpasswd-secret --from-file htpasswd -n openshift-config
```

## Edit cluster OAuth resource

```
cat << EOF | oc apply -f -
apiVersion: config.openshift.io/v1
kind: OAuth
metadata:
  name: cluster
spec:
  identityProviders:
  - name: htpasswd
    challenge: true
    login: true
    mappingMethod: claim
    type: HTPasswd
    htpasswd:
      fileData:
        name: htpasswd-secret
EOF
```

## Optional: grant cluster-admin role

```
oc adm policy add-cluster-role-to-user cluster-admin admin
```

# Remove kubeadmin user

```
oc delete secret kubeadmin -n kube-system
```
