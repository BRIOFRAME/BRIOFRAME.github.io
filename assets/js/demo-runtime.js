function industryFeature(cfg){
  const roles=cfg.sectionRoles||["capabilities","proof"];
  const map={
    "cinematic-aviation":["MISSION CONTROL","Operational readiness, fleet coordination and safety proof belong in the foreground—not buried in a generic services grid."],
    "authority-legal":["CASE STRATEGY","Practice focus, attorney credibility and evidence of process should establish authority before the consultation ask."],
    "performance-auto":["RESULTS IN MOTION","Transformation proof, protection packages and booking logic should feel like a performance experience."],
    "immersive-villa":["THE STAY, BEFORE THE STAY","Property storytelling, cinematic media and a direct availability path should carry the experience."],
    "trust-healthcare":["CARE WITH CONTEXT","Care model, physician access and appointment expectations should reduce uncertainty before a patient acts."]
  };
  const item=map[cfg.architecture] || [cfg.kicker, cfg.proof];
  return `<section class="industry-feature" data-section-role="${roles[0]}"><p class="kicker">${item[0]}</p><h2>${item[1]}</h2><div class="industry-rule" aria-hidden="true"></div></section>`;
}

function optionalModules(cfg){
  const modules=cfg.modules||[];
  const blocks=[];
  if(modules.includes("media-player")&&cfg.videoSrc){
    blocks.push(`<section class="media-module" data-module="media-player"><div class="section-head"><p class="kicker">IMMERSIVE PREVIEW</p><div><h2>See the experience in motion.</h2><p>Sample footage demonstrates the media-ready variant and can be replaced with client-owned video.</p></div></div><video controls preload="metadata" playsinline poster="${cfg.videoPoster||cfg.heroImage}"><source src="${cfg.videoSrc}" type="video/mp4">Your browser does not support HTML5 video.</video></section>`);
  }
  if(modules.includes("image-slider")&&Array.isArray(cfg.galleryImages)&&cfg.galleryImages.length>1){
    const slides=cfg.galleryImages.map((src,i)=>`<figure class="slider-slide${i===0?" is-active":""}" data-slide="${i}"><img src="${src}" alt="${cfg.name} gallery image ${i+1}" loading="lazy"></figure>`).join("");
    blocks.push(`<section class="slider-module" data-module="image-slider"><div class="slider-head"><div><p class="kicker">VISUAL GALLERY</p><h2>Explore the setting.</h2></div><div class="slider-controls"><button type="button" data-slider-prev aria-label="Previous image">←</button><button type="button" data-slider-next aria-label="Next image">→</button></div></div><div class="slider-stage">${slides}</div></section>`);
  }
  return blocks.join("");
}

