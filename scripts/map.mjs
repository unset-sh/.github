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
const PROFILE_ICONS = new Set(["unset-mark", "palette", "media-image", "layout-left", "code-brackets-square", "repository", "open-book"]);
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
  const groups = new Set((map.groups ?? []).map((g) => g.id));
  if (!Array.isArray(map.groups) || map.groups.some((g) => !g.id || !g.title || !g.blurb)) {
    errors.push("groups must be a list of { id, title, blurb }");
  }
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
    if (!groups.has(repo.group)) errors.push(`${at}: group must be one of the ids in groups`);
    if (repo.icon !== undefined && !PROFILE_ICONS.has(repo.icon)) errors.push(`${at}: icon must name a bundled profile icon`);
    for (const [key, value] of Object.entries(repo.links ?? {})) {
      if (!["docs", "site", "package"].includes(key)) errors.push(`${at}: links.${key} is not docs, site or package`);
      else if (key !== "package" && !/^https:\/\//.test(value)) errors.push(`${at}: links.${key} must be an https URL`);
    }
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

const ORG_URL = "https://github.com/unset-sh";
const MAP_URL = `${ORG_URL}/.github/blob/main/MAP.md`;
const BRAND_ASSETS = "https://raw.githubusercontent.com/unset-sh/brand/08ecda2dcdbd8eb44b5262887cc215d501a59db6/logo";

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function profileIcon(name) {
  if (name === "unset-mark") {
    return `<picture><source media="(prefers-color-scheme: dark)" srcset="${BRAND_ASSETS}/unset-mark-platinum.svg"><img src="${BRAND_ASSETS}/unset-mark-onyx.svg" width="60" alt=""></picture> &nbsp;`;
  }
  return PROFILE_ICONS.has(name)
    ? `<picture><img src="./icons/${name}.svg" width="24" height="24" alt=""></picture> &nbsp;`
    : "";
}

function profileCardParts(map, repo) {
  const name = fullName(map, repo);
  const created = !NOT_CREATED.has(repo.status);
  const label = created
    ? `<a href="https://github.com/${name}"><strong>${escapeHtml(repo.name)}</strong></a>`
    : `<strong>${escapeHtml(repo.name)}</strong>`;
  const title = profileIcon(repo.icon) + label;
  const links = [];
  if (repo.links?.docs) links.push(`<a href="${escapeHtml(repo.links.docs)}">Docs</a>`);
  if (repo.links?.site) links.push(`<a href="${escapeHtml(repo.links.site)}">${escapeHtml(new URL(repo.links.site).host)}</a>`);
  if (repo.links?.package) links.push(`<code>${escapeHtml(repo.links.package)}</code>`);
  return {
    title,
    text: escapeHtml(repo.tagline ?? repo.description ?? repo.summary),
    links: links.join(" &nbsp;·&nbsp; "),
    status: created ? "" : escapeHtml(STATUSES[repo.status]),
  };
}

function profileCards(map, repos) {
  const cards = repos.map((repo) => profileCardParts(map, repo));
  const hasFooter = cards.some((card) => card.links !== "");
  const lines = ["<tbody>", "<tr>"];
  for (const { title, text, links, status } of cards) {
    const span = hasFooter && !links ? ' rowspan="2"' : "";
    lines.push(`<td width="440" valign="top"${span}>`, `<h3>${title}</h3>`, `<p>${text}</p>`);
    if (status) lines.push(`<p><sub>${status}</sub></p>`);
    lines.push("</td>");
  }
  if (cards.length === 1) lines.push(`<td width="440"${hasFooter ? ' rowspan="2"' : ""}></td>`);
  lines.push("</tr>");
  if (hasFooter) {
    lines.push("<tr>");
    for (const { links } of cards) {
      if (links) lines.push('<td width="50%" valign="bottom">', `<sub>${links}</sub>`, "</td>");
    }
    lines.push("</tr>");
  }
  lines.push("</tbody>");
  return lines;
}

function profileLine(map, repo) {
  const { title, text, links, status } = profileCardParts(map, repo);
  return [`${title} &nbsp;${text}`, ...(status ? [`<br><sub>${status}</sub>`] : []), ...(links ? ["<br>", links] : []), ""];
}

// Repositories the profile page shows: existing ones not hidden, and approved ones not created yet.
export function profileRepos(map) {
  return map.repos.filter((r) => r.status !== "archived" && r.status !== "proposed" && !r.hideFromProfile);
}

export function renderProfileSection(map) {
  const shown = profileRepos(map);
  const lines = [PROFILE_START, ""];
  for (const group of map.groups) {
    const repos = shown.filter((r) => r.group === group.id);
    if (repos.length === 0) continue;
    lines.push(`## ${group.title}`, "", group.blurb, "");
    if (repos.length === 1) {
      lines.push(...profileLine(map, repos[0]));
      continue;
    }
    lines.push("<table>");
    for (let i = 0; i < repos.length; i += 2) {
      lines.push(...profileCards(map, repos.slice(i, i + 2)));
    }
    lines.push("</table>", "");
  }
  lines.push(
    "---",
    "",
    `<sub>Repository boundaries, dependencies and licences: <a href="${MAP_URL}">organisation map</a>. ` +
      `<a href="${ORG_URL}/.github/blob/main/CONTRIBUTING.md">How to contribute</a>.</sub>`,
    "",
    PROFILE_END,
  );
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
