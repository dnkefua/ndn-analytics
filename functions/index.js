import { onRequest } from 'firebase-functions/v2/https';
import express from 'express';
import { join, dirname } from 'node:path';
import { readFileSync } from 'node:fs';
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
// SSR Function (existing)
// ─────────────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const DIST_PATH = __dirname;
const INDEX_HTML = join(DIST_PATH, 'index.html');
const SSR_ENTRY = join(DIST_PATH, 'entry-ssr.js');

let template;
let render;

async function init() {
  try {
    template = readFileSync(INDEX_HTML, 'utf-8');
    const ssrUrl = pathToFileURL(SSR_ENTRY).href;
    const mod = await import(ssrUrl);
    render = mod.render;
    console.log('SSR initialized successfully');
  } catch (err) {
    console.error('SSR init error:', err);
  }
}

init();

app.use(express.static(DIST_PATH, {
  maxAge: '1y',
  immutable: true,
  index: false, // Don't serve index.html for directory requests
}));

// Explicit XML routes — must come before the SSR catch-all so Google gets
// correct Content-Type instead of text/html from the SSR renderer.
app.get('/feed.xml', (req, res) => {
  res.set('Content-Type', 'application/rss+xml; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=3600');
  res.sendFile(join(DIST_PATH, 'feed.xml'));
});

app.get('/sitemap.xml', (req, res) => {
  res.set('Content-Type', 'application/xml; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=3600');
  res.sendFile(join(DIST_PATH, 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=3600');
  res.sendFile(join(DIST_PATH, 'robots.txt'));
});

// Serve whitepaper standalone page (not through React SSR)
app.get('/whitepaper-standalone', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.sendFile(join(DIST_PATH, 'whitepaper', 'index.html'));
});

app.get('*', async (req, res) => {
  try {
    if (!render) {
      await init();
    }
    const url = req.originalUrl;
    const result = await render(url);
    const appHtml = result.html;

    const html = template.replace('<!--ssr-outlet-->', appHtml);
    res.set('Content-Type', 'text/html').send(html);
  } catch (err) {
    console.error('SSR Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

export const ssr = onRequest(app);

// ─────────────────────────────────────────────────────────────────────────────
// AI News & Product Aggregation Functions
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
