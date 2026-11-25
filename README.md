# Crabbase website

The landing page and documentation for Crabbase: plain HTML, one hand-written CSS system, small
vanilla JavaScript files, and a build step that turns the Markdown in `docs-src/` into the docs
pages. No framework and no runtime dependencies, so it deploys to GitHub Pages or any static host.

## Stack

- `index.html` — the landing page.
- `docs.html`, `docs-collections.html`, `docs-authentication.html`, `docs-files.html`,
  `docs-settings.html`, `docs-backups.html` — documentation, generated from `docs-src/*.md`.
- `assets/system.css`, `assets/system.js` and the kit folders (`layout/`, `ui/`, `motion/`,
  `moments/`, `diagrams/`, `backgrounds/`, `icons/`) — the shared design system: tokens, grid,
  buttons, nav, cards, sections, motion, icons and diagrams.
- `assets/css/site.css` — the page-specific parts: the admin window in the hero, feature panes,
  the terminal, steps, facts and footer.
- `assets/css/docs.css` — the documentation shell and article typography.
- `assets/js/docs.js` — docs search, sidebar, copy buttons, table of contents.
- `assets/js/github-stars.js` — live star count and version label.
- `assets/js/site.js` — the pointer light over the hero dashboard, and its resting position.
- `marked` turns the docs Markdown into HTML; `highlight.js` highlights every fenced code block at build time.
- `scripts/sync-docs.mjs` pulls the Markdown from the public Crabbase repository (`main`) before every build.

## Type

The site uses **Instrument Sans** for every interface and display role and **DM Mono** for code.
The pair, the exact tokens, the self-hosting CSS and the admin migration table are in
[`FONT-HANDOVER.md`](./FONT-HANDOVER.md), written to drop into `crates/admin-ui`.

## Local development

```bash
npm install
npm run dev
```

`npm run dev` regenerates the docs pages and serves the project root at `http://localhost:4173`
(or the next free port). There is no CSS build: the stylesheets are plain files, edited directly.

To build and preview the deployable output:

```bash
npm run build
npm run preview
```

`npm run build` regenerates the docs and copies the site into `dist/`. `npm run preview` builds and
serves that directory at `http://localhost:4173`, or the next free port if it is taken (set `PORT`
to choose a different starting port).

## Documentation pages

The Markdown is not copied by hand. `scripts/sync-docs.mjs` downloads the docs from the public
repository before each build:

```
https://raw.githubusercontent.com/ropali/crabbase/main/docs/<file>.md
```

`npm run build:docs` (used by `npm run dev`, `npm run build` and `npm run preview`) runs the sync,
then generates the pages. The synced copies stay in `docs-src/`, so the site still builds offline:
if GitHub is unreachable, the build keeps the committed Markdown and prints a warning.

```sh
npm run sync:docs           # fetch only
DOCS_REF=branch npm run sync:docs   # another branch or tag
DOCS_OFFLINE=1 npm run build:docs   # skip the network entirely
DOCS_STRICT=1 npm run build         # fail the build if GitHub cannot be reached
```

The deploy workflow sets `DOCS_STRICT=1`, so a deploy never ships with stale docs.

- All six pages, including `docs.html`, are generated from `docs-src/*.md`.
- `scripts/build-docs.mjs` converts Markdown to HTML, rewrites internal `.md` links, adds heading
  anchors, builds the right-hand table of contents, and writes `assets/js/docs-search-index.js`.
- Run `npm run build:docs` after editing Markdown. `npm run dev` also generates once at startup.

Edit the source of truth in the main Crabbase repository (`docs/` on `main`), push it, then run
`npm run build` (or `npm run sync:docs`). Nothing in `docs-src/` is hand-edited.

### Add a new doc

1. Add the file to the main repository's `docs/` folder, then add its name to `FILES` in
   `scripts/sync-docs.mjs`.
2. Add an entry to the `DOCS` array in `scripts/build-docs.mjs`:
   ```js
   {
     slug: "deployment",
     file: "deployment.md",
     href: "docs-deployment.html",
     title: "Deployment",
     badge: "Guide",
     header: false
   }
   ```
   Array order controls the sidebar and previous/next links; `header: false` keeps the page out of
   the top bar (the sidebar still lists it).
3. Name the output `docs-*.html` so `scripts/build.mjs` copies it to `dist/`.
4. If other docs link to the new `.md`, add a mapping in `rewriteLinks()`.
5. Run `npm run build`.

## Deploy to GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds the site and deploys `dist/`.
   It also runs daily (04:17 UTC) so documentation changes merged in `ropali/crabbase` reach the
   site without a manual deploy.

If your default branch is not `main`, update the workflow. You can also deploy `dist/` to Netlify,
Cloudflare Pages, Vercel or any static host.

## Customize

- **Colour tokens, fonts, type scale:** the `:root` block in `index.html`, `assets/css/docs.css`
  and `assets/system.css`.
- **Copy and sections:** `index.html`.
- **Reference docs:** the source Markdown in the main repository, `scripts/sync-docs.mjs` and
  `scripts/build-docs.mjs`.
- **Landing-page components:** `assets/css/site.css`.
- **Docs layout:** `assets/css/docs.css` and `assets/js/docs.js`.
- **Version and star count:** `assets/js/github-stars.js` (falls back to the static `v0.1.0`).
- **Live demo button:** currently disabled and marked “soon” in `index.html` and the docs header built by
  `scripts/build-docs.mjs`. When the hosted demo exists, turn it into an `<a class="btn btn--secondary" href="…">`
  in both places.

Facts on the page should stay true to the repository: PostgreSQL 14+, one Rust binary (`serve`,
`admin`, `worker`), collections, REST endpoints, JWT auth, file storage and the admin dashboard.
Realtime, hooks and GraphQL are not implemented yet and are not claimed.

## Design system

The UI kit in `assets/` (system, layout, UI fragments, motion, moments, diagrams, backgrounds,
icons) comes from the **tasteskill** design system (design-taste-frontend 2.5) and is vendored as
plain files. The page is built on its tokens and rules: one section per screen, equal edges, the
dealt palette taken from the Crabbase logo, Instrument Sans with DM Mono, one arrow button pair, one
material-style numberless ground, and two dealt moments (`cursor-spotlight` on the hero window,
`letters-assemble` in the statement). Icon licences are recorded in `assets/icons/icons-credits.json`.

## Structure

```text
.
├── index.html
├── docs.html
├── docs-collections.html
├── docs-authentication.html
├── docs-files.html
├── docs-settings.html
├── docs-backups.html
├── docs-src/
├── assets/
│   ├── system.css, system.js
│   ├── css/            site.css, docs.css
│   ├── images/         logo.png
│   ├── js/             docs.js, github-stars.js, docs-search-index.js
│   ├── layout/ ui/ motion/ moments/ diagrams/ backgrounds/ icons/
├── scripts/
│   ├── build.mjs
│   ├── build-docs.mjs
│   └── serve.mjs
├── favicon.png
├── share.jpg
├── robots.txt
└── .github/workflows/deploy.yml
```
