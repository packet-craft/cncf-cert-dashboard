// Apply the saved theme before first paint to avoid a flash. Loaded synchronously in <head>.
(function () {
  try {
    var ui = JSON.parse(localStorage.getItem("cncf-dash:v1:ui"));
    if (ui && (ui.theme === "light" || ui.theme === "dark")) document.documentElement.dataset.theme = ui.theme;
  } catch (e) { /* no saved theme */ }
})();
