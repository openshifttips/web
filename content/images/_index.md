---
title: "Images"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 17
---

# Patch image pull policy

```
oc patch dc mydeployment -p '{"spec":{"template":{"spec":{"containers":[{"imagePullPolicy":"IfNotPresent","name":"mydeployment"}]}}}}'
```

# Get tags from a particular image in a particular container image registry

In order to get images from Red Hat's registries, it is required to have a
pull secret that contains base64 encoded tokens to reach those registries, such
as:

```
'{
   "auths":{
      "quay.io":{
         "auth":"xxx",
         "email":"xxx"
      },
      "registry.redhat.io":{
         "auth":"xxx",
         "email":"xxx"
      },
      "registry.example.com":{
         "auth":"xxx",
         "email":"xxx"
      },
   }
}'
```

First step is to get the token. We do this with this handy one liner:

```
REGISTRY=registry.example.com
echo $PULL_SECRET | jq -r ".auths.\"${REGISTRY}\".auth" | base64 -d | cut -d: -f2
```

Or, store it in an environment variable:

```
TOKEN=$(echo $PULL_SECRET | jq -r ".auths.\"${REGISTRY}\".auth" | base64 -d | cut -d: -f2)
```

Then we can use regular container image registry API queries:

```
curl -s -H  "Authorization: Bearer ${TOKEN}" https://${REGISTRY}/v2/_catalog
```

So, one liner to get the list of available tags for a particular image:

```
curl -s -H  "Authorization: Bearer $(echo $PULL_SECRET | jq -r '.auths."registry.example.com".auth' | base64 -d | cut -d: -f2)" https://registry.example.com/v2/eminguez/myawesomecontainer/tags/list | jq -r '.tags | .[]' | sort
```

# Get tags from a particular image in quay.io registry

If the images are public (like openshift/origin-installer), it is as simple as:

```
curl -X GET "https://quay.io/api/v1/repository/openshift/origin-installer/tag/" | jq -r .tags[].name | sort | uniq
```

Please note that [quay.io API](https://docs.quay.io/api/swagger/) is slightly different
