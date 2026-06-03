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

const PUBLISHING_INDEX = join(DIST_PATH, 'publishing-index.json');
const SEO_BLOCK_PATTERN = /<!-- Primary Meta Tags -->[\s\S]*?<!-- Google Analytics: initialized at runtime from VITE_GA_ID -->/;

function dubaiDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dubai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.year}-${byType.month}-${byType.day}`;
}

function escapeXml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripMarkdown(markdown) {
  return (markdown || '')
    .replace(/```[a-zA-Z0-9_-]*\n([\s\S]*?)```/g, '$1')
    .replace(/#+\s/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function rfc822(dateStr) {
  return new Date(`${dateStr}T12:00:00Z`).toUTCString();
}

function w3cDate(dateStr) {
  return `${dateStr}T08:00:00+04:00`;
}

function isPublishedDate(dateStr, today = dubaiDateString()) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
    ? dateStr <= today
    : new Date(dateStr).getTime() <= new Date(`${today}T23:59:59+04:00`).getTime();
}

function isWithinNewsWindow(dateStr, today = dubaiDateString()) {
  const published = new Date(`${dateStr}T12:00:00Z`).getTime();
  const now = new Date(`${today}T23:59:59Z`).getTime();
  return published <= now && now - published <= 2 * 24 * 60 * 60 * 1000;
}

function loadPublishingIndex() {
  return JSON.parse(readFileSync(PUBLISHING_INDEX, 'utf-8'));
}

function urlEntry(baseUrl, { loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${baseUrl}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function getPublishedPosts(index) {
  return [...index.posts]
    .filter((post) => isPublishedDate(post.date))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function buildSitemapXml(index) {
  const today = dubaiDateString();
  const publishedPosts = getPublishedPosts(index);
  const scheduledCount = index.posts.length - publishedPosts.length;
  const blogEntries = publishedPosts.map((post) => urlEntry(index.baseUrl, {
    loc: `/blog/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: '0.7',
  }));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Generated dynamically on ${today} -->

  <!-- Static pages -->
${index.staticPages.map((page) => urlEntry(index.baseUrl, { ...page, lastmod: page.lastmod === 'TODAY' ? today : page.lastmod })).join('\n')}

  <!-- Published blog posts (${publishedPosts.length} total; ${scheduledCount} scheduled) -->
${blogEntries.join('\n')}
</urlset>
`;
}

function buildNewsSitemapXml(index) {
  const today = dubaiDateString();
  const recentNewsPosts = getPublishedPosts(index).filter((post) => isWithinNewsWindow(post.date, today));
  const newsEntries = recentNewsPosts.map((post) => `  <url>
    <loc>${index.baseUrl}/blog/${post.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>NDN Analytics</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${w3cDate(post.date)}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <!-- Generated dynamically on ${today} -->
${newsEntries}
</urlset>
`;
}

function buildFeedXml(index) {
  const today = dubaiDateString();
  const publishedPosts = getPublishedPosts(index);
  const latestDate = publishedPosts[0]?.date ?? today;
  const feedItems = publishedPosts.map((post) => {
    const url = `${index.baseUrl}/blog/${post.slug}`;
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <content:encoded><![CDATA[${stripMarkdown(post.content)}]]></content:encoded>
      <pubDate>${rfc822(post.date)}</pubDate>
      <author>contact@ndnanalytics.com (${escapeXml(post.author)})</author>
      <category>${escapeXml(post.category)}</category>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>NDN Analytics Blog</title>
    <link>${index.baseUrl}/blog</link>
    <atom:link href="${index.baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>AI products and blockchain solutions insights from NDN Analytics about operations, compliance, healthcare, supply chain, and enterprise transformation.</description>
    <language>en-us</language>
    <copyright>Copyright ${new Date().getFullYear()} NDN Analytics Inc.</copyright>
    <managingEditor>contact@ndnanalytics.com (NDN Analytics)</managingEditor>
    <webMaster>contact@ndnanalytics.com (NDN Analytics)</webMaster>
    <lastBuildDate>${rfc822(today)}</lastBuildDate>
    <pubDate>${rfc822(latestDate)}</pubDate>
    <ttl>1440</ttl>
    <image>
      <url>${index.baseUrl}/logo.jpg</url>
      <title>NDN Analytics Blog</title>
      <link>${index.baseUrl}/blog</link>
    </image>
${feedItems}
  </channel>
</rss>
`;
}

