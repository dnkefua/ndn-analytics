import { onRequest } from 'firebase-functions/v2/https';
import express from 'express';
import { join, dirname } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import * as Sentry from '@sentry/node';

// Initialize Sentry for server-side error tracking
const sentryDsn = process.env.SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV || 'production',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SSR Function
// ─────────────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_PATH = __dirname;
const INDEX_HTML = join(DIST_PATH, 'index.html');
const SSR_ENTRY = join(DIST_PATH, 'entry-ssr.js');

let template;
let render;
let ssrReady = false;

async function init() {
  try {
    template = readFileSync(INDEX_HTML, 'utf-8');
    const ssrUrl = pathToFileURL(SSR_ENTRY).href;
    const mod = await import(ssrUrl);
    render = mod.render;
    ssrReady = true;
    console.log('SSR initialized successfully');
  } catch (err) {
    console.error('SSR init error:', err);
    ssrReady = false;
  }
}

// Initialize immediately
init();

const app = express();

// Health check endpoint
app.get('/_health', (req, res) => {
  res.json({ 
    status: 'ok', 
    ssrReady, 
    timestamp: new Date().toISOString(),
    path: DIST_PATH 
  });
});

// Content type mapping
const contentTypes = {
  'js': 'application/javascript',
  'css': 'text/css',
  'html': 'text/html',
  'json': 'application/json',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'svg': 'image/svg+xml',
  'ico': 'image/x-icon',
  'woff': 'font/woff',
  'woff2': 'font/woff2',
  'ttf': 'font/ttf',
  'eot': 'application/vnd.ms-fontobject',
  'mp4': 'video/mp4',
  'webm': 'video/webm',
  'gif': 'image/gif',
  'xml': 'application/xml',
  'txt': 'text/plain'
};

const SEO_BLOCK_PATTERN = /<!-- Primary Meta Tags -->[\s\S]*?<!-- Google Analytics: initialized at runtime from VITE_GA_ID -->/;

function splitRenderedHead(appHtml) {
  const bodyStart = appHtml.indexOf('<nav');
  if (bodyStart === -1) {
    return { head: '', body: appHtml };
  }

  return {
    head: appHtml.slice(0, bodyStart),
    body: appHtml.slice(bodyStart),
  };
}

function injectRenderedHtml(template, appHtml, helmet) {
  const { head, body } = splitRenderedHead(appHtml);
  let html = template.replace('<!--ssr-outlet-->', body);

  const headTags = head || [
    helmet?.title?.toString?.(),
    helmet?.priority?.toString?.(),
    helmet?.meta?.toString?.(),
    helmet?.link?.toString?.(),
    helmet?.script?.toString?.(),
  ].filter(Boolean).join('\n');

  if (!headTags) {
    return html;
  }

  return html.replace(
    SEO_BLOCK_PATTERN,
    `<!-- Primary Meta Tags -->\n${headTags}\n\n    <!-- Google Analytics: initialized at runtime from VITE_GA_ID -->`
  );
}

// Helper to serve static files
function serveStaticFile(filePath, res, next) {
  try {
    if (!existsSync(filePath)) {
      return next();
    }
    const content = readFileSync(filePath);
    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    res.set('Content-Type', contentTypes[ext] || 'application/octet-stream');
    
    // Long cache for assets
    if (filePath.includes('/assets/')) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.set('Cache-Control', 'public, max-age=3600');
    }
    
    res.send(content);
  } catch {
    next();
  }
}

// === STATIC FILE ROUTES (must come BEFORE SSR catch-all) ===

// Assets folder
app.get('/assets/*', (req, res, next) => {
  const assetPath = join(DIST_PATH, 'assets', req.params[0]);
  serveStaticFile(assetPath, res, next);
});

