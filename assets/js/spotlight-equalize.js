(function () {
  var mediumQuery = window.matchMedia("(max-width: 980px)");

  function equalize() {
    var spotlights = document.querySelectorAll("#one.spotlight-compact .spotlight");
    if (!spotlights.length) return;

    if (mediumQuery.matches) {
      spotlights.forEach(function (el) {
        el.style.minHeight = "";
      });
      return;
    }

    spotlights.forEach(function (el) {
      el.style.minHeight = "";
    });

    var maxHeight = 0;
    spotlights.forEach(function (el) {
      maxHeight = Math.max(maxHeight, el.offsetHeight);
    });

    spotlights.forEach(function (el) {
      el.style.minHeight = maxHeight + "px";
    });
  }

  var resizeTimer;
  function debouncedEqualize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(equalize, 100);
  }

  window.addEventListener("load", equalize);
  window.addEventListener("resize", debouncedEqualize);
})();
