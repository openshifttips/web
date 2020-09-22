---
title: Which users have specific access
tags:
  - Auth
  - Troubleshooting
emoji: 💪
link: https://docs.openshift.com/container-platform/4.5/authentication/using-rbac.html
---

During the course of normal troubleshooting, one may run into a situation where a user has trouble performing some task, even though the administrator expects that the user should have permission to do so.

Manually inspecting each of the user's roles, etc, can be time consuming, so openshift provides a handy way to come at this issue from the other direction. An admin can verify _who_ has access to a given command:

```bash
$ oc adm policy who-can <verb> <resource>
```

Examples of `<verb>` available for this command include:
* `get`
* `list`
* `create`
* `update`
* `delete`
* `deletecollection`
* `watch`