async function startDemo() {
  const slug = location.pathname.split("/").filter(Boolean).pop();
  const fallback = document.querySelector(".runtime-fallback");
  let purchase = fallback?.querySelector('[data-purchase-link="verified"]')?.href || "";
  let availability = purchase ? "Available" : "";

  try {
    const localConfig = document.querySelector("[data-demo-config]");
    let cfg;
    if (localConfig) {
      cfg = JSON.parse(localConfig.textContent);
    } else {
      const response = await fetch("/data/demo-config.json", { credentials: "same-origin" });
      if (!response.ok) throw new Error(`Demo configuration request failed: ${response.status}`);
      cfg = (await response.json())[slug];
    }
    if (!cfg) throw new Error("Unknown demo");

    const manifestResponse = await fetch("/data/templates.json", { credentials: "same-origin" });
    if (manifestResponse.ok) {
      const templates = await manifestResponse.json();
      const record = templates.find((template) => template.slug === slug);
      if (record) {
        availability = record.availability || availability;
        if (!purchase && record.shopifyProductUrl) purchase = record.shopifyProductUrl;
      }
    }

    const canPurchase = availability === "Available" && Boolean(purchase);
    const metrics = cfg.metrics.map(([value, label]) =>
      `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`
    ).join("");
    const serviceCopy = [
      "Purpose-built guidance, clear scope, and a next step that is easy to act on.",
      "A focused pathway designed around what this visitor needs to decide.",
      "Specific proof and practical details replace generic marketing language."
    ];
    const services = cfg.sections.map((name, index) =>
      `<article class="service"><span aria-hidden="true">0${index + 1}</span><h3>${name}</h3><p>${serviceCopy[index]}</p></article>`
    ).join("");
    const purchaseAction = canPurchase
      ? `<a class="btn primary" data-purchase-link="verified" data-live-purchase href="${purchase}" rel="noopener noreferrer">Purchase this BRIOFRAME template</a>`
      : '<span class="btn ghost" aria-disabled="true">Premium Preview · Shopify listing coming soon</span>';

    const heroVisual = cfg.heroImage
      ? `<figure class="demo-hero-photo">
          <img src="${cfg.heroImage}" alt="" loading="eager" decoding="async">
          <div class="demo-hero-overlay" aria-hidden="true"></div>
          <figcaption><b>${cfg.category}</b><span>${cfg.name}</span></figcaption>
        </figure>`
      : `<div class="visual-art" data-visual="${cfg.visual}"><b>${cfg.category}</b><span>${cfg.name}</span></div>`;

    fallback?.remove();
    document.documentElement.style.setProperty("--bg", cfg.bg);
    document.documentElement.style.setProperty("--fg", cfg.fg);
    document.documentElement.style.setProperty("--accent", cfg.accent);
    document.documentElement.style.setProperty("--soft", cfg.soft);
    document.body.className = `layout-${cfg.layout} architecture-${cfg.architecture || "standard"}`;
    document.documentElement.dataset.layoutFamily = cfg.architecture || "standard";

    document.body.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to demo content</a>
      <div class="demo-bar"><span>BRIOFRAME working demo · Simulated demo interactions do not transmit or store data.</span><a href="/">Return to Template Library</a></div>
      <header>
        <a class="brand" href="#top">${cfg.name}</a>
        <nav aria-label="Demo navigation">
          <a href="#services">Services</a>
          <a href="#proof">Why us</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <main id="main-content">
        <section class="hero ${cfg.reverse ? "reverse" : ""}" aria-labelledby="demo-title" id="top">
          <div class="copy">
            <p class="kicker">${cfg.kicker}</p>
            <h1 id="demo-title">${cfg.headline}</h1>
            <p class="lede">${cfg.lede}</p>
            <div class="actions">
              <a class="btn primary" href="#contact">${cfg.cta}</a>
              <a class="btn ghost" href="#services">Explore the experience</a>
            </div>
          </div>
          <div class="visual" aria-hidden="true">${heroVisual}</div>
        </section>
        <section class="metrics" aria-label="Key proof points">${metrics}</section>
        ${industryFeature(cfg)}
        <section class="content" id="services" data-section-role="${(cfg.sectionRoles||[])[0] || "service-path"}" aria-labelledby="services-title">
          <div class="section-head">
            <p class="kicker">BUILT AROUND THE DECISION</p>
            <div>
              <h2 id="services-title">Show people what matters before asking them to act.</h2>
              <p>${cfg.proof}</p>
            </div>
          </div>
          <div class="services">${services}</div>
        </section>
        <section class="proof" id="proof" data-section-role="${(cfg.sectionRoles||[])[1] || "proof"}" aria-labelledby="proof-title">
          <div><p class="kicker">BRIOFRAME CONVERSION LOGIC</p><h2 id="proof-title">Specific beats generic.</h2></div>
          <div class="proof-card"><p>${cfg.proof}</p></div>
        </section>
        ${optionalModules(cfg)}
        <section class="contact" id="contact" aria-labelledby="contact-title">
          <div>
            <p class="kicker">NEXT STEP</p>
            <h2 id="contact-title">${cfg.cta}.</h2>
            <p class="lede">This form demonstrates the intended lead flow only. It does not send or save information in this public demo.</p>
            <div class="actions">${purchaseAction}</div>
          </div>
          <form data-demo-form>
            <label for="name">Name</label><input id="name" name="name" autocomplete="name" required>
            <label for="email">Email</label><input id="email" type="email" name="email" autocomplete="email" required>
            <label for="message">What can we help with?</label><textarea id="message" name="message" required></textarea>
            <button type="submit">Simulate request</button>
            <p class="sim">Simulated demo — this form does not transmit or store data.</p>
            <p class="sim" data-form-status aria-live="polite"></p>
          </form>
        </section>
      </main>
      <footer><span>© 2026 ${cfg.name} demo concept.</span><span>Designed for evaluation by BRIOFRAME Template Studio.</span></footer>`;


    document.querySelectorAll('[data-module="image-slider"]').forEach((slider)=>{
      const slides=[...slider.querySelectorAll('[data-slide]')];
      let index=0;
      const show=(next)=>{slides[index].classList.remove('is-active');index=(next+slides.length)%slides.length;slides[index].classList.add('is-active');};
      slider.querySelector('[data-slider-prev]')?.addEventListener('click',()=>show(index-1));
      slider.querySelector('[data-slider-next]')?.addEventListener('click',()=>show(index+1));
    });
    document.querySelector("[data-demo-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      document.querySelector("[data-form-status]").textContent = "Demo complete — no information was sent.";
    });
  } catch (error) {
    console.error("BRIOFRAME demo load failed", error);
    if (fallback) fallback.style.display = "block";
  }
}

startDemo();
