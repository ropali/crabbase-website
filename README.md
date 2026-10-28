# Crabbase Landing Page

Static site for Crabbase, implemented from the Stitch design. It is plain HTML, compiled Tailwind CSS, and small vanilla JavaScript files, so it deploys cleanly to GitHub Pages or any static host.

## Stack

- HTML in `index.html`, `docs.html`, and the generated `docs-*.html` pages
- Tailwind CSS 3 with the Crabbase design tokens in `tailwind.config.js`
- Vanilla JavaScript in `assets/js/main.js`, `assets/js/docs.js`, and `assets/js/github-stars.js`
- `marked` (dev dependency) to generate the reference docs from Markdown
- No runtime dependencies or framework

## Local development

```bash
npm install
npm run dev
```

`npm run dev` generates the docs pages, then watches `src/input.css` and rebuilds `assets/css/styles.css`. Open `index.html` directly, or serve the project root with any static server.

To build and preview the production output:

```bash
npm run build
npm run preview
```

`npm run build` generates the docs, compiles and minifies the CSS, then creates a deployable `dist/` directory. `npm run preview` serves that directory at `http://localhost:4173`.

## Documentation pages

- `docs.html` is the hand-crafted Getting Started page.
- `docs-collections.html`, `docs-authentication.html`, `docs-files.html`, and `docs-settings.html` are generated from `docs-src/*.md`.
- `scripts/build-docs.mjs` converts Markdown to HTML, rewrites internal `.md` links, adds heading anchors and tables of contents, and builds `assets/js/docs-search-index.js`.
- Run `npm run build:docs` to regenerate them after editing `docs-src/`.

The Markdown in `docs-src/` is copied from the main Crabbase repository (`docs/`). Update it there first, then sync it here.

### Edit an existing generated doc

The generated pages are `docs-collections.html`, `docs-authentication.html`, `docs-files.html`, and `docs-settings.html`.

1. Update the source in the main Crabbase repository (`docs/`), then copy it into `docs-src/`.
2. Regenerate the pages:
   ```bash
   npm run build:docs
   ```
   Or run `npm run build` to also rebuild the CSS and `dist/`.
3. `npm run dev` generates the docs once at startup; rerun `build:docs` after Markdown edits.
4. Heading IDs, the right-hand TOC, and the search index update automatically.
5. If you add links to another `.md` file, add a mapping in `rewriteLinks()` in `scripts/build-docs.mjs`; otherwise the link points at a `.md` file that is not copied to `dist/`.

### Add a new generated doc

1. Add `docs-src/<new-file>.md` with a `# Title` and an intro paragraph. The intro becomes the page description; `##` headings become the right-hand TOC, and `##`/`###` headings become search entries.
2. Add an entry to the `DOCS` array in `scripts/build-docs.mjs`:
   ```js
   {
     slug: "deployment",
     file: "deployment.md",
     href: "docs-deployment.html",
     title: "Deployment",
     icon: "rocket_launch",
     badge: "Guide"
   }
   ```
   Array order controls sidebar order and previous/next links. `icon` is a Material Symbols name.
3. Generated pages add the sidebar link automatically. Add it manually to the sidebar in `docs.html` if you want it on the Getting Started page.
4. If other docs link to the new `.md`, add a `rewriteLinks()` mapping for it.
5. Name the output `docs-*.html` so `scripts/build.mjs` copies it to `dist/` and Tailwind scans it. If you use another prefix, update `scripts/build.mjs` and `tailwind.config.js`.
6. Run `npm run build` and verify the new page, sidebar, TOC, search, and links.

### Edit the Getting Started page

`docs.html` is hand-crafted; `docs-src/getting-started.md` is not used to generate it.

1. Edit `docs.html` directly.
2. If you add or remove sections, update the manual right-hand TOC and `GETTING_STARTED_INDEX` in `scripts/build-docs.mjs`.
3. Version labels use `data-app-version` and are populated from GitHub by `assets/js/github-stars.js`; keep the static fallback text in `docs.html` and `renderShell()` for no-JS visitors.
4. Run `npm run build`.

## Deploy to GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds the site and deploys `dist/`.

If your default branch is not `main`, update the branch name in the workflow. You can also deploy the contents of `dist/` to Netlify, Cloudflare Pages, Vercel, or any static file host.

## Customize

- **Colors, type scale, spacing:** `tailwind.config.js`
- **Copy, sections, and links:** `index.html` and `docs.html`
- **Reference docs:** `docs-src/*.md`
- **Animations and custom component styles:** `src/input.css`
- **Interactions:** `assets/js/main.js` and `assets/js/docs.js`
- **GitHub stars and version:** `assets/js/github-stars.js`
- **Admin preview:** `assets/images/admin_ui.png` (replace with a new screenshot to update the landing hero)

GitHub links point to `https://github.com/ropali/crabbase` (including the docs edit, issue, security, and release links). Update them if the repository is renamed or forked. The navbar star count is fetched from the public GitHub API and cached in `localStorage` for one hour; if the API is unavailable or rate-limited, the fallback `Star` label remains. Version labels use `data-app-version` and are read from the latest GitHub release, then the latest tag, then `crabbase/Cargo.toml`; the static `v0.1.0` text remains as the no-JS/API-failure fallback.

These links are still placeholders from the design and should be replaced with real project URLs:

- `crates.io/crabbase`, `docs.rs/crabbase`, and the Discord link
- The install command uses `https://crabbase.io/install.sh`

The install command text is also defined in `assets/js/main.js` (`installCommand`).

## Structure

```text
.
├── index.html
├── docs.html
├── docs-collections.html
├── docs-authentication.html
├── docs-files.html
├── docs-settings.html
├── docs-src/
├── assets/
│   ├── css/styles.css
│   ├── images/logo.png
│   ├── images/admin_ui.png
│   └── js/
│       ├── main.js
│       ├── docs.js
│       ├── github-stars.js
│       └── docs-search-index.js
├── src/input.css
├── tailwind.config.js
├── scripts/
│   ├── build.mjs
│   ├── build-docs.mjs
│   └── serve.mjs
├── favicon.png
├── robots.txt
└── .github/workflows/deploy.yml
```

The built CSS in `assets/css/styles.css` is committed so the page also works when served directly from a branch. GitHub Actions rebuilds it on deploy.
