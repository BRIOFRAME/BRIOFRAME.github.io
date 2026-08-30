const grid = document.querySelector("#template-grid");
const status = document.querySelector("#library-status");

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
  addLink(actions, "button button--secondary", "View in Shopify", template.shopifyProductUrl);
  body.append(actions);
  article.append(body);
  grid.append(article);
}

async function loadTemplates() {
  try {
    const response = await fetch("/data/templates.json", { credentials: "same-origin" });
    if (!response.ok) {
      throw new Error(`Catalog request failed with status ${response.status}`);
    }
    const templates = await response.json();
    if (!Array.isArray(templates)) {
      throw new TypeError("Catalog must be an array");
    }
    if (templates.length === 0) {
      status.textContent = "Working demos are being prepared. Please check back soon.";
      return;
    }
    status.textContent = `${templates.length} working demo${templates.length === 1 ? "" : "s"} available.`;
    templates.forEach(renderTemplate);
  } catch (error) {
    status.textContent = "The demo library could not load. Please refresh the page and try again.";
    console.error("BRIOFRAME catalog load failed", error);
  }
}

loadTemplates();
