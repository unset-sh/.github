# Changelog

Each entry says what changes for a repository that calls these workflows, in plain words. The release page
shows the entry of its version.

Changes merged since the last release go under "Unreleased". The release pull request renames that heading to
the new version and raises `package.json` to match; merging it starts the release.

## Unreleased

The first release from `unset-sh/.github`. Category sources generate the committed flat GitHub entry points; consumers use full commit pins. This preserves the check/release implementation from workflows PR #1 and changes its repository and signer paths.

The first release. A repository that calls these workflows gains:

- **`ci-check.yml`**: the check on pull requests and on `main`. It installs the Node version `.nvmrc` names and
  runs `npm run check`, or the command passed in, with a read-only token. Inputs: `install`, `command`, `keep`,
  `timeout-minutes`.
- **`releases-package.yml`**: the release, started by a raised version in `package.json` on `main`. It refuses to build
  unless the `release` environment is the owner's alone and limited to `main`, builds once, waits for the
  owner's approval, then attests the files, publishes them and creates the tag `v<version>` at that commit.
  Inputs: `install`, `check`, `build`, `files`, `npm-package`.

Both are for public repositories.

An npm package is held to more than before. Its `publishConfig` may set only `registry`, because npm reads
every other key there as one of its own settings when it publishes. The packed file is read again after the
approval and is published only if its `package.json` is the one on `main`. Its files need plain ASCII names
of ordinary length, without `:`, `\`, `|`, `<`, `>` or `?`, and the package holds no `.git` folder.

Each release of this repository attaches its workflow files, attested. Before a repository takes a newer
commit of these workflows, the commands in `docs/site/release-reference.md` under "Verify a workflow version" show
that the commit was released through the owner's approval; a tag alone does not.

To move a repository to them, replace the jobs in its `ci.yml` and `release.yml` with the callers in
`templates/`, following `docs/site/`, add a `CHANGELOG.md` if it has none, and change the verify command it documents to name
`unset-sh/.github/.github/workflows/releases-package.yml` as the signer.
