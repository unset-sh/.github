# .github

Organisation profile and community health files for unset.sh, and the map of the organisation's repositories.

| Path | Holds |
| --- | --- |
| [`profile/README.md`](profile/README.md) | The organisation's front page on GitHub. Its repository list is generated |
| [`repos.json`](repos.json) | The map: every repository, what it owns, what does not belong in it, and what it uses |
| [`MAP.md`](MAP.md) | The map rendered for people and assistants, generated from `repos.json` |
| [`docs/claude-md.md`](docs/claude-md.md) | The section every repository's `CLAUDE.md` starts with |
| [`scripts/`](scripts/) | The renderer, the drift check and their tests (Node, no dependencies) |

## Change the map

Edit `repos.json`, run `npm run map`, and open a pull request with both. CI fails if `MAP.md` or the profile page
does not match `repos.json`, if a repository is listed twice, uses one the map does not know, or if the dependencies
form a cycle.

Every day, and on demand from the Actions tab, a job compares the map with the organisation's public repositories on
GitHub: a repository missing from the map, one archived, renamed or deleted, one planned that now exists, or a
description that differs. While anything differs it keeps one issue labelled `org-map-drift` open, and it closes the
issue once they match. Private repositories cannot be seen with the workflow's own token, so private entries are
listed in the issue as not checked.
