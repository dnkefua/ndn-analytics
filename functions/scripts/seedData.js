/**
 * Seed script for initial Firestore data
 * Run with: node functions/scripts/seedData.js
 *
 * Prerequisites:
 * - Firebase Admin SDK initialized
 * - GOOGLE_APPLICATION_CREDENTIALS env var set to service account key path
 *   OR run from Cloud Shell with default credentials
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// ============ RSS News Sources ============
const NEWS_SOURCES = [
  {
    name: 'MIT Technology Review',
    feedUrl: 'https://www.technologyreview.com/feed/',
    category: 'ai',
    priority: 1,
    isActive: true,
  },
  {
    name: 'VentureBeat AI',
    feedUrl: 'https://venturebeat.com/category/ai/feed/',
    category: 'ai',
    priority: 1,
    isActive: true,
  },
  {
    name: 'TechCrunch Enterprise',
    feedUrl: 'https://techcrunch.com/category/enterprise/feed/',
    category: 'enterprise',
    priority: 2,
    isActive: true,
  },
  {
    name: 'CoinDesk',
    feedUrl: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    category: 'blockchain',
    priority: 2,
    isActive: true,
  },
  {
    name: 'The Block',
    feedUrl: 'https://www.theblock.co/rss.xml',
    category: 'blockchain',
    priority: 2,
    isActive: true,
  },
  {
    name: 'Ars Technica AI',
    feedUrl: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    category: 'ai',
    priority: 3,
    isActive: true,
  },
];

// ============ AI Products - High-Paying Affiliate Programs ============
const AI_PRODUCTS = [
  // ─── AI Writing Tools (Highest Commissions) ───
  {
    name: 'Jasper AI',
    tagline: 'AI copilot for enterprise marketing teams',
    description: 'Generate marketing copy, blog posts, social media content, and ads at scale. Used by 100,000+ teams worldwide.',
    logoUrl: 'https://www.jasper.ai/favicon.ico',
    websiteUrl: 'https://www.jasper.ai',
    affiliateUrl: 'https://www.jasper.ai?fpr=ndnanalytics',
    affiliateProgramUrl: 'https://www.jasper.ai/partners',
    affiliateProgram: 'partnerstack',
    commissionRate: '30% recurring',
    cookieDuration: 30,
    category: 'productivity',
    tags: ['ai', 'writing', 'marketing', 'content', 'copywriting'],
    pricing: 'paid',
    featured: true,
    clickCount: 0,
    sortOrder: 1,
    isActive: true,
    ndnServiceTieIn: 'NDN Analytics can integrate Jasper into your content pipeline for automated blog generation',
  },
  {
    name: 'Copy.ai',
    tagline: 'AI-powered copywriting at scale',
    description: 'Create marketing copy, product descriptions, and sales content in seconds. 10M+ users trust Copy.ai.',
    logoUrl: 'https://www.copy.ai/favicon.ico',
    websiteUrl: 'https://www.copy.ai',
    affiliateUrl: 'https://www.copy.ai?via=ndnanalytics',
    affiliateProgramUrl: 'https://www.copy.ai/partners',
    affiliateProgram: 'partnerstack',
    commissionRate: '45% first year',
    cookieDuration: 60,
    category: 'productivity',
    tags: ['ai', 'writing', 'copywriting', 'marketing'],
    pricing: 'freemium',
    featured: true,
    clickCount: 0,
    sortOrder: 2,
    isActive: true,
    ndnServiceTieIn: 'Our team can embed Copy.ai workflows into your marketing automation stack',
  },
  {
    name: 'Writesonic',
    tagline: 'AI writer for blogs, ads, and SEO content',
    description: 'Create SEO-optimized content, landing pages, and ad copy. Integrates with WordPress and major platforms.',
    logoUrl: 'https://writesonic.com/favicon.ico',
    websiteUrl: 'https://writesonic.com',
    affiliateUrl: 'https://writesonic.com?via=ndnanalytics',
    affiliateProgramUrl: 'https://writesonic.com/affiliates',
    affiliateProgram: 'direct',
    commissionRate: '30% recurring',
    cookieDuration: 60,
    category: 'productivity',
    tags: ['ai', 'writing', 'seo', 'content', 'blogging'],
    pricing: 'freemium',
    featured: false,
    clickCount: 0,
    sortOrder: 3,
    isActive: true,
    ndnServiceTieIn: 'NDN Analytics implements custom AI writing solutions for enterprise content teams',
  },
  {
    name: 'Rytr',
    tagline: 'AI writing assistant for everyone',
    description: 'Generate high-quality content in 30+ languages. Affordable AI writing for individuals and teams.',
    logoUrl: 'https://rytr.me/favicon.ico',
    websiteUrl: 'https://rytr.me',
    affiliateUrl: 'https://rytr.me?via=ndnanalytics',
    affiliateProgramUrl: 'https://rytr.me/affiliate',
    affiliateProgram: 'direct',
    commissionRate: '30% lifetime',
    cookieDuration: 90,
    category: 'productivity',
    tags: ['ai', 'writing', 'multilingual', 'affordable'],
    pricing: 'freemium',
    featured: false,
    clickCount: 0,
    sortOrder: 4,
    isActive: true,
    ndnServiceTieIn: 'We help businesses integrate AI writing tools into existing content workflows',
  },

  // ─── Video AI (High-Value B2B) ───
  {
    name: 'Synthesia',
    tagline: 'AI video generation platform',
    description: 'Create professional videos from text with AI avatars. No cameras, studios, or actors needed.',
    logoUrl: 'https://www.synthesia.io/favicon.ico',
    websiteUrl: 'https://www.synthesia.io',
    affiliateUrl: 'https://www.synthesia.io?ref=ndnanalytics',
    affiliateProgramUrl: 'https://www.synthesia.io/affiliates',
    affiliateProgram: 'partnerstack',
    commissionRate: '20-25% recurring',
    cookieDuration: 90,
    category: 'design',
    tags: ['ai', 'video', 'avatars', 'training', 'marketing'],
    pricing: 'paid',
    featured: true,
    clickCount: 0,
    sortOrder: 10,
    isActive: true,
    ndnServiceTieIn: 'NDN Analytics embeds AI video generation into your training and marketing workflows',
  },
  {
    name: 'Pictory',
    tagline: 'Turn long-form content into short videos',
    description: 'Automatically create branded short videos from blogs, scripts, and recordings. Perfect for social media.',
    logoUrl: 'https://pictory.ai/favicon.ico',
    websiteUrl: 'https://pictory.ai',
    affiliateUrl: 'https://pictory.ai?ref=ndnanalytics',
    affiliateProgramUrl: 'https://pictory.ai/affiliate-program',
    affiliateProgram: 'direct',
    commissionRate: '50% first month, 20% recurring',
    cookieDuration: 30,
    category: 'design',
    tags: ['ai', 'video', 'social-media', 'repurposing'],
    pricing: 'paid',
    featured: false,
    clickCount: 0,
    sortOrder: 11,
    isActive: true,
    ndnServiceTieIn: 'Our team can automate your content-to-video pipeline using Pictory',
  },
  {
    name: 'Descript',
    tagline: 'All-in-one video and podcast editing',
    description: 'Edit video and audio by editing text. AI-powered transcription, overdub, and screen recording.',
    logoUrl: 'https://www.descript.com/favicon.ico',
    websiteUrl: 'https://www.descript.com',
    affiliateUrl: 'https://www.descript.com?ref=ndnanalytics',
    affiliateProgramUrl: 'https://www.descript.com/affiliates',
    affiliateProgram: 'impact',
    commissionRate: '15% recurring',
    cookieDuration: 30,
    category: 'productivity',
    tags: ['ai', 'video', 'audio', 'podcasting', 'transcription'],
    pricing: 'freemium',
    featured: false,
    clickCount: 0,
    sortOrder: 12,
    isActive: true,
    ndnServiceTieIn: 'See NDN Interpreter for our real-time transcription technology using similar AI',
  },

  // ─── Analytics & SEO ───
  {
    name: 'SurferSEO',
    tagline: 'AI-powered SEO and content optimization',
    description: 'Write content that ranks. Real-time SEO suggestions, keyword research, and content auditing.',
    logoUrl: 'https://surferseo.com/favicon.ico',
    websiteUrl: 'https://surferseo.com',
    affiliateUrl: 'https://surferseo.com?fp_ref=ndnanalytics',
    affiliateProgramUrl: 'https://surferseo.com/affiliate-program',
    affiliateProgram: 'direct',
    commissionRate: '25% recurring',
    cookieDuration: 60,
    category: 'analytics',
    tags: ['seo', 'content', 'ai', 'optimization', 'ranking'],
    pricing: 'paid',
    featured: true,
    clickCount: 0,
    sortOrder: 20,
    isActive: true,
    ndnServiceTieIn: 'NDN NeuroQuest uses similar cognitive AI for behavioral analytics',
  },

  // ─── Transcription & Productivity ───
  {
    name: 'Otter.ai',
    tagline: 'AI meeting assistant and transcription',
    description: 'Automated meeting notes, transcription, and summaries. Integrates with Zoom, Teams, and Google Meet.',
    logoUrl: 'https://otter.ai/favicon.ico',
    websiteUrl: 'https://otter.ai',
    affiliateUrl: 'https://otter.ai?ref=ndnanalytics',
    affiliateProgramUrl: 'https://otter.ai/affiliates',
    affiliateProgram: 'impact',
    commissionRate: '20%',
    cookieDuration: 30,
    category: 'productivity',
    tags: ['ai', 'transcription', 'meetings', 'notes'],
    pricing: 'freemium',
    featured: false,
    clickCount: 0,
    sortOrder: 30,
    isActive: true,
    ndnServiceTieIn: 'NDN Interpreter handles sign language translation with similar real-time AI',
  },
  {
    name: 'Notion',
    tagline: 'All-in-one workspace with AI',
    description: 'Notes, docs, wikis, and project management. Now with Notion AI for writing and summarization.',
    logoUrl: 'https://www.notion.so/front-static/favicon.ico',
    websiteUrl: 'https://www.notion.so',
    affiliateUrl: 'https://affiliate.notion.so/ndnanalytics',
    affiliateProgramUrl: 'https://affiliate.notion.so',
    affiliateProgram: 'impact',
    commissionRate: '50% first year',
    cookieDuration: 90,
    category: 'productivity',
    tags: ['productivity', 'docs', 'wiki', 'ai', 'project-management'],
    pricing: 'freemium',
    featured: true,
    clickCount: 0,
    sortOrder: 31,
    isActive: true,
    ndnServiceTieIn: 'We help teams structure Notion workspaces for AI and analytics workflows',
  },

  // ─── Dev Tools & Infrastructure ───
  {
    name: 'Vercel',
    tagline: 'Frontend cloud for developers',
    description: 'Deploy web applications with zero configuration. Automatic CI/CD, edge functions, and AI features.',
    logoUrl: 'https://vercel.com/favicon.ico',
    websiteUrl: 'https://vercel.com',
    affiliateUrl: 'https://vercel.com?ref=ndnanalytics',
    affiliateProgramUrl: 'https://vercel.com/partners',
    affiliateProgram: 'vercel',
    commissionRate: '15% recurring',
    cookieDuration: 30,
    category: 'dev_tools',
    tags: ['deployment', 'hosting', 'frontend', 'serverless'],
    pricing: 'freemium',
    featured: true,
    clickCount: 0,
    sortOrder: 40,
    isActive: true,
    ndnServiceTieIn: 'NDN Analytics builds production apps on Vercel — see NDN Demand IQ & NDN Care Predict',
  },
  {
    name: 'Supabase',
    tagline: 'Open source Firebase alternative',
    description: 'Postgres database, authentication, realtime subscriptions, and storage. Self-host or managed cloud.',
    logoUrl: 'https://supabase.com/favicon/favicon.ico',
    websiteUrl: 'https://supabase.com',
    affiliateUrl: 'https://supabase.com?ref=ndnanalytics',
    affiliateProgramUrl: 'https://supabase.com/partners',
    affiliateProgram: 'supabase',
    commissionRate: '15% recurring',
    cookieDuration: 60,
    category: 'infrastructure',
    tags: ['database', 'postgres', 'backend', 'auth', 'realtime'],
    pricing: 'freemium',
    featured: true,
    clickCount: 0,
    sortOrder: 41,
    isActive: true,
    ndnServiceTieIn: 'We architect Supabase backends for AI and blockchain applications',
  },

  // ─── LLM APIs (Core) ───
  {
    name: 'Claude (Anthropic)',
    tagline: 'Safe, helpful, and honest AI assistant',
    description: 'Claude excels at complex reasoning, coding, and analysis. The AI behind NDN Analytics products.',
    logoUrl: 'https://www.anthropic.com/images/icons/apple-touch-icon.png',
    websiteUrl: 'https://www.anthropic.com/claude',
    affiliateUrl: 'https://www.anthropic.com/claude',
    affiliateProgramUrl: 'https://www.anthropic.com/partners',
    affiliateProgram: 'anthropic',
    commissionRate: 'Revenue share',
    cookieDuration: 30,
    category: 'llm_api',
    tags: ['ai', 'llm', 'api', 'reasoning', 'coding'],
    pricing: 'paid',
    featured: true,
    clickCount: 0,
    sortOrder: 50,
    isActive: true,
    ndnServiceTieIn: 'NDN Analytics implements enterprise Claude solutions — explore our SpaceEngine products',
  },
  {
    name: 'OpenAI API',
    tagline: 'GPT models for every use case',
    description: 'Access GPT-4, GPT-4 Turbo, and embedding models via API. Industry-leading language models.',
    logoUrl: 'https://openai.com/favicon.ico',
    websiteUrl: 'https://platform.openai.com',
    affiliateUrl: 'https://platform.openai.com',
    affiliateProgramUrl: 'https://openai.com/form/partnerships',
    affiliateProgram: 'openai',
    commissionRate: 'Revenue share',
    cookieDuration: 30,
    category: 'llm_api',
    tags: ['ai', 'llm', 'api', 'gpt', 'openai'],
    pricing: 'paid',
    featured: false,
    clickCount: 0,
    sortOrder: 51,
    isActive: true,
    ndnServiceTieIn: 'We build custom GPT solutions for enterprise clients',
  },
];

async function seedNewsSources() {
  console.log('Seeding news sources...');
  const batch = db.batch();

  for (const source of NEWS_SOURCES) {
    const ref = db.collection('newsSources').doc();
    batch.set(ref, {
      ...source,
      lastFetchedAt: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log(`Seeded ${NEWS_SOURCES.length} news sources`);
}

async function seedAIProducts() {
  console.log('Seeding AI products...');
  const batch = db.batch();

  for (const product of AI_PRODUCTS) {
    const ref = db.collection('aiProducts').doc();
    batch.set(ref, {
      ...product,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log(`Seeded ${AI_PRODUCTS.length} AI products`);
}

async function main() {
  try {
    console.log('Starting seed...\n');

    await seedNewsSources();
    await seedAIProducts();

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

main();
