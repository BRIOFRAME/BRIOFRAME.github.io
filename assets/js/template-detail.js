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
    highlights.push(`Covers common service themes such as ${template.tags.slice(0, 4).join(", ")}.`);
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
  addText(panel, "p", "", "This template detail page could not be matched to the public catalog.");
  const home = document.createElement("a");
  home.className = "button button--primary";
  home.href = "/#templates";
  home.textContent = "Back to demo library";
  panel.append(home);
  root.append(panel);
}

function addDecisionPath(content, actions) {
  if (content.querySelector("#detail-path-title")) return;
  const section = document.createElement("section");
  section.className = "detail-section detail-decision";
  section.setAttribute("aria-labelledby", "detail-path-title");
  const title = addText(section, "h2", "detail-section__title", "Choose the right BRIOFRAME path");
  title.id = "detail-path-title";

  const grid = document.createElement("div");
  grid.className = "detail-note-grid";

  const templatePath = document.createElement("article");
  templatePath.className = "detail-note";
  addText(templatePath, "h3", "", "Template Studio");
  addText(templatePath, "p", "", "Best when you want a polished starting point you can evaluate through the working demo and move toward launch quickly.");
  grid.append(templatePath);

  const designPath = document.createElement("article");
  designPath.className = "detail-note";
  addText(designPath, "h3", "", "Design Studio");
  addText(designPath, "p", "", "Best when your business needs a tailored experience, deeper customization, or a full-service design and launch engagement.");
  grid.append(designPath);

  const proofPath = document.createElement("article");
  proofPath.className = "detail-note";
  addText(proofPath, "h3", "", "Evaluate before you decide");
  addText(proofPath, "p", "", "Use the live demo, mobile layout, and template details to judge fit before choosing purchase or custom-build support.");
  grid.append(proofPath);

  section.append(grid);
  if (actions) content.insertBefore(section, actions);
  else content.append(section);
}

function addRelatedTemplates(content, actions, template, templates, taxonomy) {
  if (content.querySelector("#detail-related-title")) return;
  const related = templates
    .filter((item) => item.slug !== template.slug && item.industry === template.industry)
    .slice(0, 3);
  if (!related.length) return;

  const section = document.createElement("section");
  section.className = "detail-section detail-related";
  section.setAttribute("aria-labelledby", "detail-related-title");
  const title = addText(section, "h2", "detail-section__title", `More ${industryLabel(taxonomy, template.industry)} templates`);
  title.id = "detail-related-title";

  const list = document.createElement("ul");
  list.className = "detail-list";
  related.forEach((item) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `/templates/${item.slug}/`;
    link.textContent = `${item.name} — ${item.category}`;
    li.append(link);
    list.append(li);
  });
  section.append(list);
  if (actions) content.insertBefore(section, actions);
  else content.append(section);
}

function enhanceStaticDetail(template, taxonomy, templates) {
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
    const highlightsTitle = addText(highlightsSection, "h2", "detail-section__title", "Why this template fits");
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
    const notesTitle = addText(notes, "h2", "detail-section__title", "Built for a confident launch");
    notesTitle.id = "detail-notes-title";

    const noteGrid = document.createElement("div");
    noteGrid.className = "detail-note-grid";
    const noteData = [
      ["Responsive / mobile-ready", "Designed for desktop and mobile viewing so you can evaluate the experience on common devices."],
      ["SEO-ready structure", "Uses a clear page hierarchy and content sections suited to search-oriented website launches."],
      ["Launch & customization", "Start from the working demo and purchase path, or engage BRIOFRAME Design Studio when you need tailored design and launch support."],
    ];
    noteData.forEach(([heading, copy]) => {
      const note = document.createElement("article");
      note.className = "detail-note";
      addText(note, "h3", "", heading);
      addText(note, "p", "", copy);
      noteGrid.append(note);
    });
    notes.append(noteGrid);
    if (actions) content.insertBefore(notes, actions);
    else content.append(notes);
  }

  addDecisionPath(content, actions);
  addRelatedTemplates(content, actions, template, templates, taxonomy);
  root.dataset.enhanced = "true";

  import("/assets/js/phase3-motion.js")
    .then(({ applyMotion }) => applyMotion())
    .catch((error) => console.error("BRIOFRAME Phase 3 motion failed", error));
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
    if (!taxonomy || !Array.isArray(taxonomy.industries)) throw new TypeError("Taxonomy must include an industries array");

    const template = templates.find((item) => item.slug === slug);
    if (!template) {
      if (!hasStaticCore) renderNotFound(`No catalog match for “${slug}”.`);
      return;
    }

    if (hasStaticCore) {
      enhanceStaticDetail(template, taxonomy, templates);
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
