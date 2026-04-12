import { onRequest } from 'firebase-functions/v2/https';
import express from 'express';
import { join, dirname } from 'node:path';
import { readFileSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';

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
}));

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
