# Contributing to unset.sh

Thank you for your interest. This file applies to every unset.sh repository that does not have its own
`CONTRIBUTING.md`.

Please follow the [Code of conduct](https://github.com/unset-sh/.github/blob/main/CODE_OF_CONDUCT.md). For usage
questions, see [Support](https://github.com/unset-sh/.github/blob/main/SUPPORT.md); accessibility barriers can be
reported through the [accessibility guidance](https://github.com/unset-sh/.github/blob/main/ACCESSIBILITY.md).

## What we accept from outside the organisation

Most unset.sh repositories are products under AGPL-3.0-only and **do not take outside code for now**. Please open an
issue instead of a pull request: bug reports, ideas and questions are welcome.

Two kinds of work are meant to be copied and reused, and these do take outside contributions:

| Where | What | Licence |
| --- | --- | --- |
| [`profile-recipes`](https://github.com/unset-sh/profile-recipes) | New recipes and changes to recipes (see its own `CONTRIBUTING.md`) | CC0-1.0 |
| The lexicon schemas | Proposals for `sh.unset.*` record types, opened as an issue first | MIT |

The [organisation map](https://github.com/unset-sh/.github/blob/main/MAP.md) says which repository owns what and
which licence each one has.

## Sign off your commits (DCO)

Every commit in a contribution must be signed off under the
[Developer Certificate of Origin](https://developercertificate.org/), which says you wrote the change or have the
right to submit it under the repository's licence. Add the line with:

```sh
git commit -s
```

That appends `Signed-off-by: Your Name <you@example.com>`, using the name and email in your git configuration. A pull
request is merged only when every commit carries the sign-off and the DCO check passes. There is no contributor
licence agreement.

## Security

Please do not report a security problem in a public issue. Follow the affected repository's security policy or
the organisation's [Security reporting](https://github.com/unset-sh/.github/blob/main/SECURITY.md) instructions.
Use its private **Report a vulnerability** option when available, or email **security@unset.sh**.
