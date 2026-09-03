const grid = document.querySelector("#template-grid");
const status = document.querySelector("#library-status");
const searchInput = document.querySelector("#template-search");
const industryFilter = document.querySelector("#industry-filter");
const clearFilters = document.querySelector("#clear-filters");
const emptyState = document.querySelector("#empty-state");

let catalog = [];

function addText(parent, tagName, className, value) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = value;
  parent.append(element);
  return element;
}

function addLink(parent, className, label, href) {
  const link = document.createElement("a");
  link.className = className;
  link.textContent = label;
  link.href = href;
  parent.append(link);
}

function renderTemplate(template) {
  const article = document.createElement("article");
  article.className = "template-card";

  const image = document.createElement("img");
  image.className = "template-card__image";
  image.src = template.previewImage;
  image.alt = `${template.name} template preview`;
  image.loading = "lazy";
  article.append(image);

  const body = document.createElement("div");
  body.className = "template-card__body";
  addText(body, "p", "template-card__category", template.category);
  addText(body, "h2", "template-card__title", template.name);
  addText(body, "p", "template-card__description", template.description);

  const actions = document.createElement("div");
  actions.className = "template-card__actions";
  addLink(actions, "button button--primary", "View working demo", template.demoUrl);
  if (template.shopifyProductUrl) {
    addLink(actions, "button button--secondary", "View in Shopify", template.shopifyProductUrl);
  } else {
    const preview = addText(actions, "span", "button button--secondary", "Premium Preview");
    preview.setAttribute("aria-disabled", "true");
    preview.title = "Shopify listing coming soon";
  }
  body.append(actions);
  article.append(body);
  grid.append(article);
}

function populateIndustries(templates) {
  const categories = [...new Set(templates.map((template) => template.category))].sort();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    industryFilter.append(option);
  });
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const category = industryFilter.value;
  const matches = catalog.filter((template) => {
    const haystack = `${template.name} ${template.category} ${template.description}`.toLowerCase();
    return (!query || haystack.includes(query)) && (!category || template.category === category);
  });

  grid.replaceChildren();
  matches.forEach(renderTemplate);
  emptyState.hidden = matches.length !== 0;
  status.textContent = `${matches.length} of ${catalog.length} working demo${catalog.length === 1 ? "" : "s"} shown.`;
}

async function loadTemplates() {
  try {
    const response = await fetch("/data/templates.json", { credentials: "same-origin" });
    if (!response.ok) throw new Error(`Catalog request failed with status ${response.status}`);
    const templates = await response.json();
    if (!Array.isArray(templates)) throw new TypeError("Catalog must be an array");
    catalog = templates;
    populateIndustries(catalog);
    applyFilters();
  } catch (error) {
    status.textContent = "The demo library could not load. Please refresh the page and try again.";
    console.error("BRIOFRAME catalog load failed", error);
  }
}

searchInput.addEventListener("input", applyFilters);
industryFilter.addEventListener("change", applyFilters);
clearFilters.addEventListener("click", () => {
  searchInput.value = "";
  industryFilter.value = "";
  applyFilters();
  searchInput.focus();
});

loadTemplates();
