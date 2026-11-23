import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the shared publisher is registered for only the generated map and profile", () => {
  assert.deepEqual(JSON.parse(read(".github/maps.json")), {
    schemaVersion: 1,
    maps: [{ id: "organisation", generator: "scripts/map.mjs", arguments: ["--write"],
      outputs: ["MAP.md", "profile/README.md"] }],
  });
});

test("map publication uses pinned shared tooling only from trusted main events", () => {
  const source = read(".github/workflows/map-publish.yml");
  assert.match(source, /push:\n    branches: \[main\]/);
  assert.match(source, /schedule:/);
  assert.match(source, /workflow_dispatch:/);
  assert.doesNotMatch(source, /pull_request|workflow_run|secrets\.|run:|persist-credentials/);
  assert.match(source, /permissions: \{\}/);
  assert.match(source, /uses: unset-sh\/tooling\/\.github\/workflows\/automation-org-map.yml@[0-9a-f]{40}/);
  assert.match(source, /if: github.ref == 'refs\/heads\/main'/);
  assert.match(source, /contents: write/);
  assert.match(source, /pull-requests: write/);
  assert.match(source, /cancel-in-progress: false/);
});

test("source changes are regenerated before validation without committing derived files by hand", () => {
  const checks = read(".github/workflows/org-map.yml");
  assert.match(checks, /npm run map\n\s+npm run check/);
  const docs = read(".github/workflows/docs-export.yml");
  assert.match(docs, /command: npm run map && npm run check/);
});
