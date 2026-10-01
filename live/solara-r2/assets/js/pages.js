/*!
 * BRIOFRAME · SOLARA Private Villas Master · BF-SOLARA-PV-M1 · v1.1.0
 * Original publisher: BRIOFRAME. Page behaviours, selected by <body data-page="…">.
 */
(() => {
  "use strict";
  const S = window.SOLARA;
  if (!S) return;
  const { $, $$, esc, data: D, base, params, img, price, pad } = S;
  const doc = document;
  const locale = (S.config.currency && S.config.currency.locale) || "en-GB";
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  /* ---------- date helpers ---------- */
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (s) => (s ? new Date(`${s}T00:00:00`) : null);
  const todayISO = () => iso(new Date());
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const nights = (a, b) => (a && b ? Math.round((parse(b) - parse(a)) / 86400000) : 0);
  const fmtDate = (s) => parse(s).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
  const validISO = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || "") && !Number.isNaN(parse(s).getTime());
  const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

  function monthRanges(list) {
    const set = new Set(list);
    if (set.size === 12) return "All year";
    const start = [...set].filter((m) => !set.has(m === 1 ? 12 : m - 1)).sort((a, b) => a - b);
    return start.map((s) => {
      let e = s;
      while (set.has(e === 12 ? 1 : e + 1) && (e === 12 ? 1 : e + 1) !== s) e = e === 12 ? 1 : e + 1;
      return s === e ? MONTHS[s - 1] : `${MONTHS[s - 1]} – ${MONTHS[e - 1]}`;
    }).join(", ");
  }
  const seasonOf = (d, m) => (d.bestMonths.includes(m) ? "best" : d.shoulderMonths.includes(m) ? "shoulder" : "off");
  const seasonLabel = { best: "Best season", shoulder: "Shoulder season", off: "Out of season" };
  const villasIn = (destId) => D.villas.filter((v) => v.destination === destId);

  function setMeta(title, description) {
    doc.title = title;
    const m = $('meta[name="description"]');
    if (m && description) m.setAttribute("content", description);
  }

  function lockScroll(on) { doc.documentElement.classList.toggle("is-locked", on); }

  /* In-page navigation highlight: the last target whose top has passed the reading line. */
  function scrollSpy(links, ratio = 0.35) {
    const targets = links.map((a) => doc.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * ratio;
      let current = null;
      targets.forEach((t) => { if (t.getBoundingClientRect().top <= line) current = t; });
      links.forEach((a) => {
        if (current && a.hash === `#${current.id}`) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };
    window.addEventListener("scroll", () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ======================================================================
     HOME — featured villas, destination explorer, testimonials
     ====================================================================== */
  function home() {
    const featured = D.villas.filter((v) => v.featured).slice(0, 3);
    const fw = $("[data-featured]");
    if (fw) {
      const avoid = $$("[data-photo]").map((el) => el.dataset.photo);
      fw.innerHTML = featured.map((v, i) => S.villaCard(v, {
        avoid,
        variant: i === 0 ? "feature" : "",
        summary: i === 0,
        sizes: i === 0 ? "(min-width: 1000px) 58vw, 100vw" : "(min-width: 1000px) 38vw, 100vw"
      })).join("");
      fw.querySelectorAll(".vcard").forEach((c) => c.setAttribute("data-reveal", ""));
    }

    const list = $("[data-dest-list]"), media = $("[data-dest-media]");
    if (list && media) {
      list.innerHTML = D.destinations.map((d, i) => `<li>
        <a href="destinations/index.html#${d.id}" data-i="${i}">
          <span class="dest-list__thumb">${img(d.image, { sizes: "96px", alt: "" })}</span>
          <span class="dest-list__num">${pad(i + 1)}</span>
          <span class="dest-list__name">${esc(d.name)}</span>
          <span class="dest-list__meta">${esc(d.country)} · ${plural(villasIn(d.id).length, "villa")}</span>
        </a></li>`).join("");
      media.innerHTML = D.destinations.map((d, i) => `<figure class="dest-explorer__img${i === 0 ? " is-active" : ""}" data-i="${i}">
          ${img(d.image, { sizes: "(min-width: 900px) 50vw, 100vw", alt: "" })}
          <figcaption><span class="eyebrow eyebrow--light">${esc(d.country)}</span>${esc(d.line)}</figcaption></figure>`).join("");
      const activate = (i) => {
        $$(".dest-explorer__img", media).forEach((f) => f.classList.toggle("is-active", f.dataset.i === String(i)));
        $$("a", list).forEach((a) => a.classList.toggle("is-active", a.dataset.i === String(i)));
      };
      $$("a", list).forEach((a) => {
        a.addEventListener("mouseenter", () => activate(a.dataset.i));
        a.addEventListener("focus", () => activate(a.dataset.i));
      });
      activate(0);
    }

    const q = $("[data-quotes]");
    if (q && D.testimonials.length) {
      const stage = $(".quotes__stage", q), count = $("[data-quote-count]", q);
      let i = 0;
      const show = (k) => {
        i = (k + D.testimonials.length) % D.testimonials.length;
        const t = D.testimonials[i];
        stage.classList.remove("is-in");
        stage.innerHTML = `<blockquote class="quote"><p>“${esc(t.quote)}”</p><footer><cite>${esc(t.name)}</cite><span>${esc(t.stay)}</span></footer></blockquote>`;
        requestAnimationFrame(() => stage.classList.add("is-in"));
        count.textContent = `${pad(i + 1)} / ${pad(D.testimonials.length)}`;
      };
      $("[data-quote-prev]", q).addEventListener("click", () => show(i - 1));
      $("[data-quote-next]", q).addEventListener("click", () => show(i + 1));
      show(0);
    }
  }

  /* ======================================================================
     VILLAS — filterable collection with URL state
     ====================================================================== */
  function villas() {
    const form = $("[data-filters]");
    const results = $("[data-results]"), empty = $("[data-empty]");
    const defaults = { dest: "", guests: 0, beds: 0, type: "", max: 6500, am: [], sort: "featured", view: "grid", month: 0 };
    const num = (v, d = 0) => { const n = parseInt(v, 10); return Number.isFinite(n) ? n : d; };
    const destIds = D.destinations.map((d) => d.id);
    const types = [...new Set(D.villas.map((v) => v.type))];
    const usedAm = Object.keys(D.amenities).filter((k) => D.villas.some((v) => v.tags.includes(k)));
    const state = {
      dest: destIds.includes(params.get("dest")) ? params.get("dest") : "",
      guests: Math.max(0, num(params.get("guests"))),
      beds: Math.max(0, num(params.get("beds"))),
      type: types.includes(params.get("type")) ? params.get("type") : "",
      max: Math.min(6500, Math.max(1500, num(params.get("max"), 6500))),
      am: (params.get("am") || "").split(",").filter((a) => usedAm.includes(a)),
      sort: ["featured", "price-asc", "price-desc", "beds-desc"].includes(params.get("sort")) ? params.get("sort") : "featured",
      view: params.get("view") === "list" ? "list" : "grid",
      month: Math.min(12, Math.max(0, num(params.get("month"))))
    };

    const destWrap = $("[data-filter-dest]");
    destWrap.innerHTML = `<button type="button" data-value="" aria-pressed="false">All destinations</button>` +
      D.destinations.map((d) => `<button type="button" data-value="${d.id}" aria-pressed="false">${esc(d.name)}</button>`).join("");
    const destChips = S.chipGroup(destWrap, (v) => { state.dest = v; update(); });

    $("#fl-type").insertAdjacentHTML("beforeend", types.map((t) => `<option value="${esc(t)}">${esc(t)}</option>`).join(""));
    $("[data-filter-amen]").innerHTML = usedAm.map((k) => `<label class="check"><input type="checkbox" name="am" value="${k}"><span>${esc(D.amenities[k])}</span></label>`).join("");
    const guestsSel = $("#fl-guests");
    if (state.guests && ![...guestsSel.options].some((o) => o.value === String(state.guests))) guestsSel.insertAdjacentHTML("beforeend", `<option value="${state.guests}">${state.guests} or more</option>`);
    const range = $("#fl-max"), out = $("[data-max-out]");

    const syncControls = () => {
      destChips.set(state.dest);
      guestsSel.value = state.guests ? String(state.guests) : "";
      $("#fl-beds").value = state.beds ? String(state.beds) : "";
      $("#fl-type").value = state.type;
      range.value = state.max;
      $$('input[name="am"]', form).forEach((c) => { c.checked = state.am.includes(c.value); });
      $("[data-sort]").value = state.sort;
      $$("[data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === state.view)));
    };

    const match = (v) => (!state.dest || v.destination === state.dest) && v.guests >= state.guests && v.bedrooms >= state.beds &&
      (!state.type || v.type === state.type) && v.priceFrom <= state.max && state.am.every((a) => v.tags.includes(a));
    const sorters = {
      featured: (a, b) => (b.featured - a.featured) || (a.priceFrom - b.priceFrom),
      "price-asc": (a, b) => a.priceFrom - b.priceFrom,
      "price-desc": (a, b) => b.priceFrom - a.priceFrom,
      "beds-desc": (a, b) => b.bedrooms - a.bedrooms
    };

    const pills = () => {
      const p = [];
      if (state.dest) p.push(["dest", S.dest(state.dest).name]);
      if (state.guests) p.push(["guests", `${state.guests}+ guests`]);
      if (state.beds) p.push(["beds", `${state.beds}+ bedrooms`]);
      if (state.type) p.push(["type", state.type]);
      if (state.max < 6500) p.push(["max", `Up to ${price(state.max)}`]);
      state.am.forEach((a) => p.push([`am:${a}`, D.amenities[a]]));
      if (state.month) p.push(["month", `Travelling in ${MONTHS[state.month - 1]}`]);
      return p;
    };

    function writeUrl() {
      const q = new URLSearchParams();
      Object.entries(state).forEach(([k, v]) => {
        const d = defaults[k];
        if (Array.isArray(v) ? v.length : v !== d) q.set(k, Array.isArray(v) ? v.join(",") : v);
      });
      const qs = q.toString();
      history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    }

    function update() {
      const list = D.villas.filter(match).sort(sorters[state.sort]);
      results.classList.toggle("villa-grid--list", state.view === "list");
      results.innerHTML = list.map((v) => {
        const d = S.dest(v.destination);
        const note = state.month ? (seasonOf(d, state.month) === "best" ? `Best season in ${MONTHS[state.month - 1]}` : "") : "";
        return S.villaCard(v, { variant: state.view === "list" ? "row" : "", summary: state.view === "list", note,
          sizes: state.view === "list" ? "(min-width: 1100px) 34vw, 100vw" : "(min-width: 1400px) 30vw, (min-width: 700px) 45vw, 100vw" });
      }).join("");
      empty.hidden = list.length > 0;
      const total = D.villas.length;
      $("[data-results-count]").textContent = list.length === total ? `${plural(total, "villa")}` : `${list.length} of ${plural(total, "villa")}`;
      $$("[data-result-n]").forEach((el) => { el.textContent = list.length; });
      $("[data-filter-apply]").lastChild.textContent = ` villa${list.length === 1 ? "" : "s"}`;
      out.textContent = state.max >= 6500 ? "Any" : price(state.max);
      const p = pills();
      $("[data-active-filters]").innerHTML = p.map(([k, label]) => `<button type="button" class="pill" data-remove="${esc(k)}" aria-label="Remove filter: ${esc(label)}">${esc(label)}<span aria-hidden="true">×</span></button>`).join("") +
        (p.length > 1 ? `<button type="button" class="text-btn" data-filter-reset>Clear all</button>` : "");
      const n = p.filter(([k]) => k !== "dest" && k !== "month").length;
      const badge = $("[data-filter-n]");
      badge.textContent = n; badge.hidden = n === 0;
      writeUrl();
      S.track("villa_filter", { results: list.length });
    }

    form.addEventListener("submit", (e) => e.preventDefault());
    form.addEventListener("change", (e) => {
      const t = e.target;
      if (t.id === "fl-guests") state.guests = num(t.value);
      if (t.id === "fl-beds") state.beds = num(t.value);
      if (t.id === "fl-type") state.type = t.value;
      if (t.name === "am") state.am = $$('input[name="am"]:checked', form).map((c) => c.value);
      update();
    });
    range.addEventListener("input", () => { state.max = num(range.value, 6500); update(); });
    $("[data-sort]").addEventListener("change", (e) => { state.sort = e.target.value; update(); });
    $$("[data-view]").forEach((b) => b.addEventListener("click", () => { state.view = b.dataset.view; syncControls(); update(); }));

    const reset = () => { Object.assign(state, { ...defaults, am: [] }); syncControls(); update(); };
    doc.addEventListener("click", (e) => {
      if (e.target.closest("[data-filter-reset]")) reset();
      const pill = e.target.closest("[data-remove]");
      if (pill) {
        const k = pill.dataset.remove;
        if (k.startsWith("am:")) state.am = state.am.filter((a) => a !== k.slice(3));
        else state[k] = defaults[k];
        syncControls(); update();
        const next = $("[data-active-filters] .pill");
        if (next) next.focus();
        else { const c = $("[data-results-count]"); c.tabIndex = -1; c.focus(); }
      }
    });

    // Mobile filter sheet
    const panel = $("[data-filter-panel]"), openBtn = $("[data-filter-open]");
    const mq = window.matchMedia("(max-width: 1099px)");
    const setSheet = (open) => {
      panel.classList.toggle("is-open", open);
      openBtn.setAttribute("aria-expanded", String(open));
      lockScroll(open);
      if (open) { panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); panel.setAttribute("aria-label", "Filters"); $("select, input", panel).focus(); }
      else { panel.removeAttribute("role"); panel.removeAttribute("aria-modal"); openBtn.focus(); }
    };
    openBtn.addEventListener("click", () => setSheet(true));
    $("[data-filter-close]").addEventListener("click", () => setSheet(false));
    $("[data-filter-apply]").addEventListener("click", () => setSheet(false));
    panel.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("is-open")) setSheet(false); });
    form.addEventListener("click", (e) => { if (e.target === form && panel.classList.contains("is-open")) setSheet(false); });
    mq.addEventListener("change", (e) => { if (!e.matches && panel.classList.contains("is-open")) setSheet(false); });

    syncControls();
    update();
  }

  /* ======================================================================
     VILLA DETAIL — gallery, specifications, inquiry, related villas
     ====================================================================== */
  function villa() {
    const id = params.get("id") || D.villas[0].id;
    const v = S.villa(id);
    if (!v) {
      $("[data-villa-missing]").hidden = false;
      ["[data-villa-root]", ".villa-gallery", "[data-related-wrap]", "[data-mobile-book]", ".villa-top .text-link"].forEach((s) => { const el = $(s); el && (el.hidden = true); });
      $$('[data-v="name"]').forEach((el) => { el.textContent = "Villa not found"; });
      setMeta("Villa not found — SOLARA Private Villas");
      return;
    }
    const d = S.dest(v.destination);
    setMeta(`${v.name} — ${v.area}, ${d.name} | SOLARA Private Villas`, v.summary);
    const set = (key, html) => $$(`[data-v="${key}"]`).forEach((el) => { el.innerHTML = html; });
    set("name", esc(v.name));
    set("where", `${esc(v.area)} · ${esc(d.name)}, ${esc(d.country)}`);
    set("summary", esc(v.summary));
    set("price", price(v.priceFrom));
    set("min", `Minimum stay ${v.minNights} nights`);
    set("specs", [[v.bedrooms, "Bedrooms"], [v.baths, "Bathrooms"], [v.guests, "Guests"], [`${v.size.toLocaleString(locale)} m²`, "Interior"], [esc(v.type), "Property"]]
      .map(([val, k]) => `<li><span class="specs__v">${val}</span><span class="specs__k">${k}</span></li>`).join(""));
    set("description", v.description.map((p) => `<p>${esc(p)}</p>`).join(""));
    set("highlights", v.highlights.map((h) => `<li>${esc(h)}</li>`).join(""));
    // Photograph placement: headline gallery first, then spaces and suites. `used` guarantees
    // no photograph appears twice on the page, whatever the data says.
    const used = new Set();
    const altOf = (slug) => (v.images.find((p) => p.src === slug) || {}).alt || "";
    const take = (slug) => { if (!slug || used.has(slug) || !S.img(slug)) return ""; used.add(slug); return slug; };
    const heroImages = v.images.filter((p) => p.hero);
    const galleryImages = (heroImages.length ? heroImages : v.images).filter((p) => take(p.src));
    const openAt = (slug, from) => S.lightbox(v.images, Math.max(0, v.images.findIndex((p) => p.src === slug)), { title: v.name, onClose: () => from && from.focus() });

    const spaceTypes = D.spaceTypes || {};
    const spaces = v.spaces || [];
    set("spaces", spaces.map((sp) => {
      const slug = take(sp.image);
      const label = spaceTypes[sp.type] || sp.type;
      const media = slug ? `<figure class="space__media"><button type="button" class="space__open" data-open-photo="${esc(slug)}" aria-label="Open photograph full screen: ${esc(altOf(slug))}">${img(slug, { sizes: "(min-width: 1100px) 26vw, (min-width: 700px) 45vw, 100vw", alt: altOf(slug) })}</button><figcaption class="photo-tag">At the villa</figcaption></figure>` : "";
      return `<article class="space${slug ? "" : " space--text"}" data-space="${esc(sp.type)}" data-reveal>${media}
        <div class="space__body"><p class="eyebrow">${esc(label)}</p><h3 class="space__title">${esc(sp.title)}</h3><p>${esc(sp.text)}</p></div></article>`;
    }).join(""));
    const filterEl = $("[data-space-filter]");
    const present = [...new Set(spaces.map((sp) => sp.type))];
    if (filterEl && present.length > 2) {
      filterEl.innerHTML = `<button type="button" data-value="" aria-pressed="true">All spaces</button>` +
        present.map((t) => `<button type="button" data-value="${esc(t)}" aria-pressed="false">${esc(spaceTypes[t] || t)}</button>`).join("");
      S.chipGroup(filterEl, (t) => {
        $$(".space", $('[data-v="spaces"]')).forEach((el) => { el.hidden = !!t && el.dataset.space !== t; el.classList.add("is-in"); });
        S.track("space_filter", { villa: v.id, type: t || "all" });
      });
    } else if (filterEl) filterEl.hidden = true;
    const allBtn = $("[data-all-photos]");
    if (allBtn) {
      allBtn.textContent = `All ${v.images.length} photographs`;
      allBtn.addEventListener("click", () => openAt(v.images[0].src, allBtn));
    }
    $('[data-v="spaces"]').addEventListener("click", (e) => { const b = e.target.closest("[data-open-photo]"); if (b) openAt(b.dataset.openPhoto, b); });

    if (v.suites && v.suites.length) {
      set("rooms", v.suites.map((s, i) => {
        const slug = take(s.image);
        const facts = [["Bed", s.bed], ["Bathroom", s.ensuite], ["View", s.view], ["Outdoor", s.outdoor], ["Sleeps", s.sleeps ? `${s.sleeps}${s.count > 1 ? " per room" : ""}` : ""]].filter(([, val]) => val);
        return `<article class="suite${slug ? "" : " suite--pending"}" data-reveal>
          ${slug ? `<div class="suite__media">${img(slug, { sizes: "(min-width: 1100px) 22vw, (min-width: 700px) 40vw, 100vw", alt: altOf(slug) })}</div>`
            : `<div class="suite__media suite__media--pending"><p>Suite photograph<br>supplied by the owner</p></div>`}
          <div class="suite__body">
            <p class="eyebrow">${pad(i + 1)}${s.count > 1 ? ` · ${s.count} rooms` : ""}</p>
            <h3 class="suite__title">${esc(s.name)}</h3>
            ${s.detail ? `<p class="suite__detail">${esc(s.detail)}</p>` : ""}
            <dl class="suite__facts">${facts.map(([k, val]) => `<div><dt>${k}</dt><dd>${esc(val)}</dd></div>`).join("")}</dl>
          </div></article>`;
      }).join(""));
    } else {
      set("rooms", `<ul class="rooms">${(v.rooms || []).map((r, i) => `<li><span class="rooms__num">${pad(i + 1)}</span><div><h3>${esc(r.name)}</h3><p>${esc(r.detail)}</p></div></li>`).join("")}</ul>`);
    }

    const fp = v.floorPlan;
    const layoutEl = $('[data-v="layout"]');
    if (fp && fp.image && S.img(fp.image)) {
      layoutEl.innerHTML = `<div class="plan-hook__head"><h3 class="plan-hook__title">Floor plan</h3></div><figure class="plan-hook__figure">${img(fp.image, { sizes: "(min-width: 1100px) 50vw, 100vw", alt: `${v.name} floor plan` })}</figure>`;
    } else if (fp && fp.levels) {
      layoutEl.innerHTML = `<div class="plan-hook__head"><h3 class="plan-hook__title">How the house fits together</h3><p class="plan-hook__label">Illustrative layout · not to scale</p></div>
        <ol class="plan-levels">${fp.levels.map((l) => `<li><p class="plan-levels__name">${esc(l.name)}</p><ul>${l.spaces.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></li>`).join("")}</ol>
        <p class="plan-hook__note">This schematic shows how the spaces relate to one another. It is not a measured floor plan and shows no dimensions; your planner can share a verified plan on request.</p>`;
    } else layoutEl.hidden = true;

    const wl = v.wellness || { facilities: [] };
    const wf = D.wellnessFacilities || {};
    const wServices = (D.wellnessServices || []).filter((s) => s.where.includes(v.destination)).slice(0, 4);
    set("wellness", `<div class="villa-wellness__grid">
        <div>
          ${wl.text ? `<p class="villa-wellness__text">${esc(wl.text)}</p>` : ""}
          <ul class="facility-list">${wl.facilities.map((f) => `<li>${esc(wf[f] || f)}</li>`).join("")}</ul>
        </div>
        <div class="villa-wellness__menu">
          <p class="eyebrow">Available in ${esc(d.name)}</p>
          <ul>${wServices.map((s) => `<li><span>${esc(s.name)}</span><span>${esc(s.duration)}</span></li>`).join("")}</ul>
        </div>
      </div>
      <div class="cta-row"><a class="btn btn--line" href="${base}concierge/index.html?service=wellness&amp;villa=${encodeURIComponent(v.id)}">Book a treatment</a><a class="text-link" href="${base}wellness/index.html">Wellness &amp; spa</a></div>`);

    const ev = v.events;
    const evTypes = D.eventTypes || [];
    if (ev && ev.mode === "hosted") {
      set("events", `<dl class="event-facts">
          <div><dt>Seated dinner</dt><dd>Up to ${ev.seated}</dd></div>
          <div><dt>Standing reception</dt><dd>Up to ${ev.standing}</dd></div>
          <div><dt>Ceremony</dt><dd>${esc(ev.ceremony)}</dd></div>
          <div><dt>Reception</dt><dd>${esc(ev.reception)}</dd></div>
        </dl>
        <ul class="tag-list" aria-label="Events considered">${evTypes.filter((t) => ev.types.includes(t.id)).map((t) => `<li>${esc(t.name)}</li>`).join("")}</ul>
        ${ev.notes ? `<p class="villa-note">${esc(ev.notes)}</p>` : ""}
        <div class="cta-row"><a class="btn btn--dark" href="${base}weddings/index.html?villa=${encodeURIComponent(v.id)}#enquire">Plan an event here</a><a class="text-link" href="${base}weddings/index.html">Weddings &amp; events</a></div>`);
    } else {
      set("events", `<p class="villa-events__lede">Celebrations for your own party of up to ${ev ? ev.seated : v.guests} guests — anniversaries, proposals and birthday dinners.</p>
        ${ev && ev.notes ? `<p class="villa-note">${esc(ev.notes)}</p>` : ""}
        <div class="cta-row"><a class="btn btn--line" href="${base}concierge/index.html?service=celebration&amp;villa=${encodeURIComponent(v.id)}">Arrange a celebration</a><a class="text-link" href="${base}weddings/index.html#venues">Villas that host weddings</a></div>`);
    }

    set("around-label", `Around ${esc(d.name)}`);
    const around = (d.around || []).filter((a) => !used.has(a.src)).slice(0, 3);
    set("around", `${around.length ? `<div class="around__grid around__grid--${around.length}">${around.map((a) => `<figure class="around__item" data-reveal>
        <div class="around__media">${img(a.src, { sizes: "(min-width: 1100px) 22vw, (min-width: 700px) 33vw, 100vw", alt: a.alt })}<span class="photo-tag photo-tag--dark">Around ${esc(d.name)}</span></div>
        <figcaption>${esc(a.place)}</figcaption></figure>`).join("")}</div>` : ""}
      <ol class="around__highlights">${d.highlights.map((h, k) => `<li><span class="chapter__hnum">${pad(k + 1)}</span><h3>${esc(h.title)}</h3><p>${esc(h.text)}</p></li>`).join("")}</ol>
      <a class="text-link" href="${base}destinations/index.html#${d.id}">More about ${esc(d.name)}</a>`);

    set("amenities", Object.entries(v.amenities).map(([g, items]) => `<div class="amenity-group"><h3>${esc(g)}</h3><ul>${items.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></div>`).join(""));
    const [lat, lon] = v.coords;
    const coordText = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? "E" : "W"}`;
    set("location", `<div class="locator__map" aria-hidden="true"><svg viewBox="0 0 320 320">
        <circle cx="160" cy="160" r="150" class="ring"/><circle cx="160" cy="160" r="105" class="ring"/><circle cx="160" cy="160" r="60" class="ring"/>
        <path d="M160 6v48M160 266v48M6 160h48M266 160h48" class="tick"/>
        <text x="160" y="30" class="compass">N</text>
        <circle cx="160" cy="160" r="9" class="pin"/><circle cx="160" cy="160" r="22" class="pin-halo"/>
      </svg><p class="locator__coords">${coordText}</p></div>
      <div class="locator__info">
        <p class="eyebrow">${esc(v.area)} · ${esc(d.name)}</p>
        <p>This is an indicative location. The exact address and arrival directions are shared when your stay is confirmed.</p>
        <dl class="distances">${v.distances.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join("")}</dl>
        <p class="locator__access"><strong>Getting there</strong> ${esc(d.access)}</p>
        <a class="text-link" href="https://www.openstreetmap.org/?mlat=${lat}&amp;mlon=${lon}#map=11/${lat}/${lon}" target="_blank" rel="noopener noreferrer">View the area on OpenStreetMap<span class="sr-only"> (opens in a new tab)</span></a>
      </div>`);
    const pol = v.policies;
    set("policies", [["Check-in", pol.checkin], ["Check-out", pol.checkout], ["Minimum stay", `${v.minNights} nights`], ["Security deposit", pol.deposit], ["Cancellation", pol.cancellation]]
      .map(([k, val]) => `<div><dt>${k}</dt><dd>${esc(val)}</dd></div>`).join(""));
    const cl = $('[data-v="concierge-link"]');
    if (cl) cl.href = `${base}concierge/index.html?villa=${encodeURIComponent(v.id)}`;

    S.gallery($("[data-gallery]"), galleryImages, { title: v.name, sizes: "(min-width: 1400px) 1320px, 100vw" });

    // Inquiry card
    const form = $("[data-inquiry]");
    const inEl = $("#iq-in"), outEl = $("#iq-out"), gSel = $("#iq-guests"), nightsEl = $("[data-nights]");
    gSel.innerHTML = Array.from({ length: v.guests }, (_, i) => `<option value="${i + 1}"${i + 1 === Math.min(2, v.guests) ? " selected" : ""}>${plural(i + 1, "guest")}</option>`).join("");
    inEl.min = todayISO();
    outEl.min = addDays(todayISO(), 1);
    const paintNights = () => {
      const n = nights(inEl.value, outEl.value);
      if (!n || n < 0) { nightsEl.textContent = ""; nightsEl.classList.remove("is-warn"); return; }
      const ok = n >= v.minNights;
      nightsEl.textContent = ok ? `${plural(n, "night")} · from ${price(v.priceFrom * n)} before extras` : `${plural(n, "night")} · the minimum stay here is ${v.minNights} nights`;
      nightsEl.classList.toggle("is-warn", !ok);
    };
    inEl.addEventListener("change", () => {
      if (validISO(inEl.value)) {
        outEl.min = addDays(inEl.value, 1);
        if (!outEl.value || nights(inEl.value, outEl.value) < 1) outEl.value = addDays(inEl.value, v.minNights);
      }
      paintNights();
    });
    outEl.addEventListener("change", paintNights);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!S.validate(form)) return;
      const n = nights(inEl.value, outEl.value);
      if (n < v.minNights) { S.setError(outEl, `The minimum stay at ${v.name} is ${v.minNights} nights.`); outEl.focus(); return; }
      const hooks = window.SOLARA_HOOKS || {};
      if (typeof hooks.availability === "function") {
        try {
          const r = await hooks.availability(v.id, inEl.value, outEl.value, Number(gSel.value));
          if (r && r.available === false) { S.setError(outEl, "Those dates aren't available. Try other dates or ask the concierge."); return; }
        } catch { /* fall through to enquiry */ }
      }
      S.track("availability_check", { villa: v.id, nights: n });
      const q = new URLSearchParams({ villa: v.id, in: inEl.value, out: outEl.value, adults: gSel.value });
      window.location.href = `${base}plan/index.html?${q}`;
    });

    // Related villas: same destination, then same type, then similar capacity and rate
    const score = (o) => (o.destination === v.destination ? 4 : 0) + (o.type === v.type ? 2 : 0) +
      (Math.abs(o.guests - v.guests) <= 2 ? 1 : 0) + (Math.abs(o.priceFrom - v.priceFrom) / v.priceFrom <= 0.3 ? 1 : 0);
    const related = D.villas.filter((o) => o.id !== v.id).sort((a, b) => score(b) - score(a) || b.featured - a.featured).slice(0, 3);
    $("[data-related]").innerHTML = related.map((o) => S.villaCard(o, {
      note: o.destination === v.destination ? `Also in ${d.name}` : "", sizes: "(min-width: 1000px) 30vw, (min-width: 700px) 45vw, 100vw"
    })).join("");

    // Section spy
    scrollSpy($$("[data-subnav] a"));

    // Mobile booking bar hides while the inquiry card is visible
    const bar = $("[data-mobile-book]");
    new IntersectionObserver(([en]) => bar.classList.toggle("is-hidden", en.isIntersecting), { threshold: 0.15 }).observe(form);
  }

  /* ======================================================================
     DESTINATIONS — region filter, season planner, chapters
     ====================================================================== */
  function destinations() {
    const mosaic = $("[data-mosaic]"), chapters = $("[data-chapters]"), index = $("[data-chapter-index]");
    mosaic.innerHTML = D.destinations.map((d, i) => `<a class="mosaic__tile mosaic__tile--${i + 1}" href="#${d.id}" data-region="${esc(d.region)}">
        ${img(d.image, { sizes: i === 0 ? "(min-width: 1000px) 34vw, 100vw" : "(min-width: 1000px) 17vw, 50vw", alt: "", eager: i < 2 })}
        <span class="mosaic__label"><span class="eyebrow eyebrow--light">${esc(d.country)}</span><span class="mosaic__name">${esc(d.name)}</span></span></a>`).join("");

    index.innerHTML = `<p class="eyebrow">Contents</p><ol>${D.destinations.map((d, i) => `<li data-region="${esc(d.region)}"><a href="#${d.id}"><span>${pad(i + 1)}</span>${esc(d.name)}</a></li>`).join("")}</ol>`;

    // The mosaic above shows each destination's cover image, so chapters draw only on `around`.
    chapters.innerHTML = D.destinations.map((d, i) => {
      const vs = villasIn(d.id);
      const [lead, ...rest] = (d.around || []).filter((a) => a.src !== d.image);
      const pics = rest.slice(0, 2);
      return `<article class="chapter" id="${d.id}" data-region="${esc(d.region)}" aria-labelledby="ch-${d.id}">
        ${lead ? `<figure class="chapter__media" data-reveal>${img(lead.src, { sizes: "(min-width: 1100px) 62vw, 100vw", alt: lead.alt })}<figcaption class="photo-tag photo-tag--dark">Around ${esc(d.name)} · ${esc(lead.place)}</figcaption></figure>` : ""}
        <header class="chapter__head">
          <p class="eyebrow">${pad(i + 1)} · ${esc(d.country)} · ${esc(d.region)}</p>
          <h2 id="ch-${d.id}" class="display-lg">${esc(d.name)}</h2>
          <p class="chapter__line">${esc(d.line)}</p>
        </header>
        <div class="chapter__body">
          <p class="chapter__intro">${esc(d.intro)}</p>
          <dl class="chapter__facts">
            <div><dt>Best months</dt><dd>${monthRanges(d.bestMonths)}</dd></div>
            <div><dt>Getting there</dt><dd>${esc(d.access)}</dd></div>
          </dl>
        </div>
        <ol class="chapter__highlights">${d.highlights.map((h, k) => `<li><span class="chapter__hnum">${pad(k + 1)}</span><h3>${esc(h.title)}</h3><p>${esc(h.text)}</p></li>`).join("")}</ol>
        ${pics.length ? `<div class="chapter__gallery chapter__gallery--${pics.length}">${pics.map((a) => `<figure>${img(a.src, { sizes: "(min-width: 1100px) 30vw, 50vw", alt: a.alt })}<figcaption class="photo-tag photo-tag--dark">${esc(a.place)}</figcaption></figure>`).join("")}</div>` : ""}
        <div class="chapter__villas">
          <p class="eyebrow">${vs.length === 1 ? "The villa" : `${vs.length} villas`} in ${esc(d.name)}</p>
          <div class="villa-grid villa-grid--mini">${vs.map((v) => S.villaCard(v, { variant: "mini", sizes: "(min-width: 1100px) 22vw, 50vw", tag: "h3" })).join("")}</div>
        </div>
      </article>`;
    }).join("");
    const applyRegion = (r) => {
      $$("[data-region]", mosaic).forEach((el) => el.classList.toggle("is-dim", !!r && el.dataset.region !== r));
      $$(".chapter", chapters).forEach((el) => { el.hidden = !!r && el.dataset.region !== r; });
      $$("li[data-region]", index).forEach((el) => { el.hidden = !!r && el.dataset.region !== r; });
    };
    S.chipGroup($("[data-region]"), applyRegion);

    const monthsEl = $("[data-months]"), seasonEl = $("[data-season]");
    let month = Math.min(12, Math.max(1, parseInt(params.get("month"), 10) || new Date().getMonth() + 1));
    monthsEl.innerHTML = MONTHS.map((m, i) => `<button type="button" data-value="${i + 1}" aria-pressed="${i + 1 === month}" aria-label="${m}">${m.slice(0, 3)}</button>`).join("");
    const paintSeason = () => {
      const order = { best: 0, shoulder: 1, off: 2 };
      seasonEl.innerHTML = D.destinations.map((d) => ({ d, s: seasonOf(d, month) })).sort((a, b) => order[a.s] - order[b.s])
        .map(({ d, s }) => `<li class="season__item season__item--${s}"><a href="#${d.id}"><span class="season__name">${esc(d.name)}</span><span class="season__country">${esc(d.country)}</span><span class="status status--${s}">${seasonLabel[s]}</span></a></li>`).join("");
    };
    S.chipGroup(monthsEl, (v) => { month = Number(v); paintSeason(); });
    paintSeason();

    scrollSpy($$("a", index));

    if (window.location.hash) {
      const t = doc.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      t && requestAnimationFrame(() => t.scrollIntoView());
    }
  }

  /* ======================================================================
     EXPERIENCES — category filter, add-to-stay, itinerary tray
     ====================================================================== */
  function experiences() {
    const cats = D.experienceCategories;
    const grid = $("[data-exp-grid]"), whereSel = $("[data-exp-where]");
    let cat = cats[params.get("cat")] ? params.get("cat") : "";
    let where = S.dest(params.get("where")) ? params.get("where") : "";
    const catWrap = $("[data-exp-cats]");
    catWrap.innerHTML = `<button type="button" data-value="" aria-pressed="false">All <span class="chip-n">${D.experiences.length}</span></button>` +
      Object.entries(cats).map(([k, label]) => `<button type="button" data-value="${k}" aria-pressed="false">${esc(label)} <span class="chip-n">${D.experiences.filter((e) => e.category === k).length}</span></button>`).join("");
    whereSel.insertAdjacentHTML("beforeend", D.destinations.map((d) => `<option value="${d.id}">${esc(d.name)}</option>`).join(""));
    whereSel.value = where;
    const chips = S.chipGroup(catWrap, (v) => { cat = v; render(); });
    chips.set(cat);
    whereSel.addEventListener("change", () => { where = whereSel.value; render(); });

    const addLabel = (on) => (on ? "In your stay" : "Add to my stay");
    function render() {
      const list = D.experiences.filter((e) => (!cat || e.category === cat) && (!where || e.where.includes(where)));
      grid.innerHTML = list.map((e) => {
        const on = S.store.has(e.id);
        return `<article class="xcard" data-exp="${e.id}">
          <div class="xcard__media">${img(e.image, { sizes: "(min-width: 1100px) 30vw, (min-width: 700px) 45vw, 100vw", alt: e.name })}</div>
          <div class="xcard__body">
            <p class="eyebrow">${esc(cats[e.category])} · ${esc(e.duration)}</p>
            <h3 class="xcard__title">${esc(e.name)}</h3>
            <p class="xcard__summary">${esc(e.summary)}</p>
            <p class="xcard__where"><span class="sr-only">Available in: </span>${e.where.map((w) => esc(S.dest(w).name)).join(" · ")}</p>
            <button type="button" class="add-btn" data-add-exp="${e.id}" aria-pressed="${on}" aria-label="Add ${esc(e.name)} to my stay"><span class="add-btn__icon" aria-hidden="true"></span><span class="add-btn__text">${addLabel(on)}</span></button>
          </div></article>`;
      }).join("") || `<p class="empty-inline">No experiences match — try another type or destination.</p>`;
      $("[data-exp-count]").textContent = `${plural(list.length, "experience")}${where ? ` available in ${S.dest(where).name}` : ""}`;
      const q = new URLSearchParams(); cat && q.set("cat", cat); where && q.set("where", where);
      history.replaceState(null, "", q.toString() ? `?${q}` : window.location.pathname);
    }

    const tray = $("[data-tray]"), trayList = $("[data-tray-list]"), trayToggle = $("[data-tray-toggle]");
    let trayCompactTimer = 0;
    const collapseTray = () => {
      if (!tray || tray.hidden) return;
      clearTimeout(trayCompactTimer);
      tray.classList.add("is-compact");
      trayToggle.setAttribute("aria-expanded", "false");
      trayList.hidden = true;
    };
    const expandTray = () => {
      clearTimeout(trayCompactTimer);
      tray.classList.remove("is-compact");
    };
    const scheduleTrayCollapse = () => {
      clearTimeout(trayCompactTimer);
      trayCompactTimer = window.setTimeout(collapseTray, 1800);
    };
    function paintTray() {
      const sel = S.store.get();
      tray.hidden = sel.length === 0;
      body.classList.toggle("has-tray", sel.length > 0);
      if (sel.length) {
        expandTray();
        scheduleTrayCollapse();
      } else {
        clearTimeout(trayCompactTimer);
        tray.classList.remove("is-compact");
      }
      $("[data-tray-n]").textContent = sel.length;
      $("[data-tray-label]").textContent = sel.length === 1 ? "experience in your stay" : "experiences in your stay";
      trayList.innerHTML = sel.map((id) => { const e = S.exp(id); return `<li><span>${esc(e.name)}</span><button type="button" class="text-btn text-btn--light" data-remove-exp="${id}" aria-label="Remove ${esc(e.name)}">Remove</button></li>`; }).join("");
      if (!sel.length) { trayList.hidden = true; trayToggle.setAttribute("aria-expanded", "false"); }
      $$("[data-add-exp]").forEach((b) => {
        const on = sel.includes(b.dataset.addExp);
        b.setAttribute("aria-pressed", String(on));
        const t = $(".add-btn__text", b);
        if (t) t.textContent = addLabel(on); else b.textContent = on ? "In your stay" : "Add to my stay";
      });
    }
    const body = doc.body;
    doc.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add-exp]");
      if (add) { const on = S.store.toggle(add.dataset.addExp); S.track("experience_toggle", { id: add.dataset.addExp, on }); }
      const rem = e.target.closest("[data-remove-exp]");
      if (rem) { S.store.toggle(rem.dataset.removeExp); trayToggle.focus(); }
    });
    trayToggle.addEventListener("click", () => {
      if (tray.classList.contains("is-compact")) {
        expandTray();
        trayToggle.setAttribute("aria-expanded", "false");
        trayList.hidden = true;
        return;
      }
      const open = trayToggle.getAttribute("aria-expanded") !== "true";
      trayToggle.setAttribute("aria-expanded", String(open));
      trayList.hidden = !open;
    });
    window.addEventListener("scroll", () => {
      if (!tray.hidden && window.scrollY > 160) collapseTray();
    }, { passive: true });
    $("[data-tray-clear]").addEventListener("click", () => S.store.clear());
    doc.addEventListener("solara:itinerary", paintTray);
    render();
    paintTray();
  }

  /* ======================================================================
     CONCIERGE — configurable request builder
     ====================================================================== */
  function fieldHTML(svc, f) {
    const id = `sv-${svc.id}-${f.name}`, name = `${svc.id}.${f.name}`, req = f.required ? " required" : "";
    const label = `${esc(f.label)}${f.required ? "" : ' <span class="optional">(optional)</span>'}`;
    const ph = f.placeholder ? ` placeholder="${esc(f.placeholder)}"` : "";
    if (f.type === "radio" || f.type === "checks") {
      const type = f.type === "radio" ? "radio" : "checkbox";
      const attrs = f.type === "radio" ? `${f.required ? " data-required-group" : ""} data-label="${esc(f.label.toLowerCase())}"` : ` data-min="${f.min || 1}" data-message="Choose at least one option for ${esc(f.label.toLowerCase())}."`;
      return `<fieldset class="field field--full radio-row" data-field${attrs}><legend>${esc(f.label)}</legend>${f.options.map((o, i) => `<label class="check"><input type="${type}" name="${name}" value="${esc(o)}"${f.type === "checks" && i === f.options.length - 1 ? " checked" : ""}><span>${esc(o)}</span></label>`).join("")}</fieldset>`;
    }
    if (f.type === "select") return `<div class="field" data-field><label for="${id}">${label}</label><select id="${id}" name="${name}"${req} data-label="${esc(f.label)}"><option value="">Choose</option>${f.options.map((o) => `<option>${esc(o)}</option>`).join("")}</select></div>`;
    if (f.type === "textarea") return `<div class="field field--full" data-field><label for="${id}">${label}</label><textarea id="${id}" name="${name}" rows="3" maxlength="800"${req}${ph}></textarea></div>`;
    const extra = f.type === "number" ? ` min="${f.min}" max="${f.max}" value="${f.value ?? f.min}" inputmode="numeric"` : f.type === "date" ? ` data-future min="${todayISO()}"` : ` maxlength="100"`;
    return `<div class="field" data-field><label for="${id}">${label}</label><input type="${f.type}" id="${id}" name="${name}"${req}${ph}${extra}></div>`;
  }

  function concierge() {
    const form = $("[data-concierge]");
    const services = D.conciergeServices || [];
    $("[data-services]").innerHTML = services.map((s) => `<div class="service" data-service="${s.id}">
        <label class="service__head">
          <input type="checkbox" name="services" value="${s.id}" class="service__check">
          <span class="service__box" aria-hidden="true"></span>
          <span class="service__text"><span class="service__name">${esc(s.name)}</span><span class="service__note">${esc(s.note)}</span></span>
        </label>
        <div class="service__config form-grid" hidden>${s.fields.map((f) => fieldHTML(s, f)).join("")}</div>
      </div>`).join("");

    const villaSel = $("#cg-villa");
    villaSel.innerHTML = `<option value="">Choose a villa</option>` + D.destinations.map((d) => `<optgroup label="${esc(d.name)}">${villasIn(d.id).map((v) => `<option value="${v.id}">${esc(v.name)}</option>`).join("")}</optgroup>`).join("") +
      `<option value="undecided">Not booked yet — help me choose</option>`;
    if (S.villa(params.get("villa"))) villaSel.value = params.get("villa");
    const inEl = $("#cg-in"), outEl = $("#cg-out");
    inEl.min = todayISO(); outEl.min = addDays(todayISO(), 1);
    inEl.addEventListener("change", () => { if (validISO(inEl.value)) outEl.min = addDays(inEl.value, 1); });

    const summary = $("[data-summary]"), emptyNote = $("[data-summary-empty]");
    const describe = (svc) => svc.fields.map((f) => {
      const els = $$(`[name="${svc.id}.${f.name}"]`, form);
      const val = f.type === "radio" || f.type === "checks" ? els.filter((e) => e.checked).map((e) => e.value).join(", ") : (els[0] && els[0].value.trim());
      return val ? `${f.label}: ${val.length > 60 ? `${val.slice(0, 57)}…` : val}` : "";
    }).filter(Boolean).join(" · ");
    const items = () => {
      const chosen = services.filter((s) => $(`input[name="services"][value="${s.id}"]`, form).checked);
      const out = chosen.map((s) => `<li><strong>${esc(s.name)}</strong><span>${esc(describe(s)) || "Details to follow"}</span></li>`);
      const vName = villaSel.value && villaSel.value !== "undecided" ? S.villa(villaSel.value).name : villaSel.value ? "Villa to be chosen" : "";
      const dates = validISO(inEl.value) && validISO(outEl.value) && nights(inEl.value, outEl.value) > 0 ? `${fmtDate(inEl.value)} – ${fmtDate(outEl.value)}` : "";
      if (chosen.length && (vName || dates)) out.push(`<li class="summary-list__stay"><strong>Stay</strong><span>${esc([vName, dates].filter(Boolean).join(" · "))}</span></li>`);
      return { html: out.join(""), n: chosen.length };
    };
    const paint = () => { const r = items(); summary.innerHTML = r.html; emptyNote.hidden = r.n > 0; };

    form.addEventListener("change", (e) => {
      const t = e.target;
      if (t.name === "services") {
        const card = t.closest(".service");
        card.classList.toggle("is-selected", t.checked);
        $(".service__config", card).hidden = !t.checked;
        const fs = $(".request__services", form);
        if (fs.getAttribute("aria-invalid") === "true") S.setError(fs, S.fieldMessage(fs));
      }
      paint();
    });
    form.addEventListener("input", paint);
    S.liveValidation(form);

    const status = $("[data-form-status]", form), wrap = $("[data-request-wrap]"), success = $("[data-success]");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "";
      if (!S.validate(form)) { status.textContent = "Please check the highlighted fields."; return; }
      const btn = $('button[type="submit"]', form);
      const fd = new FormData(form);
      const chosen = fd.getAll("services");
      const payload = {
        services: chosen.map((id) => { const s = services.find((x) => x.id === id); const o = { id, name: s.name };
          s.fields.forEach((f) => { const vals = fd.getAll(`${id}.${f.name}`).filter(Boolean); o[f.name] = f.type === "checks" ? vals : (vals[0] || ""); }); return o; }),
        villa: fd.get("villa"), arrival: fd.get("arrival"), departure: fd.get("departure"),
        name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone"), notes: fd.get("notes")
      };
      S.busy(btn, true);
      try {
        const r = await S.submit("concierge", payload, form);
        const snapshot = items().html;
        wrap.hidden = true;
        success.hidden = false;
        $("[data-success-text]").textContent = `Your reference is ${r.ref}. ${payload.name.split(" ")[0]}, your concierge will reply to ${payload.email} within two hours with options and prices.${r.simulated ? " (Demonstration mode: nothing was sent.)" : ""}`;
        $("[data-success-list]").innerHTML = snapshot;
        success.focus();
      } catch {
        status.textContent = "We couldn't send your request just now. Please try again, or call the concierge line.";
      } finally { S.busy(btn, false); }
    });
    $("[data-success-edit]").addEventListener("click", () => { success.hidden = true; wrap.hidden = false; ($(".service__check:checked", form) || $("input", form)).focus(); });

    // Deep links from villa, wellness and event pages: ?service=wellness&treatment=Massage
    const pre = params.get("service");
    if (services.some((s) => s.id === pre)) {
      const box = $(`input[name="services"][value="${pre}"]`, form);
      box.checked = true;
      box.dispatchEvent(new Event("change", { bubbles: true }));
      const t = params.get("treatment");
      const sel = $(`select[name="${pre}.treatment"]`, form);
      if (sel && t && [...sel.options].some((o) => o.value === t)) sel.value = t;
    }
    paint();
  }

  /* ======================================================================
     ABOUT — guest voices
     ====================================================================== */
  function about() {
    const el = $("[data-voices]");
    if (el) el.innerHTML = D.testimonials.map((t) => `<blockquote class="voice" data-reveal><p>“${esc(t.quote)}”</p><footer><cite>${esc(t.name)}</cite><span>${esc(t.stay)}</span></footer></blockquote>`).join("");
  }

  /* ======================================================================
     JOURNAL — index with category + search, and article reader
     ====================================================================== */
  function journal() {
    const cats = D.journalCategories;
    const posts = [...D.journal].sort((a, b) => b.date.localeCompare(a.date));
    const indexEl = $("[data-journal-index]"), reader = $("[data-journal-reader]");
    const dateText = (s) => parse(s).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
    const slug = params.get("post");
    const post = posts.find((p) => p.slug === slug);

    if (post) {
      indexEl.hidden = true;
      reader.hidden = false;
      setMeta(`${post.title} — The Journal | SOLARA Private Villas`, post.excerpt);
      let h = 0;
      const bodyHTML = post.body.map((b) => b.h ? `<h2 id="s-${++h}">${esc(b.h)}</h2>` : `<p>${esc(b.p)}</p>`).join("");
      const toc = post.body.filter((b) => b.h).map((b, i) => `<li><a href="#s-${i + 1}">${esc(b.h)}</a></li>`).join("");
      const i = posts.indexOf(post);
      const prev = posts[i + 1], next = posts[i - 1];
      const d = S.dest(post.destination);
      const vs = d ? villasIn(d.id) : [];
      reader.innerHTML = `<header class="reader__head">
          <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="../index.html">Home</a></li><li><a href="index.html">Journal</a></li><li><a href="index.html?cat=${post.category}">${esc(cats[post.category])}</a></li></ol></nav>
          <p class="eyebrow">${esc(cats[post.category])} · ${post.read} min read · <time datetime="${post.date}">${dateText(post.date)}</time></p>
          <h1 id="reader-title" class="reader__title">${esc(post.title)}</h1>
          <p class="reader__dek">${esc(post.excerpt)}</p>
        </header>
        <figure class="reader__media">${img(post.image, { sizes: "(min-width: 1400px) 1320px, 100vw", alt: post.title, eager: true })}</figure>
        <div class="reader__layout">
          ${toc ? `<nav class="reader__toc" aria-label="In this article"><p class="eyebrow">In this article</p><ol>${toc}</ol></nav>` : "<div></div>"}
          <div class="reader__body">${bodyHTML}</div>
          ${vs.length ? `<aside class="reader__aside" aria-label="Stay in ${esc(d.name)}"><p class="eyebrow">Stay in ${esc(d.name)}</p>${vs.map((v) => S.villaCard(v, { variant: "mini", sizes: "300px", tag: "p" })).join("")}</aside>` : ""}
        </div>
        <nav class="reader__pager" aria-label="More articles">
          ${prev ? `<a href="?post=${prev.slug}" class="reader__pager-link"><span class="eyebrow">Previous</span><span>${esc(prev.title)}</span></a>` : "<span></span>"}
          <a href="index.html" class="btn btn--line">All articles</a>
          ${next ? `<a href="?post=${next.slug}" class="reader__pager-link reader__pager-link--next"><span class="eyebrow">Next</span><span>${esc(next.title)}</span></a>` : "<span></span>"}
        </nav>`;
      S.reveals(reader);
      return;
    }

    let cat = cats[params.get("cat")] ? params.get("cat") : "";
    let q = (params.get("q") || "").slice(0, 60);
    const catWrap = $("[data-journal-cats]"), search = $("[data-journal-search]");
    catWrap.innerHTML = `<button type="button" data-value="" aria-pressed="false">All</button>` + Object.entries(cats).map(([k, l]) => `<button type="button" data-value="${k}" aria-pressed="false">${esc(l)}</button>`).join("");
    const chips = S.chipGroup(catWrap, (v) => { cat = v; render(); });
    chips.set(cat);
    search.value = q;

    const card = (p) => `<article class="jcard">
        <div class="jcard__media">${img(p.image, { sizes: "(min-width: 1100px) 30vw, (min-width: 700px) 45vw, 100vw", alt: "" })}</div>
        <div class="jcard__body">
          <p class="eyebrow">${esc(cats[p.category])} · ${p.read} min read</p>
          <h3 class="jcard__title"><a class="stretched" href="?post=${p.slug}">${esc(p.title)}</a></h3>
          <p class="jcard__summary">${esc(p.excerpt)}</p>
          <p class="jcard__date"><time datetime="${p.date}">${dateText(p.date)}</time></p>
        </div></article>`;

    function render() {
      const term = q.trim().toLowerCase();
      const list = posts.filter((p) => (!cat || p.category === cat) && (!term || `${p.title} ${p.excerpt} ${cats[p.category]}`.toLowerCase().includes(term)));
      const showFeature = !cat && !term && list.length > 0;
      const feat = $("[data-journal-feature]");
      feat.hidden = !showFeature;
      if (showFeature) {
        const f = list[0];
        feat.innerHTML = `<article class="jfeature">
            <div class="jfeature__media">${img(f.image, { sizes: "(min-width: 1000px) 60vw, 100vw", alt: "", eager: true })}</div>
            <div class="jfeature__body">
              <p class="eyebrow">Latest · ${esc(cats[f.category])} · ${f.read} min read</p>
              <h2 class="jfeature__title"><a class="stretched" href="?post=${f.slug}">${esc(f.title)}</a></h2>
              <p>${esc(f.excerpt)}</p>
              <span class="text-link" aria-hidden="true">Read the article</span>
            </div></article>`;
      }
      const rest = showFeature ? list.slice(1) : list;
      $("[data-journal-grid]").innerHTML = rest.map(card).join("");
      $("[data-journal-empty]").hidden = list.length > 0;
      $("[data-journal-count]").textContent = term || cat ? `${plural(list.length, "article")} found` : `${plural(list.length, "article")}`;
      const u = new URLSearchParams(); cat && u.set("cat", cat); term && u.set("q", q.trim());
      history.replaceState(null, "", u.toString() ? `?${u}` : window.location.pathname);
    }
    let t;
    search.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => { q = search.value.slice(0, 60); render(); }, 140); });
    $("[data-journal-reset]").addEventListener("click", () => { cat = ""; q = ""; search.value = ""; chips.set(""); render(); search.focus(); });
    render();
  }

  function newsletter() {
    const form = $("[data-newsletter]");
    if (!form) return;
    S.liveValidation(form);
    const status = $("[data-form-status]", form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = ""; status.classList.remove("is-success");
      if (!S.validate(form)) return;
      const btn = $('button[type="submit"]', form);
      S.busy(btn, true, "Subscribing…");
      try {
        const r = await S.submit("newsletter", { email: form.email.value.trim() }, form);
        form.reset();
        status.classList.add("is-success");
        status.textContent = `Thank you — you're on the list for the next seasonal letter.${r.simulated ? " (Demonstration mode: nothing was sent.)" : ""}`;
      } catch { status.textContent = "We couldn't subscribe you just now. Please try again."; }
      finally { S.busy(btn, false); }
    });
  }

  /* ======================================================================
     PLAN YOUR STAY — four-step enquiry
     ====================================================================== */
  function plan() {
    const form = $("[data-plan]");
    const steps = $$(".step", form);
    const progress = $$("[data-progress] li");
    const back = $("[data-back]"), next = $("[data-next]");
    const status = $("[data-form-status]", form);
    let step = 0;
    const inEl = $("#pl-in"), outEl = $("#pl-out"), destSel = $("#pl-dest");
    const adults = $("#pl-adults"), children = $("#pl-children"), infants = $("#pl-infants");

    destSel.insertAdjacentHTML("beforeend", D.destinations.map((d) => `<option value="${d.id}">${esc(d.name)}, ${esc(d.country)}</option>`).join(""));
    inEl.min = todayISO(); outEl.min = addDays(todayISO(), 1);

    // Prefill from villa page, home finder, experiences tray
    const pv = S.villa(params.get("villa"));
    const pin = params.get("in"), pout = params.get("out");
    if (validISO(pin) && pin >= todayISO()) { inEl.value = pin; outEl.min = addDays(pin, 1); }
    if (validISO(pout) && inEl.value && pout > inEl.value) outEl.value = pout;
    const pa = parseInt(params.get("adults"), 10);
    if (pa >= 1 && pa <= 16) adults.value = pa;
    if (pv) destSel.value = pv.destination;
    else if (S.dest(params.get("dest"))) destSel.value = params.get("dest");

    // Step 2: villa picker
    const pickGrid = $("[data-pick-grid]"), pickNote = $("[data-pick-note]");
    pickGrid.innerHTML = D.villas.map((v) => `<label class="pick-card" data-pick-villa="${v.id}">
        <input type="checkbox" name="villas" value="${v.id}"${pv && pv.id === v.id ? " checked" : ""}>
        <span class="pick-card__media">${img(v.images[0].src, { sizes: "(min-width: 700px) 220px, 40vw", alt: "" })}</span>
        <span class="pick-card__body"><span class="pick-card__name">${esc(v.name)}</span><span class="pick-card__meta">${esc(S.dest(v.destination).name)} · sleeps ${v.guests}</span><span class="pick-card__warn" data-warn></span></span>
        <span class="pick-card__tick" aria-hidden="true"></span>
      </label>`).join("");
    const party = () => Number(adults.value) + Number(children.value);
    const paintPicker = () => {
      const p = party();
      const chosen = $$('input[name="villas"]:checked', pickGrid);
      const dest = destSel.value;
      const cards = $$(".pick-card", pickGrid);
      cards.sort((a, b) => {
        const va = S.villa(a.dataset.pickVilla), vb = S.villa(b.dataset.pickVilla);
        return ((vb.destination === dest) - (va.destination === dest)) || D.villas.indexOf(va) - D.villas.indexOf(vb);
      }).forEach((c) => pickGrid.appendChild(c));
      cards.forEach((c) => {
        const v = S.villa(c.dataset.pickVilla), input = $("input", c), warn = $("[data-warn]", c);
        const small = v.guests < p;
        if (small && input.checked) input.checked = false;
        input.disabled = small || (!input.checked && $$('input[name="villas"]:checked', pickGrid).length >= 3);
        warn.textContent = small ? `Too small for ${p} guests` : "";
        c.classList.toggle("is-disabled", input.disabled);
      });
      pickNote.textContent = chosen.length ? `(${chosen.length} of 3 chosen)` : "";
    };
    const pickFs = $("[data-pick]"), recommend = $("[data-recommend]");
    const paintMode = () => {
      const rec = $('input[name="mode"]:checked', form).value === "recommend";
      pickFs.hidden = rec; recommend.hidden = !rec;
      if (rec) S.setError(pickFs, "");
    };

    // Step 3: experiences
    const stored = S.store.get();
    $("[data-exp-pick]").innerHTML = D.experiences.map((e) => `<label class="exp-chip"><input type="checkbox" name="experiences" value="${e.id}"${stored.includes(e.id) ? " checked" : ""}><span>${esc(e.name)}</span></label>`).join("");

    const summary = $("[data-plan-summary]");
    function paintSummary() {
      const rows = [];
      const n = nights(inEl.value, outEl.value);
      rows.push(["Dates", validISO(inEl.value) && validISO(outEl.value) && n > 0 ? `${fmtDate(inEl.value)} – ${fmtDate(outEl.value)} · ${plural(n, "night")}${$("#pl-flex").checked ? " · flexible" : ""}` : "To be chosen"]);
      const g = [plural(Number(adults.value), "adult"), Number(children.value) ? plural(Number(children.value), "child", "children") : "", Number(infants.value) ? plural(Number(infants.value), "infant") : ""].filter(Boolean).join(", ");
      rows.push(["Guests", g]);
      rows.push(["Destination", destSel.value ? S.dest(destSel.value).name : "Open to suggestions"]);
      const rec = $('input[name="mode"]:checked', form).value === "recommend";
      const vs = $$('input[name="villas"]:checked', form).map((i) => S.villa(i.value).name);
      rows.push(["Villas", rec ? "Recommendation requested" : vs.join(", ") || "None chosen yet"]);
      const ex = $$('input[name="experiences"]:checked', form).map((i) => S.exp(i.value).name);
      rows.push(["Experiences", ex.join(", ") || "None yet"]);
      if ($("#pl-occasion").value) rows.push(["Occasion", $("#pl-occasion").value]);
      summary.innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("");
    }

    function show(k, focus = true) {
      step = k;
      steps.forEach((s, i) => { s.hidden = i !== k; });
      progress.forEach((li, i) => { li.classList.toggle("is-done", i < k); i === k ? li.setAttribute("aria-current", "step") : li.removeAttribute("aria-current"); });
      back.hidden = k === 0;
      next.textContent = k === steps.length - 1 ? "Send enquiry" : "Continue";
      status.textContent = "";
      if (k === 1) paintPicker();
      if (focus) {
        const t = $(".step__title", steps[k]);
        t.focus({ preventScroll: true });
        $(".plan").scrollIntoView({ behavior: S.reduced() ? "auto" : "smooth", block: "start" });
      }
    }

    inEl.addEventListener("change", () => {
      if (validISO(inEl.value)) { outEl.min = addDays(inEl.value, 1); if (!outEl.value || nights(inEl.value, outEl.value) < 1) outEl.value = addDays(inEl.value, 7); }
    });
    form.addEventListener("change", (e) => {
      if (e.target.name === "mode") paintMode();
      if (e.target.name === "villas" || e.target.closest("[data-stepper]") || e.target === destSel) paintPicker();
      if (e.target.name === "villas" && pickFs.getAttribute("aria-invalid") === "true") S.setError(pickFs, S.fieldMessage(pickFs));
      if (e.target.name === "experiences") S.store.set($$('input[name="experiences"]:checked', form).map((i) => i.value));
      paintSummary();
    });
    form.addEventListener("input", paintSummary);
    S.liveValidation(form);

    back.addEventListener("click", () => show(step - 1));
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!S.validate(steps[step])) { status.textContent = "Please check the highlighted fields."; return; }
      if (step < steps.length - 1) { show(step + 1); return; }
      const fd = new FormData(form);
      const payload = {
        arrival: fd.get("arrival"), departure: fd.get("departure"), flexible: !!fd.get("flexible"),
        adults: Number(fd.get("adults")), children: Number(fd.get("children")), infants: Number(fd.get("infants")),
        destination: fd.get("destination"), mode: fd.get("mode"), villas: fd.getAll("villas"), priority: fd.get("mode") === "recommend" ? fd.get("priority") : "",
        experiences: fd.getAll("experiences"), occasion: fd.get("occasion"),
        firstName: fd.get("firstName"), lastName: fd.get("lastName"), email: fd.get("email"), phone: fd.get("phone"), contactBy: fd.get("contactBy"), message: fd.get("message")
      };
      S.busy(next, true);
      try {
        const r = await S.submit("plan", payload, form);
        $("[data-plan-wrap]").hidden = true;
        $("[data-progress]").hidden = true;
        const ok = $("[data-plan-success]");
        ok.hidden = false;
        $("[data-plan-success-text]").textContent = `Your reference is ${r.ref}. ${payload.firstName}, we'll reply to ${payload.email} within one working day.${r.simulated ? " (Demonstration mode: nothing was sent.)" : ""}`;
        ok.focus();
        ok.scrollIntoView({ behavior: S.reduced() ? "auto" : "smooth", block: "start" });
      } catch {
        status.textContent = "We couldn't send your enquiry just now. Please try again, or call reservations.";
      } finally { S.busy(next, false); next.textContent = "Send enquiry"; }
    });
    $("[data-plan-edit]").addEventListener("click", () => {
      $("[data-plan-success]").hidden = true;
      $("[data-plan-wrap]").hidden = false;
      $("[data-progress]").hidden = false;
      show(steps.length - 1);
    });

    paintMode();
    paintPicker();
    paintSummary();
    show(0, false);
  }

  /* ======================================================================
     CONTACT — guest / owner pathways, local desk times
     ====================================================================== */
  function contact() {
    const radios = $$("[data-path]");
    const forms = { guest: $('[data-contact="guest"]'), owner: $('[data-contact="owner"]') };
    const success = $("[data-contact-success]");
    const choose = (p, focus = false) => {
      radios.forEach((r) => { const on = r.dataset.path === p; r.setAttribute("aria-checked", String(on)); r.tabIndex = on ? 0 : -1; if (on && focus) r.focus(); });
      Object.entries(forms).forEach(([k, f]) => { f.hidden = k !== p; });
      success.hidden = true;
      history.replaceState(null, "", p === "owner" ? "?path=owner" : window.location.pathname);
    };
    radios.forEach((r, i) => {
      r.addEventListener("click", () => choose(r.dataset.path));
      r.addEventListener("keydown", (e) => {
        if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key)) {
          e.preventDefault();
          const k = (i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + radios.length) % radios.length;
          choose(radios[k].dataset.path, true);
        }
      });
    });
    choose(params.get("path") === "owner" ? "owner" : "guest");

    Object.entries(forms).forEach(([kind, form]) => {
      S.liveValidation(form);
      const status = $("[data-form-status]", form);
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        status.textContent = "";
        if (!S.validate(form)) { status.textContent = "Please check the highlighted fields."; return; }
        const btn = $('button[type="submit"]', form);
        const payload = Object.fromEntries([...new FormData(form)].filter(([k]) => k !== "company_website"));
        S.busy(btn, true);
        try {
          const r = await S.submit(kind === "owner" ? "owner-enquiry" : "guest-enquiry", payload, form);
          form.hidden = true;
          success.hidden = false;
          $("[data-contact-success-text]").textContent = `Your reference is ${r.ref}. ${kind === "owner" ? "Our owners team will reply within two working days" : "A member of our reservations team will reply within two hours"} to ${payload.email}.${r.simulated ? " (Demonstration mode: nothing was sent.)" : ""}`;
          success.dataset.kind = kind;
          success.focus();
        } catch { status.textContent = "We couldn't send your message just now. Please try again, or call reservations."; }
        finally { S.busy(btn, false); }
      });
    });
    $("[data-contact-again]").addEventListener("click", () => {
      const kind = success.dataset.kind || "guest";
      forms[kind].reset();
      choose(kind);
      $("input", forms[kind]).focus();
    });

    const desks = $("[data-desks]");
    const paintDesks = () => {
      desks.innerHTML = D.destinations.map((d) => {
        let t = "";
        try { t = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: d.timezone }).format(new Date()); } catch { t = "—"; }
        return `<li><span class="desks__name">${esc(d.name)}</span><span class="desks__time"><time>${t}</time> local</span><span class="desks__open">Open 24 hours</span></li>`;
      }).join("");
    };
    paintDesks();
    setInterval(paintDesks, 30000);
  }

  /* ======================================================================
     WEDDINGS & EVENTS — occasion cards, venue finder, event enquiry
     ====================================================================== */
  function weddings() {
    const types = D.eventTypes || [];
    const hosted = D.villas.filter((v) => v.events && v.events.mode === "hosted");
    const capacity = (v) => (v.events ? Math.max(v.events.standing || 0, v.events.seated || 0) : 0);
    const fits = (v, type, guests) => {
      const ev = v.events;
      if (!ev || (type && !ev.types.includes(type))) return false;
      return guests <= (ev.mode === "hosted" ? capacity(v) : Math.min(ev.seated || v.guests, v.guests));
    };

    const facts = $("[data-event-facts]");
    if (facts) {
      facts.innerHTML = [["Villas that host events", hosted.length], ["Largest seated dinner", Math.max(0, ...hosted.map((v) => v.events.seated))],
        ["Largest reception", Math.max(0, ...hosted.map((v) => v.events.standing))], ["Planner per event", 1]]
        .map(([k, n]) => `<div><dt>${k}</dt><dd>${n}</dd></div>`).join("");
    }

    const typeWrap = $("[data-event-types]");
    typeWrap.innerHTML = types.map((t) => {
      const max = Math.max(0, ...D.villas.filter((v) => v.events && v.events.types.includes(t.id)).map((v) => (v.events.mode === "hosted" ? capacity(v) : v.events.seated)));
      return `<article class="etype" data-reveal>
        <div class="etype__media">${img(t.image, { sizes: "(min-width: 1100px) 30vw, (min-width: 700px) 45vw, 100vw", alt: "" })}</div>
        <div class="etype__body">
          <p class="eyebrow">Up to ${max} guests</p>
          <h3 class="etype__title">${esc(t.name)}</h3>
          <p>${esc(t.summary)}</p>
          <p class="etype__detail">${esc(t.detail)}</p>
          <button type="button" class="text-link" data-find-type="${t.id}">Find a villa</button>
        </div></article>`;
    }).join("");

    // Venue finder
    const typeChips = $("[data-venue-type]"), guestsEl = $("#vn-guests"), list = $("[data-venues]"), count = $("[data-venue-count]");
    typeChips.innerHTML = `<button type="button" data-value="" aria-pressed="true">Any occasion</button>` + types.map((t) => `<button type="button" data-value="${t.id}" aria-pressed="false">${esc(t.name)}</button>`).join("");
    let type = types.some((t) => t.id === params.get("type")) ? params.get("type") : "";
    const chips = S.chipGroup(typeChips, (v) => { type = v; renderVenues(); });
    chips.set(type);
    const guests = () => Math.min(150, Math.max(2, parseInt(guestsEl.value, 10) || 2));
    function renderVenues() {
      const g = guests();
      const rows = D.villas.filter((v) => fits(v, type, g)).sort((a, b) => (b.events.mode === "hosted") - (a.events.mode === "hosted") || capacity(b) - capacity(a));
      list.innerHTML = rows.map((v) => {
        const ev = v.events, dd = S.dest(v.destination);
        const cover = v.images.find((p) => p.hero) || v.images[0];
        const hostedMode = ev.mode === "hosted";
        return `<article class="venue" data-venue="${v.id}">
          <div class="venue__media">${img(cover.src, { sizes: "(min-width: 1000px) 30vw, 100vw", alt: cover.alt })}<span class="photo-tag">At the villa</span></div>
          <div class="venue__body">
            <p class="eyebrow">${esc(v.area)} · ${esc(dd.name)}</p>
            <h3 class="venue__title"><a href="${S.villaUrl(v.id)}#events">${esc(v.name)}</a></h3>
            <dl class="venue__facts">
              ${hostedMode ? `<div><dt>Seated</dt><dd>${ev.seated}</dd></div><div><dt>Standing</dt><dd>${ev.standing}</dd></div><div><dt>Ceremony</dt><dd>${esc(ev.ceremony)}</dd></div>`
                : `<div><dt>In-house party</dt><dd>Up to ${ev.seated}</dd></div><div><dt>Suited to</dt><dd>Private dinners, proposals and vow renewals</dd></div>`}
            </dl>
            <div class="venue__actions">
              ${hostedMode ? `<button type="button" class="btn btn--dark btn--sm" data-enquire-villa="${v.id}">Enquire for this villa</button>` : `<a class="btn btn--line btn--sm" href="${base}concierge/index.html?service=celebration&amp;villa=${v.id}">Arrange a celebration</a>`}
              <a class="text-link" href="${S.villaUrl(v.id)}">View the villa</a>
            </div>
          </div></article>`;
      }).join("") || `<div class="empty-inline"><p>No villa hosts ${g} guests for this occasion. Try fewer guests, or ask us about a nearby venue with rooms at the villa.</p><a class="text-link" href="#enquire">Ask your planner</a></div>`;
      count.textContent = `${plural(rows.length, "villa")} for ${g} guests${type ? ` · ${types.find((t) => t.id === type).name}` : ""}`;
      S.track("venue_filter", { type: type || "any", guests: g, results: rows.length });
    }
    $("[data-venue-form]").addEventListener("submit", (e) => e.preventDefault());
    guestsEl.addEventListener("change", renderVenues);
    guestsEl.addEventListener("input", () => { if (guestsEl.value) renderVenues(); });
    typeWrap.addEventListener("click", (e) => {
      const b = e.target.closest("[data-find-type]");
      if (!b) return;
      type = b.dataset.findType; chips.set(type); renderVenues();
      $("#venues").scrollIntoView({ behavior: S.reduced() ? "auto" : "smooth" });
      $(`[data-venue-type] [aria-pressed="true"]`).focus({ preventScroll: true });
    });

    // Enquiry
    const form = $("[data-event-form]"), typeSel = $("#ev-type"), villaSel = $("#ev-villa"), dateEl = $("#ev-date"), gEl = $("#ev-guests");
    typeSel.insertAdjacentHTML("beforeend", types.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join(""));
    villaSel.insertAdjacentHTML("beforeend", hosted.map((v) => `<option value="${v.id}">${esc(v.name)} · ${esc(S.dest(v.destination).name)} (up to ${capacity(v)})</option>`).join("") + `<option value="undecided">Not sure yet — help me choose</option>`);
    dateEl.min = todayISO();
    const pv = S.villa(params.get("villa"));
    if (pv && hosted.includes(pv)) villaSel.value = pv.id;
    if (type) typeSel.value = type;
    list.addEventListener("click", (e) => {
      const b = e.target.closest("[data-enquire-villa]");
      if (!b) return;
      villaSel.value = b.dataset.enquireVilla;
      gEl.value = guests();
      if (type) typeSel.value = type;
      paintSummary();
      $("#enquire").scrollIntoView({ behavior: S.reduced() ? "auto" : "smooth" });
      typeSel.value ? dateEl.focus({ preventScroll: true }) : typeSel.focus({ preventScroll: true });
    });
    const summary = $("[data-event-summary]"), emptyNote = $("[data-event-summary-empty]");
    function paintSummary() {
      const rows = [];
      const t = types.find((x) => x.id === typeSel.value);
      if (t) rows.push(["Occasion", t.name]);
      if (villaSel.value) rows.push(["Villa", villaSel.value === "undecided" ? "Help me choose" : S.villa(villaSel.value).name]);
      if (validISO(dateEl.value)) rows.push(["Date", fmtDate(dateEl.value)]);
      if (gEl.value) rows.push(["Guests", gEl.value]);
      summary.innerHTML = rows.map(([k, val]) => `<li><strong>${esc(val)}</strong><span>${k}</span></li>`).join("");
      emptyNote.hidden = rows.length > 0;
    }
    form.addEventListener("input", paintSummary);
    form.addEventListener("change", paintSummary);
    S.liveValidation(form);
    const status = $("[data-form-status]", form), wrap = $("[data-event-wrap]"), success = $("[data-event-success]");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "";
      if (!S.validate(form)) { status.textContent = "Please check the highlighted fields."; return; }
      const chosen = S.villa(villaSel.value);
      if (chosen && Number(gEl.value) > capacity(chosen)) {
        S.setError(gEl, `${chosen.name} hosts up to ${capacity(chosen)} guests. Choose another villa or fewer guests.`);
        gEl.focus(); status.textContent = "Please check the highlighted fields."; return;
      }
      const fd = new FormData(form);
      const payload = { eventType: fd.get("eventType"), villa: fd.get("villa"), date: fd.get("date"), guests: Number(fd.get("guests")), flexibility: fd.get("flexibility"),
        name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone"), notes: fd.get("notes") };
      const btn = $('button[type="submit"]', form);
      S.busy(btn, true);
      try {
        const r = await S.submit("event-enquiry", payload, form);
        wrap.hidden = true; success.hidden = false;
        $("[data-event-success-text]").textContent = `Your reference is ${r.ref}. ${payload.name.split(" ")[0]}, an event planner will reply to ${payload.email} within one working day with availability and first ideas.${r.simulated ? " (Demonstration mode: nothing was sent.)" : ""}`;
        success.focus();
      } catch { status.textContent = "We couldn't send your enquiry just now. Please try again, or call reservations."; }
      finally { S.busy(btn, false); }
    });
    $("[data-event-again]").addEventListener("click", () => { success.hidden = true; wrap.hidden = false; typeSel.focus(); });
    renderVenues();
    paintSummary();
  }

  /* ======================================================================
     WELLNESS — filterable treatment menu and villa facilities matrix
     ====================================================================== */
  function wellness() {
    const cats = D.wellnessCategories || {};
    const menu = D.wellnessServices || [];
    const catWrap = $("[data-well-cats]"), whereSel = $("[data-well-where]"), list = $("[data-well-menu]");
    let cat = cats[params.get("cat")] ? params.get("cat") : "";
    let where = S.dest(params.get("where")) ? params.get("where") : "";
    catWrap.innerHTML = `<button type="button" data-value="" aria-pressed="false">All <span class="chip-n">${menu.length}</span></button>` +
      Object.entries(cats).map(([k, l]) => `<button type="button" data-value="${k}" aria-pressed="false">${esc(l)} <span class="chip-n">${menu.filter((s) => s.category === k).length}</span></button>`).join("");
    whereSel.insertAdjacentHTML("beforeend", D.destinations.map((d) => `<option value="${d.id}">${esc(d.name)}</option>`).join(""));
    whereSel.value = where;
    const chips = S.chipGroup(catWrap, (v) => { cat = v; render(); });
    chips.set(cat);
    whereSel.addEventListener("change", () => { where = whereSel.value; render(); });
    function render() {
      const rows = menu.filter((s) => (!cat || s.category === cat) && (!where || s.where.includes(where)));
      list.innerHTML = rows.map((s) => `<li class="menu-item">
          <div class="menu-item__head"><h3 class="menu-item__title">${esc(s.name)}</h3><span class="menu-item__dur">${esc(s.duration)}</span></div>
          <p class="menu-item__summary">${esc(s.summary)}</p>
          <p class="menu-item__meta"><span>${esc(cats[s.category])}</span><span><span class="sr-only">Available in: </span>${s.where.map((w) => esc(S.dest(w).name)).join(" · ")}</span></p>
          <a class="text-link" href="${base}concierge/index.html?service=wellness&amp;treatment=${encodeURIComponent(s.treatment)}" aria-label="Request ${esc(s.name)}">Request</a>
        </li>`).join("") || `<li class="empty-inline">No treatments match — try another type or destination.</li>`;
      $("[data-well-count]").textContent = `${plural(rows.length, "treatment")}${where ? ` available in ${S.dest(where).name}` : ""}`;
      const q = new URLSearchParams(); cat && q.set("cat", cat); where && q.set("where", where);
      history.replaceState(null, "", `${q.toString() ? `?${q}` : window.location.pathname}${window.location.hash}`);
    }
    $$("[data-menu-cat]").forEach((b) => b.addEventListener("click", () => {
      cat = b.dataset.menuCat; chips.set(cat); render();
      $("#menu").scrollIntoView({ behavior: S.reduced() ? "auto" : "smooth" });
      $('[data-well-cats] [aria-pressed="true"]').focus({ preventScroll: true });
    }));
    render();

    const fac = D.wellnessFacilities || {};
    const keys = Object.keys(fac);
    const tick = `<span class="matrix__yes" aria-hidden="true"></span><span class="sr-only">Yes</span>`;
    $("[data-well-matrix]").innerHTML = `<table class="matrix__table">
        <caption class="sr-only">Wellness facilities at each villa</caption>
        <thead><tr><th scope="col">Villa</th>${keys.map((k) => `<th scope="col">${esc(fac[k])}</th>`).join("")}</tr></thead>
        <tbody>${D.villas.map((v) => { const f = (v.wellness && v.wellness.facilities) || [];
          return `<tr><th scope="row"><a href="${S.villaUrl(v.id)}#wellness">${esc(v.name)}</a><span>${esc(S.dest(v.destination).name)}</span></th>${keys.map((k) => `<td>${f.includes(k) ? tick : '<span class="matrix__no" aria-hidden="true">—</span><span class="sr-only">No</span>'}</td>`).join("")}</tr>`; }).join("")}</tbody>
      </table>`;
  }

  /* ======================================================================
     MY STAY — guest portal. Talks only to an adapter (see assets/js/portal.js);
     the demo adapter is used unless config.portal.mode is "live".
     ====================================================================== */
  function myStay() {
    const cfg = S.config.portal || {};
    const demoAdapter = window.SOLARA_PORTAL_DEMO;
    const api = window.SOLARA_PORTAL_ADAPTER || (cfg.mode === "live" ? null : demoAdapter);
    const signin = $("[data-portal-signin]"), app = $("[data-portal-app]"), live = $("[data-portal-live]");
    const form = $("[data-signin]"), status = $("[data-form-status]", form);
    const brand = S.config.brand || {};
    const say = (t) => { live.textContent = ""; requestAnimationFrame(() => { live.textContent = t; }); };
    const longDate = (s) => parse(s).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const stamp = (s) => new Date(s).toLocaleString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    const daysUntil = (s) => Math.round((parse(s) - parse(todayISO())) / 86400000);
    const statusClass = (t) => (/confirmed|paid/i.test(t) ? "best" : /due|progress|received|requested/i.test(t) ? "shoulder" : "off");
    const pill = (t) => `<span class="status status--${statusClass(t)}">${esc(t)}</span>`;

    if (!api) {
      $(".demo-banner").hidden = true; $(".demo-creds").hidden = true;
      status.textContent = "The guest portal isn't connected yet. Please contact reservations for your booking details.";
      $$("input, button", form).forEach((el) => { el.disabled = true; });
      return;
    }
    const isDemo = api === demoAdapter;
    if (!isDemo) { $(".demo-banner").hidden = true; $(".demo-creds").hidden = true; $$("[data-demo-only]").forEach((el) => { el.hidden = true; }); }
    if (!api.reset) $("[data-reset-demo]").hidden = true;
    const demo = D.portalDemo || {};
    $("[data-demo-ref]").textContent = demo.reference || "";
    $("[data-demo-email]").textContent = (demo.guest && demo.guest.email) || "";
    $("[data-demo-fill]").addEventListener("click", () => { $("#si-ref").value = demo.reference; $("#si-email").value = demo.guest.email; $$("input", form).forEach((el) => S.setError(el, "")); $("button[type=submit]", form).focus(); });

    let stay = null;
    const tabs = $$("[data-tab]");
    const names = tabs.map((t) => t.dataset.tab);
    function selectTab(name, { focusTab = false, focusPanel = false } = {}) {
      if (!names.includes(name)) name = "overview";
      tabs.forEach((t) => { const on = t.dataset.tab === name; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
      $$(".portal-panel").forEach((p) => { p.hidden = p.id !== `panel-${name}`; });
      const tab = tabs.find((t) => t.dataset.tab === name);
      if (tab.parentElement.scrollWidth > tab.parentElement.clientWidth) tab.parentElement.scrollTo({ left: tab.offsetLeft - 24, behavior: S.reduced() ? "auto" : "smooth" });
      history.replaceState(null, "", `#${name}`);
      if (name === "messages") { stay.seen = stay.messages.length; paintUnread(); }
      if (focusTab) tab.focus();
      if (focusPanel) $(`#panel-${name}`).focus({ preventScroll: true });
      S.track("portal_tab", { tab: name });
    }
    $(".portal-tabs__list").addEventListener("keydown", (e) => {
      const i = tabs.indexOf(doc.activeElement);
      if (i < 0) return;
      const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (k === undefined) return;
      e.preventDefault();
      selectTab(tabs[(k + tabs.length) % tabs.length].dataset.tab, { focusTab: true });
    });
    tabs.forEach((t) => t.addEventListener("click", () => selectTab(t.dataset.tab)));
    window.addEventListener("hashchange", () => { if (stay && !app.hidden) selectTab(location.hash.slice(1)); });
    app.addEventListener("click", (e) => {
      const g = e.target.closest("[data-goto]");
      if (!g) return;
      selectTab(g.dataset.goto, { focusPanel: true });
      $(".portal-bar").scrollIntoView({ behavior: S.reduced() ? "auto" : "smooth" });
    });

    /* ----- rendering ----- */
    const set = (key, html) => $$(`[data-p="${key}"]`).forEach((el) => { el.innerHTML = html; });
    const invoices = () => stay.documents.filter((d) => d.kind === "invoice");
    const docTitle = (d) => (d.kind === "invoice" ? (d.status === "Paid" ? `Receipt — ${d.title}` : d.title) : d.title);
    function paintUnread() {
      const n = Math.max(0, stay.messages.length - (stay.seen ?? stay.messages.length));
      const b = $("[data-unread]");
      b.textContent = n; b.hidden = n === 0; b.setAttribute("aria-label", `${n} new`);
    }

    function render() {
      const v = S.villa(stay.villa), d = S.dest(v.destination);
      const g = stay.guest, p = stay.party;
      const partyText = [plural(p.adults, "adult"), p.children ? plural(p.children, "child", "children") : "", p.infants ? plural(p.infants, "infant") : ""].filter(Boolean).join(", ");
      const total = stay.rate * stay.nights;
      set("reference", esc(stay.reference));
      set("first-name", esc(g.firstName));
      set("status", esc(stay.status));
      const cover = v.images.find((im) => im.hero) || v.images[0];
      set("villa-image", img(cover.src, { sizes: "(min-width: 1000px) 44vw, 100vw", alt: cover.alt }) + `<span class="photo-tag">At the villa</span>`);
      set("villa-where", `${esc(v.area)} · ${esc(d.name)}, ${esc(d.country)}`);
      set("villa-name", esc(v.name));
      $$('[data-p="villa-link"]').forEach((a) => { a.href = S.villaUrl(v.id); });
      const dd = daysUntil(stay.arrival);
      set("countdown", dd > 0 ? `Arriving in <strong>${plural(dd, "day")}</strong>` : dd === 0 ? "<strong>Arriving today</strong>" : "<strong>Enjoy your stay</strong>");
      set("stay-facts", [["Arrival", `${fmtDate(stay.arrival)}<small>${esc(v.policies.checkin)}</small>`], ["Departure", `${fmtDate(stay.departure)}<small>${esc(v.policies.checkout)}</small>`], ["Nights", stay.nights], ["Guests", esc(partyText)]]
        .map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join(""));
      set("confirmation", [["Reference", esc(stay.reference)], ["Status", pill(stay.status)], ["Confirmed", fmtDate(stay.confirmedOn)], ["Booked by", `${esc(g.firstName)} ${esc(g.lastName)}`],
        ["Villa", `${esc(v.name)}, ${esc(v.area)}`], ["Rate", `${price(stay.rate)} per night`], ["Stay total", `${price(total)} for ${plural(stay.nights, "night")}`], ["Cancellation", esc(v.policies.cancellation)]]
        .map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join(""));

      const inv = invoices();
      const paid = inv.filter((x) => x.status === "Paid").reduce((a, x) => a + x.amount, 0);
      const due = inv.filter((x) => x.status !== "Paid");
      set("payments", `<dl class="portal-dl portal-dl--money"><div><dt>Invoiced</dt><dd>${price(inv.reduce((a, x) => a + x.amount, 0))}</dd></div><div><dt>Paid</dt><dd>${price(paid)}</dd></div>
          <div><dt>Balance</dt><dd>${price(due.reduce((a, x) => a + x.amount, 0))}</dd></div></dl>
        ${due.map((x) => `<div class="pay-due"><p><strong>${esc(x.title)}</strong> · ${price(x.amount)} due by ${fmtDate(x.dueOn)}</p><button type="button" class="btn btn--dark btn--sm" data-pay="${esc(x.id)}">Pay balance</button></div>`).join("")}
        <p class="pay-note" data-pay-note aria-live="polite"></p>`);

      const upcoming = stay.itinerary.filter((it) => it.date >= todayISO()).slice(0, 3);
      set("next", upcoming.map((it) => `<li><span class="next-list__when">${fmtDate(it.date)} · ${esc(it.time)}</span><span class="next-list__what">${esc(it.title)}</span></li>`).join("") || `<li>Nothing scheduled yet.</li>`);
      const pl = stay.planner;
      set("planner-name", esc(pl.name));
      set("planner-first", esc(pl.name.split(" ")[0]));
      set("planner-lines", `<li><a class="link-quiet" href="mailto:${esc(pl.email)}">${esc(pl.email)}</a></li><li><a class="link-quiet" href="tel:${esc(pl.phone.replace(/[^\d+]/g, ""))}">${esc(pl.phone)}</a></li>`);

      // Itinerary grouped by day
      const byDay = {};
      stay.itinerary.slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).forEach((it) => { (byDay[it.date] = byDay[it.date] || []).push(it); });
      set("itinerary", Object.entries(byDay).map(([date, items]) => {
        const n = nights(stay.arrival, date) + 1;
        return `<li class="itinerary__day"><div class="itinerary__date"><span class="itinerary__n">Day ${n}</span><span>${longDate(date)}</span></div>
          <ul>${items.map((it) => `<li class="itinerary__item"><span class="itinerary__time">${esc(it.time)}</span><div><p class="itinerary__title">${esc(it.title)}</p><p class="itinerary__detail">${esc(it.detail)}</p></div>${pill(it.status)}</li>`).join("")}</ul></li>`;
      }).join(""));

      renderRequests();
      renderMessages();
      renderDocs();

      const a = stay.arrivalInfo || {};
      const addressOn = iso(new Date(parse(stay.arrival).getTime() - 14 * 86400000));
      set("arrival", [["Address", `${esc(v.area)}, ${esc(d.name)}<small>${esc(a.address)}${daysUntil(stay.arrival) > 14 ? ` Expected ${fmtDate(addressOn)}.` : ""}</small>`], ["Check-in", esc(a.checkin)], ["Check-out", esc(a.checkout)], ["Your host", esc(a.host)],
        ["Getting there", esc(a.directions)], ["Nearest airport", esc(d.access)], ["Wi-Fi", esc(a.wifi)], ["Emergency", `Concierge 24 hours · <a class="link-underline" href="tel:${esc((brand.phone || "").replace(/[^\d+]/g, ""))}">${esc(brand.phone || "")}</a>`]]
        .map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join(""));
      renderChecklist();

      // Guest form
      const gf = $("[data-guest-form]");
      Object.entries({ firstName: g.firstName, lastName: g.lastName, email: g.email, phone: g.phone, country: g.country, flight: g.flight || "", dietary: g.dietary, occasion: g.occasion, adults: p.adults, children: p.children })
        .forEach(([k, val]) => { if (gf.elements[k]) gf.elements[k].value = val ?? ""; });
      set("villa-guests", v.guests);
    }

    function renderRequests() {
      set("requests", stay.requests.map((r) => `<li class="request-item"><div class="request-item__head"><p class="request-item__service">${esc(r.service)}</p>${pill(r.status)}</div>
        <p>${esc(r.detail)}</p><p class="request-item__meta">${r.date ? `For ${fmtDate(r.date)} · ` : ""}Sent ${fmtDate(r.created)} · ${esc(r.id)}</p></li>`).join("") || `<li class="muted">No requests yet.</li>`);
    }
    function renderMessages() {
      const notices = [];
      invoices().filter((x) => x.status !== "Paid").forEach((x) => notices.push(["Payment due", `${x.title}: ${price(x.amount)} by ${fmtDate(x.dueOn)}.`]));
      if (daysUntil(stay.arrival) > 14) notices.push(["Arrival details", `The exact address and gate code will appear under Arrival 14 days before you travel.`]);
      if (!stay.guest.flight) notices.push(["Flight details", "Add your arrival flight so your driver can track it."]);
      set("notices", notices.map(([t, x]) => `<li class="notice-item"><p class="notice-item__title">${esc(t)}</p><p>${esc(x)}</p></li>`).join(""));
      set("thread", stay.messages.map((m) => `<li class="msg msg--${m.from === "guest" ? "guest" : "planner"}"><p class="msg__who">${m.from === "guest" ? "You" : esc(stay.planner.name)} · <time datetime="${esc(m.at)}">${stamp(m.at)}</time></p><p class="msg__text">${esc(m.text)}</p></li>`).join(""));
      paintUnread();
    }
    function renderDocs() {
      set("invoices", invoices().map((x) => `<tr><th scope="row">${esc(x.title)}</th><td>${esc(x.id)}</td><td>${fmtDate(x.issued)}</td><td>${price(x.amount)}</td>
        <td>${pill(x.status === "Paid" ? `Paid ${fmtDate(x.paidOn)}` : `Due ${fmtDate(x.dueOn)}`)}</td>
        <td class="doc-table__actions"><button type="button" class="text-btn" data-doc-open="${esc(x.id)}" aria-label="View ${esc(docTitle(x))}">View</button><button type="button" class="text-btn" data-doc-dl="${esc(x.id)}" aria-label="Download ${esc(docTitle(x))}">Download</button></td></tr>`).join(""));
      set("documents", stay.documents.filter((x) => x.kind !== "invoice").map((x) => `<li class="doc-item"><span class="doc-item__icon" aria-hidden="true"></span><div><p class="doc-item__title">${esc(x.title)}</p><p class="doc-item__meta">${esc(x.id)} · issued ${fmtDate(x.issued)}</p></div>
        <div class="doc-item__actions"><button type="button" class="text-btn" data-doc-open="${esc(x.id)}" aria-label="View ${esc(x.title)}">View</button><button type="button" class="text-btn" data-doc-dl="${esc(x.id)}" aria-label="Download ${esc(x.title)}">Download</button></div></li>`).join(""));
    }
    function renderChecklist() {
      const done = stay.checklist.filter((c) => c.done).length;
      set("checklist-progress", `${done} of ${stay.checklist.length} done`);
      set("checklist", stay.checklist.map((c) => `<label class="check"><input type="checkbox" data-check="${esc(c.id)}"${c.done ? " checked" : ""}><span>${esc(c.label)}</span></label>`).join(""));
    }

    /* ----- documents: printable copy + download ----- */
    function docBody(x) {
      const v = S.villa(stay.villa), g = stay.guest;
      const head = `<header class="inv__head"><div><p class="inv__brand">${esc(brand.name || "SOLARA")}</p><p class="inv__sub">${esc(brand.full || "")}</p><p>${esc(brand.address || "")}</p><p>${esc(brand.email || "")}</p></div>
        <div class="inv__meta"><h2 class="inv__title">${esc(x.kind === "invoice" ? (x.status === "Paid" ? "Receipt" : "Invoice") : x.title)}</h2><p>No. ${esc(x.id)}</p><p>Issued ${fmtDate(x.issued)}</p><p>Booking ${esc(stay.reference)}</p></div></header>
        <p class="inv__demo">Demonstration document — sample data only. This is not a valid invoice, receipt or contract.</p>
        <div class="inv__parties"><div><p class="inv__label">Guest</p><p>${esc(g.firstName)} ${esc(g.lastName)}</p><p>${esc(g.email)}</p><p>${esc(g.country || "")}</p></div>
        <div><p class="inv__label">Stay</p><p>${esc(v.name)}, ${esc(v.area)}</p><p>${fmtDate(stay.arrival)} – ${fmtDate(stay.departure)}</p><p>${plural(stay.nights, "night")}</p></div></div>`;
      if (x.kind === "invoice") {
        return `${head}<table class="inv__table"><thead><tr><th scope="col">Description</th><th scope="col">Amount</th></tr></thead>
          <tbody>${x.lines.map(([t, a]) => `<tr><td>${esc(t)}</td><td>${price(a)}</td></tr>`).join("")}</tbody>
          <tfoot><tr><th scope="row">Total (${esc(stay.currency)})</th><td>${price(x.amount)}</td></tr></tfoot></table>
          <p class="inv__status">${x.status === "Paid" ? `Paid in full on ${fmtDate(x.paidOn)} by hosted card payment.` : `Payment due by ${fmtDate(x.dueOn)}. Pay securely through the hosted checkout link sent by your planner.`}</p>
          <p class="inv__foot">Questions about this document? Contact ${esc(stay.planner.name)} at ${esc(stay.planner.email)}.</p>`;
      }
      const bodies = {
        "Booking confirmation": [`We are delighted to confirm your stay at ${v.name}.`, `Arrival ${longDate(stay.arrival)} (${v.policies.checkin}), departure ${longDate(stay.departure)} (${v.policies.checkout}).`, `Rate ${price(stay.rate)} per night, ${plural(stay.nights, "night")}.`, `Cancellation: ${v.policies.cancellation}.`],
        "Rental agreement": ["This demonstration shows where the signed rental agreement for your stay would be stored.", `House rules, occupancy (up to ${v.guests} guests) and the security deposit (${v.policies.deposit}) are set out in the live agreement supplied by the owner.`]
      };
      const lines = bodies[x.title] || [`${x.title} for booking ${stay.reference}.`, "The live document is issued by the property owner or their payment provider."];
      return `${head}<div class="inv__text">${lines.map((l) => `<p>${esc(l)}</p>`).join("")}</div><p class="inv__foot">Questions? Contact ${esc(stay.planner.name)} at ${esc(stay.planner.email)}.</p>`;
    }
    const DOC_CSS = "body{margin:0;padding:40px;font:14px/1.6 Georgia,serif;color:#1d1a17;background:#fff}.inv{max-width:760px;margin:0 auto}.inv__head{display:flex;justify-content:space-between;gap:24px;padding-bottom:20px;border-bottom:1px solid #1d1a17}.inv__brand{font-size:26px;letter-spacing:.3em;margin:0}.inv__sub,.inv__label{font:600 11px/1.4 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7d5f33}.inv__meta{text-align:right}.inv__title{margin:0 0 6px;font-weight:400;font-size:24px}p{margin:0 0 4px}.inv__demo{margin:18px 0;padding:10px 12px;border:1px dashed #9b2c1f;color:#9b2c1f;font:600 12px/1.4 Arial,sans-serif}.inv__parties{display:flex;gap:48px;margin:18px 0}.inv__table{width:100%;border-collapse:collapse;margin:18px 0}.inv__table th,.inv__table td{padding:10px 0;border-bottom:1px solid #ddd;text-align:left}.inv__table td:last-child,.inv__table th:last-child{text-align:right}.inv__table tfoot th,.inv__table tfoot td{border-top:1px solid #1d1a17;font-weight:700}.inv__status{margin-top:12px}.inv__text p{margin:0 0 10px}.inv__foot{margin-top:28px;color:#6b6258;font-size:12px}";
    function downloadDoc(x) {
      const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(docTitle(x))} ${esc(x.id)}</title><style>${DOC_CSS}</style></head><body><article class="inv">${docBody(x)}</article></body></html>`;
      const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
      const a = doc.createElement("a");
      a.href = url; a.download = `${x.id}-${docTitle(x).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.html`;
      doc.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      say(`${docTitle(x)} downloaded.`);
      S.track("portal_document_download", { id: x.id });
    }
    const viewer = $("[data-doc-view]");
    let viewing = null, opener = null;
    async function openDoc(docId, from) {
      viewing = await api.getDocument(docId);
      opener = from;
      $("#doc-view-title").textContent = docTitle(viewing);
      $("[data-doc-body]").innerHTML = `<article class="inv">${docBody(viewing)}</article>`;
      viewer.showModal();
      doc.documentElement.classList.add("is-locked");
      $("[data-doc-close]").focus();
    }
    viewer.addEventListener("close", () => { doc.documentElement.classList.remove("is-locked"); opener && opener.focus(); });
    viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });
    $("[data-doc-close]").addEventListener("click", () => viewer.close());
    $("[data-doc-download]").addEventListener("click", () => viewing && downloadDoc(viewing));
    $("[data-doc-print]").addEventListener("click", () => { doc.body.classList.add("is-printing-doc"); window.print(); });
    window.addEventListener("afterprint", () => doc.body.classList.remove("is-printing-doc"));

    app.addEventListener("click", async (e) => {
      const o = e.target.closest("[data-doc-open]"), dl = e.target.closest("[data-doc-dl]"), pay = e.target.closest("[data-pay]");
      if (o) openDoc(o.dataset.docOpen, o);
      if (dl) downloadDoc(await api.getDocument(dl.dataset.docDl));
      if (pay) {
        const note = $("[data-pay-note]");
        note.textContent = "Demonstration: on a live site this button opens the owner's hosted checkout (for example Stripe Checkout or the booking engine). No payment is taken on this page.";
        S.track("portal_pay_click", { id: pay.dataset.pay });
      }
    });
    app.addEventListener("change", async (e) => {
      const c = e.target.closest("[data-check]");
      if (!c) return;
      stay.checklist = await api.setChecklist(c.dataset.check, c.checked);
      const done = stay.checklist.filter((x) => x.done).length;
      set("checklist-progress", `${done} of ${stay.checklist.length} done`);
    });

    /* ----- forms ----- */
    const rForm = $("[data-request-form]"), rDate = $("#rq-date");
    $("#rq-service").insertAdjacentHTML("beforeend", (D.conciergeServices || []).map((s) => `<option>${esc(s.name)}</option>`).join("") + "<option>Something else</option>");
    S.liveValidation(rForm);
    rForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const st = $("[data-form-status]", rForm);
      st.textContent = ""; st.classList.remove("is-success");
      if (!S.validate(rForm)) return;
      if (rDate.value > stay.departure) { S.setError(rDate, `Choose a date before your departure on ${fmtDate(stay.departure)}.`); rDate.focus(); return; }
      const btn = $("button[type=submit]", rForm);
      S.busy(btn, true);
      try {
        const r = await api.createRequest({ service: rForm.service.value, date: rDate.value, detail: rForm.detail.value.trim() });
        stay.requests.unshift(r);
        renderRequests();
        rForm.reset(); rDate.value = stay.arrival;
        st.classList.add("is-success");
        st.textContent = `Request ${r.id} sent. ${stay.planner.name.split(" ")[0]} will confirm availability and price.${isDemo ? " (Demonstration: nothing was sent.)" : ""}`;
      } catch (err) { st.textContent = err.message || "We couldn't send your request. Please try again."; }
      finally { S.busy(btn, false); }
    });

    const mForm = $("[data-message-form]");
    S.liveValidation(mForm);
    mForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const st = $("[data-form-status]", mForm);
      st.textContent = "";
      if (!S.validate(mForm)) return;
      const btn = $("button[type=submit]", mForm);
      S.busy(btn, true);
      try {
        const m = await api.sendMessage(mForm.message.value.trim());
        stay.messages.push(m); stay.seen = stay.messages.length;
        renderMessages();
        mForm.reset();
        say("Message sent.");
        $("#msg-text").focus();
      } catch (err) { st.textContent = err.message || "We couldn't send your message. Please try again."; }
      finally { S.busy(btn, false); }
    });
    doc.addEventListener("solara:portal-update", async () => {
      if (!stay) return;
      const fresh = await api.getStay().catch(() => null);
      if (!fresh) return;
      const onMessages = !$("#panel-messages").hidden;
      const before = stay.messages.length;
      stay.messages = fresh.messages;
      if (onMessages) stay.seen = stay.messages.length;
      renderMessages();
      if (stay.messages.length > before) say(`New message from ${stay.planner.name}.`);
    });

    const gForm = $("[data-guest-form]");
    S.liveValidation(gForm);
    gForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const st = $("[data-form-status]", gForm);
      st.textContent = ""; st.classList.remove("is-success");
      if (!S.validate(gForm)) return;
      const v = S.villa(stay.villa);
      const adults = Number(gForm.adults.value), children = Number(gForm.children.value);
      if (adults + children > v.guests) { S.setError(gForm.children, `${v.name} sleeps up to ${v.guests} guests (infants in cots excepted).`); gForm.children.focus(); return; }
      const fields = Object.fromEntries(["firstName", "lastName", "email", "phone", "country", "flight", "dietary", "occasion"].map((k) => [k, gForm.elements[k].value.trim()]));
      const btn = $("button[type=submit]", gForm);
      S.busy(btn, true, "Saving…");
      try {
        stay.guest = await api.updateGuest({ ...fields, adults, children });
        stay.party.adults = adults; stay.party.children = children;
        if (fields.flight && !stay.checklist.find((c) => c.id === "flight").done) stay.checklist = await api.setChecklist("flight", true);
        render();
        st.classList.add("is-success");
        st.textContent = `Saved. Your planner can see the updated details.${isDemo ? " (Demonstration: stored in this browser tab only.)" : ""}`;
      } catch (err) { st.textContent = err.message || "We couldn't save your details. Please try again."; }
      finally { S.busy(btn, false); }
    });

    /* ----- session ----- */
    async function openApp(fromSignIn) {
      try { stay = await api.getStay(); } catch { return showSignIn(); }
      stay.seen = stay.seen ?? stay.messages.length - 1;
      render();
      rDate.min = todayISO(); rDate.max = stay.departure; rDate.value = stay.arrival;
      const session = await api.getSession();
      set("account", [["Signed in as", esc(session.email)], ["Booking", esc(session.reference || stay.reference)], ["Signed in", stamp(session.signedInAt)], ["Session ends", stamp(session.expiresAt)], ["Portal mode", isDemo ? "Demonstration — data stays in this browser tab" : "Live"]]
        .map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join(""));
      signin.hidden = true; app.hidden = false;
      selectTab(location.hash.slice(1));
      S.reveals(app);
      if (fromSignIn) { window.scrollTo(0, 0); $("[data-portal-title]").focus(); say(`Signed in. Welcome back, ${stay.guest.firstName}.`); }
    }
    function showSignIn() { stay = null; app.hidden = true; signin.hidden = false; }
    $$("[data-signout]").forEach((b) => b.addEventListener("click", async () => {
      await api.signOut();
      showSignIn();
      form.reset();
      history.replaceState(null, "", window.location.pathname);
      window.scrollTo(0, 0);
      $("#si-ref").focus();
      say("You have signed out.");
      S.track("portal_signout");
    }));
    $("[data-reset-demo]").addEventListener("click", async () => {
      if (!api.reset) return;
      await api.reset();
      showSignIn();
      history.replaceState(null, "", window.location.pathname);
      $("#si-ref").focus();
      say("Demo data reset. Sign in again to start over.");
    });

    S.liveValidation(form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "";
      if (!S.validate(form)) return;
      const btn = $("button[type=submit]", form);
      S.busy(btn, true, "Signing in…");
      try {
        await api.signIn({ reference: form.reference.value, email: form.email.value });
        S.track("portal_signin", { mode: isDemo ? "demo" : "live" });
        await openApp(true);
      } catch (err) {
        status.textContent = err.message || "We couldn't sign you in. Please try again.";
        $("#si-ref").focus();
      } finally { S.busy(btn, false); }
    });

    api.getSession().then((s) => (s ? openApp(false) : showSignIn())).catch(showSignIn);
  }

  const init = { home, villas, villa, destinations, experiences, concierge, about, journal, plan, contact, weddings, wellness, "my-stay": myStay };
  (init[doc.body.dataset.page] || (() => {}))();
  if (doc.body.dataset.page === "journal") newsletter();
  S.reveals();
})();
