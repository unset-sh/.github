# The CLAUDE.md section every repository starts with

Every repository in the organisation has a `CLAUDE.md` at its root (assistants other than Claude read `AGENTS.md`;
a repository that has one makes `CLAUDE.md` import it with `@AGENTS.md`). It starts with the section below, filled
in from that repository's entry in [`repos.json`](../repos.json), so an assistant knows where it is before it
touches anything. The rest of the file is that repository's own rules.

Keep it short: the map holds the detail, and this section points to it.

```markdown
## Where this repository fits

This is `unset-sh/<name>`: <one-line summary from repos.json>.

- **Belongs here:** <the owns list, shortened>.
- **Does not belong here:** <what> (that is `unset-sh/<repo>`); …
- **Uses:** <repo> through <how>. **Used by:** <repo>.

The map of every unset.sh repository is <https://github.com/unset-sh/.github/blob/main/MAP.md>. Read it before
moving work between repositories or starting work that might belong elsewhere.

**Keep the map current.** When a change here adds, removes or moves a responsibility, changes what this repository
uses or ships, or renames or archives it, open a pull request on `unset-sh/.github` that updates `repos.json` (run
`npm run map` there) and update this section to match. Ask the owner before creating any new repository in the
organisation.
```
