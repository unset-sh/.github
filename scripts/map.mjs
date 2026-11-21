// Renders the organisation map from repos.json into MAP.md and the profile page's
// repository list, and checks that both are current. No dependencies.
//
//   node scripts/map.mjs --write   rewrite MAP.md and the profile section
//   node scripts/map.mjs --check   fail if either is out of date or repos.json is invalid

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const STATUSES = {
  active: "Active",
  pending: "Approved, waiting for setup",
  planned: "Planned, not created",
  proposed: "Proposed, not approved",
  archived: "Archived",
};
const NOT_CREATED = new Set(["pending", "planned", "proposed"]);
export const PROFILE_START = "<!-- org-map:start (generated from repos.json; edit that, then run npm run map) -->";
export const PROFILE_END = "<!-- org-map:end -->";

const root = fileURLToPath(new URL("..", import.meta.url));
const paths = {
  map: `${root}repos.json`,
  out: `${root}MAP.md`,
  profile: `${root}profile/README.md`,
};

export function validate(map) {
  const errors = [];
  if (typeof map.org !== "string" || map.org === "") errors.push("org must be a non-empty string");
  if (typeof map.licenceRule !== "string" || map.licenceRule === "") errors.push("licenceRule must be a non-empty string");
  if (!Array.isArray(map.repos)) return [...errors, "repos must be an array"];
  const names = new Set();
  for (const repo of map.repos) {
    const at = `repo ${JSON.stringify(repo.name)}`;
    if (typeof repo.name !== "string" || repo.name === "") errors.push(`${at}: name must be a non-empty string`);
    if (names.has(repo.name)) errors.push(`${at}: listed twice`);
    names.add(repo.name);
    if (!(repo.status in STATUSES)) errors.push(`${at}: status must be one of ${Object.keys(STATUSES).join(", ")}`);
    const inOrg = (repo.owner ?? map.org) === map.org;
    if (inOrg && !NOT_CREATED.has(repo.status) && typeof repo.description !== "string") {
      errors.push(`${at}: an existing organisation repository needs description, exactly as GitHub shows it ("" for none)`);
    }
    if (typeof repo.summary !== "string" || repo.summary === "") errors.push(`${at}: summary must be a non-empty string`);
    if (repo.hideFromProfile !== undefined && typeof repo.hideFromProfile !== "boolean") errors.push(`${at}: hideFromProfile must be true or false`);
    const licence = repo.licence;
    if (typeof licence?.current !== "string" || licence.current === "" || typeof licence.followsRule !== "boolean") {
      errors.push(`${at}: licence needs current (text) and followsRule (true or false)`);
    } else if (licence.spdx !== null && typeof licence.spdx !== "string") {
      errors.push(`${at}: licence.spdx must be the identifier GitHub detects, or null`);
    }
    for (const key of ["owns", "notHere", "uses"]) {
      if (!Array.isArray(repo[key])) errors.push(`${at}: ${key} must be an array`);
    }
    for (const item of repo.notHere ?? []) {
      if (typeof item?.what !== "string" || typeof item?.where !== "string") errors.push(`${at}: notHere items need what and where`);
    }
  }
  for (const repo of map.repos) {
    for (const use of repo.uses ?? []) {
      if (!names.has(use?.repo)) errors.push(`repo ${JSON.stringify(repo.name)}: uses unknown repo ${JSON.stringify(use?.repo)}`);
      if (typeof use?.how !== "string" || use.how === "") errors.push(`repo ${JSON.stringify(repo.name)}: each use needs how`);
    }
  }
  if (errors.length === 0) errors.push(...cycles(map));
  return errors;
}

// The map's promise is that dependencies point one way; a cycle breaks it.
function cycles(map) {
  const uses = new Map(map.repos.map((r) => [r.name, r.uses.map((u) => u.repo)]));
  const state = new Map();
  const visit = (name, path) => {
    if (state.get(name) === "done") return [];
    if (state.get(name) === "open") return [`dependency cycle: ${[...path.slice(path.indexOf(name)), name].join(" → ")}`];
    state.set(name, "open");
    const found = uses.get(name).flatMap((next) => visit(next, [...path, name]));
    state.set(name, "done");
    return found;
  };
  return map.repos.flatMap((r) => visit(r.name, []));
}

function fullName(map, repo) {
  return `${repo.owner ?? map.org}/${repo.name}`;
}

function link(map, repo) {
  const name = fullName(map, repo);
  return NOT_CREATED.has(repo.status) ? `\`${name}\`` : `[\`${name}\`](https://github.com/${name})`;
}

// A "where" that names a repository in the map becomes a link; anything else is kept as written.
function where(map, text) {
  const [first, ...rest] = text.split(" ");
  const repo = map.repos.find((r) => r.name === first);
  return repo ? [link(map, repo), ...rest].join(" ") : text;
}

function mermaidId(name) {
  return `r_${name.replace(/[^a-z0-9]/gi, "_")}`;
}

