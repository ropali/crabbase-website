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
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================================
     1. Mobile Navigation & Escape Handlers
     ========================================================================== */
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

  /* ==========================================================================
     2. Navigation Scrollspy
     ========================================================================== */
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

  /* ==========================================================================
     3. Hallmark Reading Progress Spine (ScaleX, GPU Accelerated)
     ========================================================================== */
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

  /* ==========================================================================
     4. Install Command Copy Microinteraction
     ========================================================================== */
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

  /* ==========================================================================
     5. Code Tabs (GPU Transform Enter)
     ========================================================================== */
  var tabs = Array.prototype.slice.call(doc.querySelectorAll('[role="tab"]:not([data-workload-btn]):not([data-arch-btn])'));
  var panels = Array.prototype.slice.call(
    doc.querySelectorAll('[role="tabpanel"]:not([data-arch-panel])')
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

  /* ==========================================================================
     6. Numeric Counter Interpolator
     ========================================================================== */
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

  function animateCounter(element, fromValue) {
    var target = parseFloat(element.getAttribute("data-count"));
    if (isNaN(target)) return;
    if (reduceMotion) {
      element.textContent = counterText(element, target);
      return;
    }
    var startVal = typeof fromValue === "number" ? fromValue : 0;
    var startTime = null;
    var duration = 900;

    function frame(now) {
      if (startTime === null) startTime = now;
      var progress = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = startVal + (target - startVal) * eased;
      element.textContent = counterText(element, current);
      if (progress < 1) window.requestAnimationFrame(frame);
      else finishCounter(element);
    }

    window.requestAnimationFrame(frame);
  }

  /* ==========================================================================
     7. Scroll Reveal & Benchmark GPU scaleX Initialization
     ========================================================================== */
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
  if (counters.length) {
    if (reduceMotion) {
      counters.forEach(finishCounter);
    } else if ("IntersectionObserver" in window) {
      var counterObserver = new IntersectionObserver(
        function (entries, instance) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target, 0);
            instance.unobserve(entry.target);
          });
        },
        { threshold: 0.4, rootMargin: "0px 0px -40px 0px" }
      );
      counters.forEach(function (counter) {
        counterObserver.observe(counter);
      });
    } else {
      counters.forEach(function (counter) {
        animateCounter(counter, 0);
      });
    }
  }

  /* ==========================================================================
     8. Interactive Multi-Workload Benchmark Sandbox
     ========================================================================== */
  var WORKLOADS = {
    read: {
      name: "Throughput (Req/Sec)",
      metricSubtitle: "Higher is better. Tested via wrk load-generator.",
      spec: "wrk -t8 -c10000",
      items: [
        { count: 145000, suffix: " req/s", sub: "(0.8ms p99)", scale: 1.0, idle: "12MB Idle RAM", badge: "Peak Tokio Concurrency" },
        { count: 42000, suffix: " req/s", sub: "(2.9ms p99)", scale: 0.29, idle: "38MB Idle RAM", badge: "Go GC pauses observed" },
        { count: 18000, suffix: " req/s", sub: "(9.4ms p99)", scale: 0.12, idle: "140MB Idle RAM", badge: "V8 GC & ORM overhead" }
      ]
    },
    write: {
      name: "Batch Writes (Tx/Sec)",
      metricSubtitle: "Higher is better. 5,000 concurrent ACID write transactions.",
      spec: "wrk -t8 -c5000 -s tx.lua",
      items: [
        { count: 68000, suffix: " writes/s", sub: "(1.2ms p99)", scale: 1.0, idle: "14MB RAM", badge: "Zero-copy SQLite WAL" },
        { count: 19500, suffix: " writes/s", sub: "(4.1ms p99)", scale: 0.29, idle: "46MB RAM", badge: "Go mutex serialization" },
        { count: 8200, suffix: " writes/s", sub: "(14.6ms p99)", scale: 0.12, idle: "165MB RAM", badge: "TCP connection churn" }
      ]
    },
    realtime: {
      name: "SSE Broadcast (Msg/Sec)",
      metricSubtitle: "Higher is better. 10,000 concurrent clients receiving fan-out.",
      spec: "k6 10k SSE streams",
      items: [
        { count: 240000, suffix: " msg/s", sub: "(0.3ms p99)", scale: 1.0, idle: "18MB RAM", badge: "Tokio unbounded channels" },
        { count: 65000, suffix: " msg/s", sub: "(1.8ms p99)", scale: 0.27, idle: "62MB RAM", badge: "Goroutine scheduler lag" },
        { count: 31000, suffix: " msg/s", sub: "(6.2ms p99)", scale: 0.13, idle: "220MB RAM", badge: "Single-thread event loop stall" }
      ]
    }
  };

  var workloadButtons = Array.prototype.slice.call(
    doc.querySelectorAll("[data-workload-btn]")
  );
  var workloadTitle = doc.getElementById("workload-title");
  var workloadSubtitle = doc.getElementById("workload-subtitle");
  var workloadSpec = doc.getElementById("workload-spec");
  var benchRows = [
    {
      countEl: doc.getElementById("bench-count-crab"),
      subEl: doc.getElementById("bench-sub-crab"),
      barEl: doc.getElementById("bench-bar-crab"),
      idleEl: doc.getElementById("bench-idle-crab"),
      badgeEl: doc.getElementById("bench-badge-crab")
    },
    {
      countEl: doc.getElementById("bench-count-pocket"),
      subEl: doc.getElementById("bench-sub-pocket"),
      barEl: doc.getElementById("bench-bar-pocket"),
      idleEl: doc.getElementById("bench-idle-pocket"),
      badgeEl: doc.getElementById("bench-badge-pocket")
    },
    {
      countEl: doc.getElementById("bench-count-node"),
      subEl: doc.getElementById("bench-sub-node"),
      barEl: doc.getElementById("bench-bar-node"),
      idleEl: doc.getElementById("bench-idle-node"),
      badgeEl: doc.getElementById("bench-badge-node")
    }
  ];

  function switchWorkload(type) {
    var data = WORKLOADS[type];
    if (!data) return;

    workloadButtons.forEach(function (btn) {
      var active = btn.getAttribute("data-workload-btn") === type;
      btn.dataset.active = String(active);
      btn.setAttribute("aria-selected", String(active));
      btn.classList.toggle("bg-primary", active);
      btn.classList.toggle("text-on-primary", active);
      btn.classList.toggle("shadow-sm", active);
      btn.classList.toggle("bg-surface-container", !active);
      btn.classList.toggle("text-on-surface-variant", !active);
    });

    if (workloadTitle) workloadTitle.textContent = data.name;
    if (workloadSubtitle) workloadSubtitle.textContent = data.metricSubtitle;
    if (workloadSpec) workloadSpec.textContent = data.spec;

    benchRows.forEach(function (row, idx) {
      var item = data.items[idx];
      if (!item) return;

      if (row.barEl) {
        row.barEl.style.setProperty("--target-scale", String(item.scale));
      }
      if (row.subEl) {
        row.subEl.textContent = item.sub;
      }
      if (row.idleEl) {
        row.idleEl.textContent = item.idle;
      }
      if (row.badgeEl) {
        row.badgeEl.textContent = item.badge;
      }
      if (row.countEl) {
        var current = parseFloat(row.countEl.getAttribute("data-count")) || 0;
        row.countEl.setAttribute("data-count", String(item.count));
        row.countEl.setAttribute("data-suffix", item.suffix);
        animateCounter(row.countEl, current);
      }
    });
  }

  workloadButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var type = btn.getAttribute("data-workload-btn");
      switchWorkload(type);
    });
  });

  /* ==========================================================================
     9. Interactive Architecture Pipeline Inspector
     ========================================================================== */
  var ARCH_NODES = {
    ingest: {
      title: "Client Request Ingestion Layer",
      desc: "Handles HTTP/1.1, HTTP/2, and persistent WebSocket/SSE connections via Axum. Employs SIMD-accelerated JSON parsers and zero-allocation routing to achieve sub-millisecond dispatch times.",
      stat1: "0.18ms parsing",
      stat2: "Zero heap realloc",
      tag: "Axum + Hyper"
    },
    runtime: {
      title: "Tokio Multi-Threaded Runtime",
      desc: "Work-stealing thread scheduler bound across CPU cores with jemalloc memory arenas. Eliminates garbage collection stop-the-world spikes completely, ensuring deterministic p99 SLAs.",
      stat1: "0ms GC pauses",
      stat2: "12MB idle memory",
      tag: "Rust 2024 Edition"
    },
    storage: {
      title: "Embedded SQLite & RocksDB WAL Engine",
      desc: "Storage engine embedded directly within the process address space. No TCP socket roundtrips, no serialization tax. Features write-ahead logging (WAL) with ACID crash resilience.",
      stat1: "Zero TCP overhead",
      stat2: "ACID WAL sync",
      tag: "Direct mmap I/O"
    },
    realtime: {
      title: "In-Memory Realtime Dispatch Bus",
      desc: "Lock-free Tokio broadcast channels fan out row mutations to over 100,000 concurrent subscribers simultaneously with sub-millisecond SSE push dispatch.",
      stat1: "0.3ms fanout latency",
      stat2: ">100k streams",
      tag: "Lock-free Broadcast"
    }
  };

  var archButtons = Array.prototype.slice.call(doc.querySelectorAll("[data-arch-btn]"));
  var archTitle = doc.getElementById("arch-node-title");
  var archDesc = doc.getElementById("arch-node-desc");
  var archStat1 = doc.getElementById("arch-stat-1");
  var archStat2 = doc.getElementById("arch-stat-2");
  var archTag = doc.getElementById("arch-tag");

  function selectArchNode(id) {
    var node = ARCH_NODES[id];
    if (!node) return;

    archButtons.forEach(function (btn) {
      var active = btn.getAttribute("data-arch-btn") === id;
      btn.dataset.active = String(active);
      btn.classList.toggle("ring-2", active);
      btn.classList.toggle("ring-primary", active);
      btn.classList.toggle("bg-surface-container-high", active);
    });

    if (archTitle) archTitle.textContent = node.title;
    if (archDesc) archDesc.textContent = node.desc;
    if (archStat1) archStat1.textContent = node.stat1;
    if (archStat2) archStat2.textContent = node.stat2;
    if (archTag) archTag.textContent = node.tag;
  }

  archButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      selectArchNode(btn.getAttribute("data-arch-btn"));
    });
  });

  /* ==========================================================================
     10. Interactive Realtime Event Stream Simulator
     (Hallmark Gate 18: Pauses on hover and focus)
     ========================================================================== */
  var simulateBtn = doc.getElementById("simulate-event-btn");
  var eventList = doc.getElementById("realtime-event-list");
  var liveEventCountEl = doc.getElementById("realtime-event-count");
  var realtimeWidget = doc.getElementById("realtime-simulator");
  var liveEventCount = 1420;
  var eventSimTimer = null;
  var isSimulatorPaused = false;

  var SAMPLE_MUTATIONS = [
    { col: "posts", action: "INSERT", title: "Announcing Crabbase v0.1.0", latency: "0.22ms" },
    { col: "users", action: "UPDATE", title: "Role upgraded to 'Maintainer'", latency: "0.31ms" },
    { col: "orders", action: "INSERT", title: "Checkout fulfilled: #9201", latency: "0.28ms" },
    { col: "messages", action: "BROADCAST", title: "Realtime ping delivered to 48 clients", latency: "0.19ms" },
    { col: "files", action: "UPLOAD", title: "Generated PDF stored (1.4MB)", latency: "0.45ms" }
  ];

  function emitSimulatedEvent() {
    if (!eventList) return;
    liveEventCount++;
    if (liveEventCountEl) liveEventCountEl.textContent = liveEventCount.toLocaleString();

    var sample = SAMPLE_MUTATIONS[Math.floor(Math.random() * SAMPLE_MUTATIONS.length)];
    var row = doc.createElement("div");
    row.className =
      "realtime-row-enter flex items-center justify-between gap-3 p-2.5 rounded-lg border border-outline-variant/30 bg-surface-container-lowest font-code-md text-label-xs";
    row.innerHTML =
      '<div class="flex items-center gap-2 min-w-0">' +
        '<span class="w-2 h-2 rounded-full bg-primary shrink-0"></span>' +
        '<span class="font-bold text-primary uppercase">' + sample.col + ':' + sample.action + '</span>' +
        '<span class="text-on-surface truncate">' + sample.title + '</span>' +
      '</div>' +
      '<span class="text-tertiary shrink-0 font-semibold">' + sample.latency + '</span>';

    eventList.insertBefore(row, eventList.firstChild);
    while (eventList.children.length > 5) {
      eventList.removeChild(eventList.lastChild);
    }
  }

  if (simulateBtn) {
    simulateBtn.addEventListener("click", emitSimulatedEvent);
  }

  if (realtimeWidget) {
    realtimeWidget.addEventListener("mouseenter", function () {
      isSimulatorPaused = true;
    });
    realtimeWidget.addEventListener("mouseleave", function () {
      isSimulatorPaused = false;
    });
    realtimeWidget.addEventListener("focusin", function () {
      isSimulatorPaused = true;
    });
    realtimeWidget.addEventListener("focusout", function () {
      isSimulatorPaused = false;
    });

    if (!reduceMotion) {
      eventSimTimer = window.setInterval(function () {
        if (!isSimulatorPaused && doc.visibilityState === "visible") {
          emitSimulatedEvent();
        }
      }, 7500);
    }
  }

  /* ==========================================================================
     11. Bento Card Spotlight Pointer Tracking (Linear/Supabase Modern Aesthetic)
     ========================================================================== */
  var bentoCards = Array.prototype.slice.call(doc.querySelectorAll(".bento-card"));
  bentoCards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", x + "px");
      card.style.setProperty("--mouse-y", y + "px");
    });
  });

  /* ==========================================================================
     12. Year Auto-Populate
     ========================================================================== */
  Array.prototype.forEach.call(doc.querySelectorAll("[data-year]"), function (node) {
    node.textContent = String(new Date().getFullYear());
  });
})();
