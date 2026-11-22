---
title: "Label a pull request"
description: "Choose one purpose label and any applicable impact labels for an unset.sh pull request."
weight: 7
type: docs
params:
  doc_kind: guide
---

Pull-request labels describe the purpose and impact of a change. They help people find and review work across
repositories. They are separate from Git tags, package versions and release names.

**Rollout pending:** this policy defines the intended labels and adds a template prompt. It does not create labels
in repositories or install a CI check. Until the labels are available in a repository, record the intended selection
in the PR description and flag the missing labels for rollout; do not treat the missing metadata as an approval.

## Choose exactly one purpose

Select one `kind:*` label for the main outcome of the complete PR:

| Label | Use when the main outcome is |
| --- | --- |
| `kind:feature` | Adding a capability or intentionally changing supported behaviour |
| `kind:fix` | Correcting behaviour that does not meet its intended contract |
| `kind:refactor` | Improving internal structure without intentionally changing observable behaviour |
| `kind:docs` | Updating human documentation without changing product, automation or agent behaviour |
| `kind:maintenance` | Maintaining dependencies, builds, CI, tests or development processes when another kind does not better describe the outcome |

Choose by purpose, not by filename or line count. A feature with tests and documentation is still `kind:feature`.
A standalone guide correction can be `kind:docs`. Changing agent instructions or rules in Markdown changes
behaviour and is not docs-only: choose the applicable kind, usually `kind:maintenance` for a process change or
`kind:fix` for a correction. A test accompanying a bug fix belongs to that fix, while independent test maintenance
can use `kind:maintenance`.

If a PR contains unrelated purposes, review its scope rather than attaching several purpose labels. Update the
label when the main outcome changes and remove the old `kind:*` label.

## Mark applicable impacts

These flags supplement the purpose label; they never replace it. Use either, both or neither as applicable.

| Label | Use when |
| --- | --- |
| `impact:breaking-change` | A supported contract or behaviour becomes incompatible for an existing consumer |
| `impact:data-migration` | The change requires a persistent schema or data migration, rewrite or backfill |

Explain the affected consumers, compatibility or migration steps, and relevant verification in the PR itself.
An additive change is not automatically breaking. A migration can be backward compatible and therefore need
only `impact:data-migration`. Remove an impact label if a scope change eliminates that impact.

Labels describe consequences; they do not approve them. A breaking-change flag does not permit changing an
otherwise protected contract. No label authorizes a merge, release, deployment, security bypass or exception to
the repository's review rules. `kind:docs` does not grant an automatic merge shortcut.

## Apply and review the selection

The author selects the intended labels before requesting review. A reviewer checks that they match the current
diff, especially after scope changes. Contributors without permission to apply labels record their selection in
the description for someone with that permission to apply.

Keep existing issue labels and repository-specific labels where useful; they do not substitute for the one
purpose label. Do not add label names to inherited issue-form YAML as part of this policy.

## Ownership and adoption

This page in `unset-sh/.github` is the canonical taxonomy and human guide. The inherited PR template points here;
a repository with its own template needs a separate reviewed update. GitHub's community defaults do not create
repository labels or install enforcement.

Agent behaviour rules and task records belong in `unset-sh/agent-kit`. Any future shared label provisioning or
validation implementation belongs in `unset-sh/tooling`, with adoption and permissions reviewed for each consumer.
Those mechanisms are not implemented by this documentation change. Keep definitions here rather than creating
different taxonomies in each consumer.
