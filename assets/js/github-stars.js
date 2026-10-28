(function () {
  "use strict";

  var starTargets = document.querySelectorAll("[data-github-stars]");
  var versionTargets = document.querySelectorAll("[data-app-version]");
  if (!starTargets.length && !versionTargets.length) return;

  var repo = "ropali/crabbase";
  var apiBase = "https://api.github.com/repos/" + repo;
  var cacheMaxAge = 60 * 60 * 1000;
  var starCacheKey = "crabbase-github-stars";
  var versionCacheKey = "crabbase-app-version";

  function readCache(key) {
    try {
      var cached = JSON.parse(window.localStorage.getItem(key));
      if (cached && cached.at && Date.now() - cached.at < cacheMaxAge) {
        return cached;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  function writeCache(key, value) {
    try {
      window.localStorage.setItem(
        key,
        JSON.stringify({ value: value, at: Date.now() })
      );
    } catch (error) {
      /* ignore storage failures */
    }
  }

  function fetchJson(url) {
    return fetch(url, {
      headers: { Accept: "application/vnd.github+json" }
    }).then(function (response) {
      if (!response.ok) throw new Error("GitHub API " + response.status);
      return response.json();
    });
  }

  function formatStars(count) {
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return String(count);
  }

  function applyStars(count) {
    var text = formatStars(count);
    Array.prototype.forEach.call(starTargets, function (node) {
      node.textContent = text;
    });
  }

  function normalizeVersion(value) {
    if (!value) return "";
    var version = String(value).trim();
    if (!version) return "";
    if (/^v/i.test(version)) return "v" + version.slice(1);
    if (/^\d/.test(version)) return "v" + version;
    return version;
  }

  function applyVersion(value) {
    var version = normalizeVersion(value);
    if (!version) return;
    Array.prototype.forEach.call(versionTargets, function (node) {
      node.textContent = version;
    });
  }

  function fetchLatestRelease() {
    return fetchJson(apiBase + "/releases?per_page=1").then(function (releases) {
      if (!releases || !releases.length || !releases[0].tag_name) {
        throw new Error("No releases");
      }
      return releases[0].tag_name;
    });
  }

  function fetchLatestTag() {
    return fetchJson(apiBase + "/tags?per_page=1").then(function (tags) {
      if (!tags || !tags.length || !tags[0].name) throw new Error("No tags");
      return tags[0].name;
    });
  }

  function fetchCargoVersion() {
    return fetch(
      "https://raw.githubusercontent.com/" + repo + "/main/crabbase/Cargo.toml"
    )
      .then(function (response) {
        if (!response.ok) throw new Error("Cargo.toml " + response.status);
        return response.text();
      })
      .then(function (text) {
        var match = text.match(/^version\s*=\s*"([^"]+)"/m);
        if (!match) throw new Error("No version in Cargo.toml");
        return match[1];
      });
  }

  function fetchVersion() {
    return fetchLatestRelease()
      .catch(fetchLatestTag)
      .catch(fetchCargoVersion)
      .catch(function () {
        return "";
      });
  }

  if (starTargets.length) {
    var cachedStars = readCache(starCacheKey);
    if (cachedStars && typeof cachedStars.value === "number") {
      applyStars(cachedStars.value);
    } else {
      fetchJson(apiBase)
        .then(function (data) {
          if (typeof data.stargazers_count !== "number") return;
          applyStars(data.stargazers_count);
          writeCache(starCacheKey, data.stargazers_count);
        })
        .catch(function () {
          /* keep the fallback label */
        });
    }
  }

  if (versionTargets.length) {
    var cachedVersion = readCache(versionCacheKey);
    if (cachedVersion && cachedVersion.value) {
      applyVersion(cachedVersion.value);
    } else {
      fetchVersion()
        .then(function (version) {
          var normalized = normalizeVersion(version);
          if (!normalized) return;
          applyVersion(normalized);
          writeCache(versionCacheKey, normalized);
        })
        .catch(function () {
          /* keep the static fallback */
        });
    }
  }
})();
