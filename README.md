# Openshift Compendium
=======
# OpenShift Tips

This site pretends to compile a list of OpenShift 4 tips, mainly one liners as well as handy commands, snippets and other tips + tricks for working with OpenShift Container Platform.

Check the site at <https://openshift.tips>

To contribute please open a PR by contributing a `.md` file (or several) to the `notes/` folder. Please keep PRs scoped by topic. For example, if adding a few commands and a few example snippets, open two PRs.

## Contributing Guidelines

A few points to note when submitting PRs:

- Tags are case sensitive
  - `Admin Tasks` is different from `Admin tasks`
  - Use existing tags wherever possible
- Links and emoji are optional
- Code blocks support multilanguage syntax highlighting with [Github flavored markdown syntax](https://help.github.com/en/github/writing-on-github/basic-writing-and-formatting-syntax)

## Front Matter

Each note should contain some front matter. This allows the theme to parse and organize the contents more easily.

For example:

```markdown
---
title: Display etcd member table
tags:
  - Admin Tasks
  - etcd
emoji: 🧹
link: https://access.redhat.com/solutions/4985441
---
```

# Contact

The main author of this site is [Eduardo Minguez](https://eduardominguez.es) but
collaborations are appreciated :)

Check all the other [Contributors](https://github.com/openshifttips/web/graphs/contributors)

Feel free to contact me at <hello@openshift.tips> or add a new issue to the
[repo](https://github.com/openshifttips/web/issues/new)
