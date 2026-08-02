(function () {
  var theme = document.documentElement.getAttribute("data-theme") || "light";
  var light = document.getElementById("hljs-light");
  var dark = document.getElementById("hljs-dark");

  if (!light || !dark) return;

  light.disabled = theme === "dark";
  dark.disabled = theme === "light";
})();
