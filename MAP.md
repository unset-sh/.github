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
| [`unset-sh/brand`](https://github.com/unset-sh/brand) | Active | Fixed files that say what unset.sh looks like, as pinned copies of the design sheet. Ships the package @unset-sh/brand (data only) on GitHub Packages. |
| [`unset-sh/presentation`](https://github.com/unset-sh/presentation) | Active | Templates and the one rendering path for preview images and embeds, with a gallery of hard cases. Ships @unset-sh/presentation on GitHub Packages; no running service. |
| [`unset-sh/profile-recipes`](https://github.com/unset-sh/profile-recipes) | Active | Persona profile layouts (recipes) with a guide an AI assistant follows to build someone's profile, plus sample records checked against the lexicons. |
| [`unset-sh/docs`](https://github.com/unset-sh/docs) | Active | Every repository's human docs, aggregated, and the docs.unset.sh site built from them on GitHub Pages. Nothing here is written by hand: each source repository's CI pushes its own top folder. Waiting for its first push. |
| [`unset-sh/pds`](https://github.com/unset-sh/pds) | Active | The home for unset.sh's PDS image and everything that customises the PDS: the build on top of the official image, the theme for its sign-in and account pages, and their pins. Empty for now; until it moves, the image is built in the app repository (deployment/pds/). |
| `unset-sh/lexicons` | Approved, waiting for setup | A one-way, read-only copy of the sh.unset.* lexicon schemas, pushed by the app's mirror job. Waiting for setup by the owner; the direction reverses later, when the organisation becomes the source of truth. |
| `unset-sh/messaging` | Proposed, not approved | The private messaging product on unset.cc: one-to-one chat on Matrix today, later communities, channels, roles and voice. Plan drafted, awaiting approval; not created. |
| `unset-sh/server-kit` | Proposed, not approved | Proposed: the generic security code the app and messaging both need (HTTP kit and CSRF gate, egress guard, sealed storage, signed admin envelope, config, log). Not approved yet. |

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
  r_brand --> r_unset
  r_presentation --> r_unset
  r_messaging --> r_unset
  r_server_kit --> r_unset
  r_pds --> r_unset
  r_brand --> r_presentation
  r_unset --> r_profile_recipes
  r_unset --> r_docs
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
- `unset` → `docs`: pushes docs/human and docs/site into unset/ with its own deploy key
- `brand` → `pds`: theme colours and fonts at an exact version (after the move)
- `unset` → `lexicons`: pushes the schemas with its own deploy key
- `brand` → `messaging`: @unset-sh/brand at an exact version
- `server-kit` → `messaging`: pinned kit packages (if server-kit is approved)

## Licences

Everything unset.sh writes is AGPL-3.0-only. Code, fonts and other work we use from others keep their own licence.

Not following the rule yet (changing a published licence needs the owner's decision):

| Repository | Licence today |
| --- | --- |
| `unset` | AGPL-3.0-only, except shared/ and the lexicon schemas, which are MIT (ADR 0012) |
| `.github` | None yet |
| `brand` | None on main; the draft in brand#1 proposes MIT for files, OFL-1.1 for the fonts (third-party) and all rights reserved for the mark and icons |
| `presentation` | None yet |
| `profile-recipes` | MIT for tooling, CC0-1.0 for recipes and sample content |
| `docs` | None yet (empty); holds copies of other repositories' docs |
| `pds` | None yet (empty); the official PDS it builds on is third-party and keeps its own licence |
| `lexicons` | Planned MIT, copied from the app (ADR 0012) |

## unset

[`Undefined6799/unset`](https://github.com/Undefined6799/unset). Active.

The unset.sh app: web, admin, public API, indexer, media proxy, their database and deployment. Lives outside the organisation for now and will be largely rewritten, then wired to the repositories below by pinned releases.

**Licence:** AGPL-3.0-only, except shared/ and the lexicon schemas, which are MIT (ADR 0012).

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

**Licence:** None yet.

**Owns**

- The organisation profile page (profile/README.md)
- This map: repos.json, MAP.md and the daily check that compares them with GitHub
- Community health files shared by every repository, when they are added

**Does not belong here**

- Code, docs or assets of any product: the repository that owns them, from this map

## brand

[`unset-sh/brand`](https://github.com/unset-sh/brand). Active.

Fixed files that say what unset.sh looks like, as pinned copies of the design sheet. Ships the package @unset-sh/brand (data only) on GitHub Packages.

**Licence:** None on main; the draft in brand#1 proposes MIT for files, OFL-1.1 for the fonts (third-party) and all rights reserved for the mark and icons.

**Owns**

- Design tokens (colour, type, spacing), the two fonts, the mark and icons
- Brand guidelines: how to use colour, type and the mark
- source.json: the design sheet version and sha256 of every copied file

**Does not belong here**

- Anything drawn from data, such as link previews and share cards: [`unset-sh/presentation`](https://github.com/unset-sh/presentation)
- Code that decides or serves anything: [`Undefined6799/unset`](https://github.com/Undefined6799/unset)
- A file that is not in the design sheet yet: the design sheet first

## presentation

[`unset-sh/presentation`](https://github.com/unset-sh/presentation). Active.

Templates and the one rendering path for preview images and embeds, with a gallery of hard cases. Ships @unset-sh/presentation on GitHub Packages; no running service.

**Licence:** None yet.

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

**Licence:** MIT for tooling, CC0-1.0 for recipes and sample content.

**Owns**

- Recipes: recipe.json, GUIDE.md, sample records, assets and preview per persona
- AGENTS.md: the rules an assistant follows when applying a recipe
- The validator that checks recipes against a vendored lexicon snapshot and editor limits

**Does not belong here**

- The lexicon schemas themselves (lexicons/ here is a copy): [`Undefined6799/unset`](https://github.com/Undefined6799/unset)
- The profile editor and its limits (limits.json here is a mirror): [`Undefined6799/unset`](https://github.com/Undefined6799/unset)

## docs

[`unset-sh/docs`](https://github.com/unset-sh/docs). Active.

Every repository's human docs, aggregated, and the docs.unset.sh site built from them on GitHub Pages. Nothing here is written by hand: each source repository's CI pushes its own top folder. Waiting for its first push.

**Licence:** None yet (empty); holds copies of other repositories' docs.

**Owns**

- One top folder per source repository, replaced only by that repository's docs job
- The site build and GitHub Pages deploy for docs.unset.sh

**Does not belong here**

- Writing or editing docs: the source repository's docs folder

## pds

[`unset-sh/pds`](https://github.com/unset-sh/pds). Active.

The home for unset.sh's PDS image and everything that customises the PDS: the build on top of the official image, the theme for its sign-in and account pages, and their pins. Empty for now; until it moves, the image is built in the app repository (deployment/pds/).

**Licence:** None yet (empty); the official PDS it builds on is third-party and keeps its own licence.

**Owns**

- The first-party PDS image: built on the official bluesky-social/pds image, with its upstream source and package versions pinned
- Customising the PDS: the theme for its sign-in and account pages, and any other change to the stock PDS

**Does not belong here**

- Running and deploying the PDS, and the process that holds its admin password (pds-admin): [`Undefined6799/unset`](https://github.com/Undefined6799/unset)
- Colours, fonts and the mark the theme uses: [`unset-sh/brand`](https://github.com/unset-sh/brand)

## lexicons

`unset-sh/lexicons`. Approved, waiting for setup.

A one-way, read-only copy of the sh.unset.* lexicon schemas, pushed by the app's mirror job. Waiting for setup by the owner; the direction reverses later, when the organisation becomes the source of truth.

**Licence:** Planned MIT, copied from the app (ADR 0012).

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
