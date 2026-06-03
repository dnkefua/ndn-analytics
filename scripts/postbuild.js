import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, statSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

const FUNCTIONS = 'functions';
const DIST = 'dist';

// Remove stale build artifacts from functions/
for (const item of ['entry-ssr.js', 'assets', 'index.html']) {
  rmSync(`${FUNCTIONS}/${item}`, { recursive: true, force: true });
}

// Copy SSR entry from dist/ssr/ (separate outDir avoids overwriting client build)
cpSync('dist/ssr/entry-ssr.js', `${FUNCTIONS}/entry-ssr.js`);

// Copy HTML template from client build
cpSync('dist/index.html', `${FUNCTIONS}/index.html`);

function copyDirectoryFiltered(source, target, shouldCopy) {
  if (!existsSync(source)) {
    return;
  }

  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const sourcePath = join(source, entry.name);
    const targetPath = join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryFiltered(sourcePath, targetPath, shouldCopy);
      continue;
    }

    if (!shouldCopy(sourcePath)) {
      continue;
    }

    mkdirSync(dirname(targetPath), { recursive: true });
    cpSync(sourcePath, targetPath);
  }
}

function isFunctionAsset(filePath) {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  const mediaExtensions = new Set(['mp4', 'webm', 'gif', 'mov']);

  if (mediaExtensions.has(extension)) {
    return false;
  }

  // Keep the SSR package lean. Firebase Hosting serves large static media
  // directly from dist before rewrites reach the function.
  return statSync(filePath).size <= 5 * 1024 * 1024;
}

function listFilesRecursive(source, prefix = '') {
  if (!existsSync(source)) {
    return [];
  }

  const files = [];

  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const sourcePath = join(source, entry.name);
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      files.push(...listFilesRecursive(sourcePath, relativePath));
      continue;
    }

    files.push(relativePath.replace(/\\/g, '/'));
  }

  return files;
}

function generateServiceWorker() {
  const assetExtensions = new Set(['css', 'js', 'woff', 'woff2', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'ico', 'webmanifest']);
  const precacheAssets = [
    ...listFilesRecursive(`${DIST}/assets`, 'assets'),
    ...listFilesRecursive(`${DIST}/optimized`, 'optimized'),
  ]
    .filter((file) => assetExtensions.has(file.split('.').pop()?.toLowerCase() || ''))
    .map((file) => `/${file}`);

  const rootAssets = [
    '/',
    '/site.webmanifest',
    '/favicon.ico',
    '/favicon.svg',
    '/favicon-96x96.png',
    '/apple-touch-icon.png',
    '/web-app-manifest-192x192.png',
    '/web-app-manifest-512x512.png',
    '/logo.jpg',
    '/og-image.png',
  ].filter((file) => file === '/' || existsSync(`${DIST}/${file.slice(1)}`));

  const cacheVersion = Date.now().toString(36);
  const precache = Array.from(new Set([...rootAssets, ...precacheAssets]));

  const sw = `const CACHE_NAME = 'ndn-analytics-offline-${cacheVersion}';
const PRECACHE_URLS = ${JSON.stringify(precache, null, 2)};
const OFFLINE_HTML = \`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#06B6D4" />
    <title>NDN Analytics</title>
    <style>
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#020b18;color:#eff6ff;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      main{max-width:28rem;padding:2rem;text-align:center}
      h1{margin:0 0 .75rem;font-size:1.5rem}
      p{margin:0;color:#94a3b8;line-height:1.6}
    </style>
  </head>
  <body>
    <main>
      <h1>NDN Analytics</h1>
      <p>The app is offline. Open it once with internet to refresh the latest experience, then it will be available here.</p>
    </main>
  </body>
</html>\`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith('ndn-analytics-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(() => caches.match('/').then((cached) => cached || new Response(OFFLINE_HTML, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        return response;
      });
    })
  );
});
`;

  writeFileSync(`${DIST}/sw.js`, sw);
}

generateServiceWorker();

// Copy client assets required by SSR. Large media stays in Hosting only.
copyDirectoryFiltered('dist/assets', `${FUNCTIONS}/assets`, isFunctionAsset);

// Merge SSR-specific assets (vendor chunk imported by entry-ssr.js)
if (existsSync('dist/ssr/assets')) {
  copyDirectoryFiltered('dist/ssr/assets', `${FUNCTIONS}/assets`, isFunctionAsset);
}

// Copy XML/text assets that must be served by the Cloud Function with correct
// Content-Type (Firebase rewrites send all requests through the SSR function).
cpSync('dist/feed.xml', `${FUNCTIONS}/feed.xml`);
cpSync('dist/sitemap.xml', `${FUNCTIONS}/sitemap.xml`);
cpSync('dist/news-sitemap.xml', `${FUNCTIONS}/news-sitemap.xml`);
cpSync('dist/robots.txt', `${FUNCTIONS}/robots.txt`);
cpSync('dist/llms.txt', `${FUNCTIONS}/llms.txt`);

// These XML/text discovery surfaces are served dynamically by the SSR function
// so scheduled posts can become discoverable on their publish date without a
// redeploy. Keep function copies as fallbacks, but remove Hosting copies so
// rewrites reach the function routes.
for (const file of ['feed.xml', 'sitemap.xml', 'news-sitemap.xml', 'llms.txt']) {
  rmSync(`${DIST}/${file}`, { force: true });
}

// Copy PWA/root assets so direct Function URLs and Hosting rewrites serve the
// same installability metadata as Firebase Hosting's static file layer.
for (const file of [
  'site.webmanifest',
  'sw.js',
  'favicon.ico',
  'favicon.svg',
  'favicon-96x96.png',
  'apple-touch-icon.png',
  'web-app-manifest-192x192.png',
  'web-app-manifest-512x512.png',
]) {
  if (existsSync(`dist/${file}`)) {
    cpSync(`dist/${file}`, `${FUNCTIONS}/${file}`);
  }
}

// Search-engine ownership verification files. cleanUrls strips .html from
// these, so the SSR function serves them by name.
for (const file of readdirSync('dist')) {
  if (/^google[a-z0-9]+\.html$/i.test(file)) {
    cpSync(`dist/${file}`, `${FUNCTIONS}/${file}`);
  }
}

// Copy whitepaper static files for direct serving
const WHITEPPAPER_SRC = 'dist/whitepaper';
if (existsSync(WHITEPPAPER_SRC)) {
  cpSync(WHITEPPAPER_SRC, `${FUNCTIONS}/whitepaper`, { recursive: true });
}

console.log('Build artifacts copied to functions/');
