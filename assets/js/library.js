const grid = document.querySelector("#template-grid");
const status = document.querySelector("#library-status");
const searchInput = document.querySelector("#template-search");
const industryFilter = document.querySelector("#industry-filter");
const categoryFilter = document.querySelector("#category-filter");
const availabilityFilter = document.querySelector("#availability-filter");
const clearFilters = document.querySelector("#clear-filters");
const emptyClearFilters = document.querySelector("#empty-clear-filters");
const emptyState = document.querySelector("#empty-state");
const emptyHint = document.querySelector("#empty-state-hint");
const activeFilters = document.querySelector("#active-filters");

let catalog = [];
let taxonomy = { industries: [] };

function addText(parent, tagName, className, value) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = value;
  parent.append(element);
  return element;
}

function industryLabel(industryId) {
  const match = taxonomy.industries.find((item) => item.id === industryId);
  return match ? match.label : industryId;
}

function sortedIndustries() {
  return [...taxonomy.industries].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.label.localeCompare(b.label));
}

function renderTemplate(template) {
  const article = document.createElement("article");
  article.className = "template-card";
  article.dataset.industry = template.industry || "";
  article.dataset.category = template.category || "";
  article.dataset.availability = template.availability || "";

  const detailUrl = `/templates/${template.slug}/`;

  const imageLink = document.createElement("a");
  imageLink.className = "template-card__media";
  imageLink.href = detailUrl;
  imageLink.setAttribute("aria-label", `View details for ${template.name}`);

  const image = document.createElement("img");
  image.className = "template-card__image";
  image.src = template.previewImage;
  image.alt = `${template.name} template preview`;
  image.loading = "lazy";
  imageLink.append(image);
  article.append(imageLink);

  const body = document.createElement("div");
  body.className = "template-card__body";

  const meta = document.createElement("div");
  meta.className = "template-card__meta";
  addText(meta, "p", "template-card__industry", industryLabel(template.industry));
  addText(meta, "p", "template-card__category", template.category);
  const availability = addText(meta, "p", "template-card__availability", template.availability || "");
  availability.dataset.availability = template.availability || "";
  body.append(meta);

  const title = document.createElement("h3");
  title.className = "template-card__title";
  const titleLink = document.createElement("a");
  titleLink.className = "template-card__title-link";
  titleLink.href = detailUrl;
  titleLink.textContent = template.name;
  title.append(titleLink);
  body.append(title);

  addText(body, "p", "template-card__description", template.description);

  const details = document.createElement("a");
  details.className = "template-card__details";
  details.href = detailUrl;
  details.textContent = "View template details";
  body.append(details);

  const actions = document.createElement("div");
  actions.className = "template-card__actions";
  actions.setAttribute("aria-label", `${template.name} purchase actions`);

  const demo = document.createElement("a");
  demo.className = "button button--primary";
  demo.textContent = "View working demo";
  demo.href = template.demoUrl;
  actions.append(demo);

  if (template.availability === "Available" && template.shopifyProductUrl) {
    const shopify = document.createElement("a");
    shopify.className = "button button--secondary";
    shopify.textContent = "View in Shopify";
    shopify.href = template.shopifyProductUrl;
    shopify.rel = "noopener noreferrer";
    actions.append(shopify);
  } else {
    const preview = addText(actions, "span", "button button--secondary", "Premium Preview");
    preview.setAttribute("aria-disabled", "true");
    preview.title = "Shopify listing coming soon";
  }

  body.append(actions);
  article.append(body);
  grid.append(article);
}

function populateIndustryOptions() {
  const used = new Set(catalog.map((template) => template.industry));
  industryFilter.replaceChildren();
  const all = document.createElement("option");
  all.value = "";
  all.textContent = "All industries";
  industryFilter.append(all);

  sortedIndustries()
    .filter((industry) => used.has(industry.id))
    .forEach((industry) => {
      const count = catalog.filter((template) => template.industry === industry.id).length;
      const option = document.createElement("option");
      option.value = industry.id;
      option.textContent = `${industry.label} (${count})`;
      industryFilter.append(option);
    });
}

function populateCategoryOptions(selectedIndustry = "") {
  const previous = categoryFilter.value;
  const categories = [...new Set(
    catalog
      .filter((template) => !selectedIndustry || template.industry === selectedIndustry)
      .map((template) => template.category)
  )].sort((a, b) => a.localeCompare(b));

  categoryFilter.replaceChildren();
  const all = document.createElement("option");
  all.value = "";
  all.textContent = selectedIndustry ? "All specialties" : "All specialties";
  categoryFilter.append(all);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });

  if (previous && categories.includes(previous)) {
    categoryFilter.value = previous;
  } else {
    categoryFilter.value = "";
  }
}

function readFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  searchInput.value = params.get("q") || "";
  industryFilter.value = params.get("industry") || "";
  populateCategoryOptions(industryFilter.value);
  categoryFilter.value = params.get("category") || "";
  availabilityFilter.value = params.get("availability") || "";
}

function writeFiltersToUrl() {
  const params = new URLSearchParams();
  const query = searchInput.value.trim();
  if (query) params.set("q", query);
  if (industryFilter.value) params.set("industry", industryFilter.value);
  if (categoryFilter.value) params.set("category", categoryFilter.value);
  if (availabilityFilter.value) params.set("availability", availabilityFilter.value);

  const next = params.toString();
  const url = next ? `${window.location.pathname}?${next}` : window.location.pathname;
  window.history.replaceState({}, "", url);
}

