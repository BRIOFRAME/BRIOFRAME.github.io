const root = document.querySelector("#template-detail");
const status = document.querySelector("#template-detail-status");

function addText(parent, tagName, className, value) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = value;
  parent.append(element);
  return element;
}

function industryLabel(taxonomy, industryId) {
  const match = (taxonomy.industries || []).find((item) => item.id === industryId);
  return match ? match.label : industryId;
}

function slugFromPath() {
  const parts = window.location.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  const templatesIndex = parts.indexOf("templates");
  if (templatesIndex === -1 || !parts[templatesIndex + 1]) return "";
  return parts[templatesIndex + 1];
}

function buildHighlights(template, industryName) {
  const highlights = [
    `Positioned for ${industryName} businesses in the ${template.category} specialty.`,
  ];
  if (Array.isArray(template.tags) && template.tags.length) {
    highlights.push(
      `Covers common service themes such as ${template.tags.slice(0, 4).join(", ")}.`
    );
  }
  highlights.push("Includes a public working demo so you can evaluate the live experience before purchase.");
  if (template.availability === "Available" && template.shopifyProductUrl) {
    highlights.push("Available to purchase securely through Shopify.");
  } else {
    highlights.push("Listed as a premium preview while the Shopify listing is prepared.");
  }
  return highlights;
}

function renderNotFound(message) {
  if (status) status.textContent = message;
  if (!root) return;
  root.replaceChildren();
  const panel = document.createElement("div");
  panel.className = "detail-missing";
  addText(panel, "h1", "", "Template not found");
  addText(
    panel,
    "p",
    "",
    "This template detail page could not be matched to the public catalog."
  );
  const home = document.createElement("a");
  home.className = "button button--primary";
  home.href = "/#templates";
  home.textContent = "Back to demo library";
  panel.append(home);
  root.append(panel);
}

function renderDetail(template, taxonomy) {
  const industryName = industryLabel(taxonomy, template.industry);
  if (status) {
    status.textContent = `${industryName} · ${template.category}`;
  }

  root.replaceChildren();

  const layout = document.createElement("div");
  layout.className = "detail-layout";

  const media = document.createElement("div");
  media.className = "detail-media";
  const image = document.createElement("img");
  image.className = "detail-media__image";
  image.src = template.previewImage;
  image.alt = `${template.name} template preview`;
  media.append(image);
  layout.append(media);

  const content = document.createElement("div");
  content.className = "detail-content";

  const meta = document.createElement("div");
  meta.className = "detail-meta";
  addText(meta, "p", "detail-meta__industry", industryName);
  addText(meta, "p", "detail-meta__category", template.category);
  const availability = addText(meta, "p", "detail-meta__availability", template.availability);
  availability.dataset.availability = template.availability;
  content.append(meta);

  addText(content, "h1", "detail-title", template.name);
  addText(content, "p", "detail-description", template.description);

  const highlightsSection = document.createElement("section");
  highlightsSection.className = "detail-section";
  highlightsSection.setAttribute("aria-labelledby", "detail-highlights-title");
  const highlightsTitle = addText(highlightsSection, "h2", "detail-section__title", "Key features");
  highlightsTitle.id = "detail-highlights-title";
  const list = document.createElement("ul");
  list.className = "detail-list";
  buildHighlights(template, industryName).forEach((item) => {
    addText(list, "li", "", item);
  });
  highlightsSection.append(list);
  content.append(highlightsSection);

  const notes = document.createElement("section");
  notes.className = "detail-section detail-notes";
  notes.setAttribute("aria-labelledby", "detail-notes-title");
  const notesTitle = addText(notes, "h2", "detail-section__title", "Launch notes");
  notesTitle.id = "detail-notes-title";

  const noteGrid = document.createElement("div");
  noteGrid.className = "detail-note-grid";

  const responsive = document.createElement("article");
  responsive.className = "detail-note";
  addText(responsive, "h3", "", "Responsive / mobile-ready");
  addText(
    responsive,
    "p",
    "",
    "Designed for desktop and mobile viewing so you can evaluate the experience on common devices."
  );
  noteGrid.append(responsive);

  const seo = document.createElement("article");
  seo.className = "detail-note";
  addText(seo, "h3", "", "SEO-ready structure");
  addText(
    seo,
    "p",
    "",
    "Uses a clear page hierarchy and content sections suited to search-oriented website launches."
  );
  noteGrid.append(seo);

  const launch = document.createElement("article");
  launch.className = "detail-note";
  addText(launch, "h3", "", "Launch & customization");
  addText(
    launch,
    "p",
    "",
    "Start from the working demo and purchase path, or engage BRIOFRAME Design Studio when you need tailored design and launch support."
  );
  noteGrid.append(launch);
  notes.append(noteGrid);
  content.append(notes);

  const actions = document.createElement("div");
  actions.className = "detail-actions";
  actions.setAttribute("aria-label", "Template actions");

  const demo = document.createElement("a");
  demo.className = "button button--primary";
  demo.href = template.demoUrl;
  demo.textContent = "View working demo";
  actions.append(demo);

  if (template.availability === "Available" && template.shopifyProductUrl) {
    const shopify = document.createElement("a");
    shopify.className = "button button--secondary";
    shopify.href = template.shopifyProductUrl;
    shopify.rel = "noopener noreferrer";
    shopify.textContent = "View in Shopify";
    actions.append(shopify);
  } else {
    const preview = addText(actions, "span", "button button--secondary", "Premium Preview");
    preview.setAttribute("aria-disabled", "true");
    preview.title = "Shopify listing coming soon";
  }

  const studio = document.createElement("a");
  studio.className = "button button--ghost";
  studio.href = "/#design-studio";
  studio.textContent = "Need customization? Design Studio";
  actions.append(studio);

  const back = document.createElement("a");
  back.className = "text-link detail-back";
  back.href = `/#templates`;
  if (template.industry) {
    back.href = `/?industry=${encodeURIComponent(template.industry)}#templates`;
  }
  back.textContent = "Back to library";
  actions.append(back);

  content.append(actions);
  layout.append(content);
  root.append(layout);
}

async function loadDetail() {
  const slug = slugFromPath();
  if (!slug) {
    renderNotFound("Missing template slug.");
    return;
  }

  try {
    const [templatesResponse, taxonomyResponse] = await Promise.all([
      fetch("/data/templates.json", { credentials: "same-origin" }),
      fetch("/data/taxonomy.json", { credentials: "same-origin" }),
    ]);
    if (!templatesResponse.ok) throw new Error(`Catalog request failed with status ${templatesResponse.status}`);
    if (!taxonomyResponse.ok) throw new Error(`Taxonomy request failed with status ${taxonomyResponse.status}`);

    const templates = await templatesResponse.json();
    const taxonomy = await taxonomyResponse.json();
    if (!Array.isArray(templates)) throw new TypeError("Catalog must be an array");
    if (!taxonomy || !Array.isArray(taxonomy.industries)) {
      throw new TypeError("Taxonomy must include an industries array");
    }

    const template = templates.find((item) => item.slug === slug);
    if (!template) {
      renderNotFound(`No catalog match for “${slug}”.`);
      return;
    }

    renderDetail(template, taxonomy);
  } catch (error) {
    renderNotFound("The template detail page could not load. Please refresh and try again.");
    console.error("BRIOFRAME template detail load failed", error);
  }
}

loadDetail();
