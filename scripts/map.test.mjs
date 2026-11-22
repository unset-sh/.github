import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { PROFILE_END, PROFILE_START, renderMap, renderProfileSection, spliceProfile, validate } from "./map.mjs";

const G = [{ id: "g", title: "Group", blurb: "Blurb." }];
const real = JSON.parse(await readFile(new URL("../repos.json", import.meta.url), "utf8"));

function repo(overrides = {}) {
  return {
    name: "brand",
    status: "active",
    description: "d",
    summary: "s.",
    group: "g",
    licence: { spdx: null, current: "None yet", followsRule: false },
    owns: [],
    notHere: [],
    uses: [],
    ...overrides,
  };
}

test("repos.json is valid", () => {
  assert.deepEqual(validate(real), []);
});

test("a repository listed twice is refused", () => {
  assert.match(validate({ org: "o", licenceRule: "AGPL", groups: G, repos: [repo(), repo()] }).join(), /listed twice/);
});

test("an unknown status is refused", () => {
  assert.match(validate({ org: "o", licenceRule: "AGPL", groups: G, repos: [repo({ status: "live" })] }).join(), /status must be one of/);
});

test("a use of a repository not in the map is refused", () => {
  assert.match(validate({ org: "o", licenceRule: "AGPL", groups: G, repos: [repo({ uses: [{ repo: "ghost", how: "x" }] })] }).join(), /unknown repo "ghost"/);
});

test("an existing organisation repository needs its GitHub description", () => {
  assert.match(validate({ org: "o", licenceRule: "AGPL", groups: G, repos: [repo({ description: undefined })] }).join(), /needs description/);
  assert.deepEqual(validate({ org: "o", licenceRule: "AGPL", groups: G, repos: [repo({ description: undefined, status: "planned" })] }), []);
  assert.deepEqual(validate({ org: "o", licenceRule: "AGPL", groups: G, repos: [repo({ description: undefined, owner: "someone" })] }), []);
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
    groups: G,
    repos: [repo(), repo({ name: "hidden", hideFromProfile: true }), repo({ name: "idea", status: "proposed" }), repo({ name: "soon", status: "planned" })],
  });
  assert.ok(section.includes('<a href="https://github.com/o/brand"><strong>brand</strong></a>'));
  assert.ok(!section.includes("hidden"));
  assert.ok(!section.includes("idea"));
  assert.match(section, /<strong>soon<\/strong>[\s\S]*Planned, not created/);
  assert.ok(!section.includes("https://github.com/o/soon"));
});

test("the profile section pairs cards with aligned resource rows and escapes text", () => {
  const section = renderProfileSection({
    org: "o",
    groups: [...G, { id: "empty", title: "Empty", blurb: "None." }],
    repos: [repo({ tagline: "a <b> & c" }), repo({ name: "b2", links: { site: "https://example.com", package: "@o/b2" } }), repo({ name: "c3" })],
  });
  for (const name of ["brand", "b2", "c3"]) {
    assert.ok(section.includes(`<a href="https://github.com/o/${name}"><strong>${name}</strong></a>`));
  }
  assert.equal(section.match(/<tr>/g).length, 4);
  assert.ok(section.includes('<td width="440"></td>'));
  assert.equal(section.match(/valign="bottom"/g).length, 3);
  assert.ok(section.includes("a &lt;b&gt; &amp; c"));
  assert.ok(section.includes('<a href="https://example.com">example.com</a>'));
  assert.ok(section.includes("<code>@o/b2</code>"));
  assert.ok(!section.includes("## Empty"));
});

test("links must be docs, site or package, and URLs https", () => {
  const errors = validate({ org: "o", licenceRule: "AGPL", groups: G, repos: [repo({ links: { docs: "http://x", wiki: "https://x" } })] }).join();
  assert.match(errors, /links\.docs must be an https URL/);
  assert.match(errors, /links\.wiki is not/);
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
    licenceRule: "AGPL",
    groups: G,
    repos: [repo({ name: "a", uses: [{ repo: "b", how: "x" }] }), repo({ name: "b", uses: [{ repo: "a", how: "x" }] })],
  });
  assert.match(errors.join(), /dependency cycle: a → b → a/);
});

test("every repository states its licence against the rule", () => {
  assert.match(validate({ org: "o", licenceRule: "AGPL", groups: G, repos: [repo({ licence: undefined })] }).join(), /licence needs current/);
  assert.match(validate({ org: "o", repos: [repo()] }).join(), /licenceRule must be/);
});

test("the map lists the repositories whose licence does not follow the rule", () => {
  const text = renderMap({
    org: "o",
    licenceRule: "All AGPL.",
    repos: [repo(), repo({ name: "ok", licence: { spdx: "AGPL-3.0", current: "AGPL-3.0-only", followsRule: true } })],
  });
  const section = text.slice(text.indexOf("## Licences"), text.indexOf("## brand"));
  assert.match(section, /All AGPL\./);
  assert.match(section, /\| `brand` \| None yet \|/);
  assert.ok(!section.includes("`ok`"));
});

test("a group of one keeps its compact introduction", () => {
  const section = renderProfileSection({ org: "o", groups: G, repos: [repo()] });
  assert.ok(section.includes('<a href="https://github.com/o/brand"><strong>brand</strong></a> &nbsp;d<br>'));
  assert.ok(!section.includes("<table>"));
});
