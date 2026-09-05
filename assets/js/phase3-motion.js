const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function installPhase3Styles() {
  if (document.querySelector("#phase3-motion-styles")) return;
  const style = document.createElement("style");
  style.id = "phase3-motion-styles";
  style.textContent = `
    .phase3-reveal { opacity: 0; transform: translateY(18px); transition: opacity .55s ease, transform .55s ease; }
    .phase3-reveal.phase3-reveal--visible { opacity: 1; transform: none; }
    .template-card, .detail-media, .detail-note, .button { will-change: transform; }
    .template-card__image, .detail-media__image { transition: transform .55s cubic-bezier(.2,.7,.2,1); }
    .template-card:hover .template-card__image, .detail-media:hover .detail-media__image { transform: scale(1.018); }
    .button { transition: transform .18s ease, border-color .18s ease, background-color .18s ease, color .18s ease; }
    .button:hover { transform: translateY(-2px); }
    .detail-section { scroll-margin-top: 2rem; }
    @media (prefers-reduced-motion: reduce) {
      .phase3-reveal { opacity: 1; transform: none; transition: none; }
      .template-card__image, .detail-media__image, .button { transition: none; }
      .template-card:hover .template-card__image, .detail-media:hover .detail-media__image, .button:hover { transform: none; }
    }
  `;
  document.head.append(style);
}

function revealTargets() {
  const selectors = [
    ".template-card",
    ".detail-media",
    ".detail-section",
    ".detail-note",
    ".service-note > *",
  ];
  return [...document.querySelectorAll(selectors.join(","))];
}

function applyMotion() {
  installPhase3Styles();
  const targets = revealTargets();
  if (!targets.length) return;

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    targets.forEach((element) => element.classList.add("phase3-reveal--visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("phase3-reveal--visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

  targets.forEach((element, index) => {
    element.classList.add("phase3-reveal");
    element.style.transitionDelay = `${Math.min(index % 6, 5) * 45}ms`;
    observer.observe(element);
  });
}

function scheduleMotion() {
  window.requestAnimationFrame(() => window.requestAnimationFrame(applyMotion));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scheduleMotion, { once: true });
} else {
  scheduleMotion();
}

reducedMotion.addEventListener?.("change", scheduleMotion);

export { applyMotion };
