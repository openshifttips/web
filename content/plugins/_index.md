---
title: "plugins"
date: 2021-02-11T14:00:00+02:00
lastmod: 2021-02-11T14:00:00+02:00
publishdate: 2021-02-11T14:00:00+02:00
draft: false
weight: 23
---

# SSH into nodes and perform a command as root using oc debug

```
cat << EOF > ~/.local/bin/oc-ssh
#!/bin/bash
if [ ${1} == "-A" ]; then
  for node in $(oc get nodes -o name); do
    echo "${node}"
    oc debug "${node}" -- chroot /host sh -c "${2}" 2> /dev/null
  done
else
  oc debug node/"${1}" -- chroot /host sh -c "${2}" 2> /dev/null
fi
EOF
```

Then:

```
oc ssh -A uptime
node/x
 11:21:19 up 54 min,  0 users,  load average: 3.45, 4.47, 5.13
node/y
 11:21:24 up 26 min,  0 users,  load average: 5.39, 3.75, 3.11
node/z
 11:21:30 up 6 min,  0 users,  load average: 1.26, 1.75, 0.93
```