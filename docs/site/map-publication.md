---
title: "Automatic map publication"
description: "Keep the organisation map and profile navigation current with their reviewed source."
weight: 25
type: docs
params:
  doc_kind: guide
---

Edit `repos.json` when declared ownership, plans or explanations change. CI generates and validates the map
before accepting the change. Once that source reaches main, the shared publisher refreshes `MAP.md` and the
marked repository-navigation block in `profile/README.md`. The generated-only update needs no separate owner
approval. The banner, introduction, links and any other authored README text remain unchanged.

## When updates run

The caller runs on relevant main-branch changes, hourly at minute 41, and through **Run workflow** in
[map-publish](https://github.com/unset-sh/.github/actions/workflows/map-publish.yml). GitHub may delay scheduled
runs. A no-change run creates no branch or pull request. Local previews use `npm run map` and `npm run check`.

`.github/maps.json` registers the renderer and its two fixed Markdown outputs. These committed GitHub views use
tooling's `automation-org-map.yml`; the website's registry uses the separate JSON-only shared refresh workflow.
The website already refreshes its source snapshots during publication; GitHub's profile instead displays the
committed README, so it needs this publishing step.

## Source and verification

A read-only job checks out one exact source revision, regenerates the views and runs the repository checks.
It accepts a change only to the two registered outputs. An isolated job runs only pinned tooling code, validates
that snapshot against the original README and source revision, then creates and squash-merges its generated-only
PR. It never executes the source repository's scripts with a write token.

The workflow does not grant approval to a new ownership decision, infer a deployment from a repository's
existence, or rewrite explanatory text. The daily drift report still identifies public repository metadata that
the curated source has not adopted. Workflow maps derive their relationships directly from committed YAML.

## Failure and recovery

A failed generation or validation leaves the published profile unchanged. Observed main changes stop publication.
The final check and GitHub's merge are not atomic for the base branch, so a source change in that gap can leave
a temporarily stale generated view. A successful current-main scheduled or manual run restores it; schedules can
be delayed, and older queued runs may refuse. Retrying reuses an existing publication branch and PR only when
their complete tree, sole source parent and head match the validated snapshot. It never overwrites a branch.

GitHub must allow Actions to create pull requests. Any required checks, review rules or merge restrictions still
apply: the publisher reports refusal and leaves the PR for investigation. Do not weaken those protections to
silence a failed run. Routine map publication uses no stored credential and does not change release or production
approval rules.

GitHub documents that events produced by `GITHUB_TOKEN` do not generally trigger another workflow, and bot-created
PR workflows can require permission to run. This publisher validates the exact outputs before creating the PR;
it does not claim those bot PR checks ran. See [workflow triggering](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).
