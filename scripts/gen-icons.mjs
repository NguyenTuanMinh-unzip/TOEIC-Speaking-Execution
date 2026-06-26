// Generates PWA PNG icons from an inline SVG. Run once: `node scripts/gen-icons.mjs`.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const OUT = "public";
mkdirSync(OUT, { recursive: true });

function iconSVG({ maskable }) {
  const size = 512;
  const pad = maskable ? 72 : 40; // maskable needs a safe-zone margin
  const inner = size - pad * 2;
  const r = Math.round(inner * 0.22);
  const fontSize = Math.round(inner * 0.62);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#28a4ee"/>
        <stop offset="1" stop-color="#0a6fb3"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="#ffffff"/>
    <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" rx="${r}" fill="url(#g)"/>
    <text x="50%" y="50%" dy="0.35em" text-anchor="middle"
          font-family="Arial, Helvetica, sans-serif" font-weight="900"
          font-size="${fontSize}" fill="#ffffff">T</text>
  </svg>`;
}

const plain = Buffer.from(iconSVG({ maskable: false }));
const masked = Buffer.from(iconSVG({ maskable: true }));

await sharp(plain).resize(192, 192).png().toFile(`${OUT}/icon-192.png`);
await sharp(plain).resize(512, 512).png().toFile(`${OUT}/icon-512.png`);
await sharp(masked).resize(512, 512).png().toFile(`${OUT}/icon-maskable-512.png`);
await sharp(plain).resize(180, 180).png().toFile(`${OUT}/apple-touch-icon.png`);
await sharp(plain).resize(32, 32).png().toFile(`${OUT}/favicon-32.png`);

console.log("Icons generated in /public");
