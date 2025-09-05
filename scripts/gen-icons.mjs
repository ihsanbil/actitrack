// scripts/gen-icons.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.resolve("public", "icons");
const SIZES = [192, 512];

const SRC_SVG = path.join(OUT_DIR, "icon-source-1024.svg");
const SRC_PNG = path.join(OUT_DIR, "icon-source-1024.png");

await fs.promises.mkdir(OUT_DIR, { recursive: true });

let input;      // Buffer atau path
let isVector = false;

// 1) Pakai SVG jika ada, 2) fallback PNG, 3) auto-generate SVG default
if (fs.existsSync(SRC_SVG)) {
  input = SRC_SVG;        // biarkan sharp baca dari path
  isVector = true;
  console.log("🔎 Menggunakan sumber SVG:", SRC_SVG);
} else if (fs.existsSync(SRC_PNG)) {
  input = SRC_PNG;
  isVector = false;
  console.log("🔎 Menggunakan sumber PNG:", SRC_PNG);
} else {
  console.log("ℹ️  Tidak menemukan sumber ikon. Membuat ikon default…");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#5AA6FF"/>
      <stop offset="100%" stop-color="#7C83FF"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="220" fill="url(#g)"/>
  <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle"
        font-family="Inter,system-ui,Segoe UI,Arial" font-size="420" font-weight="800" fill="white">
    A
  </text>
</svg>`;
  input = Buffer.from(svg, "utf8");
  isVector = true;
}

// Generate icon-192.png & icon-512.png
for (const size of SIZES) {
  const out = path.join(OUT_DIR, `icon-${size}.png`);
  try {
    // Jika vector (SVG), gunakan density tinggi agar tajam saat diraster
    const pipeline = isVector
      ? sharp(input, { density: 512 })
      : sharp(input);

    await pipeline
      .resize(size, size, { fit: "cover" })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(out);

    console.log("✅  Generated", out);
  } catch (err) {
    console.error(`❌ Gagal membuat ${out}:`, err?.message || err);
    process.exitCode = 1;
  }
}

console.log("🎉 Selesai.");
