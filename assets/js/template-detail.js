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
  root.removeAttribute("data-static-detail");
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

function enhanceStaticDetail(template, taxonomy) {
  const industryName = industryLabel(taxonomy, template.industry);
  if (status) status.textContent = `${industryName} · ${template.category}`;
  if (root.dataset.enhanced === "true") return;

  const content = root.querySelector(".detail-content");
  if (!content) return;
  const actions = content.querySelector(".detail-actions");

  if (!content.querySelector("#detail-highlights-title")) {
    const highlightsSection = document.createElement("section");
    highlightsSection.className = "detail-section";
    highlightsSection.setAttribute("aria-labelledby", "detail-highlights-title");
    const highlightsTitle = addText(highlightsSection, "h2", "detail-section__title", "Key features");
    highlightsTitle.id = "detail-highlights-title";
    const list = document.createElement("ul");
    list.className = "detail-list";
    buildHighlights(template, industryName).forEach((item) => addText(list, "li", "", item));
    highlightsSection.append(list);
    if (actions) content.insertBefore(highlightsSection, actions);
    else content.append(highlightsSection);
  }

  if (!content.querySelector("#detail-notes-title")) {
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
    if (actions) content.insertBefore(notes, actions);
    else content.append(notes);
  }

  root.dataset.enhanced = "true";
}

async function loadDetail() {
  if (!root) return;

  const slug = root.dataset.slug || slugFromPath();
  const hasStaticCore = root.getAttribute("data-static-detail") === "true"
    && Boolean(root.querySelector(".detail-layout"))
    && Boolean(root.querySelector(".detail-title"));

  if (!slug) {
    if (!hasStaticCore) renderNotFound("Missing template slug.");
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
      if (!hasStaticCore) renderNotFound(`No catalog match for “${slug}”.`);
      return;
    }

    if (hasStaticCore) {
      enhanceStaticDetail(template, taxonomy);
      return;
    }

    renderNotFound("Template detail markup is incomplete.");
  } catch (error) {
    if (hasStaticCore) {
      console.error("BRIOFRAME template detail enhancement failed", error);
      return;
    }
    renderNotFound("The template detail page could not load. Please refresh and try again.");
    console.error("BRIOFRAME template detail load failed", error);
  }
}

loadDetail();
