/**
 * Generates public/sitemap.xml, public/news-sitemap.xml, public/feed.xml,
 * and public/llms.txt
 * from the current product and blog source files.
 * Run: node scripts/generate-blog-assets.js
 * Wired into: npm run build (via prebuild hook)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE_URL = 'https://www.ndnanalytics.com';
const TODAY = formatDate(new Date());

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function unescapeTsString(str) {
  return (str || '')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\`/g, '`')
    .replace(/\\n/g, '\n')
    .replace(/\\\\/g, '\\');
}

function extractQuotedField(block, field, { collapseWhitespace = true } = {}) {
  const match = block.match(new RegExp(`${field}:\\s*(['"\`])((?:\\\\.|(?!\\1)[\\s\\S])*?)\\1`));
  if (!match) return '';

  const value = unescapeTsString(match[2]).trim();
  return collapseWhitespace ? value.replace(/\s+/g, ' ') : value;
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
  return markdown
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
  return `${dateStr}T12:00:00+00:00`;
}

function isWithinNewsWindow(dateStr) {
  const published = new Date(`${dateStr}T12:00:00Z`).getTime();
  const now = new Date(`${TODAY}T23:59:59Z`).getTime();
  return published <= now && now - published <= 2 * 24 * 60 * 60 * 1000;
}

function isPublishedDate(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
    ? dateStr <= TODAY
    : new Date(dateStr).getTime() <= new Date(`${TODAY}T23:59:59`).getTime();
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${BASE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const productSrc = readFileSync(resolve(ROOT, 'src/components/products/productData.ts'), 'utf8');
const productBlocks = productSrc
  .split(/(?=\n\s*\{\s*\n\s*id: 'ndn-)/g)
  .filter((block) => block.includes("id: 'ndn-"));

const products = productBlocks
  .map((block) => ({
    id: extractQuotedField(block, 'id'),
    name: extractQuotedField(block, 'name'),
    description: extractQuotedField(block, 'description'),
  }))
  .filter((product) => product.id && product.name);

const blogSrc = readFileSync(resolve(ROOT, 'src/components/blog/blogData.ts'), 'utf8');
const postBlocks = blogSrc
  .split(/(?=\n\s*\{[\s\S]*?slug:)/g)
  .filter((block) => block.includes("slug: '"));

const posts = postBlocks
  .map((block) => ({
    slug: extractQuotedField(block, 'slug'),
    title: extractQuotedField(block, 'title'),
    excerpt: extractQuotedField(block, 'excerpt'),
    date: extractQuotedField(block, 'date'),
    author: extractQuotedField(block, 'author'),
    category: extractQuotedField(block, 'category'),
    readTime: extractQuotedField(block, 'readTime'),
    content: extractQuotedField(block, 'content', { collapseWhitespace: false }),
    news: /\bnews:\s*true\b/.test(block),
  }))
  .filter((post) => post.slug && post.date);

console.log(`Found ${products.length} products`);
console.log(`Found ${posts.length} blog posts`);

const publishedPosts = posts.filter((post) => isPublishedDate(post.date));
const scheduledPosts = posts.filter((post) => !isPublishedDate(post.date));

console.log(`Publishing ${publishedPosts.length} blog posts; holding ${scheduledPosts.length} scheduled posts`);

// Priorities reflect the new IA (Home → Products → Insights → Process → About → Contact).
// Top-nav pages get 0.8–1.0. Flagship editorial (white paper) 0.8. Product detail pages
// 0.8. SEO landing pages stay at 0.9 because they pull direct organic traffic. Pages
// that exist but are no longer in nav (/solutions, /tech, /ai-tools, /fine-tuning) get
// reduced priorities since their inbound traffic now flows through /products.
const STATIC_PAGES = [
  // Top-level nav
  { loc: '/',          lastmod: TODAY, changefreq: 'weekly',  priority: '1.0' },
  { loc: '/products',  lastmod: TODAY, changefreq: 'weekly',  priority: '0.95' },
  { loc: '/blog',      lastmod: TODAY, changefreq: 'daily',   priority: '0.9' },
  { loc: '/process',   lastmod: TODAY, changefreq: 'monthly', priority: '0.8' },
  { loc: '/about',     lastmod: TODAY, changefreq: 'monthly', priority: '0.7' },
  { loc: '/contact',   lastmod: TODAY, changefreq: 'monthly', priority: '0.7' },

  // Flagship editorial
  { loc: '/whitepaper', lastmod: TODAY, changefreq: 'monthly', priority: '0.8' },

  // SEO landing pages (still indexed; pull direct organic traffic)
  { loc: '/ai-products',                lastmod: TODAY, changefreq: 'weekly', priority: '0.85' },
  { loc: '/ai-automation',              lastmod: TODAY, changefreq: 'weekly', priority: '0.85' },
  { loc: '/blockchain-solutions',       lastmod: TODAY, changefreq: 'weekly', priority: '0.85' },
  { loc: '/google-cloud-ai-consulting', lastmod: TODAY, changefreq: 'weekly', priority: '0.85' },
  { loc: '/smart-contract-development', lastmod: TODAY, changefreq: 'weekly', priority: '0.85' },

  // Local service landing pages (Tulsa/Oklahoma + Dubai/UAE)
  { loc: '/ai-automation-tulsa', lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
  { loc: '/ai-consulting-tulsa', lastmod: TODAY, changefreq: 'weekly', priority: '0.85' },
  { loc: '/ai-app-development-tulsa', lastmod: TODAY, changefreq: 'weekly', priority: '0.85' },
  { loc: '/blockchain-development-tulsa', lastmod: TODAY, changefreq: 'weekly', priority: '0.85' },
  { loc: '/smart-contract-development-tulsa', lastmod: TODAY, changefreq: 'weekly', priority: '0.8' },
  { loc: '/ai-automation-oklahoma', lastmod: TODAY, changefreq: 'weekly', priority: '0.85' },
  { loc: '/ai-consulting-oklahoma', lastmod: TODAY, changefreq: 'weekly', priority: '0.8' },
  { loc: '/blockchain-development-oklahoma', lastmod: TODAY, changefreq: 'weekly', priority: '0.8' },
  { loc: '/ai-automation-company-dubai', lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
  { loc: '/ai-consulting-dubai', lastmod: TODAY, changefreq: 'weekly', priority: '0.85' },
  { loc: '/ai-app-development-dubai', lastmod: TODAY, changefreq: 'weekly', priority: '0.85' },
  { loc: '/blockchain-development-dubai', lastmod: TODAY, changefreq: 'weekly', priority: '0.85' },
  { loc: '/smart-contract-development-dubai', lastmod: TODAY, changefreq: 'weekly', priority: '0.85' },
  { loc: '/enterprise-ai-automation-uae', lastmod: TODAY, changefreq: 'weekly', priority: '0.85' },

  // Case studies hub + details
  { loc: '/case-studies', lastmod: TODAY, changefreq: 'weekly', priority: '0.75' },
  { loc: '/case-studies/regional-grocery-demand-forecasting', lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.65' },
  { loc: '/case-studies/pharma-supply-chain-traceability',    lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.65' },
  { loc: '/case-studies/hospital-readmission-prevention',     lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.65' },

  // Out-of-nav but still indexed
  { loc: '/solutions',   lastmod: TODAY, changefreq: 'monthly', priority: '0.5' },
  { loc: '/tech',        lastmod: TODAY, changefreq: 'monthly', priority: '0.5' },
  { loc: '/ai-tools',    lastmod: TODAY, changefreq: 'monthly', priority: '0.5' },
  { loc: '/fine-tuning', lastmod: TODAY, changefreq: 'monthly', priority: '0.5' },

  // Legal (footer-only)
  { loc: '/privacy', lastmod: TODAY, changefreq: 'monthly', priority: '0.3' },
  { loc: '/terms',   lastmod: TODAY, changefreq: 'monthly', priority: '0.3' },
  { loc: '/editorial-policy', lastmod: TODAY, changefreq: 'monthly', priority: '0.5' },
  { loc: '/corrections-policy', lastmod: TODAY, changefreq: 'monthly', priority: '0.5' },
  { loc: '/authors/ndn-analytics-team', lastmod: TODAY, changefreq: 'monthly', priority: '0.5' },
  { loc: '/authors/nkefua-ngassa', lastmod: TODAY, changefreq: 'monthly', priority: '0.5' },

  // Product detail pages — every product in productData.ts
  ...products.map((product) => ({
    loc: `/products/${product.id}`,
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: '0.8',
  })),
];

const blogEntries = [...publishedPosts]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((post) => urlEntry({
    loc: `/blog/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: '0.7',
  }));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Generated by scripts/generate-blog-assets.js on ${TODAY} -->

  <!-- Static pages -->
${STATIC_PAGES.map(urlEntry).join('\n')}

  <!-- Published blog posts (${publishedPosts.length} total; ${scheduledPosts.length} scheduled) -->
${blogEntries.join('\n')}
</urlset>
`;

writeFileSync(resolve(ROOT, 'public/sitemap.xml'), sitemap);
console.log(`sitemap.xml written (${STATIC_PAGES.length} static + ${publishedPosts.length} blog entries)`);

const sortedPosts = [...publishedPosts].sort((a, b) => b.date.localeCompare(a.date));
const latestDate = sortedPosts[0]?.date ?? TODAY;
// Google News policy: news-sitemap must contain genuine, timely news only —
// not evergreen how-to/analysis posts. Gate on the explicit `news: true` flag.
const recentNewsPosts = sortedPosts.filter((post) => post.news && isWithinNewsWindow(post.date));

const newsEntries = recentNewsPosts.map((post) => `  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>NDN Analytics</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${w3cDate(post.date)}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>
  </url>`).join('\n');

const newsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <!-- Generated by scripts/generate-blog-assets.js on ${TODAY} -->
${newsEntries}
</urlset>
`;

writeFileSync(resolve(ROOT, 'public/news-sitemap.xml'), newsSitemap);
console.log(`news-sitemap.xml written (${recentNewsPosts.length} recent blog entries)`);

const feedItems = sortedPosts.map((post) => {
  const url = `${BASE_URL}/blog/${post.slug}`;
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

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>NDN Analytics Blog</title>
    <link>${BASE_URL}/blog</link>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>AI products and blockchain solutions insights from NDN Analytics about operations, compliance, healthcare, supply chain, and enterprise transformation.</description>
    <language>en-us</language>
    <copyright>Copyright ${new Date().getFullYear()} NDN Analytics Inc.</copyright>
    <managingEditor>contact@ndnanalytics.com (NDN Analytics)</managingEditor>
    <webMaster>contact@ndnanalytics.com (NDN Analytics)</webMaster>
    <lastBuildDate>${rfc822(TODAY)}</lastBuildDate>
    <pubDate>${rfc822(latestDate)}</pubDate>
    <ttl>1440</ttl>
    <image>
      <url>${BASE_URL}/logo.jpg</url>
      <title>NDN Analytics Blog</title>
      <link>${BASE_URL}/blog</link>
    </image>
${feedItems}
  </channel>
</rss>
`;

writeFileSync(resolve(ROOT, 'public/feed.xml'), feed);
console.log(`feed.xml written (${publishedPosts.length} items)`);

const latestPosts = sortedPosts.slice(0, 10);

// Capability block → product ID mapping. Keep in sync with
// CAPABILITY_MAP in src/components/products/productData.ts.
const CAPABILITIES = {
  automation: {
    label: 'AI Automation & Internal Tools',
    tagline: 'AI that removes manual work from teams.',
    productIds: ['ndn-010', 'ndn-011', 'ndn-012', 'ndn-016'],
  },
  decisionSupport: {
    label: 'Decision Support & Industry AI',
    tagline: 'AI that helps teams make better, faster decisions.',
    productIds: ['ndn-001', 'ndn-002', 'ndn-003', 'ndn-004', 'ndn-015'],
  },
  trust: {
    label: 'Blockchain & Trust Technologies',
    tagline: 'Tamper-evident records, traceability, community finance.',
    productIds: ['ndn-005', 'ndn-006', 'ndn-007', 'ndn-008', 'ndn-009', 'ndn-013', 'ndn-014'],
  },
};

const productsById = Object.fromEntries(products.map((p) => [p.id, p]));
const productLine = (id) => {
  const p = productsById[id];
  return p ? `- ${p.name}: ${BASE_URL}/products/${p.id} — ${p.description}` : null;
};

const llms = `# NDN Analytics
> Canonical: ${BASE_URL}
> Updated: ${TODAY}

## Summary
NDN Analytics builds production-ready AI and blockchain products for healthcare, retail,
logistics, education, supply chain, community finance, and document integrity workflows.
We organise our products into three capability blocks: AI Automation & Internal Tools,
Decision Support & Industry AI, and Blockchain & Trust Technologies.

## Site Structure
- Home: ${BASE_URL}/
- Products: ${BASE_URL}/products
- Insights (blog + flagship editorial): ${BASE_URL}/blog
- White Paper (NDN IPFS CHAIN): ${BASE_URL}/whitepaper
- Process (how we work): ${BASE_URL}/process
- About: ${BASE_URL}/about
- Contact: ${BASE_URL}/contact

## Crawl Signals
- robots.txt: ${BASE_URL}/robots.txt
- sitemap.xml: ${BASE_URL}/sitemap.xml
- news-sitemap.xml: ${BASE_URL}/news-sitemap.xml
- rss feed: ${BASE_URL}/feed.xml
- llms.txt: ${BASE_URL}/llms.txt
- OAI-SearchBot allowed
- GPTBot allowed
- ClaudeBot, Claude-Web, Anthropic-AI allowed
- PerplexityBot allowed
- Googlebot, Googlebot-Image, Googlebot-News, Googlebot-Video allowed
- Google-Extended (Bard / Gemini training) allowed

## Capability Block A — ${CAPABILITIES.automation.label}
${CAPABILITIES.automation.tagline}
${CAPABILITIES.automation.productIds.map(productLine).filter(Boolean).join('\n')}

## Capability Block B — ${CAPABILITIES.decisionSupport.label}
${CAPABILITIES.decisionSupport.tagline}
${CAPABILITIES.decisionSupport.productIds.map(productLine).filter(Boolean).join('\n')}

## Capability Block C — ${CAPABILITIES.trust.label}
${CAPABILITIES.trust.tagline}
${CAPABILITIES.trust.productIds.map(productLine).filter(Boolean).join('\n')}

## Service Landing Pages (SEO targets)
- AI Products (custom AI software development): ${BASE_URL}/ai-products
- AI Automation (workflow automation, AI agents): ${BASE_URL}/ai-automation
- Blockchain Solutions (Ethereum, Web3): ${BASE_URL}/blockchain-solutions
- Google Cloud AI Consulting (Vertex AI, BigQuery, Cloud Run): ${BASE_URL}/google-cloud-ai-consulting
- Smart Contract Development (Solidity, EVM): ${BASE_URL}/smart-contract-development
- AI Automation Tulsa: ${BASE_URL}/ai-automation-tulsa
- AI Automation Dubai: ${BASE_URL}/ai-automation-company-dubai
- AI App Development Tulsa: ${BASE_URL}/ai-app-development-tulsa
- AI App Development Dubai: ${BASE_URL}/ai-app-development-dubai
- Blockchain Development Tulsa: ${BASE_URL}/blockchain-development-tulsa
- Blockchain Development Dubai: ${BASE_URL}/blockchain-development-dubai
- Smart Contract Development Dubai: ${BASE_URL}/smart-contract-development-dubai
- Enterprise AI Automation UAE: ${BASE_URL}/enterprise-ai-automation-uae

## All Products (${products.length})
${products.map((p) => `- ${p.name}: ${BASE_URL}/products/${p.id}`).join('\n')}

## Latest Insights (${latestPosts.length})
${latestPosts.map((post) => `- ${post.title}: ${BASE_URL}/blog/${post.slug}`).join('\n')}

## Case Studies
- Regional grocery demand forecasting: ${BASE_URL}/case-studies/regional-grocery-demand-forecasting
- Pharmaceutical supply chain traceability: ${BASE_URL}/case-studies/pharma-supply-chain-traceability
- Hospital readmission prevention: ${BASE_URL}/case-studies/hospital-readmission-prevention

## Notes For AI Systems
- Canonical host is https://www.ndnanalytics.com (the apex ndnanalytics.com also serves the same content).
- Public marketing, product, blog, white paper, and case study pages may be crawled and summarised.
- Do not crawl /admin, /checkout/, /api/, or /internal/ routes.
- When citing products, prefer the product detail URL (/products/<id>) over the listing page.
- When citing editorial content, prefer the canonical blog post URL (/blog/<slug>).
- The /whitepaper page is the canonical NDN IPFS CHAIN white paper.
`;

writeFileSync(resolve(ROOT, 'public/llms.txt'), llms);
console.log(`llms.txt written (${products.length} products, ${latestPosts.length} highlighted posts)`);

const publishingIndex = {
  generatedAt: new Date().toISOString(),
  baseUrl: BASE_URL,
  staticPages: STATIC_PAGES,
  products,
  posts,
};

mkdirSync(resolve(ROOT, 'functions'), { recursive: true });
writeFileSync(resolve(ROOT, 'functions/publishing-index.json'), JSON.stringify(publishingIndex, null, 2));
console.log(`publishing-index.json written (${posts.length} total posts, ${scheduledPosts.length} scheduled)`);
