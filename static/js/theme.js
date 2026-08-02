"use strict";

(function () {
  var STORAGE_KEY = "theme";

  function preferredTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || preferredTheme();
  }

  function updateHighlightTheme(theme) {
    var light = document.getElementById("hljs-light");
    var dark = document.getElementById("hljs-dark");
    if (!light || !dark) return;
    light.disabled = theme === "dark";
    dark.disabled = theme === "light";
  }

  function updateToggle(theme) {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;

    var isDark = theme === "dark";
    btn.setAttribute("aria-label", isDark ? "ライトモードに切り替え" : "ダークモードに切り替え");
    btn.setAttribute("aria-pressed", isDark ? "true" : "false");

    var darkIcon = btn.querySelector(".theme-toggle__icon--dark");
    var lightIcon = btn.querySelector(".theme-toggle__icon--light");
    if (darkIcon) darkIcon.hidden = isDark;
    if (lightIcon) lightIcon.hidden = !isDark;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    updateHighlightTheme(theme);
    updateToggle(theme);
  }

  function init() {
    applyTheme(getTheme());

    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var next = getTheme() === "dark" ? "light" : "dark";
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
      });
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(event.matches ? "dark" : "light");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
