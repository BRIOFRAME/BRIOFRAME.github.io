(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile navigation */
  var navToggle = document.querySelector("[data-bf-nav-toggle]");
  var nav = document.querySelector("[data-bf-nav]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", open ? "false" : "true");
      navToggle.setAttribute("aria-expanded", open ? "false" : "true");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) {
          nav.setAttribute("data-open", "false");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  /* Service journey tabs */
  var journeyRoot = document.querySelector("[data-bf-journey]");
  if (journeyRoot) {
    var tabs = journeyRoot.querySelectorAll("[data-bf-journey-tab]");
    var panels = journeyRoot.querySelectorAll("[data-bf-journey-panel]");

    function activateJourney(id) {
      tabs.forEach(function (tab) {
        var selected = tab.getAttribute("data-journey-id") === id;
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        tab.tabIndex = selected ? 0 : -1;
      });
      panels.forEach(function (panel) {
        var show = panel.getAttribute("data-journey-id") === id;
        panel.hidden = !show;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateJourney(tab.getAttribute("data-journey-id"));
      });
      tab.addEventListener("keydown", function (event) {
        var index = Array.prototype.indexOf.call(tabs, tab);
        var next = null;
        if (event.key === "ArrowRight") next = tabs[index + 1];
        if (event.key === "ArrowLeft") next = tabs[index - 1];
        if (event.key === "Home") next = tabs[0];
        if (event.key === "End") next = tabs[tabs.length - 1];
        if (next) {
          event.preventDefault();
          next.focus();
          activateJourney(next.getAttribute("data-journey-id"));
        }
      });
    });
  }

  /* Dialogs */
  var dialogs = document.querySelectorAll("dialog[data-bf-dialog]");
  dialogs.forEach(function (dialog) {
    var id = dialog.id;
    document.querySelectorAll('[data-bf-open-dialog="' + id + '"]').forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        if (typeof dialog.showModal === "function") {
          dialog.showModal();
        }
      });
    });
    dialog.querySelectorAll("[data-bf-close-dialog]").forEach(function (closeBtn) {
      closeBtn.addEventListener("click", function () {
        dialog.close();
      });
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
  });

  /* Simulated form submit */
  document.querySelectorAll("[data-bf-demo-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector("[data-bf-form-status]");
      if (status) {
        status.textContent = "Thank you. This master build uses a simulated form only — wire to your operations endpoint before production.";
        status.hidden = false;
      }
    });
  });

  /* Subtle hero reveal (respect reduced motion) */
  if (!prefersReducedMotion) {
    var hero = document.querySelector(".bf-hero__content");
    if (hero) {
      hero.style.opacity = "0";
      hero.style.transform = "translateY(12px)";
      hero.style.transition = "opacity 600ms ease, transform 600ms ease";
      requestAnimationFrame(function () {
        hero.style.opacity = "1";
        hero.style.transform = "translateY(0)";
      });
    }
  }
})();
