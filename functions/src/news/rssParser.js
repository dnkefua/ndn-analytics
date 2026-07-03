// RSS/Atom feed parser for news aggregation
import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'NDN Analytics News Aggregator/1.0',
  },
});

// Default news sources
export const DEFAULT_SOURCES = [
  {
    id: 'mit-tech-review',
    name: 'MIT Technology Review',
    feedUrl: 'https://www.technologyreview.com/feed/',
    category: 'ai',
    priority: 1,
  },
  {
    id: 'venturebeat-ai',
    name: 'VentureBeat AI',
    feedUrl: 'https://venturebeat.com/category/ai/feed/',
    category: 'ai',
    priority: 2,
  },
  {
    id: 'techcrunch-ai',
    name: 'TechCrunch AI',
    feedUrl: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'ai',
    priority: 3,
  },
  {
    id: 'coindesk',
    name: 'CoinDesk',
    feedUrl: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    category: 'blockchain',
    priority: 1,
  },
  {
    id: 'the-block',
    name: 'The Block',
    feedUrl: 'https://www.theblock.co/rss.xml',
    category: 'blockchain',
    priority: 2,
  },
];

// Keywords for filtering relevant articles
const INCLUDE_KEYWORDS = [
  'artificial intelligence', 'ai', 'machine learning', 'llm', 'large language model',
  'generative ai', 'gpt', 'claude', 'chatgpt', 'demand forecasting', 'supply chain',
  'healthcare ai', 'blockchain', 'ethereum', 'smart contract', 'tokenization',
  'enterprise ai', 'automation', 'deep learning', 'neural network', 'vertex ai',
  'google cloud', 'defi', 'web3', 'crypto', 'digital transformation',
];

const EXCLUDE_KEYWORDS = [
  'meme coin', 'nft drop', 'airdrop', 'crypto crash', 'celebrity',
  'elon musk', 'dogecoin', 'shiba', 'pump and dump',
];

/**
 * Fetch and parse an RSS feed
 */
export async function fetchFeed(feedUrl) {
  try {
    const feed = await parser.parseURL(feedUrl);
    return feed.items.map(item => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      content: item.contentSnippet || item.content || '',
      creator: item.creator || item.author || '',
    }));
  } catch (error) {
    console.error(`Failed to fetch feed ${feedUrl}:`, error.message);
    return [];
  }
}

/**
 * Check if article is relevant based on keywords
 */
export function isRelevantArticle(article) {
  const text = `${article.title} ${article.content}`.toLowerCase();

  // Check for exclusions first
  for (const keyword of EXCLUDE_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      return false;
    }
  }

  // Check for inclusions
  for (const keyword of INCLUDE_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      return true;
    }
  }

  return false;
}

/**
 * Check if article is recent (within last 24 hours)
 */
export function isRecentArticle(article, hoursAgo = 24) {
  const articleDate = new Date(article.pubDate);
  const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  return articleDate >= cutoff;
}

/**
 * Generate a deterministic ID for an article (for deduplication)
 */
export function generateArticleId(url) {
  // Simple hash function for URL
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `article_${Math.abs(hash).toString(36)}`;
}

/**
 * Fetch articles from multiple sources and filter for relevance
 */
export async function fetchRelevantArticles(sources, maxArticles = 5) {
  const allArticles = [];

  for (const source of sources) {
    if (!source.isActive) continue;

    const articles = await fetchFeed(source.feedUrl);

    for (const article of articles) {
      if (isRecentArticle(article) && isRelevantArticle(article)) {
        allArticles.push({
          ...article,
          sourceId: source.id,
          sourceName: source.name,
          category: source.category,
          priority: source.priority,
          articleId: generateArticleId(article.link),
        });
      }
    }
  }

  // Sort by priority and date
  allArticles.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return new Date(b.pubDate) - new Date(a.pubDate);
  });

  return allArticles.slice(0, maxArticles);
}
