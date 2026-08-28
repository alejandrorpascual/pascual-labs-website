import { readFile, stat } from "node:fs/promises";

const htmlPath = new URL("../dist/index.html", import.meta.url);
const cssPath = new URL("../dist/styles.css", import.meta.url);
const html = await readFile(htmlPath, "utf8");
const css = await readFile(cssPath, "utf8");

const requiredText = [
  "Pascual Code Labs LLC",
  "alejandro@pascual-labs.com",
  "Walk Blocker",
  "Macro Chef",
  "Colofon",
  "Music discovery app",
  "Game discovery app",
];

const forbiddenText = [
  "available now",
  "download now",
  "join thousands",
  "our customers",
  "testimonial",
  "analytics",
];

const failures = [];

for (const text of requiredText) {
  if (!html.includes(text)) failures.push(`Missing required text: ${text}`);
}

for (const text of forbiddenText) {
  if (html.toLowerCase().includes(text)) failures.push(`Found forbidden claim: ${text}`);
}

const productCount = (html.match(/<article class="product /g) ?? []).length;
const statusCount = (html.match(/> In development<\/p>/g) ?? []).length;

if (productCount !== 5) failures.push(`Expected 5 products, found ${productCount}`);
if (statusCount !== 5) failures.push(`Expected 5 visible development labels, found ${statusCount}`);
if (/<form\b|google-analytics|gtag\(|plausible\.io|segment\.com/i.test(html)) {
  failures.push("Forms or tracking code are not allowed in this release");
}
if (!/<main id="main">/.test(html) || !/<nav\b/.test(html) || !/<footer\b/.test(html)) {
  failures.push("Required semantic landmarks are missing");
}
if (!css.includes("prefers-reduced-motion") || !css.includes("prefers-color-scheme")) {
  failures.push("Reduced-motion or color-scheme support is missing");
}

for (const asset of ["orbit.svg", "path.svg", "signal.svg"]) {
  const assetStats = await stat(new URL(`../dist/art/${asset}`, import.meta.url));
  if (assetStats.size === 0) failures.push(`Decorative asset is empty: ${asset}`);
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Content, structure, claims, and static assets validated.");

