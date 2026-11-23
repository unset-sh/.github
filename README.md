# .github

Organisation profile, repository map and community defaults for unset.sh. Shared developer tooling is maintained
in [`unset-sh/tooling`](https://github.com/unset-sh/tooling).

| Path | Purpose |
| --- | --- |
| [`profile/README.md`](profile/README.md) | Organisation profile and generated repository navigation |
| [`repos.json`](repos.json) and [`MAP.md`](MAP.md) | Repository ownership and dependencies: source and generated view |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Accepted contributions and DCO sign-off |
| [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) | Behaviour expectations and GitHub reporting routes |
| [`SECURITY.md`](SECURITY.md) | Private vulnerability reporting and the security email fallback |
| [`SUPPORT.md`](SUPPORT.md) | Help and issue routing |
| [`ACCESSIBILITY.md`](ACCESSIBILITY.md) | Accessibility priorities and barrier reporting |
| [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) | Shared public issue forms and chooser configuration |
| [`.github/pull_request_template.md`](.github/pull_request_template.md) | General organisation PR template |
| [`.github/VULNERABILITY_REPORT.yml`](.github/VULNERABILITY_REPORT.yml) | Private report form where reporting is enabled |
| [`workflow-templates/`](workflow-templates/) | GitHub picker templates calling reviewed tooling revisions |
| [`.github/workflows/`](.github/workflows/) | This repository's metadata checks and documentation caller |
| [`scripts/`](scripts/) | Local map generation, drift comparison and their tests |
| [`docs/site/`](docs/site/_index.md) | Maintained human documentation, exported to `unset-sh/docs:github/` |
| [`docs/claude-md.md`](docs/claude-md.md) | The ownership section for repository instructions |

## Organisation defaults

GitHub uses these policies and templates in repositories without their own equivalents. Local issue templates or
chooser configuration replace the entire inherited issue-template set. The profile, workflow picker and repository
settings each have their own scope; [Organisation defaults](docs/site/organisation-defaults.md) explains the
boundaries and verification steps. Code ownership and licence files remain repository-specific.

## Shared tooling and starter workflows

Tooling owns maintained CI, release and documentation-export implementations, their helpers and tests. Consumers
keep their own events, permissions, inputs, check/build logic and pinned caller files. This repository retains its
local map checks because they validate the metadata it owns.

Edit picker templates directly in `workflow-templates/`; they are small onboarding callers, not generated copies.
Replace `APPROVED_COMMIT_SHA` with a real reviewed tooling release before installing a template. The first tooling
release remains pending. See [Use the workflow templates](docs/site/workflow-templates.md).

The documentation caller uses an exact reviewed tooling commit as a bootstrap dependency while no release exists.
It only checks and packages content with read access. Automatic pin updates, merging and downstream delivery are
separate work; this move does not enable them or remove release approvals.

## Change the map

Use Node 26.12.0 from `.nvmrc`. Edit `repos.json`, then run:

```sh
npm run map
npm run check
```

Commit the source change. CI regenerates both views and checks duplicate repositories, unknown dependencies,
cycles and generated output. After merge, the shared publisher updates `MAP.md` and the generated profile block
through a generated-only PR without a separate owner approval. It also runs hourly and can be started manually.
Committing the generated views with the source is still supported; unchanged output produces no PR.

The publisher accepts only the two paths registered in `.github/maps.json`, preserves authored profile text,
and stops on observed main changes or a refused merge. A concurrent source change after the final check can leave
a temporarily stale view until the next successful current-main refresh. It never changes branch protections. Repository
ownership, plans and explanatory claims remain authored in `repos.json`; refreshing a view does not invent them
from code. See [Automatic map publication](docs/site/map-publication.md) for operation and recovery.

The daily and manual map workflow compares the map with public GitHub metadata. While differences exist it keeps
one issue labelled `org-map-drift` open and closes it when they are resolved. Private entries cannot be checked
with the workflow's token and are reported as unchecked.

## Documentation

Human guidance belongs in `docs/site/`, follows the organisation documentation standard and exports to the
`github/` section in `unset-sh/docs`. The organisation site is live; [docs PR #2](https://github.com/unset-sh/docs/pull/2) records the initial
import of this section. [Export organisation documentation](docs/site/export-docs.md)
explains the caller and its output. Tooling maintains its own workflow contracts under its own `docs/site/`.

AI plans, notes and supporting artifacts live in `unset-sh/agent-kit` under `notes/` and `artifacts/`.
