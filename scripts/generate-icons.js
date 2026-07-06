#!/usr/bin/env node
'use strict'

const playwright = require('/tmp/quickqr-qa/node_modules/playwright')
const path = require('path')
const fs = require('fs')

const PW_CHROMIUM =
  '/tmp/pw-browsers/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell'

function iconHtml(size) {
  const radius = Math.round(size * 0.22)
  const fontSize = Math.round(size * 0.36)
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; }
    body { width: ${size}px; height: ${size}px; overflow: hidden; }
    .icon {
      width: ${size}px; height: ${size}px;
      background: #111827;
      border-radius: ${radius}px;
      display: flex; align-items: center; justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: ${fontSize}px;
      font-weight: 900;
      color: white;
      letter-spacing: -${Math.round(size * 0.02)}px;
    }
  </style></head>
  <body><div class="icon">IC</div></body></html>`
}

async function generateIcon(browser, size, outPath) {
  const page = await browser.newPage()
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(iconHtml(size), { waitUntil: 'load' })
  await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width: size, height: size } })
  await page.close()
  const kb = (fs.statSync(outPath).size / 1024).toFixed(1)
  console.log('✓ ' + path.basename(outPath) + '  (' + kb + ' KB)')
}

;(async () => {
  const browser = await playwright.chromium.launch({
    executablePath: PW_CHROMIUM,
    headless: true,
    args: ['--no-sandbox'],
  })
  const publicDir = path.join(__dirname, '../public')

  await generateIcon(browser, 32,  path.join(publicDir, 'favicon-32.png'))
  await generateIcon(browser, 180, path.join(publicDir, 'apple-touch-icon.png'))

  await browser.close()
  process.exit(0)
})().catch((e) => { console.error(e.message); process.exit(1) })
