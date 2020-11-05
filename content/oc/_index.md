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

In case you want the payloads from the current version running in the cluster:

```
oc adm release extract --registry-config=./pull-secret.txt --from=$(oc get clusterversion version -o jsonpath='{.status.desired.image}') --to=/tmp/mystuff
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

If you prefer the commit URLs directly, use this command instead.
```
oc adm release info --commit-urls quay.io/openshift-release-dev/ocp-release:<version>
```

# Get pull specs for all the release images

```
oc adm release info --pullspecs quay.io/openshift-release-dev/ocp-release:<version>
```

# Get the pull spec for one component's image

```
oc adm release info --image-for=<component> quay.io/openshift-release-dev/ocp-release:<version>
```

# Get commit URLs for all the release components


So, you can go to https://github.com/openshift/multus-cni/commits/0ad77469f3dbe7fa0a9cf5df5cd2a7fd3f099d2a to see the actual code.

# View different channels and releases information

Kudos to [Ryan Howe](https://github.com/rjhowe)

OCP4 is released in different 'channels' ("prerelease-4.1", "stable-4.1", "candidate-4.2", "fast-4.2", "stable-4.2",...) that contains different releases.
In order to view the different releases and some information, the following snippet can be used (in this example the "stable-4.2" channel is used):

```
curl -sH 'Accept: application/json' "https://api.openshift.com/api/upgrades_info/v1/graph?channel=stable-4.2&arch=amd64" | jq -S '.nodes | sort_by(.version | sub ("-rc";"") | split(".") | map(tonumber)) | .[]'
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

PS3='Please enter the channel: '
options=("prerelease-4.1" "stable-4.1" "candidate-4.2" "fast-4.2" "stable-4.2")
PS3='Please enter the arch: '
options2=("amd64" "s390x" "ppc64le")

_Command () {
  echo "Showing upgrade channel: ${channel} arch: ${arch}"
  curl -sH 'Accept: application/json'  "https://api.openshift.com/api/upgrades_info/v1/graph?channel=${channel}&arch=${arch}" | jq -S '.nodes | sort_by(.version | sub ("-rc";"") | split(".") | map(tonumber)) | .[]'
}

select opt2 in "${options2[@]}"
do
  select opt in "${options[@]}"
  do
    channel="${opt}"
    arch="${opt2}"
    _Command
    break
  done
  break
done
```

# Show logs for all containers running in the same pod

```
oc logs <pod> --all-containers
```

# Create Kubeconfig out of credentials

For creating a Kubeconfig file from a given credentials we can run the following commands:

```
export KUBECONFIG=/path/to/new/kubeconfig/file
oc login -u kubeadmin -p <your_password> https://api.<cluster_name>.<base_domain>:6443
oc config view --flatten > ${KUBECONFIG}
```

# Merge multiple Kubeconfigs

If you want to merge multiple kubeconfig files you can run the following commands:

1. Ensure there aren't duplicated entries (Context Names or User Names)

    ```
    grep -A3 -x '\- context:' kubeconfig1 kubeconfig2 kubeconfig3 | egrep "name|user"
    
    kubeconfig1-    user: admin
    kubeconfig1-  name: admin
    kubeconfig2-    user: admin
    kubeconfig2-  name: admin
    kubeconfig3-    user: admin
    kubeconfig3-  name: admin
    ```
2. There are duplicated users and names so we need to edit the kubeconfig files and assign a correct value for each kubeconfig file

    ```
    sed -i 's/admin/kube1/' kubeconfig1
    sed -i 's/admin/kube2/' kubeconfig2
    sed -i 's/admin/kube3/' kubeconfig3
    ```
3. Now we're ready to merge the three kubeconfigs into a single one
    
    1. Export all three kubeconfigs
        
        ```
        export KUBECONFIG=/path/to/kubeconfig1:/path/to/kubeconfig2:/path/to/kubeconfig3
        ```
    2. Explore the context created
        
        ```
        oc config get-contexts

        CURRENT   NAME    CLUSTER   AUTHINFO   NAMESPACE
        *         kube1   hub       kube1      
                  kube2   spoke     kube2      
                  kube3   spoke2    kube3  
        ```
    3. Merge the configs
        
        ```
        oc config view --flatten > /path/to/merged/kubeconfig
        ```
    4. Check merged config file

        ```
        oc --config /path/to/merged/kubeconfig config view
        ```
    5. Now you can export the new Kubeconfig and use `--context [kube1|kube2|kube3]` or `oc config use [kube1|kube2|kube3]` to work with the different clusters

        ```
        oc --context kube1 get clusterversion
        
        NAME      VERSION                             AVAILABLE   PROGRESSING   SINCE   STATUS
        version   4.4.0-0.nightly-2020-03-23-010639   True        False         53m     Cluster version is 4.4.0-0.nightly-2020-03-23-010639

        oc config use kube2
        
        Switched to context "kube2".

        oc get clusterversion
        
        NAME      VERSION                             AVAILABLE   PROGRESSING   SINCE   STATUS
        version   4.4.0-0.nightly-2020-03-26-010528   True        False         52m     Cluster version is 4.4.0-0.nightly-2020-03-26-010528
        ```

# Show events ordered by timestamp

```
oc get event --sort-by=.metadata.creationTimestamp
```

# Avoid the managed fields output

For instance, to 'export' the restricted SCC without the metadata.managedFields:

```
oc patch scc restricted  --type=json -p '[{"op": "remove", "path": "/metadata/managedFields"}]' -o yaml --dry-run=client
```

This won't affect the object in the cluster as it is done at client side with
the `--dry-run=client` flag.

Via https://github.com/kubernetes/kubernetes/issues/90066#issuecomment-716206402

# Avoid the managed fields and other metadata output

For instance, to 'export' the restricted SCC without the metadata.managedFields,
creationTimestamp, generation, etc.:

```
oc patch scc restricted  --type=json -p '[{"op": "remove", "path": "/metadata/managedFields"},{"op": "remove", "path": "/metadata/creationTimestamp"},{"op": "remove", "path": "/metadata/generation"},{"op": "remove", "path": "/metadata/resourceVersion"},{"op": "remove", "path": "/metadata/selfLink"},{"op": "remove", "path": "/metadata/uid"}]' -o yaml --dry-run=client
```

This won't affect the object in the cluster as it is done at client side with
the `--dry-run=client` flag.