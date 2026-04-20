import { cpSync, rmSync, existsSync } from 'fs';

const FUNCTIONS = 'functions';

// Remove stale build artifacts from functions/
for (const item of ['entry-ssr.js', 'assets', 'index.html']) {
  rmSync(`${FUNCTIONS}/${item}`, { recursive: true, force: true });
}

// Copy SSR entry from dist/ssr/ (separate outDir avoids overwriting client build)
cpSync('dist/ssr/entry-ssr.js', `${FUNCTIONS}/entry-ssr.js`);

// Copy HTML template from client build
cpSync('dist/index.html', `${FUNCTIONS}/index.html`);

// Copy client assets (JS, CSS, fonts, images)
cpSync('dist/assets', `${FUNCTIONS}/assets`, { recursive: true });

// Merge SSR-specific assets (vendor chunk imported by entry-ssr.js)
if (existsSync('dist/ssr/assets')) {
  cpSync('dist/ssr/assets', `${FUNCTIONS}/assets`, { recursive: true });
}

// Copy XML/text assets that must be served by the Cloud Function with correct
// Content-Type (Firebase rewrites send all requests through the SSR function).
cpSync('dist/feed.xml', `${FUNCTIONS}/feed.xml`);
cpSync('dist/sitemap.xml', `${FUNCTIONS}/sitemap.xml`);
cpSync('dist/robots.txt', `${FUNCTIONS}/robots.txt`);

// Copy whitepaper static files for direct serving
const WHITEPPAPER_SRC = 'dist/whitepaper';
if (existsSync(WHITEPPAPER_SRC)) {
  cpSync(WHITEPPAPER_SRC, `${FUNCTIONS}/whitepaper`, { recursive: true });
}

console.log('Build artifacts copied to functions/');
