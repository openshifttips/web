---
title: Determine if an image is multi-architecture
tags:
  - Skopeo
  - Image
link: https://github.com/containers/image/pull/400
---

In order to support multi-architecture images going forward, container tools (i.e. Docker, podman, crio, etc...) have been updated to read from manifest lists.  To determine if an image is a multi-architecture manifest list, run the following command (substitute the image with your own):
```bash
skopeo inspect --tls-verify=false --raw docker://registry.access.redhat.com/ubi8:latest | jq
```

A manifest list should have the following metadata: `"mediaType": "application/vnd.docker.distribution.manifest.list.v2+json"`
