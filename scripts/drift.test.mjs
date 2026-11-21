import assert from "node:assert/strict";
import { test } from "node:test";
import { compare, report } from "./drift.mjs";

const map = {
  org: "o",
  repos: [
    { name: "app", owner: "someone", status: "active" },
    { name: "brand", status: "active", description: "Brand" },
    { name: "old", status: "active", description: "" },
    { name: "soon", status: "planned" },
    { name: "secret", status: "active", visibility: "private", description: "x" },
  ],
};
const gh = (name, extra = {}) => ({ name, description: null, archived: false, fork: false, ...extra });

test("no findings when the map matches", () => {
  const result = compare(map, [gh("brand", { description: "Brand" }), gh("old")]);
  assert.deepEqual(result.findings, []);
  assert.deepEqual(result.skipped, ["secret"]);
});

test("a repository missing from the map is reported", () => {
  const { findings } = compare(map, [gh("brand", { description: "Brand" }), gh("old"), gh("new")]);
  assert.equal(findings.length, 1);
  assert.match(findings[0], /`new` exists on GitHub but is not in the map/);
});

test("forks are ignored", () => {
  const { findings } = compare(map, [gh("brand", { description: "Brand" }), gh("old"), gh("fork", { fork: true })]);
  assert.deepEqual(findings, []);
});

test("archived, vanished, newly created and changed repositories are reported", () => {
  const { findings } = compare(map, [gh("brand", { description: "Brand!", archived: true }), gh("soon")]);
  const text = findings.join("\n");
  assert.match(text, /`brand` is archived on GitHub/);
  assert.match(text, /`brand` description differs/);
  assert.match(text, /`old` is in the map as active but GitHub has no public repository/);
  assert.match(text, /`soon` now exists on GitHub but the map says planned/);
  assert.equal(findings.length, 4);
});

test("repositories outside the organisation are never checked", () => {
  const { findings } = compare(map, [gh("brand", { description: "Brand" }), gh("old")]);
  assert.ok(!findings.join().includes("app"));
});

test("the report lists findings and skipped private repositories", () => {
  const text = report(map, { findings: ["one"], skipped: ["secret"] }, "https://run");
  assert.match(text, /- one/);
  assert.match(text, /Not checked \(private\): `secret`/);
  assert.match(text, /Found by https:\/\/run/);
});
