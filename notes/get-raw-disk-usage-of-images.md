---
title: Get raw disk usage of all images per namespace
tags:
  - Images
  - Admin Tasks
emoji: 💾
link: https://docs.openshift.com/container-platform
---

# Get raw disk usage of all images per namespace

This script provides the sum of the size of all images per namespace algthough it's not considering the disk saving provided by the reuse of the layers.

```sh
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
