(function () {
  "use strict";

  var targets = document.querySelectorAll("[data-github-stars]");
  if (!targets.length) return;

  var cacheKey = "crabbase-github-stars";
  var maxAge = 60 * 60 * 1000;

  function format(count) {
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return String(count);
  }

  function apply(count) {
    var text = format(count);
    Array.prototype.forEach.call(targets, function (node) {
      node.textContent = text;
    });
  }

  function readCache() {
    try {
      var cached = JSON.parse(window.localStorage.getItem(cacheKey));
      if (cached && typeof cached.count === "number" && Date.now() - cached.at < maxAge) {
        return cached.count;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  var cachedCount = readCache();
  if (cachedCount !== null) {
    apply(cachedCount);
    return;
  }

  fetch("https://api.github.com/repos/ropali/crabbase", {
    headers: { Accept: "application/vnd.github+json" }
  })
    .then(function (response) {
      if (!response.ok) throw new Error("GitHub API " + response.status);
      return response.json();
    })
    .then(function (data) {
      if (typeof data.stargazers_count !== "number") return;
      apply(data.stargazers_count);
      try {
        window.localStorage.setItem(
          cacheKey,
          JSON.stringify({ count: data.stargazers_count, at: Date.now() })
        );
      } catch (error) {
        /* ignore storage failures */
      }
    })
    .catch(function () {
      /* keep the fallback label */
    });
})();
