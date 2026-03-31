/**
 * Portfolio interactions: theme, typing hero, mobile nav,
 * project filters, contact form demo, smooth header state.
 */
(function () {
  "use strict";

  /* Browser-only: Node has no document/window — open index.html instead */
  if (typeof document === "undefined") {
    console.error(
      "\n[Portfolio] This file runs in the browser with index.html.\n" +
        "  Do not run: node script.js\n" +
        "  Do: open index.html in Edge/Chrome, or use Live Server.\n"
    );
    return;
  }

  var THEME_KEY = "portfolio-theme";
  var root = document.documentElement;
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  /* ----- Theme: light / dark ----- */
  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function setTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* ignore */
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#0f1419" : "#f6f4f1");
    }
  }

  function initTheme() {
    var stored = getStoredTheme();
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else if (prefersDark.matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      setTheme(isDark ? "light" : "dark");
    });
  }

  prefersDark.addEventListener("change", function (e) {
    if (!getStoredTheme()) {
      setTheme(e.matches ? "dark" : "light");
    }
  });

  initTheme();

  /* ----- Sticky header shadow ----- */
  var header = document.querySelector(".site-header");
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ----- Mobile navigation ----- */
  var navToggle = document.querySelector(".nav__toggle");
  var navMenu = document.getElementById("nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", open ? "false" : "true");
      navMenu.classList.toggle("is-open", !open);
    });
    navMenu.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
      });
    });
  }

  /* ----- Hero typing effect ----- */
  var typedEl = document.getElementById("typed-text");
  var phrases = [
    "Full Stack Developer",
    "UI-minded engineer",
    "Open source contributor",
    "Problem solver",
  ];
  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var typeDelay = 80;
  var deleteDelay = 45;
  var pauseEnd = 2000;
  var pauseStart = 400;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function tickTyping() {
    if (!typedEl || reduceMotion) {
      if (typedEl) typedEl.textContent = phrases[0];
      var cursor = document.getElementById("typed-cursor");
      if (cursor) cursor.style.display = "none";
      return;
    }
    var phrase = phrases[phraseIndex];
    if (!isDeleting && charIndex <= phrase.length) {
      typedEl.textContent = phrase.slice(0, charIndex);
      charIndex++;
      if (charIndex > phrase.length) {
        isDeleting = true;
        return void setTimeout(tickTyping, pauseEnd);
      }
      return void setTimeout(tickTyping, typeDelay);
    }
    if (isDeleting && charIndex >= 0) {
      typedEl.textContent = phrase.slice(0, charIndex);
      charIndex--;
      if (charIndex < 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
        return void setTimeout(tickTyping, pauseStart);
      }
      return void setTimeout(tickTyping, deleteDelay);
    }
  }
  if (typedEl && !reduceMotion) {
    setTimeout(tickTyping, 600);
  } else if (typedEl) {
    typedEl.textContent = phrases[0];
  }

  /* ----- Project filter ----- */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter") || "all";
      filterButtons.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      projectCards.forEach(function (card) {
        var cat = card.getAttribute("data-category") || "";
        var show = filter === "all" || cat === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ----- Contact form (client-side demo) ----- */
  var form = document.getElementById("contact-form");
  var formStatus = document.getElementById("form-status");
  if (form && formStatus) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var message = form.querySelector("#message");
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        formStatus.textContent = "Please fill in all fields.";
        return;
      }
      formStatus.textContent = "Thanks — message recorded locally. Connect a backend or Formspree to send email.";
      form.reset();
    });
  }

  /* ----- Footer year ----- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
