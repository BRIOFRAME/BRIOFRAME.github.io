/*!
 * BRIOFRAME · SOLARA Private Villas Master · BF-SOLARA-PV-M1 · v1.1.0
 * Original publisher: BRIOFRAME. Shared site engine: header, menu, reveals, bindings,
 * image helper, cards, itinerary store, form engine and gallery/lightbox.
 */
(() => {
  "use strict";
  const doc = document;
  const body = doc.body;
  const C = window.SOLARA_CONFIG || {};
  const D = window.SOLARA_DATA || {};
  const IMG = window.SOLARA_IMAGES || {};
  const REMOTE = window.SOLARA_PHOTO_SOURCES || {};
  const base = body.dataset.root || "";
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => reducedQuery.matches;

  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => Array.from(c.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const params = new URLSearchParams(window.location.search);
  const pad = (n) => String(n).padStart(2, "0");

  /* ---------- data helpers ---------- */
  const villa = (id) => (D.villas || []).find((v) => v.id === id);
  const dest = (id) => (D.destinations || []).find((d) => d.id === id);
  const exp = (id) => (D.experiences || []).find((e) => e.id === id);
  const villaUrl = (id) => `${base}villa/index.html?id=${encodeURIComponent(id)}`;
  const cur = C.currency || { code: "USD", locale: "en-US" };
  const moneyFmt = new Intl.NumberFormat(cur.locale || "en-US", { style: "currency", currency: cur.code || "USD", maximumFractionDigits: 0 });
  const price = (n) => moneyFmt.format(n);

  /* ---------- responsive image ---------- */
  function img(slug, { sizes = "100vw", alt = "", eager = false, cls = "" } = {}) {
    const m = IMG[slug];
    if (!m) return "";
    const [w, h, widths] = m;
    const rid = REMOTE.photos && REMOTE.photos[slug];
    const src = (x) => (rid ? `${REMOTE.base}${rid}?w=${x}&${REMOTE.query}` : `${base}assets/img/photo/${slug}-${x}.webp`);
    const def = widths.includes(1280) ? 1280 : widths[widths.length - 1];
    return `<img src="${src(def)}" srcset="${widths.map((x) => `${src(x)} ${x}w`).join(", ")}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${cls ? ` class="${cls}"` : ""}>`;
  }

  /* ---------- villa card ---------- */
  function villaCard(v, { variant = "", sizes = "(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw", summary = false, tag = "h3", note = "", avoid = [] } = {}) {
    const d = dest(v.destination) || {};
    const cover = v.images.find((im) => !avoid.includes(im.src)) || v.images[0];
    return `<article class="vcard${variant ? ` vcard--${variant}` : ""}" data-villa="${esc(v.id)}">
      <div class="vcard__media">${img(cover.src, { sizes, alt: cover.alt })}${note ? `<span class="vcard__note">${esc(note)}</span>` : ""}</div>
      <div class="vcard__body">
        <p class="eyebrow">${esc(v.area)} · ${esc(d.name || "")}</p>
        <${tag} class="vcard__title"><a class="stretched" href="${villaUrl(v.id)}">${esc(v.name)}</a></${tag}>
        <p class="vcard__meta"><span>${v.bedrooms} bedrooms</span><span>${v.guests} guests</span><span>${esc(v.type)}</span></p>
        ${summary ? `<p class="vcard__summary">${esc(v.summary)}</p>` : ""}
        <p class="vcard__price">From <strong>${price(v.priceFrom)}</strong> / night</p>
      </div>
    </article>`;
  }

  /* ---------- analytics / hooks ---------- */
  function track(name, data = {}) {
    if (C.analytics && C.analytics.enabled) (window.dataLayer = window.dataLayer || []).push({ event: `solara_${name}`, ...data });
    doc.dispatchEvent(new CustomEvent("solara:track", { detail: { name, data } }));
  }

  /* ---------- itinerary store (selected experiences, shared across pages) ---------- */
  const store = {
    key: "solara.itinerary",
    get() { try { const a = JSON.parse(localStorage.getItem(this.key) || "[]"); return Array.isArray(a) ? a.filter((id) => exp(id)) : []; } catch { return []; } },
    set(a) { try { localStorage.setItem(this.key, JSON.stringify([...new Set(a)])); } catch { /* storage unavailable */ } doc.dispatchEvent(new CustomEvent("solara:itinerary")); },
    has(id) { return this.get().includes(id); },
    toggle(id) { const a = this.get(); this.set(a.includes(id) ? a.filter((x) => x !== id) : [...a, id]); return this.has(id); },
    clear() { this.set([]); }
  };
  function paintItineraryCount() {
    const n = store.get().length;
    $$("[data-itinerary-count]").forEach((el) => { el.textContent = n; el.hidden = n === 0; el.setAttribute("aria-label", `${n} experience${n === 1 ? "" : "s"} selected`); });
  }
  doc.addEventListener("solara:itinerary", paintItineraryCount);
  window.addEventListener("storage", (e) => { if (e.key === store.key) paintItineraryCount(); });

  /* ---------- live-preview UX: visible desktop hero reveal ---------- */
  function desktopHeroReveal() {
    const hero = $(".hero--home .hero__content");
    if (!hero || !window.matchMedia("(min-width: 1280px)").matches) return;
    hero.classList.add("bf-hero-pending");
    hero.classList.remove("bf-hero-live");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.setTimeout(() => hero.classList.add("bf-hero-live"), 650);
    }));
  }

  /* ---------- live-preview UX: clear saved stay ---------- */
  function savedStayClear() {
    if (body.dataset.page !== "plan") return;
    const head = $(".plan-head__text");
    if (!head || $("[data-clear-saved-stay]")) return;
    const btn = doc.createElement("button");
    btn.type = "button";
    btn.className = "text-btn clear-saved-stay";
    btn.setAttribute("data-clear-saved-stay", "");
    const sync = () => {
      const n = store.get().length;
      btn.hidden = n === 0;
      btn.textContent = n ? "Clear saved stay (" + n + ")" : "Clear saved stay";
    };
    btn.addEventListener("click", () => {
      store.clear();
      $$('input[name="experiences"]:checked').forEach((input) => {
        input.checked = false;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      sync();
    });
    head.appendChild(btn);
    doc.addEventListener("solara:itinerary", sync);
    sync();
  }

  /* ---------- live-preview UX: back to top ---------- */
  function backToTop() {
    if ($("[data-back-top]")) return;
    const btn = doc.createElement("button");
    btn.type = "button";
    btn.className = "back-top";
    btn.setAttribute("data-back-top", "");
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = '<span aria-hidden="true">↑</span><span>Top</span>';
    body.appendChild(btn);
    const paint = () => btn.classList.toggle("is-visible", window.scrollY > 700);
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" }));
    window.addEventListener("scroll", paint, { passive: true });
    paint();
  }

  /* ---------- config bindings ---------- */
  function bindConfig() {
    const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), C);
    $$("[data-bind]").forEach((el) => { const v = get(el.dataset.bind); if (v != null) el.textContent = v; });
    $$("[data-bind-href]").forEach((el) => {
      const [kind, path] = el.dataset.bindHref.split(":");
      const v = get(path);
      if (!v) return;
      if (kind === "mailto") el.href = `mailto:${v}`;
      if (kind === "tel") el.href = `tel:${v.replace(/[^\d+]/g, "")}`;
      if (kind === "whatsapp") el.href = `https://wa.me/${v.replace(/\D/g, "")}`;
    });
    $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
    if (C.attribution === false) $$("[data-bf-attribution]").forEach((el) => el.remove());
  }

  /* ---------- header + menu ---------- */
  function header() {
    const h = $(".site-header");
    if (!h) return;
    const onScroll = () => h.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const toggle = $(".menu-toggle", h);
    const menu = $("#site-menu");
    if (!toggle || !menu) return;
    const main = $("main");
    const footer = $(".site-footer");
    let lastFocus = null;
    const focusables = () => $$('a[href], button:not([disabled])', menu).concat(toggle);
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      $(".menu-toggle__label", toggle).textContent = open ? "Close" : "Menu";
      menu.hidden = !open;
      body.classList.toggle("menu-open", open);
      doc.documentElement.classList.toggle("is-locked", open);
      [main, footer].forEach((el) => el && (el.inert = open));
      if (open) { lastFocus = doc.activeElement; requestAnimationFrame(() => { menu.classList.add("is-open"); const f = $("a", menu); f && f.focus(); }); }
      else { menu.classList.remove("is-open"); (lastFocus || toggle).focus(); }
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    doc.addEventListener("keydown", (e) => {
      if (menu.hidden) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const f = focusables(); const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia("(min-width: 1180px)").addEventListener("change", (e) => { if (e.matches && !menu.hidden) setOpen(false); });
  }

  /* ---------- primary-nav disclosure (e.g. Experiences → Wellness, Weddings) ---------- */
  function navGroups() {
    $$("[data-nav-group]").forEach((group) => {
      const btn = $(".nav-group__toggle", group), panel = $(".nav-group__panel", group);
      if (!btn || !panel) return;
      if ($('[aria-current="page"]', panel)) group.classList.add("is-current");
      let timer = 0, hoverAt = 0;
      const set = (open) => { clearTimeout(timer); btn.setAttribute("aria-expanded", String(open)); panel.hidden = !open; group.classList.toggle("is-open", open); };
      btn.addEventListener("click", () => set(Date.now() - hoverAt < 500 || btn.getAttribute("aria-expanded") !== "true"));
      group.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { set(false); btn.focus(); } });
      group.addEventListener("focusout", (e) => { if (!group.contains(e.relatedTarget)) set(false); });
      doc.addEventListener("click", (e) => { if (!group.contains(e.target)) set(false); });
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        group.addEventListener("mouseenter", () => { if (panel.hidden) hoverAt = Date.now(); set(true); });
        group.addEventListener("mouseleave", () => { timer = setTimeout(() => set(false), 180); });
      }
    });
  }

  /* ---------- hero: slow crossfade of stills, optional film, pause control ---------- */
  function heroMotion() {
    const wrap = $("[data-hero-slides]");
    if (!wrap) return;
    const slides = $$(".hero__slide", wrap);
    const captions = $$("[data-slide-caption]");
    const pauseBtn = $("[data-hero-pause]");
    const media = C.media || {};
    const saveData = navigator.connection && navigator.connection.saveData;
    let i = 0, timer = 0, paused = false, video = null, filmOn = false, inView = true;
    const url = (p) => (!p || /^(https?:)?\/\//.test(p) || p.startsWith("/") ? p : base + p);
    const show = (k) => {
      i = (k + slides.length) % slides.length;
      slides.forEach((s, j) => s.classList.toggle("is-active", j === i));
      captions.forEach((c, j) => { c.hidden = filmOn || j !== i; });
      const next = slides[(i + 1) % slides.length];
      if (next && next.loading === "lazy") next.loading = "eager";
    };
    const stop = () => { clearInterval(timer); timer = 0; };
    const start = () => { stop(); if (!video && !paused && inView && slides.length > 1 && !reduced()) timer = setInterval(() => show(i + 1), (media.heroInterval || 7) * 1000); };
    const label = () => (video ? (paused ? "Play film" : "Pause film") : (paused ? "Play slideshow" : "Pause slideshow"));
    const syncButton = () => { if (pauseBtn) { pauseBtn.setAttribute("aria-pressed", String(paused)); $(".hero__pause-label", pauseBtn).textContent = label(); } };
    const run = () => {
      if (video) (paused || !inView || doc.hidden) ? video.pause() : video.play().catch(() => {});
      else if (paused || doc.hidden) stop(); else start();
    };
    const setPaused = (p) => { paused = p; syncButton(); run(); };
    const dropFilm = () => {
      if (!video) return;
      video.pause(); video.remove(); video = null; filmOn = false;
      show(i); syncButton(); run();
    };
    const hv = media.heroVideo || {};
    const compact = window.matchMedia("(max-width: 1279px)").matches;
    const filmSrc = url(compact && hv.srcCompact ? hv.srcCompact : hv.src);
    if (filmSrc && !reduced() && !saveData && window.matchMedia("(min-width: 700px)").matches) {
      video = doc.createElement("video");
      Object.assign(video, { muted: true, loop: true, playsInline: true, autoplay: true, preload: "auto" });
      video.setAttribute("muted", ""); video.setAttribute("playsinline", ""); video.setAttribute("aria-hidden", "true");
      video.setAttribute("disablepictureinpicture", "");
      video.className = "hero__video";
      if (hv.poster) video.poster = url(hv.poster);
      video.src = filmSrc;
      video.addEventListener("playing", () => { video.classList.add("is-playing"); filmOn = true; show(i); }, { once: true });
      video.addEventListener("error", dropFilm, { once: true });
      wrap.appendChild(video);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(([e]) => { inView = e.isIntersecting; run(); }).observe(wrap);
      }
    }
    if (pauseBtn && (slides.length > 1 || video) && !reduced()) {
      pauseBtn.hidden = false;
      pauseBtn.addEventListener("click", () => setPaused(!paused));
    }
    doc.addEventListener("visibilitychange", run);
    reducedQuery.addEventListener("change", () => { if (reduced()) { dropFilm(); stop(); show(0); if (pauseBtn) pauseBtn.hidden = true; } });
    syncButton();
    show(0);
    run();
  }

  /* ---------- restrained parallax on [data-parallax] media (off for reduced motion / small screens) ---------- */
  function parallax() {
    const els = $$("[data-parallax]");
    if (!els.length) return;
    const wide = window.matchMedia("(min-width: 900px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const on = wide.matches && !reduced();
      const vh = window.innerHeight;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!on || r.bottom < 0 || r.top > vh) { if (!on) el.style.removeProperty("--py"); return; }
        const p = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
        el.style.setProperty("--py", `${(Math.max(-1, Math.min(1, p)) * -3.5).toFixed(2)}%`);
      });
    };
    const req = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    wide.addEventListener("change", req);
    reducedQuery.addEventListener("change", req);
    doc.documentElement.classList.add("has-parallax");
    update();
  }

  /* ---------- reveal on scroll ---------- */
  function reveals(scope = doc) {
    const els = $$("[data-reveal]:not(.is-in)", scope);
    const rootEl = doc.documentElement;
    if (reduced() || !("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-in")); rootEl.classList.add("js"); return; }
    // Anything already on screen is shown immediately, so gating never hides visible content.
    const vh = window.innerHeight;
    els.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < vh && r.bottom > 0) el.classList.add("is-in"); });
    rootEl.classList.add("js");
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.filter((el) => !el.classList.contains("is-in")).forEach((el) => io.observe(el));
  }
  window.addEventListener("beforeprint", () => $$("[data-reveal]").forEach((el) => el.classList.add("is-in")));

  /* ---------- form engine ---------- */
  const labelOf = (el) => {
    if (el.dataset.label) return el.dataset.label;
    const l = el.id && doc.querySelector(`label[for="${el.id}"]`);
    return l ? l.textContent.replace(/\*|\(optional\)/g, "").trim() : (el.name || "This field");
  };
  const isHidden = (el) => !!el.closest("[hidden]") || el.disabled;
  const holder = (el) => el.closest("[data-field]") || el.closest(".field") || el.parentElement;

  function fieldMessage(el) {
    if (isHidden(el)) return "";
    if (el.matches("fieldset")) {
      const min = Number(el.dataset.min || 0);
      const n = $$(el.dataset.count ? `${el.dataset.count}:checked` : ":scope input:checked", el).length;
      if (el.dataset.requiredGroup != null && n === 0) return el.dataset.message || `Choose ${el.dataset.label || "an option"}.`;
      if (min && n < min) return el.dataset.message || `Choose at least ${min}.`;
      return "";
    }
    const v = (el.value || "").trim();
    if (el.type === "checkbox") return el.required && !el.checked ? (el.dataset.message || `Please confirm to continue.`) : "";
    if (el.required && !v) return el.dataset.message || `${labelOf(el)} is required.`;
    if (!v) return "";
    if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email address.";
    if (el.type === "tel" && !/^[+()\d\s.-]{6,20}$/.test(v)) return "Enter a valid phone number.";
    if (el.type === "url" && !/^https?:\/\/[^\s.]+\.\S+$/i.test(v)) return "Enter a full web address, starting with https://";
    if (el.maxLength > 0 && v.length > el.maxLength) return `${labelOf(el)} is too long.`;
    if (el.type === "number") {
      const n = Number(v);
      if (Number.isNaN(n) || (el.min !== "" && n < Number(el.min)) || (el.max !== "" && n > Number(el.max))) return `${labelOf(el)} must be between ${el.min} and ${el.max}.`;
    }
    if (el.type === "date") {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const d = new Date(`${v}T00:00:00`);
      if (Number.isNaN(d.getTime())) return "Enter a valid date.";
      if (el.dataset.future != null && d < today) return `${labelOf(el)} can't be in the past.`;
      if (el.dataset.after) {
        const other = $(el.dataset.after);
        if (other && other.value && d <= new Date(`${other.value}T00:00:00`)) return el.dataset.afterMessage || `${labelOf(el)} must be after ${labelOf(other).toLowerCase()}.`;
      }
    }
    return "";
  }

  function setError(el, msg) {
    const h = holder(el);
    const id = `${el.id || el.name || "f" + Math.random().toString(36).slice(2)}-error`;
    let err = h && $(`:scope > .field-error`, h);
    const target = el.matches("fieldset") ? el : el;
    if (msg) {
      if (!err) { err = doc.createElement("p"); err.className = "field-error"; err.id = id; h.appendChild(err); }
      err.textContent = msg;
      target.setAttribute("aria-invalid", "true");
      const ids = new Set((target.getAttribute("aria-describedby") || "").split(" ").filter(Boolean)); ids.add(err.id);
      target.setAttribute("aria-describedby", [...ids].join(" "));
      h && h.classList.add("is-invalid");
    } else {
      target.removeAttribute("aria-invalid");
      if (err) {
        const ids = (target.getAttribute("aria-describedby") || "").split(" ").filter((x) => x && x !== err.id);
        ids.length ? target.setAttribute("aria-describedby", ids.join(" ")) : target.removeAttribute("aria-describedby");
        err.remove();
      }
      h && h.classList.remove("is-invalid");
    }
  }

  function validate(scope) {
    const els = $$("input:not([type=hidden]):not([data-honeypot]), select, textarea, fieldset[data-required-group], fieldset[data-min]", scope)
      .filter((el) => !(el.type === "radio" || (el.type === "checkbox" && el.closest("fieldset[data-required-group], fieldset[data-min]"))));
    let first = null;
    els.forEach((el) => { const m = fieldMessage(el); setError(el, m); if (m && !first) first = el; });
    if (first) {
      const f = first.matches("fieldset") ? $("input", first) : first;
      f && f.focus({ preventScroll: true });
      (first.closest("[data-field]") || first).scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
    }
    return !first;
  }

  function liveValidation(form) {
    const handler = (e) => {
      const el = e.target.closest("fieldset[aria-invalid]") || e.target;
      if (el.getAttribute("aria-invalid") === "true") setError(el, fieldMessage(el));
      const dep = el.id && $$(`[data-after="#${el.id}"][aria-invalid="true"]`, form);
      dep && dep.forEach((d) => setError(d, fieldMessage(d)));
    };
    form.addEventListener("input", handler);
    form.addEventListener("change", handler);
    form.addEventListener("blur", (e) => {
      const el = e.target;
      if (el.matches && el.matches("input:not([type=checkbox]):not([type=radio]), select, textarea") && el.value.trim()) setError(el, fieldMessage(el));
    }, true);
  }

  const reference = (prefix = "SOL") => `${prefix}-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

  async function submit(formName, payload, form) {
    const hp = form && $("[data-honeypot]", form);
    const ref = reference();
    const full = { form: formName, reference: ref, submittedAt: new Date().toISOString(), release: "BF-SOLARA-PV-M1", ...payload };
    if (hp && hp.value) { await new Promise((r) => setTimeout(r, 600)); return { ref, simulated: true }; }
    track("form_submit", { form: formName });
    const hooks = window.SOLARA_HOOKS || {};
    if (typeof hooks.beforeSubmit === "function") await hooks.beforeSubmit(formName, full);
    const cfg = C.forms || {};
    if (cfg.mode === "live" && cfg.endpoint) {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), cfg.timeoutMs || 12000);
      try {
        const res = await fetch(cfg.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(full), signal: ctl.signal, credentials: "omit" });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
      } finally { clearTimeout(t); }
      return { ref, simulated: false };
    }
    await new Promise((r) => setTimeout(r, reduced() ? 200 : 900));
    doc.dispatchEvent(new CustomEvent("solara:submit", { detail: full }));
    return { ref, simulated: true };
  }

  function busy(btn, on, text = "Sending…") {
    if (!btn) return;
    if (on) { btn.dataset.label = btn.innerHTML; btn.innerHTML = `<span class="spinner" aria-hidden="true"></span>${text}`; btn.disabled = true; btn.setAttribute("aria-busy", "true"); }
    else { btn.innerHTML = btn.dataset.label || btn.innerHTML; btn.disabled = false; btn.removeAttribute("aria-busy"); }
  }

  /* ---------- steppers (number with − / + buttons) ---------- */
  function steppers(scope = doc) {
    $$("[data-stepper]", scope).forEach((wrap) => {
      const input = $("input", wrap);
      const [dec, inc] = $$("button", wrap);
      const clamp = (n) => Math.min(Number(input.max), Math.max(Number(input.min), n));
      const paint = () => { const n = Number(input.value); dec.disabled = n <= Number(input.min); inc.disabled = n >= Number(input.max); };
      const set = (n) => { input.value = clamp(n); paint(); input.dispatchEvent(new Event("change", { bubbles: true })); };
      dec.addEventListener("click", () => set(Number(input.value) - 1));
      inc.addEventListener("click", () => set(Number(input.value) + 1));
      input.addEventListener("change", () => { if (String(clamp(Number(input.value) || 0)) !== input.value) input.value = clamp(Number(input.value) || 0); paint(); });
      paint();
    });
  }

  /* ---------- gallery + lightbox ---------- */
  const icon = {
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    full: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>'
  };

  function swipe(el, { onDrag, onEnd }) {
    let x0 = null, y0 = 0, dx = 0, locked = null, id = null;
    el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest("button:not(.gal__open)")) return;
      x0 = e.clientX; y0 = e.clientY; dx = 0; locked = null; id = e.pointerId;
    });
    el.addEventListener("pointermove", (e) => {
      if (x0 === null || e.pointerId !== id) return;
      dx = e.clientX - x0;
      const dy = e.clientY - y0;
      if (locked === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        locked = Math.abs(dx) > Math.abs(dy);
        if (locked) { try { el.setPointerCapture(id); } catch { /* ignore */ } el.classList.add("is-dragging"); }
      }
      if (locked) onDrag(dx);
    });
    const end = (e) => {
      if (x0 === null || (e && e.pointerId !== id)) return;
      if (locked) { el.classList.remove("is-dragging"); onEnd(dx); if (Math.abs(dx) > 6) el.dataset.dragged = "1"; }
      x0 = null;
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("click", (e) => { if (el.dataset.dragged) { e.preventDefault(); e.stopPropagation(); delete el.dataset.dragged; } }, true);
  }

  let lightboxEl = null;
  function lightbox(images, start, { title = "", onClose } = {}) {
    if (!lightboxEl) {
      lightboxEl = doc.createElement("dialog");
      lightboxEl.className = "lightbox";
      lightboxEl.innerHTML = `<div class="lightbox__top"><p class="lightbox__count" aria-live="polite"></p><button type="button" class="lightbox__close" aria-label="Close full-screen gallery">${icon.close}</button></div>
        <div class="lightbox__stage"><div class="lightbox__track"></div></div>
        <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous photograph">${icon.prev}</button>
        <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next photograph">${icon.next}</button>
        <p class="lightbox__caption"></p>`;
      body.appendChild(lightboxEl);
    }
    const lb = lightboxEl;
    const rail = $(".lightbox__track", lb);
    lb.setAttribute("aria-label", `${title} — full-screen gallery`);
    rail.innerHTML = images.map((im, i) => `<figure class="lightbox__slide" aria-hidden="${i !== start}">${img(im.src, { sizes: "100vw", alt: im.alt })}</figure>`).join("");
    let i = start;
    const go = (n, animate = true) => {
      i = (n + images.length) % images.length;
      rail.style.transition = animate && !reduced() ? "" : "none";
      rail.style.transform = `translate3d(${-i * 100}%,0,0)`;
      $$(".lightbox__slide", rail).forEach((s, k) => { s.setAttribute("aria-hidden", String(k !== i)); if (Math.abs(k - i) <= 1) { const im = $("img", s); im && (im.loading = "eager"); } });
      $(".lightbox__count", lb).textContent = `${pad(i + 1)} / ${pad(images.length)}`;
      $(".lightbox__caption", lb).textContent = images[i].alt;
    };
    const prev = () => go(i - 1), next = () => go(i + 1);
    const keys = (e) => { if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); };
    const close = () => lb.close();
    $(".lightbox__nav--prev", lb).onclick = prev;
    $(".lightbox__nav--next", lb).onclick = next;
    $(".lightbox__close", lb).onclick = close;
    lb.onkeydown = keys;
    const stage = $(".lightbox__stage", lb);
    if (!stage.dataset.swipe) {
      stage.dataset.swipe = "1";
      swipe(stage, {
        onDrag: (dx) => { rail.style.transition = "none"; rail.style.transform = `translate3d(calc(${-lb._api.i() * 100}% + ${dx}px),0,0)`; },
        onEnd: (dx) => { const s = lb._api; if (Math.abs(dx) > 60) (dx < 0 ? s.next : s.prev)(); else s.go(s.i()); }
      });
    }
    lb._api = { next, prev, go: (n) => go(n), i: () => i };
    lb.onclose = () => { doc.documentElement.classList.remove("is-locked"); onClose && onClose(i); };
    doc.documentElement.classList.add("is-locked");
    lb.showModal();
    go(start, false);
    $(".lightbox__close", lb).focus();
    track("lightbox_open", { title });
  }

  function gallery(el, images, { title = "", eager = true, sizes = "(min-width: 1100px) 70vw, 100vw" } = {}) {
    const n = images.length;
    el.classList.add("gal");
    el.innerHTML = `<div class="gal__stage" tabindex="0" role="region" aria-roledescription="carousel" aria-label="${esc(title)} photographs. Use the arrow keys to browse.">
        <div class="gal__track">${images.map((im, i) => `<figure class="gal__slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${n}">
          <button type="button" class="gal__open" aria-label="Open photograph ${i + 1} full screen: ${esc(im.alt)}">${img(im.src, { sizes, alt: im.alt, eager: eager && i === 0 })}</button></figure>`).join("")}</div>
        <button type="button" class="gal__nav gal__nav--prev" aria-label="Previous photograph">${icon.prev}</button>
        <button type="button" class="gal__nav gal__nav--next" aria-label="Next photograph">${icon.next}</button>
        <div class="gal__hud"><p class="gal__count" aria-live="polite"></p><button type="button" class="gal__full">${icon.full}<span>Full screen</span></button></div>
      </div>
      <div class="gal__thumbs" role="group" aria-label="Choose a photograph">${images.map((im, i) => `<button type="button" class="gal__thumb" aria-label="Show photograph ${i + 1}">${img(im.src, { sizes: "160px", alt: "" })}</button>`).join("")}</div>`;
    const stage = $(".gal__stage", el), track = $(".gal__track", el);
    const thumbs = $$(".gal__thumb", el);
    let i = 0;
    const go = (k, animate = true) => {
      i = (k + n) % n;
      track.style.transition = animate && !reduced() ? "" : "none";
      track.style.transform = `translate3d(${-i * 100}%,0,0)`;
      $$(".gal__slide", el).forEach((s, j) => {
        s.setAttribute("aria-hidden", String(j !== i));
        $("button", s).tabIndex = j === i ? 0 : -1;
        if (Math.abs(j - i) <= 1 || (i === 0 && j === n - 1)) { const im = $("img", s); if (im && im.loading === "lazy") im.loading = "eager"; }
      });
      thumbs.forEach((t, j) => t.setAttribute("aria-current", String(j === i)));
      const active = thumbs[i];
      if (active && active.parentElement.scrollWidth > active.parentElement.clientWidth) {
        const p = active.parentElement;
        p.scrollTo({ left: active.offsetLeft - p.clientWidth / 2 + active.clientWidth / 2, behavior: reduced() ? "auto" : "smooth" });
      }
      $(".gal__count", el).textContent = `${pad(i + 1)} / ${pad(n)}`;
    };
    $(".gal__nav--prev", el).addEventListener("click", () => go(i - 1));
    $(".gal__nav--next", el).addEventListener("click", () => go(i + 1));
    thumbs.forEach((t, j) => t.addEventListener("click", () => go(j)));
    stage.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
      if (e.key === "Home") { e.preventDefault(); go(0); }
      if (e.key === "End") { e.preventDefault(); go(n - 1); }
    });
    const open = (from) => lightbox(images, i, { title, onClose: (k) => { go(k, false); from && from.focus(); } });
    $$(".gal__open", el).forEach((b) => b.addEventListener("click", () => open(b)));
    $(".gal__full", el).addEventListener("click", (e) => open(e.currentTarget));
    swipe(stage, {
      onDrag: (dx) => { track.style.transition = "none"; track.style.transform = `translate3d(calc(${-i * 100}% + ${dx}px),0,0)`; },
      onEnd: (dx) => { if (Math.abs(dx) > 50) go(dx < 0 ? i + 1 : i - 1); else go(i); }
    });
    go(0, false);
    return { go, index: () => i };
  }

  /* ---------- toggle-button groups (chips) ---------- */
  function chipGroup(groupEl, onChange, { multi = false } = {}) {
    const chips = $$("button[data-value]", groupEl);
    chips.forEach((b) => b.addEventListener("click", () => {
      if (multi) b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
      else chips.forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
      onChange(multi ? chips.filter((c) => c.getAttribute("aria-pressed") === "true").map((c) => c.dataset.value) : b.dataset.value);
    }));
    return { set(v) { chips.forEach((c) => c.setAttribute("aria-pressed", String(multi ? v.includes(c.dataset.value) : c.dataset.value === v))); } };
  }

  /* ---------- init ---------- */
  window.SOLARA = {
    release: "BF-SOLARA-PV-M1@1.1.0",
    config: C, data: D, base, params, reduced, $, $$, esc, pad,
    villa, dest, exp, villaUrl, price, img, villaCard, track, store,
    validate, setError, fieldMessage, liveValidation, submit, busy, steppers, gallery, lightbox, chipGroup, reveals, reference
  };

  bindConfig();
  desktopHeroReveal();
  savedStayClear();
  backToTop();
  header();
  navGroups();
  heroMotion();
  parallax();
  paintItineraryCount();
  steppers();
  doc.addEventListener("DOMContentLoaded", () => reveals());
  if (doc.readyState !== "loading") reveals();
})();
