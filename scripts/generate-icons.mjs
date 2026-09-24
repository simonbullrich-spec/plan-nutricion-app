// Genera los íconos de la PWA en /public a partir de un SVG.
// Uso: npm run icons
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const GREEN = "#2E6A45", YOLK = "#E2A72E", PAPER = "#F3F5F1";

// Plato con una hoja. `rx` redondea el fondo (0 = sangrado completo, para maskable/apple).
const svg = (rx) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${rx}" fill="${GREEN}"/>
  <circle cx="256" cy="256" r="150" fill="none" stroke="${PAPER}" stroke-width="26"/>
  <circle cx="256" cy="256" r="104" fill="${PAPER}" opacity=".16"/>
  <path d="M196 316 C196 236 246 192 326 188 C326 268 282 316 196 316 Z" fill="${YOLK}"/>
  <path d="M206 306 L300 212" stroke="${GREEN}" stroke-width="10" stroke-linecap="round"/>
</svg>`;

const out = [
  ["public/pwa-192x192.png", 192, 96],
  ["public/pwa-512x512.png", 512, 96],
  ["public/maskable-icon-512x512.png", 512, 0],
  ["public/apple-touch-icon.png", 180, 0],
];
for (const [file, size, rx] of out) {
  await sharp(Buffer.from(svg(rx))).resize(size, size).png().toFile(file);
  console.log("✓", file);
}
await writeFile("public/favicon.svg", svg(96));
console.log("✓ public/favicon.svg");
