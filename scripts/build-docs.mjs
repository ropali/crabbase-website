import { readFile, writeFile } from "node:fs/promises";
import { marked } from "marked";
import hljs from "highlight.js";

const DOCS = [
  {
    slug: "getting-started",
    file: "getting-started.md",
    href: "docs.html",
    title: "Getting started",
    badge: "Guide"
  },
  {
    slug: "collections",
    file: "collections-and-records.md",
    href: "docs-collections.html",
    title: "Collections & records",
    badge: "Reference"
  },
  {
    slug: "authentication",
    file: "authentication.md",
    href: "docs-authentication.html",
    title: "Authentication",
    badge: "Reference"
  },
  {
    slug: "files",
    file: "files-and-uploads.md",
    href: "docs-files.html",
    title: "Files & uploads",
    badge: "Reference"
  },
  {
    slug: "settings",
    file: "settings-email.md",
    href: "docs-settings.html",
    title: "Settings & email",
    badge: "Reference"
  },
  {
    slug: "backups",
    file: "backups-and-jobs.md",
    href: "docs-backups.html",
    title: "Backups & cron jobs",
    badge: "Guide",
    header: false
  }
];

const GITHUB = "https://github.com/ropali/crabbase";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripHtml(value) {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[`~!@#$%^&*()_|+=?;:'",.<>{}[\]\\/]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractFirstHeading(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Documentation";
}

function extractIntro(markdown) {
  const withoutTitle = markdown.replace(/^#\s+.+\n+/, "");
  const match = withoutTitle.match(/^([\s\S]*?)(?:\n\n|$)/);
  return match ? match[1].trim() : "";
}

function removeIntro(markdown) {
  return markdown.replace(/^#\s+.+\n+/, "").replace(/^([\s\S]*?)(?:\n\n|$)/, "").replace(/^\n+/, "");
}

function rewriteLinks(html) {
  const map = {
    "getting-started.md": "docs.html",
    "collections-and-records.md": "docs-collections.html",
    "authentication.md": "docs-authentication.html",
    "files-and-uploads.md": "docs-files.html",
    "settings-email.md": "docs-settings.html",
    "backups-and-jobs.md": "docs-backups.html"
  };
  return html.replace(/href="([^"]+)"/g, (match, href) => {
    for (const [file, target] of Object.entries(map)) {
      if (href.startsWith(file)) return `href="./${href.replace(file, target)}"`;
    }
    return match;
  });
}

function addHeadingIds(html) {
  const seen = new Map();
  return html.replace(/<h([2-4])(?: id="[^"]*")?>([\s\S]*?)<\/h\1>/g, (match, level, inner) => {
    let id = slugify(stripHtml(inner));
    if (!id) id = "section";
    if (seen.has(id)) {
      const count = seen.get(id) + 1;
      seen.set(id, count);
      id = `${id}-${count}`;
    } else {
      seen.set(id, 1);
    }
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
}

function decodeCode(text) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function escapeCode(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(code, lang) {
  const raw = decodeCode(code);
  if (lang && hljs.getLanguage(lang)) {
    return hljs.highlight(raw, { language: lang, ignoreIllegals: true }).value;
  }
  return escapeCode(raw);
}

function wrapCodeBlocks(html) {
  let index = 0;
  return html.replace(/<pre><code(?: class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
    index += 1;
    const label = lang ? lang.toUpperCase() : "TEXT";
    const language = lang ? ` language-${lang}` : "";
    return (
      `<div class="docs-code">` +
      `<div class="docs-code-head"><span>${label}</span>` +
      `<button class="docs-copy" type="button" data-copy-target="doc-code-${index}">` +
      `<span data-copy-label>Copy</span></button></div>` +
      `<pre><code id="doc-code-${index}" class="hljs${language}">${highlight(code, lang)}</code></pre>` +
      `</div>`
    );
  });
}

function wrapTables(html) {
  return html
    .replace(/<table>/g, '<div class="doc-table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>");
}

function extractToc(html) {
  const toc = [];
  const regex = /<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g;
  let match;
  while ((match = regex.exec(html))) {
    toc.push({ id: match[1], text: stripHtml(match[2]) });
  }
  return toc;
}

function extractSearchSections(html) {
  const sections = [];
  const regex = /<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g;
  let match;
  while ((match = regex.exec(html))) {
    sections.push({
      level: Number(match[1]),
      id: match[2],
      text: stripHtml(match[3]),
      start: match.index,
      end: regex.lastIndex
    });
  }

  return sections.map((section, index) => {
    const next = sections[index + 1];
    const body = html.slice(section.end, next ? next.start : html.length);
    const paragraphs = Array.from(body.matchAll(/<p>([\s\S]*?)<\/p>/g))
      .map((entry) => stripHtml(entry[1]))
      .filter((text) => text.length >= 40);
    const items = Array.from(body.matchAll(/<li>([\s\S]*?)<\/li>/g))
      .map((entry) => stripHtml(entry[1]))
      .filter((text) => text.length >= 40);
    let description = paragraphs[0] || items[0] || "";
    if (description.length > 160) {
      description = description.slice(0, 157).replace(/\s+\S*$/, "") + "...";
    }
    return { ...section, description };
  });
}

function renderNav(activeSlug) {
  return DOCS.map((item) => {
    const active = item.slug === activeSlug;
    const current = active ? ' aria-current="page"' : "";
    return `<a href="./${item.href}"${current}>${escapeHtml(item.title)}</a>`;
  }).join("\n        ");
}

function renderHeaderNav(activeSlug) {
  return DOCS.filter((item) => item.header !== false).map((item) => {
    const active = item.slug === activeSlug;
    const current = active ? ' aria-current="page"' : "";
    return `<a href="./${item.href}"${current}>${escapeHtml(item.title)}</a>`;
  }).join("\n          ");
}

function renderToc(toc) {
  return toc
    .map(
      (item) =>
        `<a data-toc href="#${item.id}">${escapeHtml(item.text)}</a>`
    )
    .join("\n            ");
}

function renderShell({ title, description, badge, readTime, content, toc, activeSlug, editPath, prev, next }) {
  const tocHtml = renderToc(toc);
  const prevNext = [];
  if (prev) {
    prevNext.push(
      `<a href="./${prev.href}"><span>Previous</span>${escapeHtml(prev.title)}</a>`
    );
  }
  if (next) {
    prevNext.push(
      `<a href="./${next.href}"><span>Next</span>${escapeHtml(next.title)}</a>`
    );
  }

  return `<!doctype html>
<html lang="en" data-type="software" data-radius="soft" data-buttons="arrow">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${escapeHtml(title)} — Crabbase documentation</title>
    <meta name="description" content="${escapeHtml(stripHtml(description))}" />
    <meta name="site-kind" content="software" />
    <meta name="page-type" content="software" />
    <meta name="theme-color" content="#efe9e1" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Crabbase" />
    <meta property="og:title" content="${escapeHtml(title)} — Crabbase documentation" />
    <meta property="og:description" content="${escapeHtml(stripHtml(description))}" />
    <meta property="og:image" content="./share.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="./favicon.png" type="image/png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="./assets/system.css" />
    <link rel="stylesheet" href="./assets/css/site.css" />
    <link rel="stylesheet" href="./assets/css/docs.css" />
  </head>
  <body class="docs" data-page="${activeSlug}">
    <a class="skip-link" href="#doc-main">Skip to content</a>

    <header class="docs-header">
      <div class="wrap docs-header__bar">
        <button id="docs-menu-toggle" class="docs-menu-btn" type="button" aria-expanded="false" aria-controls="docs-sidebar" aria-label="Open documentation menu">
          <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14"/></svg>
        </button>
        <a class="nav__logo" href="./index.html" aria-label="Crabbase home">
          <img src="./assets/images/logo.png" alt="" width="24" height="24" />
          Crabbase
        </a>
        <nav class="docs-header__nav" aria-label="Documentation">
          ${renderHeaderNav(activeSlug)}
        </nav>
        <div class="docs-header__actions">
          <button id="docs-search-open" class="docs-search-btn" type="button" aria-label="Search documentation">
            <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>
            <span>Search docs</span>
            <kbd>⌘K</kbd>
          </button>
          <a class="nav__link nav__gh" href="${GITHUB}" rel="noopener noreferrer" target="_blank">
            <span class="gh-stars"><svg class="gh-stars__icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.4l2 4.1 4.5.7-3.3 3.2.8 4.5L8 11.8l-4 2.1.8-4.5L1.5 6.2l4.5-.7z"/></svg><span data-github-stars>0</span><span class="sr-only">stars</span></span>
            GitHub
          </a>
          <button class="btn btn--secondary btn--demo" type="button" disabled aria-disabled="true" title="The hosted demo is not online yet">Live demo <span class="btn--demo__soon">soon</span></button>
        </div>
      </div>
    </header>

    <div id="docs-sidebar-overlay" class="docs-overlay" hidden></div>

    <div class="docs-shell">
      <aside id="docs-sidebar" class="docs-side" aria-label="Documentation navigation">
        <div class="docs-side__group">
          <p class="t-label">Documentation</p>
          <nav>
            ${renderNav(activeSlug)}
          </nav>
        </div>
        <div class="docs-side__group">
          <p class="t-label">Project</p>
          <nav>
            <a href="${GITHUB}" rel="noopener noreferrer" target="_blank">Repository</a>
            <a href="${GITHUB}/discussions" rel="noopener noreferrer" target="_blank">Discussions</a>
            <a href="${GITHUB}/releases" rel="noopener noreferrer" target="_blank">Releases</a>
            <a href="${GITHUB}/blob/main/LICENSE" rel="noopener noreferrer" target="_blank">License</a>
          </nav>
        </div>
      </aside>

      <main id="doc-main" class="docs-main">
        <div class="docs-grid">
          <article class="doc">
            <nav class="doc-crumb" aria-label="Breadcrumb">
              <a href="./docs.html">Docs</a>
              <span aria-hidden="true">/</span>
              <span>${escapeHtml(title)}</span>
            </nav>
            <p class="doc-meta">
              <span class="doc-badge">${escapeHtml(badge)}</span>
              <span>${readTime} min read</span>
              <span data-app-version>v0.1.0</span>
            </p>
            <h1>${escapeHtml(title)}</h1>
            <p class="doc-intro">${description}</p>
            <div class="doc-body">${content}</div>
            <nav class="doc-pager" aria-label="Documentation pages">
              ${prevNext.join("\n              ")}
            </nav>
            <p class="doc-help">Stuck? Ask in <a href="${GITHUB}/discussions" rel="noopener noreferrer" target="_blank">GitHub Discussions</a>.</p>
          </article>

          <aside class="docs-toc" aria-label="On this page">
            <div class="docs-toc__inner">
              <p class="t-label">On this page</p>
              <nav id="docs-toc">
                ${tocHtml}
              </nav>
              <a class="docs-edit" href="${GITHUB}/edit/main/docs/${editPath}" rel="noopener noreferrer" target="_blank">Edit this page on GitHub</a>
            </div>
          </aside>
        </div>

        <footer class="docs-footer">
          <div class="docs-footer__inner">
            <span>© <span data-year>2026</span> Crabbase · <span data-app-version>v0.1.0</span>, pre-1.0</span>
            <span><a href="./index.html">Home</a> · <a href="${GITHUB}" rel="noopener noreferrer" target="_blank">Repository</a> · <a href="${GITHUB}/blob/main/LICENSE" rel="noopener noreferrer" target="_blank">PolyForm Shield 1.0.0</a></span>
          </div>
        </footer>
      </main>
    </div>

    <div id="docs-search-modal" class="docs-modal" role="dialog" aria-modal="true" aria-labelledby="docs-search-title" hidden>
      <div class="docs-modal__panel">
        <h2 id="docs-search-title" class="sr-only">Search documentation</h2>
        <div class="docs-modal__bar">
          <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>
          <input id="docs-search-input" type="search" placeholder="Search docs, endpoints, settings…" autocomplete="off" />
          <button id="docs-search-close" type="button">Close</button>
        </div>
        <div id="docs-search-results" class="docs-modal__results"></div>
        <p class="docs-modal__hint"><span>Type to filter documentation</span><span>Esc to close</span></p>
      </div>
    </div>

    <script src="./assets/js/github-stars.js" defer></script>
    <script src="./assets/js/docs-search-index.js" defer></script>
    <script src="./assets/js/docs.js" defer></script>
  </body>
</html>
`;
}

const searchIndex = [];

for (const item of DOCS) {
  const markdown = await readFile(`docs-src/${item.file}`, "utf8");

  const title = item.title;
  const introMarkdown = extractIntro(markdown);
  const introHtml = marked.parseInline(introMarkdown);
  const introText = stripHtml(introHtml);
  const bodyMarkdown = removeIntro(markdown);
  const words = bodyMarkdown.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(3, Math.round(words / 200));

  let html = marked.parse(bodyMarkdown, { gfm: true });
  html = addHeadingIds(html);
  html = rewriteLinks(html);
  html = wrapCodeBlocks(html);
  html = wrapTables(html);

  const toc = extractToc(html);
  const sections = extractSearchSections(html);
  const docIndex = DOCS.findIndex((entry) => entry.slug === item.slug);
  const prev = docIndex > 0 ? DOCS[docIndex - 1] : null;
  const next = docIndex < DOCS.length - 1 ? DOCS[docIndex + 1] : null;

  const page = renderShell({
    title,
    description: introHtml,
    badge: item.badge,
    readTime,
    content: html,
    toc,
    activeSlug: item.slug,
    editPath: item.file,
    prev,
    next
  });

  await writeFile(item.href, page);
  console.log(`Generated ${item.href}`);

  searchIndex.push({ title, section: "", href: item.href, description: introText });
  for (const section of sections) {
    searchIndex.push({
      title,
      section: section.text,
      href: `${item.href}#${section.id}`,
      description: section.description
    });
  }
}

const indexSource = `window.__docsSearchIndex = ${JSON.stringify(searchIndex, null, 2)};\n`;
await writeFile("assets/js/docs-search-index.js", indexSource);
console.log("Generated assets/js/docs-search-index.js");
