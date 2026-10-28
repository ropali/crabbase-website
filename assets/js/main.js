(function () {
  "use strict";

  window.__crabbaseReady = true;

  var doc = document;
  var header = doc.getElementById("site-header");
  var progressBar = doc.getElementById("scroll-progress");
  var menuToggle = doc.getElementById("menu-toggle");
  var mobileMenu = doc.getElementById("mobile-menu");
  var menuIcon = doc.querySelector("[data-menu-icon]");
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll("[data-nav]"));

  function setMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.classList.toggle("hidden", !open);
    if (menuIcon) menuIcon.textContent = open ? "close" : "menu";
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    Array.prototype.forEach.call(
      mobileMenu.querySelectorAll("[data-mobile-link]"),
      function (link) {
        link.addEventListener("click", function () {
          setMenu(false);
        });
      }
    );

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });

    var desktopQuery = window.matchMedia("(min-width: 768px)");
    var handleDesktop = function (event) {
      if (event.matches) setMenu(false);
    };
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", handleDesktop);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(handleDesktop);
    }
  }

  var navTargets = navLinks
    .filter(function (link) {
      return !link.hasAttribute("data-nav-sub");
    })
    .map(function (link) {
      var href = link.getAttribute("href");
      var target =
        href && href.charAt(0) === "#" ? doc.querySelector(href) : null;
      return target ? { link: link, target: target } : null;
    })
    .filter(Boolean);

  function updateActiveNav() {
    if (!navTargets.length) return;
    var probe = window.scrollY + window.innerHeight / 3;
    var active = null;

    navTargets.forEach(function (item) {
      var top = item.target.getBoundingClientRect().top + window.scrollY;
      if (top <= probe) active = item;
    });

    navLinks.forEach(function (link) {
      var isActive = Boolean(active && link === active.link);
      link.dataset.active = String(isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  function updateProgress() {
    if (!progressBar) return;
    var max = doc.documentElement.scrollHeight - window.innerHeight;
    var progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progressBar.style.transform = "scaleX(" + progress + ")";
  }

  var scrollQueued = false;
  function handleScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(function () {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
      updateProgress();
      updateActiveNav();
      scrollQueued = false;
    });
  }

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll, { passive: true });

  var installCommand = "curl -sSL https://crabbase.io/install.sh | bash";
  var copyButton = doc.getElementById("copy-curl-btn");
  var commandButton = doc.getElementById("install-command");
  var copyIcon = doc.getElementById("copy-icon");
  var copyLabel = doc.getElementById("copy-label");
  var copyTimer;

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

  function resetCopyState() {
    if (copyIcon) copyIcon.textContent = "content_copy";
    if (copyLabel) {
      copyLabel.textContent = "Copy";
      copyLabel.classList.remove("text-primary", "font-semibold");
    }
  }

  function handleCopy() {
    copyText(installCommand).then(function (ok) {
      if (!ok) return;
      if (copyIcon) copyIcon.textContent = "check";
      if (copyLabel) {
        copyLabel.textContent = "Copied!";
        copyLabel.classList.add("text-primary", "font-semibold");
      }
      window.clearTimeout(copyTimer);
      copyTimer = window.setTimeout(resetCopyState, 2200);
    });
  }

  if (copyButton) copyButton.addEventListener("click", handleCopy);
  if (commandButton) commandButton.addEventListener("click", handleCopy);

  var tabs = Array.prototype.slice.call(doc.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(
    doc.querySelectorAll('[role="tabpanel"]')
  );

  function selectTab(tab) {
    tabs.forEach(function (item) {
      var selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.setAttribute("tabindex", selected ? "0" : "-1");
      item.dataset.active = String(selected);
    });

    panels.forEach(function (panel) {
      var show = panel.id === tab.getAttribute("aria-controls");
      panel.hidden = !show;
      panel.classList.remove("tab-enter");
      if (show) {
        void panel.offsetWidth;
        panel.classList.add("tab-enter");
      }
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      selectTab(tab);
    });

    tab.addEventListener("keydown", function (event) {
      var next = null;
      if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
      else if (event.key === "ArrowLeft")
        next = tabs[(index - 1 + tabs.length) % tabs.length];
      else if (event.key === "Home") next = tabs[0];
      else if (event.key === "End") next = tabs[tabs.length - 1];
      if (!next) return;
      event.preventDefault();
      next.focus();
      selectTab(next);
    });
  });

  var revealElements = Array.prototype.slice.call(
    doc.querySelectorAll("[data-reveal]")
  );
  var bars = Array.prototype.slice.call(doc.querySelectorAll(".bench-bar"));

  function revealAll() {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
    bars.forEach(function (bar) {
      bar.classList.add("is-visible");
    });
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries, instance) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          instance.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach(function (element) {
      observer.observe(element);
    });
    bars.forEach(function (bar) {
      observer.observe(bar);
    });
  } else {
    revealAll();
  }

  var counters = Array.prototype.slice.call(doc.querySelectorAll("[data-count]"));
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function formatCounter(value, decimals) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function counterText(element, value) {
    var decimals = parseInt(element.getAttribute("data-decimals") || "0", 10);
    var prefix = element.getAttribute("data-prefix") || "";
    var suffix = element.getAttribute("data-suffix") || "";
    return prefix + formatCounter(value, decimals) + suffix;
  }

  function finishCounter(element) {
    var target = parseFloat(element.getAttribute("data-count"));
    if (isNaN(target)) return;
    element.textContent = counterText(element, target);
  }

  function animateCounter(element) {
    var target = parseFloat(element.getAttribute("data-count"));
    if (isNaN(target)) return;
    var startTime = null;
    var duration = 1200;

    function frame(now) {
      if (startTime === null) startTime = now;
      var progress = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = counterText(element, target * eased);
      if (progress < 1) window.requestAnimationFrame(frame);
      else finishCounter(element);
    }

    window.requestAnimationFrame(frame);
  }

  if (counters.length) {
    if (reduceMotion) {
      counters.forEach(finishCounter);
    } else if ("IntersectionObserver" in window) {
      var counterObserver = new IntersectionObserver(
        function (entries, instance) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            instance.unobserve(entry.target);
          });
        },
        { threshold: 0.5, rootMargin: "0px 0px -40px 0px" }
      );
      counters.forEach(function (counter) {
        counterObserver.observe(counter);
      });
    } else {
      counters.forEach(animateCounter);
    }
  }

  Array.prototype.forEach.call(doc.querySelectorAll("[data-year]"), function (node) {
    node.textContent = String(new Date().getFullYear());
  });
})();
