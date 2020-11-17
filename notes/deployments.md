---
title: "Deployments"
date: 2019-06-18T16:42:20+02:00
lastmod: 2019-06-18T16:42:20+02:00
publishdate: 2019-06-18T16:42:20+02:00
draft: false
weight: 17
tags:
  - Deployments
---

# Import environment variables from a file

(via https://twitter.com/kamesh_sampath/status/1179984908690739201)

Instead modifying the deployment, you can create an environment variables file
such as `myvars.env`:

```ini
MYSQL_DB="mysql"
MYSQL_DBPORT="3306"
OTHERVAR="foo"
```

Then:

```sh
cat myvars.env | oc set env -e - deployment/mydeployment -n mynamespace
```

# Set some of the local shell environment into a deployment config

```sh
env | grep MYSQL_ | oc set env -e - deployment/mydeployment -n mynamespace
```

# Import environment variables from a configmap with a prefix

```sh
oc set env --from=configmap/myconfigmap --prefix=MYSQL_ deployment/mydeployment -n mynamespace
```

# Import specific keys from a configmap

```sh
oc set env --from=configmap/myconfigmap --keys=OTHERVAR deployment/mydeployment -n mynamespace
```

# Remove environment variable in a deployment

```sh
oc set env -e OTHERVAR- deployment/mydeployment -n mynamespace
```

# Remove environment variable from container 'c1' in a deployment

```sh
oc set env deployment/mydeployment --containers="c1" OTHERVAR-
```

# Remove environment variable from container 'c1' in all deployments

```sh
oc set env deployments --all --containers="c1" OTHERVAR-
```

# Show logs for all containers within a pod

```sh
oc logs <pod> --all-containers
```

# Show logs for all containers within a pod with pod name and container name

```sh
oc logs <pod> --all-containers --prefix
```
