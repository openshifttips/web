---
title: DC Cluster Mirror and Upgrade
tags:
  - Openshift 4
  - Disconnected
  - Registry
  - Upgrade
emoji: 🔌
link: https://docs.openshift.com/container-platform/latest/installing/install_config/installing-restricted-networks-preparations.html#installation-mirror-repository_installing-restricted-networks-preparations
---

Commands to mirror registry for a disconnected cluster:

```bash
export OCP_RELEASE=4.4.3-x86_64          ### replace with your minor version
export LOCAL_REGISTRY='<your-registry-host>:<your-registry-port>' 
export LOCAL_REPOSITORY='ocp-release' 
export PRODUCT_REPO='openshift-release-dev' 
export LOCAL_SECRET_JSON='pull-secret'   ### this should contain auth creds to your registry 
export RELEASE_NAME="ocp-release" 

# mirror contents to external repository (for both new cluster and upgrades)
oc adm -a ${LOCAL_SECRET_JSON} release mirror \
     --from=quay.io/${PRODUCT_REPO}/${RELEASE_NAME}:${OCP_RELEASE} \
     --to=${LOCAL_REGISTRY}/${LOCAL_REPOSITORY} \
     --to-release-image=${LOCAL_REGISTRY}/${LOCAL_REPOSITORY}:${OCP_RELEASE} \
     --insecure=true

# build openshift-install for mirror registry (new cluster only)
oc adm -a ${LOCAL_SECRET_JSON} release extract --command=openshift-install "${LOCAL_REGISTRY}/${LOCAL_REPOSITORY}:${OCP_RELEASE}" --insecure=true
```

Commands to upgrade a disconnected cluster:

```bash
# first find the digest SHA for the appropriate version
oc adm release info 4.4.3

# you can also navigate to this URL for the same information
http://mirror.openshift.com/pub/openshift-v4/clients/ocp/4.4.3/release.txt

# upgrade cluster based on digest, replacing the SHA with the one from the link above
oc adm upgrade --to-image="${LOCAL_REGISTRY}/openshift-release-dev/ocp-release@sha256:1f0fd38ac0640646ab8e7fec6821c8928341ad93ac5ca3a48c513ab1fb63bc4b" --allow-explicit-upgrade --force

# watch the cluster version upgrade
oc get events -n openshift-cluster-version -w
```
