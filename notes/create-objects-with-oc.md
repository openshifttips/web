---
title: Deployment var management tips
tags:
  - oc
emoji: 🗂️
link: https://docs.openshift.com/container-platform
---

# Create objects using bash `here documents`

This is just an example of a `LoadBalancer` service, but it could be anything yaml based:

```yaml
cat <<EOF | oc apply -f -
apiVersion: v1
kind: Service
metadata:
  name: hello-openshift-lb
spec:
  externalTrafficPolicy: Cluster
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort: 8080
  selector:
    app: hello-openshift
  sessionAffinity: None
  type: LoadBalancer
EOF
```
