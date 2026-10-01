/*!
 * BRIOFRAME · SOLARA Private Villas Master · BF-SOLARA-PV-M1
 * Site sync tool. Run from anywhere:  node tools/sync.mjs
 *  1. Copies partials/header.html and partials/footer.html into every page between the
 *     <!-- BF:HEADER --> / <!-- BF:FOOTER --> markers, fixing relative paths and marking
 *     the current page with aria-current="page".
 *  2. Expands every <img data-photo="slug" ...> into a full responsive tag (src, srcset,
 *     width, height, loading) using assets/js/images.js. Keep alt, sizes and class on the tag;
 *     add data-eager to the one image per page that should load first (the hero).
 *     Demo slugs listed in assets/js/photo-sources.js expand to their source photograph URL;
 *     your own photographs (tools/images.py add) expand to local files.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const partial = (name) => readFileSync(join(root, "partials", `${name}.html`), "utf8").trim();
const header = partial("header");
const footer = partial("footer");
const navFor = { villa: "villas" };
const imagesSrc = readFileSync(join(root, "assets", "js", "images.js"), "utf8");
const images = JSON.parse(imagesSrc.slice(imagesSrc.indexOf("{"), imagesSrc.lastIndexOf("}") + 1));
const remoteFile = join(root, "assets", "js", "photo-sources.js");
const remoteSrc = existsSync(remoteFile) ? readFileSync(remoteFile, "utf8") : "{}";
const remote = JSON.parse(remoteSrc.slice(remoteSrc.indexOf("{"), remoteSrc.lastIndexOf("}") + 1));

const pages = ["index.html", "404.html"];
for (const d of readdirSync(root, { withFileTypes: true })) {
  if (d.isDirectory() && !d.name.startsWith("_") && existsSync(join(root, d.name, "index.html"))) pages.push(`${d.name}/index.html`);
}

const renderPartial = (html, rootPath, nav) => html
  .replaceAll("{{root}}", rootPath)
  .replace(/<a ([^>]*?)data-nav="([a-z-]+)"([^>]*)>/g, (m, a, key, b) =>
    key === nav ? `<a ${a}data-nav="${key}"${b} aria-current="page">` : m);

const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`)); return m ? m[1] : null; };

function photo(tag, rootPath, file) {
  const slug = attr(tag, "data-photo");
  const meta = images[slug];
  if (!meta) throw new Error(`${file}: unknown photo "${slug}"`);
  const [w, h, widths] = meta;
  const alt = attr(tag, "alt");
  if (alt === null) throw new Error(`${file}: photo "${slug}" needs an alt attribute (use alt="" if decorative)`);
  const sizes = attr(tag, "sizes") || "100vw";
  const cls = attr(tag, "class");
  const eager = /\sdata-eager\b/.test(tag);
  const rid = remote.photos && remote.photos[slug];
  const src = (x) => (rid ? `${remote.base}${rid}?w=${x}&amp;${remote.query.replaceAll("&", "&amp;")}` : `${rootPath}assets/img/photo/${slug}-${x}.webp`);
  const def = widths.includes(1280) ? 1280 : widths[widths.length - 1];
  return `<img data-photo="${slug}"${eager ? " data-eager" : ""}${cls ? ` class="${cls}"` : ""} src="${src(def)}" srcset="${widths.map((x) => `${src(x)} ${x}w`).join(", ")}" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
}

let changed = 0;
for (const rel of pages) {
  const file = join(root, rel);
  const src = readFileSync(file, "utf8");
  const page = (src.match(/<body[^>]*data-page="([a-z0-9-]+)"/) || [])[1] || "";
  const rootPath = (src.match(/<body[^>]*data-root="([^"]*)"/) || [])[1] ?? "";
  const nav = navFor[page] || page;
  const out = src
    .replace(/<!-- BF:HEADER -->[\s\S]*?<!-- \/BF:HEADER -->/, `<!-- BF:HEADER -->\n${renderPartial(header, rootPath, nav)}\n<!-- /BF:HEADER -->`)
    .replace(/<!-- BF:FOOTER -->[\s\S]*?<!-- \/BF:FOOTER -->/, `<!-- BF:FOOTER -->\n${renderPartial(footer, rootPath, nav)}\n<!-- /BF:FOOTER -->`)
    .replace(/<img\s[^>]*data-photo="[^"]+"[^>]*>/g, (tag) => photo(tag, rootPath, rel));
  if (out !== src) { writeFileSync(file, out); changed++; }
  console.log(`${rel.padEnd(26)} page=${(page || "-").padEnd(13)} nav=${nav || "-"}`);
}
console.log(`${changed} file(s) updated`);
