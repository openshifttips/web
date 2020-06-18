---
title: Disconnected Cluster Mirror Registry and Upgrade
tags:
  - Openshift 4
  - Disconnected
  - Registry
  - Upgrade
emoji: 🔌
---

Commands to mirror registry and upgrade a disconnected cluster.

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


# to upgrade to 4.4.3, find digest from the following link:
http://mirror.openshift.com/pub/openshift-v4/clients/ocp/4.4.3/release.txt

# upgrade cluster based on digest, replacing the SHA with the one from the link above
oc adm upgrade --to-image="${LOCAL_REGISTRY}/openshift-release-dev/ocp-release@sha256:1f0fd38ac0640646ab8e7fec6821c8928341ad93ac5ca3a48c513ab1fb63bc4b" --allow-explicit-upgrade --force

# watch the cluster version pugrade
oc get events -n openshift-cluster-version -w
```
