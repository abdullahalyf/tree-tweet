// Run manually with the sharp version installed by Next.js; build uses committed PNGs.
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const icon = await readFile(new URL('../public/icon.svg', import.meta.url));
await sharp(icon).resize(180, 180).png().toFile(new URL('../public/apple-touch-icon.png', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f7f4e8"/>
<circle cx="1100" cy="40" r="290" fill="#e5eddb"/><circle cx="1130" cy="630" r="210" fill="#ebdcb3"/>
<rect x="60" y="58" width="74" height="74" rx="20" fill="#183f2c"/>
<path d="M97 116V89m0 15-13-8m13-3 15-13M80 89c0-17 17-21 36-21 0 21-8 32-23 32" fill="none" stroke="#f7f4e8" stroke-width="3.5" stroke-linecap="round"/>
<g font-family="Arial, sans-serif" fill="#183f2c">
<text x="155" y="109" font-size="42" font-weight="700">TreeTweet.</text>
<text x="62" y="235" font-size="67" font-weight="700">Check before you buy.</text>
<text x="64" y="297" font-size="28" fill="#51654f">5 essential land record checks for Bangladesh</text>
<g font-size="24" font-weight="700"><text x="64" y="388">01  Owner</text><text x="350" y="388">02  Mutation history</text><text x="760" y="388">03  Cases</text><text x="64" y="447">04  Khas land</text><text x="350" y="447">05  Acquisition</text></g>
<text x="64" y="549" font-size="23" fill="#51654f">Bangla + English  /  Official service directory + sample checker</text>
<text x="64" y="592" font-size="19" fill="#51654f">Independent guidance. No government record connection or title certification.</text>
</g></svg>`;
await sharp(Buffer.from(svg)).png().toFile(new URL('../public/social-card.png', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