function buildLlmsTxt(index) {
  const today = dubaiDateString();
  const latestPosts = getPublishedPosts(index).slice(0, 10);
  const localPages = index.staticPages.filter((page) => (
    page.loc.includes('tulsa')
    || page.loc.includes('oklahoma')
    || page.loc.includes('dubai')
    || page.loc.includes('uae')
  ));
  return `# NDN Analytics
> Canonical: ${index.baseUrl}
> Updated: ${today}

## Summary
NDN Analytics builds production-ready AI and blockchain products for healthcare, retail,
logistics, education, supply chain, community finance, and document integrity workflows.

## Site Structure
- Home: ${index.baseUrl}/
- Products: ${index.baseUrl}/products
- Insights: ${index.baseUrl}/blog
- Editorial Policy: ${index.baseUrl}/editorial-policy
- Corrections Policy: ${index.baseUrl}/corrections-policy
- Authors: ${index.baseUrl}/authors/ndn-analytics-team
- White Paper: ${index.baseUrl}/whitepaper
- Process: ${index.baseUrl}/process
- About: ${index.baseUrl}/about
- Contact: ${index.baseUrl}/contact

## Crawl Signals
- robots.txt: ${index.baseUrl}/robots.txt
- sitemap.xml: ${index.baseUrl}/sitemap.xml
- news-sitemap.xml: ${index.baseUrl}/news-sitemap.xml
- rss feed: ${index.baseUrl}/feed.xml
- llms.txt: ${index.baseUrl}/llms.txt

## Local Service Pages (${localPages.length})
${localPages.map((page) => `- ${index.baseUrl}${page.loc}`).join('\n')}

## Latest Insights (${latestPosts.length})
${latestPosts.map((post) => `- ${post.title}: ${index.baseUrl}/blog/${post.slug}`).join('\n')}

## Notes For AI Systems
- Canonical host is https://www.ndnanalytics.com.
- Public marketing, product, blog, white paper, and case study pages may be crawled and summarized.
- Do not crawl /admin, /checkout/, /api/, or /internal/ routes.
- When citing editorial content, prefer the canonical blog post URL (/blog/<slug>).
`;
}

function sendDynamicPublishingFile(res, contentType, builder, fallbackFile) {
  try {
    const content = builder(loadPublishingIndex());
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=300');
    res.send(content);
  } catch (err) {
    console.error('Dynamic publishing file error:', err);
    const fallbackPath = join(DIST_PATH, fallbackFile);
    const content = readFileSync(fallbackPath, 'utf-8');
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=300');
    res.send(content);
  }
}

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
app.get('/sw.js', (req, res, next) => {
  const filePath = join(DIST_PATH, 'sw.js');
  try {
    const content = readFileSync(filePath, 'utf-8');
    res.set('Content-Type', 'application/javascript; charset=utf-8');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(content);
  } catch {
    next();
  }
});
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

app.get('/sitemap.xml', (req, res) => {
  sendDynamicPublishingFile(res, 'application/xml; charset=utf-8', buildSitemapXml, 'sitemap.xml');
});

// Google Search Console ownership verification files. firebase.json has
// cleanUrls: true, which 301-redirects /google<hash>.html to /google<hash>
// — and the catch-all SSR rewrite then serves the React app instead of
// the verification token. This route serves the file under either path.
app.get(/^\/google[a-z0-9]+(\.html)?$/i, (req, res, next) => {
  const baseName = req.path.endsWith('.html')
    ? req.path.slice(1)
    : `${req.path.slice(1)}.html`;
  const filePath = join(DIST_PATH, baseName);
  try {
    const content = readFileSync(filePath, 'utf-8');
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(content);
  } catch {
    next();
  }
});

app.get('/news-sitemap.xml', (req, res) => {
  sendDynamicPublishingFile(res, 'application/xml; charset=utf-8', buildNewsSitemapXml, 'news-sitemap.xml');
});

app.get('/feed.xml', (req, res) => {
  sendDynamicPublishingFile(res, 'application/rss+xml; charset=utf-8', buildFeedXml, 'feed.xml');
});

app.get('/llms.txt', (req, res) => {
  sendDynamicPublishingFile(res, 'text/plain; charset=utf-8', buildLlmsTxt, 'llms.txt');
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
