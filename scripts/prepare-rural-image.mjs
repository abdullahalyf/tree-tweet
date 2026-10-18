// Prepare a generated source image for the site; the build uses the committed WebP.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const source = process.argv[2];
if (!source) throw new Error('Pass the generated rice-field source image path.');
const filename = process.argv[3] || 'village-rice-fields.webp';
const width = process.argv[4] === undefined ? 1440 : Number(process.argv[4]);
if (!/^[a-z0-9-]+\.webp$/.test(filename)) throw new Error('Output must be a simple lowercase WebP filename.');
if (!Number.isInteger(width) || width < 1 || width > 2560) throw new Error('Width must be an integer between 1 and 2560.');
const directory = new URL('../public/images/', import.meta.url);
await mkdir(directory, { recursive: true });
const output = fileURLToPath(new URL(filename, directory));
const result = await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(output);
console.log(JSON.stringify({ output, width: result.width, height: result.height, bytes: result.size }));
