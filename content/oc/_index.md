---
title: "oc"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 20
---

# Download and extract oc, kubectl and openshift-install one liner

```
curl -sL https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-client-linux-${OCPVERSION}.tar.gz | sudo tar -C /usr/local/bin -xzf - oc kubectl
curl -sL https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-install-linux-${OCPVERSION}.tar.gz | sudo tar -C /usr/local/bin -xzf - openshift-install
```

# Show console URL

```
oc whoami --show-console
```

# Show API url

```
oc whoami --show-server
```

# Cluster info

```
oc cluster-info
```

## Cluster info DUMP

```
oc cluster-info dump
```

# Create objects using bash `here documents`

This is just an example of a `LoadBalancer` service, but it can be anything
yaml based!:

```
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

# Extract the OpenShift payloads (aka files, assets, etc.)

You just need your pull secret file and:

```
oc adm release extract --registry-config=./pull_secret.txt --from=quay.io/openshift-release-dev/ocp-release:4.1.15 --to=/tmp/mystuff
```

You can extract individual files such as the `oc` or the installer with the `--command` flag

# Dump OpenShift release information

Get the tag you are interested in by visiting [the openshift-release-dev](https://quay.io/repository/openshift-release-dev/ocp-release?tab=tags) repository.

Then:

```
oc adm release info quay.io/openshift-release-dev/ocp-release:<version>
```

For a super verbose and huge json file with all the details:

```
oc adm release info --contents quay.io/openshift-release-dev/ocp-release:<version>
```

## Get the repositories and commits used for the OpenShift release images

```
oc adm release info --commits quay.io/openshift-release-dev/ocp-release:<version>
```

For instance, the multus-cni one for 4.1.18:

```
oc adm release info --commits quay.io/openshift-release-dev/ocp-release:4.1.18 | grep multus-cni
  multus-cni                                    https://github.com/openshift/multus-cni                                    0ad77469f3dbe7fa0a9cf5df5cd2a7fd3f099d2a
```

So, you can go to https://github.com/openshift/multus-cni/commits/0ad77469f3dbe7fa0a9cf5df5cd2a7fd3f099d2a to see the actual code.
