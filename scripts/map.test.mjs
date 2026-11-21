import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { PROFILE_END, PROFILE_START, renderMap, renderProfileSection, spliceProfile, validate } from "./map.mjs";

const real = JSON.parse(await readFile(new URL("../repos.json", import.meta.url), "utf8"));

function repo(overrides = {}) {
  return { name: "brand", status: "active", description: "d", summary: "s.", owns: [], notHere: [], uses: [], ...overrides };
}

test("repos.json is valid", () => {
  assert.deepEqual(validate(real), []);
});

test("a repository listed twice is refused", () => {
  assert.match(validate({ org: "o", repos: [repo(), repo()] }).join(), /listed twice/);
});

test("an unknown status is refused", () => {
  assert.match(validate({ org: "o", repos: [repo({ status: "live" })] }).join(), /status must be one of/);
});

test("a use of a repository not in the map is refused", () => {
  assert.match(validate({ org: "o", repos: [repo({ uses: [{ repo: "ghost", how: "x" }] })] }).join(), /unknown repo "ghost"/);
});

test("an existing organisation repository needs its GitHub description", () => {
  assert.match(validate({ org: "o", repos: [repo({ description: undefined })] }).join(), /needs description/);
  assert.deepEqual(validate({ org: "o", repos: [repo({ description: undefined, status: "planned" })] }), []);
  assert.deepEqual(validate({ org: "o", repos: [repo({ description: undefined, owner: "someone" })] }), []);
});

test("the map lists every repository and every dependency edge", () => {
  const text = renderMap(real);
  for (const r of real.repos) assert.ok(text.includes(`## ${r.name}\n`), r.name);
  for (const r of real.repos) for (const use of r.uses) assert.ok(text.includes(`\`${use.repo}\` → \`${r.name}\``));
});

test("repositories not created yet are not linked", () => {
  const text = renderMap({ org: "o", repos: [repo({ name: "later", status: "planned" })] });
  assert.ok(text.includes("`o/later`"));
  assert.ok(!text.includes("https://github.com/o/later"));
});

test("the profile section leaves out hidden and proposed repositories", () => {
  const section = renderProfileSection({
    org: "o",
    repos: [repo(), repo({ name: "hidden", hideFromProfile: true }), repo({ name: "idea", status: "proposed" }), repo({ name: "soon", status: "planned" })],
  });
  assert.ok(section.includes("o/brand"));
  assert.ok(!section.includes("hidden"));
  assert.ok(!section.includes("idea"));
  assert.ok(section.includes("Coming: `soon`."));
});

test("the profile section replaces only the text between its markers", () => {
  const before = `top\n\n${PROFILE_START}\nold\n${PROFILE_END}\n\nbottom\n`;
  assert.equal(spliceProfile(before, "NEW"), "top\n\nNEW\n\nbottom\n");
  assert.equal(spliceProfile("top\n", "NEW"), "top\n\nNEW\n");
  assert.throws(() => spliceProfile(`${PROFILE_END}\n${PROFILE_START}`, "NEW"), /broken/);
});

test("a dependency cycle is refused", () => {
  const errors = validate({
    org: "o",
    repos: [repo({ name: "a", uses: [{ repo: "b", how: "x" }] }), repo({ name: "b", uses: [{ repo: "a", how: "x" }] })],
  });
  assert.match(errors.join(), /dependency cycle: a → b → a/);
});
