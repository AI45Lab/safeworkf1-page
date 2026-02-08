(function () {
  var STORAGE_KEY = "theme";
  var root = document.documentElement;

  function getPreferred() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  }

  function setTheme(value) {
    root.setAttribute("data-theme", value);
    localStorage.setItem(STORAGE_KEY, value);
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.setAttribute("aria-label", value === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  function toggle() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
  }

  setTheme(getPreferred());

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      if (localStorage.getItem(STORAGE_KEY)) return;
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
