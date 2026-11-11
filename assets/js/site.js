// Theme toggle, header rule on scroll, and phone-only touch helpers. No dependencies.
(function () {
  var root = document.documentElement;
  var phone = window.matchMedia ? window.matchMedia("(max-width: 720px)") : { matches: false };

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Project details: open on larger screens, collapsed on phones (all open without JS).
  var details = document.querySelectorAll(".work-details");
  function syncDetails() {
    details.forEach(function (d) { d.open = !phone.matches; });
  }
  syncDetails();
  if (phone.addEventListener) phone.addEventListener("change", syncDetails);

  // Swipe tracks: page dots that follow native scrolling.
  document.querySelectorAll("[data-swipe]").forEach(function (track) {
    var dots = track.nextElementSibling;
    if (!dots || !dots.classList.contains("swipe-dots")) return;
    var items = track.children;
    for (var i = 0; i < items.length; i++) dots.appendChild(document.createElement("span"));
    function update() {
      var w = items[0] ? items[0].getBoundingClientRect().width + 12 : 1;
      var idx = Math.round(track.scrollLeft / w);
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) idx = items.length - 1;
      for (var j = 0; j < dots.children.length; j++) dots.children[j].classList.toggle("on", j === idx);
    }
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  });

  // Toast helper
  var toast = document.querySelector(".toast");
  var toastTimer;
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
  }

  // Share: native share sheet when available, otherwise copy the link.
  document.querySelectorAll(".share-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var data = { title: btn.dataset.shareTitle, text: btn.dataset.shareText, url: btn.dataset.shareUrl };
      if (navigator.share) {
        navigator.share(data).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(data.url).then(function () { say("Link copied"); }, function () { say(data.url); });
      } else {
        say(data.url);
      }
    });
  });

  // Dock: appears once the hero buttons scroll away, hides when the footer is on screen.
  var dock = document.querySelector(".dock");
  var heroCtas = document.querySelector(".cta-row");
  var footer = document.querySelector(".site-footer");
  if (dock && "IntersectionObserver" in window) {
    var heroVisible = !!heroCtas, footerVisible = false;
    function syncDock() { dock.classList.toggle("on", !heroVisible && !footerVisible); }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.target === heroCtas) heroVisible = e.isIntersecting;
        if (e.target === footer) footerVisible = e.isIntersecting;
      });
      syncDock();
    });
    if (heroCtas) io.observe(heroCtas); else syncDock();
    if (footer) io.observe(footer);
  }
})();
