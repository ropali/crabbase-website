import { mkdir, readFile, writeFile } from "node:fs/promises";

const REPO = process.env.DOCS_REPO || "ropali/crabbase";
const REF = process.env.DOCS_REF || "main";
const OFFLINE = process.env.DOCS_OFFLINE === "1";
const STRICT = process.env.DOCS_STRICT === "1";

const FILES = [
  "getting-started.md",
  "collections-and-records.md",
  "authentication.md",
  "files-and-uploads.md",
  "settings-email.md",
  "backups-and-jobs.md"
];

const source = (file) => `https://raw.githubusercontent.com/${REPO}/${REF}/docs/${file}`;

async function get(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "crabbase-website-build",
      accept: "text/plain"
    }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

await mkdir("docs-src", { recursive: true });

let updated = 0;
let unchanged = 0;
const skipped = [];
const missing = [];

for (const file of FILES) {
  const target = `docs-src/${file}`;
  let local = null;
  try {
    local = await readFile(target, "utf8");
  } catch {
    /* not there yet */
  }

  if (OFFLINE) {
    skipped.push(`${file} (DOCS_OFFLINE=1)`);
    if (local === null) missing.push(file);
    continue;
  }

  try {
    const remote = await get(source(file));
    if (local === remote) {
      unchanged += 1;
      continue;
    }
    await writeFile(target, remote);
    updated += 1;
    console.log(`sync:docs  updated ${target}`);
  } catch (error) {
    if (local === null) {
      missing.push(file);
      console.warn(`sync:docs  ${file}: ${error.message}, and no local copy`);
    } else {
      skipped.push(`${file} (${error.message}, kept the local copy)`);
    }
  }
}

const summary = [];
if (updated) summary.push(`${updated} updated`);
if (unchanged) summary.push(`${unchanged} unchanged`);
if (skipped.length) summary.push(`${skipped.length} kept local`);
console.log(`sync:docs  ${REPO}@${REF}: ${summary.join(", ") || "nothing to do"}`);
for (const note of skipped) console.warn(`  - ${note}`);
for (const note of missing) console.error(`  - missing: docs-src/${note}`);

if (missing.length) process.exit(1);
if (STRICT && (skipped.length || updated + unchanged < FILES.length)) {
  console.error("sync:docs  DOCS_STRICT=1 and at least one file was not fetched");
  process.exit(1);
}
