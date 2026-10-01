(() => {
  "use strict";

  function hydrateVillaFirstPaint() {
    const D = window.SOLARA_DATA;
    if (!D || !Array.isArray(D.villas)) return false;

    const id = new URLSearchParams(location.search).get("id") || document.body.dataset.villaId || (D.villas[0] && D.villas[0].id);
    const v = D.villas.find((x) => x.id === id);
    if (!v) return false;

    const d = (D.destinations || []).find((x) => x.id === v.destination);
    const fillText = (key, value) => {
      document.querySelectorAll('[data-v="' + key + '"]').forEach((el) => {
        el.textContent = value == null ? "" : value;
      });
    };

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
      if (!el.textContent.trim()) {
        (v.description || []).forEach((text) => {
          const p = document.createElement("p");
          p.textContent = text;
          el.appendChild(p);
        });
      }
    });

    document.querySelectorAll('[data-v="highlights"]').forEach((el) => {
      if (!el.textContent.trim()) {
        (v.highlights || []).forEach((text) => {
          const li = document.createElement("li");
          li.textContent = text;
          el.appendChild(li);
        });
      }
    });

    document.querySelectorAll('[data-v="specs"]').forEach((el) => {
      if (!el.children.length) {
        [[v.bedrooms, "Bedrooms"], [v.baths, "Bathrooms"], [v.guests, "Guests"],
         [v.size ? v.size.toLocaleString() + " m²" : "", "Interior"], [v.type, "Property"]]
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
      }
    });

    const gallery = document.querySelector("[data-gallery]");
    if (gallery && !gallery.children.length) {
      const hero = (v.images || []).find((im) => im.hero) || (v.images || [])[0];
      const meta = hero && window.SOLARA_IMAGES && window.SOLARA_IMAGES[hero.src];
      if (hero && meta) {
        const remote = window.SOLARA_PHOTO_SOURCES || {};
        const rid = remote.photos && remote.photos[hero.src];
        const [w, h, widths] = meta;
        const imgUrl = (size) => rid
          ? remote.base + rid + "?w=" + size + "&" + remote.query
          : "../assets/img/photo/" + hero.src + "-" + size + ".webp";
        const stage = document.createElement("div");
        const track = document.createElement("div");
        const slide = document.createElement("figure");
        const open = document.createElement("div");
        const img = document.createElement("img");

        gallery.classList.add("gal", "gal--prepaint");
        stage.className = "gal__stage";
        track.className = "gal__track";
        slide.className = "gal__slide";
        open.className = "gal__open";

        img.src = imgUrl(widths.includes(1280) ? 1280 : widths[widths.length - 1]);
        img.srcset = widths.map((size) => imgUrl(size) + " " + size + "w").join(", ");
        img.sizes = "(min-width: 1100px) 70vw, 100vw";
        img.width = w;
        img.height = h;
        img.alt = hero.alt || v.name;
        img.fetchPriority = "high";
        img.decoding = "async";

        open.appendChild(img);
        slide.appendChild(open);
        track.appendChild(slide);
        stage.appendChild(track);
        gallery.appendChild(stage);
      }
    }

    document.documentElement.dataset.villaTextReady = "true";
    return true;
  }

  window.SOLARA_HYDRATE_VILLA = hydrateVillaFirstPaint;
  hydrateVillaFirstPaint();

  window.addEventListener("pageshow", () => {
    hydrateVillaFirstPaint();
    requestAnimationFrame(hydrateVillaFirstPaint);
    setTimeout(hydrateVillaFirstPaint, 120);
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) hydrateVillaFirstPaint();
  });
})();