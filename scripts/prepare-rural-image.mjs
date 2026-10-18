// Prepare a generated source image for the site; the build uses the committed WebP.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const source = process.argv[2];
if (!source) throw new Error('Pass the generated rice-field source image path.');
const directory = new URL('../public/images/', import.meta.url);
await mkdir(directory, { recursive: true });
const output = fileURLToPath(new URL('village-rice-fields.webp', directory));
const result = await sharp(source).resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(output);
console.log(JSON.stringify({ output, width: result.width, height: result.height, bytes: result.size }));
