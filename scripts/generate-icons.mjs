// One-off: apple-touch-icon.png (180x180, white bg) and favicon.ico (32x32 PNG in ICO container).
// Run with: npm run images:icons
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const path = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));

await sharp(path('assets/favicon-192.png'))
    .resize(180, 180)
    .flatten({ background: '#ffffff' })
    .png()
    .toFile(path('apple-touch-icon.png'));

const png = await sharp(path('assets/favicon.png')).resize(32, 32).png().toBuffer();

const head = Buffer.alloc(22);
head.writeUInt16LE(0, 0); // reserved
head.writeUInt16LE(1, 2); // type: icon
head.writeUInt16LE(1, 4); // image count
head[6] = 32; // width
head[7] = 32; // height
head.writeUInt16LE(1, 10); // planes
head.writeUInt16LE(32, 12); // bpp
head.writeUInt32LE(png.length, 14); // size
head.writeUInt32LE(22, 18); // offset
await writeFile(path('favicon.ico'), Buffer.concat([head, png]));
