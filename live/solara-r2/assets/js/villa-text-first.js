(() => {
  "use strict";
  const D = window.SOLARA_DATA;
  if (!D || !Array.isArray(D.villas)) return;
  const id = new URLSearchParams(location.search).get("id") || (D.villas[0] && D.villas[0].id);
  const v = D.villas.find((x) => x.id === id);
  if (!v) return;
  const d = (D.destinations || []).find((x) => x.id === v.destination);
  const fillText = (key, value) => document.querySelectorAll('[data-v="' + key + '"]').forEach((el) => { el.textContent = value == null ? "" : value; });

  fillText("name", v.name);
  fillText("where", [v.area, d && d.name, d && d.country].filter(Boolean).join(" · "));
  fillText("summary", v.summary);
  fillText("min", "Minimum stay " + v.minNights + " nights");

  const cfg = (window.SOLARA_CONFIG && window.SOLARA_CONFIG.currency) || {};
  try {
    fillText("price", new Intl.NumberFormat(cfg.locale || "en-US", {
      style: "currency",
      currency: cfg.code || "USD",
      maximumFractionDigits: 0
    }).format(v.priceFrom));
  } catch {}

  document.querySelectorAll('[data-v="description"]').forEach((el) => {
    if (el.textContent.trim()) return;
    (v.description || []).forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      el.appendChild(p);
    });
  });

  document.querySelectorAll('[data-v="highlights"]').forEach((el) => {
    if (el.textContent.trim()) return;
    (v.highlights || []).forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      el.appendChild(li);
    });
  });

  document.querySelectorAll('[data-v="specs"]').forEach((el) => {
    if (el.children.length) return;
    [[v.bedrooms, "Bedrooms"], [v.baths, "Bathrooms"], [v.guests, "Guests"], [v.size ? v.size.toLocaleString() + " m²" : "", "Interior"], [v.type, "Property"]]
      .forEach(([value, label]) => {
        const li = document.createElement("li");
        const a = document.createElement("span");
        const b = document.createElement("span");
        a.className = "specs__v";
        b.className = "specs__k";
        a.textContent = value;
        b.textContent = label;
        li.append(a, b);
        el.appendChild(li);
      });
  });

  document.documentElement.dataset.villaTextReady = "true";
})();