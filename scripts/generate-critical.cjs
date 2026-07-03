#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

(async () => {
  const distIndex = path.resolve(__dirname, '..', 'dist', 'index.html');
  if (!fs.existsSync(distIndex)) {
    console.error('dist/index.html not found — run `npm run build` first');
    process.exit(1);
  }
  try {
    const { generate } = await import('critical');
    await generate({
      base: path.resolve(__dirname, '..', 'dist'),
      src: 'index.html',
      target: {
        css: 'critical.css',
      },
      width: 1300,
      height: 900,
      penthouse: {
        blockJSRequests: false,
      }
    });
    console.log('Critical CSS generated to dist/critical.css');
  } catch (e) {
    console.error('Critical generation failed:', e.message || e);
    process.exit(1);
  }
})();
