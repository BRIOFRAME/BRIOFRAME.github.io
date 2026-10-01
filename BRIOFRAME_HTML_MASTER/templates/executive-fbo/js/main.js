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
      if (typeof form.reportValidity === "function" && !form.reportValidity()) {
        if (status) {
          status.textContent = "Please complete the required fields before submitting this simulated request.";
          status.hidden = false;
        }
        return;
      }
      if (status) {
        status.textContent =
          "Thank you. This is a simulated demonstration form — no data was transmitted. Connect your operations endpoint before production use.";
        status.hidden = false;
      }
    });
  });

  /* Character counters */
  document.querySelectorAll("[data-bf-char-count]").forEach(function (field) {
    var label = field.parentElement.querySelector("[data-bf-char-count-label]");
    if (!label) return;
    var max = Number(field.getAttribute("maxlength") || 500);
    function update() {
      label.textContent = field.value.length + " / " + max;
    }
    field.addEventListener("input", update);
    update();
  });

  /* Subtle hero / editorial reveals (respect reduced motion) */
  if (!prefersReducedMotion) {
    document.querySelectorAll(".bf-hero__content, .bf-editorial-hero__copy, .bf-page-hero__content").forEach(function (hero, index) {
      hero.style.opacity = "0";
      hero.style.transform = "translateY(14px)";
      hero.style.transition = "opacity 700ms ease " + index * 40 + "ms, transform 700ms ease " + index * 40 + "ms";
      requestAnimationFrame(function () {
        hero.style.opacity = "1";
        hero.style.transform = "translateY(0)";
      });
    });

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.18 }
      );
      document.querySelectorAll(".bf-service-card, .bf-steps__item, .bf-hospitality__visual, .bf-editorial-figure").forEach(function (el) {
        el.classList.add("bf-reveal");
        observer.observe(el);
      });
    }
  }
})();
