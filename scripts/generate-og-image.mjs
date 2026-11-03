// Render the social share card (1200x630) used by Open Graph + Twitter cards.
// Pipeline: Playwright renders an HTML template at 2x DPR -> sharp downsamples
// and compresses to indexed PNG -> writes assets/og.png (target <=200 KB).
//
// Idempotent: always re-renders from the inline template. To restyle, edit the
// template below and rerun: npm run images:og

import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'assets', 'og.png');
const logoLightPath = resolve(__dirname, '..', 'assets', 'logo-2dato-light@og.png');
const logoLightDataUri = `data:image/png;base64,${(await readFile(logoLightPath)).toString('base64')}`;

const WIDTH = 1200;
const HEIGHT = 630;
const DPR = 2; // capture at 2x then downsample for crispness without bloating PNG.
const BYTE_BUDGET = 200 * 1024;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500&display=block"
  rel="stylesheet"
/>
<style>
  :root {
    --navy: #0e1c32;
    --green: #06aa78;
    --paper: #fafaf7;
    --paper-2: #efece4;
    --navy-55: #5e6b7a;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; }
  body {
    background: var(--navy);
    color: var(--paper);
    font-family: 'Inter', system-ui, -apple-system, Helvetica, Arial, sans-serif;
    position: relative;
    overflow: hidden;
  }
  /* faint editorial grid */
  body::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(255 255 255 / 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255 255 255 / 0.04) 1px, transparent 1px);
    background-size: 80px 80px;
    pointer-events: none;
  }
  /* green ambient blob (R6-style) */
  body::after {
    content: '';
    position: absolute;
    right: -120px;
    bottom: -160px;
    width: 520px;
    height: 520px;
    border-radius: 50%;
    background: var(--green);
    filter: blur(120px);
    opacity: 0.18;
    pointer-events: none;
  }
  .stage {
    position: relative;
    z-index: 1;
    height: 100%;
    padding: 64px 80px;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr;
    gap: 32px;
    align-items: start;
  }
  .header {
    grid-column: 1 / 2;
    display: flex;
    flex-direction: column;
    gap: 18px;
    align-items: flex-start;
  }
  .header .brand {
    display: block;
    width: 200px;
    height: auto;
  }
  .eyebrow {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 16px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--green);
  }
  .punto {
    grid-column: 2 / 3;
    grid-row: 1 / 4;
    align-self: center;
    width: 200px;
    height: 200px;
    position: relative;
  }
  .ring { position: absolute; inset: 0; border-radius: 50%; border: 1px solid rgba(255 255 255 / 0.18); }
  .ring.r2 { inset: 24px; border-color: rgba(255 255 255 / 0.26); }
  .ring.r3 { inset: 56px; border-color: rgba(255 255 255 / 0.42); }
  .core {
    position: absolute;
    inset: 80px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 60px rgba(6 170 120 / 0.55), 0 0 0 6px rgba(6 170 120 / 0.18);
  }
  .headline {
    grid-column: 1 / 2;
    align-self: center;
    font-family: 'Space Grotesk', system-ui, -apple-system, Helvetica, Arial, sans-serif;
    font-weight: 600;
    font-size: 76px;
    line-height: 0.98;
    letter-spacing: -2px;
    color: var(--paper);
    max-width: 760px;
  }
  .headline .accent { color: var(--green); }
</style>
</head>
<body>
<main class="stage">
  <div class="header">
    <img class="brand" src="${logoLightDataUri}" alt="2DATO" />
    <p class="eyebrow">Data &amp; AI Consulting</p>
  </div>
  <h1 class="headline">From a single point of data to decisions that <span class="accent">run themselves.</span></h1>
  <div class="punto" aria-hidden="true">
    <span class="ring r1"></span>
    <span class="ring r2"></span>
    <span class="ring r3"></span>
    <span class="core"></span>
  </div>
</main>
</body>
</html>`;

console.log('[og] launching chromium...');
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: DPR,
});
const page = await context.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
// belt and suspenders: networkidle can resolve before `font-display: block`
// finishes swapping. document.fonts.ready settles when every face is usable.
// eslint-disable-next-line no-undef -- runs in browser context via page.evaluate
await page.evaluate(() => document.fonts.ready);

const buf = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
});
await browser.close();

// Downsample (the screenshot was at DPR=2 so it's 2400x1260) and compress to
// indexed PNG. Sharp's palette mode produces ~70-150 KB at 1200x630 for this
// kind of flat brand artwork.
let attempt = 0;
let png = await sharp(buf)
    .resize(WIDTH, HEIGHT, { fit: 'fill' })
    .png({ palette: true, quality: 90, compressionLevel: 9, effort: 10 })
    .toBuffer();

// If we somehow blow the budget, drop palette quality progressively.
while (png.length > BYTE_BUDGET && attempt < 4) {
    attempt += 1;
    const quality = 90 - attempt * 12;
    png = await sharp(buf)
        .resize(WIDTH, HEIGHT, { fit: 'fill' })
        .png({ palette: true, quality, compressionLevel: 9, effort: 10 })
        .toBuffer();
}

await writeFile(out, png);

const kb = (png.length / 1024).toFixed(1);
console.log(`[og] wrote ${out}`);
console.log(
    `[og] ${WIDTH}x${HEIGHT} indexed PNG, ${kb} KB${attempt ? ` (after ${attempt} re-encode)` : ''}`
);
if (png.length > BYTE_BUDGET) {
    console.error(`[og] WARNING: exceeded ${BYTE_BUDGET / 1024} KB budget`);
    process.exit(1);
}
