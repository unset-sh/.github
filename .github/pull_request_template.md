## What changes

<!-- Describe the resulting behaviour. Link the issue or decision this addresses, if there is one. -->

## Why

<!-- Explain the problem and any important trade-off or compatibility impact. -->

## Readiness

<!-- Select one. Readiness does not replace the repository's checks or merge/release approvals. -->
- [ ] Independent — can merge and, where applicable, release after this PR's checks and approvals
- [ ] Dependent — requires the prerequisites below to be available first, followed by fresh integration checks

Prerequisites and order: <!-- None, or links to required PRs and exact dependency versions/artifacts; state merge, release and adoption order. -->

Tested combination: <!-- Identify the base and dependency revisions/versions tested; give results under Validation. -->

<!-- Every staging merge must leave it working and releasable, without relying on an unspecified later fix.
A merged prerequisite PR is insufficient if its required package/artifact is not yet available.
For documentation-only work, applicable documentation checks suffice; deployment is not required. -->

## Validation

<!-- List the commands or manual checks you ran and their results. State what you could not verify. -->

## Documentation

<!-- Link updated human documentation in the owning repository's docs/ folder, or explain why no update is needed.
AI working notes and supporting artifacts belong in unset-sh/agent-kit, not as extra files in this repository. -->

## Labels

<!-- Choose exactly one kind:feature, kind:fix, kind:refactor, kind:docs or kind:maintenance.
Add impact:breaking-change and/or impact:data-migration when applicable. Update labels if scope changes.
If the labels are not available or you cannot apply them, record the intended selection here.
Documentation accompanying a feature does not make it docs-only; Markdown agent rules can change behaviour.
Policy and rollout status: https://github.com/unset-sh/.github/blob/main/docs/site/pull-request-labels.md
Labels do not grant merge, release or bypass permission. -->

## Checklist

- [ ] This contribution follows the repository's contribution policy, including its limits on outside code
- [ ] Each commit has the required DCO sign-off
- [ ] The repository's documented checks pass, or remaining failures are explained above
- [ ] Documentation and release notes reflect any relevant behaviour change
- [ ] Public text, examples and attachments contain no credentials or other people's private data

<!-- Organisation default: https://github.com/unset-sh/.github/blob/main/CONTRIBUTING.md
Repositories may supply their own template and additional review requirements. -->
