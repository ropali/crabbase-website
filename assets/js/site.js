(function () {
  "use strict";

  var win = document.querySelector(".hero__window");
  if (!win) return;

  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || calm) return;

  var glow = win.querySelector(".adm__glow");
  if (!glow) return;

  var targetX = 70;
  var targetY = 25;
  var x = targetX;
  var y = targetY;
  var frame = 0;

  function set(value) {
    glow.style.setProperty("--gx", value.toFixed(2) + "%");
    glow.style.setProperty("--gy", value.toFixed(2) + "%");
  }

  function tick() {
    x += (targetX - x) * 0.14;
    y += (targetY - y) * 0.14;
    set(x);
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.15) {
      frame = window.requestAnimationFrame(tick);
    } else {
      frame = 0;
    }
  }

  set(x);

  win.addEventListener(
    "pointermove",
    function (event) {
      if (!glow.classList.contains("is-live")) glow.classList.add("is-live");
      var rect = win.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width) * 100;
      targetY = ((event.clientY - rect.top) / rect.height) * 100;
      if (!frame) frame = window.requestAnimationFrame(tick);
    },
    { passive: true }
  );

  win.addEventListener("pointerleave", function () {
    targetX = 70;
    targetY = 25;
    if (!frame) frame = window.requestAnimationFrame(tick);
  });
})();