// Root level static files
app.get('/favicon.ico', (req, res, next) => serveStaticFile(join(DIST_PATH, 'favicon.ico'), res, next));
app.get('/favicon.svg', (req, res, next) => serveStaticFile(join(DIST_PATH, 'favicon.svg'), res, next));
app.get('/favicon-96x96.png', (req, res, next) => serveStaticFile(join(DIST_PATH, 'favicon-96x96.png'), res, next));
app.get('/apple-touch-icon.png', (req, res, next) => serveStaticFile(join(DIST_PATH, 'apple-touch-icon.png'), res, next));
app.get('/site.webmanifest', (req, res, next) => serveStaticFile(join(DIST_PATH, 'site.webmanifest'), res, next));
app.get('/og-image.png', (req, res, next) => serveStaticFile(join(DIST_PATH, 'og-image.png'), res, next));
app.get('/logo.jpg', (req, res, next) => serveStaticFile(join(DIST_PATH, 'logo.jpg'), res, next));
app.get('/logo.mp4', (req, res, next) => serveStaticFile(join(DIST_PATH, 'logo.mp4'), res, next));

// XML/Text files with proper content types
app.get('/robots.txt', (req, res, next) => {
  const filePath = join(DIST_PATH, 'robots.txt');
  try {
    const content = readFileSync(filePath, 'utf-8');
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(content);
  } catch {
    next();
  }
});

app.get('/sitemap.xml', (req, res, next) => {
  const filePath = join(DIST_PATH, 'sitemap.xml');
  try {
    const content = readFileSync(filePath, 'utf-8');
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(content);
  } catch {
    next();
  }
});

app.get('/feed.xml', (req, res, next) => {
  const filePath = join(DIST_PATH, 'feed.xml');
  try {
    const content = readFileSync(filePath, 'utf-8');
    res.set('Content-Type', 'application/rss+xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(content);
  } catch {
    next();
  }
});

app.get('/llms.txt', (req, res, next) => {
  const filePath = join(DIST_PATH, 'llms.txt');
  try {
    const content = readFileSync(filePath, 'utf-8');
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(content);
  } catch {
    next();
  }
});

// Whitepaper static files
app.use('/whitepaper', (req, res, next) => {
  const filePath = join(DIST_PATH, 'whitepaper', req.path);
  if (req.path === '/' || req.path === '') {
    serveStaticFile(join(DIST_PATH, 'whitepaper', 'index.html'), res, next);
  } else {
    serveStaticFile(filePath, res, next);
  }
});

// === SSR CATCH-ALL (must come AFTER static routes) ===

// Explicit root route
app.get('/', async (req, res) => {
  try {
    if (!ssrReady || !render) {
      await init();
    }
    
    if (!render) {
      return res.status(503).send('SSR not ready');
    }
    
    const result = await render('/');
    const appHtml = result.html;
    
    const html = injectRenderedHtml(template, appHtml, result.helmet);
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=0');
    res.send(html);
  } catch (err) {
    console.error('SSR Root Error:', err);
    res.status(500).send(`<h1>Server Error</h1><pre>${err.message}</pre>`);
  }
});

// All other routes
app.get('*', async (req, res) => {
  try {
    // Ensure SSR is ready
    if (!ssrReady || !render) {
      await init();
    }
    
    if (!render) {
      // SSR not available, serve fallback HTML
      return res.status(503).send('Service temporarily unavailable');
    }
    
    const url = req.originalUrl;
    const result = await render(url);
    const appHtml = result.html;
    
    const html = injectRenderedHtml(template, appHtml, result.helmet);
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=0');
    res.send(html);
  } catch (err) {
    console.error('SSR Error:', err);
    res.status(500).send(`<html><body><h1>Server Error</h1><p>Please try again later.</p><pre>${err.message}</pre></body></html>`);
  }
});

export const ssr = onRequest(app);

// ─────────────────────────────────────────────────────────────────────────────
// Other Functions
// ─────────────────────────────────────────────────────────────────────────────

// Daily content generator - runs at 6 AM UTC
export { dailyContentGenerator } from './src/scheduled/dailyContentGenerator.js';

// Email queue processor - runs every hour, sends delayed sequence emails
export { emailQueueProcessor } from './src/scheduled/emailQueueProcessor.js';

// Affiliate redirect handler - /go/:productId
export { affiliateRedirect } from './src/affiliate/redirectHandler.js';

// Stripe checkout session creator
export { createCheckoutSession } from './src/checkout/createSession.js';

// Stripe webhook — fulfil orders (record to Firestore + send emails)
export { stripeWebhook } from './src/checkout/webhookHandler.js';

export { ariaChat } from './src/aria/ariaChat.js';
