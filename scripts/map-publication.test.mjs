import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

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
  assert.match(source, /actions: write/);
  assert.match(source, /cancel-in-progress: false/);
});

const pending = "(startsWith(github.ref, 'refs/heads/automation/map-') || inputs.pull-request != '' || inputs.expected-head != '' || inputs.expected-base != '')";
const empty = "!startsWith(github.ref, 'refs/heads/automation/map-') && inputs.pull-request == '' && inputs.expected-head == '' && inputs.expected-base == ''";
const guard = `github.event_name == 'workflow_dispatch' && ${pending}`;
const job = (source, name) => new RegExp(`^  ${name}:\\n([\\s\\S]*?)(?=^  [a-z][a-z-]*:|(?![\\s\\S]))`, "m").exec(source.slice(source.indexOf("\njobs:\n")))?.[1];
const field = (source, name, spaces = 4) => new RegExp(`^ {${spaces}}${name}: (.+)$`, "m").exec(source)?.[1];
function evaluate(expression, { event, ref = "refs/heads/staging", proof = "skipped", check = "success", cancelled = false, inputs = {} }) {
  const program = expression.replace(/^\$\{\{\s*/, "").replace(/\s*\}\}$/, "")
    .replace(/inputs\.(pull-request|expected-head|expected-base)/g, 'inputs["$1"]')
    .replaceAll("needs.verify-generated", 'needs["verify-generated"]');
  return runInNewContext(program, { github: { event_name: event, ref },
    needs: { "verify-generated": { result: proof }, check: { result: check } }, inputs: { "pull-request": "", "expected-head": "", "expected-base": "", ...inputs },
    always: () => true, cancelled: () => cancelled, startsWith: (value, prefix) => value.toLowerCase().startsWith(prefix.toLowerCase()) });
}

test("generated map dispatch uses all three exact inputs and cannot satisfy a skipped or failed guard", () => {
  for (const file of ["org-map.yml", "docs-export.yml", "branch-policy.yml"]) {
    const source = read(`.github/workflows/${file}`);
    for (const input of ["pull-request", "expected-head", "expected-base"]) {
      assert.ok(source.includes(`      ${input}:\n        description:`));
      assert.ok(source.includes(`${input}: \${{ inputs.${input} }}`));
    }
    assert.match(source, /uses: unset-sh\/tooling\/\.github\/workflows\/ci-branch-policy.yml@[0-9a-f]{40}/);
  }
  for (const file of ["org-map.yml", "docs-export.yml"]) {
    const source = read(`.github/workflows/${file}`);
    assert.ok(source.includes(`if: ${guard}`));
    assert.ok(source.includes(`needs: verify-generated`));
    assert.ok(source.includes("if: always() && !cancelled()"));
  }
});

test("dispatch checks preserve required names, prove committed freshness, and never enter the drift writer", () => {
  const map = read(".github/workflows/org-map.yml");
  assert.match(map, /name: Check the organisation map/);
  assert.ok(map.includes("run: git diff --exit-code -- MAP.md profile/README.md"));
  assert.ok(map.includes(`if: github.event_name == 'schedule' || (github.event_name == 'workflow_dispatch' && ${empty})`));
  const docs = read(".github/workflows/docs-export.yml");
  assert.match(docs, /^ {2}check:\n/m);
  assert.match(docs, /uses: unset-sh\/tooling\/\.github\/workflows\/ci-check.yml@7cd2e8c3d284cd9bb90c54f336adc0834b515d97/);
  assert.match(docs, /^ {2}export:\n {4}needs: check/m);
});

test("actual caller expressions fail closed for missing inputs or a failed proof while preserving ordinary events", () => {
  const map = read(".github/workflows/org-map.yml"), docs = read(".github/workflows/docs-export.yml");
  const mapCheck = job(map, "check"), docsCheck = job(docs, "check");
  const generated = `refs/heads/automation/map-${"a".repeat(40)}`;
  for (const state of [
    { event: "workflow_dispatch", ref: generated, proof: "failure" },
    { event: "workflow_dispatch", ref: generated, proof: "skipped" },
    { event: "workflow_dispatch", ref: generated, proof: "cancelled" },
    { event: "workflow_dispatch", inputs: { "expected-head": "bad" }, proof: "failure" },
  ]) {
    assert.equal(evaluate(field(job(map, "verify-generated"), "if"), state), true);
    assert.equal(evaluate(field(mapCheck, "if"), state), true, "required map job must run to fail");
    assert.equal(evaluate(field(mapCheck, "if", 8), state), true, "first map step must fail before checkout");
    assert.equal(evaluate(field(docsCheck, "if"), state), true, "required reusable job must run to fail");
    assert.equal(evaluate(field(docsCheck, "command", 6), state), "exit 1");
    assert.equal(evaluate(field(job(map, "drift"), "if"), state), false);
  }
  const success = { event: "workflow_dispatch", ref: generated, proof: "success", inputs: { "pull-request": "17", "expected-head": "b".repeat(40), "expected-base": "a".repeat(40) } };
  assert.equal(evaluate(field(mapCheck, "if", 8), success), false);
  assert.equal(evaluate(field(docsCheck, "command", 6), success), "bun run map && bun run check");
  for (const event of ["pull_request", "push", "workflow_dispatch"]) {
    const ordinary = { event };
    assert.equal(evaluate(field(job(map, "verify-generated"), "if"), ordinary), false);
    assert.equal(evaluate(field(docsCheck, "command", 6), ordinary), "bun run map && bun run check");
    assert.equal(evaluate(field(mapCheck, "if"), ordinary), event !== "workflow_dispatch");
    assert.equal(evaluate(field(job(map, "drift"), "if"), ordinary), event === "workflow_dispatch");
  }
  assert.ok(docsCheck.includes("install: false"));
});

test("source changes are regenerated before validation without committing derived files by hand", () => {
  const checks = read(".github/workflows/org-map.yml");
  assert.match(checks, /bun run map\n\s+bun run check/);
  const docs = read(".github/workflows/docs-export.yml");
  assert.ok(docs.includes("'bun run map && bun run check' || 'exit 1'"));
});

test("documentation export follows the check result despite the optional verifier being skipped", () => {
  const expression = field(job(read(".github/workflows/docs-export.yml"), "export"), "if");
  assert.ok(expression, "export needs an explicit condition to override the skipped ancestor");
  assert.match(expression, /always\(\)/);
  for (const event of ["pull_request", "push", "workflow_dispatch"]) {
    assert.equal(evaluate(expression, { event, proof: "skipped", check: "success" }), true);
    for (const check of ["failure", "cancelled", "skipped"]) {
      assert.equal(evaluate(expression, { event, proof: "skipped", check }), false);
    }
    assert.equal(evaluate(expression, { event, check: "success", cancelled: true }), false);
  }
  const generated = { event: "workflow_dispatch", ref: `refs/heads/automation/map-${"a".repeat(40)}` };
  assert.equal(evaluate(expression, { ...generated, proof: "success", check: "success" }), true);
  for (const proof of ["failure", "cancelled", "skipped"]) {
    assert.equal(evaluate(expression, { ...generated, proof, check: "failure" }), false);
  }
});
