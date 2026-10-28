# Crabbase Landing Page

Static site for Crabbase, implemented from the Stitch design. It is plain HTML, compiled Tailwind CSS, and small vanilla JavaScript files, so it deploys cleanly to GitHub Pages or any static host.

## Stack

- HTML in `index.html`, `docs.html`, and the generated `docs-*.html` pages
- Tailwind CSS 3 with the Crabbase design tokens in `tailwind.config.js`
- Vanilla JavaScript in `assets/js/main.js` and `assets/js/docs.js`
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

GitHub links point to `https://github.com/ropali/crabbase` (including the docs edit, issue, security, and release links). Update them if the repository is renamed or forked.

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
│   └── js/
│       ├── main.js
│       ├── docs.js
│       └── docs-search-index.js
├── src/input.css
├── tailwind.config.js
├── scripts/
│   ├── build.mjs
│   ├── build-docs.mjs
│   └── serve.mjs
├── favicon.svg
├── robots.txt
└── .github/workflows/deploy.yml
```

The built CSS in `assets/css/styles.css` is committed so the page also works when served directly from a branch. GitHub Actions rebuilds it on deploy.
