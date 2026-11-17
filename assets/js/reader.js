// Reading pages: theme toggle, reading progress, and the motif host. No dependencies.
//
// A motif script (assets/js/motifs/<name>.js) registers a factory on window.Motifs:
//   window.Motifs.<name> = function (ctx) { return { update(p), resize(), redraw() }; };
// ctx = { article, config, inst, root }. `p` is reading progress from 0 to 1.
// `inst` is the small readout in the top bar; a motif may fill it or leave it empty.
(function () {
  var root = document.documentElement;

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  var toggle = document.querySelector(".theme-toggle");

  var art = document.querySelector("article.post");
  var motif = null;

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      if (motif && motif.redraw) motif.redraw();
    });
  }
  if (!art) return;

  var bar = document.getElementById("bar");
  var inst = document.getElementById("inst");
  var col = art.querySelector(".col");
  var h1 = art.querySelector("h1");
  var p = 0;

  var name = art.dataset.motif;
  if (name && window.Motifs && window.Motifs[name]) {
    try {
      motif = window.Motifs[name]({ article: art, config: JSON.parse(art.dataset.motifConfig || "{}"), inst: inst, root: root });
    } catch (e) { motif = null; }
  }

  function update() {
    var barH = bar ? bar.offsetHeight : 0;
    var top = col.getBoundingClientRect().top + window.scrollY;
    var start = top - barH;
    var end = Math.max(start + 240, top + col.offsetHeight - window.innerHeight * 0.8);
    p = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
    root.style.setProperty("--p", p.toFixed(4));
    if (bar) bar.classList.toggle("is-deep", h1.getBoundingClientRect().bottom < barH);
    if (motif && motif.update) motif.update(p);
  }

  var ticking = 0;
  window.addEventListener("scroll", function () {
    if (!ticking) ticking = requestAnimationFrame(function () { ticking = 0; update(); });
  }, { passive: true });
  window.addEventListener("resize", function () {
    if (motif && motif.resize) motif.resize();
    update();
  });
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) mq.addEventListener("change", function () { if (motif && motif.redraw) motif.redraw(); });
  }
  if (motif && motif.resize) motif.resize();
  update();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
})();
