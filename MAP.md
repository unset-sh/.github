# unset-sh organisation map

<!-- Generated from repos.json by scripts/map.mjs. Edit repos.json, then run npm run map. -->

Which repository owns what, what does not belong in each, and which way the dependencies point. Read this before
starting work in any unset.sh repository, and update [`repos.json`](repos.json) in the same change that creates,
renames, archives or changes the scope of a repository. A daily check compares this map with GitHub and opens an
issue when they differ.

## Repositories

| Repository | Status | What it is |
| --- | --- | --- |
| [`Undefined6799/unset`](https://github.com/Undefined6799/unset) | Active | The unset.sh app: web, admin, public API, indexer, media proxy, their database and deployment. Lives outside the organisation for now and will be largely rewritten, then wired to the repositories below by pinned releases. |
| [`unset-sh/.github`](https://github.com/unset-sh/.github) | Active | The organisation's front page and this map. |
| [`unset-sh/brand`](https://github.com/unset-sh/brand) | Active | The editable visual contract for unset.sh. Ships static CSS, JSON, fonts, mark and icon data as @unset-sh/brand on GitHub Packages, and builds its Hugo guide with an interactive Svelte component gallery for GitHub Pages. |
| [`unset-sh/presentation`](https://github.com/unset-sh/presentation) | Active | Templates and the one rendering path for preview images and embeds, with a gallery of hard cases. Ships @unset-sh/presentation on GitHub Packages; no running service. |
| [`unset-sh/profile-recipes`](https://github.com/unset-sh/profile-recipes) | Active | Persona profile layouts (recipes) with a guide an AI assistant follows to build someone's profile, plus sample records checked against the lexicons. |
| [`unset-sh/docs`](https://github.com/unset-sh/docs) | Active | The proposed organisation-only docs.unset.sh framework: a root Hugo site edited by pull requests, source-owned documentation in repository sections, and organisation map views derived from .github. The framework change and cutover are pending. The current app-fed site stays live until an organisation source is ready and the app mirror is stopped. |
| [`unset-sh/pds`](https://github.com/unset-sh/pds) | Active | The home for unset.sh's PDS image and everything that customises the PDS: the build on top of the official image, the theme for its sign-in and account pages, and their pins. Empty for now; until it moves, the image is built in the app repository (deployment/pds/). |
| `unset-sh/lexicons` | Approved, waiting for setup | A one-way, read-only copy of the sh.unset.* lexicon schemas, pushed by the app's mirror job. Waiting for setup by the owner; the direction reverses later, when the organisation becomes the source of truth. |
| `unset-sh/messaging` | Proposed, not approved | The private messaging product on unset.cc: one-to-one chat on Matrix today, later communities, channels, roles and voice. Plan drafted, awaiting approval; not created. |
| `unset-sh/server-kit` | Proposed, not approved | Proposed: the generic security code the app and messaging both need (HTTP kit and CSRF gate, egress guard, sealed storage, signed admin envelope, config, log). Not approved yet. |
| [`unset-sh/agent-kit`](https://github.com/unset-sh/agent-kit) | Active | The rules, skills and templates every repository's assistant needs, released as one version and copied into each repository under .claude/, pinned by a lock file. |
| [`unset-sh/workflows`](https://github.com/unset-sh/workflows) | Active | The home for shared CI and release workflows called by full commit. Main currently contains only a README; pull request #1 proposes the check and release workflows, their helper scripts and tests. Consumer adoption and the live release path are not verified. |

## Which way dependencies point

An arrow reads "feeds": the left side is pinned, copied or pushed into the right. Nothing points back, and the
check fails on a cycle.

```mermaid
flowchart LR
  r_unset["unset"]
  r__github[".github"]
  r_brand["brand"]
  r_presentation["presentation"]
  r_profile_recipes["profile-recipes"]
  r_docs["docs"]
  r_pds["pds"]
  r_lexicons["lexicons (pending)"]
  r_messaging["messaging (proposed)"]
  r_server_kit["server-kit (proposed)"]
  r_agent_kit["agent-kit"]
  r_workflows["workflows"]
  r_brand --> r_unset
  r_presentation --> r_unset
  r_messaging --> r_unset
  r_server_kit --> r_unset
  r_pds --> r_unset
  r_brand --> r_presentation
  r_unset --> r_profile_recipes
  r_brand --> r_docs
  r__github --> r_docs
  r_agent_kit --> r_docs
  r_brand --> r_pds
  r_unset --> r_lexicons
  r_brand --> r_messaging
  r_server_kit --> r_messaging
```

- `brand` → `unset`: @unset-sh/brand at an exact version (after the rewrite)
- `presentation` → `unset`: @unset-sh/presentation at an exact version (after the rewrite)
- `messaging` → `unset`: @unset-sh/messaging-contract at an exact version (planned)
- `server-kit` → `unset`: pinned release (if approved)
- `pds` → `unset`: the PDS image by pinned digest (after the move)
- `brand` → `presentation`: @unset-sh/brand at an exact version
- `unset` → `profile-recipes`: lexicon schemas and editor limits, copied at a pinned commit
- `brand` → `docs`: stable published @unset-sh/brand 0.1.x releases, each resolved to an immutable commit; compatible patch updates may rebuild and publish the site automatically after checks
- `.github` → `docs`: repos.json at an exact commit revision for generated organisation map and ownership views; .github remains the source of truth
- `agent-kit` → `docs`: org-documentation from an approved kit release through the existing sync workflow and lock; shared writing rules and templates are not copied independently
- `brand` → `pds`: theme colours and fonts at an exact version (after the move)
- `unset` → `lexicons`: pushes the schemas with its own deploy key
- `brand` → `messaging`: @unset-sh/brand at an exact version
- `server-kit` → `messaging`: pinned kit packages (if server-kit is approved)

## Licences

Licence is set per repository (Alex, 2026-11-21). Product repositories are AGPL-3.0-only and take no outside code for now. Work meant to be copied stays permissive: the profile-recipes recipes are CC0-1.0 and the lexicon schemas are MIT, and those two take outside work with a DCO sign-off only. Third-party work keeps its own licence. There is no contributor agreement.

Not matching the rule yet (changing a published licence needs the owner's decision):

| Repository | Licence today |
| --- | --- |
| `unset` | AGPL-3.0-only; the lexicon schemas are MIT (as the rule wants); shared/ is MIT under ADR 0012 |
| `presentation` | None yet; should be AGPL-3.0-only |
| `profile-recipes` | Recipes CC0-1.0 (as the rule wants); tooling MIT, to move to AGPL-3.0-only |
| `docs` | No licence detected on main yet. The approved root framework licence is AGPL-3.0-only, pending its framework pull request; mirrored source documentation and third-party assets retain their own licences |
| `pds` | None yet; should be AGPL-3.0-only. The official PDS it builds on keeps its own licence |
| `agent-kit` | None on main yet; AGPL-3.0-only in the first release pull request |
| `workflows` | No licence detected on main; AGPL-3.0-only is proposed in the first implementation pull request |

## unset

[`Undefined6799/unset`](https://github.com/Undefined6799/unset). Active.

The unset.sh app: web, admin, public API, indexer, media proxy, their database and deployment. Lives outside the organisation for now and will be largely rewritten, then wired to the repositories below by pinned releases.

**Licence:** AGPL-3.0-only; the lexicon schemas are MIT (as the rule wants); shared/ is MIT under ADR 0012.

**Owns**

- Every product rule and screen of unset.sh, and the data behind them
- The sh.unset.* lexicon schemas (shared/lexicons/schemas/), the source of truth until the organisation takes it over
- Deciding what to present: which data, who may see it, URLs, caching and removal
- The app's architecture decision records (docs/human/decisions/)

**Does not belong here**

- Design tokens, fonts, the mark and icons: [`unset-sh/brand`](https://github.com/unset-sh/brand)
- Preview images and embeds drawn from data: [`unset-sh/presentation`](https://github.com/unset-sh/presentation)
- Ready-made profile layouts for AI-assisted setup: [`unset-sh/profile-recipes`](https://github.com/unset-sh/profile-recipes)
- The chat app (unset.cc), once it moves: `unset-sh/messaging`
- The PDS image and its customisation, once they move: [`unset-sh/pds`](https://github.com/unset-sh/pds)

## .github

[`unset-sh/.github`](https://github.com/unset-sh/.github). Active.

The organisation's front page and this map.

**Licence:** AGPL-3.0-only.

**Owns**

- The organisation profile page (profile/README.md)
- This map: repos.json, MAP.md and the daily check that compares them with GitHub
- Community health files shared by every repository, when they are added

**Does not belong here**

- Code, docs or assets of any product: the repository that owns them, from this map

## brand

[`unset-sh/brand`](https://github.com/unset-sh/brand). Active.

The editable visual contract for unset.sh. Ships static CSS, JSON, fonts, mark and icon data as @unset-sh/brand on GitHub Packages, and builds its Hugo guide with an interactive Svelte component gallery for GitHub Pages.

**Licence:** AGPL-3.0-only project files; OFL-1.1 fonts, reserved Unset mark/app assets, and MIT Tabler/upstream component notices are preserved.

**Owns**

- The editable brand contract: semantic colour, typography, spacing and component style roles
- Generated static package exports, optional Tailwind/shadcn style adapters, fonts, the mark and pinned icon data
- Asset provenance and licences; historical design-sheet provenance is retained
- Brand usage guidelines, the Hugo brand guide and its private interactive Svelte component gallery
- Changeset version preparation, package validation and protected publication, and GitHub Pages guide deployment

**Does not belong here**

- Anything drawn from data, such as link previews and share cards: [`unset-sh/presentation`](https://github.com/unset-sh/presentation)
- Business rules, authentication, network calls and application state: [`Undefined6799/unset`](https://github.com/Undefined6799/unset) or the consuming application
- Component interaction behaviour or consumer deployment orchestration: the consuming application and its shadcn-svelte/Bits UI integration

## presentation

[`unset-sh/presentation`](https://github.com/unset-sh/presentation). Active.

Templates and the one rendering path for preview images and embeds, with a gallery of hard cases. Ships @unset-sh/presentation on GitHub Packages; no running service.

**Licence:** None yet; should be AGPL-3.0-only.

**Owns**

- Templates for profile, post and article previews, one owner per template
- Rendering supplied data into images and embeds
- The gallery of hard cases each template must survive

**Does not belong here**

- Deciding what to show: data, visibility, URLs, caching, removal: [`Undefined6799/unset`](https://github.com/Undefined6799/unset)
- Colours, fonts and the mark: [`unset-sh/brand`](https://github.com/unset-sh/brand)
- A server or a queue that renders on request: [`Undefined6799/unset`](https://github.com/Undefined6799/unset) (it calls this package)

## profile-recipes

[`unset-sh/profile-recipes`](https://github.com/unset-sh/profile-recipes). Active.

Persona profile layouts (recipes) with a guide an AI assistant follows to build someone's profile, plus sample records checked against the lexicons.

**Licence:** Recipes CC0-1.0 (as the rule wants); tooling MIT, to move to AGPL-3.0-only.

**Owns**

- Recipes: recipe.json, GUIDE.md, sample records, assets and preview per persona
- AGENTS.md: the rules an assistant follows when applying a recipe
- The validator that checks recipes against a vendored lexicon snapshot and editor limits

**Does not belong here**

- The lexicon schemas themselves (lexicons/ here is a copy): [`Undefined6799/unset`](https://github.com/Undefined6799/unset)
- The profile editor and its limits (limits.json here is a mirror): [`Undefined6799/unset`](https://github.com/Undefined6799/unset)

## docs

[`unset-sh/docs`](https://github.com/unset-sh/docs). Active.

The proposed organisation-only docs.unset.sh framework: a root Hugo site edited by pull requests, source-owned documentation in repository sections, and organisation map views derived from .github. The framework change and cutover are pending. The current app-fed site stays live until an organisation source is ready and the app mirror is stopped.

**Licence:** No licence detected on main yet. The approved root framework licence is AGPL-3.0-only, pending its framework pull request; mirrored source documentation and third-party assets retain their own licences.

**Owns**

- The root Hugo configuration, theme integration, layouts, navigation, front page and publication framework, changed by pull request
- Source-derived organisation map and ownership views from an exact .github revision
- One top folder per participating unset-sh repository; mirrored pages, examples and diagrams remain source-owned and are replaced only by that repository's docs job
- The site build, checks and GitHub Pages publication for docs.unset.sh

**Does not belong here**

- Authoring or hand-editing a source repository's mirrored documentation: the source repository's docs folder
- Hand-maintaining repository ownership descriptions: [`unset-sh/.github`](https://github.com/unset-sh/.github) repos.json
- Shared visual values, assets and the brand contract: [`unset-sh/brand`](https://github.com/unset-sh/brand)
- The shared human documentation standard and authoring templates: [`unset-sh/agent-kit`](https://github.com/unset-sh/agent-kit)
- Application documentation from outside the unset-sh organisation: its source repository; the app is only context in the organisation map

## pds

[`unset-sh/pds`](https://github.com/unset-sh/pds). Active.

The home for unset.sh's PDS image and everything that customises the PDS: the build on top of the official image, the theme for its sign-in and account pages, and their pins. Empty for now; until it moves, the image is built in the app repository (deployment/pds/).

**Licence:** None yet; should be AGPL-3.0-only. The official PDS it builds on keeps its own licence.

**Owns**

- The first-party PDS image: built on the official bluesky-social/pds image, with its upstream source and package versions pinned
- Customising the PDS: the theme for its sign-in and account pages, and any other change to the stock PDS

**Does not belong here**

- Running and deploying the PDS, and the process that holds its admin password (pds-admin): [`Undefined6799/unset`](https://github.com/Undefined6799/unset)
- Colours, fonts and the mark the theme uses: [`unset-sh/brand`](https://github.com/unset-sh/brand)

## lexicons

`unset-sh/lexicons`. Approved, waiting for setup.

A one-way, read-only copy of the sh.unset.* lexicon schemas, pushed by the app's mirror job. Waiting for setup by the owner; the direction reverses later, when the organisation becomes the source of truth.

**Licence:** Not created; MIT, copied from the app.

**Owns**

- The published copy of the sh.unset.* schemas, their docs and examples

**Does not belong here**

- Any edit to a schema: [`Undefined6799/unset`](https://github.com/Undefined6799/unset) (shared/lexicons/schemas/); the mirror copies it here

## messaging

`unset-sh/messaging`. Proposed, not approved.

The private messaging product on unset.cc: one-to-one chat on Matrix today, later communities, channels, roles and voice. Plan drafted, awaiting approval; not created.

**Licence:** Not created; AGPL-3.0-only.

**Owns**

- The chat client and the door (the public process on unset.cc)
- The admin service that alone holds the MAS credential
- Messaging rules, the Matrix adapter and the Synapse policy module
- The Synapse image and the reviewed Synapse and MAS configs
- Its own database tables
- @unset-sh/messaging-contract: the only thing the app pins

**Does not belong here**

- Identity and sign-in: [`Undefined6799/unset`](https://github.com/Undefined6799/unset)
- Generic server code (HTTP kit, CSRF gate, egress guard, sealing): `unset-sh/server-kit`
- Design tokens, fonts and icons: [`unset-sh/brand`](https://github.com/unset-sh/brand)
- Deploying the whole stack: [`Undefined6799/unset`](https://github.com/Undefined6799/unset) (until a deploy repository is decided)

## server-kit

`unset-sh/server-kit`. Proposed, not approved.

Proposed: the generic security code the app and messaging both need (HTTP kit and CSRF gate, egress guard, sealed storage, signed admin envelope, config, log). Not approved yet.

**Licence:** Not created; AGPL-3.0-only for the whole kit.

**Owns**

- Generic server code with no product meaning

**Does not belong here**

- Anything with product meaning: [`Undefined6799/unset`](https://github.com/Undefined6799/unset) or messaging

## agent-kit

[`unset-sh/agent-kit`](https://github.com/unset-sh/agent-kit). Active.

The rules, skills and templates every repository's assistant needs, released as one version and copied into each repository under .claude/, pinned by a lock file.

**Licence:** None on main yet; AGPL-3.0-only in the first release pull request.

**Owns**

- Organisation-wide assistant rules and the three generic engineering documents
- The shared human documentation standard, architecture guidance and authoring templates, shipped as org-documentation
- The CLAUDE.md and AGENTS.md templates
- Shared skills and subagents, the model and effort router text, and the sync script

**Does not belong here**

- A repository's own rules: that repository's CLAUDE.md
- The organisation map: [`unset-sh/.github`](https://github.com/unset-sh/.github)
- Decision records: the organisation's decision records

## workflows

[`unset-sh/workflows`](https://github.com/unset-sh/workflows). Active.

The home for shared CI and release workflows called by full commit. Main currently contains only a README; pull request #1 proposes the check and release workflows, their helper scripts and tests. Consumer adoption and the live release path are not verified.

**Licence:** No licence detected on main; AGPL-3.0-only is proposed in the first implementation pull request.

**Owns**

- Reusable CI and release workflows needed by several organisation repositories, proposed in pull request #1
- The helper scripts those workflows run and checks of their contracts and safety boundaries
- The shared workflow input contracts, provenance and adoption guidance for calls pinned to full commits

**Does not belong here**

- A workflow needed by only one repository, or a caller's own triggers and inputs: the calling repository
- Shared assistant rules, skills and organisation decision records: [`unset-sh/agent-kit`](https://github.com/unset-sh/agent-kit)
- The organisation map: [`unset-sh/.github`](https://github.com/unset-sh/.github)
