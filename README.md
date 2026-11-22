# .github

Organisation profile, repository map, community defaults and shared GitHub Actions for unset.sh.

| Path | Holds |
| --- | --- |
| [`profile/README.md`](profile/README.md) | The organisation's front page on GitHub. Its repository list is generated |
| [`repos.json`](repos.json) | The map: every repository, what it owns, what does not belong in it, and what it uses |
| [`MAP.md`](MAP.md) | The map rendered for people and assistants, generated from `repos.json`, with the licence rule and the repositories that do not follow it yet |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Default contribution policy and DCO sign-off |
| [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) | Behaviour expectations and GitHub reporting routes |
| [`SECURITY.md`](SECURITY.md) | Private vulnerability reports and the security email fallback |
| [`SUPPORT.md`](SUPPORT.md) | Help, documentation and issue routing |
| [`ACCESSIBILITY.md`](ACCESSIBILITY.md) | Accessibility priorities and barrier reporting |
| [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) | Shared public issue forms and chooser configuration |
| [`.github/pull_request_template.md`](.github/pull_request_template.md) | General organisation PR template |
| [`.github/VULNERABILITY_REPORT.yml`](.github/VULNERABILITY_REPORT.yml) | Private report form for repositories with reporting enabled |
| [`docs/claude-md.md`](docs/claude-md.md) | The section every repository's `CLAUDE.md` starts with |
| [`ci/`](ci/) | Shared check workflow and this repository's CI caller |
| [`releases/`](releases/) | Protected package/asset release and this repository's release caller |
| [`automation/`](automation/) | Organisation-map checks, drift notification and documentation export |
| [`templates/`](templates/) | Starter caller YAML and picker metadata |
| [`.github/workflows/`](.github/workflows/) | Generated executable workflows; edit the category source |
| [`workflow-templates/`](workflow-templates/) | Generated templates for GitHub's New workflow picker |
| [`scripts/`](scripts/) | Generation, map tooling and release validation (Node built-ins only) |
| [`checks/`](checks/) | Release, archive and workflow security checks |
| [`docs/site/`](docs/site/_index.md) | Maintained human guides and reference, exported to `unset-sh/docs:github/` |

## Organisation defaults

GitHub uses these policies and templates for repositories without their own equivalents. Local issue templates or
chooser configuration replace the entire inherited issue-template set. The profile, workflow picker, executable
workflows and repository settings each have their own scope; [Organisation defaults](docs/site/organisation-defaults.md)
explains the boundaries and verification steps. Code ownership and licence files remain repository-specific.

## Change a workflow

Edit the YAML in its category, then run:

```sh
npm run workflows
npm run check
```

Commit the source and generated files together. For example, `ci/check.yml` becomes
`.github/workflows/ci-check.yml`, and `releases/package.yml` becomes `.github/workflows/releases-package.yml`.
The generator copies YAML without rewriting its expressions or logic. CI refuses stale, missing or orphaned
generated output. Unmanaged files and symlinks are never overwritten by generation.

Add `pages/`, `deployments/`, or `code-scanning/` when their first workflow is migrated. These are source categories;
GitHub runs only the generated flat entry points. The outer `.github` in `unset-sh/.github` is this repository's
name; the inner `.github/workflows/` is GitHub's required configuration directory.

## Use a shared workflow

Each consuming repository keeps a small caller with its own events, permissions and inputs. Its jobs call the
shared implementation at a full reviewed commit SHA. Runs and checks belong to that consuming repository; putting
a workflow here does not automatically run it across the organisation.

Start with a file from `templates/` or the GitHub picker. Replace `APPROVED_COMMIT_SHA` with the full commit of a
reviewed release, then set the inputs for that repository. The placeholder is deliberately not an executable pin:
no first release exists yet, and callers must not silently follow `main`. Read [the workflow guides](docs/site/_index.md)
before adopting one, especially the release environment and required-check prerequisites.

The shared release is still version 0.0.0. It publishes nothing at that version. The initial migration preserves
the implementation from `unset-sh/workflows` PR #1; its live release assumptions remain explicitly unverified in
the workflow guide until the first approved run. Other repositories keep their existing automation during adoption.

## Change the map

Edit `repos.json`, run `npm run map`, and open a pull request with both. CI fails if `MAP.md` or the profile page
does not match `repos.json`, if a repository is listed twice, uses one the map does not know, or if the dependencies
form a cycle.

Every day, and on demand from the Actions tab, a job compares the map with the organisation's public repositories on
GitHub: a repository missing from the map, one archived, renamed or deleted, one planned that now exists, or a
description or detected licence that differs. While anything differs it keeps one issue labelled `org-map-drift` open, and it closes the
issue once they match. Private repositories cannot be seen with the workflow's own token, so private entries are
listed in the issue as not checked.

## Documentation

Human guides and reference live in `docs/site/` and follow the organisation documentation standard.
Read [Use shared workflows](docs/site/use-workflows.md), [Workflow layout](docs/site/workflow-layout.md),
and [Release reference](docs/site/release-reference.md). [Export documentation](docs/site/export-docs.md)
explains the committed-source export to `unset-sh/docs:github/`. The organisation docs framework is live. This repository’s section remains under review in
[docs PR #2](https://github.com/unset-sh/docs/pull/2); an exported artifact is not a deployed section.

AI plans, notes and supporting artifacts live in `unset-sh/agent-kit`, under `notes/` and `artifacts/`.
