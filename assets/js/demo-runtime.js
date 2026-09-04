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
        if (!purchase && record.shopifyProductUrl) {
          purchase = record.shopifyProductUrl;
        }
      }
    }

    const canPurchase = availability === "Available" && Boolean(purchase);

    fallback.remove();
    document.documentElement.style.setProperty("--bg", cfg.bg);
    document.documentElement.style.setProperty("--fg", cfg.fg);
    document.documentElement.style.setProperty("--accent", cfg.accent);
    document.documentElement.style.setProperty("--soft", cfg.soft);
    document.body.className = `layout-${cfg.layout}`;

    const metrics = cfg.metrics.map(([value,label]) =>
      `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`).join("");
    const serviceCopy = [
      "Purpose-built guidance, clear scope, and a next step that is easy to act on.",
      "A focused pathway designed around what this visitor needs to decide.",
      "Specific proof and practical details replace generic marketing language."
    ];
    const services = cfg.sections.map((name,index) =>
      `<article class="service"><span>0${index+1}</span><h3>${name}</h3><p>${serviceCopy[index]}</p></article>`).join("");
    const purchaseAction = canPurchase
      ? `<a class="btn primary" data-purchase-link="verified" data-live-purchase href="${purchase}">Purchase this BRIOFRAME template</a>`
      : '<span class="btn ghost" aria-disabled="true">Premium Preview · Shopify listing coming soon</span>';

    document.body.innerHTML = `
      <div class="demo-bar"><span>BRIOFRAME working demo · Simulated demo interactions do not transmit or store data.</span><a href="/">Return to Template Library</a></div>
      <header><a class="brand" href="#top">${cfg.name}</a><nav aria-label="Demo navigation"><a href="#services">Services</a><a href="#proof">Why us</a><a href="#contact">Contact</a></nav></header>
      <main id="top">
        <section class="hero ${cfg.reverse ? "reverse" : ""}">
          <div class="copy"><p class="kicker">${cfg.kicker}</p><h1>${cfg.headline}</h1><p class="lede">${cfg.lede}</p><div class="actions"><a class="btn primary" href="#contact">${cfg.cta}</a><a class="btn ghost" href="#services">Explore the experience</a></div></div>
          <div class="visual"><div class="visual-art" data-visual="${cfg.visual}"><b>${cfg.category}</b><span>${cfg.name}</span></div></div>
        </section>
        <section class="metrics" aria-label="Key proof points">${metrics}</section>
        <section class="content" id="services"><div class="section-head"><p class="kicker">BUILT AROUND THE DECISION</p><div><h2>Show people what matters before asking them to act.</h2><p>${cfg.proof}</p></div></div><div class="services">${services}</div></section>
        <section class="proof" id="proof"><div><p class="kicker">BRIOFRAME CONVERSION LOGIC</p><h2>Specific beats generic.</h2></div><div class="proof-card"><p>${cfg.proof}</p></div></section>
        <section class="contact" id="contact"><div><p class="kicker">NEXT STEP</p><h2>${cfg.cta}.</h2><p class="lede">This form demonstrates the intended lead flow only. It does not send or save information in this public demo.</p><div class="actions">${purchaseAction}</div></div><form data-demo-form><label for="name">Name</label><input id="name" name="name" autocomplete="name"><label for="email">Email</label><input id="email" type="email" name="email" autocomplete="email"><label for="message">What can we help with?</label><textarea id="message" name="message"></textarea><button type="submit">Simulate request</button><p class="sim">Simulated demo — this form does not transmit or store data.</p><p class="sim" data-form-status aria-live="polite"></p></form></section>
      </main>
      <footer><span>© 2026 ${cfg.name} demo concept.</span><span>Designed for evaluation by BRIOFRAME Template Studio.</span></footer>`;
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
