---
title: "Certificates"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 11
---

# Sign all the pending `csr`

```
oc get csr -o name | xargs oc adm certificate approve
```

# Verify the API certificates

```
echo | openssl s_client -connect api.ocp4.example.com:6443 | openssl x509 -noout -text
```

# Extract etcd CA

```
oc get secrets -n openshift-config etcd-signer -o "jsonpath={.data['tls\.crt']}" |  base64 -d | openssl x509 -text
```
