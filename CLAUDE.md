# CLAUDE.md: unset-sh/.github

## Where this repository fits

This is `unset-sh/.github`: the organisation's front page, repository map, community defaults and GitHub Actions automation.

- **Belongs here:** the profile page, `repos.json` and its generated `MAP.md`, community health files, all organisation
  workflow implementations, their supporting scripts and tests, and starter templates. Workflows specific to one
  repository also belong here; the consuming repository retains its build/test commands and small event callers.
- **Does not belong here:** code, docs or assets of any product; they live in the repository that owns them.

## Rules

- `repos.json` is the only hand-written source of the map. `MAP.md` and the block between the `org-map` markers in
  `profile/README.md` are generated: edit `repos.json`, run `npm run map`, commit both. `npm run check` must pass.
- A repository's `description` in `repos.json` is exactly what GitHub shows for it (`""` when it has none). When the
  two differ, decide which is wrong; changing the GitHub description is the owner's call.
- Statuses: `active` exists; `pending` is approved and waiting for the owner to set it up; `planned` is agreed but not
  created; `proposed` is not approved; `archived` is archived on GitHub. Never create an organisation repository
  without the owner's approval for that repository.
- Licence rule (Alex, 2026-11-21, per repository): product repositories AGPL-3.0-only with no outside code for now;
  profile-recipes recipes CC0-1.0 and lexicon schemas MIT, taking outside work with a DCO sign-off only; third-party
  work keeps its own licence; no contributor agreement. `licenceRule` in repos.json is the wording. Each entry's `licence` records what the repository has today (`spdx` exactly as GitHub detects it, or null) and
  whether it follows the rule. Record a mismatch; never relicense published work without the owner's decision.
- Dependencies point one way (`uses`); a cycle fails the check. When a new edge would create one, stop and ask.
- The profile page is navigation first: repositories by `group` (defined in `groups`), each with its `tagline` and
  `links` (docs, site, package). Only the banner, the link row and the intro above the `org-map` block are hand-written;
  the banner images in `profile/` are provisional until the branding pass and can be swapped without touching the generator.
- The owner is named only as "Alex" or by the GitHub login `Undefined6799`; their surname never appears.
- Node 26 (`.nvmrc`), no dependencies, `node:test` only. Actions are pinned by full commit SHA.

## Workflows

- Edit category sources (`ci/`, `releases/`, `automation/`; add `pages/`, `deployments/`, or `code-scanning/` with their
  first workflow), then run `npm run workflows`. Generated `.github/workflows/` files are committed, never edited.
  Starter sources and metadata live in `templates/`; their generated copies live in `workflow-templates/`.
- `npm run check` checks generation freshness, the map, release scripts and workflow security invariants. Tests for
  the generator run against real temporary directories. Preserve every existing release refusal when moving code.
- Workflow contracts and release prerequisites are in docs/site/. Inputs, outputs, check names and signer paths are
  external contracts. AI plans, migration notes and review artifacts live in unset-sh/agent-kit under notes/ and
  artifacts/, not in ad hoc Markdown files here (Alex, 2026-11-22). Maintained human documentation belongs in
  docs/site/, follows the agent-kit org-documentation standard, and exports to unset-sh/docs:github/.
  Alex owns these pages; review them with each workflow change and before each release. Update the relevant
  guide/reference in the same PR, or state a reviewed no-change reason. The export reads a full committed
  revision, includes provenance and licence, and never writes another repository automatically.
- This repository's release workflow is security-sensitive. Trigger, permission, environment, reviewer and publish
  behavior changes require the owner's decision. Alex approved its move from `unset-sh/workflows` on 2026-11-22;
  that authorizes the repository/signer path migration, not weakening any approval or verification gate.
- The release `publish` job runs no consuming-repository code and treats all build output as untrusted. Only that
  release job writes and uses the protected `release` environment. The map's separate issue-notification job retains
  its existing narrow `issues: write` permission.
- No stored secrets in the shared check/release workflows. Use job-scoped permissions, disable persisted checkout
  credentials, and pass expression values through `env`, never interpolate them into shell scripts.
- Raising Node also raises npm. Re-read npm's publish/archive handling before changing the pinned version; the
  hostile archive comparisons in `checks/release-package.test.mjs` must pass against its bundled npm.
- Record caller-visible changes in CHANGELOG.md. Keep version 0.0.0 until the first approved release. Consumer calls
  use full reviewed commit pins; starter placeholders must be replaced before a caller is installed.
- Do not merge your own implementation PR. Release setup and approval remain the owner's action; document what has
  not run rather than treating local tests as proof of live release behavior.

## Community defaults

- Keep inherited policies and forms useful across repositories. Preserve the accepted contribution and DCO rules.
  Do not add labels, assignees, project IDs or issue types to default forms unless they exist in every consumer.
- The inherited PR template is general. Workflow changes must still show source/generated parity, reviewed action
  pins, permission and approval boundaries, caller-visible release notes, and the validation required above.
- Use absolute links for policies shared across repositories. Security reports use the affected repository’s
  private reporting channel when enabled, with security@unset.sh as fallback. Conduct reports use GitHub’s
  reporting tools (Alex, 2026-11-22). Do not invent contact addresses, funding destinations or service commitments.
- Alex owns the defaults. Review them when policy/contact/ownership changes and at least every six months.
  Update docs/site/organisation-defaults.md with a behaviour change; preserve notes and evidence in agent-kit.
