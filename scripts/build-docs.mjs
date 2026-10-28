import { readFile, writeFile } from "node:fs/promises";
import { marked } from "marked";

const DOCS = [
  {
    slug: "getting-started",
    file: "getting-started.md",
    href: "docs.html",
    title: "Getting Started",
    icon: "play_arrow",
    badge: "Guide",
    custom: true
  },
  {
    slug: "collections",
    file: "collections-and-records.md",
    href: "docs-collections.html",
    title: "Collections & Records",
    icon: "table_rows",
    badge: "Reference"
  },
  {
    slug: "authentication",
    file: "authentication.md",
    href: "docs-authentication.html",
    title: "Authentication",
    icon: "shield",
    badge: "Reference"
  },
  {
    slug: "files",
    file: "files-and-uploads.md",
    href: "docs-files.html",
    title: "Files & Uploads",
    icon: "cloud_upload",
    badge: "Reference"
  },
  {
    slug: "settings",
    file: "settings-email.md",
    href: "docs-settings.html",
    title: "Settings & Email",
    icon: "settings",
    badge: "Reference"
  }
];

const GETTING_STARTED_INDEX = [
  ["Installation", "installation", "Build from source with Make or Cargo, or build the dashboard assets once for a fresh checkout."],
  ["Prerequisites", "prerequisites", "Rust stable, PostgreSQL 14+, Trunk, and the wasm32-unknown-unknown target."],
  ["How Crabbase runs", "how-it-runs", "One executable fronts PostgreSQL and serves the API plus admin dashboard."],
  ["Configuration", "configuration", "The crabbase.toml file, database, server, admin, and initial superuser settings."],
  ["Running", "running", "crabbase serve and crabbase admin, plus the boot sequence."],
  ["First steps", "first-steps", "Open the dashboard, create a collection, set rules, and query the REST API."],
  ["Makefile reference", "makefile-reference", "Every common development and release task."],
  ["Troubleshooting", "troubleshooting", "Common startup and Postgres connection issues."]
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripHtml(value) {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return stripHtml(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractFirstHeading(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
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
  return html.replace(/href="([^"]+)"/g, (match, href) => {
    if (href.startsWith("getting-started.md")) return `href="${href.replace("getting-started.md", "docs.html")}"`;
    if (href.startsWith("collections-and-records.md"))
      return `href="${href.replace("collections-and-records.md", "docs-collections.html")}"`;
    if (href.startsWith("authentication.md"))
      return `href="${href.replace("authentication.md", "docs-authentication.html")}"`;
    if (href.startsWith("files-and-uploads.md"))
      return `href="${href.replace("files-and-uploads.md", "docs-files.html")}"`;
    if (href.startsWith("settings-email.md"))
      return `href="${href.replace("settings-email.md", "docs-settings.html")}"`;
    return match;
  });
}

