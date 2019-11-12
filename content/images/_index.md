---
title: "Images"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 18
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


# Get raw disk usage of all images per namespace

This script provides the sum of the size of all images per namespace algthough it's not considering the disk saving provided by the reuse of the layers.

```
#/bin/bash

# use a temp file
_tmpfile=$( mktemp )

# extract the data for each image: name and size (in Bytes)
for _line in $( oc adm top images | head | awk '!/^NAME/ { print $2":"$NF }' | grep -v "none" | sort ); do
  _image=$( echo $_line | cut -d ":" -f 1 )
  _size=$( echo $_line | cut -d ":" -f 2 | sed 's/B$//' | numfmt --from=iec-i )

  echo "$_image:$_size"
done > $_tmpfile

# process the previous list for each namespace and show the total size in human-readable values
echo "Raw disk usage per namespace (not considering layers re-use):"
for _namespace in $( cat $_tmpfile | cut -d \/ -f 1 | sort -u ); do
  _size=$( grep $_namespace $_tmpfile | cut -d\: -f 2 | paste -s -d+ - | bc | numfmt --to=iec-i --suffix=B --padding=7 )
  echo -e "- $_namespace\t$_size"
done

# cleanup temp dir
rm -fr $_tmpfile
```
