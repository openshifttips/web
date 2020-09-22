---
title: Add HTPasswd authentication
tags:
  - Openshift 4
  - Configuration
  - Secrets
emoji: 🤐
link: https://docs.openshift.com/container-platform
---

# Add HTPasswd authentication 

This tip is aimed at OpenShift 4 only.

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