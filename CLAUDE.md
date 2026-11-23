# CLAUDE.md: unset-sh/.github

## Where this repository fits

This is `unset-sh/.github`: the organisation's front page, repository map, community defaults and starter workflow catalogue.

- **Belongs here:** the profile page, `repos.json` and its generated `MAP.md`, community health files, starter workflow templates,
  local metadata validation and small workflow callers. Shared execution and helpers belong in unset-sh/tooling.
- **Does not belong here:** code, docs or assets of any product; they live in the repository that owns them.

## Rules

- `repos.json` is the authored source for ownership, plans and explanatory text. `MAP.md` and the block between
  the `org-map` markers in `profile/README.md` are generated. CI regenerates and checks them; the pinned shared
  publisher updates the committed views after a source change reaches main, hourly, or on demand. It may merge
  only those validated generated files without another owner approval. Source changes follow normal review.
  `.github/maps.json` registers these Markdown views for tooling's dedicated organisation-map publisher;
  the generic website map runner still accepts JSON snapshots only. Use `npm run map` for a local preview.
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

## Tooling boundary

- Shared CI, release and documentation-export implementations, helpers and tests belong in `unset-sh/tooling`
  (org-0006, Alex, 2026-11-22). Keep only this repository's metadata validation and small callers here.
- Starter templates are maintained directly in `workflow-templates/`; they call tooling at reviewed full commits.
  Placeholder pins must be replaced before installation. Do not duplicate tooling's implementation or release docs.
- Local `npm run check` validates the map tooling and generated map. A workflow caller change must verify its
  referenced tooling commit, inputs and permission boundary; a location change never weakens release approval.
- The documentation caller uses a reviewed full tooling commit while the first release is pending. It requires
  the check to pass before packaging and has contents-read access only. Automatic adoption is not implemented.
- Human guidance lives in docs/site/ and exports to unset-sh/docs:github/ using tooling's exporter. Update the
  relevant guide with a behaviour change. AI notes and artifacts stay in agent-kit under notes/ and artifacts/.
- Do not merge your own implementation PR. Bootstrap callers must pin reviewed tooling commits that have
  landed on its main branch; record unverified runtime behaviour rather than inventing success.

## Community defaults

- Keep inherited policies and forms useful across repositories. Preserve the accepted contribution and DCO rules.
  Do not add labels, assignees, project IDs or issue types to default forms unless they exist in every consumer.
- The inherited PR template is general. Caller changes must still show reviewed pins, permission boundaries and the
  validation required above; substantive workflow changes are reviewed in tooling.
- Use absolute links for policies shared across repositories. Security reports use the affected repository’s
  private reporting channel when enabled, with security@unset.sh as fallback. Conduct reports use GitHub’s
  reporting tools (Alex, 2026-11-22). Do not invent contact addresses, funding destinations or service commitments.
- Alex owns the defaults. Review them when policy/contact/ownership changes and at least every six months.
  Update docs/site/organisation-defaults.md with a behaviour change; preserve notes and evidence in agent-kit.
