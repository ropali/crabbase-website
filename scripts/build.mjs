import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";

const outDir = "dist";
const entries = ["index.html", "docs.html", "assets", "favicon.svg", "robots.txt"];

for (const file of await readdir(".")) {
  if (/^docs-.*\.html$/.test(file)) entries.push(file);
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

for (const entry of entries) {
  await cp(entry, `${outDir}/${entry}`, { recursive: true });
}

await writeFile(`${outDir}/.nojekyll`, "");

console.log(`Static site built to ${outDir}/`);