function templateMatches(template) {
  const query = searchInput.value.trim().toLowerCase();
  const industry = industryFilter.value;
  const category = categoryFilter.value;
  const availability = availabilityFilter.value;
  const tags = Array.isArray(template.tags) ? template.tags.join(" ") : "";
  const haystack = [
    template.name,
    template.category,
    template.description,
    template.industry,
    industryLabel(template.industry),
    tags,
    template.availability
  ].join(" ").toLowerCase();

  return (
    (!query || haystack.includes(query)) &&
    (!industry || template.industry === industry) &&
    (!category || template.category === category) &&
    (!availability || template.availability === availability)
  );
}

function renderActiveFilters(matchCount) {
  if (!activeFilters) return;
  activeFilters.replaceChildren();
  const chips = [];
  if (industryFilter.value) {
    chips.push(["Industry", industryLabel(industryFilter.value), () => {
      industryFilter.value = "";
      populateCategoryOptions("");
      applyFilters();
    }]);
  }
  if (categoryFilter.value) {
    chips.push(["Specialty", categoryFilter.value, () => {
      categoryFilter.value = "";
      applyFilters();
    }]);
  }
  if (availabilityFilter.value) {
    chips.push(["Availability", availabilityFilter.value, () => {
      availabilityFilter.value = "";
      applyFilters();
    }]);
  }
  if (searchInput.value.trim()) {
    chips.push(["Search", searchInput.value.trim(), () => {
      searchInput.value = "";
      applyFilters();
      searchInput.focus();
    }]);
  }

  if (!chips.length) {
    activeFilters.hidden = true;
    return;
  }

  activeFilters.hidden = false;
  chips.forEach(([label, value, onClear]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-chip";
    button.setAttribute("aria-label", `Remove ${label} filter ${value}`);
    button.textContent = `${label}: ${value} ×`;
    button.addEventListener("click", onClear);
    activeFilters.append(button);
  });

  const summary = document.createElement("span");
  summary.className = "filter-chip-summary";
  summary.textContent = `${matchCount} match${matchCount === 1 ? "" : "es"}`;
  activeFilters.append(summary);
}

function applyFilters({ syncUrl = true } = {}) {
  const matches = catalog.filter(templateMatches);
  grid.replaceChildren();
  matches.forEach(renderTemplate);

  const hasFilters = Boolean(
    searchInput.value.trim() ||
    industryFilter.value ||
    categoryFilter.value ||
    availabilityFilter.value
  );

  emptyState.hidden = matches.length !== 0;
  if (emptyHint) {
    emptyHint.textContent = hasFilters
      ? "Try clearing a filter, choosing another industry, or searching by service keyword."
      : "Templates will appear here once the catalog loads.";
  }

  status.textContent = hasFilters
    ? `${matches.length} of ${catalog.length} working demo${catalog.length === 1 ? "" : "s"} shown.`
    : `${catalog.length} working demo${catalog.length === 1 ? "" : "s"} available.`;

  renderActiveFilters(matches.length);
  if (syncUrl) writeFiltersToUrl();
  import("/assets/js/phase3-motion.js")
    .then(({ applyMotion }) => applyMotion())
    .catch((error) => console.error("BRIOFRAME Phase 3 motion failed", error));
}

function resetFilters() {
  searchInput.value = "";
  industryFilter.value = "";
  availabilityFilter.value = "";
  populateCategoryOptions("");
  categoryFilter.value = "";
  applyFilters();
  searchInput.focus();
}

async function loadCatalog() {
  try {
    const [templatesResponse, taxonomyResponse] = await Promise.all([
      fetch("/data/templates.json", { credentials: "same-origin" }),
      fetch("/data/taxonomy.json", { credentials: "same-origin" })
    ]);
    if (!templatesResponse.ok) throw new Error(`Catalog request failed with status ${templatesResponse.status}`);
    if (!taxonomyResponse.ok) throw new Error(`Taxonomy request failed with status ${taxonomyResponse.status}`);

    const templates = await templatesResponse.json();
    const taxonomyData = await taxonomyResponse.json();
    if (!Array.isArray(templates)) throw new TypeError("Catalog must be an array");
    if (!taxonomyData || !Array.isArray(taxonomyData.industries)) {
      throw new TypeError("Taxonomy must include an industries array");
    }

    catalog = templates;
    taxonomy = taxonomyData;
    populateIndustryOptions();
    readFiltersFromUrl();
    if (industryFilter.value && !catalog.some((template) => template.industry === industryFilter.value)) {
      industryFilter.value = "";
      populateCategoryOptions("");
    }
    if (categoryFilter.value && !catalog.some((template) => template.category === categoryFilter.value && (!industryFilter.value || template.industry === industryFilter.value))) {
      categoryFilter.value = "";
    }
    applyFilters({ syncUrl: true });
  } catch (error) {
    status.textContent = "The demo library could not load. Please refresh the page and try again.";
    emptyState.hidden = false;
    if (emptyHint) emptyHint.textContent = "The catalog data failed to load. Refresh the page to try again.";
    console.error("BRIOFRAME catalog load failed", error);
  }
}

searchInput.addEventListener("input", () => applyFilters());
industryFilter.addEventListener("change", () => {
  populateCategoryOptions(industryFilter.value);
  applyFilters();
});
categoryFilter.addEventListener("change", () => applyFilters());
availabilityFilter.addEventListener("change", () => applyFilters());
clearFilters.addEventListener("click", resetFilters);
if (emptyClearFilters) emptyClearFilters.addEventListener("click", resetFilters);
window.addEventListener("popstate", () => {
  readFiltersFromUrl();
  applyFilters({ syncUrl: false });
});

loadCatalog();
