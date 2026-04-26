/**
 * Generates public/sitemap.xml, public/feed.xml, and public/llms.txt
 * from the current product and blog source files.
 * Run: node scripts/generate-blog-assets.js
 * Wired into: npm run build (via prebuild hook)
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE_URL = 'https://www.ndnanalytics.com';
const TODAY = new Date().toISOString().split('T')[0];

function extractQuotedField(block, field) {
  const match = block.match(new RegExp(`${field}:\\s*['"\`]([^'"\`\\n]+)['"\`]`));
  return match ? match[1] : '';
}

function extractExcerpt(block) {
  const match = block.match(/excerpt:\s*[`'"]([^`'"]+)[`'"]/s);
  return match ? match[1].replace(/\s+/g, ' ').trim() : '';
}

function extractContent(block) {
  const start = block.indexOf('content: `');
  if (start === -1) return '';
  const inner = block.slice(start + 10);
  const end = inner.indexOf('`');
  return end === -1 ? inner : inner.slice(0, end);
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
    .replace(/#+\s/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`[^`]+`/g, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function rfc822(dateStr) {
  return new Date(`${dateStr}T12:00:00Z`).toUTCString();
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
    excerpt: extractExcerpt(block) || extractQuotedField(block, 'excerpt'),
    date: extractQuotedField(block, 'date'),
    author: extractQuotedField(block, 'author'),
    category: extractQuotedField(block, 'category'),
    readTime: extractQuotedField(block, 'readTime'),
    content: extractContent(block),
  }))
  .filter((post) => post.slug && post.date);

console.log(`Found ${products.length} products`);
console.log(`Found ${posts.length} blog posts`);

const STATIC_PAGES = [
  { loc: '/', lastmod: TODAY, changefreq: 'weekly', priority: '1.0' },
  { loc: '/products', lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
  { loc: '/solutions', lastmod: TODAY, changefreq: 'monthly', priority: '0.8' },
  { loc: '/tech', lastmod: TODAY, changefreq: 'monthly', priority: '0.7' },
  { loc: '/about', lastmod: TODAY, changefreq: 'monthly', priority: '0.7' },
  { loc: '/contact', lastmod: TODAY, changefreq: 'monthly', priority: '0.6' },
  { loc: '/ai-products', lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
  { loc: '/ai-automation', lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
  { loc: '/blockchain-solutions', lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
  { loc: '/google-cloud-ai-consulting', lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
  { loc: '/smart-contract-development', lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
  { loc: '/blog', lastmod: TODAY, changefreq: 'weekly', priority: '0.8' },
  { loc: '/case-studies', lastmod: TODAY, changefreq: 'weekly', priority: '0.8' },
  { loc: '/fine-tuning', lastmod: TODAY, changefreq: 'weekly', priority: '0.7' },
  ...products.map((product) => ({
    loc: `/products/${product.id}`,
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: '0.8',
  })),
  { loc: '/case-studies/regional-grocery-demand-forecasting', lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.7' },
  { loc: '/case-studies/pharma-supply-chain-traceability', lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.7' },
  { loc: '/case-studies/hospital-readmission-prevention', lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.7' },
];

const blogEntries = [...posts]
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

  <!-- Blog posts (${posts.length} total) -->
${blogEntries.join('\n')}
</urlset>
`;

writeFileSync(resolve(ROOT, 'public/sitemap.xml'), sitemap);
console.log(`sitemap.xml written (${STATIC_PAGES.length} static + ${posts.length} blog entries)`);

const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));
const latestDate = sortedPosts[0]?.date ?? TODAY;

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
console.log(`feed.xml written (${posts.length} items)`);

const latestPosts = sortedPosts.slice(0, 8);
const llms = `# NDN Analytics
> Canonical: ${BASE_URL}
> Updated: ${TODAY}

## Summary
NDN Analytics builds enterprise AI and blockchain products for operations, compliance, healthcare, logistics, community finance, and document integrity workflows.

## Crawl Signals
- robots.txt: ${BASE_URL}/robots.txt
- sitemap.xml: ${BASE_URL}/sitemap.xml
- rss feed: ${BASE_URL}/feed.xml
- llms.txt: ${BASE_URL}/llms.txt
- OAI-SearchBot allowed in robots.txt
- GPTBot allowed in robots.txt
- ClaudeBot allowed in robots.txt
- PerplexityBot allowed in robots.txt

## Priority URLs
- ${BASE_URL}/
- ${BASE_URL}/products
- ${BASE_URL}/blog
- ${BASE_URL}/solutions
- ${BASE_URL}/contact

## Service Practices
- AI Products (custom AI software development): ${BASE_URL}/ai-products
- AI Automation (workflow automation, AI agents): ${BASE_URL}/ai-automation
- Blockchain Solutions (Ethereum, Web3): ${BASE_URL}/blockchain-solutions
- Google Cloud AI Consulting (Vertex AI, BigQuery, Cloud Run): ${BASE_URL}/google-cloud-ai-consulting
- Smart Contract Development (Solidity, EVM): ${BASE_URL}/smart-contract-development

## Products (${products.length})
${products.map((product) => `- ${product.name}: ${BASE_URL}/products/${product.id}`).join('\n')}

## Latest Blog Posts
${latestPosts.map((post) => `- ${post.title}: ${BASE_URL}/blog/${post.slug}`).join('\n')}

## Notes For AI Systems
- Canonical host is https://www.ndnanalytics.com
- Public marketing, product, and blog pages may be crawled and summarized.
- Do not rely on /admin, /checkout/, /api/, or other internal routes.
- Prefer canonical URLs, product detail pages, and blog article pages when citing the site.
`;

writeFileSync(resolve(ROOT, 'public/llms.txt'), llms);
console.log(`llms.txt written (${products.length} products, ${latestPosts.length} highlighted posts)`);
