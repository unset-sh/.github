# CLAUDE.md: unset-sh/.github

## Where this repository fits

This is `unset-sh/.github`: the organisation's front page and the map of its repositories.

- **Belongs here:** the profile page, `repos.json` and its generated `MAP.md`, the drift check, and community health
  files shared by every repository.
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
