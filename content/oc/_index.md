---
title: "oc"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 21
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

# View different channels and releases information

Kudos to [Ryan Howe](https://github.com/rjhowe)

OCP4 is released in different 'channels' ("prerelease-4.1", "stable-4.1", "candidate-4.2", "fast-4.2", "stable-4.2",...) that contains different releases.
In order to view the different releases and some information, the following snippet can be used (in this example the "stable-4.2" channel is used):

```
curl -sH 'Accept: application/json' https://api.openshift.com/api/upgrades_info/v1/graph?channel="stable-4.2" | jq -S '.nodes | sort_by(.version | sub ("-rc";"") | split(".") | map(tonumber)) | .[]'
```

Output:

```
{
  "metadata": {
    "description": "",
    "io.openshift.upgrades.graph.release.channels": "stable-4.2",
    "io.openshift.upgrades.graph.release.manifestref": "sha256:c5337afd85b94c93ec513f21c8545e3f9e36a227f55d41bc1dfb8fcc3f2be129",
    "url": "https://access.redhat.com/errata/RHBA-2019:2922"
  },
  "payload": "quay.io/openshift-release-dev/ocp-release@sha256:c5337afd85b94c93ec513f21c8545e3f9e36a227f55d41bc1dfb8fcc3f2be129",
  "version": "4.2.0"
}
```

This can be wrapped in a handy script such as:

```
#!/bin/bash

PS3='Please enter your choice: '
options=("prerelease-4.1" "stable-4.1" "candidate-4.2" "fast-4.2" "stable-4.2")

_Command () {
  echo "Showing upgrade channel: ${channel}"
  curl -sH 'Accept: application/json'  https://api.openshift.com/api/upgrades_info/v1/graph?channel=${channel} | jq -S '.nodes | sort_by(.version | sub ("-rc";"") | split(".") | map(tonumber)) | .[]'
}

select opt in "${options[@]}"
do
  channel="${opt}"
  _Command
  break
done
```
