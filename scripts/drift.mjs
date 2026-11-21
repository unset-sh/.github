// Compares repos.json with the organisation's public repositories on GitHub and
// prints a Markdown report of every difference. Exits 3 when there is drift
// (and 1 when the check itself fails, so the two are never confused).
//
//   node scripts/drift.mjs [report.md]
//
// Lists repositories with GET /orgs/{org}/repos?type=public
// (https://docs.github.com/rest/repos/repos#list-organization-repositories, REST API 2022-11-28).
// Only public repositories are visible without an organisation token, so private
// entries in the map are skipped and say so in the report.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const NOT_CREATED = new Set(["pending", "planned", "proposed"]);

export function compare(map, githubRepos) {
  const findings = [];
  const onGitHub = new Map(githubRepos.filter((r) => !r.fork).map((r) => [r.name, r]));
  const inOrg = map.repos.filter((r) => (r.owner ?? map.org) === map.org);
  const mapped = new Map(inOrg.map((r) => [r.name, r]));

  for (const name of onGitHub.keys()) {
    if (!mapped.has(name)) {
      findings.push(`\`${name}\` exists on GitHub but is not in the map. Add it to repos.json with what it owns.`);
    }
  }
  for (const repo of inOrg) {
    const gh = onGitHub.get(repo.name);
    if (repo.visibility === "private") continue;
    if (NOT_CREATED.has(repo.status)) {
      if (gh) findings.push(`\`${repo.name}\` now exists on GitHub but the map says ${repo.status}. Mark it active and add its description.`);
      continue;
    }
    if (!gh) {
      findings.push(`\`${repo.name}\` is in the map as ${repo.status} but GitHub has no public repository by that name. Was it renamed, deleted or made private?`);
      continue;
    }
    if (gh.archived && repo.status !== "archived") {
      findings.push(`\`${repo.name}\` is archived on GitHub but the map says ${repo.status}. Mark it archived and say where its work went.`);
    }
    if (!gh.archived && repo.status === "archived") {
      findings.push(`\`${repo.name}\` is marked archived in the map but is not archived on GitHub.`);
    }
    const licence = gh.license?.spdx_id ?? null;
    if (licence !== repo.licence.spdx) {
      findings.push(
        `\`${repo.name}\` licence differs. GitHub detects ${JSON.stringify(licence)}; map: ${JSON.stringify(repo.licence.spdx)}. Update the map's licence, and check it against the licence rule.`,
      );
    }
    const description = gh.description ?? "";
    if (description !== repo.description) {
      findings.push(
        `\`${repo.name}\` description differs. GitHub: ${JSON.stringify(description)}; map: ${JSON.stringify(repo.description)}. Change whichever is wrong.`,
      );
    }
  }
  const skipped = inOrg.filter((r) => r.visibility === "private").map((r) => r.name);
  return { findings, skipped };
}

export function report(map, { findings, skipped }, runUrl) {
  const lines = [
    `The organisation map ([repos.json](https://github.com/${map.org}/.github/blob/main/repos.json)) no longer matches GitHub:`,
    "",
    ...findings.map((f) => `- ${f}`),
    "",
    "Fix it with a pull request that edits repos.json and runs `npm run map`. This issue closes itself on the first",
    "daily check that finds no difference.",
  ];
  if (skipped.length > 0) lines.push("", `Not checked (private): ${skipped.map((n) => `\`${n}\``).join(", ")}.`);
  if (runUrl) lines.push("", `Found by ${runUrl}.`);
  return `${lines.join("\n")}\n`;
}

async function listPublicRepos(org) {
  const headers = { accept: "application/vnd.github+json", "x-github-api-version": "2022-11-28" };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const repos = [];
  for (let page = 1; ; page += 1) {
    const url = `https://api.github.com/orgs/${encodeURIComponent(org)}/repos?type=public&per_page=100&page=${page}`;
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`GitHub answered ${response.status} for ${url}`);
    const batch = await response.json();
    repos.push(...batch);
    if (batch.length < 100) return repos;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const map = JSON.parse(await readFile(new URL("../repos.json", import.meta.url), "utf8"));
  const result = compare(map, await listPublicRepos(map.org));
  if (result.findings.length === 0) {
    console.log("The map matches GitHub.");
  } else {
    const runUrl = process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : "";
    const text = report(map, result, runUrl);
    if (process.argv[2]) await writeFile(process.argv[2], text);
    console.log(text);
    process.exit(3);
  }
}
