(function () {
  var root = document.documentElement;

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  }

  function setTheme(value) {
    root.setAttribute("data-theme", value);
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.setAttribute("aria-label", value === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  function toggle() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
  }

  setTheme(getSystemTheme());

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      setTheme(e.matches ? "dark" : "light");
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest(".theme-toggle")) {
      e.preventDefault();
      toggle();
    }
  });
})();
