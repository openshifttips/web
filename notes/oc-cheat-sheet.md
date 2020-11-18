---
title: oc Cheat Sheet
tags:
  - oc
emoji: 🗂️
link: https://docs.openshift.com/container-platform
---

# Show console URL

```sh
oc whoami --show-console
```

# Show API url

```sh
oc whoami --show-server
```

# Cluster info

```sh
oc cluster-info
```

## Cluster info DUMP

```sh
oc cluster-info dump
```

# Extract the OpenShift payloads (aka files, assets, etc.)

You just need your pull secret file and:

```sh
oc adm release extract --registry-config=./pull_secret.txt --from=quay.io/openshift-release-dev/ocp-release:4.1.15 --to=/tmp/mystuff
```

You can extract individual files such as the `oc` or the installer with the `--command` flag

# Dump OpenShift release information

Get the tag you are interested in by visiting [the openshift-release-dev](https://quay.io/repository/openshift-release-dev/ocp-release?tab=tags) repository.

Then:

```sh
oc adm release info quay.io/openshift-release-dev/ocp-release:<version>
```

For a super verbose and huge json file with all the details:

```sh
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

```sh
oc adm release info --commit-urls quay.io/openshift-release-dev/ocp-release:<version>
```

# Get pull specs for all the release images

```sh
oc adm release info --pullspecs quay.io/openshift-release-dev/ocp-release:<version>
```

# Get the pull spec for one component's image

```sh
oc adm release info --image-for=<component> quay.io/openshift-release-dev/ocp-release:<version>
```
