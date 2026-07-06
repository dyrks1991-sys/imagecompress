#!/usr/bin/env node
'use strict'

// Generates public/og.png (1200×630) for Open Graph / Twitter cards.
// Uses Playwright headless Chromium — no external image dependencies.
//
// Usage: node scripts/generate-og.js

const playwright = require('/tmp/quickqr-qa/node_modules/playwright')
const path = require('path')
const fs = require('fs')

const PW_CHROMIUM =
  '/tmp/pw-browsers/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell'

const OUT_PATH = path.join(__dirname, '../public/og.png')

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #111827;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    display: flex; align-items: center; justify-content: center;
  }

  /* Subtle grid pattern */
  body::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .card {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; align-items: center;
    gap: 28px; text-align: center; padding: 60px;
  }

  .logo {
    width: 80px; height: 80px;
    background: white; border-radius: 22px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; font-weight: 900; color: #111827;
    letter-spacing: -1px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }

  h1 {
    font-size: 76px; font-weight: 800; color: white;
    letter-spacing: -3px; line-height: 1.05;
  }
  h1 span { color: #6b7280; }

  p {
    font-size: 30px; color: #6b7280; font-weight: 400; letter-spacing: -0.5px;
  }

  .tags {
    display: flex; gap: 12px; margin-top: 8px;
  }
  .tag {
    padding: 8px 20px;
    border: 1px solid #374151; border-radius: 100px;
    color: #9ca3af; font-size: 22px; font-weight: 500;
    letter-spacing: -0.3px;
  }

  .url {
    position: absolute; bottom: 32px; right: 40px;
    font-size: 16px; color: #374151; font-weight: 500;
    letter-spacing: 0.3px;
  }
</style>
</head>
<body>
<div class="card">
  <div class="logo">IC</div>
  <h1>Image<span>Compress</span></h1>
  <p>Compress images up to 90% smaller.</p>
  <div class="tags">
    <span class="tag">JPEG</span>
    <span class="tag">PNG</span>
    <span class="tag">WebP</span>
    <span class="tag">No upload</span>
    <span class="tag">100% free</span>
  </div>
</div>
<div class="url">imagecompress-jet.vercel.app</div>
</body>
</html>`

;(async () => {
  console.log('Generating OG image…')
  const browser = await playwright.chromium.launch({
    executablePath: PW_CHROMIUM,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1200, height: 630 })
  await page.setContent(html, { waitUntil: 'load' })
  await page.waitForTimeout(200)
  await page.screenshot({ path: OUT_PATH, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } })
  await browser.close()

  const size = (fs.statSync(OUT_PATH).size / 1024).toFixed(1)
  console.log('✓ ' + OUT_PATH + '  (' + size + ' KB)')
  process.exit(0)
})().catch((e) => { console.error('Error:', e.message); process.exit(1) })
