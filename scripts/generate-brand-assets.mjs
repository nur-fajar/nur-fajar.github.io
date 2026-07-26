import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

// Kept in sync manually with lib/constants.ts COLORS — this is a one-off
// asset generator, not runtime code, so importing the TS file isn't worth it.
const COLORS = {
  accent: '#E3A857',
  accent2: '#C0654A',
  bg: '#0B0A08',
  text: '#F3EEE4',
  subtle: '#7C7365',
}

const ogSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLORS.accent}"/>
      <stop offset="100%" stop-color="${COLORS.accent2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="${COLORS.bg}"/>
  <circle cx="1080" cy="80" r="220" fill="url(#g)" opacity="0.12"/>
  <circle cx="60" cy="600" r="180" fill="${COLORS.accent2}" opacity="0.08"/>
  <text x="80" y="270" font-family="Arial, sans-serif" font-size="26" letter-spacing="4" fill="${COLORS.subtle}">AVAILABLE &#183; IMMEDIATELY</text>
  <text x="80" y="360" font-family="Arial, sans-serif" font-size="88" font-weight="700" fill="${COLORS.text}">Nur Fajar</text>
  <text x="80" y="415" font-family="Arial, sans-serif" font-size="34" font-weight="500" fill="${COLORS.accent}">Builds AI Systems, Trains the Team</text>
  <text x="80" y="465" font-family="monospace" font-size="20" letter-spacing="2" fill="${COLORS.subtle}">TANGERANG, INDONESIA &#183; REMOTE-READY</text>
  <rect x="80" y="500" width="1040" height="1" fill="${COLORS.subtle}" opacity="0.2"/>
  <text x="80" y="555" font-family="Arial, sans-serif" font-size="22" fill="${COLORS.text}" opacity="0.7">nurfajar.dev</text>
</svg>
`

const iconSvg = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLORS.accent}"/>
      <stop offset="100%" stop-color="${COLORS.accent2}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="${COLORS.bg}"/>
  <rect x="16" y="16" width="480" height="480" rx="84" fill="none" stroke="url(#g)" stroke-width="6"/>
  <text x="256" y="330" font-family="Arial, sans-serif" font-size="220" font-weight="700" fill="url(#g)" text-anchor="middle">NF</text>
</svg>
`

await mkdir('public', { recursive: true })

await sharp(Buffer.from(ogSvg)).png().toFile('public/og.png')
await sharp(Buffer.from(iconSvg)).resize(512, 512).png().toFile('app/icon.png')
await sharp(Buffer.from(iconSvg)).resize(180, 180).png().toFile('app/apple-icon.png')

console.log('Generated public/og.png, app/icon.png, app/apple-icon.png')