function addHeadingIds(html) {
  const seen = new Map();
  return html.replace(/<h([234])>([\s\S]*?)<\/h\1>/g, (match, level, inner) => {
    let id = slugify(inner);
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

function wrapCodeBlocks(html) {
  let index = 0;
  return html.replace(/<pre><code(?: class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
    index += 1;
    const label = lang ? lang.toUpperCase() : "TEXT";
    return (
      `<div class="docs-code">` +
      `<div class="docs-code-head"><span>${label}</span>` +
      `<button class="docs-copy" type="button" data-copy-target="doc-code-${index}">` +
      `<span class="material-symbols-outlined text-[16px]" data-copy-icon aria-hidden="true">content_copy</span>` +
      `<span data-copy-label>Copy</span></button></div>` +
      `<pre><code id="doc-code-${index}">${code}</code></pre>` +
      `</div>`
    );
  });
}

function wrapTables(html) {
  return html
    .replace(/<table>/g, '<div class="doc-table-wrap"><table class="docs-table">')
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
    const classes = active
      ? "flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors bg-surface-container-high text-primary font-semibold border-l-2 border-primary font-body-sm text-body-sm"
      : "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-body-sm text-body-sm transition-colors";
    const current = active ? ' aria-current="page"' : "";
    return `<a class="${classes}" href="./${item.href}"${current}><span class="material-symbols-outlined text-[16px]" aria-hidden="true">${item.icon}</span><span>${escapeHtml(item.title)}</span></a>`;
  }).join("\n        ");
}

function renderToc(toc) {
  return toc
    .map(
      (item) =>
        `<a class="block transition-colors hover:text-primary" data-toc href="#${item.id}">${escapeHtml(item.text)}</a>`
    )
    .join("\n                  ");
}

function renderShell({ title, description, badge, readTime, content, toc, activeSlug, editPath, prev, next }) {
  const tocHtml = renderToc(toc);
  const prevNext = [];
  if (prev) {
    prevNext.push(
      `<a class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-primary font-body-sm text-body-sm font-semibold transition-colors group" href="./${prev.href}"><span class="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform" aria-hidden="true">arrow_back</span><span>Previous: ${escapeHtml(prev.title)}</span></a>`
    );
  }
  if (next) {
    prevNext.push(
      `<a class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-primary font-body-sm text-body-sm font-semibold transition-colors group" href="./${next.href}"><span>Next: ${escapeHtml(next.title)}</span><span class="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform" aria-hidden="true">arrow_forward</span></a>`
    );
  }

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)} — Crabbase Documentation</title>
    <meta name="description" content="${escapeHtml(stripHtml(description))}" />
    <meta name="theme-color" content="#fff8f6" />
    <link rel="icon" href="./favicon.png" type="image/png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="./assets/css/styles.css" />
  </head>
  <body class="bg-surface font-body-md text-on-surface antialiased" data-page="${activeSlug}">
    <a class="skip-link" href="#main">Skip to content</a>

    <header id="docs-header" class="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant">
      <div class="h-16 w-full px-4 sm:px-6 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 xl:gap-6 min-w-0">
          <button id="docs-menu-toggle" type="button" class="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors shrink-0" aria-expanded="false" aria-controls="docs-sidebar" aria-label="Open documentation menu">
            <span class="material-symbols-outlined text-[22px]" aria-hidden="true">menu</span>
          </button>
          <a class="group flex items-center gap-2.5 text-on-surface hover:text-primary transition-colors shrink-0" href="./index.html" aria-label="Crabbase home">
            <img src="./assets/images/logo.png" alt="" width="32" height="32" class="w-8 h-8 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
            <div class="flex items-center gap-2">
              <span class="font-headline-md text-headline-md tracking-tight leading-none">Crabbase</span>
              <span class="hidden sm:inline font-code-md text-label-xs bg-surface-container-high text-primary px-2 py-0.5 rounded border border-outline-variant font-medium" data-app-version>v0.1.0</span>
            </div>
          </a>
          <nav class="hidden xl:flex items-center gap-6" aria-label="Primary navigation">
            <a class="text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors py-5" href="./index.html">Landing</a>
            <a class="transition-colors py-5 text-primary font-semibold border-b-2 border-primary font-body-sm text-body-sm" href="./docs.html" aria-current="page">Docs</a>
            <a class="text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors py-5" href="./index.html#architecture">Architecture</a>
            <a class="text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors py-5" href="./docs-collections.html#endpoints">API Reference</a>
            <a class="text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors py-5" href="./index.html#benchmarks">Benchmarks</a>
          </nav>
        </div>
        <div class="flex items-center gap-2 sm:gap-3 flex-1 max-w-md justify-end">
          <button id="docs-search-open" type="button" class="group flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface-variant hover:border-outline hover:bg-surface-container text-left transition-colors w-full max-w-[13rem] sm:max-w-xs" aria-label="Search documentation">
            <span class="material-symbols-outlined text-[18px] text-tertiary" aria-hidden="true">search</span>
            <span class="hidden sm:inline text-body-sm font-body-sm truncate">Search docs...</span>
            <kbd class="ml-auto hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface border border-outline-variant font-code-md text-label-xs text-tertiary">⌘K</kbd>
          </button>
          <a class="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface transition-colors" href="https://github.com/ropali/crabbase" rel="noopener noreferrer" target="_blank" aria-label="View the Crabbase repository on GitHub">
            <svg viewBox="0 0 16 16" class="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            <span class="flex items-center gap-1 font-code-md text-label-xs">
              <span class="material-symbols-outlined text-[14px]" aria-hidden="true">star</span>
              <span data-github-stars>Star</span>
            </span>
          </a>
          <a class="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-medium transition-colors shadow-sm whitespace-nowrap" href="./index.html#admin">
            <span class="material-symbols-outlined text-[16px]" aria-hidden="true">terminal</span>
            <span class="hidden md:inline">Launch Demo</span>
          </a>
        </div>
      </div>
    </header>

    <div id="docs-sidebar-overlay" class="fixed inset-0 top-16 bg-on-surface/30 backdrop-blur-[1px] z-30 hidden lg:hidden" aria-hidden="true"></div>

    <aside id="docs-sidebar" class="fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant overflow-y-auto p-4 z-40 -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-out" aria-label="Documentation navigation">
      <div class="lg:hidden mb-6">
        <div class="font-label-xs text-label-xs uppercase tracking-wider text-outline px-3 mb-2 font-semibold">Navigation</div>
        <nav class="space-y-1">
          <a class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-body-sm text-body-sm transition-colors" href="./index.html"><span class="material-symbols-outlined text-[16px]" aria-hidden="true">home</span><span>Landing</span></a>
          <a class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-body-sm text-body-sm transition-colors" href="./index.html#architecture"><span class="material-symbols-outlined text-[16px]" aria-hidden="true">account_tree</span><span>Architecture</span></a>
          <a class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-body-sm text-body-sm transition-colors" href="./index.html#benchmarks"><span class="material-symbols-outlined text-[16px]" aria-hidden="true">speed</span><span>Benchmarks</span></a>
        </nav>
      </div>

      <div class="font-label-xs text-label-xs uppercase tracking-wider text-outline px-3 mb-2 font-semibold">Documentation</div>
      <nav class="space-y-1 mb-6" aria-label="Documentation">
        ${renderNav(activeSlug)}
      </nav>

      <div class="font-label-xs text-label-xs uppercase tracking-wider text-outline px-3 mb-2 font-semibold">References</div>
      <nav class="space-y-1" aria-label="References">
        <a class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-body-sm text-body-sm transition-colors" href="./docs-collections.html#endpoints"><span class="material-symbols-outlined text-[16px]" aria-hidden="true">code</span><span>API Reference</span></a>
        <a class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-body-sm text-body-sm transition-colors" href="./docs.html#makefile-reference"><span class="material-symbols-outlined text-[16px]" aria-hidden="true">terminal</span><span>Makefile Reference</span></a>
        <a class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-body-sm text-body-sm transition-colors" href="./docs.html#troubleshooting"><span class="material-symbols-outlined text-[16px]" aria-hidden="true">build</span><span>Troubleshooting</span></a>
        <a class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-body-sm text-body-sm transition-colors" href="https://github.com/ropali/crabbase" rel="noopener noreferrer" target="_blank"><svg viewBox="0 0 16 16" class="h-4 w-4 fill-current" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" /></svg><span>GitHub Repository</span></a>
        <a class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-body-sm text-body-sm transition-colors" href="https://github.com/ropali/crabbase/discussions" rel="noopener noreferrer" target="_blank"><span class="material-symbols-outlined text-[16px]" aria-hidden="true">forum</span><span>Community &amp; Support</span></a>
      </nav>
    </aside>

    <div class="lg:pl-64">
      <main id="main" class="pt-16 min-h-screen bg-surface w-full">
        <div class="w-full flex">
          <div class="flex-1 min-w-0 px-5 sm:px-8 py-8 lg:px-12 max-w-4xl mx-auto">
            <div class="flex flex-col w-full">
              <nav class="flex flex-wrap items-center gap-2 mb-6 text-on-surface-variant font-label-xs text-label-xs" aria-label="Breadcrumb">
                <a class="hover:text-primary transition-colors" href="./docs.html">Documentation</a>
                <span class="material-symbols-outlined text-[14px] text-tertiary" aria-hidden="true">chevron_right</span>
                <span class="hover:text-primary transition-colors">${escapeHtml(title)}</span>
                <span class="material-symbols-outlined text-[14px] text-tertiary" aria-hidden="true">chevron_right</span>
                <span class="text-primary font-semibold px-2 py-0.5 rounded-full bg-surface-container-high" data-app-version>v0.1.0</span>
              </nav>

              <div class="space-y-4 mb-8">
                <div class="flex flex-wrap items-center gap-3">
                  <span class="px-2.5 py-1 rounded bg-surface-container text-primary font-code-md text-label-xs font-semibold uppercase tracking-wider">${escapeHtml(badge)}</span>
                  <span class="text-tertiary font-code-md text-label-xs">Estimated read: ${readTime} mins</span>
                </div>
                <h1 class="font-headline-lg text-headline-lg sm:text-4xl text-on-surface tracking-tight">${escapeHtml(title)}</h1>
                <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-3xl">${description}</p>
              </div>

              <div class="doc-prose">${content}</div>

              <div class="mt-12 pt-8 border-t border-surface-variant flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                  <span class="material-symbols-outlined text-[18px] text-tertiary" aria-hidden="true">help_outline</span>
                  <span>Stuck? Reach our community on <a class="text-primary hover:underline font-medium" href="https://github.com/ropali/crabbase/discussions" rel="noopener noreferrer" target="_blank">GitHub Discussions</a>.</span>
                </div>
                <div class="flex flex-wrap items-center gap-3">${prevNext.join("")}</div>
              </div>

              <div class="mt-10 pt-6 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-2 font-body-sm text-label-xs text-on-surface-variant">
                <span>Dual-licensed under MIT and Apache 2.0. Built for the Rust community.</span>
                <span>© <span data-year>2026</span> Crabbase Engine Maintainers.</span>
              </div>
            </div>
          </div>

          <aside class="hidden 2xl:block w-72 shrink-0 py-8 pr-8" aria-label="On this page">
            <div class="sticky top-24 space-y-6">
              <div class="border-l border-outline-variant pl-4 space-y-3">
                <div class="font-label-xs text-label-xs uppercase tracking-wider text-outline font-semibold">On this page</div>
                <nav class="space-y-2 text-body-sm font-body-sm text-on-surface-variant" id="docs-toc">
                  ${tocHtml}
                </nav>
              </div>
              <div class="border-t border-outline-variant pt-4 pl-4 space-y-2 text-body-sm font-body-sm">
                <a class="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors" href="https://github.com/ropali/crabbase/edit/main/docs/${editPath}" rel="noopener noreferrer" target="_blank">
                  <span class="material-symbols-outlined text-[16px]" aria-hidden="true">edit_document</span>
                  <span>Edit this page on GitHub</span>
                </a>
                <a class="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors" href="https://github.com/ropali/crabbase/issues/new" rel="noopener noreferrer" target="_blank">
                  <span class="material-symbols-outlined text-[16px]" aria-hidden="true">forum</span>
                  <span>Submit Feedback</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>

    <div id="docs-search-modal" class="fixed inset-0 z-[60] hidden items-start justify-center bg-on-surface/40 backdrop-blur-sm px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-labelledby="docs-search-title">
      <div class="w-full max-w-xl rounded-xl bg-surface-container-lowest shadow-2xl border border-outline-variant overflow-hidden">
        <h2 id="docs-search-title" class="sr-only">Search documentation</h2>
        <div class="flex items-center gap-3 px-4 py-3 border-b border-outline-variant">
          <span class="material-symbols-outlined text-[20px] text-tertiary" aria-hidden="true">search</span>
          <input id="docs-search-input" type="search" class="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-tertiary focus:outline-none" placeholder="Search docs, crates, APIs..." autocomplete="off" />
          <button id="docs-search-close" type="button" class="inline-flex items-center justify-center w-7 h-7 rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" aria-label="Close search">
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
          </button>
        </div>
        <div id="docs-search-results" class="max-h-[55vh] overflow-y-auto p-2"></div>
        <div class="flex items-center justify-between gap-3 border-t border-outline-variant px-4 py-2 font-code-md text-label-xs text-tertiary">
          <span>Type to filter documentation</span>
          <span>Esc to close</span>
        </div>
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

  if (item.custom) {
    searchIndex.push({
      title: item.title,
      section: "",
      href: item.href,
      description: "Get Crabbase running locally with PostgreSQL, the REST API, and the admin dashboard."
    });
    for (const [text, id, description] of GETTING_STARTED_INDEX) {
      searchIndex.push({ title: item.title, section: text, href: `${item.href}#${id}`, description });
    }
    continue;
  }

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
