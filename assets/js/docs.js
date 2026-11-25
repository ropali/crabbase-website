(function () {
  "use strict";

  var doc = document;

  var sidebar = doc.getElementById("docs-sidebar");
  var overlay = doc.getElementById("docs-sidebar-overlay");
  var menuToggle = doc.getElementById("docs-menu-toggle");

  function setSidebar(open) {
    if (!sidebar || !menuToggle) return;
    sidebar.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close documentation menu" : "Open documentation menu");
    if (overlay) overlay.hidden = !open;
    doc.body.classList.toggle("docs-no-scroll", open);
    if (open) {
      var firstLink = sidebar.querySelector("a");
      if (firstLink) firstLink.focus({ preventScroll: true });
    }
  }

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", function () {
      setSidebar(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    if (overlay) {
      overlay.addEventListener("click", function () {
        setSidebar(false);
      });
    }

    Array.prototype.forEach.call(sidebar.querySelectorAll("a"), function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 1023px)").matches) setSidebar(false);
      });
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setSidebar(false);
        menuToggle.focus();
      }
    });

    var desktopQuery = window.matchMedia("(min-width: 1024px)");
    var handleDesktop = function (event) {
      if (event.matches) setSidebar(false);
    };
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", handleDesktop);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(handleDesktop);
    }
  }

  var tabButtons = Array.prototype.slice.call(doc.querySelectorAll("[data-docs-tab]"));
  var tabPanels = Array.prototype.slice.call(doc.querySelectorAll(".docs-tab-panel"));

  function selectTab(button) {
    tabButtons.forEach(function (item) {
      var selected = item === button;
      item.setAttribute("aria-selected", String(selected));
      item.setAttribute("tabindex", selected ? "0" : "-1");
      item.classList.toggle("bg-surface-container-lowest", selected);
      item.classList.toggle("text-primary", selected);
      item.classList.toggle("shadow-sm", selected);
      item.classList.toggle("text-on-surface-variant", !selected);
    });

    tabPanels.forEach(function (panel) {
      panel.classList.toggle("hidden", panel.id !== button.getAttribute("aria-controls"));
    });
  }

  tabButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      selectTab(button);
    });

    button.addEventListener("keydown", function (event) {
      var next = null;
      if (event.key === "ArrowRight") next = tabButtons[(index + 1) % tabButtons.length];
      else if (event.key === "ArrowLeft") next = tabButtons[(index - 1 + tabButtons.length) % tabButtons.length];
      else if (event.key === "Home") next = tabButtons[0];
      else if (event.key === "End") next = tabButtons[tabButtons.length - 1];
      if (!next) return;
      event.preventDefault();
      next.focus();
      selectTab(next);
    });
  });

  function legacyCopy(text) {
    var area = doc.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    doc.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = doc.execCommand("copy");
    } catch (error) {
      ok = false;
    }
    doc.body.removeChild(area);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return legacyCopy(text);
        }
      );
    }
    return Promise.resolve(legacyCopy(text));
  }

  Array.prototype.forEach.call(doc.querySelectorAll("[data-copy-target]"), function (button) {
    var target = doc.getElementById(button.getAttribute("data-copy-target"));
    if (!target) return;
    var icon = button.querySelector("[data-copy-icon]");
    var label = button.querySelector("[data-copy-label]");
    var originalLabel = label ? label.textContent : "Copy";
    var timer;

    button.addEventListener("click", function () {
      copyText(target.innerText).then(function (ok) {
        if (!ok) return;
        if (icon) icon.textContent = "check";
        if (label) label.textContent = "Copied!";
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          if (icon) icon.textContent = "content_copy";
          if (label) label.textContent = originalLabel;
        }, 2000);
      });
    });
  });

  var searchModal = doc.getElementById("docs-search-modal");
  var searchOpen = doc.getElementById("docs-search-open");
  var searchClose = doc.getElementById("docs-search-close");
  var searchInput = doc.getElementById("docs-search-input");
  var searchResults = doc.getElementById("docs-search-results");
  var searchIndex = Array.isArray(window.__docsSearchIndex) ? window.__docsSearchIndex : [];

  if (!searchIndex.length) {
    Array.prototype.forEach.call(doc.querySelectorAll("#docs-sidebar a[href], #docs-toc a[href]"), function (link) {
      searchIndex.push({
        title: link.textContent.trim(),
        section: "",
        href: link.getAttribute("href"),
        description: ""
      });
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderResults(query) {
    if (!searchResults) return;
    var term = query.trim().toLowerCase();
    var matches = searchIndex.filter(function (item) {
      if (!term) return true;
      return (
        (item.title || "").toLowerCase().indexOf(term) !== -1 ||
        (item.section || "").toLowerCase().indexOf(term) !== -1 ||
        (item.description || "").toLowerCase().indexOf(term) !== -1
      );
    });

    var seen = {};
    matches = matches.filter(function (item) {
      var key = item.href;
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });

    matches = matches.slice(0, 12);

    if (!matches.length) {
      searchResults.innerHTML =
        '<div class="docs-result--empty">No documentation matches "' +
        escapeHtml(query) +
        '".</div>';
      return;
    }

    searchResults.innerHTML = matches
      .map(function (item) {
        var pageLabel = item.title || "Documentation";
        var sectionLabel = item.section ? ' <span>/ ' + escapeHtml(item.section) + "</span>" : "";
        var description = item.description
          ? '<span class="docs-result__desc">' + escapeHtml(item.description) + "</span>"
          : "";
        return (
          '<a class="docs-result" href="' +
          escapeHtml(item.href) +
          '">' +
          '<span class="docs-result__icon" aria-hidden="true">#</span>' +
          '<span><span class="docs-result__title">' +
          escapeHtml(pageLabel) +
          sectionLabel +
          "</span>" +
          description +
          "</span></a>"
        );
      })
      .join("");
  }

  function openSearch() {
    if (!searchModal) return;
    searchModal.hidden = false;
    doc.body.classList.add("docs-no-scroll");
    renderResults("");
    if (searchInput) {
      searchInput.value = "";
      window.setTimeout(function () {
        searchInput.focus();
      }, 20);
    }
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.hidden = true;
    doc.body.classList.remove("docs-no-scroll");
    if (searchOpen) searchOpen.focus();
  }

  if (searchOpen) searchOpen.addEventListener("click", openSearch);
  if (searchClose) searchClose.addEventListener("click", closeSearch);
  if (searchModal) {
    searchModal.addEventListener("click", function (event) {
      if (event.target === searchModal) closeSearch();
    });
  }
  if (searchResults) {
    searchResults.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeSearch();
    });
  }
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      renderResults(searchInput.value);
    });
  }

  doc.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (searchModal && !searchModal.hidden) closeSearch();
      else openSearch();
    }
    if (event.key === "Escape" && searchModal && !searchModal.hidden) {
      closeSearch();
    }
  });

  var tocLinks = Array.prototype.slice.call(doc.querySelectorAll("[data-toc]"));
  var tocSections = tocLinks
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = doc.getElementById(id);
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  function updateToc() {
    if (!tocSections.length) return;
    var probe = window.scrollY + 150;
    var active = tocSections[0];
    tocSections.forEach(function (item) {
      if (item.section.offsetTop <= probe) active = item;
    });
    tocLinks.forEach(function (link) {
      var isActive = link === active.link;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  var tocQueued = false;
  window.addEventListener(
    "scroll",
    function () {
      if (tocQueued) return;
      tocQueued = true;
      window.requestAnimationFrame(function () {
        updateToc();
        tocQueued = false;
      });
    },
    { passive: true }
  );
  updateToc();

  Array.prototype.forEach.call(doc.querySelectorAll("[data-year]"), function (node) {
    node.textContent = String(new Date().getFullYear());
  });
})();