export function renderMap(map) {
  const lines = [
    "# unset-sh organisation map",
    "",
    "<!-- Generated from repos.json by scripts/map.mjs. Edit repos.json, then run npm run map. -->",
    "",
    "Which repository owns what, what does not belong in each, and which way the dependencies point. Read this before",
    "starting work in any unset.sh repository, and update [`repos.json`](repos.json) in the same change that creates,",
    "renames, archives or changes the scope of a repository. A daily check compares this map with GitHub and opens an",
    "issue when they differ.",
    "",
    "## Repositories",
    "",
    "| Repository | Status | What it is |",
    "| --- | --- | --- |",
  ];
  for (const repo of map.repos) {
    lines.push(`| ${link(map, repo)} | ${STATUSES[repo.status]} | ${repo.summary} |`);
  }
  lines.push("", "## Which way dependencies point", "", "An arrow reads \"feeds\": the left side is pinned, copied or pushed into the right. Nothing points back, and the",
    "check fails on a cycle.", "", "```mermaid", "flowchart LR");
  for (const repo of map.repos) {
    const label = NOT_CREATED.has(repo.status) ? `${repo.name} (${repo.status})` : repo.name;
    lines.push(`  ${mermaidId(repo.name)}["${label}"]`);
  }
  for (const repo of map.repos) {
    for (const use of repo.uses) lines.push(`  ${mermaidId(use.repo)} --> ${mermaidId(repo.name)}`);
  }
  lines.push("```", "");
  for (const repo of map.repos) {
    for (const use of repo.uses) lines.push(`- \`${use.repo}\` → \`${repo.name}\`: ${use.how}`);
  }
  const offRule = map.repos.filter((r) => !r.licence.followsRule);
  lines.push("", "## Licences", "", map.licenceRule);
  if (offRule.length > 0) {
    lines.push("", "Not matching the rule yet (changing a published licence needs the owner's decision):", "");
    lines.push("| Repository | Licence today |", "| --- | --- |");
    for (const repo of offRule) lines.push(`| \`${repo.name}\` | ${repo.licence.current} |`);
  }
  for (const repo of map.repos) {
    lines.push("", `## ${repo.name}`, "", `${link(map, repo)}. ${STATUSES[repo.status]}.`, "", repo.summary);
    lines.push("", `**Licence:** ${repo.licence.current}.`);
    if (repo.owns.length > 0) {
      lines.push("", "**Owns**", "", ...repo.owns.map((item) => `- ${item}`));
    }
    if (repo.notHere.length > 0) {
      lines.push("", "**Does not belong here**", "", ...repo.notHere.map((item) => `- ${item.what}: ${where(map, item.where)}`));
    }
  }
  lines.push("");
  return lines.join("\n");
}

export function renderProfileSection(map) {
  const existing = map.repos.filter((r) => !NOT_CREATED.has(r.status) && r.status !== "archived" && !r.hideFromProfile && r.name !== ".github");
  const coming = map.repos.filter((r) => NOT_CREATED.has(r.status) && r.status !== "proposed");
  const lines = [PROFILE_START, "", "### Repositories", "", "| | |", "| --- | --- |"];
  for (const repo of existing) lines.push(`| ${link(map, repo)} | ${repo.summary.split(". ")[0].replace(/\.$/, "")} |`);
  if (coming.length > 0) {
    lines.push("", `Coming: ${coming.map((r) => `\`${r.name}\``).join(", ")}.`);
  }
  lines.push("", "How they fit together: [the organisation map](https://github.com/unset-sh/.github/blob/main/MAP.md).", "", PROFILE_END);
  return lines.join("\n");
}

export function spliceProfile(readme, section) {
  const start = readme.indexOf(PROFILE_START);
  const end = readme.indexOf(PROFILE_END);
  if (start === -1 && end === -1) return `${readme.trimEnd()}\n\n${section}\n`;
  if (start === -1 || end === -1 || end < start) throw new Error("profile/README.md has a broken org-map marker pair");
  return readme.slice(0, start) + section + readme.slice(end + PROFILE_END.length);
}

async function main(mode) {
  const map = JSON.parse(await readFile(paths.map, "utf8"));
  const errors = validate(map);
  if (errors.length > 0) {
    console.error(`repos.json is invalid:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
    process.exit(1);
  }
  const wanted = {
    [paths.out]: renderMap(map),
    [paths.profile]: spliceProfile(await readFile(paths.profile, "utf8"), renderProfileSection(map)),
  };
  const stale = [];
  for (const [path, content] of Object.entries(wanted)) {
    const current = await readFile(path, "utf8").catch(() => "");
    if (current === content) continue;
    if (mode === "--write") await writeFile(path, content);
    else stale.push(path.slice(root.length));
  }
  if (stale.length > 0) {
    console.error(`Out of date with repos.json: ${stale.join(", ")}. Run npm run map and commit the result.`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const mode = process.argv[2];
  if (mode !== "--write" && mode !== "--check") {
    console.error("usage: node scripts/map.mjs --write | --check");
    process.exit(2);
  }
  await main(mode);
}
