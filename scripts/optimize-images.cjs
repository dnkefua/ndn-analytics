#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');

const SRC = path.resolve(__dirname, '..', 'src', 'assets');
const OUT = path.resolve(__dirname, '..', 'public', 'optimized');

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const patterns = ['**/*.jpg', '**/*.jpeg', '**/*.png'];

(async () => {
  const files = patterns.flatMap(p => glob.sync(p, { cwd: SRC }));
  console.log(`Found ${files.length} images in ${SRC}`);
  for (const rel of files) {
    try {
      const input = path.join(SRC, rel);
      const name = path.parse(rel).name;
      const outFile = path.join(OUT, `${name}.webp`);
      await sharp(input)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outFile);
      console.log('Optimized:', rel, '→', path.relative(process.cwd(), outFile));
    } catch (e) {
      console.error('Failed to optimize', rel, e.message);
    }
  }
  console.log('Optimization complete. Optimized images are in public/optimized');
})();
