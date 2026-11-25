(function () {
  "use strict";

  var WA_NUMBER = "6288221206004";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Tahun & umur ---------- */
  var now = new Date();
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = now.getFullYear();

  var ageEl = document.getElementById("age");
  if (ageEl) {
    var birth = new Date(2005, 4, 31);
    var age = now.getFullYear() - birth.getFullYear();
    var m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    ageEl.textContent = "(" + age + " tahun)";
  }

  /* ---------- Dynamic Island ---------- */
  var island = document.getElementById("island");
  var toggle = document.getElementById("islandToggle");
  var panel = document.getElementById("islandPanel");
  var label = document.getElementById("islandLabel");
  var BAR_H = 42;
  var COLLAPSED_W = 224;

  function sizeIsland(open) {
    if (open) {
      var w = Math.min(window.innerWidth - 24, 340);
      island.style.width = w + "px";
      island.style.height = BAR_H + panel.scrollHeight + 8 + "px";
    } else {
      island.style.width = COLLAPSED_W + "px";
      island.style.height = BAR_H + "px";
    }
  }

  function setOpen(open) {
    island.dataset.open = open ? "true" : "false";
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    sizeIsland(open);
  }

  toggle.addEventListener("click", function () {
    setOpen(island.dataset.open !== "true");
  });

  island.addEventListener("click", function (e) {
    if (e.target.closest(".island__nav a")) setOpen(false);
  });

  document.addEventListener("click", function (e) {
    if (island.dataset.open === "true" && !island.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && island.dataset.open === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (island.dataset.open === "true") sizeIsland(true);
  }, { passive: true });

  sizeIsland(false);

  /* ---------- Scroll spy: sidebar + label island ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-section]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var currentId = "";

  function setActive(sec) {
    if (!sec || sec.id === currentId) return;
    currentId = sec.id;

    navLinks.forEach(function (a) {
      a.classList.toggle("is-active", a.dataset.nav === sec.id);
    });

    var text = sec.id === "beranda" ? "Terbuka untuk proyek" : sec.dataset.section;
    label.classList.add("swap");
    setTimeout(function () {
      label.textContent = text;
      label.classList.remove("swap");
    }, 180);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) setActive(en.target);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Parallax foto hero (transform saja, via rAF) ---------- */
  var photo = document.querySelector(".hero__frame");
  var ticking = false;

  function updateParallax() {
    var y = Math.min(window.scrollY, window.innerHeight);
    photo.style.setProperty("--py", (y * -0.06).toFixed(2) + "px");
    ticking = false;
  }

  if (photo && !reduceMotion) {
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    }, { passive: true });
  }

  /* ---------- Form client -> WhatsApp ---------- */
  var form = document.getElementById("clientForm");
  var errorEl = document.getElementById("formError");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var need = form.elements.need.value.trim();

      if (!name || !need) {
        errorEl.hidden = false;
        return;
      }
      errorEl.hidden = true;

      var msg = "Halo Fa’iq, saya " + name + ".\n\nSaya ingin membuat proyek:\n" + need;
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });
  }
})();
